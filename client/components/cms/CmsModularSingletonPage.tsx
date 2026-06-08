import type { ReactNode } from "react"

type CmsModularSingletonPageProps = {
  fallback: ReactNode
}

/** Pre-built marketing pages always use their fixed React layout; modular sections are for custom `page` docs only. */
export const CmsModularSingletonPage = ({ fallback }: CmsModularSingletonPageProps) => <>{fallback}</>
