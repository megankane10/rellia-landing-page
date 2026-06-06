import { ShieldCheck, ShieldCheck as ShieldIcon, Zap, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RouteSeo from '@/components/RouteSeo';
import { CmsModularSingletonPage } from '@/components/cms/CmsModularSingletonPage';
import { useDiagnosticLandingPage } from '@/hooks/useCmsDocuments';
import { useApplyCmsSeo } from '@/hooks/useApplyCmsSeo';
import { RoleHero } from "./network/_shared";
import PillTag, { PILL_ON_IMAGE_BLUR_CLASS } from "@/components/PillTag";
import type { HomeWhyFeature } from "@shared/cms/types";
import WhyRellia from '@/components/WhyRellia';
import MembershipPathTimeline from '@/components/MembershipPathTimeline';
import RelliaCta from '@/components/RelliaCta';

const whyFeatures: HomeWhyFeature[] = [
  {
    iconKey: "",
    title: "12 Scored Domains",
    description: "Every critical health tech domain is assessed, from clinical evidence to quality management and unit economics.",
    imageSrc: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200" // domains (business metrics/graphs)
  },
  {
    iconKey: "",
    title: "AI-Powered Analysis",
    description: "Identify your top 3 strengths and priority gaps instantly. Detailed reports and gap analyses are exclusive to Rellia members.",
    imageSrc: "https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=1200" // AI analysis (team collaborating on dashboard data)
  },
  {
    iconKey: "",
    title: "Advisor Matching",
    description: "Members are automatically matched and introduced to pre-vetted advisors based on their startup's gap profile.",
    imageSrc: "https://images.pexels.com/photos/3182761/pexels-photo-3182761.jpeg?auto=compress&cs=tinysrgb&w=1200" // advisor matching (mentorship consultation)
  },
  {
    iconKey: "",
    title: "Founding Membership",
    description: "Get early access to exclusive networking sessions, peer mentorship, and dedicated resources from day one.",
    imageSrc: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1200" // founding membership (partnership/handshake)
  }
];

const timelineSteps = [
  { title: 'Startup Context', description: 'Provide high-level details about your product mission, stage, and targets.' },
  { title: 'Deep Assessment', description: 'Evaluate your status across 12 sections with zero-BS honest reflections.' },
  { title: 'Score Generation', description: 'Our AI processes scores to evaluate strengths, priority gaps, and blockers.' },
  { title: 'Report Access', description: 'Rellia members immediately unlock their custom diagnostic report and advisor matching.' }
];

const HERO_TRUST_BADGES = [
  { label: "100% Private", icon: ShieldCheck },
  { label: "~15 Minutes", icon: Zap },
  { label: "Advisor Matching", icon: Users },
] as const

const DiagnosticHeroBadges = () => (
  <div className="flex flex-wrap items-center gap-3">
    <PillTag
      label="LAUNCH READINESS"
      className={PILL_ON_IMAGE_BLUR_CLASS}
    />
  </div>
)

export default function DiagnosticLanding() {
  const { data: cmsPage } = useDiagnosticLandingPage()
  useApplyCmsSeo(cmsPage?.seo, {
    title: "Startup Diagnostic — Rellia Health",
    description:
      "Benchmark your health tech startup across 12 critical domains. Get an instant readiness score, personalized gap analysis, and advisory board matching.",
  })

  return (
    <CmsModularSingletonPage
      page={cmsPage}
      slug="startup-diagnostic"
      fallback={
    <div className="min-h-screen bg-white font-host-grotesk text-black selection:bg-rellia-mint/30 overflow-x-hidden">
      <Navbar />
      <RouteSeo 
        title="Startup Diagnostic — Rellia Health" 
        description="Benchmark your health tech startup across 12 critical domains. Get an instant readiness score, personalized gap analysis, and advisory board matching."
      />

      <div className="lg:flex lg:h-[82vh] lg:flex-col">
        <RoleHero
          heroBadges={<DiagnosticHeroBadges />}
          imageSrc="https://images.pexels.com/photos/3825368/pexels-photo-3825368.jpeg?auto=compress&cs=tinysrgb&w=1600"
          className="lg:flex-1"
          title={
            <>
              Pressure-test your startup for <span className="text-rellia-mint">healthcare reality.</span>
            </>
          }
          subtitle="Get an instant readiness score, surface hidden blockers across 12 domains, and unlock advisor matching when you join Rellia."
          primaryCta={{
            label: "Begin Free Assessment",
            to: "/diagnostic-survey"
          }}
        />
      </div>

      {/* READINESS MAP SECTION using WhyRellia */}
      <WhyRellia 
        sectionTitle="A complete readiness map"
        sectionDescription="Most founders have a few strong domains and several hidden gaps. This diagnostic exposes the full picture so you can build with confidence."
        features={whyFeatures}
      />

      {/* NO STONE LEFT UNTURNED SECTION (removed bottom tag cloud of topics) */}
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto w-full max-w-[1400px] overflow-hidden rounded-[2rem] border border-black/5 bg-[#fbfcf8] px-6 py-14 md:rounded-[2.5rem] md:px-10 md:py-20 lg:px-14">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 lg:flex-row lg:items-start">
            <div className="flex-1">
              <h2 className="mb-6 font-host-grotesk text-2xl font-semibold text-black md:text-[32px] leading-tight">No stone left unturned</h2>
              <p className="font-urbanist text-lg text-black/60 leading-relaxed max-w-xl">
                We've distilled years of digital health experience into a comprehensive assessment framework that covers the entire startup lifecycle. Rellia's custom platform maps every critical domain, ensuring regulatory alignment, clinical proof, and bulletproof operational scaling.
              </p>


            </div>
            <div className="flex-1 lg:pl-12">
              <div className="relative">
                <div className="absolute -inset-4 rounded-[40px] bg-rellia-teal/5 blur-2xl pointer-events-none" />
                <div className="relative rounded-[40px] border border-black/10 bg-white p-8 md:p-10 shadow-lg">
                  <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-black/45">Sample Report Preview</h4>
                    <div className="flex items-center gap-1.5 rounded-full bg-rellia-teal/5 px-2.5 py-1 text-[10px] font-bold text-rellia-teal uppercase tracking-widest">
                      <ShieldCheck className="h-3 w-3" /> Members Only
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="rounded-2xl bg-[#fafafa] p-4 border border-black/5">
                      <div className="mb-2 flex justify-between">
                        <span className="text-xs font-bold text-black/75">Regulatory Strategy</span>
                        <span className="text-xs font-black text-red-600">32% (Critical Gap)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-black/5 overflow-hidden">
                        <div className="h-full w-[32%] bg-red-600" />
                      </div>
                    </div>
                    <div className="rounded-2xl bg-rellia-teal/[0.02] p-5 border border-rellia-teal/10">
                      <h5 className="mb-2 text-sm font-bold text-rellia-teal flex items-center gap-2">
                        <ShieldIcon className="h-4 w-4 text-amber-500" />
                        Priority Blockers: Traceability
                      </h5>
                      <p className="font-urbanist text-xs text-black/65 leading-relaxed">
                        Your software development process currently lacks a formal traceability matrix linking user needs, system requirements, and clinical verification test results. This is a critical regulatory gate for both FDA 510(k) and Health Canada SaMD submissions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SURVEY TO INSIGHTS TIMELINE SECTION */}
      <MembershipPathTimeline 
        headingTitle="Survey to insights in 15 minutes"
        subheading="Four focused steps from startup context to a personalized gap profile you can act on."
        steps={timelineSteps}
        showRoleLinks={false}
        className="border-t-0 bg-white py-10 md:py-12 lg:py-14 pb-20 md:pb-24"
      />

      <div className="bg-white">
        <RelliaCta 
          aboveSectionTone="white"
          title="Benchmark your **startup** today"
          body="Identify your blind spots, secure regulatory clarity, and discover what gets health systems to say yes."
          primary={{ label: "Take the Diagnostic", to: "/diagnostic-survey" }}
          secondary={{ label: "Join as Member", to: "/apply" }}
        />
      </div>

      <Footer />
    </div>
      }
    />
  )
}
