import { getCategorias, getProductos } from "../../../utils/fetch";
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

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search") as HTMLInputElement;
const categoryList = document.getElementById("category-list");
const orderSelect = document.getElementById("order") as HTMLSelectElement;

let allProducts: Product[] = [];
let selectedCategory: string = "";

const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = count.toString();
};

const renderProducts = () => {
  if (!productList) return;

  const searchTerm = searchInput?.value.toLowerCase() || "";
  const order = orderSelect?.value || "";
  productList.innerHTML = "";

  let filtered = allProducts.filter((p) => {
    if (!p.disponible || p.eliminado) return false;
    if (searchTerm && !p.nombre.toLowerCase().includes(searchTerm)) return false;
    if (selectedCategory && p.categoriaId.toString() !== selectedCategory) return false;
    return true;
  });

  // Ordenamiento
  if (order === "az") filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (order === "za") filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
  if (order === "asc") filtered.sort((a, b) => a.precio - b.precio);
  if (order === "desc") filtered.sort((a, b) => b.precio - a.precio);

  if (filtered.length === 0) {
    productList.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" class="product-img">
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      <p><strong>$${p.precio}</strong></p>
      <span class="badge ${p.disponible ? 'disponible' : 'no-disponible'}">
        ${p.disponible ? 'Disponible' : 'No disponible'}
      </span>
      <button onclick="addToCart(event, ${p.id})">Agregar al carrito</button>
    `;

    // Click en tarjeta redirige al detalle
    card.addEventListener("click", () => {
      navigate(`/src/pages/store/productDetail/productDetail.html?id=${p.id}`);
    });

    productList.appendChild(card);
  });
};

const addToCart = (event: Event, productId: number) => {
  event.stopPropagation(); // Evita que el click llegue a la tarjeta
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find((item: any) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      cart.push({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        quantity: 1,
        image: product.imagen,
      });
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${allProducts.find(p => p.id === productId)?.nombre} agregado al carrito`);
};

(window as any).addToCart = addToCart;

categoryList?.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName === "LI") {
    selectedCategory = target.getAttribute("data-id") || "";
    categoryList.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
    target.classList.add("active");
    renderProducts();
  }
});

searchInput?.addEventListener("input", () => renderProducts());
orderSelect?.addEventListener("change", () => renderProducts());

const initPage = async () => {
  const [categorias, productos] = await Promise.all([getCategorias(), getProductos()]);

  allProducts = productos;

  const todosLi = document.createElement("li");
  todosLi.textContent = "Todos los productos";
  todosLi.setAttribute("data-id", "");
  todosLi.classList.add("active");
  todosLi.addEventListener("click", () => {
    selectedCategory = "";
    categoryList?.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
    todosLi.classList.add("active");
    renderProducts();
  });
  categoryList?.appendChild(todosLi);

  categorias
    .filter((c) => !c.eliminado)
    .forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c.nombre;
      li.setAttribute("data-id", c.id.toString());
      categoryList?.appendChild(li);
    });

  renderProducts();
  updateCartCount();
};

initPage();