"use client";

export default function AdminLayout({ children }) {
  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          🍕 <span>Pizza Admin</span>
        </div>

        <nav style={styles.nav}>
          <a href="/admin" style={styles.link}>
            📊 Dashboard
          </a>
          <a href="/admin/products" style={styles.link}>
            🍕 Products
          </a>
          <a href="/admin/orders" style={styles.link}>
            📦 Orders
          </a>
          <a href="/admin/coupons" style={styles.link}>
            🎟️ Coupons
          </a>
        </nav>

        <div style={styles.footer}>
          <small>© 2026 Pizza App</small>
        </div>
      </aside>

      {/* CONTENT */}
      <main style={styles.content}>{children}</main>
    </div>
  );
}

/* ===============================
   STYLES
================================ */
const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f3f4f6",
    color: "#111827",
  },

  sidebar: {
    width: 240,
    background: "linear-gradient(180deg, #111827, #1f2937)",
    color: "#fff",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "40px",
    color: "#ff4d4f",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  nav: {
    flex: 1,
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    marginBottom: "10px",
    borderRadius: "10px",
    color: "#e5e7eb",
    textDecoration: "none",
    fontWeight: "500",
    transition: "all 0.2s ease",
    background: "transparent",
  },

  content: {
    flex: 1,
    padding: "30px",
    background: "#f9fafb",
  },

  footer: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "12px",
    fontSize: "12px",
    color: "#9ca3af",
    textAlign: "center",
  },
};
