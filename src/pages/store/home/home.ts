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
    card.innerHTML = `
      <span>${p.nombre} - $${p.precio}</span>
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
      });
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

(window as any).addToCart = addToCart;

// Eventos de búsqueda y filtro
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

renderProducts();
