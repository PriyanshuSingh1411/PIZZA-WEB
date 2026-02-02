"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Registration failed");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🍕 Create Account</h1>
        <p style={styles.subtitle}>
          Join us and start ordering delicious pizza
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button style={styles.button} disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <a href="/auth/login" style={styles.link}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

/* ===============================
   STYLES (MATCHES LOGIN)
================================ */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ff7a18, #ff3d00)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },

  card: {
    background: "#fff",
    padding: "30px",
    width: "100%",
    maxWidth: "420px",
    borderRadius: "12px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
  },

  title: {
    textAlign: "center",
    marginBottom: "5px",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "25px",
    fontSize: "14px",
  },

  error: {
    background: "#ffe5e5",
    color: "#d8000c",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px",
  },

  inputGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#ff3d00",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },

  footer: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
  },

  link: {
    color: "#ff3d00",
    textDecoration: "none",
    fontWeight: "600",
  },
};
