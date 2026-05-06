import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Menu, X, CheckCircle2, ArrowRight, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import RelliaAction from '@/components/RelliaAction';
import NetworkEyebrow from '@/components/network/NetworkEyebrow';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Option { label: string; desc: string; score: number; }
interface Question { text: string; type: 'confidence'|'progress'|'applicability'|'knowledge'; options: Option[]; }
interface Section { id: string; icon: string; title: string; desc: string; questions: Question[]; }
interface Answers { [secId: string]: { [qIdx: number]: number }; }
interface MemberInfo { name: string; company: string; stage: string; email: string; desc: string; }
interface DiagResult {
  summary: string;
  strengths: { category: string; score: number; note: string }[];
  gaps: { category: string; score: number; priority: string; note: string }[];
  recommendations: string[];
}

// ─── DATA MAP ────────────────────────────────────────────────────────────────

const DATA_MAP: Record<string, { mentor: string; program: string }> = {
  product_design:   { mentor: 'UX & Product Design Mentor',    program: 'Prototype Lab' },
  product_dev:      { mentor: 'Engineering Lead Mentor',        program: 'Build Your QMS' },
  clinical:         { mentor: 'Clinical Affairs Advisor',       program: 'Regulatory Roadmap' },
  regulatory:       { mentor: 'Regulatory Specialist',          program: 'Regulatory Roadmap' },
  legal:            { mentor: 'Legal & Privacy Advisor',        program: 'Regulatory Roadmap' },
  ip:               { mentor: 'IP & Patent Counsel',            program: 'Advance Dataroom' },
  reimbursement:    { mentor: 'Reimbursement Strategist',       program: 'Regulatory Roadmap' },
  fundraising:      { mentor: 'Investor Relations Mentor',      program: 'Elevate Capital' },
  marketing:        { mentor: 'Health Marketing Advisor',       program: 'Brand Strategy' },
  gtm:              { mentor: 'Commercial Strategy Mentor',     program: 'First 50 Users' },
  healthcare:       { mentor: 'Health System Navigator',        program: 'Advisory Board' },
  customer_success: { mentor: 'Customer Success Lead',          program: 'First 50 Users' },
  operations:       { mentor: 'Operations & Scale Mentor',      program: 'Ignite Pitch' },
};

