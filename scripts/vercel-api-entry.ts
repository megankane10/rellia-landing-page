/**
 * esbuild bundles this to `api/index.js` for Vercel. Do not import `../server/*` from a loose
 * `api/*.ts` file — Node ESM on Vercel cannot resolve extensionless `../server/index` at runtime.
 */
import type { IncomingMessage, ServerResponse } from "node:http"
import type { Express } from "express"
import { createServer } from "../server/index.js"

let app: Express | undefined

const getApp = (): Express => {
  if (!app) app = createServer()
  return app
}

const handler = (req: IncomingMessage, res: ServerResponse) => {
  try {
    getApp()(req, res)
  } catch (err) {
    console.error("Vercel API handler error:", err)
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader("content-type", "application/json")
      res.end(JSON.stringify({ error: "Internal server error" }))
    }
  }
}

export default handler
