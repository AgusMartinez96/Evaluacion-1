import type { ICategory } from "./categoria";

export interface Product {
  id: number;
  eliminado: boolean;
  createdAt: string;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  disponible: boolean;
  categorias: ICategory[]; // 👈 ojo, esto depende de que tengas ICategory importado
}
