"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "priyanshu123@gmail.com",
    password: "12345678",
  });
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
      <div style={styles.overlay}>
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
    </div>
  );
}

/* ===============================
   ELEGANT STYLES
================================ */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    backgroundImage: "url('/pizza-bg1.jpg')",
    backgroundSize: "cover", // 🔥 Fill full screen
    backgroundPosition: "center", // Keep image centered
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    width: "100%",
    height: "100%",
    // background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  card: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    transition: "0.3s ease",
  },

  title: {
    textAlign: "center",
    marginBottom: "8px",
    fontSize: "30px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.75)",
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
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.8)",
  },

  input: {
    padding: "13px 15px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.25s ease",
  },

  button: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #ff9a3c, #ff6a00)",
    color: "#fff",
    border: "none",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s ease",
    boxShadow: "0 15px 35px rgba(255,106,0,0.4)",
  },

  footer: {
    textAlign: "center",
    marginTop: "25px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.75)",
  },

  link: {
    color: "#ff9a3c",
    fontWeight: "600",
    cursor: "pointer",
  },
};
