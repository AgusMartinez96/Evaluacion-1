# FoodStore - Frontend Web

## Descripción
FoodStore es una aplicación web frontend desarrollada con Vite + TypeScript.
Permite gestionar un sistema de pedidos de comida con catálogo, carrito, autenticación y panel de administración.
Los datos se consumen desde archivos JSON locales mediante fetch().

## Tecnologías
- Vite
- TypeScript
- HTML5 / CSS3

## Instrucciones para ejecutar
1. Descargar y descomprimir el archivo `.zip` del proyecto.
2. Abrir una terminal en la carpeta raíz del proyecto.
3. Instalar dependencias:
```bash
npm install
```
4. Levantar el servidor de desarrollo:
```bash
npm run dev
```
5. Abrir el navegador en `http://localhost:5173`

## Credenciales de prueba
| Rol | Email | Contraseña |
|-----|-------|------------|
| ADMIN | admin@admin.com | 123456 |
| USUARIO | cliente@food.com | cliente123 |

## Nota sobre el envío
El costo de envío es una constante fija de $0 (`ENVIO = 0`) definida en `src/pages/store/cart/cart.ts`.

## Estructura del proyecto
```
final-prog3/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── data/
│       ├── categorias.json
│       ├── productos.json
│       ├── usuarios.json
│       └── pedidos.json
└── src/
    ├── types/
    │   ├── category.ts
    │   ├── IUser.ts
    │   ├── Pedido.ts
    │   ├── product.ts
    │   └── Rol.ts
    ├── utils/
    │   ├── auth.ts
    │   ├── fetch.ts
    │   ├── localStorage.ts
    │   └── navigate.ts
    └── pages/
        ├── auth/
        │   ├── login/
        │   └── register/
        ├── store/
        │   ├── home/
        │   ├── productDetail/
        │   └── cart/
        ├── client/
        │   └── orders/
        └── admin/
            ├── adminHome/
            ├── categories/
            ├── products/
            └── orders/
```