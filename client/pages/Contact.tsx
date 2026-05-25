import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Quote, CheckCircle2, Building2, User, Mail, MessageSquare, ArrowRight } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { useContactPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_CONTACT_PAGE } from "@shared/cms/defaults"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"

/**
 * Redesigned Contact Page for Rellia
 * Layout: 2-column split on desktop, stacked on mobile.
 * Aesthetics: Teal + Mint brand colors, soft shadows, rounded corners, modern inputs.
 */


export default function Contact() {
  const { data } = useContactPage()
  const copy = data ?? DEFAULT_CONTACT_PAGE
  useApplyCmsSeo(copy.seo)

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1 flex flex-col">
        <ContactSection copy={copy} />
      </main>
      <Footer />
    </div>
  )
}

function ContactSection({ copy }: { copy: typeof DEFAULT_CONTACT_PAGE }) {
  return (
    <section className="relative w-full pt-[84px] md:pt-[100px] pb-[12px] md:pb-[14px]">
      <div className="grid min-h-[calc(100vh-8rem)] grid-cols-1 lg:grid-cols-2">
        <LeftPanel copy={copy} />

        <div className="relative flex items-center justify-center overflow-hidden bg-white px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 -right-20 w-80 h-80 bg-rellia-mint/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 -right-20 w-80 h-80 bg-rellia-mint/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-xl">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

function LeftPanel({ copy }: { copy: typeof DEFAULT_CONTACT_PAGE }) {
  return (
    <div className="flex flex-col p-4 pb-8 md:p-6 md:pb-10 lg:p-8">
      <h1 className="sr-only">{copy.pageTitle ?? "Contact Rellia Health"}</h1>
      <div className="relative flex min-h-[min(480px,calc(100vh-10rem))] flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-rellia-teal">
        <div className="absolute inset-0">
          <img
            src="/health_tech_collaboration_1778023064936.png"
            alt=""
            aria-hidden
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal via-[#0f5c5c] to-rellia-teal/85" />
          <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-rellia-mint/20 blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[-5%] h-[40%] w-[40%] rounded-full bg-rellia-mint/10 blur-[100px]" />
        </div>

        <div className="relative z-10 flex min-h-[min(480px,calc(100vh-10rem))] flex-1 flex-col p-6 md:p-10">
          <img
            src="/images/hologram-logo.png"
            alt=""
            aria-hidden
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            className="h-14 w-14 opacity-90 drop-shadow-[0_0_15px_rgba(152,255,232,0.3)] md:h-16 md:w-16"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-1 flex-col justify-between py-8"
          >
            <div className="flex flex-1 flex-col justify-center py-6">
              <p className="w-full font-urbanist text-2xl font-medium leading-snug text-white md:text-4xl lg:text-5xl px-2">
                &ldquo;{copy.quoteText}&rdquo;
              </p>

              <div className="mt-8 flex items-center gap-4 md:gap-5">
                <div className="h-[54px] w-[54px] md:h-[67px] md:w-[67px] shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 shadow-xl">
                  <img
                    src="/images/megan-headshot.jpeg"
                    alt={`${copy.quoteAttributionName}, ${copy.quoteAttributionRole}`}
                    width={67}
                    height={67}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-host-grotesk text-[16px] md:text-[19px] font-medium tracking-wide text-rellia-mint">
                    {copy.quoteAttributionName}
                  </p>
                  <p className="font-urbanist text-[14px] md:text-[17px] font-medium text-white/60">{copy.quoteAttributionRole}</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-auto border-t border-white/10 pt-8"
            >
              <p className="font-host-grotesk text-sm font-medium text-white">
                <a href="mailto:hello@relliahealth.com" className="hover:underline underline-offset-4">
                  hello@relliahealth.com
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-rellia-mint/15 blur-[120px]" />
      </div>
    </div>
  )
}

type ContactFormData = {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  message: string
}

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const { submitContactForm } = await import("@/lib/contactSubmit")
      await submitContactForm({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        company: data.company.trim(),
        jobTitle: data.jobTitle.trim(),
        message: data.message.trim(),
      })
      setIsSuccess(true)
      reset()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "We could not send your message. Please try again or email us directly."
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center flex flex-col items-center py-6"
      >
        <CheckCircle2 className="h-14 w-14 text-rellia-teal mb-8" />
        <h2 className="text-3xl font-bold text-rellia-teal mb-4 font-host-grotesk md:text-4xl md:leading-tight">Message Sent!</h2>
        <p className="text-black/60 font-urbanist text-lg max-w-sm mb-10 leading-relaxed">
          Thank you for reaching out. A Rellia team member will get back to you within 24–48 hours.
        </p>
        <RelliaAction 
          type="button" 
          variant="outlineOnWhite" 
          size="comfortable" 
          onClick={() => setIsSuccess(false)}
          className="w-full sm:w-auto px-10"
        >
          Send another message
        </RelliaAction>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      {/* Row 1: Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-rellia-teal font-host-grotesk uppercase tracking-wider ml-1">First Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/25 group-focus-within:text-rellia-teal transition-colors" />
            <input
              {...register("firstName", { required: true })}
              placeholder="Jane"
              className={cn(
                "w-full pl-11 pr-4 py-3.5 bg-black/[0.03] border-2 border-black/[0.03] rounded-[14px] font-urbanist text-black placeholder:text-black/25 outline-none transition-all duration-300",
                "focus:bg-white focus:border-rellia-teal/20 focus:ring-4 focus:ring-rellia-teal/5",
                errors.firstName && "border-red-100 bg-red-50/20 focus:border-red-200 focus:ring-red-500/5"
              )}
            />
          </div>
        </div>
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-rellia-teal font-host-grotesk uppercase tracking-wider ml-1">Last Name</label>
          <input
            {...register("lastName", { required: true })}
            placeholder="Doe"
            className={cn(
              "w-full px-5 py-3.5 bg-black/[0.03] border-2 border-black/[0.03] rounded-[14px] font-urbanist text-black placeholder:text-black/25 outline-none transition-all duration-300",
              "focus:bg-white focus:border-rellia-teal/20 focus:ring-4 focus:ring-rellia-teal/5",
              errors.lastName && "border-red-100 bg-red-50/20 focus:border-red-200 focus:ring-red-500/5"
            )}
          />
        </div>
      </div>

      {/* Row 2: Email */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-rellia-teal font-host-grotesk uppercase tracking-wider ml-1">Work Email</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/25 group-focus-within:text-rellia-teal transition-colors" />
          <input
            {...register("email", { 
              required: "Email is required", 
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } 
            })}
            type="email"
            placeholder="jane@company.com"
            className={cn(
              "w-full pl-11 pr-4 py-3.5 bg-black/[0.03] border-2 border-black/[0.03] rounded-[14px] font-urbanist text-black placeholder:text-black/25 outline-none transition-all duration-300",
              "focus:bg-white focus:border-rellia-teal/20 focus:ring-4 focus:ring-rellia-teal/5",
              errors.email && "border-red-100 bg-red-50/20 focus:border-red-200 focus:ring-red-500/5"
            )}
          />
        </div>
        {errors.email && <p className="text-xs font-semibold text-red-500 ml-1">{errors.email.message}</p>}
      </div>

      {/* Row 3: Company & Job Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-rellia-teal font-host-grotesk uppercase tracking-wider ml-1">Company</label>
          <div className="relative group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/25 group-focus-within:text-rellia-teal transition-colors" />
            <input
              {...register("company")}
              placeholder="HealthTech Inc."
              className={cn(
                "w-full pl-11 pr-4 py-3.5 bg-black/[0.03] border-2 border-black/[0.03] rounded-[14px] font-urbanist text-black placeholder:text-black/25 outline-none transition-all duration-300",
                "focus:bg-white focus:border-rellia-teal/20 focus:ring-4 focus:ring-rellia-teal/5"
              )}
            />
          </div>
        </div>
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-rellia-teal font-host-grotesk uppercase tracking-wider ml-1">Job Title</label>
          <input
            {...register("jobTitle")}
            placeholder="Co-founder / Clinical Director"
            className={cn(
              "w-full px-5 py-3.5 bg-black/[0.03] border-2 border-black/[0.03] rounded-[14px] font-urbanist text-black placeholder:text-black/25 outline-none transition-all duration-300",
              "focus:bg-white focus:border-rellia-teal/20 focus:ring-4 focus:ring-rellia-teal/5"
            )}
          />
        </div>
      </div>

      {/* Row 4: Message */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-rellia-teal font-host-grotesk uppercase tracking-wider ml-1">How can we help?</label>
        <div className="relative group">
          <MessageSquare className="absolute left-4 top-5 h-4 w-4 text-black/25 group-focus-within:text-rellia-teal transition-colors" />
          <textarea
            {...register("message", { required: "Please enter your message" })}
            rows={5}
            placeholder="Tell us about your project or inquiry..."
            className={cn(
              "w-full pl-11 pr-4 py-4 bg-black/[0.03] border-2 border-black/[0.03] rounded-[14px] font-urbanist text-black placeholder:text-black/25 outline-none transition-all duration-300 resize-none",
              "focus:bg-white focus:border-rellia-teal/20 focus:ring-4 focus:ring-rellia-teal/5",
              errors.message && "border-red-100 bg-red-50/20 focus:border-red-200 focus:ring-red-500/5"
            )}
          />
        </div>
        {errors.message && <p className="text-xs font-semibold text-red-500 ml-1">{errors.message.message}</p>}
      </div>

      {/* Action Button */}
      <div className="pt-1">
        {submitError ? (
          <p
            role="alert"
            className="mb-4 rounded-[14px] border border-red-200 bg-red-50/80 px-4 py-3 font-urbanist text-sm font-medium text-red-800"
          >
            {submitError}
          </p>
        ) : null}
        <RelliaAction
          type="submit"
          variant="mintTealFill"
          size="comfortable"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 border-2 border-rellia-teal/30 border-t-rellia-teal rounded-full animate-spin" />
          ) : (
            <>
              Send Message
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </RelliaAction>
      </div>
    </form>
  )
}