// ─── QUESTION DATA ───────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  { id:'product_design', icon:'✦', title:'Product Design & UI/UX', desc:'How well do you understand who you\'re building for and whether your product actually works for them?', questions:[
    { text:'How well do you understand the real-world workflow your product replaces or disrupts?', type:'confidence', options:[{label:'We haven\'t mapped this yet',desc:'Still focused on building the product itself',score:0},{label:'We have a general sense of it',desc:'Based on assumptions or desk research',score:33},{label:'We\'ve mapped it with input from users',desc:'We\'ve observed or interviewed people in that workflow',score:67},{label:'We know it deeply',desc:'Every handoff, pain point, and workaround — in detail',score:100}]},
    { text:'What\'s the current state of your usability testing?', type:'progress', options:[{label:'We haven\'t done any yet',desc:'Testing is on the roadmap but hasn\'t happened',score:0},{label:'We\'ve done informal testing',desc:'Friends, colleagues, or a couple of early users',score:33},{label:'We\'ve tested with real target users',desc:'People who match our intended user profile',score:67},{label:'We test regularly and act on findings',desc:'Usability is an ongoing part of our development cycle',score:100}]},
    { text:'Have you separately interviewed your primary user, economic buyer, and decision-maker?', type:'knowledge', options:[{label:'I\'m not sure these are different people for us',desc:'We haven\'t thought through these roles yet',score:0},{label:'We\'ve only spoken to one of these groups',desc:'Usually the end user, not the buyer or approver',score:25},{label:'We\'ve spoken to two of the three',desc:'Some gaps remain in our stakeholder understanding',score:67},{label:'Yes — all three, and we understand each perspective',desc:'We know how their priorities align and conflict',score:100}]},
    { text:'Do you have documented usability requirements separate from functional requirements?', type:'progress', options:[{label:'No — we don\'t have formal requirements yet',desc:'Everything is still informal',score:0},{label:'We have functional requirements but not usability ones',desc:'We know what it needs to do, not how it needs to feel',score:33},{label:'We\'re working on this',desc:'Partially documented or in progress',score:67},{label:'Yes — both documented and maintained',desc:'We treat usability as a first-class requirement',score:100}]},
    { text:'How independently can a new user onboard with your product today?', type:'confidence', options:[{label:'They can\'t — we walk everyone through it',desc:'Onboarding requires our direct involvement',score:0},{label:'They can start but often get stuck',desc:'We get a lot of the same questions',score:33},{label:'Most users can onboard without help',desc:'Occasional edge cases need support',score:67},{label:'Fully self-serve — and we\'ve validated this',desc:'We\'ve watched real users onboard without guidance',score:100}]},
  ]},
  { id:'product_dev', icon:'◈', title:'Product Development', desc:'How structured and traceable is your development process?', questions:[
    { text:'What\'s the current state of your product requirements documentation?', type:'progress', options:[{label:'It\'s all in our heads right now',desc:'Nothing formally written down',score:0},{label:'We have informal notes or a shared doc',desc:'Not structured, but something exists',score:33},{label:'We have defined requirements, but they lag behind what we\'ve built',desc:'Documentation isn\'t always current',score:67},{label:'Requirements are documented, versioned, and up to date',desc:'We maintain them as a living reference',score:100}]},
    { text:'How well does your version control connect requirements, code, and testing?', type:'progress', options:[{label:'We don\'t have version control in place yet',desc:'No formal process connecting these three',score:0},{label:'We use version control for code only',desc:'Requirements and tests aren\'t connected',score:33},{label:'We\'re working toward a connected system',desc:'Improving but still some gaps',score:67},{label:'All three are versioned and traceable to each other',desc:'Any feature can be traced from requirement to test result',score:100}]},
    { text:'How do you manage changes to requirements once development has started?', type:'knowledge', options:[{label:'We just talk about them and update the code',desc:'Informal change management',score:0},{label:'We update docs but don\'t always track the why',desc:'Documentation updates without rationale',score:33},{label:'We have a process but it\'s occasionally bypassed',desc:'Formal process exists but lacks discipline',score:67},{label:'Formal change control — impacts are assessed before coding',desc:'Changes are deliberate and documented',score:100}]},
    { text:'How do you ensure that all requirements have been tested before a release?', type:'progress', options:[{label:'We test what we think is important',desc:'Ad-hoc testing approach',score:0},{label:'We have a checklist of major features',desc:'High-level validation',score:33},{label:'We map tests to requirements manually',desc:'Better coverage but prone to error',score:67},{label:'Full traceability matrix from requirements to test results',desc:'Complete confidence in coverage',score:100}]},
  ]},
  { id:'clinical', icon:'✚', title:'Clinical Evidence', desc:'Is your product\'s value grounded in clinical reality?', questions:[
    { text:'How clearly have you defined the clinical endpoints your product aims to impact?', type:'confidence', options:[{label:'We have a general idea but nothing specific',desc:'End-goals are vague',score:0},{label:'We know our main goal but haven\'t defined metrics',desc:'Directional but not measurable',score:33},{label:'We have specific, measurable clinical endpoints defined',desc:'Clear metrics for success',score:67},{label:'Endpoints are defined and validated with clinical experts',desc:'Rigorous, expert-backed targets',score:100}]},
    { text:'What is your plan for clinical validation?', type:'progress', options:[{label:'We haven\'t started planning this yet',desc:'Validation is a future concern',score:0},{label:'We know we need a study but don\'t have a protocol',desc:'Concept exists without a plan',score:33},{label:'We have a draft clinical evaluation plan (CEP)',desc:'Planning is underway',score:67},{label:'Protocol is finalised and we\'re preparing for execution',desc:'Ready to begin formal validation',score:100}]},
    { text:'How well does your current product data support your clinical claims?', type:'confidence', options:[{label:'We haven\'t collected data for claims yet',desc:'No evidence base yet',score:0},{label:'We have some pilot data but it\'s limited',desc:'Early signal only',score:33},{label:'We have strong pilot or real-world data',desc:'Good evidence for our claims',score:67},{label:'We have peer-reviewed or pivotal study data',desc:'Decision-grade evidence',score:100}]},
  ]},
  { id:'regulatory', icon:'◎', title:'Regulatory Strategy', desc:'Do you have a clear path through the regulatory maze?', questions:[
    { text:'How certain are you of your product\'s regulatory classification?', type:'confidence', options:[{label:'We haven\'t looked into this yet',desc:'Regulatory status is unknown',score:0},{label:'We have an idea but haven\'t confirmed it',desc:'Internal assumption only',score:33},{label:'We\'ve had an initial assessment by an expert',desc:'Professional opinion obtained',score:67},{label:'We have formal confirmation or a very clear path',desc:'Classification is certain',score:100}]},
    { text:'What is the status of your Quality Management System (QMS)?', type:'progress', options:[{label:'We don\'t have a QMS yet',desc:'No formal quality structure',score:0},{label:'We have some SOPs but not a full system',desc:'Fragmented quality processes',score:33},{label:'QMS is mostly implemented and we\'re using it',desc:'Operational quality system',score:67},{label:'Full QMS implemented and ready for audit/certification',desc:'Audit-ready quality system',score:100}]},
    { text:'How well is your technical file/documentation structured for submission?', type:'progress', options:[{label:'We haven\'t started the technical file',desc:'No submission materials ready',score:0},{label:'We have some parts ready but it\'s messy',desc:'Incomplete and unorganised',score:33},{label:'The file is mostly complete and structured',desc:'Solid foundation for submission',score:67},{label:'Submission-ready technical file with full traceability',desc:'Complete and professional documentation',score:100}]},
  ]},
  { id:'legal', icon:'⚖', title:'Legal & Privacy', desc:'Are you protecting your company and your users\' data?', questions:[
    { text:'How robust is your data privacy and security framework?', type:'confidence', options:[{label:'We haven\'t formalised this yet',desc:'Security is ad-hoc',score:0},{label:'We have basic policies in place',desc:'Compliance is surface-level',score:33},{label:'We are compliant with major standards (HIPAA, GDPR, etc.)',desc:'Formal compliance achieved',score:67},{label:'Privacy-by-design and regular third-party audits',desc:'Security is a core competency',score:100}]},
    { text:'Are your core contracts (Employment, IP, Founders) fully executed?', type:'progress', options:[{label:'Some are missing or incomplete',desc:'Legal loose ends remain',score:0},{label:'Most are done but a few remain',desc:'Nearly there',score:67},{label:'All core contracts are fully executed and filed',desc:'Clean legal foundation',score:100}]},
  ]},
  { id:'ip', icon:'℗', title:'IP Strategy', desc:'Have you protected what makes you unique?', questions:[
    { text:'What is the status of your patent or IP protection strategy?', type:'progress', options:[{label:'We haven\'t filed anything yet',desc:'IP is currently unprotected',score:0},{label:'We have filed provisionals',desc:'Initial protection secured',score:33},{label:'We have a clear IP roadmap and multiple filings',desc:'Strategic IP portfolio',score:67},{label:'Granted patents or a very strong, defensible position',desc:'IP is a major asset',score:100}]},
  ]},
  { id:'reimbursement', icon:'$', title:'Reimbursement', desc:'How will you actually get paid?', questions:[
    { text:'How clearly have you identified your primary reimbursement pathway?', type:'confidence', options:[{label:'We haven\'t figured this out yet',desc:'Revenue model is uncertain',score:0},{label:'We have a few potential paths but no clear winner',desc:'Exploring options',score:33},{label:'We have a clear, primary pathway identified',desc:'Targeted reimbursement model',score:67},{label:'Pathway is validated with payers or experts',desc:'Proven route to revenue',score:100}]},
  ]},
  { id:'fundraising', icon:'▲', title:'Fundraising', desc:'Are you ready for the scrutiny of healthcare investors?', questions:[
    { text:'How complete is your investor dataroom?', type:'progress', options:[{label:'We don\'t have a dataroom yet',desc:'No materials prepared for due diligence',score:0},{label:'Basic deck and some docs are ready',desc:'Initial materials only',score:33},{label:'Comprehensive dataroom is nearly complete',desc:'Most diligence items covered',score:67},{label:'Full, audit-ready dataroom with all healthcare-specific items',desc:'Ready for deep-dive diligence today',score:100}]},
  ]},
  { id:'marketing', icon:'◈', title:'Marketing & Branding', desc:'Does your brand resonate with healthcare stakeholders?', questions:[
    { text:'How well-defined is your brand positioning in the healthcare market?', type:'confidence', options:[{label:'We have a logo but no clear positioning',desc:'Branding is surface-level',score:0},{label:'We have a value prop but it\'s generic',desc:'Not specific enough for healthcare',score:33},{label:'Positioning is specific to our key stakeholders',desc:'Resonant branding',score:67},{label:'Positioning is validated and consistently applied',desc:'Brand is a differentiator',score:100}]},
  ]},
  { id:'gtm', icon:'⚑', title:'Go-To-Market', desc:'How will you reach and win your first customers?', questions:[
    { text:'How specific is your target customer profile (Ideal Customer Profile)?', type:'confidence', options:[{label:'We target "hospitals" or "doctors" generally',desc:'Too broad to be actionable',score:0},{label:'We\'ve narrowed it down to a specific department/role',desc:'Better focus',score:33},{label:'We have a detailed ICP including pain points and budget',desc:'Highly targeted',score:67},{label:'ICP is validated by initial sales or deep discovery',desc:'We know exactly who we\'re selling to',score:100}]},
  ]},
  { id:'healthcare', icon:'⚙', title:'Health System Navigation', desc:'Do you understand the complexity of institutional sales?', questions:[
    { text:'How well do you understand the procurement process of your target customers?', type:'knowledge', options:[{label:'We don\'t know how they buy yet',desc:'Sales process is a black box',score:0},{label:'We have a high-level sense of it',desc:'General understanding',score:33},{label:'We\'ve mapped the decision-makers and timeline',desc:'Detailed sales map',score:67},{label:'We\'ve navigated it at least once or have expert guidance',desc:'Proven ability to close',score:100}]},
  ]},
  { id:'customer_success', icon:'♡', title:'Customer Success', desc:'How do you ensure users stay and grow with you?', questions:[
    { text:'What metrics are you using to measure product success for your users?', type:'confidence', options:[{label:'We aren\'t tracking success metrics yet',desc:'User impact is unmeasured',score:0},{label:'We track basic usage/engagement',desc:'Measuring activity, not value',score:33},{label:'We track metrics that align with user value',desc:'Measuring what matters to users',score:67},{label:'Metrics are tied to ROI or clinical outcomes',desc:'Demonstrable value for the customer',score:100}]},
  ]},
  { id:'operations', icon:'▣', title:'Operations & Scaling', desc:'Whether your business can actually grow without breaking.', questions:[
    { text:'How aware are you of the manual processes in your business that won\'t scale?', type:'confidence', options:[{label:'We haven\'t thought about this systematically',desc:'Scaling constraints haven\'t been mapped',score:0},{label:'We\'re aware of some bottlenecks but haven\'t documented them',desc:'We know things will need to change but haven\'t planned it',score:33},{label:'We\'ve identified key manual processes and have a plan',desc:'Automation or delegation paths are being worked on',score:67},{label:'We\'ve already addressed scaling bottlenecks or are actively doing so',desc:'Operations are being built for scale proactively',score:100}]},
    { text:'How clearly have you defined the roles you need in the next 12 months?', type:'progress', options:[{label:'We haven\'t thought ahead to next year\'s team needs',desc:'Hiring plans are reactive rather than planned',score:0},{label:'We know we\'ll need to hire but haven\'t defined specific roles',desc:'Headcount growth is vague',score:33},{label:'We\'ve defined priority roles and roughly when we need them',desc:'A hiring roadmap exists',score:67},{label:'Hiring plans are specific, budgeted, and tied to our growth model',desc:'We know exactly who we need and when',score:100}]},
    { text:'How well do you understand your unit economics — now and at scale?', type:'confidence', options:[{label:'We haven\'t modelled our unit economics yet',desc:'CAC, LTV, margins are undefined',score:0},{label:'Rough estimates but we don\'t trust the numbers yet',desc:'Modelled but not grounded in real data',score:33},{label:'We understand our current unit economics and have a scaling model',desc:'Numbers are based on real experience',score:67},{label:'Unit economics are well understood, stress-tested, and improving',desc:'We can articulate exactly how the model gets better at scale',score:100}]},
  ]},
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getSectionScore(secId: string, answers: Answers): number | null {
  const sec = SECTIONS.find(s => s.id === secId);
  if (!sec || !answers[secId] || !Object.keys(answers[secId]).length) return null;
  let sum = 0, count = 0;
  Object.entries(answers[secId]).forEach(([qi, oi]) => {
    const q = sec.questions[parseInt(qi)];
    if (q && q.options[oi] !== undefined) { sum += q.options[oi].score; count++; }
  });
  return count > 0 ? Math.round(sum / count) : null;
}

