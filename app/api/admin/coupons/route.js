import db from "@/lib/db";

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return false;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  return user.role === "admin";
}

export async function GET(req) {
  if (!(await isAdmin())) {
    return NextResponse.json([], { status: 403 });
  }

  const [rows] = await db.query("SELECT * FROM coupons ORDER BY id DESC");
  return NextResponse.json(rows);
}

export async function POST(req) {
  if (!(await isAdmin())) {
    return NextResponse.json({}, { status: 403 });
  }

  const { code, type, value, min_order, expiry } = await req.json();

  // Set default status to 'active' when creating new coupon
  await db.query(
    `INSERT INTO coupons (code, type, value, min_order, expiry, status)
     VALUES (?, ?, ?, ?, ?, 'active')`,
    [
      code.toUpperCase(),
      type,
      Number(value),
      Number(min_order) || 0,
      expiry || null,
    ],
  );

  return NextResponse.json({ message: "Coupon added" });
}

export async function PUT(req) {
  if (!(await isAdmin())) {
    return NextResponse.json({}, { status: 403 });
  }

  const { id, status } = await req.json();

  await db.query("UPDATE coupons SET status=? WHERE id=?", [status, id]);

  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req) {
  if (!(await isAdmin())) {
    return NextResponse.json({}, { status: 403 });
  }

  const { id } = await req.json();

  await db.query("DELETE FROM coupons WHERE id=?", [id]);

  return NextResponse.json({ message: "Deleted" });
}
