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
    <div style={styles.nav}>
      <h2 style={styles.logo}>🍕 Pizza App</h2>

      <div style={styles.right}>
        <a href="/menu" style={styles.link}>
          Menu
        </a>

        <a href="/orders" style={styles.link}>
          My Orders
        </a>

        <a href="/cart" style={styles.link}>
          Cart <span style={styles.badge}>{count}</span>
        </a>

        {/* PROFILE DROPDOWN */}
        <div style={styles.profileWrap} ref={dropdownRef}>
          <div style={styles.avatar} onClick={() => setOpen(!open)}>
            👤
          </div>

          {open && (
            <div style={styles.dropdown}>
              <p style={styles.dropdownItem}>My Profile</p>
              <p style={styles.dropdownItem}>Settings</p>
              <hr style={{ margin: "6px 0" }} />
              <p
                style={{ ...styles.dropdownItem, color: "#ff4d4f" }}
                onClick={logout}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
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
    padding: "15px 30px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  logo: {
    margin: 0,
    color: "#ff4d4f",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },

  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  },

  badge: {
    background: "#ff4d4f",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 8px",
    fontSize: "12px",
    marginLeft: "6px",
  },

  profileWrap: {
    position: "relative",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#ff4d4f",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: "45px",
    background: "#fff",
    borderRadius: "10px",
    width: "160px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    padding: "8px",
    color: "black",
  },

  dropdownItem: {
    padding: "8px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "6px",
  },
};
