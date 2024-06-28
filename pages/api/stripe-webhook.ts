import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// 型宣言をインポート
import type { IncomingMessage } from 'http';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // APIバージョンを更新
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Firebase Admin SDKの初期化
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      console.error('Webhook signature verification failed with an unknown error.');
      return res.status(400).send('Webhook Error: Unknown error');
    }

    console.log('Received webhook event:', event); // ウェブフックイベントをログに出力
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // ユーザー情報をデータベースに保存
      const userId = session.client_reference_id;
      const subscriptionId = session.subscription;

      if (userId && subscriptionId) {
        const db = admin.firestore();
        await db.collection('users').doc(userId).set({
          subscriptionId,
          plan: (session.line_items?.data[0] as Stripe.LineItem)?.price?.id, // line_itemsをdata配列にアクセス
          status: 'active',
        }, { merge: true });
      }
    } else if (
      event.type === 'customer.subscription.deleted' ||
      event.type === 'customer.subscription.updated'
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.userId;

      if (userId) {
        const db = admin.firestore();
        const status = subscription.status === 'active' ? 'active' : 'inactive';
        await db.collection('users').doc(userId).set({
          status,
        }, { merge: true });
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default webhookHandler;