// server/loadEnv.ts
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
if (process.env.VERCEL !== "1") {
  const require2 = createRequire(import.meta.url);
  const dotenv = require2("dotenv");
  const serverDir = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(serverDir, "..");
  dotenv.config({ path: path.join(root, ".env") });
  dotenv.config({ path: path.join(root, ".env.local"), override: true });
}

// server/index.ts
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { z as z2 } from "zod";
import { createClient } from "@sanity/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { withoutSecretSearchParams } from "@sanity/preview-url-secret/without-secret-search-params";
import { perspectiveCookieName as perspectiveCookieName2 } from "@sanity/preview-url-secret/constants";

// shared/cms/sanityQueryRegistry.ts
import { z } from "zod";

// shared/cms/groqQueries.ts
var seoFragment = `seo{
  metaTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  "ogImageUrl": ogImage.asset->url,
  noIndex,
  noFollow
}`;
var globalSettingsQuery = `*[_type == "globalSettings"][0]{
  footerTagline,
  supportEmail,
  linkedinUrl,
  instagramUrl,
  copyrightLine,
  announcementEnabled,
  announcementText,
  announcementButtonLabel,
  announcementButtonLink
}`;
var navigationQuery = `*[_type == "navigation"][0]{
  primary[]{
    label,
    href,
    description,
    badge,
    children[]{
      label,
      href,
      description,
      badge,
      children[]{
        label,
        href,
        description,
        badge
      }
    }
  },
  footer[]{
    label,
    href,
    description,
    badge,
    children[]{
      label,
      href,
      description,
      badge,
      children[]{
        label,
        href,
        description,
        badge
      }
    }
  }
}`;
var siteSettingsQuery = `*[_type == "siteSettings"][0]{
  "siteName": coalesce(brandName, siteName),
  "logoUrl": coalesce(logoLight.asset->url, logo.asset->url),
  faviconPath,
  defaultSeo{
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    "ogImageUrl": ogImage.asset->url,
    noIndex,
    noFollow
  }
}`;
var featuredStoriesQuery = `*[_type == "story" && featured == true && !(_id in path("drafts.**"))]
| order(publishedAt desc, _updatedAt desc)[0...6]{
  title,
  "slug": slug.current,
  excerpt,
  "coverImageSrc": headerImage.asset->url,
  "coverImageAlt": headerImageAlt,
  "tag": filters[0]->title,
  publishedAt,
  ${seoFragment},
  body
}`;
var storiesQuery = `*[_type == "story" && !(_id in path("drafts.**"))]
| order(publishedAt desc, _updatedAt desc){
  title,
  "slug": slug.current,
  excerpt,
  "coverImageSrc": headerImage.asset->url,
  "coverImageAlt": headerImageAlt,
  "tag": filters[0]->title,
  publishedAt,
  featured
}`;
var storiesPageQuery = `*[_type == "storiesPage"][0]{
  headlinePortable,
  subheadline,
  ${seoFragment}
}`;
var storyBySlugQuery = `*[_type == "story" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  excerpt,
  "coverImageSrc": headerImage.asset->url,
  "coverImageAlt": headerImageAlt,
  "tag": filters[0]->title,
  publishedAt,
  featured,
  body,
  ${seoFragment}
}`;
var pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  ${seoFragment},
  sections[]{
    ...,
    "imageUrl": image.asset->url,
    primaryCta{ label, href, description, badge },
    secondaryCta{ label, href, description, badge },
    cards[]{
      ...,
      "imageUrl": image.asset->url,
      cta{ label, href, description, badge }
    }
  }
}`;
var pageSectionsFragment = `sections[]{
  ...,
  "imageUrl": image.asset->url,
  primaryCta{ label, href, description, badge },
  secondaryCta{ label, href, description, badge },
  cards[]{
    ...,
    "imageUrl": image.asset->url,
    cta{ label, href, description, badge }
  }
}`;
var networkFoundersPageQuery = `*[_type == "networkFoundersPage"][0]{
  title,
  useModularPage,
  ${seoFragment},
  ${pageSectionsFragment}
}`;
var networkAdvisorsPageQuery = `*[_type == "networkAdvisorsPage"][0]{
  title,
  useModularPage,
  ${seoFragment},
  ${pageSectionsFragment}
}`;
var networkInvestorsPageQuery = `*[_type == "networkInvestorsPage"][0]{
  title,
  useModularPage,
  logoMarquee[]{
    name,
    "src": logo.asset->url,
    href
  },
  ${seoFragment},
  ${pageSectionsFragment}
}`;
var networkPartnersPageQuery = `*[_type == "networkPartnersPage"][0]{
  title,
  useModularPage,
  ${seoFragment},
  ${pageSectionsFragment}
}`;
var homePageQuery = `*[_type == "homePage"][0]{
  headlinePrefix,
  subheadline,
  primaryCtaLabel,
  primaryCtaPath,
  secondaryCtaLabel,
  secondaryCtaPath,
  "heroBackgroundVideoUrl": coalesce(heroBackgroundVideo.asset->url, heroBackgroundVideoUrl),
  metricsHeading,
  metricsSubheading,
  metrics[]{ label, value, suffix },
  howItWorksSectionTitle,
  testimonialsTitlePortable,
  whyFeatures[]{ 
    iconKey, 
    title, 
    description, 
    buttonLabel, 
    buttonPath,
    "imageSrc": coalesce(imageSrc, image.asset->url)
  },
  ctaTitle,
  ctaButtonLabel,
  ctaButtonPath,
  "ctaImageUrl": coalesce(ctaImage.asset->url, ctaImageUrl),
  ctaImageAlt,
  testimonials[]{
    name,
    role,
    company,
    quote,
    companyInfo,
    "imageSrc": coalesce(imageSrc, image.asset->url)
  },
  pathsTitle,
  pathsCards[]{
    roleId,
    tagLabel,
    title,
    subtitle,
    "imageSrc": coalesce(imageSrc, image.asset->url),
    imageAlt,
    ctaLabel,
    ctaTo
  },
  ${seoFragment}
}`;
var aboutPageQuery = `*[_type == "aboutPage"][0]{
  heroLine1,
  heroLine2Portable,
  heroLine3,
  heroIntro,
  missionTitle,
  missionParagraphs,
  "missionImageSrc": coalesce(missionImage.asset->url, missionImageSrc),
  missionImageAlt,
  valuesTitle,
  valuesSubtitle,
  values[]{ iconKey, title, description },
  teamTitle,
  teamSubtitle,
  team[]{
    name,
    role,
    bio,
    linkedinUrl,
    websiteUrl,
    "imageSrc": coalesce(imageSrc, image.asset->url)
  },
  ctaTitle,
  ctaBody,
  ctaFounderLabel,
  ctaTeamLabel,
  ${seoFragment}
}`;
var faqPageQuery = `*[_type == "faqPage" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{
  badge,
  title,
  subtitle,
  items[]{ id, question, answer },
  sidebarTitle,
  sidebarBody,
  sidebarCtaLabel,
  sidebarCtaPath,
  bottomTitle,
  bottomBody,
  bottomCtaLabel,
  bottomCtaPath,
  ${seoFragment}
}`;
var programsLandingQuery = `*[_type == "programsLandingPage"][0]{
  heroTitlePortable,
  heroSubtitle,
  heroPrimaryCtaLabel,
  heroSecondaryCtaLabel,
  programsSectionTitle,
  programsSectionSubtitle,
  ctaTitle,
  ctaBody,
  ctaButtonLabel,
  ctaButtonHref,
  ${seoFragment}
}`;
var eventsLandingQuery = `*[_type == "eventsLandingPage"][0]{
  heroTitlePortable,
  heroSubtitle,
  ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  ${seoFragment}
}`;
var programDetailFields = `
  paymentUrl,
  heroTitle,
  heroDescription,
  heroCtaLabel,
  outcomesTitle,
  outcomesIntro,
  outcomes,
  howItWorksTitle,
  howItWorksIntro,
  pillarsTitle,
  timelineTitle,
  timelineSubtitle,
  pricingBadge,
  pricingAmount,
  pricingSubAmount,
  pricingDescription,
  pricingBullets,
  bottomCtaTitle,
  bottomCtaBody,
  bottomCtaButtonLabel,
  bottomContactHref,
  sections[]{
    ...,
    "imageUrl": image.asset->url,
    primaryCta{ label, href, description, badge },
    secondaryCta{ label, href, description, badge },
    cards[]{
      ...,
      "imageUrl": image.asset->url,
      cta{ label, href, description, badge }
    }
  }
`;
var programsQuery = `*[_type == "program" && status != "hidden" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  title,
  "slug": slug.current,
  description,
  deadline,
  "imageSrc": image.asset->url,
  href,
  buttonText,
  waitlistHref,
  status,
  sortOrder,
  ${seoFragment}
}`;
var programBySlugQuery = `*[_type == "program" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  description,
  deadline,
  "imageSrc": image.asset->url,
  href,
  buttonText,
  waitlistHref,
  status,
  sortOrder,
  ${programDetailFields},
  ${seoFragment}
}`;
var eventsQuery = `*[_type == "event" && status != "hidden" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  title,
  "slug": slug.current,
  startsAt,
  endsAt,
  dateTime,
  person,
  "imageSrc": image.asset->url,
  href,
  comingSoon,
  buttonText,
  location,
  lumaEventId,
  eventDescription,
  "detailBody": coalesce(eventDescription, detailBody),
  detailBodyHeading,
  embedLumaOnDetailPage,
  addToCalendarEnabled,
  status,
  sortOrder
}`;
var eventBySlugQuery = `*[_type == "event" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  startsAt,
  endsAt,
  dateTime,
  person,
  "imageSrc": image.asset->url,
  href,
  comingSoon,
  buttonText,
  location,
  lumaEventId,
  eventDescription,
  "detailBody": coalesce(eventDescription, detailBody),
  detailBodyHeading,
  embedLumaOnDetailPage,
  addToCalendarEnabled,
  status,
  sortOrder,
  ${seoFragment}
}`;
var contactPageQuery = `*[_type == "contactPage"][0]{
  heroBadge,
  pageTitle,
  intro,
  "sideImageSrc": coalesce(sideImage.asset->url, sideImageSrc),
  sideImageAlt,
  quoteText,
  quoteAttributionName,
  quoteAttributionRole,
  successTitle,
  successBody,
  labels,
  placeholders,
  subjectPlaceholder,
  companySizePlaceholder,
  subjectOptions[]{ value, label },
  companySizeOptions[]{ value, label },
  submitLabel,
  sendingLabel,
  ${seoFragment}
}`;
var notFoundQuery = `*[_type == "notFoundPage"][0]{
  title,
  message,
  ctaLabel,
  ${seoFragment}
}`;
var paymentPageQuery = `*[_type == "paymentPage"][0]{
  badge,
  headline,
  introCheckout,
  introFallback,
  introFallbackError,
  benefitsTitle,
  benefits,
  successTitle,
  successBody,
  discountBannerEnabled,
  discountBannerBadge,
  discountBannerTitle,
  discountBannerSubtitle,
  discountBannerApplyLabel,
  discountBannerApplyHref,
  heroHeadlinePortable,
  heroSubheadline,
  imageCardBadge,
  imageCardHeadlinePortable,
  "imageCardSrc": coalesce(imageCardImage.asset->url, imageCardSrc),
  imageCardAlt,
  highlightBenefits,
  pricingMonthlyBadge,
  pricingAnnualBadge,
  pricingMonthlyAmount,
  pricingAnnualAmount,
  pricingPerSuffix,
  popularLabel,
  monthlyProceedLabel,
  annualProceedLabel,
  questionsTitle,
  questionsFaqLabel,
  questionsFaqPath,
  questionsContactLabel,
  questionsContactPath,
  ${seoFragment}
}`;
var careersPageQuery = `*[_type == "careersPage"][0]{
  defaultTab,
  enableHiringTab,
  enableVolunteerTab,
  tabsLabelHiring,
  tabsLabelVolunteer,
  ${seoFragment}
}`;
var advisorsQuery = `*[_type == "advisor" && !(_id in path("drafts.**"))]{
  "id": slug.current,
  name,
  organization,
  role,
  location,
  country,
  yearJoined,
  industries,
  focus,
  "filter": filter->label,
  directoryFilters[]{
    "groupId": group->slug.current,
    "groupTitle": group->title,
    "groupAppliesTo": group->appliesTo,
    "groupSortOrder": group->sortOrder,
    values
  },
  "photoSrc": coalesce(photo.asset->url, photoSrc),
  linkedInUrl,
  websiteUrl,
  bio,
  mentoringStyle,
  highlights
}`;
var alumniCompaniesQuery = `*[_type == "alumniCompany" && !(_id in path("drafts.**"))]{
  "id": slug.current,
  name,
  slug,
  tagline,
  "specialties": specialties[]->label,
  businessModel,
  directoryFilters[]{
    "groupId": group->slug.current,
    "groupTitle": group->title,
    "groupAppliesTo": group->appliesTo,
    "groupSortOrder": group->sortOrder,
    values
  },
  shortDescription,
  longDescription,
  websiteUrl,
  linkedinUrl,
  traction,
  relliaCollaboration,
  country,
  yearJoined,
  programs,
  "logoSrc": coalesce(logo.asset->url, logoSrc),
  founders[]{
    name,
    role,
    bio,
    linkedinUrl,
    "imageSrc": coalesce(imageSrc, image.asset->url)
  }
}`;
var advisorFiltersQuery = `*[_type == "advisorFilter"] | order(sortOrder asc, label asc){
  "id": slug.current,
  label,
  sortOrder
}`;
var founderLevelsQuery = `*[_type == "founderLevel"] | order(sortOrder asc, label asc){
  "id": slug.current,
  label,
  sortOrder
}`;
var founderSpecialtiesQuery = `*[_type == "founderSpecialty"] | order(sortOrder asc, label asc){
  "id": slug.current,
  label,
  sortOrder
}`;
var directoryFilterGroupsQuery = `*[_type == "directoryFilterGroup"] | order(sortOrder asc, title asc){
  "id": slug.current,
  title,
  appliesTo,
  sortOrder,
  options[]{ label }
}`;
var sanityDraftsQuery = `*[
  _id in path("drafts.**")
  && !(_type match "sanity.*")
  && _type != "system.schema"
] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, name, headline, slug.current, _type),
  _updatedAt
}[0...24]`;
var sanityRecentEditsQuery = `*[
  !(_id in path("drafts.**"))
  && !(_type match "sanity.*")
  && _type != "system.schema"
] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, name, headline, slug.current, _type),
  _updatedAt
}[0...16]`;

// shared/cms/sanityQueryRegistry.ts
var empty = z.object({}).strict();
var slugParams = z.object({
  slug: z.string().trim().min(1).max(200)
}).strict();
var SANITY_QUERY_WHITELIST = {
  globalSettings: { query: globalSettingsQuery, params: empty },
  navigation: { query: navigationQuery, params: empty },
  siteSettings: { query: siteSettingsQuery, params: empty },
  featuredStories: { query: featuredStoriesQuery, params: empty },
  stories: { query: storiesQuery, params: empty },
  storiesPage: { query: storiesPageQuery, params: empty },
  storyBySlug: { query: storyBySlugQuery, params: slugParams },
  pageBySlug: { query: pageBySlugQuery, params: slugParams },
  networkFoundersPage: { query: networkFoundersPageQuery, params: empty },
  networkAdvisorsPage: { query: networkAdvisorsPageQuery, params: empty },
  networkInvestorsPage: { query: networkInvestorsPageQuery, params: empty },
  networkPartnersPage: { query: networkPartnersPageQuery, params: empty },
  homePage: { query: homePageQuery, params: empty },
  aboutPage: { query: aboutPageQuery, params: empty },
  faqPage: { query: faqPageQuery, params: empty },
  programsLanding: { query: programsLandingQuery, params: empty },
  eventsLanding: { query: eventsLandingQuery, params: empty },
  programs: { query: programsQuery, params: empty },
  programBySlug: { query: programBySlugQuery, params: slugParams },
  events: { query: eventsQuery, params: empty },
  eventBySlug: { query: eventBySlugQuery, params: slugParams },
  contactPage: { query: contactPageQuery, params: empty },
  notFound: { query: notFoundQuery, params: empty },
  paymentPage: { query: paymentPageQuery, params: empty },
  careersPage: { query: careersPageQuery, params: empty },
  advisors: { query: advisorsQuery, params: empty },
  alumniCompanies: { query: alumniCompaniesQuery, params: empty },
  advisorFilters: { query: advisorFiltersQuery, params: empty },
  founderLevels: { query: founderLevelsQuery, params: empty },
  founderSpecialties: { query: founderSpecialtiesQuery, params: empty },
  directoryFilterGroups: { query: directoryFilterGroupsQuery, params: empty },
  sanityDrafts: { query: sanityDraftsQuery, params: empty },
  sanityRecentEdits: { query: sanityRecentEditsQuery, params: empty }
};
var isSanityQueryId = (value) => Object.prototype.hasOwnProperty.call(SANITY_QUERY_WHITELIST, value);

// server/sanityResponseSanitize.ts
var STRIP_KEYS = /* @__PURE__ */ new Set(["_id", "_rev", "_ref", "allReferences"]);
var PRESERVE_ID_QUERIES = /* @__PURE__ */ new Set(["sanityDrafts", "sanityRecentEdits"]);
var stripSanityMetadata = (value, queryId) => {
  const stripKeys = queryId && PRESERVE_ID_QUERIES.has(queryId) ? /* @__PURE__ */ new Set(["_rev", "_ref", "allReferences"]) : STRIP_KEYS;
  if (value == null) return value;
  if (Array.isArray(value)) {
    return value.map((item) => stripSanityMetadata(item, queryId));
  }
  if (typeof value === "object") {
    const o = value;
    const out = {};
    for (const [k, v] of Object.entries(o)) {
      if (stripKeys.has(k)) continue;
      out[k] = stripSanityMetadata(v, queryId);
    }
    return out;
  }
  return value;
};

// server/sanityPreview.ts
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";
var SANITY_STUDIO_FALLBACK_URL = "https://relliahealth.sanity.studio";
var resolveSanityStudioUrl = () => process.env.SANITY_STUDIO_URL?.trim() || SANITY_STUDIO_FALLBACK_URL;
var isSanityStudioReferer = (req) => {
  const referer = (req.get("referer") || "").toLowerCase();
  return referer.includes(".sanity.studio") || referer.includes(".sanity.io");
};
var hasSanityPreviewPerspectiveCookie = (cookieHeader) => cookieHeader.includes(`${perspectiveCookieName}=`);
var SANITY_PRESENTATION_HEADER = "x-sanity-presentation";
var isPresentationPreviewRequest = (req, cookieHeader, siteOriginsAllowed) => {
  if (hasSanityPreviewPerspectiveCookie(cookieHeader)) return true;
  if (!siteOriginsAllowed) return false;
  return (req.get(SANITY_PRESENTATION_HEADER) || "").trim() === "1";
};

// server/sanityEnv.ts
var parseList = (raw) => (raw ?? "").split(",").map((s) => s.trim()).filter(Boolean);
var resolveSanityApiConfig = () => {
  const deployed = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
  const projectId = process.env.SANITY_API_PROJECT_ID?.trim() || process.env.VITE_SANITY_PROJECT_ID?.trim();
  let dataset = process.env.SANITY_API_DATASET?.trim() || process.env.VITE_SANITY_DATASET?.trim() || (deployed ? "production" : "preview");
  const enforceVercel = process.env.SANITY_ENFORCE_VERCEL_DATASET === "true" || process.env.SANITY_ENFORCE_VERCEL_DATASET === "1";
  if (enforceVercel && process.env.VERCEL) {
    const ve = process.env.VERCEL_ENV?.trim();
    if (ve === "preview") dataset = "preview";
    if (ve === "production") dataset = "production";
  }
  const explicitAllowed = parseList(process.env.SANITY_ALLOWED_DATASETS);
  if (explicitAllowed.length > 0 && !explicitAllowed.includes(dataset)) {
    return {
      status: "dataset_not_allowed",
      attemptedDataset: dataset
    };
  }
  if (projectId) {
    return { status: "ok", projectId, dataset };
  }
  if (!deployed) {
    return { status: "ok", projectId: "ggbt0o98", dataset };
  }
  return { status: "missing_project" };
};

// server/csrf.ts
import { randomBytes } from "node:crypto";
var CSRF_COOKIE_NAME = "rellia_csrf";
var CSRF_MAX_AGE_S = 7200;
var parseCookieHeader = (raw) => {
  const out = {};
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
var buildCsrfSetCookie = (token, isDev) => {
  const parts = [
    `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${CSRF_MAX_AGE_S}`,
    "SameSite=Lax"
  ];
  if (!isDev) parts.push("Secure");
  return parts.join("; ");
};
var issueCsrfToken = () => randomBytes(32).toString("base64url");
var requireApiCsrf = (isDev) => (req, res, next) => {
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
      code: "CSRF"
    });
    return;
  }
  next();
};

// server/adminSignupEnv.ts
var isAdminSignupEnabled = () => {
  const raw = (process.env.ADMIN_SIGNUP_ENABLED ?? "").trim().toLowerCase();
  if (!raw) return false;
  const normalized = raw.replace(/^["']|["']$/g, "");
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
};

// server/siteOrigins.ts
var safeOriginFromUrl = (input) => {
  const value = (input ?? "").trim();
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};
var buildSiteOrigins = () => {
  const origins = /* @__PURE__ */ new Set();
  const add = (value) => {
    const origin = safeOriginFromUrl(value);
    if (origin) origins.add(origin);
  };
  add(process.env.VITE_SITE_URL);
  add(process.env.SITE_URL);
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    add(vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`);
  }
  for (const entry of (process.env.ALLOWED_ORIGINS || "").split(",")) {
    add(entry.trim());
  }
  origins.add("https://www.relliahealth.com");
  origins.add("https://relliahealth.com");
  origins.add("https://relliahealth.vercel.app");
  return origins;
};
var isAllowedBrowserOrigin = (req, baseOrigins, isDev) => {
  if (isDev) return true;
  const allowed = new Set(baseOrigins);
  const host = (req.get("host") || "").trim();
  const forwardedProto = (req.get("x-forwarded-proto") || req.protocol || "https").split(",")[0]?.trim();
  const proto = forwardedProto || "https";
  if (host) {
    allowed.add(`${proto}://${host}`);
    if (host.startsWith("www.")) {
      allowed.add(`${proto}://${host.slice(4)}`);
    }
  }
  const originHeader = (req.get("origin") || "").trim();
  if (originHeader && allowed.has(originHeader)) return true;
  if (originHeader && (originHeader.endsWith(".sanity.studio") || originHeader.endsWith(".sanity.io"))) {
    return true;
  }
  const refererHeader = (req.get("referer") || "").trim();
  const refererOrigin = safeOriginFromUrl(refererHeader);
  if (refererOrigin && allowed.has(refererOrigin)) return true;
  if (refererOrigin && (refererOrigin.endsWith(".sanity.studio") || refererOrigin.endsWith(".sanity.io"))) {
    return true;
  }
  if (!originHeader && host && allowed.has(`${proto}://${host}`)) return true;
  return false;
};

