import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { isFilloutFormUrl } from "@/lib/filloutApplyForm"
import { getProgramPageFallback } from "@shared/cms/programs/programFallbackContent"
import { getProgramRouteConfig } from "@shared/cms/programs/programRouteConfig"
import type { QmsProgramContent } from "@shared/cms/types"

type ProgramDetailPageProps = {
  cmsSlug: string
  /** Optional env-based payment URL override (QMS only). */
  envPaymentUrl?: string
}

const ProgramDetailPage = ({ cmsSlug, envPaymentUrl }: ProgramDetailPageProps) => {
  const config = getProgramRouteConfig(cmsSlug)
  if (!config) return null

  const slugFallback = getProgramPageFallback(cmsSlug)
  const envFallback: Partial<QmsProgramContent> | undefined =
    envPaymentUrl && isFilloutFormUrl(envPaymentUrl) ? { paymentUrl: envPaymentUrl } : undefined

  return (
    <ProgramPageLayout
      cmsSlug={cmsSlug}
      cms={{ ...slugFallback, ...envFallback }}
      outcomesSectionId={config.outcomesSectionId}
      staticBlocks={config.staticBlocks}
    />
  )
}

export default ProgramDetailPage
