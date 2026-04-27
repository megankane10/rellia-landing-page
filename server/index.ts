import "./loadEnv"
import cors from "cors"
import express, { type Request, type RequestHandler } from "express"
import helmet from "helmet"
import { z } from "zod"

const headerOne = (req: Request, name: string): string | undefined => {
  const v = req.headers[name]
  if (Array.isArray(v)) return v[0]
  return typeof v === "string" ? v : undefined
}

const getClientIp = (req: Request): string => {
  if (process.env.VERCEL) {
    const realIp = headerOne(req, "x-real-ip")?.trim()
    if (realIp) return realIp
  }
  const forwarded = headerOne(req, "x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  if (req.ip) return req.ip
  return "unknown"
}

/** vercel.json rewrites /api/* → /api; restore the real path so Express routes match */
const fixVercelRewrittenApiPath: RequestHandler = (req, _res, next) => {
  if (!process.env.VERCEL) {
    next()
    return
  }
  try {
    const u = new URL(req.url, "http://v.internal")
    const p = u.pathname
    if (p !== "/api" && p !== "/api/") {
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

export function createServer() {
  const app = express()

  app.use(fixVercelRewrittenApiPath)

  const isDev = process.env.NODE_ENV !== "production"

  // Default Helmet CSP blocks Vite's inline dev scripts (React Refresh / HMR), which yields a blank page locally.
  app.use(
    isDev
      ? helmet({
          contentSecurityPolicy: false,
          strictTransportSecurity: false,
        })
      : helmet(),
  )

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)

  if (!isDev && allowedOrigins.length === 0) {
    console.warn(
      "ALLOWED_ORIGINS is not set. CORS will allow all browser origins. Set ALLOWED_ORIGINS to restrict cross-origin requests.",
    )
  }

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) {
          cb(null, true)
          return
        }

        if (isDev) {
          cb(null, true)
          return
        }

        if (allowedOrigins.length === 0) {
          cb(null, true)
          return
        }

        cb(null, allowedOrigins.includes(origin))
      },
    }),
  )

  app.use(express.json({ limit: "32kb" }))
  app.use(express.urlencoded({ extended: true, limit: "32kb" }))

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true })
  })

  const diagnosticReportPayloadSchema = z.object({
    company: z.string().trim().min(1).max(200),
    stage: z.string().trim().min(1).max(120),
    desc: z.string().trim().min(1).max(600),
    sectionScoresMarkdown: z.string().trim().min(1).max(6000),
  })

  const diagnosticReportResponseSchema = z.object({
    summary: z.string(),
    top3_strengths: z.array(
      z.object({
        category: z.string(),
        score: z.number(),
        note: z.string(),
      }),
    ),
    top3_weaknesses: z.array(
      z.object({
        category: z.string(),
        score: z.number(),
        note: z.string(),
        priority: z.string(),
      }),
    ),
    recommendations: z.array(z.string()),
    mentor_areas_needed: z.array(z.string()),
  })

  type RateState = { windowStartMs: number; count: number }
  const perIpRate = new Map<string, RateState>()
  const RATE_WINDOW_MS = 60_000
  const RATE_MAX = 10
  const RATE_MAP_MAX = 5000

  app.post("/api/diagnostic-report", async (req, res) => {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
    if (!apiKey) {
      res.status(501).json({
        error: "Anthropic is not configured. Set ANTHROPIC_API_KEY in the server environment.",
      })
      return
    }

    const ip = getClientIp(req)
    const now = Date.now()

    if (perIpRate.size > RATE_MAP_MAX) {
      perIpRate.clear()
    }

    const current = perIpRate.get(ip)
    if (!current || now - current.windowStartMs > RATE_WINDOW_MS) {
      perIpRate.set(ip, { windowStartMs: now, count: 1 })
    } else {
      current.count += 1
      if (current.count > RATE_MAX) {
        res.status(429).json({ error: "Too many requests. Please try again shortly." })
        return
      }
    }

    const parsed = diagnosticReportPayloadSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() })
      return
    }

    const { company, stage, desc, sectionScoresMarkdown } = parsed.data
    const prompt = `You are a health tech startup advisor at Rellia Health.
Analyze this startup diagnostic and return ONLY valid JSON (no markdown, no backticks).
Company: ${company}
Stage: ${stage}
Product: ${desc}
Section scores:
${sectionScoresMarkdown}

Return this shape exactly:
{"summary":"2-3 sentences to founder in second person","top3_strengths":[{"category":"","score":0,"note":""}],"top3_weaknesses":[{"category":"","score":0,"note":"","priority":"Critical"}],"recommendations":[""],"mentor_areas_needed":[""]}`

    try {
      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{ role: "user", content: prompt }],
        }),
      })

      if (!anthropicRes.ok) {
        const text = await anthropicRes.text().catch(() => "")
        res.status(502).json({
          error: "Anthropic request failed",
          status: anthropicRes.status,
          ...(isDev ? { text } : {}),
        })
        return
      }

      const data = (await anthropicRes.json()) as {
        content?: Array<{ type?: string; text?: string }>
      }
      const text = data.content?.map((b) => (typeof b.text === "string" ? b.text : "")).join("") ?? ""
      const cleaned = text.replace(/```json|```/g, "").trim()
      const modelJson = JSON.parse(cleaned) as unknown
      const checked = diagnosticReportResponseSchema.safeParse(modelJson)
      if (!checked.success) {
        res.status(502).json({ error: "Invalid model response" })
        return
      }

      res.status(200).json(checked.data)
    } catch (err) {
      res.status(500).json({
        error: "Unexpected error",
        message: err instanceof Error ? err.message : String(err),
      })
    }
  })

  return app
}

