/* Get cart from localStorage */
export function getCart() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart")) || [];
}

/* Save cart */
export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* Clear cart */
export function clearCart() {
  localStorage.removeItem("cart");
}

export function addToCart(product) {
  const cart = getCart();

  // For customized products (pizzas with size/toppings), create unique key
  const customKey =
    product.size || product.toppings
      ? `${product.id}-${product.size?.id || "default"}-${(
          product.toppings || []
        )
          .map((t) => t.id)
          .sort()
          .join("-")}`
      : null;

  if (customKey) {
    // Check if same customization exists
    const existing = cart.find((item) => item.customKey === customKey);

    if (existing) {
      existing.qty += product.quantity || 1;
    } else {
      cart.push({
        ...product,
        qty: product.quantity || 1,
        customKey: customKey,
      });
    }
  } else {
    // Simple product (no customization)
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
  }

  saveCart(cart);
}

export function updateQty(id, qty) {
  const cart = getCart()
    .map((item) => {
      // Check both customKey and id for matching
      const matchKey = item.customKey || item.id;
      return matchKey === id ? { ...item, qty } : item;
    })
    .filter((item) => item.qty > 0);

  saveCart(cart);
}

export function removeItem(id) {
  const cart = getCart().filter((item) => {
    // Check both customKey and id for matching
    const matchKey = item.customKey || item.id;
    return matchKey !== id;
  });
  saveCart(cart);
}
