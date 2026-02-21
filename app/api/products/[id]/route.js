import { NextResponse } from "next/server";
import db from "@/lib/db";

/* GET single product */
export async function GET(req, { params }) {
  const { id } = params;

  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

  if (!rows.length) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    product: rows[0],
  });
}

/* UPDATE product */
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const { name, description, price, category, image } = body;

  await db.query(
    "UPDATE products SET name=?, description=?, price=?, category=?, image=? WHERE id=?",
    [name, description, price, category, image, id],
  );

  return NextResponse.json({ success: true });
}
