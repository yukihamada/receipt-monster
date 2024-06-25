import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { getApps } from 'firebase-admin/app'; // 修正: 'firebase-admin/app' から 'getApps' をインポート
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import Stripe from 'stripe'; // 修正: 'stripe' モジュールの型宣言をインポート
import { Stripe as StripeType } from 'stripe'; // 追加: 型宣言のインポート

const stripe: StripeType = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // 修正: APIバージョンを更新
});

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { token } = req.body;

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    const customerId = userDoc.data()?.stripeCustomerId;

    if (!customerId) {
      res.status(400).json({ error: 'Stripe customer ID not found' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: 'your-price-id',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: '/success',
      cancel_url: '/cancel',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error: any) { // 修正: 'error' の型を 'any' に指定
    res.status(500).json({ error: (error as Error).message }); // 修正: 'error' を 'Error' 型にキャスト
  }
}