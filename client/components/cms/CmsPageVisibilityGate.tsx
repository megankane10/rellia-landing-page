import type { ReactNode } from "react"
import NotFound from "@/pages/NotFound"
import PagePlaceholder from "@/components/cms/PagePlaceholder"
import type { CmsPageVisibility } from "@shared/cms/types"

type CmsPageVisibilityGateProps = {
  page?: CmsPageVisibility | null
  children: ReactNode
}

/** Respects CMS pageVisibility before rendering marketing or modular page content. */
export default function CmsPageVisibilityGate({ page, children }: CmsPageVisibilityGateProps) {
  const status = page?.pageVisibility ?? "live"

  if (status === "hidden") return <NotFound />
  if (status === "placeholder") {
    return (
      <PagePlaceholder
        title={page?.placeholderTitle}
        message={page?.placeholderMessage}
        ctaLabel={page?.placeholderCtaLabel}
        ctaHref={page?.placeholderCtaHref}
      />
    )
  }

  return <>{children}</>
}
