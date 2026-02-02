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

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("image", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    setForm({ ...form, image: result.imageUrl });
  };

  const submit = async () => {
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/admin/products";
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <h1>Add Pizza</h1>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        placeholder="Price"
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <input
        placeholder="Category"
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => uploadImage(e.target.files[0])}
      />

      {form.image && (
        <img src={form.image} style={{ width: "100%", marginTop: 10 }} />
      )}

      <button
        onClick={submit}
        style={{
          marginTop: 15,
          background: "#16a34a",
          color: "#fff",
          border: "none",
          padding: "10px 16px",
          borderRadius: 6,
        }}
      >
        Save Product
      </button>
    </div>
  );
}
