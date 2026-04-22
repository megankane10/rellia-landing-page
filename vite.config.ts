import { defineConfig, Plugin } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { vitePrerenderPlugin } from "vite-prerender-plugin"
import { createServer } from "./server"
import { PRERENDER_PATHS } from "./client/config/seo"

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared", path.resolve(__dirname, "./index.html")],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [
    react(),
    expressPlugin(),
    ...vitePrerenderPlugin({
      renderTarget: "#root",
      prerenderScript: path.resolve(__dirname, "./client/prerender.tsx"),
      additionalPrerenderRoutes: PRERENDER_PATHS,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
    dedupe: ["react", "react-dom"],
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
