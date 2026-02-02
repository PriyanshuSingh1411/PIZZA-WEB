import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic"; // 🔥 disables caching

export async function GET() {
  const [rows] = await db.query(
    "SELECT id, name, description, price, image FROM products ORDER BY id DESC"
  );

  return NextResponse.json({
    success: true,
    products: rows,
  });
}
