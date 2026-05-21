import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import { createServer } from "./server";
import { PRERENDER_PATHS } from "./client/config/seo";
import { fetchStorySlugsForPrerender } from "./shared/cms/prerenderSanity";

const getVercelSiteUrl = (): string | undefined => {
  const raw = process.env.VITE_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (!vercelUrl) return undefined;

  const normalized = vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!normalized) return undefined;
  return `https://${normalized}`;
};

const getOgImageVersion = (): string => {
  const explicit = process.env.VITE_OG_IMAGE_VERSION?.trim();
  if (explicit) return explicit;

  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.trim();
  if (sha) return sha;

  return new Date().toISOString().slice(0, 10);
};

const buildPrerenderRoutes = async (): Promise<string[]> => {
  const cmsStoryPaths = (await fetchStorySlugsForPrerender()).map(
    (slug) => `/stories/${slug}`,
  );
  return [...new Set([...PRERENDER_PATHS, ...cmsStoryPaths])];
};

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const additionalPrerenderRoutes = await buildPrerenderRoutes();

  return {
  server: {
    host: "127.0.0.1",
    port: 5173,
    fs: {
      allow: ["./client", "./shared", path.resolve(__dirname, "./index.html")],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  // Vite's `%VITE_*%` HTML replacement only uses `loadEnv` results, not `define`.
  // We also prerender HTML at build time, so we need a reliable deployment URL
  // even when `VITE_SITE_URL` isn't explicitly set.
  envPrefix: "VITE_",
  define: {
    // Ensure prerender + index.html use the current Vercel deployment URL (preview/prod),
    // while still allowing explicit override via VITE_SITE_URL.
    "import.meta.env.VITE_SITE_URL": JSON.stringify(
      getVercelSiteUrl() ?? "https://www.relliahealth.com",
    ),
    // Used for OG image cache-busting (social crawlers cache by URL).
    "import.meta.env.VITE_OG_IMAGE_VERSION":
      JSON.stringify(getOgImageVersion()),
  },
  build: {
    outDir: "dist/spa",
    // Vercel logs warn when large chunks exceed 500kb. This is a marketing SPA with heavy
    // libraries; we still rely on route-level prerendering + CDN caching.
    chunkSizeWarningLimit: 2000,
  },
  plugins: [
    react(),
    expressPlugin(),
    {
      name: "html-og-env",
      transformIndexHtml(html) {
        const siteUrl = getVercelSiteUrl() ?? "https://www.relliahealth.com";
        const version = getOgImageVersion();
        return html
          .split("%VITE_SITE_URL%")
          .join(siteUrl)
          .split("%VITE_OG_IMAGE_VERSION%")
          .join(version);
      },
    },
    ...vitePrerenderPlugin({
      renderTarget: "#root",
      prerenderScript: path.resolve(__dirname, "./client/prerender.tsx"),
      additionalPrerenderRoutes,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
    dedupe: ["react", "react-dom"],
  },
};
});

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
