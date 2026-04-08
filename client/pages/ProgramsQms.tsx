/**
 * QMS program detail — first instance of the modular **program page** pattern.
 * Hub: `/programs` (cards from `programsLandingPage`). Each future program gets its own route,
 * Sanity document, `paymentUrl`, and static blocks; reuse `ProgramPageLayout`.
 */
import { useQmsProgramPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_QMS_PROGRAM } from "@shared/cms/defaults"
import { QMS_PROGRAM_STATIC_BLOCKS } from "@shared/cms/programs/qms.static"
import ProgramPageLayout from "@/components/program/ProgramPageLayout"

const QMS_OUTCOMES_SECTION_ID = "qms-program-outcomes"

export default function ProgramsQms() {
  const { data } = useQmsProgramPage()
  const base = data ?? DEFAULT_QMS_PROGRAM
  const paymentUrlFromEnv = (import.meta.env.VITE_QMS_PAYMENT_LINK as string | undefined)?.trim()
  const q = paymentUrlFromEnv ? { ...base, paymentUrl: paymentUrlFromEnv } : base

  return (
    <ProgramPageLayout
      cms={q}
      heroImageSrc="/images/banner-whitelogo.png"
      heroImageAlt="Build Your QMS program"
      outcomesSectionId={QMS_OUTCOMES_SECTION_ID}
      staticBlocks={QMS_PROGRAM_STATIC_BLOCKS}
    />
  )
}
