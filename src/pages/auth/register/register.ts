import { getUsuarios } from "../../../utils/fetch";
import { saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import type { IUser } from "../../../types/IUser";

const form = document.getElementById("form-register") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = (document.getElementById("nombre") as HTMLInputElement).value.trim();
  const email = (document.getElementById("email") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value.trim();

  // Validaciones
  if (!nombre || !email || !password) {
    alert("Por favor completá todos los campos");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("El email no tiene un formato válido");
    return;
  }

  if (password.length < 6) {
    alert("La contraseña debe tener mínimo 6 caracteres");
    return;
  }

  // Verificar que el email no esté en uso
  const usuarios = await getUsuarios();
  const existe = usuarios.find((u) => u.mail === email);
  if (existe) {
    alert("Ya existe un usuario con ese email");
    return;
  }

  // Crear nuevo usuario (solo en memoria, no se persiste en el JSON)
  const nuevoUsuario: IUser = {
    id: Date.now(),
    nombre: nombre,
    apellido: "",
    mail: email,
    celular: "",
    rol: "USUARIO",
  };

  // Auto-login
  saveUser(nuevoUsuario);
  navigate("/src/pages/store/home/home.html");
});