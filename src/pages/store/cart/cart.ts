const renderCart = () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartTotalContainer) {
    console.error("No se encontraron los contenedores en el HTML");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cartItemsContainer.innerHTML = "";

  // 🔹 Si el carrito está vacío, mostrar mensaje
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>El carrito está vacío.</p>";
    cartTotalContainer.textContent = "";
    return;
  }

  let total = 0;
  cart.forEach((item: any) => {
    const row = document.createElement("div");
    row.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
    cartItemsContainer.appendChild(row);
    total += item.price * item.quantity;
  });

  cartTotalContainer.textContent = `Total: $${total}`;
};

renderCart();

