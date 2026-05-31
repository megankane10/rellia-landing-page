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
import {
  isPresentationPreviewRequest,
  isSanityStudioReferer,
  hasSanityPreviewPerspectiveCookie,
  resolveSanityStudioUrl,
} from "./sanityPreview";
import { resolveSanityApiConfig } from "./sanityEnv";
import {
  buildCsrfSetCookie,
  issueCsrfToken,
  requireApiCsrf,
} from "./csrf";
import { isAdminSignupEnabled } from "./adminSignupEnv";
import { buildSiteOrigins, isAllowedBrowserOrigin } from "./siteOrigins";
import {
  extractSanityDraftDocs,
  notifySanityDraftToSlack,
} from "./slackNotify";
import {
  extractPublishedMutationIds,
  syncPublishedDocsToProduction,
} from "./sanityPublishSync";

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

/** vercel.json rewrites /api/* → /api?__path=…; restore the real path so Express routes match */
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

    const pathParam = u.searchParams.get("__path")?.trim();
    if (pathParam) {
      const subPath = pathParam.replace(/^\/+/, "");
      req.url = `/api/${subPath}${stripInternalQuery(u.search)}`;
      next();
      return;
    }

    const candidate =
      headerOne(req, "x-vercel-original-path") ||
      headerOne(req, "x-invoke-path") ||
      headerOne(req, "x-matched-path") ||
      headerOne(req, "x-forwarded-uri");
    if (candidate?.startsWith("/api/")) {
      const pathOnly = candidate.split("?")[0] ?? "";
      if (pathOnly && pathOnly !== "/api" && pathOnly !== "/api/") {
        req.url = pathOnly + (candidate.includes("?") ? candidate.slice(candidate.indexOf("?")) : "");
        next();
        return;
      }
    }
  } catch {
    // leave req.url
  }
  next();
};

