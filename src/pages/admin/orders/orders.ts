import { checkAuhtUser, logout } from "../../../utils/auth";
import { getPedidos, getUsuarios, getProductos } from "../../../utils/fetch";
import type { Pedido } from "../../../types/Pedido";
import type { IUser } from "../../../types/IUser";
import type { Product } from "../../../types/product";

checkAuhtUser(
  "/src/pages/auth/login/login.html",
  "/src/pages/client/orders/orders.html",
  "ADMIN"
);

document.getElementById("logoutButton")?.addEventListener("click", () => logout());

let pedidos: Pedido[] = [];
let usuarios: IUser[] = [];
let productos: Product[] = [];

const getColorEstado = (estado: string): string => {
  switch (estado) {
    case "PENDIENTE": return "orange";
    case "CONFIRMADO": return "blue";
    case "TERMINADO": return "green";
    case "CANCELADO": return "red";
    default: return "gray";
  }
};

const getNombreUsuario = (idUsuario: number): string => {
  const u = usuarios.find((u) => u.id === idUsuario);
  return u ? `${u.nombre} ${u.apellido}` : `Usuario #${idUsuario}`;
};

const renderPedidos = (filtroEstado: string = "") => {
  const container = document.getElementById("orders-list");
  if (!container) return;
  container.innerHTML = "";

  const pedidosLocalStorage = JSON.parse(localStorage.getItem("pedidos") || "[]");
  const todosPedidos = [...pedidos, ...pedidosLocalStorage];

  const filtrados = todosPedidos
    .filter((p) => !filtroEstado || p.estado === filtroEstado)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  if (filtrados.length === 0) {
    container.innerHTML = "<p>No hay pedidos con ese estado.</p>";
    return;
  }

  filtrados.forEach((pedido) => {
    const card = document.createElement("div");
    card.style.cssText = "border:1px solid #ccc; padding:16px; margin:8px 0; border-radius:8px; cursor:pointer";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center">
        <h3>Pedido #${pedido.id}</h3>
        <span style="background:${getColorEstado(pedido.estado)}; color:white; padding:4px 10px; border-radius:12px">
          ${pedido.estado}
        </span>
      </div>
      <p>Cliente: ${getNombreUsuario(pedido.idUsuario)}</p>
      <p>Fecha: ${pedido.fecha}</p>
      <p>Productos: ${pedido.detalles.length}</p>
      <p><strong>Total: $${pedido.total}</strong></p>
    `;
    card.addEventListener("click", () => abrirModal(pedido));
    container.appendChild(card);
  });
};

const abrirModal = (pedido: any) => {
  const modal = document.getElementById("modal") as HTMLDivElement;
  const contenido = document.getElementById("modal-contenido") as HTMLDivElement;

  const detallesHTML = pedido.detalles.map((d: any) => {
    const producto = productos.find((p) => p.id === d.idProducto);
    return `<p>${producto ? producto.nombre : `Producto #${d.idProducto}`} x${d.cantidad} — $${d.subtotal}</p>`;
  }).join("");

  contenido.innerHTML = `
    <p><strong>Cliente:</strong> ${getNombreUsuario(pedido.idUsuario)}</p>
    <p><strong>Fecha:</strong> ${pedido.fecha}</p>
    <p><strong>Forma de pago:</strong> ${pedido.formaPago}</p>
    <p><strong>Estado actual:</strong> 
      <span style="color:${getColorEstado(pedido.estado)}">${pedido.estado}</span>
    </p>
    <hr>
    <h3>Productos</h3>
    ${detallesHTML}
    <hr>
    <p><strong>Total: $${pedido.total}</strong></p>
    <div>
      <label>Cambiar estado:</label>
      <select id="select-estado">
        <option value="PENDIENTE" ${pedido.estado === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
        <option value="CONFIRMADO" ${pedido.estado === "CONFIRMADO" ? "selected" : ""}>Confirmado</option>
        <option value="TERMINADO" ${pedido.estado === "TERMINADO" ? "selected" : ""}>Terminado</option>
        <option value="CANCELADO" ${pedido.estado === "CANCELADO" ? "selected" : ""}>Cancelado</option>
      </select>
      <button id="btn-guardar-estado">Guardar</button>
    </div>
  `;

  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  document.getElementById("btn-guardar-estado")?.addEventListener("click", () => {
    const nuevoEstado = (document.getElementById("select-estado") as HTMLSelectElement).value;
    pedido.estado = nuevoEstado;

    const pedidosLS = JSON.parse(localStorage.getItem("pedidos") || "[]");
    const idx = pedidosLS.findIndex((p: any) => p.id === pedido.id);
    if (idx !== -1) {
      pedidosLS[idx].estado = nuevoEstado;
      localStorage.setItem("pedidos", JSON.stringify(pedidosLS));
    }

    cerrarModal();
    const filtro = (document.getElementById("filtro-estado") as HTMLSelectElement).value;
    renderPedidos(filtro);
  });
};

const cerrarModal = () => {
  const modal = document.getElementById("modal") as HTMLDivElement;
  modal.style.display = "none";
};

document.getElementById("btn-cerrar-modal")?.addEventListener("click", cerrarModal);
document.getElementById("filtro-estado")?.addEventListener("change", (e) => {
  renderPedidos((e.target as HTMLSelectElement).value);
});

const initPage = async () => {
  [pedidos, usuarios, productos] = await Promise.all([
    getPedidos(),
    getUsuarios(),
    getProductos(),
  ]);
  renderPedidos();
};

initPage();