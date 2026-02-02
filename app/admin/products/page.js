"use client";
import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = (pageNo = 1) => {
    fetch(`/api/products?page=${pageNo}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setPage(data.page);
        setTotalPages(data.totalPages);
      });
  };

  useEffect(() => {
    loadProducts(page);
  }, [page]);

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    loadProducts(page);
  };

  return (
    <div>
      <h1>🍕 Manage Products</h1>

      <a href="/admin/products/add" style={addBtn}>
        ➕ Add New Pizza
      </a>

      {products.map((p) => (
        <div key={p.id} style={card}>
          <div>
            <strong>{p.name}</strong>
            <p>₹{p.price}</p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a href={`/admin/products/edit/${p.id}`} style={editBtn}>
              Edit
            </a>

            <button onClick={() => deleteProduct(p.id)} style={deleteBtn}>
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* PAGINATION */}
      <div style={pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ⬅ Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

/* STYLES */
const card = {
  background: "#fff",
  padding: 15,
  marginBottom: 12,
  borderRadius: 8,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const addBtn = {
  display: "inline-block",
  marginBottom: 20,
  background: "#ff4d4f",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: 6,
  textDecoration: "none",
};

const editBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 5,
  textDecoration: "none",
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 5,
  cursor: "pointer",
};

const pagination = {
  marginTop: 20,
  display: "flex",
  gap: 15,
  alignItems: "center",
};
