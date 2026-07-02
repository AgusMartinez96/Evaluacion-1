import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        register: resolve(__dirname, "src/pages/auth/register/register.html"),
        adminHome: resolve(__dirname, "src/pages/admin/adminHome/home.html"),
        storeHome: resolve(__dirname, "src/pages/store/home/home.html"),
        storeCart: resolve(__dirname, "src/pages/store/cart/cart.html"),
        productDetail: resolve(__dirname, "src/pages/store/productDetail/productDetail.html"),
        clientOrders: resolve(__dirname, "src/pages/client/orders/orders.html"),
      },
    },
  },
  base: "",
});