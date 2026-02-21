import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Summary counts
    const [[usersCount]] = await db.query(
      "SELECT COUNT(*) as total FROM users WHERE role='user'",
    );
    const [[ordersCount]] = await db.query(
      "SELECT COUNT(*) as total FROM orders",
    );
    const [[productsCount]] = await db.query(
      "SELECT COUNT(*) as total FROM products",
    );
    const [[revenue]] = await db.query(
      "SELECT SUM(total) as total FROM orders WHERE status='Delivered'",
    );

    // Detailed lists
    const [users] = await db.query(
      "SELECT id, name, email FROM users WHERE role='user'",
    );

    const [orders] = await db.query(
      "SELECT id, user_id, total, status, created_at FROM orders ORDER BY created_at DESC",
    );

    const [products] = await db.query("SELECT id, name, price FROM products");

    const [deliveredOrders] = await db.query(
      "SELECT id, total, created_at FROM orders WHERE status='Delivered'",
    );

    return NextResponse.json({
      summary: {
        totalUsers: usersCount.total,
        totalOrders: ordersCount.total,
        totalProducts: productsCount.total,
        totalRevenue: revenue.total || 0,
      },
      details: {
        users,
        orders,
        products,
        revenue: deliveredOrders,
      },
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
