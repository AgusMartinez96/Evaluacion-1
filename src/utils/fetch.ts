import type { ICategory } from "../types/category";
import type { Product } from "../types/product";
import type { IUser } from "../types/IUser";
import type { Pedido } from "../types/Pedido";

export async function getCategorias(): Promise<ICategory[]> {
  const res = await fetch("/data/categorias.json");
  return res.json();
}

export async function getProductos(): Promise<Product[]> {
  const res = await fetch("/data/productos.json");
  return res.json();
}

export async function getUsuarios(): Promise<IUser[]> {
  const res = await fetch("/data/usuarios.json");
  return res.json();
}

export async function getPedidos(): Promise<Pedido[]> {
  const res = await fetch("/data/pedidos.json");
  return res.json();
}