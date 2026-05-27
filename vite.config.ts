import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./app/routes",
      generatedRouteTree: "./app/routeTree.gen.ts",
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
      "~/features": path.resolve(__dirname, "./features"),
      "~/components": path.resolve(__dirname, "./components"),
      "~/server": path.resolve(__dirname, "./server"),
      "~/lib": path.resolve(__dirname, "./lib"),
      "~/hooks": path.resolve(__dirname, "./hooks"),
    },
  },
});
