import ProgramDetailPage from "@/components/program/ProgramDetailPage"
import { isFilloutFormUrl } from "@/lib/filloutApplyForm"

export default function ProgramsQms() {
  const filloutFromEnv = (
    (import.meta.env.VITE_QMS_FILLOUT_FORM_URL as string | undefined) ||
    (import.meta.env.VITE_QMS_PAYMENT_LINK as string | undefined)
  )?.trim()

  const envPaymentUrl =
    filloutFromEnv && isFilloutFormUrl(filloutFromEnv) ? filloutFromEnv : undefined

  return (
    <ProgramDetailPage
      cmsSlug="build-your-quality-management-system"
      envPaymentUrl={envPaymentUrl}
    />
  )
}
