"use client";
import { useState } from "react";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const uploadImage = async (file) => {
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("image", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    setForm((prev) => ({ ...prev, image: result.imageUrl }));

    setUploading(false);
  };

  const submit = async () => {
    setSubmitting(true);

    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
      }),
    });

    window.location.href = "/admin/products";
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #ddd",
    marginTop: 6,
    marginBottom: 18,
    fontSize: 14,
    outline: "none",
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: 14,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#fff",
          padding: 30,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ marginBottom: 25, fontSize: 24, fontWeight: 700 }}>
          🍕 Add New Pizza
        </h1>

        <label style={labelStyle}>Product Name</label>
        <input
          style={inputStyle}
          placeholder="Margherita"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80 }}
          placeholder="Fresh mozzarella, basil, tomato sauce..."
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label style={labelStyle}>Price</label>
        <input
          type="number"
          style={inputStyle}
          placeholder="12.99"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <label style={labelStyle}>Category</label>
        <input
          style={inputStyle}
          placeholder="Classic / Veg / Meat"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <label style={labelStyle}>Product Image</label>
        <input
          type="file"
          accept="image/*"
          style={{ marginTop: 8, marginBottom: 15 }}
          onChange={(e) => uploadImage(e.target.files[0])}
        />

        {uploading && (
          <p style={{ fontSize: 13, color: "#666" }}>Uploading image...</p>
        )}

        {form.image && (
          <div
            style={{
              marginTop: 10,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #eee",
            }}
          >
            <img
              src={form.image}
              alt="Preview"
              style={{
                width: "100%",
                display: "block",
              }}
            />
          </div>
        )}

        <button
          onClick={submit}
          disabled={submitting}
          style={{
            width: "100%",
            marginTop: 25,
            background: submitting ? "#86efac" : "#16a34a",
            color: "#fff",
            border: "none",
            padding: "14px",
            borderRadius: 10,
            fontWeight: 600,
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          {submitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  );
}
