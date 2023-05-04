import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getSession(req, res);
  const user = session?.user;
  if (!user) {
    res.status(401);
    return;
  }

  const client = await clientPromise;
  const db = client.db('BlogStandard');
  const userProfile = await db.collection('users').updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: 10,
      },
      $setOnInsert: {
        auth0Id: user.sub,
      },
    },
    { upsert: true },
  );

  res.status(200).json({ name: 'John Doe' });
}
