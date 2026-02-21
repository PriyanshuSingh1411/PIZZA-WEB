import { NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/* ===============================
   GET SINGLE PRODUCT
================================ */
export async function GET(req, context) {
  try {
    const { id } = await context.params;

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
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

/* ===============================
   UPDATE PRODUCT (WITH IMAGE)
================================ */
export async function PUT(req, context) {
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

    const { id } = await context.params;
    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const image = formData.get("image"); // File | null

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: "Name and price required" },
        { status: 400 },
      );
    }

    let imageUrl = null;

    /* IMAGE HANDLING */
    if (image && typeof image === "object" && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(uploadDir, filename);

      await fs.writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    /* UPDATE QUERY */
    if (imageUrl) {
      await db.query(
        `UPDATE products
         SET name=?, description=?, price=?, category=?, image=?
         WHERE id=?`,
        [name, description, price, category, imageUrl, id],
      );
    } else {
      await db.query(
        `UPDATE products
         SET name=?, description=?, price=?, category=?
         WHERE id=?`,
        [name, description, price, category, id],
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

/* ===============================
   DELETE PRODUCT
================================ */
export async function DELETE(req, context) {
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

    const { id } = await context.params;

    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
