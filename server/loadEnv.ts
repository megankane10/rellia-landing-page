import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

/** Vercel injects env at runtime; skip loading `.env` there. */
if (process.env.VERCEL !== "1") {
  const require = createRequire(import.meta.url)
  const dotenv = require("dotenv") as typeof import("dotenv")
  const serverDir = path.dirname(fileURLToPath(import.meta.url))
  dotenv.config({ path: path.resolve(serverDir, "..", ".env") })
}
