# FoodStore - Proyecto Frontend

## Descripción breve
FoodStore es una aplicación web frontend que simula un catálogo de productos con carrito de compras.  
Permite visualizar productos, filtrarlos por categoría, buscarlos por nombre y agregarlos al carrito con persistencia en `localStorage`.

## Funcionalidades principales
- Catálogo dinámico de productos con imágenes, nombre y precio.
- Barra de búsqueda para filtrar productos por nombre.
- Menú lateral para filtrar por categorías.
- Carrito de compras con contador en la navbar.
- Persistencia del carrito en `localStorage`.
- Resumen de compra con subtotal y total.

## ▶️ Instrucciones para ejecutar
1. Descargar y descomprimir el archivo `.zip` del proyecto.  
2. Abrir una terminal en la carpeta raíz del proyecto.  
3. Instalar dependencias:  
   ```bash
   pnpm install
4. Levantar el servidor de preview sobre el build ya generado:
   pnpm preview
5. Abrir el navegador en la dirección que aparece.
6. Desde ahí se puede navegar entre el catálogo y el carrito para probar todas las funcionalidades.


## Estructura del proyecto

📦 primer_parcial/
 ┣ 📂 home/
 ┃ ┣ 📄 home.html
 ┃ ┣ 📄 home.css
 ┃ ┗ 📄 home.ts
 ┣ 📂 cart/
 ┃ ┣ 📄 cart.html
 ┃ ┣ 📄 cart.css
 ┃ ┗ 📄 cart.ts
 ┣ 📂 data/
 ┃ ┗ 📄 data.ts
 ┣ 📄 vite.config.ts
 ┣ 📄 package.json
 ┣ 📄 tsconfig.json
 ┣ 📄 README.md
