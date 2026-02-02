"use client";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html>
      <body style={{ margin: 0 }}>
        {!isAdmin && <Navbar />}
        {children}
      </body>
    </html>
  );
}
