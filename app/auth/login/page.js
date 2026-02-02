"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Login failed");
    } else {
      window.location.href = "/menu";
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🍕 Welcome Back</h1>
        <p style={styles.subtitle}>
          Login to continue ordering delicious pizza
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Don’t have an account?{" "}
          <span
            style={styles.link}
            onClick={() => router.push("/auth/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

/* ===============================
   STYLES
================================ */
const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: "url('/pizza-bg.jpg')",
    backgroundRepeat: "repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    // background: "rgba(255, 255, 255, 0.12)",
    // backdropFilter: "blur(14px)",
    // WebkitBackdropFilter: "blur(14px)",
    // padding: "35px",
    // width: "100%",
    // maxWidth: "420px",
    // borderRadius: "18px",
    // boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
    // border: "1px solid rgba(255,255,255,0.2)",
    // color: "#fff",
  },

  title: {
    textAlign: "center",
    marginBottom: "6px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#ff6a00",
  },

  subtitle: {
    textAlign: "center",
    color: "black",
    marginBottom: "26px",
    fontSize: "14px",
  },

  error: {
    background: "rgba(255, 80, 80, 0.15)",
    color: "#ffb3b3",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "14px",
    border: "1px solid rgba(255,80,80,0.3)",
  },

  inputGroup: {
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.85)",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #ffd3b6",
    fontSize: "15px",
    outline: "none",
    transition: "0.2s",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #ff9a3c, #ff6a00)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(255,106,0,0.35)",
  },

  footer: {
    textAlign: "center",
    marginTop: "22px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.8)",
  },

  link: {
    color: "#ff6a00",
    fontWeight: "600",
    cursor: "pointer",
  },
};
