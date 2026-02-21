"use client";
import { useEffect, useState } from "react";
import { getCart, updateQty, removeItem } from "@/lib/cart";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const refresh = () => setCart(getCart());

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const delivery = cart.length ? 40 : 0;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div style={{ ...styles.page, background: "#ffffff" }}>
        <div style={styles.empty}>
          <h1>🛒 Your cart is empty</h1>
          <p>Add some delicious pizzas to continue 🍕</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Your Cart</h1>

      <div style={styles.container}>
        {/* CART ITEMS */}
        <div style={styles.items}>
          {cart.map((item) => (
            <div key={item.id} style={styles.card}>
              <img
                src={
                  item.image
                    ? item.image
                    : "https://images.unsplash.com/photo-1601924582975-7e1f1a5d4b5f?w=800&q=80"
                }
                alt={item.name}
                style={styles.image}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1601924582975-7e1f1a5d4b5f?w=800&q=80";
                }}
              />

              <div style={styles.info}>
                <h3>{item.name}</h3>
                <p style={styles.price}>₹{item.price}</p>

                <div style={styles.qtyRow}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => {
                      updateQty(item.id, item.qty - 1);
                      refresh();
                    }}
                  >
                    −
                  </button>

                  <span style={styles.qty}>{item.qty}</span>

                  <button
                    style={styles.qtyBtn}
                    onClick={() => {
                      updateQty(item.id, item.qty + 1);
                      refresh();
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                style={styles.remove}
                onClick={() => {
                  removeItem(item.id);
                  refresh();
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div style={styles.summary}>
          <h3>Order Summary</h3>

          <div style={styles.row}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div style={styles.row}>
            <span>Delivery</span>
            <span>₹{delivery}</span>
          </div>

          <hr />

          <div style={{ ...styles.row, fontWeight: "bold" }}>
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            style={styles.checkout}
            onClick={() => router.push("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   STYLES
================================ */
const styles = {
  page: {
    background: "#f5f5f5",
    minHeight: "100vh",
    padding: "40px",
    color: "black",
  },

  heading: {
    textAlign: "center",
    marginBottom: "30px",
  },

  container: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "30px",
    maxWidth: "1100px",
    margin: "auto",
  },

  items: {},

  card: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },

  image: {
    width: "90px",
    height: "90px",
    borderRadius: "10px",
    objectFit: "cover",
    marginRight: "15px",
  },

  info: {
    flex: 1,
  },

  price: {
    color: "#555",
    marginBottom: "10px",
  },

  qtyRow: {
    display: "flex",
    alignItems: "center",
  },

  qtyBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: "18px",
  },

  qty: {
    margin: "0 12px",
    fontWeight: "bold",
  },

  remove: {
    background: "transparent",
    border: "none",
    color: "#ff4d4f",
    cursor: "pointer",
    fontWeight: "600",
  },

  summary: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    height: "fit-content",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    position: "sticky",
    top: "20px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 0",
  },

  checkout: {
    width: "100%",
    background: "#ff4d4f",
    color: "#fff",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    marginTop: "15px",
    fontSize: "16px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    marginTop: "80px",
  },
};
