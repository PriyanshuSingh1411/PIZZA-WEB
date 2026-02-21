import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
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

    const body = await req.json();
    const { name, description, price, category, image } = body;

    if (!name || !price || !image) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    await db.query(
      `INSERT INTO products (name, description, price, category, image)
       VALUES (?, ?, ?, ?, ?)`,
      [name, description || null, Number(price), category || null, image],
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
