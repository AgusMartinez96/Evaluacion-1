import { PRODUCTS } from "../../../data/data";

const productList = document.getElementById("product-list");

const renderProducts = () => {
  if (!productList) return;

  productList.innerHTML = "";

  PRODUCTS.forEach((p) => {
    if (!p.disponible) return; // no mostrar productos no disponibles

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

renderProducts();
