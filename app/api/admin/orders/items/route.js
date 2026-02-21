import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json([], { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "admin") {
      return NextResponse.json([], { status: 403 });
    }

    const { orderId } = await req.json();

    const [items] = await db.query(
      `SELECT 
         oi.quantity,
         oi.price,
         p.name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId],
    );

    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}
