const renderCart = () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartTotalContainer) {
    console.error("No se encontraron los contenedores en el HTML");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cartItemsContainer.innerHTML = "";

  // Si el carrito esta vacio, mostrar mensaje
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>El carrito está vacío.</p>";
    cartTotalContainer.textContent = "";
    return;
  }

  let total = 0;
  cart.forEach((item: any) => {
    const row = document.createElement("div");
    // Uso de botones - y +
    row.innerHTML = `
      ${item.name} - $${item.price} x ${item.quantity}
      <button onclick="updateQuantity(${item.id}, -1)">–</button>
      <button onclick="updateQuantity(${item.id}, 1)">+</button>
    `;
    cartItemsContainer.appendChild(row);
    total += item.price * item.quantity;
  });

  cartTotalContainer.textContent = `Total: $${total}`;
};

const updateQuantity = (productId: number, change: number) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const item = cart.find((i: any) => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      // Si la cantidad llega a 0 se elimina el producto
      const index = cart.indexOf(item);
      cart.splice(index, 1);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // vuelve a renderizar el carrito
};

// Expongo la funcion para usarla de manera global
(window as any).updateQuantity = updateQuantity; 

renderCart();
