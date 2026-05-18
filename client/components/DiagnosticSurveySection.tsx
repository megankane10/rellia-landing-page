import { Link } from "react-router-dom"
import {
  ArrowRight,
  Target,
  CheckCircle2,
  MessagesSquare,
  Rocket,
  GraduationCap,
  Lightbulb,
  Hammer,
  ShieldCheck,
  Stethoscope,
  BookOpen,
  Percent,
  Users
} from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { Reveal } from "@/pages/network/_shared"

export function DiagnosticSurveySection() {
  const categories = [
    { name: "Product design & UI/UX", icon: Lightbulb },
    { name: "Technology and architecture", icon: Hammer },
    { name: "Regulatory compliance", icon: ShieldCheck },
    { name: "Clinical evidence", icon: Stethoscope },
    { name: "Legal, privacy, cybersecurity", icon: BookOpen },
    { name: "IP strategy", icon: Target },
    { name: "Reimbursement strategy", icon: Percent },
    { name: "Fundraising and investment readiness", icon: Rocket },
    { name: "Marketing and branding", icon: Users },
    { name: "Go-to-market strategy", icon: Target },
    { name: "Navigating health system procurement and adoption", icon: CheckCircle2 },
    { name: "Customer success", icon: MessagesSquare },
    { name: "Operations and scaling", icon: Rocket },
    { name: "Leadership mindset and resilience", icon: GraduationCap }
  ];

  return (
    <section className="w-full bg-rellia-cream/20 px-6 py-28 md:px-10 md:py-40 border-t border-black/10 flex items-center">
      <div className="mx-auto w-full max-w-[1300px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="flex flex-col items-start lg:sticky lg:top-32">
            <Reveal>
              <h2 className="font-host-grotesk text-3xl font-bold leading-tight tracking-tight text-black md:text-[44px] mt-4 mb-6">
                Startup Diagnostic Survey
              </h2>
              <p className="font-urbanist text-lg md:text-xl leading-relaxed text-black/70 mb-10 max-w-xl">
                A structured, deep-dive assessment of your company to identify the top areas for improvement. Founders receive a personalized gap analysis report and are matched with the most qualified advisors to help address those critical gaps directly.
              </p>
              <RelliaAction asChild variant="mintTealFill" size="comfortable" className="w-full sm:w-auto justify-center">
                <Link to="/diagnostics" className="inline-flex cursor-pointer items-center gap-2">
                  Take Diagnostic Survey
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </Link>
              </RelliaAction>
            </Reveal>
          </div>
          
          <div className="pt-2 lg:pt-4">
            <Reveal delay={0.1}>
              <h3 className="font-host-grotesk text-2xl font-bold text-black mb-8 border-b border-black/10 pb-4">Categories we assess</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <Icon className="w-6 h-6 text-rellia-teal shrink-0 mt-0.5" strokeWidth={1.5} />
                      <span className="font-host-grotesk font-normal text-black/80 text-lg leading-snug">{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
