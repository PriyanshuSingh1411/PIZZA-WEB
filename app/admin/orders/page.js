"use client";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const STEPS = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Not authorized");
        window.location.href = "/menu";
      });
  }, []);

  const changeStatus = async (id, status) => {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
  };

  const viewDetails = async (orderId) => {
    setActiveOrder(orderId);

    const res = await fetch("/api/admin/orders/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();
    setItems(data);
    setShowModal(true);
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Loading orders...</p>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>📦 Manage Orders</h1>
      <p style={styles.subheading}>View, update, and track customer orders</p>

      <div style={styles.grid}>
        {orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <div style={styles.row}>
              <div>
                <h3>Order #{order.id}</h3>
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
              </select>

              <button
                style={styles.viewBtn}
                onClick={() => viewDetails(order.id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Order #{activeOrder}</h2>

            {items.length === 0 ? (
              <p>No items found.</p>
            ) : (
              items.map((item, i) => (
                <div key={i} style={styles.item}>
                  <strong>{item.name}</strong>
                  <span>
                    {item.quantity} × ₹{item.price}
                  </span>
                </div>
              ))
            )}

            <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      {/* ================= END MODAL ================= */}
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

  heading: {
    marginBottom: "5px",
  },

  subheading: {
    color: "#666",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  total: {
    color: "#555",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
  },

  select: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    cursor: "pointer",
  },

  viewBtn: {
    background: "#ff4d4f",
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
    borderRadius: "14px",
    padding: "20px",
    width: "420px",
    maxHeight: "80vh",
    overflowY: "auto",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    padding: "10px 0",
  },

  closeBtn: {
    marginTop: "15px",
    background: "#333",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
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
