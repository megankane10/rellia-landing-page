import { randomBytes } from "node:crypto";
import type { RequestHandler } from "express";

/** Double-submit cookie name; must match client header `x-csrf-token`. */
export const CSRF_COOKIE_NAME = "rellia_csrf";

const CSRF_MAX_AGE_S = 7200;

export const parseCookieHeader = (
  raw: string | undefined,
): Record<string, string> => {
  const out: Record<string, string> = {};
  if (!raw) return out;
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
};

export const buildCsrfSetCookie = (token: string, isDev: boolean): string => {
  const parts = [
    `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${CSRF_MAX_AGE_S}`,
    "SameSite=Lax",
  ];
  if (!isDev) parts.push("Secure");
  return parts.join("; ");
};

export const issueCsrfToken = (): string =>
  randomBytes(32).toString("base64url");

/**
 * Blocks cross-site and naive scripted abuse of POST APIs (Origin/Referer are spoofable in curl;
 * this adds a secret third parties cannot read from another origin).
 * Opt out only with REQUIRE_API_CSRF=false (emergency / automated tests).
 */
export const requireApiCsrf =
  (isDev: boolean): RequestHandler =>
  (req, res, next) => {
    if (process.env.REQUIRE_API_CSRF === "false") {
      next();
      return;
    }
    const cookies = parseCookieHeader(req.headers.cookie);
    const header = (req.get("x-csrf-token") || "").trim();
    const cookie = cookies[CSRF_COOKIE_NAME];
    if (!header || !cookie || header !== cookie || header.length < 20) {
      res.status(403).json({
        error: "Invalid or missing CSRF token. Reload the page and try again.",
        code: "CSRF",
      });
      return;
    }
    next();
  };
