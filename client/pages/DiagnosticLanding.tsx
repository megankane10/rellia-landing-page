import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck,
  Zap,
  Users,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RelliaAction from '@/components/RelliaAction';
import RouteSeo from '@/components/RouteSeo';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PAGE_HEADER_TITLE_SIZE_CLASS } from '@/components/PageHeader';
import type { HomeWhyFeature } from "@shared/cms/types";

import WhyRellia from '@/components/WhyRellia';
import MembershipPathTimeline from '@/components/MembershipPathTimeline';
import RelliaCta from '@/components/RelliaCta';

import {
  Palette,
  Code2,
  Activity,
  ShieldCheck as ShieldIcon,
  Scale,
  FileText,
  DollarSign,
  TrendingUp,
  Megaphone,
  Compass,
  Building2,
  Heart,
  Briefcase
} from 'lucide-react';

const whyFeatures: HomeWhyFeature[] = [
  {
    iconKey: "",
    title: "12 Scored Domains",
    description: "Every critical health tech domain is assessed, from clinical evidence to quality management and unit economics.",
    imageSrc: "/images/whyrellia-network-2.jpg"
  },
  {
    iconKey: "",
    title: "AI-Powered Analysis",
    description: "Identify your top 3 strengths and priority gaps instantly. Detailed reports and gap analyses are exclusive to Rellia members.",
    imageSrc: "/images/whyrellia-founders-2.jpg"
  },
  {
    iconKey: "",
    title: "Advisor Matching",
    description: "Members are automatically matched and introduced to pre-vetted advisors based on their startup's gap profile.",
    imageSrc: "/images/whyrellia-programs-2.jpg"
  },
  {
    iconKey: "",
    title: "Founding Membership",
    description: "Get early access to exclusive networking sessions, peer mentorship, and dedicated resources from day one.",
    imageSrc: "/images/whyrellia-outcomes-2.jpg"
  }
];

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
    icon: ShieldIcon,
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

const timelineSteps = [
  { title: 'Startup Context', description: 'Provide high-level details about your product mission, stage, and targets.' },
  { title: 'Deep Assessment', description: 'Evaluate your status across 12 sections with zero-BS honest reflections.' },
  { title: 'Score Generation', description: 'Our AI processes scores to evaluate strengths, priority gaps, and blockers.' },
  { title: 'Report Access', description: 'Rellia members immediately unlock their custom diagnostic report and advisor matching.' }
];

export default function DiagnosticLanding() {
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
    <div className="min-h-screen bg-white font-host-grotesk text-black selection:bg-rellia-mint/30 overflow-x-hidden">
      <Navbar />
      <RouteSeo 
        title="Startup Diagnostic | Rellia Health" 
        description="Benchmark your health tech startup across 12 domains. Get a personalized gap analysis and roadmap."
      />

      {/* HERO SECTION - Replicating RoleHero styling */}
      <section className="relative overflow-hidden bg-rellia-teal pt-[100px] md:pt-[116px] lg:flex lg:flex-col lg:min-h-0 lg:pt-[130px]">
        <img
          src="/images/diagnostics-hero.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/[0.88] via-rellia-teal/72 to-[#0a2830]/82" aria-hidden />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_20%_20%,rgba(167,219,214,0.35),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.14),transparent_45%)]" />
        <img
          src="/images/hologram-logo.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 w-[min(52vw,420px)] opacity-[0.07] md:right-0"
        />

        <div className="relative z-10 mx-auto max-w-[1300px] px-6 pb-20 pt-10 md:px-10 md:pb-28 md:pt-14 lg:flex lg:flex-1 lg:flex-col lg:justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start text-left"
          >
            {/* Top Badge: Glass/Pill notice */}
            <div className="mb-8 flex w-fit items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-semibold text-white border border-white/20">
              <Lock className="h-3.5 w-3.5 text-rellia-mint" />
              <span>Detailed analysis is only available to Rellia members</span>
            </div>

            <h1 className={cn("max-w-4xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-sm", PAGE_HEADER_TITLE_SIZE_CLASS)}>
              How ready is your<br />
              <span className="text-rellia-mint font-normal">startup, really?</span>
            </h1>
            
            <p className="mt-6 max-w-2xl font-urbanist text-lg leading-relaxed text-white/80 md:text-xl">
              Benchmark your startup across 12 critical domains — from regulatory and clinical to go-to-market and operations. Get an instant readiness score and identify hidden blockers.
            </p>
            
            <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              <RelliaAction 
                asChild
                variant="heroSolidOnTeal" 
                size="comfortable" 
                className="w-full min-w-0 justify-center sm:min-w-[220px] sm:w-auto"
              >
                <Link to="/diagnostic-survey">
                  Begin Free Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </RelliaAction>
            </div>
            
            {/* Bottom Checklist Alignment */}
            <div className="mt-14 flex flex-wrap items-center gap-6 md:gap-10 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 100% Private</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4" /> ~15 Minutes</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Advisor Matching</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* READINESS MAP SECTION using WhyRellia */}
      <WhyRellia 
        sectionTitle="A complete readiness map"
        sectionDescription="Most founders have a few strong domains and several hidden gaps. This diagnostic exposes the full picture so you can build with confidence."
        features={whyFeatures}
      />

      {/* NO STONE LEFT UNTURNED SECTION (removed bottom tag cloud of topics) */}
      <section className="py-24 md:py-32 px-6 bg-[#fbfcf8] border-b border-black/5">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <div className="flex-1">
              <h2 className="mb-6 font-host-grotesk text-2xl font-semibold text-black md:text-[32px] leading-tight">No stone left unturned</h2>
              <p className="font-urbanist text-lg text-black/60 leading-relaxed max-w-xl">
                We've distilled years of digital health experience into a comprehensive assessment framework that covers the entire startup lifecycle. Rellia's custom platform maps every critical domain, ensuring regulatory alignment, clinical proof, and bulletproof operational scaling.
              </p>

              {/* Scroller for the 12 domains */}
              <div className="mt-10 max-w-xl">
                <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-transparent p-7 shadow-none min-h-[250px] flex flex-col justify-between">
                  <div className="flex flex-col items-start gap-4">
                    <CurrentIcon className="h-8 w-8 text-rellia-teal shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-host-grotesk text-lg md:text-xl font-bold text-black">{currentItem.title}</h4>
                      <p className="mt-2 font-urbanist text-base leading-relaxed text-black/70 h-20 overflow-hidden">
                        {currentItem.description}
                      </p>
                    </div>
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
              </div>
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
        subheading="A streamlined, high-signal diagnostic flow built specifically for healthcare innovators."
        steps={timelineSteps}
        showRoleLinks={false}
        className="bg-rellia-cream/15"
      />

      {/* FINAL CTA SECTION using RelliaCta */}
      <div className="bg-rellia-cream/15">
        <RelliaCta 
          title="Benchmark your **startup** today"
          body="Identify your blind spots, secure regulatory clarity, and discover what gets health systems to say yes."
          primary={{ label: "Take the Diagnostic", to: "/diagnostic-survey" }}
          secondary={{ label: "Join as Member", to: "/apply" }}
        />
      </div>

      <Footer />
    </div>
  );
}
