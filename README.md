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

## Estructura del proyecto📦 primer_parcial/
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


El costo de envío es una constante fija de $0 (ENVIO = 0) definida en src/pages/store/cart/cart.ts.