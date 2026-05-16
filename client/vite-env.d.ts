/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical origin for SEO (optional; defaults to production URL) */
  readonly VITE_SITE_URL?: string
  /** Stripe publishable key for embedded checkout on /membership */
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string
  /** Stripe Payment Link URLs for /payment fallback (optional; see `.env.example`) */
  readonly VITE_STRIPE_MONTHLY_PLAN_LINK?: string
  readonly VITE_STRIPE_ANNUAL_PLAN_LINK?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  /** Optional override for QMS program CTAs (takes precedence over Sanity paymentUrl) */
  readonly VITE_QMS_PAYMENT_LINK?: string
  /** Sanity read client (public). Optional; see `.env.example` */
  readonly VITE_SANITY_PROJECT_ID?: string
  readonly VITE_SANITY_DATASET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
