import { checkAuhtUser, logout } from "../../../utils/auth";
import { getCategorias } from "../../../utils/fetch";
import type { ICategory } from "../../../types/category";

checkAuhtUser(
  "/src/pages/auth/login/login.html",
  "/src/pages/client/orders/orders.html",
  "ADMIN"
);

document.getElementById("logoutButton")?.addEventListener("click", () => logout());

let categorias: ICategory[] = [];
let editandoId: number | null = null;

const modal = document.getElementById("modal") as HTMLDivElement;
const modalTitulo = document.getElementById("modal-titulo") as HTMLHeadingElement;
const inputNombre = document.getElementById("input-nombre") as HTMLInputElement;
const inputDescripcion = document.getElementById("input-descripcion") as HTMLTextAreaElement;
const inputImagen = document.getElementById("input-imagen") as HTMLInputElement;

const abrirModal = (categoria?: ICategory) => {
  editandoId = categoria ? categoria.id : null;
  modalTitulo.textContent = categoria ? "Editar Categoría" : "Nueva Categoría";
  inputNombre.value = categoria ? categoria.nombre : "";
  inputDescripcion.value = categoria ? categoria.descripcion : "";
  inputImagen.value = categoria ? categoria.imagen : "";
  modal.style.display = "flex";
};

const cerrarModal = () => {
  modal.style.display = "none";
  editandoId = null;
};

const renderTabla = () => {
  const tbody = document.getElementById("tbody-categorias");
  if (!tbody) return;
  tbody.innerHTML = "";

  categorias.filter((c) => !c.eliminado).forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.imagen ? `<img src="${c.imagen}" style="width:50px; height:50px; object-fit:cover">` : "Sin imagen"}</td>
      <td>${c.nombre}</td>
      <td>${c.descripcion}</td>
      <td>
        <button onclick="editarCategoria(${c.id})">Editar</button>
        <button onclick="eliminarCategoria(${c.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

const editarCategoria = (id: number) => {
  const categoria = categorias.find((c) => c.id === id);
  if (categoria) abrirModal(categoria);
};

const eliminarCategoria = (id: number) => {
  const categoria = categorias.find((c) => c.id === id);
  if (!categoria) return;
  if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;
  categoria.eliminado = true;
  renderTabla();
};

document.getElementById("btn-nueva")?.addEventListener("click", () => abrirModal());
document.getElementById("btn-cerrar-modal")?.addEventListener("click", cerrarModal);

document.getElementById("btn-guardar")?.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  const descripcion = inputDescripcion.value.trim();
  const imagen = inputImagen.value.trim();

  if (!nombre) {
    alert("El nombre es obligatorio");
    return;
  }

  if (editandoId !== null) {
    const categoria = categorias.find((c) => c.id === editandoId);
    if (categoria) {
      categoria.nombre = nombre;
      categoria.descripcion = descripcion;
      categoria.imagen = imagen;
    }
  } else {
    const nueva: ICategory = {
      id: Math.max(...categorias.map((c) => c.id), 0) + 1,
      nombre,
      descripcion,
      imagen,
      eliminado: false,
    };
    categorias.push(nueva);
  }

  cerrarModal();
  renderTabla();
});

(window as any).editarCategoria = editarCategoria;
(window as any).eliminarCategoria = eliminarCategoria;

const initPage = async () => {
  categorias = await getCategorias();
  renderTabla();
};

initPage();