import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import Stripe from 'stripe';
import { Stripe as StripeType } from 'stripe';

const stripe: StripeType = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
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
          price: 'prod_QMR42USorUmxNS',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: '/success',
      cancel_url: '/cancel',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error: any) {
    console.error('エラー詳細:', error); // エラーログを追加
    res.status(500).json({ error: (error as Error).message });
  }
}