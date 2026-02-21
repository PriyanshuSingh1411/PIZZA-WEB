import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Always allow login pages
  if (pathname.startsWith("/auth/login")) {
    return NextResponse.next();
  }

  // Protected routes
  const protectedRoutes = ["/menu", "/cart", "/checkout", "/orders"];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/menu/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/auth/login",
  ],
};
