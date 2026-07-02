import { checkAuhtUser, logout } from "../../../utils/auth";
import { getCategorias, getProductos, getPedidos } from "../../../utils/fetch";

checkAuhtUser(
  "/src/pages/auth/login/login.html",
  "/src/pages/client/orders/orders.html",
  "ADMIN"
);

document.getElementById("logoutButton")?.addEventListener("click", () => logout());

const initPage = async () => {
  const [categorias, productos, pedidos] = await Promise.all([
    getCategorias(),
    getProductos(),
    getPedidos(),
  ]);

  // 4 tarjetas de estadísticas
  const categoriasActivas = categorias.filter((c) => !c.eliminado);
  const productosActivos = productos.filter((p) => !p.eliminado);
  const productosDisponibles = productos.filter((p) => !p.eliminado && p.disponible);

  document.getElementById("total-categorias")!.textContent = categoriasActivas.length.toString();
  document.getElementById("total-productos")!.textContent = productosActivos.length.toString();
  document.getElementById("total-pedidos")!.textContent = pedidos.length.toString();
  document.getElementById("total-disponibles")!.textContent = productosDisponibles.length.toString();

  // Panel de resumen
  const resumen = document.getElementById("resumen");
  if (!resumen) return;

  const productosInactivos = productosActivos.filter((p) => !p.disponible);
  const pedidosPorEstado = ["PENDIENTE", "CONFIRMADO", "TERMINADO", "CANCELADO"].map((estado) => {
    const count = pedidos.filter((p) => p.estado === estado).length;
    return `<p>${estado}: ${count}</p>`;
  }).join("");

  resumen.innerHTML = `
    <p>Categorías activas: ${categoriasActivas.length}</p>
    <p>Productos activos: ${productosActivos.length}</p>
    <p>Productos inactivos: ${productosInactivos.length}</p>
    <h3>Pedidos por estado</h3>
    ${pedidosPorEstado}
  `;
};

initPage();