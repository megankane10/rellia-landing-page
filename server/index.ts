import "./loadEnv"
import cors from "cors"
import express, { type Request, type RequestHandler } from "express"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { handleDemo } from "./routes/demo"
import { handleContactSubmit } from "./routes/contact"
import { handleCreateEmbeddedCheckout } from "./routes/stripe-embedded-checkout"
import { handleStripeWebhook } from "./routes/stripe-webhook"
import { handleDiagnosticAnalysis } from "./routes/diagnostic-analysis"

const headerOne = (req: Request, name: string): string | undefined => {
  const v = req.headers[name]
  if (Array.isArray(v)) return v[0]
  return typeof v === "string" ? v : undefined
}

/** vercel.json rewrites /api/* → /api; restore the real path so Express routes match */
const fixVercelRewrittenApiPath: RequestHandler = (req, _res, next) => {
  if (!process.env.VERCEL) {
    next()
    return
  }
  try {
    const u = new URL(req.url, "http://v.internal")
    const path = u.pathname
    if (path !== "/api" && path !== "/api/") {
      next()
      return
    }
    const candidate = headerOne(req, "x-invoke-path") || headerOne(req, "x-matched-path")
    if (!candidate?.startsWith("/api/")) {
      next()
      return
    }
    const pathOnly = candidate.split("?")[0] ?? ""
    if (!pathOnly || pathOnly === "/api" || pathOnly === "/api/") {
      next()
      return
    }
    req.url = pathOnly + (u.search || "")
  } catch {
    // leave req.url
  }
  next()
}

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests, please try again later" },
})

const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests, please try again later" },
})

const diagnosticLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests, please try again later" },
})

export function createServer() {
  const app = express()

  app.use(fixVercelRewrittenApiPath)

  // Security headers
  app.use(helmet())

  // CORS — only allow explicitly configured origins
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : []

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, server-to-server)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        callback(new Error(`Origin ${origin} not allowed by CORS`))
      },
      credentials: true,
    })
  )

  // Stripe webhook must receive the raw body — register BEFORE express.json()
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook)

  // Body parsers with size limit
  app.use(express.json({ limit: "16kb" }))
  app.use(express.urlencoded({ extended: true, limit: "16kb" }))

  // Routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping"
    res.json({ message: ping })
  })

  app.get("/api/demo", handleDemo)
  app.post("/api/contact", contactLimiter, handleContactSubmit)
  app.post("/api/create-embedded-checkout", checkoutLimiter, handleCreateEmbeddedCheckout)
  app.post("/api/diagnostic-analysis", diagnosticLimiter, handleDiagnosticAnalysis)

  return app
}
