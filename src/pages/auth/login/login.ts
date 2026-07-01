import { getUsuarios } from "../../../utils/fetch";
import { navigate } from "../../../utils/navigate";
import { saveUser } from "../../../utils/localStorage";

const form = document.getElementById("form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = (document.getElementById("email") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value.trim();

  if (!email || !password) {
    alert("Por favor completá todos los campos");
    return;
  }

  const usuarios = await getUsuarios();
  const usuario = usuarios.find((u) => u.mail === email && u.password === password);

  if (!usuario) {
    alert("Credenciales incorrectas");
    return;
  }

  const { password: _, ...usuarioSinPassword } = usuario;
  saveUser(usuarioSinPassword);

  if (usuario.rol === "ADMIN") {
    navigate("/src/pages/admin/adminHome/home.html");
  } else {
    navigate("/src/pages/store/home/home.html");
  }
});