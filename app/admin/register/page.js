"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminRegister() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("/api/admin/register", form);

      setSuccess("Admin registered successfully!");
      setTimeout(() => {
        router.push("/auth/admin/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <form style={card} onSubmit={handleRegister}>
        <div style={header}>
          <h2 style={title}>Create Admin Account</h2>
          <p style={subtitle}>Register to manage your store</p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        <div style={inputGroup}>
          <label style={label}>Full Name</label>
          <input
            required
            type="text"
            placeholder="John Doe"
            style={input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div style={inputGroup}>
          <label style={label}>Email</label>
          <input
            required
            type="email"
            placeholder="admin@example.com"
            style={input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div style={inputGroup}>
          <label style={label}>Password</label>
          <input
            required
            type="password"
            placeholder="Enter a secure password"
            style={input}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p style={loginText}>
          Already have an account?{" "}
          <span
            style={loginLink}
            onClick={() => router.push("/auth/admin/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #1e293b, #0f172a)",
};

const card = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "40px",
  borderRadius: "14px",
  width: "360px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
};

const header = {
  textAlign: "center",
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

const errorStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "10px",
  borderRadius: "8px",
  fontSize: "13px",
  textAlign: "center",
};

const successStyle = {
  background: "#dcfce7",
  color: "#166534",
  padding: "10px",
  borderRadius: "8px",
  fontSize: "13px",
  textAlign: "center",
};

const loginText = {
  fontSize: "13px",
  textAlign: "center",
  marginTop: "8px",
};

const loginLink = {
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: "500",
};
