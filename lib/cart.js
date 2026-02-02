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
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
}

export function updateQty(id, qty) {
  const cart = getCart()
    .map((item) => (item.id === id ? { ...item, qty } : item))
    .filter((item) => item.qty > 0);

  saveCart(cart);
}

export function removeItem(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}