// server/index.ts
var headerOne = (req, name) => {
  const v = req.headers?.[name];
  if (Array.isArray(v)) return v[0];
  return typeof v === "string" ? v : void 0;
};
var getClientIp = (req) => {
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
var fixVercelRewrittenApiPath = (req, _res, next) => {
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
    const candidate = headerOne(req, "x-vercel-original-path") || headerOne(req, "x-invoke-path") || headerOne(req, "x-matched-path") || headerOne(req, "x-forwarded-uri");
    if (candidate?.startsWith("/api/")) {
      const pathOnly = candidate.split("?")[0] ?? "";
      if (pathOnly && pathOnly !== "/api" && pathOnly !== "/api/") {
        req.url = pathOnly + (candidate.includes("?") ? candidate.slice(candidate.indexOf("?")) : "");
        next();
        return;
      }
    }
  } catch {
  }
  next();
};
var stripInternalQuery = (search) => {
  if (!search || search === "?") return "";
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.delete("__path");
  const rest = params.toString();
  return rest ? `?${rest}` : "";
};
function createServer() {
  const app2 = express();
  app2.set("trust proxy", 1);
  app2.use(fixVercelRewrittenApiPath);
  const isDev = process.env.NODE_ENV !== "production";
  app2.use(
    isDev ? helmet({
      contentSecurityPolicy: false,
      strictTransportSecurity: false
    }) : helmet({
      // Visual editing uses Studio -> iframe preview; framing is controlled by CSP headers in `vercel.json`.
      frameguard: false
    })
  );
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);
  const safeOriginFromUrl2 = (input) => {
    const v = (input ?? "").trim();
    if (!v) return null;
    try {
      return new URL(v).origin;
    } catch {
      return null;
    }
  };
  const studioOrigin = safeOriginFromUrl2(process.env.SANITY_STUDIO_URL);
  const siteOrigins = buildSiteOrigins();
  const siteOrigin = process.env.VITE_SITE_URL?.trim() || process.env.SITE_URL?.trim() || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}` : "https://www.relliahealth.com");
  const allowBrowserOrigin = (req, extraAllowedOrigins) => {
    const merged = new Set(siteOrigins);
    if (extraAllowedOrigins) {
      for (const origin of extraAllowedOrigins) merged.add(origin);
    }
    for (const origin of allowedOrigins) {
      if (origin) merged.add(origin);
    }
    return isAllowedBrowserOrigin(req, merged, isDev);
  };
  if (!isDev && allowedOrigins.length === 0) {
    console.warn(
      "ALLOWED_ORIGINS is not set. CORS will allow all browser origins. Set ALLOWED_ORIGINS to restrict cross-origin requests."
    );
  }
  app2.use(
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
      }
    })
  );
  app2.use(express.json({ limit: "32kb" }));
  app2.use(express.urlencoded({ extended: true, limit: "32kb" }));
  const RATE_WINDOW_MS = 6e4;
  const RATE_MAP_MAX = 5e3;
  const applyRateLimit = (map, ip, max) => {
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
  const csrfIssueRate = /* @__PURE__ */ new Map();
  const healthRate = /* @__PURE__ */ new Map();
  const studioRedirectRate = /* @__PURE__ */ new Map();
  const draftModeRate = /* @__PURE__ */ new Map();
  const contactRate = /* @__PURE__ */ new Map();
  const stripeCheckoutRate = /* @__PURE__ */ new Map();
  const diagnosticRate = /* @__PURE__ */ new Map();
  const sanityPreviewRate = /* @__PURE__ */ new Map();
  const sanityPublishedRate = /* @__PURE__ */ new Map();
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
  const rateLimitJson = (map, maxPerWindow) => {
    return (req, res, next) => {
      const ip = getClientIp(req);
      if (!applyRateLimit(map, ip, maxPerWindow)) {
        res.status(429).json({ error: "Too many requests. Please try again shortly." });
        return;
      }
      next();
    };
  };
  const rateLimitText = (map, maxPerWindow) => {
    return (req, res, next) => {
      const ip = getClientIp(req);
      if (!applyRateLimit(map, ip, maxPerWindow)) {
        res.status(429).type("text/plain").send("Too many requests. Please try again shortly.");
        return;
      }
      next();
    };
  };
  const healthHandler = (_req, res) => {
    res.status(200).json({ ok: true });
  };
  app2.get("/health", rateLimitJson(healthRate, HEALTH_MAX_PER_MIN), healthHandler);
  app2.get("/api/health", rateLimitJson(healthRate, HEALTH_MAX_PER_MIN), healthHandler);
  app2.get(
    "/api/csrf-token",
    rateLimitJson(csrfIssueRate, CSRF_TOKEN_MAX_PER_MIN),
    (_req, res) => {
      const token = issueCsrfToken();
      res.setHeader("Set-Cookie", buildCsrfSetCookie(token, isDev));
      res.status(200).json({ csrfToken: token });
    }
  );
  app2.get(
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
    }
  );
  const hasSanityPreviewSecret = (req) => {
    try {
      const host = headerOne(req, "x-forwarded-host")?.trim() || req.get("host") || process.env.VERCEL_URL || "localhost";
      const protocol = headerOne(req, "x-forwarded-proto")?.trim() || req.protocol || "https";
      const origin = `${protocol}://${host.replace(/^https?:\/\//, "")}`;
      const requestUrl = new URL(req.originalUrl || req.url, origin);
      return requestUrl.searchParams.has("sanity-preview-secret") || requestUrl.searchParams.has("sanity-preview-perspective-secret");
    } catch {
      return false;
    }
  };
  app2.get(
    "/api/draft-mode/enable",
    rateLimitText(draftModeRate, DRAFT_MODE_MAX_PER_MIN),
    async (req, res) => {
      const studioOnlyOrigins = new Set([studioOrigin].filter(Boolean));
      if (!allowBrowserOrigin(req, studioOnlyOrigins) && !hasSanityPreviewSecret(req) && !isSanityStudioReferer(req)) {
        res.status(403).send("Forbidden");
        return;
      }
      const token = process.env.SANITY_API_READ_TOKEN?.trim();
      if (!token) {
        res.status(501).send("Missing SANITY_API_READ_TOKEN");
        return;
      }
      try {
        const forwardedProto = headerOne(req, "x-forwarded-proto")?.trim();
        const forwardedHost = headerOne(req, "x-forwarded-host")?.trim();
        const host = forwardedHost || req.get("host") || process.env.VERCEL_URL || "localhost";
        const protocol = forwardedProto || (typeof req.protocol === "string" ? req.protocol : "");
        const origin = `${protocol || "https"}://${host.replace(/^https?:\/\//, "")}`;
        const requestUrl = new URL(req.originalUrl || req.url, origin).toString();
        const apiResolved = resolveSanityApiConfig();
        if (apiResolved.status === "dataset_not_allowed") {
          res.status(503).send(
            `Sanity dataset "${apiResolved.attemptedDataset}" is not allowed. Check SANITY_ALLOWED_DATASETS and SANITY_ENFORCE_VERCEL_DATASET.`
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
          apiVersion: "2024-01-01"
        });
        const { isValid, redirectTo, studioPreviewPerspective } = await validatePreviewUrl(previewClient, requestUrl);
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
        const isLocalPreview = host.includes("localhost");
        const cookieFlags = isLocalPreview ? "Path=/; SameSite=Lax; Max-Age=3600" : "Path=/; HttpOnly; Secure; SameSite=None; Max-Age=3600";
        res.setHeader("Set-Cookie", `${perspectiveCookieName2}=${perspective}; ${cookieFlags}`);
        res.redirect(307, cleanRedirect);
      } catch (err) {
        res.status(500).send(err instanceof Error ? err.message : "Unexpected error");
      }
    }
  );
  app2.get(
    "/api/draft-mode/disable",
    rateLimitText(draftModeRate, DRAFT_MODE_MAX_PER_MIN),
    (_req, res) => {
      const reqAny = _req;
      if (!allowBrowserOrigin(reqAny, new Set([studioOrigin].filter(Boolean))) && !isSanityStudioReferer(reqAny)) {
        res.status(403).send("Forbidden");
        return;
      }
      res.setHeader(
        "Set-Cookie",
        `${perspectiveCookieName2}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`
      );
      res.redirect(307, "/");
    }
  );
  const diagnosticReportPayloadSchema = z2.object({
    name: z2.string().trim().min(1).max(200),
    email: z2.string().trim().email(),
    company: z2.string().trim().min(1).max(200),
    stage: z2.string().trim().min(1).max(120),
    desc: z2.string().trim().min(1).max(1200),
    sectionScoresMarkdown: z2.string().trim().min(1).max(8e3),
    rawAnswers: z2.any().optional()
  });
  const diagnosticReportResponseSchema = z2.object({
    summary: z2.string(),
    top3_strengths: z2.array(
      z2.object({
        category: z2.string(),
        score: z2.number(),
        note: z2.string()
      })
    ),
    top3_weaknesses: z2.array(
      z2.object({
        category: z2.string(),
        score: z2.number(),
        note: z2.string(),
        priority: z2.string()
      })
    ),
    recommendations: z2.array(z2.string()),
    mentor_areas_needed: z2.array(z2.string())
  });
  const sanityResolved = resolveSanityApiConfig();
  const sanityApiCfg = sanityResolved.status === "ok" ? sanityResolved : null;
  const previewAndSiteOrigins = new Set(siteOrigins);
  if (studioOrigin) previewAndSiteOrigins.add(studioOrigin);
  app2.post("/api/sanity/query", requireCsrf, async (req, res) => {
    if (!allowBrowserOrigin(req, previewAndSiteOrigins)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const cookie = req.headers.cookie || "";
    const isPreviewSession = isPresentationPreviewRequest(
      req,
      cookie,
      allowBrowserOrigin(req, previewAndSiteOrigins)
    );
    const token = process.env.SANITY_API_READ_TOKEN?.trim();
    if (!isDev) {
      const hasProvenance = Boolean((req.get("origin") || "").trim()) || Boolean((req.get("referer") || "").trim());
      if (!hasProvenance) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
    }
    const ip = getClientIp(req);
    const rateMap = isPreviewSession ? sanityPreviewRate : sanityPublishedRate;
    const rateMax = isPreviewSession ? SANITY_PREVIEW_MAX_PER_MIN : SANITY_PUBLISHED_MAX_PER_MIN;
    if (!applyRateLimit(rateMap, ip, rateMax)) {
      res.status(429).json({ error: "Too many requests. Please try again shortly." });
      return;
    }
    const bodySchema = z2.object({
      queryId: z2.string().trim(),
      params: z2.record(z2.unknown()).optional()
    });
    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parsedBody.error.flatten()
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
        details: paramsParsed.error.flatten()
      });
      return;
    }
    const apiResolved = resolveSanityApiConfig();
    if (apiResolved.status === "dataset_not_allowed") {
      res.status(503).json({
        error: `Sanity dataset "${apiResolved.attemptedDataset}" is not allowed for this deployment. Set SANITY_ALLOWED_DATASETS or adjust SANITY_API_DATASET / SANITY_ENFORCE_VERCEL_DATASET.`
      });
      return;
    }
    if (apiResolved.status === "missing_project") {
      res.status(503).json({
        error: "Sanity API is not configured. Set SANITY_API_PROJECT_ID (and dataset) in the server environment."
      });
      return;
    }
    const { projectId, dataset } = apiResolved;
    const fetchParams = paramsParsed.data;
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
          stega: { enabled: true, studioUrl: resolveSanityStudioUrl() }
        });
        const data2 = await previewClient.fetch(entry.query, fetchParams);
        res.status(200).json({
          data: stripSanityMetadata(data2, parsedBody.data.queryId)
        });
        return;
      }
      const publicClient = createClient({
        projectId,
        dataset,
        ...token ? { token } : {},
        useCdn: false,
        apiVersion: "2024-01-01"
      });
      const data = await publicClient.fetch(entry.query, fetchParams);
      res.status(200).json({
        data: stripSanityMetadata(data, parsedBody.data.queryId)
      });
    } catch (err) {
      res.status(502).json({
        error: "Sanity fetch failed",
        message: err instanceof Error ? err.message : String(err)
      });
    }
  });
  const contactPayloadSchema = z2.object({
    firstName: z2.string().trim().min(1).max(120),
    lastName: z2.string().trim().min(1).max(120),
    email: z2.string().trim().email().max(254),
    company: z2.string().trim().max(200).optional(),
    jobTitle: z2.string().trim().max(200).optional(),
    message: z2.string().trim().min(1).max(8e3)
  });
  app2.post(
    "/api/contact",
    rateLimitJson(contactRate, CONTACT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      if (!isDev) {
        const hasProvenance = Boolean((req.get("origin") || "").trim()) || Boolean((req.get("referer") || "").trim());
        if (!hasProvenance) {
          res.status(403).json({ error: "Forbidden" });
          return;
        }
      }
      const parsed = contactPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid request",
          details: parsed.error.flatten()
        });
        return;
      }
      const { firstName, lastName, email, message } = parsed.data;
      const company = parsed.data.company?.trim() ?? "";
      const jobTitle = parsed.data.jobTitle?.trim() ?? "";
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "").trim();
      const supabaseKey = serviceRoleKey || anonKey;
      if (!supabaseUrl || !supabaseKey) {
        res.status(501).json({
          error: "Contact form is not configured on the server.",
          hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel (server-only). Run scripts/supabase_setup.sql once in Supabase."
        });
        return;
      }
      const row = {
        first_name: firstName,
        last_name: lastName,
        email,
        company: company || null,
        job_title: jobTitle || null,
        message
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
              Prefer: "return=minimal"
            },
            body: JSON.stringify(row)
          }
        );
        if (insertRes.ok) {
          res.status(200).json({ ok: true });
          return;
        }
        const errText = await insertRes.text();
        console.error(
          "Supabase contact insert failed",
          insertRes.status,
          errText.slice(0, 800)
        );
        const rateLimited = insertRes.status === 429 || errText.toLowerCase().includes("too many submissions");
        res.status(502).json({
          error: rateLimited ? "Too many messages from this email. Please try again in an hour." : "Could not send your message right now. Please try again or email us directly.",
          ...isDev ? { detail: errText.slice(0, 300), status: insertRes.status } : {}
        });
      } catch (err) {
        console.error("Contact submit error", err);
        res.status(502).json({
          error: "Could not send your message right now. Please try again or email us directly."
        });
      }
    }
  );
  const stripeCheckoutPayloadSchema = z2.object({
    plan: z2.enum(["monthly", "annual"])
  });
  app2.post(
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
          details: parsed.error.flatten()
        });
        return;
      }
      const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
      const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID?.trim();
      const annualPriceId = process.env.STRIPE_ANNUAL_PRICE_ID?.trim();
      const monthlyLink = (process.env.STRIPE_MONTHLY_PLAN_LINK || process.env.VITE_STRIPE_MONTHLY_PLAN_LINK || "").trim();
      const annualLink = (process.env.STRIPE_ANNUAL_PLAN_LINK || process.env.VITE_STRIPE_ANNUAL_PLAN_LINK || "").trim();
      const priceId = parsed.data.plan === "annual" ? annualPriceId : monthlyPriceId;
      const fallbackUrl = parsed.data.plan === "annual" ? annualLink : monthlyLink;
      if (!secretKey || !priceId) {
        res.status(501).json({
          error: "Embedded checkout is not configured.",
          hint: "Set STRIPE_SECRET_KEY, STRIPE_MONTHLY_PRICE_ID, and STRIPE_ANNUAL_PRICE_ID (price_\u2026 from Stripe \u2192 Products). Payment links cannot embed in-page.",
          ...fallbackUrl ? { paymentLinkUrl: fallbackUrl } : {}
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
          cancel_url: `${siteOrigin.replace(/\/$/, "")}/membership?cancel=true`
        });
        if (!session.url) {
          res.status(502).json({ error: "Could not create checkout session." });
          return;
        }
        res.status(200).json({ url: session.url });
      } catch (err) {
        const stripeMessage = err instanceof Error ? err.message : String(err);
        console.error("Stripe checkout session error", err);
        res.status(502).json({
          error: "Could not start checkout.",
          stripeMessage,
          ...fallbackUrl ? { paymentLinkUrl: fallbackUrl } : {}
        });
      }
    }
  );
  app2.post(
    "/api/stripe/create-checkout-session",
    rateLimitJson(stripeCheckoutRate, STRIPE_CHECKOUT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
      if (!secretKey) {
        res.status(501).json({ error: "Stripe is not configured on the server." });
        return;
      }
      const parsed = z2.object({ priceId: z2.string().min(1) }).safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid request" });
        return;
      }
      try {
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(secretKey);
        const origin = headerOne(req, "origin") ?? siteOrigin;
        const session = await stripe.checkout.sessions.create({
          ui_mode: "embedded",
          mode: "subscription",
          line_items: [{ price: parsed.data.priceId, quantity: 1 }],
          allow_promotion_codes: true,
          billing_address_collection: "auto",
          automatic_tax: { enabled: true },
          return_url: `${origin}/membership?session_id={CHECKOUT_SESSION_ID}`
        });
        if (!session.client_secret) {
          res.status(500).json({ error: "Stripe did not return a client_secret." });
          return;
        }
        res.json({ clientSecret: session.client_secret });
      } catch (err) {
        res.status(500).json({
          error: "Failed to create checkout session",
          message: err instanceof Error ? err.message : String(err)
        });
      }
    }
  );
  app2.post("/api/diagnostic-report", requireCsrf, async (req, res) => {
    if (!allowBrowserOrigin(req)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
    const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "").trim();
    if (!supabaseUrl || !supabaseKey) {
      res.status(501).json({
        error: "Diagnostic survey is not configured on the server.",
        hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run scripts/supabase_diagnostic_setup.sql in Supabase."
      });
      return;
    }
    const ip = getClientIp(req);
    if (!applyRateLimit(diagnosticRate, ip, DIAGNOSTIC_MAX_PER_MIN)) {
      res.status(429).json({ error: "Too many requests. Please try again shortly." });
      return;
    }
    const parsed = diagnosticReportPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }
    const {
      name,
      email,
      company,
      stage,
      desc,
      sectionScoresMarkdown,
      rawAnswers
    } = parsed.data;
    const parseSectionScores = (markdown) => {
      return markdown.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
        const match = line.match(/^(.+?)\s*:\s*(\d{1,3})%?$/);
        if (!match) return null;
        const category = match[1]?.trim() || "";
        const score = Number(match[2]);
        if (!category) return null;
        if (!Number.isFinite(score)) return null;
        return { category, score: Math.max(0, Math.min(100, score)) };
      }).filter((x) => Boolean(x));
    };
    const buildNonAiReport = () => {
      const scores = parseSectionScores(sectionScoresMarkdown);
      const sorted = [...scores].sort((a, b) => b.score - a.score);
      const topStrengths = sorted.slice(0, 3);
      const topWeaknesses = [...scores].sort((a, b) => a.score - b.score).slice(0, 3);
      const toPriority = (score) => {
        if (score < 40) return "Critical";
        if (score < 70) return "High";
        return "Medium";
      };
      return {
        summary: `Thanks \u2014 we\u2019ve saved your diagnostic submission for ${company}. Your next step is to focus on the lowest-scoring domains first, then reinforce what\u2019s already working so you can move faster with less risk.`,
        top3_strengths: topStrengths.map((s) => ({
          category: s.category,
          score: s.score,
          note: "Above-average readiness compared to your other domains."
        })),
        top3_weaknesses: topWeaknesses.map((s) => ({
          category: s.category,
          score: s.score,
          priority: toPriority(s.score),
          note: "This is a likely bottleneck\u2014tighten it before scaling execution or diligence."
        })),
        recommendations: [
          "Pick one domain to fix this week and define a concrete deliverable (document, process, or experiment).",
          "Validate your assumptions with 2\u20133 targeted conversations (users, buyers, clinicians, or operators).",
          "Turn the lowest-scoring domain into a short 30\u201360 day plan with owners and milestones."
        ],
        mentor_areas_needed: topWeaknesses.map((w) => w.category)
      };
    };
    const saveToSupabase = async (report) => {
      try {
        const profileRes = await fetch(
          `${supabaseUrl}/rest/v1/company_profiles`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=representation"
            },
            body: JSON.stringify({
              name,
              work_email: email,
              company_name: company,
              stage: stage || null,
              description: desc || null
            })
          }
        );
        if (!profileRes.ok) {
          const errText = await profileRes.text();
          console.error("Supabase company_profiles insert failed", profileRes.status, errText.slice(0, 800));
          return false;
        }
        const [profileRow] = await profileRes.json();
        const companyProfileId = profileRow?.id;
        if (!companyProfileId) {
          console.error("Supabase company_profiles insert returned no id");
          return false;
        }
        const responseRes = await fetch(
          `${supabaseUrl}/rest/v1/diagnostic_responses`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=minimal"
            },
            body: JSON.stringify({
              company_profile_id: companyProfileId,
              section_scores: parseSectionScores(sectionScoresMarkdown),
              raw_answers: rawAnswers ?? null,
              summary: report.summary,
              top3_strengths: report.top3_strengths,
              top3_weaknesses: report.top3_weaknesses,
              recommendations: report.recommendations,
              mentor_areas_needed: report.mentor_areas_needed
            })
          }
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
  const adminSignupStatusRate = /* @__PURE__ */ new Map();
  const ADMIN_SIGNUP_STATUS_MAX_PER_MIN = 30;
  const adminSignupRate = /* @__PURE__ */ new Map();
  const ADMIN_SIGNUP_MAX_PER_MIN = 5;
  app2.get(
    "/api/admin/signup-status",
    rateLimitJson(adminSignupStatusRate, ADMIN_SIGNUP_STATUS_MAX_PER_MIN),
    (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      res.setHeader("content-type", "application/json");
      res.json({ enabled: isAdminSignupEnabled() });
    }
  );
  app2.post(
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
      const parsed = z2.object({
        email: z2.string().trim().email().max(254),
        password: z2.string().min(8).max(72)
      }).safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      try {
        const { createClient: createClient2 } = await import("@supabase/supabase-js");
        const adminClient = createClient2(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { error } = await adminClient.auth.admin.createUser({
          email: parsed.data.email,
          password: parsed.data.password,
          email_confirm: true
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
    }
  );
  app2.use((err, _req, res, _next) => {
    console.error("Express error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  return app2;
}

// scripts/vercel-api-entry.ts
var app;
var getApp = () => {
  if (!app) app = createServer();
  return app;
};
var handler = (req, res) => {
  try {
    getApp()(req, res);
  } catch (err) {
    console.error("Vercel API handler error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
};
var vercel_api_entry_default = handler;
export {
  vercel_api_entry_default as default
};
