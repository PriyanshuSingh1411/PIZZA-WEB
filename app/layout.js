"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        {!isAdmin && <Navbar />}
        {children}
      </body>
    </html>
  );
}
