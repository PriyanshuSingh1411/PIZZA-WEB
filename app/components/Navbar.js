"use client";
import { useEffect, useRef, useState } from "react";
import { getCart } from "@/lib/cart";

export default function Navbar() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();
      const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
      setCount(totalQty);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  };

  return (
    <nav style={styles.nav}>
      <a href="/" style={styles.logo}>
        <span style={styles.logoIcon}>🍕</span>
        <span style={styles.logoText}>Pizza App</span>
      </a>

      <div style={styles.right}>
        <a href="/menu" style={styles.link}>
          <span style={styles.linkIcon}>📋</span>
          Menu
        </a>

        <a href="/orders" style={styles.link}>
          <span style={styles.linkIcon}>📦</span>
          My Orders
        </a>

        <a href="/cart" style={styles.cartLink}>
          <span style={styles.cartIcon}>🛒</span>
          Cart
          {count > 0 && (
            <span style={styles.badge}>{count > 99 ? "99+" : count}</span>
          )}
        </a>

        {/* PROFILE DROPDOWN */}
        <div style={styles.profileWrap} ref={dropdownRef}>
          <div
            style={{ ...styles.avatar, ...(open ? styles.avatarActive : {}) }}
            onClick={() => setOpen(!open)}
          >
            👤
          </div>

          {open && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <span style={styles.dropdownAvatar}>👤</span>
                <div>
                  <p style={styles.dropdownName}>User</p>
                  <p style={styles.dropdownEmail}>user@pizza.com</p>
                </div>
              </div>
              <hr style={styles.divider} />
              <a href="/profile" style={styles.dropdownItem}>
                <span>👤</span> My Profile
              </a>
              <a href="/settings" style={styles.dropdownItem}>
                <span>⚙️</span> Settings
              </a>
              <a href="/orders" style={styles.dropdownItem}>
                <span>📦</span> My Orders
              </a>
              <hr style={styles.divider} />
              <div
                style={{ ...styles.dropdownItem, color: "#ff4d4f" }}
                onClick={logout}
              >
                <span>🚪</span> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ===============================
   STYLES
================================ */
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 40px",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    borderBottom: "1px solid #e9ecef",
    boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    transition: "transform 0.2s ease",
  },

  logoIcon: {
    fontSize: "28px",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
  },

  logoText: {
    margin: 0,
    color: "#1a1a2e",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    color: "#495057",
    fontWeight: "500",
    fontSize: "14px",
    padding: "10px 16px",
    borderRadius: "10px",
    transition: "all 0.25s ease",
    position: "relative",
  },

  linkIcon: {
    fontSize: "16px",
  },

  cartLink: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    color: "#495057",
    fontWeight: "500",
    fontSize: "14px",
    padding: "10px 16px",
    borderRadius: "10px",
    transition: "all 0.25s ease",
    position: "relative",
    marginLeft: "8px",
  },

  cartIcon: {
    fontSize: "18px",
  },

  badge: {
    background: "linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)",
    color: "#fff",
    borderRadius: "20px",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: "600",
    marginLeft: "6px",
    minWidth: "20px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(255, 71, 87, 0.4)",
  },

  profileWrap: {
    position: "relative",
    marginLeft: "8px",
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "20px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },

  avatarActive: {
    transform: "scale(1.05)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: "55px",
    background: "#fff",
    borderRadius: "16px",
    width: "220px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    padding: "0",
    color: "#333",
    overflow: "hidden",
    animation: "dropdownFadeIn 0.2s ease",
    border: "1px solid #e9ecef",
  },

  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
  },

  dropdownAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  dropdownName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a2e",
  },

  dropdownEmail: {
    margin: 0,
    fontSize: "12px",
    color: "#6c757d",
  },

  divider: {
    border: "none",
    borderTop: "1px solid #e9ecef",
    margin: "0",
  },

  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "0",
    textDecoration: "none",
    color: "#495057",
    transition: "all 0.2s ease",
  },
};
