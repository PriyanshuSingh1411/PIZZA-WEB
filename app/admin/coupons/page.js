"use client";
import { useEffect, useState } from "react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: "",
    min_order: "",
    expiry: "",
  });

  const loadCoupons = () => {
    fetch("/api/admin/coupons")
      .then((res) => res.json())
      .then((data) => setCoupons(data));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const addCoupon = async () => {
    if (!form.code || !form.value) {
      alert("Code and value required");
      return;
    }

    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      code: "",
      type: "percent",
      value: "",
      min_order: "",
      expiry: "",
    });

    loadCoupons();
  };

  const toggleStatus = async (id, status) => {
    await fetch("/api/admin/coupons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: status === "active" ? "inactive" : "active",
      }),
    });

    loadCoupons();
  };

  const deleteCoupon = async (id) => {
    if (!confirm("Delete this coupon?")) return;

    await fetch("/api/admin/coupons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadCoupons();
  };

  return (
    <div>
      <h1>🎟️ Coupon Management</h1>

      {/* ADD COUPON */}
      <div style={card}>
        <h3>Add Coupon</h3>

        <input
          placeholder="Coupon Code (SAVE10)"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value.toUpperCase() })
          }
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="percent">Percent (%)</option>
          <option value="flat">Flat (₹)</option>
        </select>

        <input
          placeholder="Value (10 or 100)"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />

        <input
          placeholder="Minimum Order"
          value={form.min_order}
          onChange={(e) => setForm({ ...form, min_order: e.target.value })}
        />

        <input
          type="date"
          value={form.expiry}
          onChange={(e) => setForm({ ...form, expiry: e.target.value })}
        />

        <button onClick={addCoupon} style={btnGreen}>
          Add Coupon
        </button>
      </div>

      {/* LIST COUPONS */}
      {coupons.map((c) => (
        <div key={c.id} style={card}>
          <strong>{c.code}</strong>{" "}
          {c.type === "percent" ? `(${c.value}% OFF)` : `(₹${c.value} OFF)`}
          <p>Min Order: ₹{c.min_order}</p>
          <p>Expiry: {c.expiry || "No expiry"}</p>
          <p>Status: {c.status}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => toggleStatus(c.id, c.status)}
              style={btnBlue}
            >
              {c.status === "active" ? "Deactivate" : "Activate"}
            </button>

            <button onClick={() => deleteCoupon(c.id)} style={btnRed}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* STYLES */
const card = {
  background: "#fff",
  padding: 16,
  marginBottom: 16,
  borderRadius: 10,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const btnGreen = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: 6,
  cursor: "pointer",
};

const btnBlue = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px",
  borderRadius: 6,
  cursor: "pointer",
};

const btnRed = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px",
  borderRadius: 6,
  cursor: "pointer",
};
