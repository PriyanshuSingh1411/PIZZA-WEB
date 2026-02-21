"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Delivery Address State
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [coupons, setCoupons] = useState([]);

  /* ======================
     LOAD CART + COUPONS + RAZORPAY SDK
  ====================== */
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Fetch coupons from API
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => setCoupons(data))
      .catch((err) => console.error("Failed to load coupons:", err));

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* ======================
     TOTAL
  ====================== */
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const total = Math.max(subtotal - discount, 0);

  /* ======================
     APPLY COUPON
  ====================== */
  const applyCoupon = async () => {
    if (appliedCoupon) return;
    if (!couponCode.trim()) {
      alert("Please enter a coupon code");
      return;
    }

    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          total: subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid coupon");
        return;
      }

      setAppliedCoupon(couponCode.toUpperCase());
      setDiscount(data.discount);
    } catch (err) {
      console.error("Apply coupon error:", err);
      alert("Failed to apply coupon");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
  };

  /* ======================
     RAZORPAY PAYMENT
  ====================== */
  const handleRazorpayPayment = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const res = await axios.post("/api/razorpay/create-order", {
        amount: total * 100, // convert to paise
      });

      const order = res.data;

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Refresh page.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Pizza Shop",
        description: `Order for ₹${total}`,
        order_id: order.id,
        notes: {
          Subtotal: `₹${subtotal}`,
          Discount: `-₹${discount}`,
          Total: `₹${total}`,
        },

        handler: async function (response) {
          try {
            const verifyRes = await axios.post("/api/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes.data.success) {
              alert("Payment verification failed ❌");
              return;
            }

            await axios.post("/api/orders", {
              cart,
              subtotal,
              discount,
              total,
              coupon: appliedCoupon,
              payment_method: "ONLINE",
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              delivery_address: address,
            });

            localStorage.removeItem("cart");
            router.push("/order-success");
          } catch (err) {
            console.error("Order save failed:", err);
            alert("Payment succeeded but order failed to save.");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled ❌");
          },
        },

        theme: {
          color: "#ff6b00",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Something went wrong while starting payment.");
    }
  };

  /* ======================
     PLACE ORDER
  ====================== */
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    // Validate address
    if (!address.name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!address.phone.trim() || address.phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    if (!address.street.trim()) {
      alert("Please enter your street address");
      return;
    }
    if (!address.city.trim()) {
      alert("Please enter your city");
      return;
    }
    if (!address.state.trim()) {
      alert("Please enter your state");
      return;
    }
    if (!address.pincode.trim() || address.pincode.length < 6) {
      alert("Please enter a valid pincode");
      return;
    }

    if (paymentMethod === "ONLINE") {
      handleRazorpayPayment();
      return;
    }

    try {
      await axios.post("/api/orders", {
        cart,
        subtotal,
        discount,
        total,
        coupon: appliedCoupon,
        payment_method: "COD",
        delivery_address: address,
      });

      localStorage.removeItem("cart");
      router.push("/order-success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🛒 Checkout</h1>

      <div style={styles.container}>
        {/* LEFT SIDE - Cart Items */}
        <div style={styles.left}>
          <h3 style={styles.sectionTitle}>📦 Order Items</h3>

          {cart.length === 0 ? (
            <p style={styles.emptyCart}>Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={styles.cartItem}>
                <img
                  src={item.image || "/pizza-bg.jpg"}
                  alt={item.name}
                  style={styles.itemImage}
                />
                <div style={styles.itemDetails}>
                  <h4 style={styles.itemName}>{item.name}</h4>
                  <p style={styles.itemDesc}>
                    {item.description || "Delicious pizza"}
                  </p>
                  <div style={styles.itemMeta}>
                    <span style={styles.itemQty}>Qty: {item.qty}</span>
                    <span style={styles.itemPrice}>
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Delivery Address Section */}
          <h3 style={styles.sectionTitle}>🚚 Delivery Address</h3>
          <div style={styles.addressBox}>
            <div style={styles.addressRow}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Full Name *</label>
                <input
                  style={styles.addressInput}
                  placeholder="John Doe"
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Phone Number *</label>
                <input
                  style={styles.addressInput}
                  placeholder="9876543210"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  maxLength={10}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Street Address *</label>
              <input
                style={styles.addressInput}
                placeholder="123, Main Road, Area"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
            </div>

            <div style={styles.addressRow}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>City *</label>
                <input
                  style={styles.addressInput}
                  placeholder="Mumbai"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>State *</label>
                <input
                  style={styles.addressInput}
                  placeholder="Maharashtra"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
              </div>
            </div>

            <div style={styles.addressRow}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Pincode *</label>
                <input
                  style={styles.addressInput}
                  placeholder="400001"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                  maxLength={6}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Landmark (Optional)</label>
                <input
                  style={styles.addressInput}
                  placeholder="Near School"
                  value={address.landmark}
                  onChange={(e) =>
                    setAddress({ ...address, landmark: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          {/* Payment Method */}
          <h3 style={styles.sectionTitle}>💳 Payment Method</h3>
          <div style={styles.paymentOptions}>
            <label
              style={{
                ...styles.paymentOption,
                ...(paymentMethod === "COD"
                  ? styles.paymentOptionSelected
                  : {}),
              }}
            >
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={styles.radioInput}
              />
              <div style={styles.paymentContent}>
                <span style={styles.paymentIcon}>💵</span>
                <div>
                  <div style={styles.paymentTitle}>Cash on Delivery</div>
                  <div style={styles.paymentDesc}>Pay when you receive</div>
                </div>
              </div>
            </label>

            <label
              style={{
                ...styles.paymentOption,
                ...(paymentMethod === "ONLINE"
                  ? styles.paymentOptionSelected
                  : {}),
              }}
            >
              <input
                type="radio"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={styles.radioInput}
              />
              <div style={styles.paymentContent}>
                <span style={styles.paymentIcon}>💳</span>
                <div>
                  <div style={styles.paymentTitle}>Online Payment</div>
                  <div style={styles.paymentDesc}>Pay via Razorpay</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* RIGHT SIDE - Summary */}
        <div style={styles.right}>
          <h3 style={styles.sectionTitle}>💰 Order Summary</h3>

          <div style={styles.summaryBox}>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {appliedCoupon && (
              <div style={styles.discountRow}>
                <span>Coupon ({appliedCoupon})</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div style={styles.divider}></div>

            <div style={styles.totalRow}>
              <span>Total</span>
              <span style={styles.totalAmount}>₹{total}</span>
            </div>
          </div>

          {/* Coupon Section */}
          <div style={styles.couponSection}>
            <h4 style={styles.couponTitle}>🎟️ Have a Coupon?</h4>

            {!appliedCoupon ? (
              <>
                <input
                  style={styles.couponInput}
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button style={styles.applyBtn} onClick={applyCoupon}>
                  Apply Coupon
                </button>

                {coupons.length > 0 && (
                  <div style={styles.availableCoupons}>
                    <p style={styles.availableTitle}>Available Coupons:</p>
                    {coupons.map((c) => (
                      <div
                        key={c.code}
                        style={styles.couponBadge}
                        onClick={() => setCouponCode(c.code)}
                      >
                        {c.code} -{" "}
                        {c.type === "percent"
                          ? `${c.value}% OFF`
                          : `₹${c.value} OFF`}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={styles.appliedCoupon}>
                <span>✓ {appliedCoupon} Applied</span>
                <button style={styles.removeBtn} onClick={removeCoupon}>
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            style={{
              ...styles.placeBtn,
              opacity: cart.length === 0 ? 0.5 : 1,
              cursor: cart.length === 0 ? "not-allowed" : "pointer",
            }}
            onClick={placeOrder}
            disabled={cart.length === 0}
          >
            {paymentMethod === "COD"
              ? "🛵 Place Order (COD)"
              : "💳 Pay & Place Order"}
          </button>

          <p style={styles.helpText}>Need help? Contact support anytime.</p>
        </div>
      </div>
    </div>
  );
}

/* ======================
   STYLES
====================== */
const styles = {
  page: {
    padding: "40px 20px",
    background: "linear-gradient(180deg, #f9fafb, #eef2ff)",
    minHeight: "100vh",
    color: "black",
  },
  heading: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "30px",
    color: "#1f2937",
  },
  container: {
    display: "flex",
    gap: "30px",
    maxWidth: "1100px",
    margin: "auto",
    flexWrap: "wrap",
  },
  left: {
    flex: "1 1 500px",
    background: "#fff",
    padding: "30px",
    borderRadius: "22px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  right: {
    flex: "1 1 350px",
    background: "#fff",
    padding: "30px",
    borderRadius: "22px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    height: "fit-content",
    position: "sticky",
    top: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#1f2937",
  },
  emptyCart: {
    textAlign: "center",
    color: "#6b7280",
    padding: "40px 0",
    fontSize: "16px",
  },
  cartItem: {
    display: "flex",
    gap: "16px",
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "14px",
    marginBottom: "14px",
    border: "1px solid #e5e7eb",
  },
  itemImage: {
    width: "80px",
    height: "80px",
    borderRadius: "12px",
    objectFit: "cover",
  },
  itemDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  itemName: {
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    color: "#1f2937",
  },
  itemDesc: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 8px 0",
  },
  itemMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemQty: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#2563eb",
  },
  addressBox: {
    background: "#f9fafb",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "24px",
    border: "1px solid #e5e7eb",
  },
  addressRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "14px",
  },
  inputGroup: {
    flex: 1,
    marginBottom: "10px",
  },
  inputLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
  },
  addressInput: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    background: "#fff",
  },
  paymentOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  paymentOption: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  paymentOptionSelected: {
    borderColor: "#2563eb",
    background: "#eff6ff",
  },
  radioInput: {
    marginRight: "14px",
    width: "18px",
    height: "18px",
  },
  paymentContent: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  paymentIcon: {
    fontSize: "28px",
  },
  paymentTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1f2937",
  },
  paymentDesc: {
    fontSize: "13px",
    color: "#6b7280",
  },
  summaryBox: {
    background: "linear-gradient(180deg, #f8fafc, #eef2ff)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "24px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "10px",
  },
  discountRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "15px",
    color: "#16a34a",
    fontWeight: "600",
    marginBottom: "10px",
  },
  divider: {
    height: "1px",
    background: "#e5e7eb",
    margin: "14px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
  },
  totalAmount: {
    fontSize: "22px",
    color: "#2563eb",
    fontWeight: "800",
  },
  couponSection: {
    marginBottom: "24px",
  },
  couponTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#1f2937",
  },
  couponInput: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "10px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  applyBtn: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  availableCoupons: {
    marginTop: "16px",
  },
  availableTitle: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  couponBadge: {
    display: "inline-block",
    padding: "8px 14px",
    border: "1px dashed #2563eb",
    borderRadius: "8px",
    marginRight: "8px",
    marginBottom: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    color: "#2563eb",
    background: "#eff6ff",
  },
  appliedCoupon: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px",
    background: "#dcfce7",
    borderRadius: "12px",
    color: "#16a34a",
    fontWeight: "600",
  },
  removeBtn: {
    padding: "8px 14px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  placeBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
  },
  helpText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#9ca3af",
    marginTop: "16px",
  },
};
