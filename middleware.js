import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const middleware = async (req) => {
  const token = req.cookies.get("token")?.value;
  // const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  // const { user } = await jwtVerify(token, secret);
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/menu", "/cart", "/checkout", "/orders", "/admin"];

  if (protectedRoutes.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/menu/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/admin/:path*",
  ],
};
