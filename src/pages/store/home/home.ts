import { PRODUCTS, getCategories } from "../../../data/data";

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search") as HTMLInputElement;
const categoryList = document.getElementById("category-list");

// Renderizar categorias en la lista
getCategories().forEach((c) => {
  const li = document.createElement("li");
  li.textContent = c.nombre;
  li.setAttribute("data-id", c.id.toString());
  categoryList?.appendChild(li);
});

// Renderizar productos con filtro
const renderProducts = (selectedCategory: string = "") => {
  if (!productList) return;

  const searchTerm = searchInput.value.toLowerCase();
  productList.innerHTML = "";

  const filtered = PRODUCTS.filter((p) => {
    if (!p.disponible) return false;
    if (searchTerm && !p.nombre.toLowerCase().includes(searchTerm)) return false;
    if (selectedCategory && !p.categorias.some(c => c.id.toString() === selectedCategory)) return false;
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
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      cart.push({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        quantity: 1,
        image: product.imagen
      });
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  const card = document.querySelector(`.product-card button[onclick="addToCart(${productId})"]`)?.parentElement;
  const button = card?.querySelector("button");

  if (card && button) {
    card.classList.add("added");
    button.classList.add("added");

    const originalText = button.textContent;
    button.textContent = "Agregado";

    setTimeout(() => {
      card.classList.remove("added");
      button.classList.remove("added");
      button.textContent = originalText;
    }, 1000);
  }
};

const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = count.toString();
  }
};

(window as any).addToCart = addToCart;

// Eventos de búsqueda
searchInput.addEventListener("input", () => renderProducts());

// Evento de click en categorías
categoryList?.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName === "LI") {
    const selectedCategory = target.getAttribute("data-id") || "";

    // Marcar activo
    categoryList.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    target.classList.add("active");

    renderProducts(selectedCategory);
  }
});

renderProducts();
updateCartCount();
