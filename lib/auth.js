import jwt from "jsonwebtoken";
import db from "./db";
import { cookies } from "next/headers";

// Get user from regular token (for user-side)
export async function getUserFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.userId],
    );

    return rows[0] || null;
  } catch (err) {
    return null;
  }
}

// Get admin from admin_token (for admin-side)
export async function getAdminFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ? AND role = 'admin'",
      [decoded.userId],
    );

    return rows[0] || null;
  } catch (err) {
    return null;
  }
}
