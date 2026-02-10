"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import Script from "next/script";
import axios from "axios";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const coupons = [
    { code: "SAVE10", type: "percent", value: 10 },
    { code: "FLAT100", type: "flat", value: 100 },
  ];

  /* ======================
     LOAD CART
  ====================== */
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  /* ======================
     TOTAL
  ====================== */
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(subtotal - discount, 0);

  /* ======================
     APPLY COUPON
  ====================== */
  const applyCoupon = () => {
    if (appliedCoupon) return;

    const coupon = coupons.find((c) => c.code === couponCode.toUpperCase());

    if (!coupon) {
      alert("Invalid coupon code");
      return;
    }

    let discountAmount = 0;
    if (coupon.type === "percent") {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = coupon.value;
    }

    setAppliedCoupon(coupon.code);
    setDiscount(discountAmount);
  };

  /* ======================
     REMOVE COUPON
  ====================== */
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
  };
  const handleRazorpayPayment = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const res = await axios.post("/api/razorpay/create-order", {
        amount: total,
      });

      const order = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Food App",
        description: "Order Payment",
        order_id: order.id,

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
            });

            localStorage.removeItem("cart");
            router.push("/order-success");
          } catch (error) {
            console.error("Order save failed:", error);
            alert("Payment succeeded but order failed to save.");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled by user ❌");
          },
        },

        theme: { color: "#ff6b00" },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh.");
        return;
      }

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        alert("Payment Failed ❌\nReason: " + response.error.description);
      });

      rzp.open(); // ✅ YOU WERE MISSING THIS
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

    // 👉 ONLINE PAYMENT (RAZORPAY)
    if (paymentMethod === "ONLINE") {
      handleRazorpayPayment();
      return;
    }

    // 👉 CASH ON DELIVERY
    try {
      await axios.post("/api/orders", {
        cart,
        subtotal,
        discount,
        total,
        coupon: appliedCoupon,
        payment_method: "COD",
      });

      localStorage.removeItem("cart");
      router.push("/order-success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Checkout</h2>

      <div style={styles.container}>
        {/* LEFT */}
        <div style={styles.left}>
          <h3>Delivery Details</h3>
          <input style={styles.input} placeholder="Full Name" />
          <input style={styles.input} placeholder="Phone Number" />
          <input style={styles.input} placeholder="Address" />
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div key={item.id} style={styles.item}>
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <hr />

          <div style={styles.row}>
            <strong>Subtotal</strong>
            <strong>₹{subtotal}</strong>
          </div>

          {appliedCoupon && (
            <div style={styles.row}>
              <span>Coupon ({appliedCoupon})</span>
              <span style={{ color: "green" }}>-₹{discount}</span>
            </div>
          )}

          <div style={styles.row}>
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>

          {/* PAYMENT METHOD */}
          <div style={styles.paymentBox}>
            <h4>Payment Method</h4>

            <label style={styles.radio}>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label style={styles.radio}>
              <input
                type="radio"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Online Payment (UPI / Card)
            </label>
          </div>

          {/* COUPON SECTION (RESTORED) */}
          <div style={styles.couponBox}>
            <input
              style={styles.input}
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={appliedCoupon}
            />

            {!appliedCoupon ? (
              <button style={styles.applyBtn} onClick={applyCoupon}>
                Apply Coupon
              </button>
            ) : (
              <button style={styles.removeBtn} onClick={removeCoupon}>
                Remove Coupon
              </button>
            )}

            {!appliedCoupon && (
              <div style={styles.available}>
                <p>Available Coupons</p>
                {coupons.map((c) => (
                  <span
                    key={c.code}
                    style={styles.coupon}
                    onClick={() => setCouponCode(c.code)}
                  >
                    {c.code} –{" "}
                    {c.type === "percent"
                      ? `${c.value}% OFF`
                      : `₹${c.value} OFF`}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button style={styles.placeBtn} onClick={placeOrder}>
            Place Order
          </button>
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
    padding: "30px",
    background: "#f8f8f8",
    minHeight: "100vh",
    color: "black",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  container: {
    display: "flex",
    gap: "20px",
    maxWidth: "1000px",
    margin: "auto",
  },
  left: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
  },
  right: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  paymentBox: {
    marginTop: "15px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  radio: {
    display: "block",
    marginTop: "8px",
    cursor: "pointer",
  },
  couponBox: {
    marginTop: "15px",
  },
  available: {
    marginTop: "10px",
  },
  coupon: {
    display: "inline-block",
    padding: "6px 10px",
    border: "1px dashed #ff6b00",
    borderRadius: "5px",
    marginRight: "8px",
    marginTop: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  applyBtn: {
    width: "100%",
    padding: "10px",
    background: "#ff6b00",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  removeBtn: {
    width: "100%",
    padding: "10px",
    background: "#999",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  placeBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
