import { navigate } from "../../../utils/navigate";
import { getUSer, removeUser } from "../../../utils/localStorage";
import { getProductos } from "../../../utils/fetch";

const user = getUSer();
if (!user) {
  navigate("/src/pages/auth/login/login.html");
}

document.getElementById("logoutButton")?.addEventListener("click", () => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
});

const getColorEstado = (estado: string): string => {
  switch (estado) {
    case "PENDIENTE": return "orange";
    case "CONFIRMADO": return "blue";
    case "TERMINADO": return "green";
    case "CANCELADO": return "red";
    default: return "gray";
  }
};

const abrirModal = (pedido: any, productos: any[]) => {
  const existing = document.getElementById("modal-pedido");
  if (existing) existing.remove();

  const detallesHTML = pedido.detalles.map((d: any) => {
    const producto = productos.find((p: any) => p.id === d.idProducto);
    return `<p>${producto ? producto.nombre : `Producto #${d.idProducto}`} x${d.cantidad} — $${d.subtotal}</p>`;
  }).join("");

  const modal = document.createElement("div");
  modal.id = "modal-pedido";
  modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000";
  modal.innerHTML = `
    <div style="background:white;padding:24px;border-radius:8px;max-width:500px;width:90%">
      <h2>Detalle del Pedido #${pedido.id}</h2>
      <p><strong>Fecha:</strong> ${pedido.fecha}</p>
      <p><strong>Estado:</strong> <span style="color:${getColorEstado(pedido.estado)}">${pedido.estado}</span></p>
      <p><strong>Forma de pago:</strong> ${pedido.formaPago}</p>
      <hr>
      <h3>Productos</h3>
      ${detallesHTML}
      <hr>
      <p><strong>Total: $${pedido.total}</strong></p>
      <button id="btn-cerrar-modal">Cerrar</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById("btn-cerrar-modal")?.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
};

const initPage = async () => {
  const userData = JSON.parse(getUSer() || "{}");
  const todosPedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
  const misPedidos = todosPedidos.filter((p: any) => p.idUsuario === userData.id);
  const productos = await getProductos();

  const container = document.getElementById("orders-list");
  if (!container) return;

  if (misPedidos.length === 0) {
    container.innerHTML = `
      <p>No tenés pedidos aún.</p>
      <a href="/src/pages/store/home/home.html">← Ir a la tienda</a>
    `;
    return;
  }

  misPedidos.forEach((pedido: any) => {
    const primeros3 = pedido.detalles.slice(0, 3).map((d: any) => {
      const producto = productos.find((p: any) => p.id === d.idProducto);
      return producto ? `${producto.nombre} x${d.cantidad}` : `Producto #${d.idProducto}`;
    }).join(", ");

    const card = document.createElement("div");
    card.className = "order-card";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center">
        <h3>Pedido #${pedido.id}</h3>
        <span style="background:${getColorEstado(pedido.estado)}; color:white; padding:4px 10px; border-radius:12px">
          ${pedido.estado}
        </span>
      </div>
      <p>Fecha: ${pedido.fecha}</p>
      <p>Productos: ${primeros3}</p>
      <p><strong>Total: $${pedido.total}</strong></p>
    `;

    card.addEventListener("click", () => abrirModal(pedido, productos));
    container.appendChild(card);
  });
};

initPage();