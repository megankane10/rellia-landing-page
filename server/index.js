import "./loadEnv.js"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import { z } from "zod"
import { createClient } from "@sanity/client"
import { validatePreviewUrl } from "@sanity/preview-url-secret"
import { withoutSecretSearchParams } from "@sanity/preview-url-secret/without-secret-search-params"
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants"

const headerOne = (req, name) => {
  const v = req.headers?.[name]
  if (Array.isArray(v)) return v[0]
  return typeof v === "string" ? v : undefined
}

const getClientIp = (req) => {
  if (process.env.VERCEL) {
    const realIp = headerOne(req, "x-real-ip")?.trim()
    if (realIp) return realIp
  }
  const forwarded = headerOne(req, "x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  if (typeof req.ip === "string" && req.ip) return req.ip
  return "unknown"
}

/** vercel.json rewrites /api/* → /api; restore the real path so Express routes match */
const fixVercelRewrittenApiPath = (req, _res, next) => {
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
    const candidate =
      headerOne(req, "x-invoke-path") || headerOne(req, "x-matched-path")
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

  // Vercel sits behind a proxy/CDN. Trusting the proxy ensures `req.protocol`
  // and related helpers use `x-forwarded-*` headers.
  app.set("trust proxy", 1)

  app.use(fixVercelRewrittenApiPath)

  const isDev = process.env.NODE_ENV !== "production"

  // Default Helmet CSP blocks Vite's inline dev scripts (React Refresh / HMR), which yields a blank page locally.
  app.use(
    isDev
      ? helmet({
          contentSecurityPolicy: false,
          strictTransportSecurity: false,
        })
      : helmet({
          // Visual editing uses Studio -> iframe preview; framing is controlled by CSP headers in `vercel.json`.
          frameguard: false,
        }),
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

  app.get("/api/draft-mode/enable", async (req, res) => {
    const token = process.env.SANITY_API_READ_TOKEN?.trim()
    if (!token) {
      res.status(501).send("Missing SANITY_API_READ_TOKEN")
      return
    }

    try {
      const forwardedProto = headerOne(req, "x-forwarded-proto")?.trim()
      const forwardedHost = headerOne(req, "x-forwarded-host")?.trim()
      const host =
        forwardedHost || req.get("host") || process.env.VERCEL_URL || "localhost"

      const protocol =
        forwardedProto || (typeof req.protocol === "string" ? req.protocol : "")

      const origin = `${protocol || "https"}://${host.replace(/^https?:\/\//, "")}`
      const requestUrl = new URL(req.originalUrl || req.url, origin).toString()

      const previewClient = createClient({
        projectId:
          process.env.SANITY_API_PROJECT_ID ||
          process.env.VITE_SANITY_PROJECT_ID ||
          "ggbt0o98",
        dataset:
          process.env.SANITY_API_DATASET ||
          process.env.VITE_SANITY_DATASET ||
          "production",
        token,
        useCdn: false,
        apiVersion: "2024-01-01",
      })

      const { isValid, redirectTo, studioPreviewPerspective } =
        await validatePreviewUrl(previewClient, requestUrl)
      if (!isValid) {
        res.status(401).send("Invalid preview secret")
        return
      }

      const cleanRedirect = (() => {
        if (!redirectTo) return "/"
        const cleaned = withoutSecretSearchParams(new URL(redirectTo, requestUrl))
        return `${cleaned.pathname}${cleaned.search}${cleaned.hash}`
      })()

      const perspective = studioPreviewPerspective || "drafts"
      res.setHeader(
        "Set-Cookie",
        `${perspectiveCookieName}=${perspective}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=3600`,
      )
      res.redirect(307, cleanRedirect)
    } catch (err) {
      res.status(500).send(err instanceof Error ? err.message : "Unexpected error")
    }
  })

  app.get("/api/draft-mode/disable", (_req, res) => {
    res.setHeader(
      "Set-Cookie",
      `${perspectiveCookieName}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`,
    )
    res.redirect(307, "/")
  })

  app.post("/api/sanity/query", async (req, res) => {
    const token = process.env.SANITY_API_READ_TOKEN?.trim()
    const cookie = req.headers.cookie || ""
    const isPreview = cookie.includes(`${perspectiveCookieName}=`)
    if (!isPreview || !token) {
      res.status(403).json({ error: "Preview mode not enabled" })
      return
    }

    const bodySchema = z.object({
      query: z.string().trim().min(1).max(50_000),
      params: z.record(z.any()).optional(),
    })

    const parsed = bodySchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() })
      return
    }

    try {
      const previewClient = createClient({
        projectId:
          process.env.SANITY_API_PROJECT_ID ||
          process.env.VITE_SANITY_PROJECT_ID ||
          "ggbt0o98",
        dataset:
          process.env.SANITY_API_DATASET ||
          process.env.VITE_SANITY_DATASET ||
          "production",
        token,
        useCdn: false,
        apiVersion: "2024-01-01",
        perspective: "drafts",
        stega: { enabled: true, studioUrl: process.env.SANITY_STUDIO_URL },
      })

      const data = await previewClient.fetch(parsed.data.query, parsed.data.params ?? {})
      res.status(200).json({ data })
    } catch (err) {
      res.status(502).json({
        error: "Sanity preview fetch failed",
        message: err instanceof Error ? err.message : String(err),
      })
    }
  })

  const diagnosticReportPayloadSchema = z.object({
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().email(),
    company: z.string().trim().min(1).max(200),
    stage: z.string().trim().min(1).max(120),
    desc: z.string().trim().min(1).max(1200),
    sectionScoresMarkdown: z.string().trim().min(1).max(8000),
    rawAnswers: z.any().optional(),
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

  const sanityWriteClient = process.env.SANITY_API_WRITE_TOKEN
    ? createClient({
        projectId:
          process.env.SANITY_API_PROJECT_ID ||
          process.env.VITE_SANITY_PROJECT_ID ||
          "ggbt0o98",
        dataset:
          process.env.SANITY_API_DATASET ||
          process.env.VITE_SANITY_DATASET ||
          "production",
        token: process.env.SANITY_API_WRITE_TOKEN,
        useCdn: false,
        apiVersion: "2024-01-01",
      })
    : null

  const perIpRate = new Map()
  const pexelsIpRate = new Map()
  const RATE_WINDOW_MS = 60_000
  const RATE_MAX = 10
  const RATE_MAP_MAX = 5000
  const PEXELS_RATE_MAX = 40

  const applyRateLimit = (map, ip, max) => {
    const now = Date.now()
    if (map.size > RATE_MAP_MAX) map.clear()
    const current = map.get(ip)
    if (!current || now - current.windowStartMs > RATE_WINDOW_MS) {
      map.set(ip, { windowStartMs: now, count: 1 })
      return true
    }
    current.count += 1
    return current.count <= max
  }

  const pexelsSearchQuerySchema = z.object({
    query: z.string().trim().min(1).max(120),
    per_page: z.coerce.number().int().min(1).max(15).optional().default(1),
    orientation: z.enum(["landscape", "portrait", "square"]).optional(),
  })

  app.get("/api/pexels/search", async (req, res) => {
    const apiKey = process.env.PEXELS_API_KEY?.trim()
    if (!apiKey) {
      res.status(501).json({
        error: "Pexels is not configured. Set PEXELS_API_KEY in the server environment.",
      })
      return
    }

    const ip = getClientIp(req)
    if (!applyRateLimit(pexelsIpRate, ip, PEXELS_RATE_MAX)) {
      res.status(429).json({ error: "Too many requests. Please try again shortly." })
      return
    }

    const raw = {
      query: typeof req.query.query === "string" ? req.query.query : "",
      per_page: req.query.per_page,
      orientation: req.query.orientation,
    }
    const parsed = pexelsSearchQuerySchema.safeParse(raw)
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid query", details: parsed.error.flatten() })
      return
    }

    const { query, per_page, orientation } = parsed.data
    const params = new URLSearchParams({
      query,
      per_page: String(per_page),
    })
    if (orientation) params.set("orientation", orientation)

    try {
      const pexelsRes = await fetch(`https://api.pexels.com/v1/search?${params.toString()}`, {
        headers: { Authorization: apiKey },
      })

      if (!pexelsRes.ok) {
        const text = await pexelsRes.text().catch(() => "")
        res.status(502).json({
          error: "Pexels request failed",
          status: pexelsRes.status,
          ...(isDev ? { text } : {}),
        })
        return
      }

      const data = await pexelsRes.json()
      const first = data.photos?.[0]?.src
      const url = first?.large2x ?? first?.large ?? first?.medium
      if (!url) {
        res.status(502).json({ error: "No photos returned" })
        return
      }

      res.status(200).json({ url })
    } catch (err) {
      res.status(500).json({
        error: "Unexpected error",
        message: err instanceof Error ? err.message : String(err),
      })
    }
  })

  app.post("/api/diagnostic-report", async (req, res) => {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
    if (!apiKey) {
      res.status(501).json({
        error: "Anthropic is not configured. Set ANTHROPIC_API_KEY in the server environment.",
      })
      return
    }

    const ip = getClientIp(req)
    if (!applyRateLimit(perIpRate, ip, RATE_MAX)) {
      res.status(429).json({ error: "Too many requests. Please try again shortly." })
      return
    }

    const parsed = diagnosticReportPayloadSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() })
      return
    }

    const { name, email, company, stage, desc, sectionScoresMarkdown, rawAnswers } =
      parsed.data

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

      const data = await anthropicRes.json()
      const text =
        data.content?.map((b) => (typeof b.text === "string" ? b.text : "")).join("") ?? ""
      const cleaned = text.replace(/```json|```/g, "").trim()
      const modelJson = JSON.parse(cleaned)
      const checked = diagnosticReportResponseSchema.safeParse(modelJson)
      if (!checked.success) {
        res.status(502).json({ error: "Invalid model response" })
        return
      }

      const report = checked.data

      if (sanityWriteClient) {
        try {
          await sanityWriteClient.create({
            _type: "diagnosticSubmission",
            name,
            email,
            company,
            stage,
            description: desc,
            scoresMarkdown: sectionScoresMarkdown,
            answersJson: rawAnswers ? JSON.stringify(rawAnswers) : undefined,
            report: {
              summary: report.summary,
              strengths: report.top3_strengths,
              weaknesses: report.top3_weaknesses,
              recommendations: report.recommendations,
              mentorAreas: report.mentor_areas_needed,
            },
            submittedAt: new Date().toISOString(),
          })
        } catch (sanityErr) {
          console.error("Failed to save to Sanity:", sanityErr)
          // Still return the report even if save fails
        }
      }

      res.status(200).json(report)
    } catch (err) {
      res.status(500).json({
        error: "Unexpected error",
        message: err instanceof Error ? err.message : String(err),
      })
    }
  })

  return app
}

