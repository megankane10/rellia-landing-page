/**
 * Vercel API bundle. Do not use `packages=bundle` without `external: ['dotenv']` —
 * esbuild will crawl into dotenv and emit broken dynamic `require('fs')` in ESM.
 *
 * `packages: 'external'` keeps Express and peers as runtime imports (Vercel installs deps).
 */
import * as esbuild from "esbuild"

/** @type {esbuild.BuildOptions} */
await esbuild.build({
  entryPoints: ["scripts/vercel-api-entry.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: "api/index.js",
  packages: "external",
  external: ["dotenv"],
  logLevel: "info",
})
