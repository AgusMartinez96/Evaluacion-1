import { PRODUCTS, getCategories } from "../../../data/data";

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search") as HTMLInputElement;
const categoryFilter = document.getElementById("category-filter") as HTMLSelectElement;

// Renderizar categorías en el select
getCategories().forEach((c) => {
  const option = document.createElement("option");
  option.value = c.id.toString();
  option.textContent = c.nombre;
  categoryFilter.appendChild(option);
});

const renderProducts = () => {
  if (!productList) return;

  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  productList.innerHTML = "";

  // Filtrar primero
  const filtered = PRODUCTS.filter((p) => {
    if (!p.disponible) return false;
    if (searchTerm && !p.nombre.toLowerCase().includes(searchTerm)) return false;
    if (selectedCategory && !p.categorias.some(c => c.id.toString() === selectedCategory)) return false;
    return true;
  });

  // Si no hay resultados, mostrar mensaje
  if (filtered.length === 0) {
    productList.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  // Renderizar los productos filtrados
  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card"; // Css
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
        image: product.imagen // Guardamos la imagen
      });
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));

   // Actualizar contador de carrito
  updateCartCount();
  
  // Efecto en la tarjeta y boton
  const card = document.querySelector(`.product-card button[onclick="addToCart(${productId})"]`)?.parentElement;
  const button = card?.querySelector("button");

  if (card && button) {
    card.classList.add("added");
    button.classList.add("added");

    // Cambiar texto del botón a "Agregado"
    const originalText = button.textContent;
    button.textContent = "Agregado ✅";

    setTimeout(() => {
      card.classList.remove("added");
      button.classList.remove("added");
      button.textContent = originalText; // vuelve a "Agregar"
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

// Eventos de búsqueda y filtro
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

renderProducts();
updateCartCount();

