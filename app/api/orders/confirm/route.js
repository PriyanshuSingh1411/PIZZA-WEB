import Stripe from "stripe";
import db from "@/lib/db";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { sessionId } = await req.json();

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    await db.query(
      `UPDATE orders 
       SET payment_status='Paid', stripe_session_id=? 
       WHERE stripe_session_id IS NULL`,
      [sessionId],
    );
  }

  return NextResponse.json({ success: true });
}
