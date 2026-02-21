"use client";
import { useEffect, useState } from "react";

export default function AdminHome() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          console.error("Dashboard error:", res.message);
          setData({
            summary: {
              totalUsers: 0,
              totalOrders: 0,
              totalProducts: 0,
              totalRevenue: 0,
            },
            details: { users: [], orders: [], products: [], revenue: [] },
          });
        } else {
          setData(res);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setData({
          summary: {
            totalUsers: 0,
            totalOrders: 0,
            totalProducts: 0,
            totalRevenue: 0,
          },
          details: { users: [], orders: [], products: [], revenue: [] },
        });
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={center}>
        <div style={loader}></div>
      </div>
    );

  if (!data || !data.summary) {
    return (
      <div style={center}>
        <p>Unable to load dashboard data.</p>
      </div>
    );
  }

  const { summary, details } = data;

  return (
    <div style={container}>
      <div style={header}>
        <h1 style={title}>Dashboard Overview</h1>
        <p style={subtitle}>Monitor your platform performance</p>
      </div>

      {/* SUMMARY CARDS */}
      <div style={grid}>
        <Card
          icon="👤"
          title="Users"
          value={summary.totalUsers}
          active={active === "users"}
          onClick={() => setActive("users")}
        />
        <Card
          icon="📦"
          title="Orders"
          value={summary.totalOrders}
          active={active === "orders"}
          onClick={() => setActive("orders")}
        />
        <Card
          icon="🍕"
          title="Products"
          value={summary.totalProducts}
          active={active === "products"}
          onClick={() => setActive("products")}
        />
        <Card
          icon="💰"
          title="Revenue"
          value={`₹${summary.totalRevenue}`}
          active={active === "revenue"}
          onClick={() => setActive("revenue")}
        />
      </div>

      {/* DETAILS */}
      <div style={{ marginTop: 30 }}>
        {active === "users" && (
          <Table
            title="👤 Users List"
            headers={["ID", "Name", "Email"]}
            rows={details.users.map((u) => [u.id, u.name, u.email])}
          />
        )}

        {active === "orders" && (
          <Table
            title="📦 Orders List"
            headers={["ID", "User ID", "Total", "Status", "Date"]}
            rows={details.orders.map((o) => [
              o.id,
              o.user_id,
              `₹${o.total}`,
              o.status,
              new Date(o.created_at).toLocaleString(),
            ])}
          />
        )}

        {active === "products" && (
          <Table
            title="🍕 Products List"
            headers={["ID", "Name", "Price"]}
            rows={details.products.map((p) => [p.id, p.name, `₹${p.price}`])}
          />
        )}

        {active === "revenue" && (
          <Table
            title="💰 Revenue Records"
            headers={["Order ID", "Amount"]}
            rows={details.revenue.map((r) => [r.id, `₹${r.total}`])}
          />
        )}

        {!active && (
          <div style={emptyState}>
            Click on a card above to view detailed data.
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Card({ icon, title, value, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...card,
        border: active ? "2px solid #2563eb" : "1px solid #e5e7eb",
        background: active ? "#eff6ff" : "#fff",
      }}
    >
      <div style={cardTop}>
        <span style={iconStyle}>{icon}</span>
        <span style={cardTitle}>{title}</span>
      </div>
      <p style={cardValue}>{value}</p>
    </div>
  );
}

function Table({ title, headers, rows }) {
  return (
    <div style={tableWrapper}>
      <h3 style={tableTitle}>{title}</h3>

      {rows.length === 0 ? (
        <div style={emptyState}>No records found.</div>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={td}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const container = { padding: "40px" };

const header = { marginBottom: "30px" };

const title = { fontSize: "26px", fontWeight: "700" };

const subtitle = { color: "#6b7280", fontSize: "14px" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
};

const card = {
  padding: "20px",
  borderRadius: "14px",
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  transition: "0.2s ease",
};

const cardTop = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
};

const iconStyle = {
  fontSize: "22px",
};

const cardTitle = {
  fontSize: "14px",
  color: "#6b7280",
};

const cardValue = {
  fontSize: "26px",
  fontWeight: "700",
};

const tableWrapper = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
};

const tableTitle = { marginBottom: "15px", fontWeight: "600" };

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "12px",
  background: "#f3f4f6",
  fontSize: "14px",
};

const td = {
  padding: "12px",
  borderTop: "1px solid #e5e7eb",
  fontSize: "14px",
};

const emptyState = {
  padding: "20px",
  textAlign: "center",
  color: "#6b7280",
};

const center = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const loader = {
  width: "40px",
  height: "40px",
  border: "4px solid #e5e7eb",
  borderTop: "4px solid #2563eb",
  borderRadius: "50%",
};
