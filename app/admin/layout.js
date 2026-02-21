import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

/* ===============================
   ADMIN LAYOUT (SERVER PROTECTED)
================================ */
export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const pathname = headersList.get("x-next-url") || "";

  const token = cookieStore.get("token")?.value;

  // if (!token) {
  //   redirect("/admin/login");
  // }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "admin") {
      redirect("/");
    }
  } catch (err) {
    // redirect("/admin/login");
  }

  // Check if we're on the register or login page - no sidebar for auth pages
  const isAuthPage =
    pathname.includes("/register") || pathname.includes("/login");

  return (
    <div style={isAuthPage ? styles.fullPage : styles.wrapper}>
      {/* SIDEBAR - Only show if not on auth pages */}
      {!isAuthPage && (
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
            <a href="/admin/logout" style={{ textDecoration: "none" }}>
              <button style={styles.logoutBtn}>🚪 Logout</button>
            </a>
          </nav>

          {/* LOGOUT FORM */}

          <div style={styles.footer}>
            <small>© 2026 Pizza App</small>
          </div>
        </aside>
      )}

      {/* CONTENT */}
      <main style={isAuthPage ? styles.fullContent : styles.content}>
        {children}
      </main>
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

  fullPage: {
    minHeight: "100vh",
    background: "#f3f4f6",
    color: "#111827",
  },

  fullContent: {
    width: "100%",
    padding: "30px",
    background: "#f9fafb",
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
    background: "transparent",
  },

  content: {
    flex: 1,
    padding: "30px",
    background: "#f9fafb",
  },

  logoutBtn: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  footer: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "12px",
    fontSize: "12px",
    color: "#9ca3af",
    textAlign: "center",
  },
};
