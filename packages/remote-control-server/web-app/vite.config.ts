import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  base: "/app/",
  server: {
    port: 5180,
    proxy: {
      "/web": "http://localhost:3666",
      "/v1": "http://localhost:3666",
      "/v2": "http://localhost:3666",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "markdown": ["react-markdown", "remark-gfm"],
          "syntax": ["react-syntax-highlighter"],
        },
      },
    },
  },
});
