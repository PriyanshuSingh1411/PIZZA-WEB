import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  const rawBody = await buffer(req.body);
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature failed", err.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // ✅ PAYMENT SUCCESS EVENT
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await db.query(
      `UPDATE orders
     SET payment_status='Paid'
     WHERE stripe_session_id = ?`,
      [session.id],
    );
  }

  return NextResponse.json({ received: true });
}
