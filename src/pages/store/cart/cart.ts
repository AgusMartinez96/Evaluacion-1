const renderCart = () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartSubtotalContainer = document.getElementById("cart-subtotal");
  const cartTotalContainer = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartSubtotalContainer || !cartTotalContainer) {
    console.error("No se encontraron los contenedores en el HTML");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cartItemsContainer.innerHTML = "";

  // Si el carrito está vacío
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>El carrito está vacío.</p>";
    cartSubtotalContainer.textContent = "Subtotal: $0";
    cartTotalContainer.textContent = "Total: $0";
    updateCartCount(); // Actualizamos contador vacio
    return;
  }

  let subtotal = 0;

  cart.forEach((item: any) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    // Imagen del producto
    const img = document.createElement("img");
    img.src = item.image; // Asegurarse que cada producto tenga item.image en localStorage
    img.alt = item.name;
    img.className = "item-img";

    // Informacion del producto
    const itemInfo = document.createElement("span");
    itemInfo.className = "item-info";
    itemInfo.textContent = `${item.name} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}`;

    const itemActions = document.createElement("div");
    itemActions.className = "item-actions";
    itemActions.innerHTML = `
      <button onclick="updateQuantity(${item.id}, -1)">–</button>
      <span class="quantity">${item.quantity}</span>
      <button onclick="updateQuantity(${item.id}, 1)">+</button>
      <button onclick="removeItem(${item.id})">Eliminar</button>
    `;

    row.appendChild(img)
    row.appendChild(itemInfo);
    row.appendChild(itemActions);
    cartItemsContainer.appendChild(row);

    subtotal += item.price * item.quantity;
  });

  cartSubtotalContainer.textContent = `Subtotal: $${subtotal}`;
  cartTotalContainer.textContent = `Total: $${subtotal}`;

  updateCartCount(); // Actualizamos el contador cada vez que se renderiza
};

// Actualizar cantidad
const updateQuantity = (productId: number, change: number) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const item = cart.find((i: any) => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      const index = cart.indexOf(item);
      cart.splice(index, 1);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

// Eliminar producto
const removeItem = (productId: number) => {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart = cart.filter((i: any) => i.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

const emptyCart = () => {
  localStorage.setItem("cart", JSON.stringify([]));
  renderCart();
};

const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = count.toString();
  }
};

// Exponer funciones globales
(window as any).updateQuantity = updateQuantity;
(window as any).removeItem = removeItem;
(window as any).emptyCart = emptyCart;

renderCart();
updateCartCount();
