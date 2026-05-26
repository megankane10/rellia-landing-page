import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Palette,
  Code2,
  Activity,
  ShieldCheck,
  Scale,
  FileText,
  DollarSign,
  TrendingUp,
  Megaphone,
  Compass,
  Building2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { Reveal } from "@/pages/network/_shared"

const howItWorksSteps = [
  {
    icon: Palette,
    title: 'Product Design & UI/UX',
    description: 'Establish design credibility with intuitive healthcare interfaces and smooth user workflows.'
  },
  {
    icon: Code2,
    title: 'Product Development',
    description: 'Build secure, scalable products integrating healthcare standards and engineering best practices.'
  },
  {
    icon: Activity,
    title: 'Clinical Evidence',
    description: 'Design clinical validation protocols, gather evidence, and build study credibility.'
  },
  {
    icon: ShieldCheck,
    title: 'Regulatory Strategy',
    description: 'Set up ISO 13485 QMS and prepare compliant filings for FDA and Health Canada.'
  },
  {
    icon: Scale,
    title: 'Legal & Privacy',
    description: 'Ensure absolute compliance with HIPAA, PIPEDA, and robust system security.'
  },
  {
    icon: FileText,
    title: 'IP Strategy',
    description: 'Protect your unique IP, patent designs, and establish freedom to operate.'
  },
  {
    icon: DollarSign,
    title: 'Reimbursement',
    description: 'Formulate insurance coverage pathways and navigate public/private billing codes.'
  },
  {
    icon: TrendingUp,
    title: 'Fundraising',
    description: 'Craft high-signal pitch decks, financial models, and diligence-proof datarooms.'
  },
  {
    icon: Megaphone,
    title: 'Marketing & Branding',
    description: 'Build healthcare brand awareness, trust, and clear scientific positioning.'
  },
  {
    icon: Compass,
    title: 'Go-To-Market',
    description: 'Define your buyer, pricing structures, pilot pipelines, and enterprise deals.'
  },
  {
    icon: Building2,
    title: 'Health System Navigation',
    description: 'Overcome procurement delays, build clinical champion networks, and close sales.'
  },
  {
    icon: Briefcase,
    title: 'Operations & Scaling',
    description: 'Formulate operational rhythms, scalable hiring patterns, and strong governance.'
  }
];

export function DiagnosticSurveySection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % howItWorksSteps.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [currentIndex])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + howItWorksSteps.length) % howItWorksSteps.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % howItWorksSteps.length)
  }

  const currentItem = howItWorksSteps[currentIndex]
  const CurrentIcon = currentItem.icon

  return (
    <section className="w-full bg-rellia-cream/20 px-6 py-28 md:px-10 md:py-40 border-t border-black/10 flex items-center">
      <div className="mx-auto w-full max-w-[1300px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="flex flex-col items-start lg:sticky lg:top-32">
            <Reveal>
              <h2 className="font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-black md:text-[32px] mt-4 mb-6">
                Startup Diagnostic Survey
              </h2>
              <p className="font-urbanist text-lg md:text-xl leading-relaxed text-black/70 mb-10 max-w-xl">
                A structured, deep-dive assessment of your company to identify the top areas for improvement. Founders receive a personalized gap analysis report and are matched with the most qualified advisors to help address those critical gaps directly.
              </p>
              <RelliaAction asChild variant="mintTealFill" size="comfortable" className="w-full sm:w-auto justify-center">
                <Link to="/startup-diagnostic" className="inline-flex cursor-pointer items-center gap-2">
                  Take Diagnostic Survey
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </Link>
              </RelliaAction>
            </Reveal>
          </div>
          
          <div className="pt-2 lg:pt-4 w-full">
            <Reveal delay={0.1} className="w-full">
              <h3 className="font-host-grotesk text-xs font-bold uppercase tracking-[0.2em] text-rellia-teal mb-5">
                Categories we assess
              </h3>
              
              <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-transparent p-7 shadow-none min-h-[250px] flex flex-col justify-between">
                <div className="relative overflow-hidden flex-1 flex flex-col justify-center min-h-[140px] w-full">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="flex flex-col items-start gap-4 w-full"
                    >
                      <CurrentIcon className="h-8 w-8 text-rellia-teal shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-host-grotesk text-lg md:text-xl font-bold text-black">{currentItem.title}</h4>
                        <p className="mt-2 font-urbanist text-base leading-relaxed text-black/70">
                          {currentItem.description}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-3.5">
                  <span className="font-host-grotesk text-xs font-bold text-black/45 tracking-wider">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(howItWorksSteps.length).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrev}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 transition-colors hover:bg-black/5 hover:text-black active:scale-95"
                      aria-label="Previous domain"
                    >
                      <ChevronLeft className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 transition-colors hover:bg-black/5 hover:text-black active:scale-95"
                      aria-label="Next domain"
                    >
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
                <motion.div
                  key={currentIndex}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4.5, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1 bg-rellia-teal"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
