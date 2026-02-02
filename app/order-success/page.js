"use client";

import { useEffect } from "react";

export default function OrderSuccess() {
  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return <h2>Payment Successful 🎉</h2>;
}
