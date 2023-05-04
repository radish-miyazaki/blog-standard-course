import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

type Data = {
  session: Stripe.Response<Stripe.Checkout.Session>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getSession(req, res);
  const user = session?.user;
  if (!user) {
    res.status(401);
    return;
  }

  const lineItems = [
    {
      price: process.env.STRIPE_PRODUCT_PRICE_ID,
      quantity: 1,
    },
  ];

  const protocol = process.env.NODE_ENV === 'development' ? 'http://' : 'https://';
  const host = req.headers.host;

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: `${protocol}${host}/post/new`,
    payment_intent_data: {
      metadata: {
        sub: user.sub,
      },
    },
  });

  res.status(200).json({ session: checkoutSession });
}
