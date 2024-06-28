import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

  if (adminEmails.includes(email)) {
    res.status(200).json({ isAdmin: true });
  } else {
    res.status(403).json({ isAdmin: false });
  }
}