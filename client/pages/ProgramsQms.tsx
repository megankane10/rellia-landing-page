/**
 * QMS program detail — first instance of the modular **program page** pattern.
 * Hub: `/programs` (cards from `programsLandingPage`). Each future program gets its own route,
 * Program pages share one default layout. Content can be overridden via the
 * `programPage` Sanity doc for slug `build-your-qms`.
 */
import { QMS_PROGRAM_STATIC_BLOCKS } from "@shared/cms/programs/qms.static"
import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { isFilloutFormUrl } from "@/lib/filloutApplyForm"

const QMS_OUTCOMES_SECTION_ID = "qms-program-outcomes"

export default function ProgramsQms() {
  const filloutFromEnv = (
    (import.meta.env.VITE_QMS_FILLOUT_FORM_URL as string | undefined) ||
    (import.meta.env.VITE_QMS_PAYMENT_LINK as string | undefined)
  )?.trim()

  const cmsFallback =
    filloutFromEnv && isFilloutFormUrl(filloutFromEnv)
      ? { paymentUrl: filloutFromEnv }
      : undefined

  return (
    <ProgramPageLayout
      cms={cmsFallback}
      cmsSlug="build-your-quality-management-system"
      heroImageSrc="/images/programs-buildYourQMS.png"
      heroImageAlt="Quality Management System program"
      outcomesSectionId={QMS_OUTCOMES_SECTION_ID}
      staticBlocks={QMS_PROGRAM_STATIC_BLOCKS}
    />
  )
}
