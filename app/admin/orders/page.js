"use client";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  /* ================= LOAD ORDERS ================= */

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders", {
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      alert("Not authorized");
      window.location.href = "/auth/admin/login";
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= CHANGE STATUS ================= */

  const changeStatus = async (id, status) => {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, status }),
    });

    loadOrders();
  };

  /* ================= VIEW DETAILS ================= */

  const viewDetails = async (orderId) => {
    setActiveOrder(orderId);

    const res = await fetch("/api/admin/orders/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();
    setItems(data);
    setShowModal(true);
  };

  /* ================= DELETE ORDER ================= */

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to permanently delete this order?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        alert("Failed to delete order");
        return;
      }

      // Remove instantly from UI
      setOrders((prev) => prev.filter((order) => order.id !== id));

      alert("Order deleted successfully");
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Something went wrong");
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return <p style={{ padding: 40 }}>Loading orders...</p>;
  }

  /* ================= UI ================= */

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Order Management</h1>
          <p style={styles.subtitle}>
            View, update, track and manage customer orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No orders found.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {orders.map((order) => (
              <div key={order.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.orderId}>Order #{order.id}</h3>
                    <p style={styles.total}>₹{order.total}</p>
                  </div>

                  <span style={statusBadge(order.status)}>{order.status}</span>
                </div>

                <div style={styles.actions}>
                  <select
                    value={order.status}
                    onChange={(e) => changeStatus(order.id, e.target.value)}
                    style={styles.select}
                  >
                    <option>Placed</option>
                    <option>Preparing</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                  <button
                    style={styles.primaryBtn}
                    onClick={() => viewDetails(order.id)}
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(order.id)}
                    style={styles.dangerBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Order #{activeOrder}</h2>
              <button
                onClick={() => setShowModal(false)}
                style={styles.closeIcon}
              >
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <p style={{ padding: "10px 0" }}>No items found.</p>
            ) : (
              items.map((item, i) => (
                <div key={i} style={styles.itemRow}>
                  <div>
                    <strong>{item.name}</strong>
                    <p style={styles.itemMeta}>
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <span style={styles.itemTotal}>
                    ₹{item.quantity * item.price}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    background: "#f9fafb",
    minHeight: "100vh",
    padding: "40px 20px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "40px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "6px",
  },

  subtitle: {
    color: "#6b7280",
  },

  emptyState: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    transition: "0.2s ease",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  orderId: {
    margin: 0,
    fontSize: "18px",
  },

  total: {
    color: "#6b7280",
    marginTop: "4px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  select: {
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    fontSize: "14px",
  },

  primaryBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  dangerBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    width: "480px",
    maxHeight: "80vh",
    overflowY: "auto",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  closeIcon: {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },

  itemMeta: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
  },

  itemTotal: {
    fontWeight: "600",
  },
};

const statusBadge = (status) => ({
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  background:
    status === "Delivered"
      ? "#d4edda"
      : status === "Out for Delivery"
        ? "#cce5ff"
        : status === "Preparing"
          ? "#fff3cd"
          : "#f8d7da",
  color:
    status === "Delivered"
      ? "#155724"
      : status === "Out for Delivery"
        ? "#004085"
        : status === "Preparing"
          ? "#856404"
          : "#721c24",
});
