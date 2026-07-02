import type { IUser } from "../types/IUser";
import type { Rol } from "../types/Rol";
import { getUSer, removeUser } from "./localStorage";
import { navigate } from "./navigate";

export const checkAuhtUser = (
  redireccion1: string,
  redireccion2: string,
  rol: Rol
) => {
  const user = getUSer();
  if (!user) {
    navigate(redireccion1);
    return;
  }
  const parseUser: IUser = JSON.parse(user);
  if (parseUser.rol !== rol) {
    navigate(redireccion2);
    return;
  }
};

export const logout = () => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
};