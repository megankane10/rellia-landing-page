import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircle2 } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { submitInvestorNotifyForm } from "@/lib/investorNotifySubmit"

const BOOK_CALL_URL =
  "https://meetings-na3.hubspot.com/megan-kane/intro-call?uuid=d044d7a7-3761-4996-b6c9-2c4c4b7d4423"

type InvestorNotifyFormData = {
  name: string
  email: string
  investmentCriteria: string
}

type InvestorNotifyFormProps = {
  className?: string
  onSuccess?: () => void
}

const InvestorNotifyForm = ({ className, onSuccess }: InvestorNotifyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvestorNotifyFormData>()

  const onSubmit = async (data: InvestorNotifyFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await submitInvestorNotifyForm({
        name: data.name.trim(),
        email: data.email.trim(),
        investmentCriteria: data.investmentCriteria.trim(),
      })
      setIsSuccess(true)
      reset()
      onSuccess?.()
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "We could not submit your request. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={cn("text-center", className)}>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rellia-mint/20">
          <CheckCircle2 className="h-8 w-8 text-rellia-teal" aria-hidden />
        </div>
        <h3 className="font-host-grotesk text-xl font-semibold text-rellia-teal">You&apos;re on the list</h3>
        <p className="mt-3 font-urbanist text-base leading-relaxed text-black/65">
          We&apos;ll notify you about upcoming pitch events and curated founder intros.
        </p>
        <RelliaAction
          type="button"
          variant="outlineOnWhite"
          size="comfortable"
          className="mt-8"
          onClick={() => setIsSuccess(false)}
        >
          Submit another response
        </RelliaAction>
      </div>
    )
  }

  return (
    <div className={className}>
      <header className="mb-8 text-left">
        <h2 className="font-host-grotesk text-2xl font-semibold tracking-tight text-rellia-teal md:text-[1.65rem]">
          Get Notified About Pitch Events
        </h2>
        <p className="mt-3 font-urbanist text-base leading-relaxed text-black/65">
          Join us to see the strongest new founders in digital health before anyone else.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="investor-notify-name" className="font-host-grotesk text-xs font-bold uppercase tracking-wider text-rellia-teal">
            Name
          </label>
          <input
            id="investor-notify-name"
            {...register("name", { required: "Name is required" })}
            autoComplete="name"
            className={cn(
              "w-full rounded-[14px] border-2 border-black/[0.06] bg-black/[0.03] px-4 py-3.5 font-urbanist text-black outline-none transition-all",
              "focus:border-rellia-teal/20 focus:bg-white focus:ring-4 focus:ring-rellia-teal/5",
              errors.name && "border-red-200 bg-red-50/30",
            )}
          />
          {errors.name ? (
            <p className="font-urbanist text-xs font-medium text-red-600">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="investor-notify-email" className="font-host-grotesk text-xs font-bold uppercase tracking-wider text-rellia-teal">
            Email
          </label>
          <input
            id="investor-notify-email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
            })}
            autoComplete="email"
            className={cn(
              "w-full rounded-[14px] border-2 border-black/[0.06] bg-black/[0.03] px-4 py-3.5 font-urbanist text-black outline-none transition-all",
              "focus:border-rellia-teal/20 focus:bg-white focus:ring-4 focus:ring-rellia-teal/5",
              errors.email && "border-red-200 bg-red-50/30",
            )}
          />
          {errors.email ? (
            <p className="font-urbanist text-xs font-medium text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="investor-notify-criteria"
            className="font-host-grotesk text-xs font-bold uppercase tracking-wider text-rellia-teal"
          >
            Tell us about what you look for in the companies you invest in
          </label>
          <textarea
            id="investor-notify-criteria"
            rows={4}
            {...register("investmentCriteria", { required: "Please share your investment focus" })}
            className={cn(
              "w-full resize-none rounded-[14px] border-2 border-black/[0.06] bg-black/[0.03] px-4 py-3.5 font-urbanist text-black outline-none transition-all",
              "focus:border-rellia-teal/20 focus:bg-white focus:ring-4 focus:ring-rellia-teal/5",
              errors.investmentCriteria && "border-red-200 bg-red-50/30",
            )}
          />
          {errors.investmentCriteria ? (
            <p className="font-urbanist text-xs font-medium text-red-600">{errors.investmentCriteria.message}</p>
          ) : null}
        </div>

        <p className="font-urbanist text-sm leading-relaxed text-black/55">
          Want to connect directly to chat about our pitch events or other investment opportunities?{" "}
          <a
            href={BOOK_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-rellia-teal underline underline-offset-4 hover:text-rellia-teal/80"
          >
            Book a call here
          </a>
          .
        </p>

        {submitError ? (
          <p role="alert" className="rounded-[14px] border border-red-200 bg-red-50/80 px-4 py-3 font-urbanist text-sm text-red-800">
            {submitError}
          </p>
        ) : null}

        <RelliaAction type="submit" variant="mintTealFill" size="comfortable" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting…" : "Get notified"}
        </RelliaAction>
      </form>
    </div>
  )
}

export default InvestorNotifyForm
