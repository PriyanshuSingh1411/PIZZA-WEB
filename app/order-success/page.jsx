"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (sessionId) {
      axios.post("/api/orders/confirm", { sessionId });
      localStorage.removeItem("cart");
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your order has been confirmed and is
          being processed.
        </p>

        <div className="border-t pt-4 text-sm text-gray-500">
          You’ll receive a confirmation email shortly.
        </div>

        <button
          onClick={() => (window.location.href = "/menu")}
          className="mt-6 w-full rounded-lg bg-black text-white py-3 font-medium hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
