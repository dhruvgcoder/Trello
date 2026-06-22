import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/users": "http://localhost:3001",
      "/organization": "http://localhost:3001",
      "/boards": "http://localhost:3001",
      "/issues": "http://localhost:3001",
    },
  },
});