const stripInternalQuery = (search: string): string => {
  if (!search || search === "?") return "";
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.delete("__path");
  const rest = params.toString();
  return rest ? `?${rest}` : "";
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
  const siteOrigins = buildSiteOrigins()
  const siteOrigin =
    process.env.VITE_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`
      : "https://www.relliahealth.com")

  const allowBrowserOrigin = (
    req: express.Request,
    extraAllowedOrigins?: Set<string>,
  ): boolean => {
    const merged = new Set(siteOrigins)
    if (extraAllowedOrigins) {
      for (const origin of extraAllowedOrigins) merged.add(origin)
    }
    for (const origin of allowedOrigins) {
      if (origin) merged.add(origin)
    }
    return isAllowedBrowserOrigin(req, merged, isDev)
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
  const contactRate = new Map<string, RateState>();
  const stripeCheckoutRate = new Map<string, RateState>();
  const diagnosticRate = new Map<string, RateState>();
  const sanityPreviewRate = new Map<string, RateState>();
  const sanityPublishedRate = new Map<string, RateState>();

  /** Uptime monitors may poll frequently */
  const HEALTH_MAX_PER_MIN = 240;
  const STUDIO_REDIRECT_MAX_PER_MIN = 60;
  const DRAFT_MODE_MAX_PER_MIN = 30;
  const CONTACT_MAX_PER_MIN = 12;
  const STRIPE_CHECKOUT_MAX_PER_MIN = 20;
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

  const healthHandler: RequestHandler = (_req, res) => {
    res.status(200).json({ ok: true });
  };

  app.get("/health", rateLimitJson(healthRate, HEALTH_MAX_PER_MIN), healthHandler);
  app.get("/api/health", rateLimitJson(healthRate, HEALTH_MAX_PER_MIN), healthHandler);

  const sanitySlackWebhookRate = new Map<string, RateState>();
  const SANITY_SLACK_WEBHOOK_MAX_PER_MIN = 60;

  app.post(
    "/api/webhooks/sanity-slack",
    rateLimitJson(sanitySlackWebhookRate, SANITY_SLACK_WEBHOOK_MAX_PER_MIN),
    async (req, res) => {
      const expectedSecret = process.env.SANITY_SLACK_WEBHOOK_SECRET?.trim();
      if (!expectedSecret) {
        res.status(501).json({ error: "SANITY_SLACK_WEBHOOK_SECRET is not configured" });
        return;
      }

      const providedSecret =
        (typeof req.query.secret === "string" ? req.query.secret : "") ||
        headerOne(req, "x-webhook-secret")?.trim() ||
        "";

      if (!providedSecret || providedSecret !== expectedSecret) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const drafts = extractSanityDraftDocs(req.body);
      if (drafts.length === 0) {
        res.status(200).json({ ok: true, notified: 0 });
        return;
      }

      let notified = 0;
      for (const doc of drafts) {
        const sent = await notifySanityDraftToSlack(doc);
        if (sent) notified += 1;
      }

      res.status(200).json({ ok: true, notified });
    },
  );

  const sanityPublishWebhookRate = new Map<string, RateState>();
  const SANITY_PUBLISH_WEBHOOK_MAX_PER_MIN = 120;

  app.post(
    "/api/webhooks/sanity-publish",
    rateLimitJson(sanityPublishWebhookRate, SANITY_PUBLISH_WEBHOOK_MAX_PER_MIN),
    async (req, res) => {
      const expectedSecret = process.env.SANITY_PUBLISH_WEBHOOK_SECRET?.trim();
      if (!expectedSecret) {
        res.status(501).json({ error: "SANITY_PUBLISH_WEBHOOK_SECRET is not configured" });
        return;
      }

      const providedSecret =
        (typeof req.query.secret === "string" ? req.query.secret : "") ||
        headerOne(req, "x-webhook-secret")?.trim() ||
        "";

      if (!providedSecret || providedSecret !== expectedSecret) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();
      const projectId =
        process.env.SANITY_API_PROJECT_ID?.trim() ||
        process.env.VITE_SANITY_PROJECT_ID?.trim() ||
        "ggbt0o98";

      if (!writeToken) {
        res.status(501).json({ error: "Missing SANITY_API_WRITE_TOKEN" });
        return;
      }

      const { upsertIds, deleteIds } = extractPublishedMutationIds(req.body);
      if (upsertIds.length === 0 && deleteIds.length === 0) {
        res.status(200).json({ ok: true, synced: 0, deleted: 0, skipped: 0 });
        return;
      }

      try {
        const result = await syncPublishedDocsToProduction({
          projectId,
          writeToken,
          upsertIds,
          deleteIds,
        });
        res.status(200).json({ ok: true, ...result });
      } catch (err) {
        console.error("Sanity publish sync error:", err);
        res.status(500).json({ error: "Could not sync published content to production." });
      }
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

  const hasSanityPreviewSecret = (req: express.Request): boolean => {
    try {
      const host =
        headerOne(req, "x-forwarded-host")?.trim() ||
        req.get("host") ||
        process.env.VERCEL_URL ||
        "localhost"
      const protocol = headerOne(req, "x-forwarded-proto")?.trim() || req.protocol || "https"
      const origin = `${protocol}://${host.replace(/^https?:\/\//, "")}`
      const requestUrl = new URL(req.originalUrl || req.url, origin)
      return (
        requestUrl.searchParams.has("sanity-preview-secret") ||
        requestUrl.searchParams.has("sanity-preview-perspective-secret")
      )
    } catch {
      return false
    }
  }

  app.get(
    "/api/draft-mode/enable",
    rateLimitText(draftModeRate, DRAFT_MODE_MAX_PER_MIN),
    async (req, res) => {
    const studioOnlyOrigins = new Set([studioOrigin].filter(Boolean) as string[])
    const previewSiteOrigins = new Set<string>(siteOrigins)
    if (studioOrigin) previewSiteOrigins.add(studioOrigin)
    if (
      !allowBrowserOrigin(req, studioOnlyOrigins) &&
      !allowBrowserOrigin(req, previewSiteOrigins) &&
      !hasSanityPreviewSecret(req) &&
      !isSanityStudioReferer(req)
    ) {
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
      const apiResolved = resolveSanityApiConfig();
      if (apiResolved.status === "dataset_not_allowed") {
        res
          .status(503)
          .send(
            `Sanity dataset "${apiResolved.attemptedDataset}" is not allowed. Check SANITY_ALLOWED_DATASETS and SANITY_ENFORCE_VERCEL_DATASET.`,
          );
        return;
      }
      if (apiResolved.status === "missing_project") {
        res.status(503).send("Sanity is not configured (set SANITY_API_PROJECT_ID)");
        return;
      }
      const previewClient = createClient({
        projectId: apiResolved.projectId,
        dataset: apiResolved.dataset,
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
      const isLocalPreview = host.includes("localhost")
      const cookieFlags = isLocalPreview
        ? "Path=/; SameSite=Lax; Max-Age=3600"
        : "Path=/; HttpOnly; Secure; SameSite=None; Max-Age=3600"
      res.setHeader("Set-Cookie", `${perspectiveCookieName}=${perspective}; ${cookieFlags}`);
      res.redirect(307, cleanRedirect);
    } catch (err) {
      res
        .status(500)
        .send(err instanceof Error ? err.message : "Unexpected error");
    }
  });

  app.get("/api/draft-mode/status", (_req, res) => {
    const cookie = _req.headers.cookie || "";
    res.setHeader("content-type", "application/json");
    res.json({ active: hasSanityPreviewPerspectiveCookie(cookie) });
  });

  app.get(
    "/api/draft-mode/disable",
    rateLimitText(draftModeRate, DRAFT_MODE_MAX_PER_MIN),
    (_req, res) => {
      const reqAny = _req as unknown as express.Request
      if (
        !allowBrowserOrigin(reqAny, new Set([studioOrigin].filter(Boolean) as string[])) &&
        !isSanityStudioReferer(reqAny)
      ) {
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

  const sanityResolved = resolveSanityApiConfig();
  const sanityApiCfg =
    sanityResolved.status === "ok" ? sanityResolved : null;
  const previewAndSiteOrigins = new Set<string>(siteOrigins)
  if (studioOrigin) previewAndSiteOrigins.add(studioOrigin)

  const requireCsrfUnlessPresentation: RequestHandler = (req, res, next) => {
    const cookie = req.headers.cookie || "";
    if (
      isPresentationPreviewRequest(
        req,
        cookie,
        allowBrowserOrigin(req, previewAndSiteOrigins),
      )
    ) {
      next();
      return;
    }
    requireCsrf(req, res, next);
  };

  app.post("/api/sanity/query", requireCsrfUnlessPresentation, async (req, res) => {
    if (!allowBrowserOrigin(req, previewAndSiteOrigins)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const cookie = req.headers.cookie || "";
    const isPreviewSession = isPresentationPreviewRequest(
      req,
      cookie,
      allowBrowserOrigin(req, previewAndSiteOrigins),
    );
    const token = process.env.SANITY_API_READ_TOKEN?.trim();

    if (!isDev && !isPreviewSession) {
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

    const apiResolved = resolveSanityApiConfig();
    if (apiResolved.status === "dataset_not_allowed") {
      res.status(503).json({
        error: `Sanity dataset "${apiResolved.attemptedDataset}" is not allowed for this deployment. Set SANITY_ALLOWED_DATASETS or adjust SANITY_API_DATASET / SANITY_ENFORCE_VERCEL_DATASET.`,
      });
      return;
    }
    if (apiResolved.status === "missing_project") {
      res.status(503).json({
        error:
          "Sanity API is not configured. Set SANITY_API_PROJECT_ID (and dataset) in the server environment.",
      });
      return;
    }
    const { projectId, dataset } = apiResolved;

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
          stega: { enabled: true, studioUrl: resolveSanityStudioUrl() },
        });
        const data = await previewClient.fetch(entry.query, fetchParams, {
          filterResponse: false,
        });
        res.status(200).json({
          data: stripSanityMetadata(data, parsedBody.data.queryId),
        });
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
      res.status(200).json({
        data: stripSanityMetadata(data, parsedBody.data.queryId),
      });
    } catch (err) {
      res.status(502).json({
        error: "Sanity fetch failed",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  });

  const contactPayloadSchema = z.object({
    firstName: z.string().trim().min(1).max(120),
    lastName: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(254),
    company: z.string().trim().max(200).optional(),
    jobTitle: z.string().trim().max(200).optional(),
    message: z.string().trim().min(1).max(8000),
  });

  app.post(
    "/api/contact",
    rateLimitJson(contactRate, CONTACT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
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

      const parsed = contactPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid request",
          details: parsed.error.flatten(),
        });
        return;
      }

      const { firstName, lastName, email, message } = parsed.data;
      const company = parsed.data.company?.trim() ?? "";
      const jobTitle = parsed.data.jobTitle?.trim() ?? "";

      const supabaseUrl = (
        process.env.SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL ||
        ""
      )
        .trim()
        .replace(/\/$/, "");
      const serviceRoleKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_KEY ||
        ""
      ).trim();
      const anonKey = (
        process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        ""
      ).trim();
      const supabaseKey = serviceRoleKey || anonKey;

      if (!supabaseUrl || !supabaseKey) {
        res.status(501).json({
          error: "Contact form is not configured on the server.",
          hint:
            "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel (server-only). Run scripts/supabase_setup.sql once in Supabase.",
        });
        return;
      }

      const row = {
        first_name: firstName,
        last_name: lastName,
        email,
        company: company || null,
        job_title: jobTitle || null,
        message,
        submission_type: "contact",
      };

      try {
        const insertRes = await fetch(
          `${supabaseUrl}/rest/v1/contact_responses`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify(row),
          },
        );

        if (insertRes.ok) {
          res.status(200).json({ ok: true });
          return;
        }

        const errText = await insertRes.text();
        console.error(
          "Supabase contact insert failed",
          insertRes.status,
          errText.slice(0, 800),
        );

        const rateLimited =
          insertRes.status === 429 ||
          errText.toLowerCase().includes("too many submissions");

        res.status(502).json({
          error: rateLimited
            ? "Too many messages from this email. Please try again in an hour."
            : "Could not send your message right now. Please try again or email us directly.",
          ...(isDev
            ? { detail: errText.slice(0, 300), status: insertRes.status }
            : {}),
        });
      } catch (err) {
        console.error("Contact submit error", err);
        res.status(502).json({
          error:
            "Could not send your message right now. Please try again or email us directly.",
        });
      }
    },
  );

  const investorNotifyPayloadSchema = z.object({
    name: z.string().trim().min(1).max(160),
    email: z.string().trim().email().max(254),
    investmentCriteria: z.string().trim().min(1).max(8000),
  });

  app.post(
    "/api/investor-notify",
    rateLimitJson(contactRate, CONTACT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
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

      const parsed = investorNotifyPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid request",
          details: parsed.error.flatten(),
        });
        return;
      }

      const trimmedName = parsed.data.name;
      const spaceIndex = trimmedName.indexOf(" ");
      const firstName =
        spaceIndex > 0 ? trimmedName.slice(0, spaceIndex) : trimmedName;
      const lastName =
        spaceIndex > 0 ? trimmedName.slice(spaceIndex + 1).trim() : ".";

      const supabaseUrl = (
        process.env.SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL ||
        ""
      )
        .trim()
        .replace(/\/$/, "");
      const serviceRoleKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_KEY ||
        ""
      ).trim();
      const anonKey = (
        process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        ""
      ).trim();
      const supabaseKey = serviceRoleKey || anonKey;

      if (!supabaseUrl || !supabaseKey) {
        res.status(501).json({
          error: "Investor form is not configured on the server.",
        });
        return;
      }

      const row = {
        first_name: firstName,
        last_name: lastName,
        email: parsed.data.email,
        company: null,
        job_title: null,
        message: parsed.data.investmentCriteria,
        submission_type: "investor",
      };

      try {
        const insertRes = await fetch(
          `${supabaseUrl}/rest/v1/contact_responses`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify(row),
          },
        );

        if (insertRes.ok) {
          res.status(200).json({ ok: true });
          return;
        }

        const errText = await insertRes.text();
        console.error(
          "Supabase investor notify insert failed",
          insertRes.status,
          errText.slice(0, 800),
        );

        const rateLimited =
          insertRes.status === 429 ||
          errText.toLowerCase().includes("too many submissions");

        res.status(502).json({
          error: rateLimited
            ? "Too many submissions from this email. Please try again in an hour."
            : "Could not submit your request right now. Please try again.",
        });
      } catch (err) {
        console.error("Investor notify submit error", err);
        res.status(502).json({
          error: "Could not submit your request right now. Please try again.",
        });
      }
    },
  );

  const stripeCheckoutPayloadSchema = z.object({
    plan: z.enum(["monthly", "annual"]),
  });

  app.post(
    "/api/stripe/checkout-session",
    rateLimitJson(stripeCheckoutRate, STRIPE_CHECKOUT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const parsed = stripeCheckoutPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid request",
          details: parsed.error.flatten(),
        });
        return;
      }

      const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
      const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID?.trim();
      const annualPriceId = process.env.STRIPE_ANNUAL_PRICE_ID?.trim();
      const monthlyLink = (
        process.env.STRIPE_MONTHLY_PLAN_LINK ||
        process.env.VITE_STRIPE_MONTHLY_PLAN_LINK ||
        ""
      ).trim();
      const annualLink = (
        process.env.STRIPE_ANNUAL_PLAN_LINK ||
        process.env.VITE_STRIPE_ANNUAL_PLAN_LINK ||
        ""
      ).trim();

      const priceId =
        parsed.data.plan === "annual" ? annualPriceId : monthlyPriceId;
      const fallbackUrl =
        parsed.data.plan === "annual" ? annualLink : monthlyLink;

      if (!secretKey || !priceId) {
        res.status(501).json({
          error: "Embedded checkout is not configured.",
          hint:
            "Set STRIPE_SECRET_KEY, STRIPE_MONTHLY_PRICE_ID, and STRIPE_ANNUAL_PRICE_ID (price_… from Stripe → Products). Payment links cannot embed in-page.",
          ...(fallbackUrl ? { paymentLinkUrl: fallbackUrl } : {}),
        });
        return;
      }

      try {
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(secretKey);

        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${siteOrigin.replace(/\/$/, "")}/membership?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${siteOrigin.replace(/\/$/, "")}/membership?cancel=true`,
        });
        
        if (!session.url) {
          res.status(502).json({ error: "Could not create checkout session." });
          return;
        }

        res.status(200).json({ url: session.url });
      } catch (err) {
        const stripeMessage =
          err instanceof Error ? err.message : String(err);
        console.error("Stripe checkout session error", err);
        res.status(502).json({
          error: "Could not start checkout.",
          stripeMessage,
          ...(fallbackUrl ? { paymentLinkUrl: fallbackUrl } : {}),
        });
      }
    },
  );

  app.post(
    "/api/stripe/create-checkout-session",
    rateLimitJson(stripeCheckoutRate, STRIPE_CHECKOUT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
      if (!secretKey) {
        res.status(501).json({ error: "Stripe is not configured on the server." })
        return
      }

      const parsed = z.object({ priceId: z.string().min(1) }).safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid request" })
        return
      }

      try {
        const { default: Stripe } = await import("stripe")
        const stripe = new Stripe(secretKey)
        const origin = headerOne(req, "origin") ?? siteOrigin
        const session = await stripe.checkout.sessions.create({
          ui_mode: "embedded" as any,
          mode: "subscription",
          line_items: [{ price: parsed.data.priceId, quantity: 1 }],
          allow_promotion_codes: true,
          billing_address_collection: "auto",
          automatic_tax: { enabled: true },
          return_url: `${origin}/membership?session_id={CHECKOUT_SESSION_ID}`,
        })
        if (!session.client_secret) {
          res.status(500).json({ error: "Stripe did not return a client_secret." })
          return
        }
        res.json({ clientSecret: session.client_secret })
      } catch (err) {
        res.status(500).json({
          error: "Failed to create checkout session",
          message: err instanceof Error ? err.message : String(err),
        })
      }
    },
  )

  app.post("/api/diagnostic-report", requireCsrf, async (req, res) => {
    if (!allowBrowserOrigin(req)) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    const supabaseUrl = (
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      ""
    )
      .trim()
      .replace(/\/$/, "");
    const supabaseKey = (
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      ""
    ).trim();

    if (!supabaseUrl || !supabaseKey) {
      res.status(501).json({
        error: "Diagnostic survey is not configured on the server.",
        hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run scripts/supabase_diagnostic_setup.sql in Supabase.",
      });
      return;
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

    const saveToSupabase = async (report: ReturnType<typeof buildNonAiReport>): Promise<boolean> => {
      try {
        // Step 1: insert company profile, get back the new row's id
        const profileRes = await fetch(
          `${supabaseUrl}/rest/v1/company_profiles`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              name,
              work_email: email,
              company_name: company,
              stage: stage || null,
              description: desc || null,
            }),
          },
        );

        if (!profileRes.ok) {
          const errText = await profileRes.text();
          console.error("Supabase company_profiles insert failed", profileRes.status, errText.slice(0, 800));
          return false;
        }

        const [profileRow] = await profileRes.json() as Array<{ id: string }>;
        const companyProfileId = profileRow?.id;
        if (!companyProfileId) {
          console.error("Supabase company_profiles insert returned no id");
          return false;
        }

        // Step 2: insert diagnostic response linked to the profile
        const responseRes = await fetch(
          `${supabaseUrl}/rest/v1/diagnostic_responses`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              company_profile_id: companyProfileId,
              section_scores: parseSectionScores(sectionScoresMarkdown),
              raw_answers: rawAnswers ?? null,
              summary: report.summary,
              top3_strengths: report.top3_strengths,
              top3_weaknesses: report.top3_weaknesses,
              recommendations: report.recommendations,
              mentor_areas_needed: report.mentor_areas_needed,
            }),
          },
        );

        if (!responseRes.ok) {
          const errText = await responseRes.text();
          console.error("Supabase diagnostic_responses insert failed", responseRes.status, errText.slice(0, 800));
          return false;
        }

        return true;
      } catch (saveErr) {
        console.error("Failed to save diagnostic to Supabase:", saveErr);
        return false;
      }
    };

    try {
      const report = buildNonAiReport();
      const savedToSupabase = await saveToSupabase(report);

      res.status(200).json({ ...report, savedToSupabase });
    } catch (err) {
      const fallback = buildNonAiReport();
      const savedToSupabase = await saveToSupabase(fallback);
      res.status(200).json({ ...fallback, savedToSupabase });
    }
  });

  // ─── Admin routes ──────────────────────────────────────────────────────────

  const adminSignupStatusRate = new Map<string, RateState>();
  const ADMIN_SIGNUP_STATUS_MAX_PER_MIN = 30;
  const adminSignupRate = new Map<string, RateState>();
  const ADMIN_SIGNUP_MAX_PER_MIN = 5;

  app.get(
    "/api/admin/signup-status",
    rateLimitJson(adminSignupStatusRate, ADMIN_SIGNUP_STATUS_MAX_PER_MIN),
    (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      res.setHeader("content-type", "application/json")
      res.json({ enabled: isAdminSignupEnabled() })
    },
  );

  const adminTeamRate = new Map<string, RateState>();
  const ADMIN_TEAM_MAX_PER_MIN = 30;

  app.get(
    "/api/admin/team",
    rateLimitJson(adminTeamRate, ADMIN_TEAM_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }

      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_KEY ||
        ""
      ).trim();
      const anonKey = (
        process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        ""
      ).trim();

      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }

      try {
        const { createClient } = await import("@supabase/supabase-js");
        const sessionClient = createClient(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }

        const adminClient = createClient(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        const { data: listData, error: listError } = await adminClient.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });

        if (listError) {
          console.error("Supabase listUsers error:", listError.message);
          res.status(500).json({ error: "Could not load team members." });
          return;
        }

        const users = (listData.users ?? [])
          .map((u) => {
            const meta = u.user_metadata ?? {};
            const fullNameRaw =
              typeof meta.full_name === "string"
                ? meta.full_name
                : typeof meta.name === "string"
                  ? meta.name
                  : "";
            return {
              id: u.id,
              email: u.email ?? "",
              fullName: fullNameRaw.trim() || null,
              avatarUrl:
                typeof meta.avatar_url === "string"
                  ? meta.avatar_url.trim() || null
                  : typeof meta.picture === "string"
                    ? meta.picture.trim() || null
                    : null,
              createdAt: u.created_at,
              lastSignInAt: u.last_sign_in_at ?? null,
              confirmedAt: u.email_confirmed_at ?? null,
            };
          })
          .filter((u) => u.email)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.setHeader("content-type", "application/json");
        res.json({ users });
      } catch (err) {
        console.error("Admin team error:", err);
        res.status(500).json({ error: "Unexpected server error." });
      }
    },
  );

  const adminStripeMetricsRate = new Map<string, RateState>();
  const ADMIN_STRIPE_METRICS_MAX_PER_MIN = 20;

  app.get(
    "/api/admin/stripe-metrics",
    rateLimitJson(adminStripeMetricsRate, ADMIN_STRIPE_METRICS_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }

      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_KEY ||
        ""
      ).trim();
      const anonKey = (
        process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        ""
      ).trim();

      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }

      try {
        const { createClient } = await import("@supabase/supabase-js");
        const sessionClient = createClient(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }

        const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
        if (!secretKey) {
          res.setHeader("content-type", "application/json");
          res.json({ configured: false });
          return;
        }

        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(secretKey);
        const now = Math.floor(Date.now() / 1000);
        const thirtyDays = 30 * 24 * 60 * 60;

        const sumSucceededCharges = async (gte: number, lt?: number) => {
          let total = 0;
          let startingAfter: string | undefined;
          let hasMore = true;

          while (hasMore) {
            const page = await stripe.charges.list({
              created: lt ? { gte, lt } : { gte },
              limit: 100,
              ...(startingAfter ? { starting_after: startingAfter } : {}),
            });

            for (const charge of page.data) {
              if (charge.status === "succeeded" && charge.paid) {
                total += charge.amount - (charge.amount_refunded ?? 0);
              }
            }

            hasMore = page.has_more;
            startingAfter = page.data.length > 0 ? page.data[page.data.length - 1]?.id : undefined;
            if (!startingAfter) hasMore = false;
          }

          return total;
        };

        const currentStart = now - thirtyDays;
        const previousStart = now - thirtyDays * 2;
        const sevenDaysStart = now - 7 * 24 * 60 * 60;

        const [revenueLast30Days, revenuePrevious30Days, recentCharges] = await Promise.all([
          sumSucceededCharges(currentStart),
          sumSucceededCharges(previousStart, currentStart),
          (async () => {
            const rows: Array<{ created: number; amount: number }> = [];
            let startingAfter: string | undefined;
            let hasMore = true;
            while (hasMore) {
              const page = await stripe.charges.list({
                created: { gte: sevenDaysStart },
                limit: 100,
                ...(startingAfter ? { starting_after: startingAfter } : {}),
              });
              for (const charge of page.data) {
                if (charge.status === "succeeded" && charge.paid) {
                  rows.push({
                    created: charge.created,
                    amount: charge.amount - (charge.amount_refunded ?? 0),
                  });
                }
              }
              hasMore = page.has_more;
              startingAfter = page.data.length > 0 ? page.data[page.data.length - 1]?.id : undefined;
              if (!startingAfter) hasMore = false;
            }
            return rows;
          })(),
        ]);

        const dayMs = 24 * 60 * 60;
        const revenueDaily: Array<{ label: string; dateKey: string; amount: number }> = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 6; i >= 0; i -= 1) {
          const dayStart = new Date(today.getTime() - i * dayMs * 1000);
          const dayEnd = dayStart.getTime() + dayMs * 1000;
          const startSec = Math.floor(dayStart.getTime() / 1000);
          const endSec = Math.floor(dayEnd / 1000);
          const amount = recentCharges
            .filter((row) => row.created >= startSec && row.created < endSec)
            .reduce((sum, row) => sum + row.amount, 0);
          revenueDaily.push({
            label: dayStart.toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
            dateKey: dayStart.toISOString().slice(0, 10),
            amount,
          });
        }

        const revenueChangePct =
          revenuePrevious30Days === 0
            ? revenueLast30Days > 0
              ? 100
              : null
            : Math.round(((revenueLast30Days - revenuePrevious30Days) / revenuePrevious30Days) * 100);

        res.setHeader("content-type", "application/json");
        res.json({
          configured: true,
          currency: "cad",
          revenueLast30Days,
          revenuePrevious30Days,
          revenueChangePct,
          revenueDaily,
        });
      } catch (err) {
        console.error("Admin stripe metrics error:", err);
        res.status(500).json({ error: "Could not load Stripe metrics." });
      }
    },
  );

  app.post(
    "/api/admin/signup",
    rateLimitJson(adminSignupRate, ADMIN_SIGNUP_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      if (!isAdminSignupEnabled()) {
        res.status(403).json({ error: "Signup is currently disabled." });
        return;
      }

      const parsed = z
        .object({
          email: z.string().trim().email().max(254),
          password: z.string().min(8).max(72),
          fullName: z.string().trim().min(1).max(120),
        })
        .safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
        return;
      }

      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_KEY ||
        ""
      ).trim();

      if (!supabaseUrl || !serviceRoleKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }

      try {
        const { createClient } = await import("@supabase/supabase-js");
        const adminClient = createClient(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        const { error } = await adminClient.auth.admin.createUser({
          email: parsed.data.email,
          password: parsed.data.password,
          email_confirm: true,
          user_metadata: { full_name: parsed.data.fullName },
        });

        if (error) {
          if (error.message.toLowerCase().includes("already")) {
            res.status(409).json({ error: "An account with this email already exists." });
          } else {
            console.error("Supabase admin createUser error:", error.message);
            res.status(500).json({ error: "Failed to create account. Please try again." });
          }
          return;
        }

        res.status(200).json({ ok: true });
      } catch (err) {
        console.error("Admin signup error:", err);
        res.status(500).json({ error: "Unexpected server error." });
      }
    },
  );

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Express error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return app;
}
