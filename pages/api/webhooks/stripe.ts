import Cors from 'micro-cors';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Stripe } from 'stripe';
import ReadableStream = NodeJS.ReadableStream;
import clientPromise from '../../../lib/mongodb';
import { RequestHandler } from 'micro';

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    let event;
    try {
      event = await verifyStripe(req);
    } catch (e) {
      console.log('ERROR: ', e);
    }

    switch (event?.type) {
      case 'payment_intent.succeeded': {
        const client = await clientPromise;
        const db = client.db('BlogStandard');
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const auth0Id = paymentIntent.metadata.sub;

        await db.collection('users').updateOne(
          {
            auth0Id,
          },
          {
            $inc: {
              availableTokens: 10,
            },
            $setOnInsert: {
              auth0Id,
            },
          },
          { upsert: true },
        );
        break;
      }
      default:
        console.log('UNHANDLED EVENT: ', event?.type);
    }
    res.status(200).json({ received: true });
  }
};

export default cors(handler as RequestHandler);

const verifyStripe = async (req: NextApiRequest) => {
  async function buffer(readable: ReadableStream) {
    const chunks = [];
    for await (const chunk of readable) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] || '';

  return stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
};
