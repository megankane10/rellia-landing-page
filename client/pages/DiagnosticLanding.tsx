import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Sparkles, 
  Users, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Building2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RelliaAction from '@/components/RelliaAction';
import NetworkEyebrow from '@/components/network/NetworkEyebrow';
import RouteSeo from '@/components/RouteSeo';
import { motion } from 'framer-motion';
import { isProductionHostname } from "@/lib/sanity"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
import { Clock } from "lucide-react"

const topics = [
  'Product Design & UI/UX', 'Product Development', 'Clinical Trials',
  'Regulatory & Quality', 'Legal, Privacy & Cybersecurity', 'IP & Patents',
  'Reimbursement', 'Fundraising', 'Marketing',
  'Go-To-Market Strategy', 'Navigating Healthcare Systems', 'Customer Success', 'Operations & Scaling',
];

export default function DiagnosticLanding() {
  const isProd = isProductionHostname()

  return (
    <div className="min-h-screen bg-white font-host-grotesk text-black selection:bg-rellia-mint/30 pt-[72px] md:pt-[86px] overflow-x-hidden">
      <Navbar />
      <RouteSeo 
        title="Startup Diagnostic | Rellia Health" 
        description="Benchmark your health tech startup across 13 domains. Get a personalized gap analysis and roadmap."
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-6 pt-20 pb-28 md:pt-32 md:pb-40 bg-[#f9faf6]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-rellia-mint/15 blur-3xl opacity-60" />
          <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-rellia-teal/5 blur-3xl opacity-40" />
        </div>

        <div className="mx-auto w-full max-w-[1200px] relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <NetworkEyebrow label="Startup Diagnostic" tone="onLight" className="mb-6 md:mb-8" />
            <h1 className="mb-6 font-host-grotesk text-4xl font-bold leading-[1.08] tracking-tight text-black sm:text-6xl md:text-7xl lg:text-8xl">
              How ready is your<br />
              <span className="italic font-normal text-rellia-teal font-host-grotesk">startup, really?</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl font-urbanist text-lg leading-relaxed text-black/75 md:text-xl">
              Benchmark your startup across 13 critical domains — from regulatory and clinical to go-to-market and operations. Get an instant readiness score and identify hidden blockers.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row w-full sm:w-auto">
              <RelliaAction 
                asChild
                variant="mintTealFill" 
                size="comfortable" 
                className="w-full sm:w-auto shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <Link to={isProd ? "/contact" : "/diagnostic-survey"}>
                  {isProd ? "Ask about the diagnostic" : "Begin Free Assessment"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </RelliaAction>
              {!isProd && (
                <a href="#how-it-works" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-rellia-teal/70 hover:text-rellia-teal transition-colors">
                  How it works
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              )}
            </div>

            {/* Locked report notification */}
            <div className="mt-8 flex items-center gap-2 rounded-full bg-rellia-teal/5 px-4 py-1.5 text-xs font-semibold text-rellia-teal border border-rellia-teal/10">
              <Lock className="h-3.5 w-3.5" />
              <span>Note: Only Rellia members get access to their detailed gap analysis report at the end.</span>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-rellia-teal" /> 100% Private</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-rellia-teal" /> ~15 Minutes</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-rellia-teal" /> Advisor Matching</div>
            </div>
          </motion.div>
        </div>
      </section>

      {isProd ? (
        <div className="py-24 md:py-40 container mx-auto px-6">
          <FilteredListEmptyState
            icon={Clock}
            title="Startup Diagnostic coming soon"
            description="We're currently refining our AI-powered diagnostic tool to provide the most accurate readiness benchmarking for your health tech startup. Check back shortly."
          />
        </div>
      ) : (
        <>
          {/* VALUE PROP GRID */}
          <section className="bg-white py-24 md:py-32 px-6 border-b border-black/5">
            <div className="mx-auto w-full max-w-[1200px]">
              <div className="mb-16 md:mb-20 text-center flex flex-col items-center">
                <h2 className="mb-6 font-host-grotesk text-3xl font-bold text-black md:text-5xl leading-tight">A complete readiness map</h2>
                <p className="mx-auto max-w-2xl font-urbanist text-lg text-black/60 leading-relaxed">
                  Most founders have a few strong domains and several hidden gaps. This diagnostic exposes the full picture so you can build with confidence.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {[
                  { 
                    icon: Target, 
                    title: '13 Scored Domains', 
                    desc: 'Every critical health tech domain is assessed, from clinical evidence to quality management and unit economics.' 
                  },
                  { 
                    icon: Sparkles, 
                    title: 'AI-Powered Analysis', 
                    desc: 'Identify your top 3 strengths and priority gaps instantly. Detailed reports and gap analyses are exclusive to Rellia members.' 
                  },
                  { 
                    icon: Users, 
                    title: 'Advisor Matching', 
                    desc: 'Members are automatically matched and introduced to pre-vetted advisors based on their startup\'s gap profile.' 
                  }
                ].map((feature, i) => (
                  <div key={i} className="group rounded-[32px] border border-black/5 bg-[#fcfdfa] p-8 md:p-10 transition-all duration-300 hover:border-rellia-teal/20 hover:bg-white hover:shadow-xl">
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-rellia-teal text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                      <feature.icon className="h-7 w-7 text-rellia-mint" />
                    </div>
                    <h3 className="mb-4 font-host-grotesk text-xl font-bold text-black">{feature.title}</h3>
                    <p className="font-urbanist text-base leading-relaxed text-black/60">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TOPICS COVERED */}
          <section className="py-24 md:py-32 px-6 bg-[#fbfcf8]">
            <div className="mx-auto w-full max-w-[1200px]">
              <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <h2 className="mb-6 font-host-grotesk text-3xl font-bold text-black md:text-5xl leading-tight">No stone left unturned</h2>
                  <p className="mb-10 font-urbanist text-lg text-black/60 leading-relaxed">
                    We've distilled years of digital health experience into a comprehensive assessment framework that covers the entire startup lifecycle.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {topics.map(t => (
                      <div key={t} className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2.5 text-xs font-semibold text-black/80 shadow-sm transition-colors hover:border-rellia-teal/30">
                        <div className="h-1.5 w-1.5 rounded-full bg-rellia-mint" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 lg:pl-12">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-[40px] bg-rellia-teal/5 blur-2xl pointer-events-none" />
                    <div className="relative rounded-[40px] border border-black/10 bg-white p-8 md:p-10 shadow-lg">
                      <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-black/45">Sample Report Preview</h4>
                        <div className="flex items-center gap-1.5 rounded-full bg-rellia-teal/5 px-2.5 py-1 text-[10px] font-bold text-rellia-teal uppercase tracking-widest">
                          <Lock className="h-3 w-3" /> Members Only
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
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
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

          {/* HOW IT WORKS */}
          <section id="how-it-works" className="bg-rellia-teal py-24 md:py-32 px-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <Building2 className="h-[400px] w-[400px]" />
            </div>
            
            <div className="mx-auto w-full max-w-[1200px] relative z-10">
              <div className="mb-16 md:mb-20 text-center flex flex-col items-center">
                <h2 className="mb-6 font-host-grotesk text-3xl font-bold md:text-5xl text-white">Survey to insights in 15 minutes</h2>
                <p className="mx-auto max-w-2xl font-urbanist text-lg text-white/70 leading-relaxed">
                  A streamlined, high-signal diagnostic flow built specifically for healthcare innovators.
                </p>
              </div>

              <div className="grid gap-12 md:grid-cols-4">
                {[
                  { n: '01', t: 'Startup Context', d: 'Provide high-level details about your product mission, stage, and targets.' },
                  { n: '02', t: 'Deep Assessment', d: 'Evaluate your status across 13 sections with zero-BS honest reflections.' },
                  { n: '03', t: 'Score Generation', d: 'Our AI processes scores to evaluate strengths, priority gaps, and blockers.' },
                  { n: '04', t: 'Report Access', d: 'Rellia members immediately unlock their custom diagnostic report and advisor matching.' }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 font-host-grotesk text-2xl font-bold text-rellia-mint">
                      {step.n}
                    </div>
                    <h4 className="mb-3 font-host-grotesk text-lg font-bold text-white">{step.t}</h4>
                    <p className="font-urbanist text-sm text-white/60 leading-relaxed">{step.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="py-24 md:py-32 px-6 text-center bg-[#f9faf7]">
            <div className="mx-auto w-full max-w-[900px]">
              <div className="rounded-[40px] border border-black/5 bg-white p-10 shadow-xl md:p-20 flex flex-col items-center">
                <Sparkles className="mb-6 h-12 w-12 text-rellia-teal opacity-25" />
                <h2 className="mb-6 font-host-grotesk text-3xl font-bold text-black md:text-5xl">Benchmark your startup today</h2>
                <p className="mb-10 max-w-xl font-urbanist text-lg text-black/60 leading-relaxed">
                  Identify your blind spots, secure regulatory clarity, and discover what gets health systems to say yes.
                </p>
                
                <RelliaAction 
                  asChild
                  variant="mintTealFill" 
                  size="comfortable" 
                  className="w-full sm:w-auto px-12 py-8 text-xl shadow-md transition-transform duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <Link to="/diagnostic-survey">
                    Take the Diagnostic
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </RelliaAction>

                {/* Important notice alert box */}
                <div className="mt-8 max-w-lg rounded-2xl bg-amber-50 border border-amber-200 p-4 text-left">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-host-grotesk text-xs font-bold text-amber-900 uppercase tracking-wider block">Access Notice</span>
                      <p className="mt-1 font-urbanist text-xs leading-relaxed text-amber-800">
                        The Startup Diagnostic assessment is free for everyone to complete. However, please note that <strong>only active Rellia members</strong> can access the detailed gap analysis report, personalized roadmap output, and advisor matches.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="mt-6 font-urbanist text-sm text-black/45">
                  Rellia Health member? Log in to your account after completion to instantly sync.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
