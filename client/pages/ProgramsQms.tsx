/**
 * QMS program detail — first instance of the modular **program page** pattern.
 * Hub: `/programs` (cards from `programsLandingPage`). Each future program gets its own route,
 * Program pages share one default layout. Content can be overridden via the
 * `programPage` Sanity doc for slug `build-your-qms`.
 */
import { DEFAULT_QMS_PROGRAM } from "@shared/cms/defaults"
import { QMS_PROGRAM_STATIC_BLOCKS } from "@shared/cms/programs/qms.static"
import ProgramPageLayout from "@/components/program/ProgramPageLayout"

const QMS_OUTCOMES_SECTION_ID = "qms-program-outcomes"

export default function ProgramsQms() {
  const paymentUrlFromEnv = (import.meta.env.VITE_QMS_PAYMENT_LINK as string | undefined)?.trim()
  const q = paymentUrlFromEnv
    ? { ...DEFAULT_QMS_PROGRAM, paymentUrl: paymentUrlFromEnv }
    : DEFAULT_QMS_PROGRAM

  return (
    <ProgramPageLayout
      cms={q}
      cmsSlug="build-your-qms"
      heroImageSrc="/images/programs-qms.png"
      heroImageAlt="Quality Management System program"
      outcomesSectionId={QMS_OUTCOMES_SECTION_ID}
      staticBlocks={QMS_PROGRAM_STATIC_BLOCKS}
      heroSquareImageSrc="/images/QMS-programs.webp"
    />
  )
}
