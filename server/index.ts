import "./loadEnv";
import cors from "cors";
import express, { type RequestHandler } from "express";
import helmet from "helmet";
import { z } from "zod";
import { createClient } from "@sanity/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { withoutSecretSearchParams } from "@sanity/preview-url-secret/without-secret-search-params";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";
import {
  SANITY_QUERY_WHITELIST,
  isSanityQueryId,
} from "../shared/cms/sanityQueryRegistry";
import { stripSanityMetadata } from "./sanityResponseSanitize";
import { resolveSanityApiConfig } from "./sanityEnv";
import {
  buildCsrfSetCookie,
  issueCsrfToken,
  requireApiCsrf,
} from "./csrf";

type RequestLike = {
  headers?: Record<string, unknown>;
  ip?: unknown;
  protocol?: string;
  originalUrl?: string;
  get?: (name: string) => string | undefined;
};

const headerOne = (req: RequestLike, name: string): string | undefined => {
  const v = req.headers?.[name];
  if (Array.isArray(v)) return v[0];
  return typeof v === "string" ? v : undefined;
};

const getClientIp = (req: RequestLike): string => {
  if (process.env.VERCEL) {
    const realIp = headerOne(req, "x-real-ip")?.trim();
    if (realIp) return realIp;
  }
  const forwarded = headerOne(req, "x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  if (typeof req.ip === "string" && req.ip) return req.ip;
  return "unknown";
};

/** vercel.json rewrites /api/* → /api; restore the real path so Express routes match */
const fixVercelRewrittenApiPath: RequestHandler = (req, _res, next) => {
  if (!process.env.VERCEL) {
    next();
    return;
  }
  try {
    const u = new URL(req.url, "http://v.internal");
    const p = u.pathname;
    if (p !== "/api" && p !== "/api/") {
      next();
      return;
    }
    const candidate =
      headerOne(req, "x-invoke-path") || headerOne(req, "x-matched-path");
    if (!candidate?.startsWith("/api/")) {
      next();
      return;
    }
    const pathOnly = candidate.split("?")[0] ?? "";
    if (!pathOnly || pathOnly === "/api" || pathOnly === "/api/") {
      next();
      return;
    }
    req.url = pathOnly + (u.search || "");
  } catch {
    // leave req.url
  }
  next();
};

export function createServer() {
  const app = express();

  // Vercel sits behind a proxy/CDN. Trusting the proxy ensures `req.protocol`
  // and related helpers use `x-forwarded-*` headers.
  app.set("trust proxy", 1);

  app.use(fixVercelRewrittenApiPath);

  const isDev = process.env.NODE_ENV !== "production";

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
  );

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const safeOriginFromUrl = (input: string | undefined): string | null => {
    const v = (input ?? "").trim()
    if (!v) return null
    try {
      return new URL(v).origin
    } catch {
      return null
    }
  }

  const studioOrigin = safeOriginFromUrl(process.env.SANITY_STUDIO_URL)
  const siteOrigin = safeOriginFromUrl(process.env.VITE_SITE_URL) || "https://www.relliahealth.com"
  const siteOrigins = new Set([siteOrigin, siteOrigin.replace("://www.", "://")])

  const isAllowedBrowserOrigin = (
    req: express.Request,
    extraAllowedOrigins: Set<string>,
  ): boolean => {
    if (isDev) return true

    const originHeader = (req.get("origin") || "").trim()
    if (originHeader && (allowedOrigins.includes(originHeader) || extraAllowedOrigins.has(originHeader))) {
      return true
    }

    // Sanity Presentation / Studio runs on sanity.studio / sanity.io domains and needs to call preview endpoints.
    // Origin/Referer checks are best-effort; this is still not a replacement for a shared secret.
    if (originHeader && (originHeader.endsWith(".sanity.studio") || originHeader.endsWith(".sanity.io"))) {
      return true
    }

    const refererHeader = (req.get("referer") || "").trim()
    const refererOrigin = safeOriginFromUrl(refererHeader)
    if (refererOrigin && (allowedOrigins.includes(refererOrigin) || extraAllowedOrigins.has(refererOrigin))) {
      return true
    }

    if (refererOrigin && (refererOrigin.endsWith(".sanity.studio") || refererOrigin.endsWith(".sanity.io"))) {
      return true
    }

    return false
  }

  if (!isDev && allowedOrigins.length === 0) {
    console.warn(
      "ALLOWED_ORIGINS is not set. CORS will allow all browser origins. Set ALLOWED_ORIGINS to restrict cross-origin requests.",
    );
  }

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) {
          cb(null, true);
          return;
        }

        if (isDev) {
          cb(null, true);
          return;
        }

        if (allowedOrigins.length === 0) {
          cb(null, true);
          return;
        }

        cb(null, allowedOrigins.includes(origin));
      },
    }),
  );

  app.use(express.json({ limit: "32kb" }));
  app.use(express.urlencoded({ extended: true, limit: "32kb" }));

  type RateState = { windowStartMs: number; count: number };
  const RATE_WINDOW_MS = 60_000;
  const RATE_MAP_MAX = 5000;

  const applyRateLimit = (
    map: Map<string, RateState>,
    ip: string,
    max: number,
  ): boolean => {
    const now = Date.now();
    if (map.size > RATE_MAP_MAX) map.clear();
    const current = map.get(ip);
    if (!current || now - current.windowStartMs > RATE_WINDOW_MS) {
      map.set(ip, { windowStartMs: now, count: 1 });
      return true;
    }
    current.count += 1;
    return current.count <= max;
  };

  const csrfIssueRate = new Map<string, RateState>();
  const healthRate = new Map<string, RateState>();
  const studioRedirectRate = new Map<string, RateState>();
  const draftModeRate = new Map<string, RateState>();
  const contactHubspotRate = new Map<string, RateState>();
  const diagnosticRate = new Map<string, RateState>();
  const sanityPreviewRate = new Map<string, RateState>();
  const sanityPublishedRate = new Map<string, RateState>();

  /** Uptime monitors may poll frequently */
  const HEALTH_MAX_PER_MIN = 240;
  const STUDIO_REDIRECT_MAX_PER_MIN = 60;
  const DRAFT_MODE_MAX_PER_MIN = 30;
  const CONTACT_HUBSPOT_MAX_PER_MIN = 12;
  const DIAGNOSTIC_MAX_PER_MIN = 10;
  const SANITY_PREVIEW_MAX_PER_MIN = 120;
  const SANITY_PUBLISHED_MAX_PER_MIN = 180;
  const CSRF_TOKEN_MAX_PER_MIN = 90;

  const requireCsrf = requireApiCsrf(isDev);

  const rateLimitJson = (
    map: Map<string, RateState>,
    maxPerWindow: number,
  ): RequestHandler => {
    return (req, res, next) => {
      const ip = getClientIp(req);
      if (!applyRateLimit(map, ip, maxPerWindow)) {
        res
          .status(429)
          .json({ error: "Too many requests. Please try again shortly." });
        return;
      }
      next();
    };
  };

  const rateLimitText = (
    map: Map<string, RateState>,
    maxPerWindow: number,
  ): RequestHandler => {
    return (req, res, next) => {
      const ip = getClientIp(req);
      if (!applyRateLimit(map, ip, maxPerWindow)) {
        res
          .status(429)
          .type("text/plain")
          .send("Too many requests. Please try again shortly.");
        return;
      }
      next();
    };
  };

  app.get(
    "/health",
    rateLimitJson(healthRate, HEALTH_MAX_PER_MIN),
    (_req, res) => {
      res.status(200).json({ ok: true });
    },
  );

  app.get(
    "/api/csrf-token",
    rateLimitJson(csrfIssueRate, CSRF_TOKEN_MAX_PER_MIN),
    (_req, res) => {
      const token = issueCsrfToken();
      res.setHeader("Set-Cookie", buildCsrfSetCookie(token, isDev));
      res.status(200).json({ csrfToken: token });
    },
  );

  // Public convenience redirect to Sanity Studio. Studio itself authenticates.
  app.get(
    "/api/studio",
    rateLimitText(studioRedirectRate, STUDIO_REDIRECT_MAX_PER_MIN),
    (_req, res) => {
    const studioUrl = process.env.SANITY_STUDIO_URL?.trim();
    if (!studioUrl) {
      res.status(501).send("Missing SANITY_STUDIO_URL");
      return;
    }

    try {
      const parsed = new URL(studioUrl);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        res.status(400).send("Invalid SANITY_STUDIO_URL protocol");
        return;
      }
      res.redirect(307, parsed.toString());
    } catch {
      res.status(400).send("Invalid SANITY_STUDIO_URL");
    }
  },
  );

  app.get(
    "/api/draft-mode/enable",
    rateLimitText(draftModeRate, DRAFT_MODE_MAX_PER_MIN),
    async (req, res) => {
    if (!isAllowedBrowserOrigin(req, new Set([studioOrigin].filter(Boolean) as string[]))) {
      res.status(403).send("Forbidden")
      return
    }

    const token = process.env.SANITY_API_READ_TOKEN?.trim();
    if (!token) {
      res.status(501).send("Missing SANITY_API_READ_TOKEN");
      return;
    }

    try {
      const forwardedProto = headerOne(req, "x-forwarded-proto")?.trim();
      const forwardedHost = headerOne(req, "x-forwarded-host")?.trim();
      const host =
        forwardedHost ||
        req.get("host") ||
        process.env.VERCEL_URL ||
        "localhost";

      const protocol =
        forwardedProto || (typeof req.protocol === "string" ? req.protocol : "");

      const origin = `${protocol || "https"}://${host.replace(/^https?:\/\//, "")}`;
      const requestUrl = new URL(req.originalUrl || req.url, origin).toString();
      const apiCfg = resolveSanityApiConfig();
      if (!apiCfg) {
        res.status(503).send("Sanity is not configured (set SANITY_API_PROJECT_ID)");
        return;
      }
      const previewClient = createClient({
        projectId: apiCfg.projectId,
        dataset: apiCfg.dataset,
        token,
        useCdn: false,
        apiVersion: "2024-01-01",
      });

      const { isValid, redirectTo, studioPreviewPerspective } =
        await validatePreviewUrl(previewClient, requestUrl);
      if (!isValid) {
        res.status(401).send("Invalid preview secret");
        return;
      }

      const cleanRedirect = (() => {
        if (!redirectTo) return "/";
        const cleaned = withoutSecretSearchParams(new URL(redirectTo, requestUrl));
        return `${cleaned.pathname}${cleaned.search}${cleaned.hash}`;
      })();

      const perspective = studioPreviewPerspective || "drafts";
      res.setHeader(
        "Set-Cookie",
        `${perspectiveCookieName}=${perspective}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=3600`,
      );
      res.redirect(307, cleanRedirect);
    } catch (err) {
      res
        .status(500)
        .send(err instanceof Error ? err.message : "Unexpected error");
    }
  });

  app.get(
    "/api/draft-mode/disable",
    rateLimitText(draftModeRate, DRAFT_MODE_MAX_PER_MIN),
    (_req, res) => {
      const reqAny = _req as unknown as express.Request
      if (!isAllowedBrowserOrigin(reqAny, new Set([studioOrigin].filter(Boolean) as string[]))) {
        res.status(403).send("Forbidden")
        return
      }

      res.setHeader(
        "Set-Cookie",
        `${perspectiveCookieName}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`,
      );
      res.redirect(307, "/");
    },
  );

  const diagnosticReportPayloadSchema = z.object({
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().email(),
    company: z.string().trim().min(1).max(200),
    stage: z.string().trim().min(1).max(120),
    desc: z.string().trim().min(1).max(1200),
    sectionScoresMarkdown: z.string().trim().min(1).max(8000),
    rawAnswers: z.any().optional(),
  });

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
  });

  const sanityApiCfg = resolveSanityApiConfig();
  const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();
  const sanityWriteClient =
    sanityApiCfg && writeToken
      ? createClient({
          projectId: sanityApiCfg.projectId,
          dataset: sanityApiCfg.dataset,
          token: writeToken,
          useCdn: false,
          apiVersion: "2024-01-01",
        })
      : null;

  const previewAndSiteOrigins = new Set(
    [studioOrigin, ...siteOrigins].filter(Boolean) as string[],
  );

  app.post("/api/sanity/query", requireCsrf, async (req, res) => {
    if (!isAllowedBrowserOrigin(req, previewAndSiteOrigins)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const cookie = req.headers.cookie || "";
    const isPreviewSession = cookie.includes(`${perspectiveCookieName}=`);
    const token = process.env.SANITY_API_READ_TOKEN?.trim();

    if (!isDev) {
      const hasProvenance =
        Boolean((req.get("origin") || "").trim()) ||
        Boolean((req.get("referer") || "").trim());
      if (!hasProvenance) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
    }

    const ip = getClientIp(req);
    const rateMap = isPreviewSession ? sanityPreviewRate : sanityPublishedRate;
    const rateMax = isPreviewSession
      ? SANITY_PREVIEW_MAX_PER_MIN
      : SANITY_PUBLISHED_MAX_PER_MIN;
    if (!applyRateLimit(rateMap, ip, rateMax)) {
      res
        .status(429)
        .json({ error: "Too many requests. Please try again shortly." });
      return;
    }

    const bodySchema = z.object({
      queryId: z.string().trim(),
      params: z.record(z.unknown()).optional(),
    });

    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parsedBody.error.flatten(),
      });
      return;
    }

    if (!isSanityQueryId(parsedBody.data.queryId)) {
      res.status(400).json({ error: "Unknown queryId" });
      return;
    }

    const entry = SANITY_QUERY_WHITELIST[parsedBody.data.queryId];
    const paramsParsed = entry.params.safeParse(parsedBody.data.params ?? {});
    if (!paramsParsed.success) {
      res.status(400).json({
        error: "Invalid params",
        details: paramsParsed.error.flatten(),
      });
      return;
    }

    const apiCfg = resolveSanityApiConfig();
    if (!apiCfg) {
      res.status(503).json({
        error:
          "Sanity API is not configured. Set SANITY_API_PROJECT_ID (and dataset) in the server environment.",
      });
      return;
    }
    const { projectId, dataset } = apiCfg;

    const fetchParams = paramsParsed.data as Record<string, unknown>;

    try {
      if (isPreviewSession) {
        if (!token) {
          res.status(501).json({ error: "Missing SANITY_API_READ_TOKEN" });
          return;
        }
        const previewClient = createClient({
          projectId,
          dataset,
          token,
          useCdn: false,
          apiVersion: "2024-01-01",
          perspective: "drafts",
          stega: { enabled: true, studioUrl: process.env.SANITY_STUDIO_URL },
        });
        const data = await previewClient.fetch(entry.query, fetchParams);
        res.status(200).json({ data: stripSanityMetadata(data) });
        return;
      }

      // Public (incl. Free-plan) datasets: anyone can still call api.sanity.io with arbitrary GROQ — this app cannot
      // change that. Private datasets (paid plans) require a read token; we attach SANITY_API_READ_TOKEN when set
      // so published fetches keep working after you switch to Private.
      const publicClient = createClient({
        projectId,
        dataset,
        ...(token ? { token } : {}),
        useCdn: false,
        apiVersion: "2024-01-01",
      });
      const data = await publicClient.fetch(entry.query, fetchParams);
      res.status(200).json({ data: stripSanityMetadata(data) });
    } catch (err) {
      res.status(502).json({
        error: "Sanity fetch failed",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  });

  const contactHubspotPayloadSchema = z.object({
    firstName: z.string().trim().min(1).max(120),
    lastName: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(254),
    company: z.string().trim().max(200).optional(),
    jobTitle: z.string().trim().max(200).optional(),
    message: z.string().trim().min(1).max(8000),
  });

  app.post(
    "/api/contact-hubspot",
    rateLimitJson(contactHubspotRate, CONTACT_HUBSPOT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      if (!isAllowedBrowserOrigin(req, siteOrigins)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      if (!isDev) {
        const hasProvenance =
          Boolean((req.get("origin") || "").trim()) ||
          Boolean((req.get("referer") || "").trim());
        if (!hasProvenance) {
          res.status(403).json({ error: "Forbidden" });
          return;
        }
      }

      const parsed = contactHubspotPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid request",
          details: parsed.error.flatten(),
        });
        return;
      }

      const portalId =
        process.env.HUBSPOT_PORTAL_ID?.trim() || "342926478";
      const formGuid = process.env.HUBSPOT_CONTACT_FORM_GUID?.trim();
      if (!formGuid) {
        res.status(501).json({
          error: "Contact form is not configured on the server.",
          hint: "Set HUBSPOT_CONTACT_FORM_GUID in the deployment environment (HubSpot form GUID).",
        });
        return;
      }

      const formsApiBase = (
        process.env.HUBSPOT_FORMS_API_BASE?.trim() ||
        "https://api.hsforms.com"
      ).replace(/\/$/, "");

      const { firstName, lastName, email, message } = parsed.data;
      const company = parsed.data.company?.trim() ?? "";
      const jobTitle = parsed.data.jobTitle?.trim() ?? "";

      const pageUri =
        req.get("referer")?.trim() || `${siteOrigin.replace(/\/$/, "")}/contact`;

      const hubspotUrl = `${formsApiBase}/submissions/v3/integration/submit/${portalId}/${formGuid}`;

      const fields: Array<{ name: string; value: string }> = [
        { name: "firstname", value: firstName },
        { name: "lastname", value: lastName },
        { name: "email", value: email },
      ];
      if (company) fields.push({ name: "company", value: company });
      if (jobTitle) fields.push({ name: "jobtitle", value: jobTitle });
      fields.push({ name: "message", value: message });

      try {
        const hsRes = await fetch(hubspotUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            fields,
            context: {
              pageUri,
              pageName: "Contact",
            },
          }),
        });

        if (!hsRes.ok) {
          const errText = await hsRes.text();
          console.error(
            "HubSpot contact submit failed",
            hsRes.status,
            errText.slice(0, 800),
          );
          res.status(502).json({
            error:
              "Could not send your message right now. Please try again or email us directly.",
          });
          return;
        }

        res.status(200).json({ ok: true });
      } catch (err) {
        console.error("HubSpot contact submit error", err);
        res.status(502).json({
          error:
            "Could not send your message right now. Please try again or email us directly.",
        });
      }
    },
  );

  app.post("/api/diagnostic-report", requireCsrf, async (req, res) => {
    if (!isAllowedBrowserOrigin(req, siteOrigins)) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    if (!sanityWriteClient) {
      res.status(501).json({ error: "Missing SANITY_API_WRITE_TOKEN" })
      return
    }

    const ip = getClientIp(req);
    if (!applyRateLimit(diagnosticRate, ip, DIAGNOSTIC_MAX_PER_MIN)) {
      res
        .status(429)
        .json({ error: "Too many requests. Please try again shortly." });
      return;
    }

    const parsed = diagnosticReportPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }

    const {
      name,
      email,
      company,
      stage,
      desc,
      sectionScoresMarkdown,
      rawAnswers,
    } = parsed.data;

    const parseSectionScores = (
      markdown: string,
    ): Array<{ category: string; score: number }> => {
      return markdown
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const match = line.match(/^(.+?)\s*:\s*(\d{1,3})%?$/);
          if (!match) return null;
          const category = match[1]?.trim() || "";
          const score = Number(match[2]);
          if (!category) return null;
          if (!Number.isFinite(score)) return null;
          return { category, score: Math.max(0, Math.min(100, score)) };
        })
        .filter((x): x is { category: string; score: number } => Boolean(x));
    };

    const buildNonAiReport = (): {
      summary: string;
      top3_strengths: Array<{ category: string; score: number; note: string }>;
      top3_weaknesses: Array<{
        category: string;
        score: number;
        note: string;
        priority: string;
      }>;
      recommendations: string[];
      mentor_areas_needed: string[];
    } => {
      const scores = parseSectionScores(sectionScoresMarkdown);
      const sorted = [...scores].sort((a, b) => b.score - a.score);
      const topStrengths = sorted.slice(0, 3);
      const topWeaknesses = [...scores]
        .sort((a, b) => a.score - b.score)
        .slice(0, 3);

      const toPriority = (score: number): string => {
        if (score < 40) return "Critical";
        if (score < 70) return "High";
        return "Medium";
      };

      return {
        summary: `Thanks — we’ve saved your diagnostic submission for ${company}. Your next step is to focus on the lowest-scoring domains first, then reinforce what’s already working so you can move faster with less risk.`,
        top3_strengths: topStrengths.map((s) => ({
          category: s.category,
          score: s.score,
          note: "Above-average readiness compared to your other domains.",
        })),
        top3_weaknesses: topWeaknesses.map((s) => ({
          category: s.category,
          score: s.score,
          priority: toPriority(s.score),
          note: "This is a likely bottleneck—tighten it before scaling execution or diligence.",
        })),
        recommendations: [
          "Pick one domain to fix this week and define a concrete deliverable (document, process, or experiment).",
          "Validate your assumptions with 2–3 targeted conversations (users, buyers, clinicians, or operators).",
          "Turn the lowest-scoring domain into a short 30–60 day plan with owners and milestones.",
        ],
        mentor_areas_needed: topWeaknesses.map((w) => w.category),
      };
    };

    try {
      const report = buildNonAiReport();

      let savedToSanity = false

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
          });
          savedToSanity = true
        } catch (sanityErr) {
          console.error("Failed to save to Sanity:", sanityErr);
        }
      }

      res.status(200).json({
        ...report,
        savedToSanity,
        ...(sanityWriteClient
          ? {}
          : {
              saveSkippedReason:
                "SANITY_API_WRITE_TOKEN is not set on the server; report generated but not persisted.",
            }),
      })
    } catch (err) {
      const fallback = buildNonAiReport();

      if (!sanityWriteClient) {
        res.status(200).json({ ...fallback, savedToSanity: false })
        return
      }

      let savedToSanity = false
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
              summary: fallback.summary,
              strengths: fallback.top3_strengths,
              weaknesses: fallback.top3_weaknesses,
              recommendations: fallback.recommendations,
              mentorAreas: fallback.mentor_areas_needed,
            },
            submittedAt: new Date().toISOString(),
          });
          savedToSanity = true
        } catch (sanityErr) {
          console.error("Failed to save fallback to Sanity:", sanityErr);
        }
      }

      res.status(200).json({ ...fallback, savedToSanity })
    }
  });

  return app;
}
