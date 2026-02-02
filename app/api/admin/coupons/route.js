import db from "@/lib/db";

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

function isAdmin(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return false;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  return user.role === "admin";
}

export async function GET(req) {
  if (!isAdmin(req)) {
    return NextResponse.json([], { status: 403 });
  }

  const [rows] = await db.query("SELECT * FROM coupons ORDER BY id DESC");
  return NextResponse.json(rows);
}

export async function POST(req) {
  if (!isAdmin(req)) {
    return NextResponse.json({}, { status: 403 });
  }

  const { code, type, value, min_order, expiry } = await req.json();

  await db.query(
    `INSERT INTO coupons (code, type, value, min_order, expiry)
     VALUES (?, ?, ?, ?, ?)`,
    [code, type, value, min_order || 0, expiry || null]
  );

  return NextResponse.json({ message: "Coupon added" });
}

export async function PUT(req) {
  if (!isAdmin(req)) {
    return NextResponse.json({}, { status: 403 });
  }

  const { id, status } = await req.json();

  await db.query("UPDATE coupons SET status=? WHERE id=?", [status, id]);

  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req) {
  if (!isAdmin(req)) {
    return NextResponse.json({}, { status: 403 });
  }

  const { id } = await req.json();

  await db.query("DELETE FROM coupons WHERE id=?", [id]);

  return NextResponse.json({ message: "Deleted" });
}
