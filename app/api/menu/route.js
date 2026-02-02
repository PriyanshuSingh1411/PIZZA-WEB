import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT id, name, description, price, image FROM products ORDER BY id DESC"
    );

    return NextResponse.json({
      success: true,
      total: rows.length,
      products: rows,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to load menu" },
      { status: 500 }
    );
  }
}
