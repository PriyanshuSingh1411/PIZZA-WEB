import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // expire immediately
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("ADMIN LOGOUT ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
