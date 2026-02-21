"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/admin/login", form, {
        withCredentials: true,
      });

      router.push("/admin/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <form style={card} onSubmit={handleLogin}>
        <div style={header}>
          <h2 style={title}>Admin Panel</h2>
          <p style={subtitle}>Sign in to continue</p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={inputGroup}>
          <label style={label}>Email</label>
          <input
            type="email"
            required
            placeholder="admin@example.com"
            style={input}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div style={inputGroup}>
          <label style={label}>Password</label>
          <input
            type="password"
            required
            placeholder="Enter your password"
            style={input}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          style={{
            ...button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        <p style={registerText}>
          Don't have an account?{" "}
          <span
            style={registerLink}
            onClick={() => router.push("/admin/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #1e293b, #0f172a)",
};

const card = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  padding: "40px",
  borderRadius: "14px",
  width: "350px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
};

const header = {
  textAlign: "center",
  marginBottom: "10px",
};

const title = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "600",
  color: "#111827",
};

const subtitle = {
  margin: 0,
  fontSize: "14px",
  color: "#6b7280",
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const label = {
  fontSize: "13px",
  fontWeight: "500",
  color: "#374151",
};

const input = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  outline: "none",
  color: "black",
};

const button = {
  marginTop: "10px",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  transition: "0.3s",
};
const registerText = {
  fontSize: "13px",
  textAlign: "center",
  marginTop: "8px",
};
const registerLink = {
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: "500",
};
const errorStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "10px",
  borderRadius: "8px",
  fontSize: "13px",
  textAlign: "center",
};
