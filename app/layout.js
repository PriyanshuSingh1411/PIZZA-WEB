"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth/admin") ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  return (
    <html lang="en">
      <body>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        {!hideNavbar && <Navbar />}
        {children}
        {!hideNavbar && <Chatbot />}
      </body>
    </html>
  );
}
