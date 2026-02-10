"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

const STEPS = [
  { key: "Placed", label: "Order Placed", icon: "📦" },
  { key: "Preparing", label: "Preparing Food", icon: "🍳" },
  { key: "Out for Delivery", label: "Out for Delivery", icon: "🛵" },
  { key: "Delivered", label: "Delivered", icon: "✅" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await fetch("/api/orders", { credentials: "include" });
    if (!res.ok) return setOrders([]);
    setOrders(await res.json());
  };

  useEffect(() => {
    loadOrders();
    const i = setInterval(loadOrders, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={page}>
      <h1 style={title}>📦 My Orders</h1>
      <p style={subtitle}>Track your food in real time</p>

      {orders.length === 0 ? (
        <p style={empty}>You haven’t placed any orders yet.</p>
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}

/* ===============================
   ORDER CARD
================================ */
function OrderCard({ order }) {
  const currentIndex = STEPS.findIndex((s) => s.key === order.status);

  /* DOWNLOAD INVOICE */
  const downloadInvoice = () => {
    const doc = new jsPDF();

    /* HEADER */
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Pizza Shop", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("INVOICE", 105, 28, { align: "center" });
    doc.line(20, 34, 190, 34);

    /* ORDER INFO */
    doc.setFontSize(11);
    doc.text(`Order ID: #${order.id}`, 20, 44);
    doc.text(`Status: ${order.status}`, 20, 52);
    doc.text(
      `Date: ${new Date(order.created_at || Date.now()).toLocaleString()}`,
      20,
      60,
    );

    /* TABLE HEADER */
    let y = 78;
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 6, 170, 10, "F");

    doc.text("Item", 22, y);
    doc.text("Qty", 120, y);
    doc.text("Price", 150, y);

    doc.setFont("helvetica", "normal");
    y += 10;

    /* ITEMS */
    order.items?.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.name}`, 22, y);
      doc.text(String(item.quantity), 122, y);
      doc.text(`Rs. ${item.price * item.quantity}`, 150, y);
      y += 8;
    });

    /* TOTAL */
    y += 8;
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Total Amount:", 120, y);
    doc.text(`Rs. ${order.total}`, 150, y);

    /* FOOTER */
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for ordering with Pizza Shop!", 105, 285, {
      align: "center",
    });

    doc.save(`invoice-order-${order.id}.pdf`);
  };

  /* CANCEL ORDER */
  const cancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const res = await fetch(`/api/orders/${order.id}/cancel`, {
      method: "PUT",
      credentials: "include",
    });

    let data = null;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      alert(data?.message || "Unable to cancel order");
      return;
    }

    alert("Order cancelled successfully");
  };

  return (
    <div style={cardGrid}>
      {/* LEFT */}
      <div>
        <div style={cardHeader}>
          <div>
            {/* <h3 style={orderId}>Order #{order.id}</h3> */}
            <p style={amount}>Total: ₹{order.total}</p>
          </div>
          <span style={statusBadge(order.status)}>{order.status}</span>
        </div>

        {/* PRODUCTS */}
        <div style={products}>
          {order.items?.map((item, i) => (
            <div key={i} style={productRow}>
              <img src={item.image} alt={item.name} style={productImg} />
              <div style={productInfo}>
                <h4 style={productName}>{item.name}</h4>
                <p style={productDesc}>{item.description}</p>
                <span style={quantity}>Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TRACKING */}
        <div style={timelineHorizontal}>
          {STEPS.map((step, i) => {
            const completed = i < currentIndex;
            const active = i === currentIndex;

            return (
              <div key={step.key} style={stepColumn}>
                <div style={iconRow}>
                  <div
                    style={{
                      ...dot,
                      background: completed
                        ? "#16a34a"
                        : active
                          ? "#2563eb"
                          : "#e5e7eb",
                    }}
                  >
                    {completed ? "✓" : step.icon}
                  </div>

                  {i !== STEPS.length - 1 && (
                    <div
                      style={{
                        ...connectorHorizontal,
                        background: completed || active ? "#c7d2fe" : "#e5e7eb",
                      }}
                    />
                  )}
                </div>

                <p
                  style={{
                    ...stepTitle,
                    fontWeight: active ? "700" : "500",
                    color: completed || active ? "#111827" : "#9ca3af",
                  }}
                >
                  {step.label}
                </p>

                <p style={stepDesc}>
                  {completed ? "Completed" : active ? "In progress" : "Pending"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT – SUMMARY */}
      <div style={summaryBox}>
        <div style={summaryIcon}>🍕</div>
        <h4 style={summaryTitle}>Order Summary</h4>

        <div style={summaryRow}>
          <span>Order ID</span>
          <strong>#{order.id}</strong>
        </div>

        <div style={summaryRow}>
          <span>Status</span>
          <strong>{order.status}</strong>
        </div>

        <div style={summaryRow}>
          <span>Total</span>
          <strong style={totalBig}>₹{order.total}</strong>
        </div>

        <button onClick={downloadInvoice} style={invoiceBtn}>
          📄 Download Invoice
        </button>

        {/* CANCEL BUTTON */}
        {order.status !== "Cancelled" &&
          order.status !== "Delivered" &&
          order.status !== "Out for Delivery" && (
            <button onClick={cancelOrder} style={cancelBtn}>
              ❌ Cancel Order
            </button>
          )}

        <p style={helpText}>Need help? Contact support anytime.</p>
      </div>
    </div>
  );
}

/* ===============================
   STYLES (ONLY USED ONES)
================================ */
const page = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f9fafb, #eef2ff)",
  padding: "40px",
  color: "black",
};

const title = { fontSize: "30px", fontWeight: "800" };
const subtitle = { color: "#6b7280", marginBottom: "30px" };
const empty = { marginTop: "40px", color: "#6b7280" };

const cardGrid = {
  background: "#fff",
  borderRadius: "22px",
  padding: "26px",
  marginBottom: "32px",
  boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "26px",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const orderId = { fontSize: "18px", fontWeight: "700" };
const amount = { color: "#6b7280", marginTop: "4px" };

const statusBadge = (status) => ({
  padding: "8px 16px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
  background:
    status === "Delivered"
      ? "#dcfce7"
      : status === "Out for Delivery"
        ? "#e0f2fe"
        : status === "Preparing"
          ? "#fef9c3"
          : "#fee2e2",
  color:
    status === "Delivered"
      ? "#166534"
      : status === "Out for Delivery"
        ? "#075985"
        : status === "Preparing"
          ? "#854d0e"
          : "#7f1d1d",
});

/* PRODUCTS */
const products = { marginBottom: "26px" };

const productRow = {
  display: "flex",
  gap: "16px",
  marginBottom: "14px",
};

const productImg = {
  width: "70px",
  height: "70px",
  borderRadius: "12px",
  objectFit: "cover",
  border: "1px solid #eee",
};

const productInfo = { flex: 1 };
const productName = { fontSize: "15px", fontWeight: "700" };

const productDesc = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "4px 0",
};

const quantity = {
  fontSize: "13px",
  color: "#374151",
  fontWeight: "600",
};

/* TRACKING – HORIZONTAL */
const timelineHorizontal = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginTop: "24px",
  gap: "12px",
};

const stepColumn = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flex: 1,
  textAlign: "center",
};

const iconRow = {
  display: "flex",
  alignItems: "center",
  width: "100%",
};

const dot = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  fontWeight: "700",
};

const connectorHorizontal = {
  height: "4px",
  flex: 1,
  margin: "0 8px",
  borderRadius: "4px",
};

const stepTitle = { fontSize: "15px" };
const stepDesc = { fontSize: "13px", color: "#6b7280" };

/* SUMMARY */
const summaryBox = {
  background: "linear-gradient(180deg, #f8fafc, #eef2ff)",
  borderRadius: "18px",
  padding: "22px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const summaryIcon = {
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  background: "#2563eb",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  marginBottom: "6px",
};

const summaryTitle = {
  fontSize: "16px",
  fontWeight: "800",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
};

const totalBig = {
  fontSize: "18px",
  color: "#2563eb",
};

const helpText = {
  marginTop: "auto",
  fontSize: "12px",
  color: "#6b7280",
};
const invoiceBtn = {
  marginTop: "10px",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
};
const cancelBtn = {
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#ef4444",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
};
