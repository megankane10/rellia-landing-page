/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string
  /** Sanity read client (public). Optional; see `.env.example` */
  readonly VITE_SANITY_PROJECT_ID?: string
  readonly VITE_SANITY_DATASET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
