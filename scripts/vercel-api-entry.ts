/**
 * esbuild bundles this to `api/index.js` for Vercel. Do not import `../server/*` from a loose
 * `api/*.ts` file — Node ESM on Vercel cannot resolve extensionless `../server/index` at runtime.
 */
import { createServer } from "../server/index.js"

const app = createServer()
export default app
