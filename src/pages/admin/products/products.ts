import { checkAuhtUser, logout } from "../../../utils/auth";
import { getCategorias, getProductos } from "../../../utils/fetch";
import type { Product } from "../../../types/product";
import type { ICategory } from "../../../types/category";

checkAuhtUser(
  "/src/pages/auth/login/login.html",
  "/src/pages/client/orders/orders.html",
  "ADMIN"
);

document.getElementById("logoutButton")?.addEventListener("click", () => logout());

let productos: Product[] = [];
let categorias: ICategory[] = [];
let editandoId: number | null = null;

const modal = document.getElementById("modal") as HTMLDivElement;
const modalTitulo = document.getElementById("modal-titulo") as HTMLHeadingElement;
const inputNombre = document.getElementById("input-nombre") as HTMLInputElement;
const inputDescripcion = document.getElementById("input-descripcion") as HTMLTextAreaElement;
const inputPrecio = document.getElementById("input-precio") as HTMLInputElement;
const inputStock = document.getElementById("input-stock") as HTMLInputElement;
const inputCategoria = document.getElementById("input-categoria") as HTMLSelectElement;
const inputImagen = document.getElementById("input-imagen") as HTMLInputElement;
const inputDisponible = document.getElementById("input-disponible") as HTMLInputElement;

const getNombreCategoria = (categoriaId: number): string => {
  return categorias.find((c) => c.id === categoriaId)?.nombre || "Sin categoría";
};

const abrirModal = (producto?: Product) => {
  editandoId = producto ? producto.id : null;
  modalTitulo.textContent = producto ? "Editar Producto" : "Nuevo Producto";
  inputNombre.value = producto ? producto.nombre : "";
  inputDescripcion.value = producto ? producto.descripcion : "";
  inputPrecio.value = producto ? producto.precio.toString() : "";
  inputStock.value = producto ? producto.stock.toString() : "";
  inputImagen.value = producto ? producto.imagen : "";
  inputDisponible.checked = producto ? producto.disponible : true;
  inputCategoria.value = producto ? producto.categoriaId.toString() : "";
  modal.style.display = "flex";
};

const cerrarModal = () => {
  modal.style.display = "none";
  editandoId = null;
};

const renderTabla = () => {
  const tbody = document.getElementById("tbody-productos");
  if (!tbody) return;
  tbody.innerHTML = "";

  productos.filter((p) => !p.eliminado).forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td><img src="${p.imagen}" style="width:50px; height:50px; object-fit:cover"></td>
      <td>${p.nombre}</td>
      <td>${p.descripcion}</td>
      <td>$${p.precio}</td>
      <td>${getNombreCategoria(p.categoriaId)}</td>
      <td>${p.stock}</td>
      <td>${p.disponible ? "✅ Disponible" : "❌ No disponible"}</td>
      <td>
        <button onclick="editarProducto(${p.id})">Editar</button>
        <button onclick="eliminarProducto(${p.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

const editarProducto = (id: number) => {
  const producto = productos.find((p) => p.id === id);
  if (producto) abrirModal(producto);
};

const eliminarProducto = (id: number) => {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;
  if (!confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return;
  producto.eliminado = true;
  renderTabla();
};

document.getElementById("btn-nuevo")?.addEventListener("click", () => abrirModal());
document.getElementById("btn-cerrar-modal")?.addEventListener("click", cerrarModal);

document.getElementById("btn-guardar")?.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  const descripcion = inputDescripcion.value.trim();
  const precio = parseFloat(inputPrecio.value);
  const stock = parseInt(inputStock.value);
  const categoriaId = parseInt(inputCategoria.value);
  const imagen = inputImagen.value.trim();
  const disponible = inputDisponible.checked;

  if (!nombre) { alert("El nombre es obligatorio"); return; }
  if (isNaN(precio) || precio <= 0) { alert("El precio debe ser mayor a 0"); return; }
  if (isNaN(stock) || stock < 0) { alert("El stock debe ser mayor o igual a 0"); return; }
  if (!categoriaId) { alert("Seleccioná una categoría"); return; }

  if (editandoId !== null) {
    const producto = productos.find((p) => p.id === editandoId);
    if (producto) {
      producto.nombre = nombre;
      producto.descripcion = descripcion;
      producto.precio = precio;
      producto.stock = stock;
      producto.categoriaId = categoriaId;
      producto.imagen = imagen;
      producto.disponible = disponible;
    }
  } else {
    const nuevo: Product = {
      id: Math.max(...productos.map((p) => p.id), 0) + 1,
      nombre,
      descripcion,
      precio,
      stock,
      categoriaId,
      imagen,
      disponible,
      eliminado: false,
    };
    productos.push(nuevo);
  }

  cerrarModal();
  renderTabla();
});

(window as any).editarProducto = editarProducto;
(window as any).eliminarProducto = eliminarProducto;

const initPage = async () => {
  [categorias, productos] = await Promise.all([getCategorias(), getProductos()]);

  // Cargar categorías en el select
  categorias.filter((c) => !c.eliminado).forEach((c) => {
    const option = document.createElement("option");
    option.value = c.id.toString();
    option.textContent = c.nombre;
    inputCategoria.appendChild(option);
  });

  renderTabla();
};

initPage();