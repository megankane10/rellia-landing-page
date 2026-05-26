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
import { RoleHero } from "./network/_shared";
import PillTag from "@/components/PillTag";
import { motion, AnimatePresence } from 'framer-motion';
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
        title="Startup Diagnostic — Rellia Health" 
        description="Benchmark your health tech startup across 12 critical domains. Get an instant readiness score, personalized gap analysis, and advisory board matching."
      />

      <div className="lg:flex lg:h-[82vh] lg:flex-col">
        <RoleHero
          eyebrowLabel="Startup Diagnostic"
          imageSrc="/images/diagnostics-hero.jpg"
          className="lg:flex-1"
          titleClassName="max-w-5xl"
          subtitleClassName="max-w-3xl"
          title={
            <>
              How ready is your <span className="text-rellia-mint">startup, really?</span>
            </>
          }
          subtitle={
            <div className="flex flex-col items-start">
              <p className="font-urbanist text-lg leading-relaxed text-white/85 md:text-xl">
                Benchmark your startup across 12 critical domains. Get an instant readiness score and identify hidden blockers.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {[
                  { label: "100% Private", icon: ShieldCheck },
                  { label: "~15 Minutes", icon: Zap },
                  { label: "Advisor Matching", icon: Users },
                ].map((item) => (
                  <PillTag
                    key={item.label}
                    label={item.label}
                    dot={<item.icon className="h-3.5 w-3.5 text-rellia-mint shrink-0" />}
                    className="border-white/20 bg-white/10"
                  />
                ))}
              </div>
            </div>
          }
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
      <section className="py-24 md:py-32 px-6 bg-[#fbfcf8] border-b border-black/5">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <div className="flex-1">
              <h2 className="mb-6 font-host-grotesk text-2xl font-semibold text-black md:text-[32px] leading-tight">No stone left unturned</h2>
              <p className="font-urbanist text-lg text-black/60 leading-relaxed max-w-xl">
                We've distilled years of digital health experience into a comprehensive assessment framework that covers the entire startup lifecycle. Rellia's custom platform maps every critical domain, ensuring regulatory alignment, clinical proof, and bulletproof operational scaling.
              </p>

              {/* Scroller for the 12 domains */}
              <div className="mt-6 max-w-xl">
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
