import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Sparkles, 
  Users, 
  Search, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Building2,
  AlertTriangle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RelliaAction from '@/components/RelliaAction';
import NetworkEyebrow from '@/components/network/NetworkEyebrow';
import RouteSeo from '@/components/RouteSeo';
import { motion } from 'framer-motion';

const topics = [
  'Product Design & UI/UX', 'Product Development', 'Clinical Trials',
  'Regulatory & Quality', 'Legal, Privacy & Cybersecurity', 'IP & Patents',
  'Reimbursement', 'Fundraising', 'Marketing',
  'Go-To-Market Strategy', 'Navigating Healthcare Systems', 'Customer Success', 'Operations & Scaling',
];

export default function DiagnosticLanding() {
  return (
    <div className="min-h-screen bg-rellia-cream font-host-grotesk text-rellia-teal selection:bg-rellia-mint/30 selection:text-rellia-teal pt-[72px] md:pt-[86px]">
      <Navbar />
      <RouteSeo 
        title="Startup Diagnostic | Rellia Health" 
        description="Benchmark your health tech startup across 13 domains. Get a personalized gap analysis and roadmap."
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-4 pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-rellia-mint/10 blur-3xl opacity-50" />
          <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-rellia-teal/5 blur-3xl opacity-30" />
        </div>

        <div className="container relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <NetworkEyebrow label="Startup Diagnostic" tone="onLight" className="mb-8" />
            <h1 className="mb-8 font-host-grotesk text-5xl font-bold leading-[1.1] tracking-tight text-rellia-teal md:text-8xl">
              How ready is your<br /><span className="italic font-normal">startup, really?</span>
            </h1>
            <p className="mx-auto mb-12 max-w-2xl font-urbanist text-lg leading-relaxed text-rellia-teal/70 md:text-xl">
              Benchmark your startup across 13 critical domains — from regulatory and clinical to go-to-market and operations. Get an instant, AI-powered report and prioritized roadmap.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <RelliaAction 
                asChild
                variant="mintTealFill" 
                size="comfortable" 
                className="w-full sm:w-auto shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                <Link to="/diagnostic-survey">
                  Begin Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </RelliaAction>
              <a href="#how-it-works" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-rellia-teal/60 hover:text-rellia-teal transition-colors">
                How it works
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-rellia-teal/30">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 100% Private</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4" /> ~15 Minutes</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Advisor Matching</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALUE PROP GRID */}
      <section className="bg-white py-32 px-4 border-y border-rellia-teal/5">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 font-host-grotesk text-3xl font-bold text-rellia-teal md:text-5xl">A complete readiness map</h2>
            <p className="mx-auto max-w-2xl text-rellia-teal/60">Most founders have a few strong domains and several hidden gaps. This diagnostic exposes the full picture so you can build with confidence.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { 
                icon: Target, 
                title: '13 Scored Domains', 
                desc: 'Every critical health tech domain is assessed, from clinical evidence to unit economics.' 
              },
              { 
                icon: Sparkles, 
                title: 'AI-Powered Analysis', 
                desc: 'Get an instant report surfacing your top 3 gaps, strengths, and specific next steps.' 
              },
              { 
                icon: Users, 
                title: 'Advisor Matching', 
                desc: 'Members are automatically assigned a personalized advisory board based on their gap profile.' 
              }
            ].map((feature, i) => (
              <div key={i} className="group rounded-[32px] border border-rellia-teal/5 bg-rellia-cream/10 p-10 transition-all hover:border-rellia-teal/10 hover:bg-white hover:shadow-2xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-rellia-teal text-white shadow-lg transition-transform group-hover:scale-110">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-4 font-host-grotesk text-xl font-bold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-rellia-teal/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOPICS COVERED */}
      <section className="py-32 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
            <div className="flex-1">
              <h2 className="mb-6 font-host-grotesk text-3xl font-bold text-rellia-teal md:text-5xl">No stone left unturned</h2>
              <p className="mb-10 text-rellia-teal/60">We\'ve distilled years of health tech experience into a comprehensive framework that covers the entire startup lifecycle.</p>
              <div className="flex flex-wrap gap-3">
                {topics.map(t => (
                  <div key={t} className="flex items-center gap-2 rounded-full border border-rellia-teal/10 bg-white px-4 py-2 text-xs font-medium text-rellia-teal/80 transition-colors hover:border-rellia-teal/30">
                    <div className="h-1.5 w-1.5 rounded-full bg-rellia-mint" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 lg:pl-12">
              <div className="relative">
                <div className="absolute -inset-4 rounded-[40px] bg-rellia-teal/5 blur-2xl" />
                <div className="relative rounded-[40px] border border-rellia-teal/10 bg-white p-8 shadow-sm">
                  <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-rellia-teal/40">Sample Report Insight</h4>
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-rellia-cream/30 p-4 border border-rellia-teal/5">
                      <div className="mb-2 flex justify-between">
                        <span className="text-[10px] font-bold uppercase text-rellia-teal/60">Regulatory Strategy</span>
                        <span className="text-xs font-black text-red-600">32%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-rellia-teal/5 overflow-hidden">
                        <div className="h-full w-[32%] bg-red-600" />
                      </div>
                    </div>
                    <div className="rounded-2xl bg-rellia-mint/5 p-5 border border-rellia-mint/10">
                      <h5 className="mb-2 text-sm font-bold text-rellia-teal flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Priority Gap: Traceability
                      </h5>
                      <p className="text-xs text-rellia-teal/60 leading-relaxed">Your development process lacks formal traceability between requirements and test results. This is a critical blocker for FDA/CE Mark submission.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-rellia-teal py-32 px-4 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Building2 className="h-96 w-96" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="mb-20 text-center">
            <h2 className="mb-6 font-host-grotesk text-3xl font-bold md:text-5xl">Survey to insight in 15 minutes</h2>
          </div>

          <div className="grid gap-12 md:grid-cols-4">
            {[
              { n: '01', t: 'Startup Context', d: 'Provide basic details about your startup, stage, and product.' },
              { n: '02', t: 'The Assessment', d: 'Work through 13 sections at your own pace with honest reflections.' },
              { n: '03', t: 'AI Generation', d: 'Our AI analyzes your scores to build a customized report and roadmap.' },
              { n: '04', t: 'Advisor Match', d: 'Unlock personalized mentor matches to help you tackle your gaps.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 font-host-grotesk text-2xl font-bold text-rellia-mint">
                  {step.n}
                </div>
                <h4 className="mb-3 font-bold">{step.t}</h4>
                <p className="text-sm text-white/60 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-[48px] border border-rellia-teal/10 bg-white p-12 shadow-2xl md:p-20">
            <Sparkles className="mx-auto mb-8 h-12 w-12 text-rellia-teal opacity-20" />
            <h2 className="mb-6 font-host-grotesk text-3xl font-bold text-rellia-teal md:text-5xl">Benchmark your startup today</h2>
            <p className="mb-12 text-lg text-rellia-teal/60">Join hundreds of health tech founders who have used the Rellia diagnostic to prioritize their build and accelerate their path to market.</p>
            
            <RelliaAction 
              asChild
              variant="mintTealFill" 
              size="comfortable" 
              className="w-full sm:w-auto px-12 py-8 text-xl"
            >
              <Link to="/diagnostic-survey">
                Take the Diagnostic
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </RelliaAction>
            
            <p className="mt-8 text-sm text-rellia-teal/40">
              Rellia Health member? Log in after the survey to unlock your matches.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
