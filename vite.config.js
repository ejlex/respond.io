import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
// import basicSsl from "@vitejs/plugin-basic-ssl"; //dev env https

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // basicSsl(),
  ],
  server: {
    proxy: {
      // This creates a virtual path '/api'
      "/api": {
        target: "https://respond-io-fe-bucket.s3.ap-southeast-1.amazonaws.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
