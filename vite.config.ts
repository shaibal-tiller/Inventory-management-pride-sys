import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 1. Add this import

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Add this to the plugins array
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://4.213.57.100:3100",
        changeOrigin: true,
        // Optional: ensure /api is preserved in the target request
        // since the target URL is http://4.213.57.100:3100/api
      },
    },
  },
});
