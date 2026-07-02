import { getProductos } from "../../../utils/fetch";
import { navigate } from "../../../utils/navigate";
import { getUSer, removeUser } from "../../../utils/localStorage";
import type { IUser } from "../../../types/IUser";

// Guard de sesión
const user = getUSer();
if (!user) {
  navigate("/src/pages/auth/login/login.html");
}

// Logout
document.getElementById("logoutButton")?.addEventListener("click", () => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
});

const ENVIO = 0; // Constante de envío documentada en README

const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = count.toString();
};

const renderCart = async () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCartEl = document.getElementById("empty-cart");
  const cartContentEl = document.getElementById("cart-content");

  if (!cartItemsContainer) return;

  // Estado vacío
  if (cart.length === 0) {
    if (emptyCartEl) emptyCartEl.style.display = "block";
    if (cartContentEl) cartContentEl.style.display = "none";
    updateCartCount();
    return;
  }

  if (emptyCartEl) emptyCartEl.style.display = "none";
  if (cartContentEl) cartContentEl.style.display = "block";

  // Cargar productos para validar stock
  const productos = await getProductos();
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item: any) => {
    const producto = productos.find((p) => p.id === item.id);
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="item-img">
      <div class="item-info">
        <p><strong>${item.name}</strong></p>
        <p>$${item.price} x ${item.quantity} = $${item.price * item.quantity}</p>
      </div>
      <div class="item-actions">
        <button onclick="updateQuantity(${item.id}, -1)">–</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, 1)" ${producto && item.quantity >= producto.stock ? "disabled" : ""}>+</button>
        <button onclick="removeItem(${item.id})">Eliminar</button>
      </div>
    `;
    cartItemsContainer.appendChild(row);
    subtotal += item.price * item.quantity;
  });

  const total = subtotal + ENVIO;
  const subtotalEl = document.getElementById("cart-subtotal");
  const envioEl = document.getElementById("cart-envio");
  const totalEl = document.getElementById("cart-total");
  if (subtotalEl) subtotalEl.textContent = `$${subtotal}`;
  if (envioEl) envioEl.textContent = `$${ENVIO}`;
  if (totalEl) totalEl.textContent = `$${total}`;

  updateCartCount();
};

const updateQuantity = async (productId: number, change: number) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const productos = await getProductos();
  const producto = productos.find((p) => p.id === productId);
  const item = cart.find((i: any) => i.id === productId);

  if (item) {
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      cart.splice(cart.indexOf(item), 1);
    } else if (producto && newQty > producto.stock) {
      alert(`Stock máximo disponible: ${producto.stock}`);
      return;
    } else {
      item.quantity = newQty;
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

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

// Checkout
document.getElementById("btn-checkout")?.addEventListener("click", () => {
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) checkoutForm.style.display = "block";
});

document.getElementById("btn-cancelar")?.addEventListener("click", () => {
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) checkoutForm.style.display = "none";
});

document.getElementById("btn-confirmar")?.addEventListener("click", () => {
  const telefono = (document.getElementById("telefono") as HTMLInputElement).value.trim();
  const formaPago = (document.getElementById("forma-pago") as HTMLSelectElement).value;

  if (!telefono || !formaPago) {
    alert("Por favor completá todos los campos");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const subtotal = cart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const total = subtotal + ENVIO;
  const userData = JSON.parse(getUSer() || "{}") as IUser;

  const pedido = {
    id: Date.now(),
    fecha: new Date().toISOString().split("T")[0],
    estado: "PENDIENTE",
    total: total,
    formaPago: formaPago,
    idUsuario: userData.id,
    detalles: cart.map((item: any) => ({
      idProducto: item.id,
      cantidad: item.quantity,
      subtotal: item.price * item.quantity,
    })),
  };

  // Guardar pedido en localStorage
  const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  // Limpiar carrito
  localStorage.setItem("cart", JSON.stringify([]));

  alert("¡Pedido confirmado!");
  navigate("/src/pages/client/orders/orders.html");
});

(window as any).updateQuantity = updateQuantity;
(window as any).removeItem = removeItem;
(window as any).emptyCart = emptyCart;

document.getElementById("btn-vaciar")?.addEventListener("click", emptyCart);

renderCart();
updateCartCount();