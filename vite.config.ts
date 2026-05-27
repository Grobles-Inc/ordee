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
    alias: [
      { find: "~/features", replacement: path.resolve(__dirname, "./features") },
      { find: "~/components", replacement: path.resolve(__dirname, "./components") },
      { find: "~/server", replacement: path.resolve(__dirname, "./server") },
      { find: "~/lib", replacement: path.resolve(__dirname, "./lib") },
      { find: "~/hooks", replacement: path.resolve(__dirname, "./hooks") },
      { find: "~", replacement: path.resolve(__dirname, "./app") },
    ],
  },
});
