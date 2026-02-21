"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminLogout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post("/api/admin/logout", {}, { withCredentials: true });
      } catch (err) {}

      router.replace("/auth/admin/login");
    };

    logout();
  }, [router]);

  return <p style={{ padding: 40 }}>Logging out...</p>;
}
