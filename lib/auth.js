import jwt from "jsonwebtoken";
import db from "./db";
import { cookies } from "next/headers";

export async function getUserFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.userId]
    );

    return rows[0] || null;
  } catch (err) {
    return null;
  }
}
