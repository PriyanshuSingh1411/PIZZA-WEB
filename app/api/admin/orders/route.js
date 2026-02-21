import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/* ===============================
   GET ALL ORDERS (ADMIN)
================================ */
export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const [orders] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC",
    );

    return NextResponse.json(orders);
  } catch (err) {
    console.error("ADMIN ORDERS GET ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ===============================
   UPDATE ORDER STATUS (ADMIN)
================================ */
export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id, status } = await req.json();

    const allowedStatuses = [
      "Placed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ORDER STATUS UPDATE ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
