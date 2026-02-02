"use client";
import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    fetch("/api/admin/check").then((res) => {
      if (!res.ok) {
        window.location.href = "/menu";
      }
    });
  }, []);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Manage your pizza business 🍕</p>
      </div>

      {/* STATS */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h2>📦</h2>
          <p style={styles.statValue}>128</p>
          <span>Total Orders</span>
        </div>

        <div style={styles.statCard}>
          <h2>💰</h2>
          <p style={styles.statValue}>₹24,560</p>
          <span>Total Revenue</span>
        </div>

        <div style={styles.statCard}>
          <h2>🍕</h2>
          <p style={styles.statValue}>18</p>
          <span>Products</span>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={styles.section}>
        <h3>Quick Actions</h3>

        <div style={styles.actions}>
          <a href="/admin/orders" style={styles.actionCard}>
            📦 Manage Orders
          </a>

          <a href="/admin/products" style={styles.actionCard}>
            🍕 Manage Products
          </a>

          <a href="/admin/coupons" style={styles.actionCard}>
            🎟️ Manage Coupons
          </a>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   STYLES
================================ */
const styles = {
  page: {
    background: "#f4f6f8",
    minHeight: "100vh",
    padding: "40px",
  },

  header: {
    marginBottom: "30px",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },

  statCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "10px 0",
  },

  section: {
    background: "#fff",
    borderRadius: "14px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  actions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  actionCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderRadius: "12px",
    background: "#ff4d4f",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer",
  },
};
