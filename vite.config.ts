import { defineConfig } from "vite";
import * as path from "node:path";
import react from "@vitejs/plugin-react";
export default defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      configs: path.resolve(__dirname, "src/configs"),
      components: path.resolve(__dirname, "src/components"),
      constant: path.resolve(__dirname, "src/constants"),
      assets: path.resolve(__dirname, "src/assets"),
      context: path.resolve(__dirname, "./src/context"),
      hooks: path.resolve(__dirname, "src/hooks"),
      interfaces: path.resolve(__dirname, "src/interfaces"),
      modules: path.resolve(__dirname, "src/modules"),
      routes: path.resolve(__dirname, "src/routes"),
      services: path.resolve(__dirname, "src/services"),
      templates: path.resolve(__dirname, "src/templates"),
      utils: path.resolve(__dirname, "src/utils"),
      secrets: path.resolve(__dirname, "./secrets.json"),
    },
  },
});
