const renderCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  console.log("Carrito cargado:", cart); 

  const cartContainer = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");

  if (!cartContainer || !totalContainer) {
    console.error("No se encontraron los contenedores en el HTML");
    return;
  }

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item: any) => {
    const row = document.createElement("div");
    row.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
    cartContainer.appendChild(row);

    total += item.price * item.quantity;
  });

  totalContainer.textContent = `Total: $${total}`;
};

renderCart();
