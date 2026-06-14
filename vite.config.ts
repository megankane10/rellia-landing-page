import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import { createServer } from "./server";
import {
  AUTH_SHELL_PRERENDER_PATHS,
  isClientOnlyAuthPath,
  PRERENDER_PATHS,
  SHOWCASE_PRERENDER_PATHS,
} from "./client/config/seo";
import {
  fetchAdvisorProfilePathsForPrerender,
  fetchAlumniProfilePathsForPrerender,
  fetchCareersRolePathsForPrerender,
  fetchProgramSlugsForPrerender,
  fetchStorySlugsForPrerender,
  fetchEventSlugsForPrerender,
  fetchCmsPageSlugsForPrerender,
} from "./shared/cms/prerenderSanity";

const getBuildSiteUrl = (): string => {
  const explicit = process.env.VITE_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  if (process.env.VERCEL_ENV === "production") {
    return "https://www.relliahealth.com";
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (!vercelUrl) return "https://www.relliahealth.com";

  const normalized = vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
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
  const [
    cmsStoryPaths,
    cmsProgramPaths,
    cmsAdvisorPaths,
    cmsAlumniPaths,
    cmsCareersRolePaths,
    cmsEventPaths,
    cmsPagePaths,
  ] = await Promise.all([
    fetchStorySlugsForPrerender().then((slugs) =>
      slugs.map((slug) => `/stories/${slug}`),
    ),
    fetchProgramSlugsForPrerender().then((slugs) =>
      slugs.map((slug) => `/programs/${slug}`),
    ),
    fetchAdvisorProfilePathsForPrerender(),
    fetchAlumniProfilePathsForPrerender(),
    fetchCareersRolePathsForPrerender(),
    fetchEventSlugsForPrerender().then((slugs) =>
      slugs.map((slug) => `/events/${slug}`),
    ),
    fetchCmsPageSlugsForPrerender().then((slugs) =>
      slugs
        .filter((slug) => !isClientOnlyAuthPath(`/${slug}`))
        .map((slug) => `/${slug}`),
    ),
  ])
  return [
    ...new Set([
      ...PRERENDER_PATHS,
      ...AUTH_SHELL_PRERENDER_PATHS,
      ...SHOWCASE_PRERENDER_PATHS,
      ...cmsStoryPaths,
      ...cmsProgramPaths,
      ...cmsAdvisorPaths,
      ...cmsAlumniPaths,
      ...cmsCareersRolePaths,
      ...cmsEventPaths,
      ...cmsPagePaths,
    ]),
  ]
};

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const additionalPrerenderRoutes = await buildPrerenderRoutes();

  return {
  server: {
    host: "localhost",
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
    "import.meta.env.VITE_SITE_URL": JSON.stringify(getBuildSiteUrl()),
    // Used for OG image cache-busting (social crawlers cache by URL).
    "import.meta.env.VITE_OG_IMAGE_VERSION":
      JSON.stringify(getOgImageVersion()),
    "import.meta.env.VITE_VERCEL_GIT_COMMIT_REF": JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_REF ?? "",
    ),
  },
  build: {
    outDir: "dist/spa",
    // Avoid preloading the prerender-only chunk in the browser (stale preload → white screen).
    modulePreload: false,
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
        const siteUrl = getBuildSiteUrl();
        const version = getOgImageVersion();
        return html
          .split("%VITE_SITE_URL%")
          .join(siteUrl)
          .split("%VITE_OG_IMAGE_VERSION%")
          .join(version)
          .replace(
            /<link rel="modulepreload"[^>]*href="\/assets\/prerender-[^"]+"[^>]*>\s*/g,
            "",
          );
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
