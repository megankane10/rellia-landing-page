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
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  /** QMS enrollment Fillout URL only (not Stripe) — optional override */
  readonly VITE_QMS_FILLOUT_FORM_URL?: string
  /** @deprecated Use VITE_QMS_FILLOUT_FORM_URL; ignored unless URL is a Fillout form */
  readonly VITE_QMS_PAYMENT_LINK?: string
  /** Sanity read client (public). Optional; see `.env.example` */
  readonly VITE_SANITY_PROJECT_ID?: string
  readonly VITE_SANITY_DATASET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    hbspt?: {
      forms?: {
        create?: (options: {
          region: string
          portalId: string
          formId: string
          target: string
        }) => void
      }
    }
  }
}

export {}
