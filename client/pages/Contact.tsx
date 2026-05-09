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
import { clearApiCsrfCache, getApiCsrfHeaders } from "@/lib/apiCsrf"

/**
 * Redesigned Contact Page for Rellia
 * Layout: 2-column split on desktop, stacked on mobile.
 * Aesthetics: Teal + Mint brand colors, soft shadows, rounded corners, modern inputs.
 */

const SI_V = "9.0.0"
const si = (slug: string) => `https://unpkg.com/simple-icons@${SI_V}/icons/${slug}.svg`

const TRUSTED_LOGOS = [
  { name: "Google", src: si("google") },
  { name: "Microsoft", src: si("microsoft") },
  { name: "Amazon", src: si("amazon") },
  { name: "Apple", src: si("apple") },
  { name: "Meta", src: si("meta") },
  { name: "IBM", src: si("ibm") },
  { name: "Oracle", src: si("oracle") },
  { name: "Salesforce", src: si("salesforce") },
]


export default function Contact() {
  const { data } = useContactPage()
  const copy = data ?? DEFAULT_CONTACT_PAGE
  useApplyCmsSeo(copy.seo)

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />
      <main id="main-content">
        <ContactSection copy={copy} />
      </main>
      <Footer />
    </div>
  )
}

function ContactSection({ copy }: { copy: typeof DEFAULT_CONTACT_PAGE }) {
  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] xl:grid-cols-[40%_60%] min-h-screen">
        {/* Left Side: Content & Branding */}
        <LeftPanel copy={copy} />

        {/* Right Side: Contact Form (No card, no heading) */}
        <div className="bg-white px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 flex items-center justify-center relative overflow-hidden">
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
    <div className="relative bg-rellia-teal min-h-[700px] lg:min-h-full flex flex-col px-6 pt-32 pb-20 md:pt-40 md:pb-24 lg:pt-32 lg:px-20 overflow-hidden">
      {/* Background Image with optimized overlay */}
      <div className="absolute inset-0">
        <img
          src="/health_tech_collaboration_1778023064936.png"
          alt="Modern health tech collaboration"
          className="h-full w-full object-cover opacity-35 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal via-rellia-teal/95 to-rellia-teal/80" />
        
        {/* Mint Gradient Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-rellia-mint/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-rellia-mint/10 rounded-full blur-[100px]" />

        {/* Enhanced Noise Texture */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-xl flex-1 flex flex-col justify-center">
        {/* Testimonial / Quote */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          {/* Hologram Logo at top of quote */}
          <div className="mb-8">
            <img 
              src="/images/hologram-logo.png" 
              alt="Rellia Hologram" 
              className="h-16 w-16 opacity-90 drop-shadow-[0_0_15px_rgba(152,255,232,0.3)]"
            />
          </div>
          
          <p className="font-urbanist text-2xl md:text-3xl lg:text-4xl leading-snug text-white font-medium">
            "{copy.quoteText}"
          </p>
          
          <div className="mt-8 flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 shadow-xl">
              <img
                src="/images/team-megankane.jpg"
                alt={copy.quoteAttributionName}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-host-grotesk text-base font-bold text-white tracking-wide">
                {copy.quoteAttributionName}
              </p>
              <p className="font-urbanist text-rellia-mint/90 font-medium text-sm">
                {copy.quoteAttributionRole}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Trust Signals - Moved higher up */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="pt-10 border-t border-white/10"
        >
          <p className="font-host-grotesk text-xs font-bold uppercase tracking-widest text-white/60 mb-6">
            Trusted by founders, clinicians, and investors
          </p>
          
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              className="flex w-max min-w-max gap-4 sm:gap-6 will-change-transform"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map((logo, i) => (
                <div key={i} className="h-10 w-24 sm:h-12 sm:w-32 shrink-0 flex items-center justify-center">
                  <img src={logo.src} alt={logo.name} className="h-full w-auto object-contain brightness-0 invert opacity-80" />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Abstract mint glow at the bottom */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rellia-mint/15 rounded-full blur-[120px] pointer-events-none" />
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
      const postOnce = async () => {
        const csrf = await getApiCsrfHeaders()
        return fetch("/api/contact-hubspot", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json", ...csrf },
          body: JSON.stringify({
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            email: data.email.trim(),
            company: data.company.trim(),
            jobTitle: data.jobTitle.trim(),
            message: data.message.trim(),
          }),
        })
      }
      let res = await postOnce()
      let json = (await res.json().catch(() => ({}))) as {
        error?: string
        hint?: string
        code?: string
      }
      if (
        !res.ok &&
        res.status === 403 &&
        json.code === "CSRF"
      ) {
        clearApiCsrfCache()
        res = await postOnce()
        json = (await res.json().catch(() => ({}))) as {
          error?: string
          hint?: string
          code?: string
        }
      }
      if (!res.ok) {
        setSubmitError(
          json.error ||
            "Something went wrong. Please try again or email us directly.",
        )
        return
      }
      setIsSuccess(true)
      reset()
    } catch {
      setSubmitError(
        "We could not reach the server. Check your connection and try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-rellia-cream/20 rounded-[24px] p-10 md:p-14 border border-black/5 text-center flex flex-col items-center"
      >
        <div className="h-20 w-20 rounded-full bg-rellia-mint/10 flex items-center justify-center mb-8">
          <CheckCircle2 className="h-10 w-10 text-rellia-teal" />
        </div>
        <h2 className="text-3xl font-bold text-rellia-teal mb-4 font-host-grotesk">Message Sent!</h2>
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
      <div className="pt-4">
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
        
        <p className="text-center text-xs font-urbanist text-black/40 mt-5 font-medium">
          We’ll get back to you within <span className="text-rellia-teal/60 font-bold">24–48 hours</span>
        </p>
      </div>
    </form>
  )
}
