"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function OrderSuccess() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (sessionId) {
      axios.post("/api/orders/confirm", { sessionId });
      localStorage.removeItem("cart");
    }
  }, [sessionId]);

  return <h2>Payment Successful 🎉</h2>;
}
