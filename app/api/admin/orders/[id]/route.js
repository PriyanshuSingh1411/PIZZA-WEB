import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function DELETE(req) {
  try {
    // ✅ Get ID from URL directly
    const { pathname } = new URL(req.url);
    const orderId = pathname.split("/").pop();

    console.log("Deleting order:", orderId);

    if (!orderId) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Delete order items first
    await db.query("DELETE FROM order_items WHERE order_id = ?", [orderId]);

    const [result] = await db.query("DELETE FROM orders WHERE id = ?", [
      orderId,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
