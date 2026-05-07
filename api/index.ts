/**
 * Vercel Serverless Function: export the Express app as the default handler.
 */
import { createServer } from "../server/index.js"

const app = createServer()
export default app
