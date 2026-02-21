import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/* ===============================
   GET USER ORDERS
================================ */
export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json([], { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    // 🔒 SAFETY: prevent user_id = NULL bugs
    if (!user.userId) {
      return NextResponse.json([], { status: 401 });
    }

    const userId = user.userId;

    const [orders] = await db.query(
      `
      SELECT id, total, status, created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId],
    );

    if (!orders.length) {
      return NextResponse.json([]);
    }

    const orderIds = orders.map((o) => o.id);

    const [items] = await db.query(
      `
      SELECT
        oi.order_id,
        oi.quantity,
        oi.price,
        p.name,
        p.description,
        p.image
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id IN (?)
      `,
      [orderIds],
    );

    const result = orders.map((order) => ({
      ...order,
      items: items.filter((i) => i.order_id === order.id),
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}

/* ===============================
   PLACE ORDER
================================ */
export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    // 🔒 CRITICAL FIX
    if (!user.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid user" },
        { status: 401 },
      );
    }

    const userId = user.userId;
    const { cart } = await req.json();

    // ❌ FIXED cart validation
    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 },
      );
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    /* CREATE ORDER */
    const [orderRes] = await db.query(
      "INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)",
      [userId, total, "Placed"],
    );

    const orderId = orderRes.insertId;

    /* INSERT ORDER ITEMS */
    const values = cart.map((item) => [orderId, item.id, item.qty, item.price]);

    await db.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
      [values],
    );

    return NextResponse.json({
      success: true,
      orderId,
      total,
    });
  } catch (err) {
    console.error("PLACE ORDER ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
