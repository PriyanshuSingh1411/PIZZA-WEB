"use client";
import { useEffect, useState } from "react";
import { addToCart } from "@/lib/cart";

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     FETCH PRODUCTS FROM DB
  =============================== */
  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🍕 Explore Our Pizzas</h1>
      <p style={styles.subheading}>
        Handcrafted pizzas made with premium ingredients ❤️
      </p>

      {/* LOADING */}
      {loading && <p style={{ textAlign: "center" }}>Loading pizzas...</p>}

      {/* ERROR */}
      {!loading && error && (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      )}

      {/* EMPTY */}
      {!loading && !error && products.length === 0 && (
        <p style={{ textAlign: "center" }}>No pizzas available</p>
      )}

      {/* PRODUCTS */}
      {!loading && !error && products.length > 0 && (
        <div style={styles.grid}>
          {products.map((pizza) => (
            <div key={pizza.id} style={styles.card}>
              {/* IMAGE */}
              <div style={styles.imageWrap}>
                <img
                  src={
                    pizza.image
                      ? pizza.image
                      : "https://images.unsplash.com/photo-1601924582975-7e1f1a5d4b5f?w=800&q=80"
                  }
                  alt={pizza.name}
                  style={styles.image}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1601924582975-7e1f1a5d4b5f?w=800&q=80";
                  }}
                />
              </div>

              {/* CONTENT */}
              <div style={styles.content}>
                <h3>{pizza.name}</h3>
                <p style={styles.desc}>{pizza.description}</p>

                <div style={styles.bottom}>
                  <span style={styles.price}>₹{pizza.price}</span>

                  <button
                    style={styles.button}
                    onClick={() => {
                      addToCart({
                        id: pizza.id,
                        name: pizza.name,
                        price: pizza.price,
                        image: pizza.image,
                      });
                      window.dispatchEvent(new Event("storage"));
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===============================
   STYLES
================================ */
const styles = {
  page: {
    padding: "40px",
    background: "#f8f8f8",
    minHeight: "100vh",
    color: "black",
  },

  heading: {
    textAlign: "center",
    fontSize: "34px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#111",
  },

  subheading: {
    textAlign: "center",
    color: "#777",
    marginBottom: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    transition: "transform 0.3s",
  },

  imageWrap: {
    background: "#eee",
  },

  image: {
    width: "100%",
    height: "190px",
    objectFit: "cover",
    display: "block",
  },

  content: {
    padding: "16px",
  },

  desc: {
    color: "#666",
    fontSize: "14px",
    margin: "8px 0 16px",
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: "18px",
    fontWeight: "700",
  },

  button: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
