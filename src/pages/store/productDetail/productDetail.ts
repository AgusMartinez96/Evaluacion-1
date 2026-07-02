import { getProductos } from "../../../utils/fetch";
import { navigate } from "../../../utils/navigate";
import { getUSer, removeUser } from "../../../utils/localStorage";
import type { Product } from "../../../types/product";

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

const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = count.toString();
};

const initPage = async () => {
  // Obtener ID del producto desde la URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    navigate("/src/pages/store/home/home.html");
    return;
  }

  const productos = await getProductos();
  const producto: Product | undefined = productos.find((p) => p.id === parseInt(id));

  if (!producto) {
    navigate("/src/pages/store/home/home.html");
    return;
  }

  const container = document.getElementById("product-detail");
  if (!container) return;

  container.innerHTML = `
    <button id="btn-volver">← Volver al catálogo</button>
    <div class="detail-card">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="detail-info">
        <h1>${producto.nombre}</h1>
        <p>${producto.descripcion}</p>
        <p><strong>Precio:</strong> $${producto.precio}</p>
        <p><strong>Stock disponible:</strong> ${producto.stock}</p>
        <p><strong>Estado:</strong> ${producto.disponible ? "Disponible" : "No disponible"}</p>

        <div class="cantidad-selector">
          <label for="cantidad">Cantidad:</label>
          <button id="btn-menos">-</button>
          <span id="cantidad">1</span>
          <button id="btn-mas">+</button>
        </div>

        <button id="btn-agregar" ${!producto.disponible || producto.stock === 0 ? "disabled" : ""}>
          Agregar al Carrito
        </button>
        <p id="mensaje-confirmacion"></p>
      </div>
    </div>
  `;

  let cantidad = 1;
  const cantidadEl = document.getElementById("cantidad") as HTMLSpanElement;
  const btnMenos = document.getElementById("btn-menos") as HTMLButtonElement;
  const btnMas = document.getElementById("btn-mas") as HTMLButtonElement;
  const btnAgregar = document.getElementById("btn-agregar") as HTMLButtonElement;
  const mensaje = document.getElementById("mensaje-confirmacion") as HTMLParagraphElement;

  btnMenos.addEventListener("click", () => {
    if (cantidad > 1) {
      cantidad--;
      cantidadEl.textContent = cantidad.toString();
    }
  });

  btnMas.addEventListener("click", () => {
    if (cantidad < producto.stock) {
      cantidad++;
      cantidadEl.textContent = cantidad.toString();
    } else {
      alert(`Stock máximo disponible: ${producto.stock}`);
    }
  });

  btnAgregar.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.id === producto.id);

    if (existing) {
      const newQty = existing.quantity + cantidad;
      if (newQty > producto.stock) {
        alert(`No podés agregar más de ${producto.stock} unidades`);
        return;
      }
      existing.quantity = newQty;
    } else {
      cart.push({
        id: producto.id,
        name: producto.nombre,
        price: producto.precio,
        quantity: cantidad,
        image: producto.imagen,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    mensaje.textContent = "Producto agregado al carrito";
    setTimeout(() => mensaje.textContent = "", 2000);
  });

  document.getElementById("btn-volver")?.addEventListener("click", () => {
    navigate("/src/pages/store/home/home.html");
  });

  updateCartCount();
};

initPage();