function scoreClass(s: number): string {
  if (s >= 70) return 'text-green-600';
  if (s >= 40) return 'text-amber-600';
  return 'text-red-600';
}

function scoreBarClass(s: number): string {
  if (s >= 70) return 'bg-green-600';
  if (s >= 40) return 'bg-amber-600';
  return 'bg-red-600';
}

const TYPE_LABELS: Record<string, string> = {
  confidence: 'Confidence check', progress: 'Progress check',
  applicability: 'Applicability check', knowledge: 'Knowledge check',
};

// ─── HELPERS — TIMELINE ───────────────────────────────────────────────────────

const HowItWorksTimeline = ({ items }: { items: { t: string; d: string }[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <div ref={ref} className="relative">
      <div className="absolute bottom-4 left-5 top-5 w-0.5 -translate-x-1/2 rounded-full bg-rellia-teal/5" />
      <motion.div 
        className="absolute bottom-4 left-5 top-5 w-0.5 -translate-x-1/2 origin-top rounded-full bg-rellia-teal" 
        initial={{ scaleY: 0 }} 
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
      />
      <div className="space-y-8">
        {items.map((item, i) => (
          <motion.div 
            key={i} 
            className="relative z-10 flex gap-6"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500 font-bold text-sm ${isInView ? 'bg-rellia-teal text-white border-rellia-teal' : 'bg-white text-rellia-teal border-rellia-teal/20'}`}>
              {i + 1}
            </div>
            <div className="pt-1">
              <div className="font-bold text-rellia-teal">{item.t}</div>
              <div className="text-sm text-rellia-teal/60">{item.d}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');
@keyframes ds-spin { to { transform: rotate(360deg); } }
.animate-ds-spin { animation: ds-spin 0.8s linear infinite; }
@keyframes ds-fade-in-up { 
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-ds-up { animation: ds-fade-in-up 0.3s ease-out forwards; }
`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function DiagnosticSurvey() {
  const PORTAL_ID = (import.meta.env.VITE_HUBSPOT_PORTAL_ID as string | undefined)?.trim();
  const FORM_GUID  = (import.meta.env.VITE_HUBSPOT_FORM_GUID  as string | undefined)?.trim();
  const missingHubSpot = !PORTAL_ID || !FORM_GUID;

  const [view, setView]                     = useState<View>('intro');
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [currentQIdx, setCurrentQIdx]       = useState<number>(0);
  const [transitioning, setTransitioning]   = useState(false);
  const [answers, setAnswers]               = useState<Answers>({});
  const [memberInfo, setMemberInfo]         = useState<MemberInfo>({ name:'', company:'', stage:'', email:'', desc:'' });
  const [diagResult, setDiagResult]         = useState<DiagResult | null>(null);
  const [procStep, setProcStep]             = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const completedSections = SECTIONS.filter(s =>
    answers[s.id] && Object.keys(answers[s.id]).length === s.questions.length
  ).length;
  const progress = Math.round((completedSections / SECTIONS.length) * 100);
  const totalQs  = SECTIONS.reduce((a, s) => a + s.questions.length, 0);
  const answeredGlobal = SECTIONS.reduce((a, s) => a + Object.keys(answers[s.id] ?? {}).length, 0);

  const sec        = SECTIONS[currentSection];
  const secAnswers = answers[sec?.id ?? ''] ?? {};
  const currentQ   = sec?.questions[currentQIdx];
  const selectedOpt = secAnswers[currentQIdx] !== undefined ? secAnswers[currentQIdx] : -1;

  const goToSection = (i: number) => { 
    setCurrentSection(i); 
    setCurrentQIdx(0); 
    setView('survey'); 
    setMobileMenuOpen(false);
  };
  const goToIntro   = () => { setView('intro'); setMobileMenuOpen(false); };
  const startSurvey = () => { setCurrentSection(0); setCurrentQIdx(0); setView('survey'); };
  const goToSubmit  = () => { setView('submit'); setMobileMenuOpen(false); };

  const selectAnswer = (optIdx: number) => {
    if (transitioning) return;
    setAnswers(prev => ({ ...prev, [sec.id]: { ...(prev[sec.id] || {}), [currentQIdx]: optIdx } }));
    setTransitioning(true);
    setTimeout(() => {
      if (currentQIdx < sec.questions.length - 1) {
        setCurrentQIdx(i => i + 1);
      } else if (currentSection < SECTIONS.length - 1) {
        setCurrentSection(i => i + 1);
        setCurrentQIdx(0);
      } else {
        setView('submit');
      }
      setTransitioning(false);
    }, 320);
  };

  const generateReport = (): DiagResult => {
    const scored = SECTIONS.map(s => ({ id: s.id, title: s.title, score: getSectionScore(s.id, answers) ?? 0 }))
      .sort((a, b) => b.score - a.score);
    const strengths = scored.filter(s => s.score >= 70).slice(0, 3)
      .map(s => ({ category: s.title, score: s.score, note: `Strong foundation in ${s.title.toLowerCase()}.` }));
    const gapsRaw = [...scored].sort((a, b) => a.score - b.score).filter(s => s.score < 60).slice(0, 3);
    const gaps = gapsRaw.map(s => ({
      category: s.title, score: s.score,
      priority: s.score < 30 ? 'Critical' : s.score < 50 ? 'High' : 'Medium',
      note: `${s.title} needs focused attention.${DATA_MAP[s.id]?.program ? ` Consider the ${DATA_MAP[s.id].program} program.` : ''}`
    }));
    const topStr  = strengths.length ? strengths.map(s => s.category).join(', ') : 'several areas';
    const topGaps = gaps.length ? gaps.map(g => g.category).join(', ') : 'a few areas';
    const summary = `Based on your results, ${memberInfo.company || 'your company'} is in the ${memberInfo.stage || 'early'} phase with notable strengths in ${topStr}. Priority gaps are in ${topGaps}.`;
    const recommendations = gaps.map(g => {
      const sid = SECTIONS.find(s => s.title === g.category)?.id ?? '';
      return `Address ${g.category}: ${DATA_MAP[sid]?.program ? `explore the ${DATA_MAP[sid].program} program` : `connect with a ${DATA_MAP[sid]?.mentor ?? 'relevant'} mentor`}.`;
    });
    return { summary, strengths, gaps, recommendations };
  };

  const submitSurvey = async () => {
    setView('processing');
    setProcStep(0);
    const scores: Record<string, number> = {};
    SECTIONS.forEach(s => { scores[s.id] = getSectionScore(s.id, answers) ?? 0; });

    if (PORTAL_ID && FORM_GUID) {
      try {
        await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: [
              { name: 'email',     value: memberInfo.email },
              { name: 'firstname', value: memberInfo.name },
              { name: 'company',   value: memberInfo.company },
              ...SECTIONS.map(s => ({ name: `ds_score_${s.id}`, value: String(scores[s.id]) })),
            ],
            context: { pageUri: window.location.href, pageName: 'Startup Diagnostic' },
          }),
        });
      } catch (e) { console.warn('HubSpot submit failed', e); }
    }

    await new Promise(r => setTimeout(r, 600));  setProcStep(1);
    await new Promise(r => setTimeout(r, 600));  setProcStep(2);
    await new Promise(r => setTimeout(r, 500));
    setDiagResult(generateReport());
    setTimeout(() => setView('report'), 300);
  };

  return (
    <div className="min-h-screen bg-rellia-cream font-host-grotesk text-rellia-teal selection:bg-rellia-mint/30 selection:text-rellia-teal pt-[72px] md:pt-[86px]">
      <style>{css}</style>
      <Navbar />

      <div className="relative flex min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-86px)]">
        
        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="sticky top-[86px] hidden h-[calc(100vh-86px)] w-72 flex-col border-r border-rellia-teal/10 bg-white/50 backdrop-blur-md lg:flex">
          <div className="flex flex-col gap-6 p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-rellia-teal/50">
                <span>Progress</span>
                <span>{completedSections} / {SECTIONS.length}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-rellia-teal/5">
                <div 
                  className="h-full bg-rellia-teal transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            <nav className="space-y-1">
              <button 
                onClick={goToIntro}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${view === 'intro' ? 'bg-rellia-teal text-white shadow-md' : 'text-rellia-teal/60 hover:bg-rellia-teal/5 hover:text-rellia-teal'}`}
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${view === 'intro' ? 'border-white/30 bg-white/10' : 'border-rellia-teal/10'}`}>
                  →
                </div>
                <span className="font-medium">Introduction</span>
              </button>

              <div className="my-4 h-px bg-rellia-teal/5" />
              
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40">
                Assessment Sections
              </div>

              <div className="space-y-1">
                {SECTIONS.map((s, i) => {
                  const done = answers[s.id] && Object.keys(answers[s.id]).length === s.questions.length;
                  const active = view === 'survey' && i === currentSection;
                  return (
                    <button 
                      key={s.id} 
                      onClick={() => goToSection(i)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${active ? 'bg-rellia-teal text-white shadow-md' : done ? 'text-rellia-teal/70 hover:bg-rellia-teal/5' : 'text-rellia-teal/50 hover:bg-rellia-teal/5 hover:text-rellia-teal'}`}
                    >
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] ${active ? 'border-white/30 bg-white/10' : done ? 'border-green-500/30 bg-green-50 text-green-600' : 'border-rellia-teal/10'}`}>
                        {done && !active ? '✓' : i + 1}
                      </div>
                      <span className={`truncate font-medium ${active ? 'text-white' : ''}`}>{s.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="my-4 h-px bg-rellia-teal/5" />

              <button 
                onClick={goToSubmit}
                disabled={answeredGlobal < totalQs * 0.5}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${view === 'submit' ? 'bg-rellia-teal text-white shadow-md' : 'text-rellia-teal/50 hover:bg-rellia-teal/5 hover:text-rellia-teal'} disabled:opacity-40`}
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${view === 'submit' ? 'border-white/30 bg-white/10' : 'border-rellia-teal/10'}`}>
                  ✓
                </div>
                <span className="font-medium">Review & Submit</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── MOBILE OVERLAY MENU ── */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
            <div className="flex items-center justify-between border-b border-rellia-teal/10 p-4">
              <span className="font-host-grotesk font-bold">Assessment Navigation</span>
              <button onClick={() => setMobileMenuOpen(false)} className="rounded-full p-2 hover:bg-rellia-teal/5">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Similar nav as desktop sidebar but adjusted for mobile touch */}
              <nav className="space-y-2">
                <button 
                  onClick={goToIntro}
                  className={`flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${view === 'intro' ? 'bg-rellia-teal text-white' : 'bg-rellia-teal/5'}`}
                >
                  <span className="font-semibold">Introduction</span>
                </button>
                
                <div className="py-2 text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40">Sections</div>
                
                <div className="grid grid-cols-1 gap-2">
                  {SECTIONS.map((s, i) => {
                    const done = answers[s.id] && Object.keys(answers[s.id]).length === s.questions.length;
                    const active = view === 'survey' && i === currentSection;
                    return (
                      <button 
                        key={s.id} 
                        onClick={() => goToSection(i)}
                        className={`flex items-center gap-4 rounded-xl p-4 text-left transition-all ${active ? 'bg-rellia-teal text-white shadow-lg' : 'bg-white border border-rellia-teal/10'}`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-white/20' : done ? 'bg-green-100 text-green-700' : 'bg-rellia-teal/5'}`}>
                          {done && !active ? '✓' : i + 1}
                        </div>
                        <span className="font-medium">{s.title}</span>
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={goToSubmit}
                  className={`mt-4 flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${view === 'submit' ? 'bg-rellia-teal text-white' : 'bg-rellia-teal/5'}`}
                >
                  <span className="font-semibold">Review & Submit</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT AREA ── */}
        <main className="flex-1 overflow-hidden">
          
          {/* MOBILE SUB-HEADER (Sticky Progress) */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-rellia-teal/10 bg-rellia-cream/80 px-4 py-3 backdrop-blur-md lg:hidden">
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-rellia-teal/60">
                <span>{view === 'survey' ? `Section ${currentSection + 1}` : view.toUpperCase()}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-rellia-teal/10">
                <div 
                  className="h-full bg-rellia-teal transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-rellia-teal text-white shadow-md active:scale-95"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-auto flex h-full max-w-5xl flex-col px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
            
            {/* ── INTRO VIEW ── */}
            {view === 'intro' && (
              <div className="animate-ds-up flex flex-col gap-10">
                <div className="space-y-6">
                  <NetworkEyebrow label="Startup Diagnostic" tone="onLight" />
                  <h1 className="font-host-grotesk text-4xl font-bold leading-[1.1] tracking-tight text-rellia-teal md:text-6xl">
                    How ready is your startup, <span className="italic">really?</span>
                  </h1>
                  <p className="font-urbanist text-lg leading-relaxed text-rellia-teal/70 md:text-xl">
                    Answer honestly across 13 domains—from regulatory and clinical to go-to-market and operations. Takes about 15 minutes. No right or wrong answers, just an accurate picture of where you are today.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border border-rellia-teal/10 bg-white p-8 shadow-sm">
                    <h3 className="mb-10 text-xs font-bold uppercase tracking-widest text-rellia-teal">How it works</h3>
                    <HowItWorksTimeline items={[
                      { t:'Tell us about your startup', d:'So your results are in context' },
                      { t:'Work through 13 sections', d:'At your own pace' },
                      { t:'Submit to get your report', d:'Scores, gaps, and recommendations' },
                      { t:'Members get mentor matching', d:'Based on your priority gaps' },
                    ]} />
                  </div>

                  <div className="rounded-3xl border border-rellia-teal/10 bg-white p-8 shadow-sm flex flex-col">
                    <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-rellia-teal">About your startup</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-rellia-teal/50">Your Name</label>
                          <input 
                            className="w-full rounded-xl border border-rellia-teal/10 bg-rellia-cream/30 p-3 text-sm focus:border-rellia-teal focus:bg-white focus:outline-none" 
                            placeholder="First name" 
                            value={memberInfo.name} 
                            onChange={e => setMemberInfo(p => ({...p, name: e.target.value}))} 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-rellia-teal/50">Company</label>
                          <input 
                            className="w-full rounded-xl border border-rellia-teal/10 bg-rellia-cream/30 p-3 text-sm focus:border-rellia-teal focus:bg-white focus:outline-none" 
                            placeholder="Company name" 
                            value={memberInfo.company} 
                            onChange={e => setMemberInfo(p => ({...p, company: e.target.value}))} 
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-rellia-teal/50">Email</label>
                        <input 
                          className="w-full rounded-xl border border-rellia-teal/10 bg-rellia-cream/30 p-3 text-sm focus:border-rellia-teal focus:bg-white focus:outline-none" 
                          type="email" 
                          placeholder="founder@company.com" 
                          value={memberInfo.email} 
                          onChange={e => setMemberInfo(p => ({...p, email: e.target.value}))} 
                        />
                      </div>
                    </div>

                    <RelliaAction 
                      asChild
                      variant="mintTealFill" 
                      size="comfortable" 
                      className="w-full justify-center shadow-lg transition-transform active:scale-[0.98] py-4 mt-auto"
                    >
                      <button onClick={startSurvey}>
                        Begin Assessment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </RelliaAction>
                  </div>
                </div>
              </div>
            )}

            {/* ── SURVEY VIEW ── */}
            {view === 'survey' && sec && currentQ && (
              <div key={`${currentSection}-${currentQIdx}`} className="animate-ds-up flex flex-col gap-8 md:gap-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rellia-teal text-white text-xl">
                      {sec.icon}
                    </span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-rellia-teal/40">Section {currentSection + 1}</div>
                      <h2 className="font-host-grotesk text-2xl font-bold text-rellia-teal md:text-3xl">{sec.title}</h2>
                    </div>
                  </div>
                  <p className="text-rellia-teal/60">{sec.desc}</p>
                </div>

                <div className="rounded-[32px] border border-rellia-teal/5 bg-white p-8 shadow-xl md:p-12">
                  <div className="mb-6 inline-flex rounded-lg bg-rellia-teal/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rellia-teal/60">
                    {TYPE_LABELS[currentQ.type]}
                  </div>
                  <h3 className="mb-10 font-host-grotesk text-xl font-semibold leading-relaxed text-rellia-teal md:text-2xl">
                    {currentQ.text}
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {currentQ.options.map((opt, oi) => (
                      <button 
                        key={oi} 
                        onClick={() => selectAnswer(oi)}
                        disabled={transitioning}
                        className={`group relative flex flex-col items-start gap-4 rounded-2xl border-2 p-6 text-left transition-all duration-300 ${selectedOpt === oi ? 'border-rellia-teal bg-rellia-teal text-white shadow-xl ring-4 ring-rellia-teal/10' : 'border-rellia-teal/5 bg-rellia-cream/20 hover:border-rellia-teal/20 hover:bg-white hover:shadow-md'}`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold transition-colors ${selectedOpt === oi ? 'bg-white/20 text-white' : 'bg-rellia-teal/5 text-rellia-teal/40 group-hover:bg-rellia-teal/10 group-hover:text-rellia-teal'}`}>
                          {selectedOpt === oi ? <CheckCircle2 className="h-6 w-6" /> : String.fromCharCode(65 + oi)}
                        </div>
                        <div className="space-y-1">
                          <div className={`font-bold leading-tight ${selectedOpt === oi ? 'text-white' : 'text-rellia-teal'}`}>
                            {opt.label}
                          </div>
                          {opt.desc && (
                            <div className={`text-xs leading-relaxed ${selectedOpt === oi ? 'text-white/70' : 'text-rellia-teal/50'}`}>
                              {opt.desc}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button 
                    onClick={() => {
                      if (currentQIdx > 0) setCurrentQIdx(i => i - 1);
                      else if (currentSection > 0) { setCurrentSection(i => i - 1); setCurrentQIdx(SECTIONS[currentSection - 1].questions.length - 1); }
                      else goToIntro();
                    }}
                    className="flex h-12 items-center gap-2 rounded-full px-6 font-semibold text-rellia-teal/50 transition-all hover:bg-rellia-teal/5 hover:text-rellia-teal"
                  >
                    ← Back
                  </button>
                  <div className="hidden text-xs font-bold uppercase tracking-widest text-rellia-teal/30 md:block">
                    {answeredGlobal} / {totalQs} answered
                  </div>
                  <button 
                    onClick={() => {
                      if (currentQIdx < sec.questions.length - 1) setCurrentQIdx(i => i + 1);
                      else if (currentSection < SECTIONS.length - 1) goToSection(currentSection + 1);
                      else goToSubmit();
                    }}
                    className="flex h-12 items-center gap-2 rounded-full bg-rellia-teal px-8 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    {currentSection === SECTIONS.length - 1 && currentQIdx === sec.questions.length - 1 ? 'Finish →' : 'Skip →'}
                  </button>
                </div>
              </div>
            )}

            {/* ── SUBMIT VIEW ── */}
            {view === 'submit' && (
              <div className="animate-ds-up flex flex-col gap-10">
                <div className="space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40">Review your assessment</div>
                  <h2 className="font-host-grotesk text-3xl font-bold text-rellia-teal md:text-5xl">Ready to see your report?</h2>
                  <p className="max-w-xl text-rellia-teal/60">Your diagnostic is complete. Submit below to generate your personalized gap analysis and recommendations.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[32px] border border-rellia-teal/10 bg-white p-8 shadow-sm">
                    <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-rellia-teal/40">Current Scores</h3>
                    <div className="space-y-2">
                      {SECTIONS.map(s => {
                        const sc = getSectionScore(s.id, answers);
                        return (
                          <div key={s.id} className="flex items-center justify-between rounded-xl bg-rellia-cream/20 px-4 py-3 text-sm">
                            <span className="font-medium text-rellia-teal/80">{s.title}</span>
                            <span className={`font-bold ${sc === null ? 'text-rellia-teal/20' : scoreClass(sc)}`}>
                              {sc !== null ? `${sc}%` : '—'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="rounded-[32px] border border-rellia-teal/10 bg-rellia-mint/10 p-8">
                      <h3 className="mb-4 font-host-grotesk text-xl font-bold">What's in the report?</h3>
                      <ul className="space-y-3 text-sm text-rellia-teal/70">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 shrink-0 text-rellia-teal" />
                          <span>Detailed scores across all 13 sections</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 shrink-0 text-rellia-teal" />
                          <span>Identification of your top 3 priority gaps</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 shrink-0 text-rellia-teal" />
                          <span>5 specific recommendations to tackle first</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 shrink-0 text-rellia-teal" />
                          <span>Mentor matching for Rellia members</span>
                        </li>
                      </ul>
                    </div>
                    <RelliaAction 
                      asChild
                      variant="mintTealFill" 
                      size="comfortable" 
                      className="w-full justify-center shadow-xl transition-all hover:scale-[1.02] active:scale-95 py-7 text-xl"
                    >
                      <button onClick={submitSurvey}>
                        Generate My Report
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </RelliaAction>
                    <p className="text-center text-[10px] text-rellia-teal/40">
                      Your results are private. Members will be prompted to verify their membership to unlock mentor matching.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── PROCESSING VIEW ── */}
            {view === 'processing' && (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="animate-ds-spin mb-10 h-16 w-16 rounded-full border-4 border-rellia-teal/10 border-t-rellia-teal" />
                <h2 className="mb-4 font-host-grotesk text-3xl font-bold">Analysing your results</h2>
                <p className="mb-12 max-w-md text-rellia-teal/60">Reviewing your diagnostic across all 13 sections and building your personalised report.</p>
                
                <div className="w-full max-w-xs space-y-4">
                  {['Analysing section scores', 'Identifying strengths and gaps', 'Generating recommendations'].map((label, i) => (
                    <div key={i} className="flex items-center gap-4 text-left transition-all duration-500">
                      <div className={`h-2.5 w-2.5 rounded-full ${i < procStep ? 'bg-green-500' : i === procStep ? 'bg-rellia-teal animate-pulse' : 'bg-rellia-teal/10'}`} />
                      <span className={`text-sm font-medium ${i <= procStep ? 'text-rellia-teal' : 'text-rellia-teal/20'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── REPORT VIEW ── */}
            {view === 'report' && diagResult && (
              <div className="animate-ds-up flex flex-col gap-12 pb-20">
                
                {missingHubSpot && (
                  <div className="rounded-3xl border-2 border-dashed border-amber-500/30 bg-amber-50 p-8 text-center">
                    <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
                    <h3 className="mb-2 font-bold text-amber-800">Admin Mode: Unconfigured Forms</h3>
                    <p className="text-sm text-amber-700/70">Set VITE_HUBSPOT_PORTAL_ID and VITE_HUBSPOT_FORM_GUID to enable data persistence. Your results are currently only stored in this session.</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40">Diagnostic Report</div>
                      <h1 className="font-host-grotesk text-4xl font-bold text-rellia-teal md:text-5xl">{memberInfo.company || 'Your Startup'}</h1>
                    </div>
                    <div className="text-sm font-medium text-rellia-teal/40">
                      {memberInfo.stage} · {new Date().toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' })}
                    </div>
                  </div>
                  <div className="rounded-[32px] border border-rellia-teal/5 bg-white p-8 shadow-sm md:p-10">
                    <p className="font-urbanist text-xl leading-relaxed text-rellia-teal/80 md:text-2xl">
                      {diagResult.summary}
                    </p>
                  </div>
                </div>

                <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-rellia-teal/40">Section Analysis</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[...SECTIONS].sort((a,b) => (getSectionScore(b.id, answers) ?? 0) - (getSectionScore(a.id, answers) ?? 0)).map(s => {
                          const sc = getSectionScore(s.id, answers) ?? 0;
                          return (
                            <div key={s.id} className="group rounded-2xl border border-rellia-teal/5 bg-white p-5 shadow-sm transition-all hover:border-rellia-teal/10 hover:shadow-md">
                              <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs font-bold text-rellia-teal/80">{s.title}</span>
                                <span className={`text-sm font-black ${scoreClass(sc)}`}>{sc}%</span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-rellia-teal/5">
                                <div 
                                  className={`h-full transition-all duration-1000 ${scoreBarClass(sc)}`} 
                                  style={{ width: `${sc}%` }} 
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-rellia-teal/40">Priority Gaps</h3>
                      <div className="space-y-4">
                        {diagResult.gaps.map((g, i) => (
                          <div key={i} className="relative overflow-hidden rounded-3xl border border-rellia-teal/5 bg-white p-8 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                              <h4 className="font-bold text-rellia-teal">{g.category}</h4>
                              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${g.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                {g.priority}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed text-rellia-teal/70">{g.note}</p>
                            {DATA_MAP[SECTIONS.find(s => s.title === g.category)?.id ?? '']?.mentor && (
                              <div className="mt-6 flex items-center gap-2 border-t border-rellia-teal/5 pt-4 text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40">
                                Suggested Mentor: <span className="text-rellia-teal">{DATA_MAP[SECTIONS.find(s => s.title === g.category)!.id].mentor}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-rellia-teal/40">Next Steps</h3>
                      <div className="space-y-4">
                        {diagResult.recommendations.map((r, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rellia-teal text-white text-[10px] font-bold">
                              {i + 1}
                            </div>
                            <p className="text-sm font-medium leading-snug text-rellia-teal/80">{r}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[32px] bg-rellia-teal p-8 text-white shadow-2xl">
                      <h3 className="mb-4 font-host-grotesk text-xl font-bold leading-tight">Unlock your mentor matches</h3>
                      <p className="mb-8 text-sm leading-relaxed text-white/70">
                        Based on your results, we've identified areas where a Rellia mentor can make the biggest difference.
                      </p>
                      <RelliaAction 
                        asChild
                        variant="mintTealFill" 
                        size="comfortable" 
                        className="w-full justify-center transition-transform active:scale-95"
                      >
                        <Link to="/apply">
                          Join Rellia Health
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </RelliaAction>
                    </div>

                    <div className="text-center">
                      <button 
                        onClick={() => window.print()}
                        className="text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40 hover:text-rellia-teal"
                      >
                        Download as PDF
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-20 flex flex-col items-center justify-center gap-6 border-t border-rellia-teal/10 pt-20 text-center">
                  <div className="text-sm text-rellia-teal/40">Questions about your report?</div>
                  <a href="mailto:hello@relliahealth.com" className="font-bold text-rellia-teal hover:underline">hello@relliahealth.com</a>
                  <button 
                    onClick={() => { setView('intro'); setAnswers({}); setCurrentSection(0); setCurrentQIdx(0); setDiagResult(null); }}
                    className="mt-4 rounded-full border border-rellia-teal/20 px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all hover:bg-rellia-teal/5"
                  >
                    ← Start a new assessment
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── VIEW TYPE ────────────────────────────────────────────────────────────────

type View = 'intro' | 'survey' | 'submit' | 'processing' | 'report';

// ─── LOGO ────────────────────────────────────────────────────────────────────

const LogoMark: React.FC = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10">
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M9 1.5C9 1.5 5.5 4.5 5.5 8.5C5.5 10.5 7.1 12 9 12C10.9 12 12.5 10.5 12.5 8.5C12.5 4.5 9 1.5 9 1.5Z" fill="white" opacity="0.9"/>
      <path d="M5.5 10.5C3.5 11.5 2.5 13.5 3.5 15C4.5 16.5 7 16.5 9 15.5C11 16.5 13.5 16.5 14.5 15C15.5 13.5 14.5 11.5 12.5 10.5" stroke="white" strokeWidth="1.1" fill="none" opacity="0.65"/>
    </svg>
  </div>
);
