import { getCategorias, getProductos } from "../../../utils/fetch";
import { checkAuhtUser } from "../../../utils/auth";
import type { Product } from "../../../types/product";

checkAuhtUser("/src/pages/auth/login/login.html", "/src/pages/auth/login/login.html", "USUARIO");

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search") as HTMLInputElement;
const categoryList = document.getElementById("category-list");

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
  productList.innerHTML = "";

  const filtered = allProducts.filter((p) => {
    if (!p.disponible || p.eliminado) return false;
    if (searchTerm && !p.nombre.toLowerCase().includes(searchTerm)) return false;
    if (selectedCategory && p.categoriaId.toString() !== selectedCategory) return false;
    return true;
  });

  if (filtered.length === 0) {
    productList.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" class="product-img">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button onclick="addToCart(${p.id})">Agregar</button>
    `;
    productList.appendChild(card);
  });
};

const addToCart = (productId: number) => {
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

const initPage = async () => {
  const [categorias, productos] = await Promise.all([getCategorias(), getProductos()]);

  allProducts = productos;

  const todosLi = document.createElement("li");
  todosLi.textContent = "Todos";
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