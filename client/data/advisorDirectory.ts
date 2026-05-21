export type AdvisorDirectoryFilter =
  | "Product Design & UI/UX"
  | "Product Development"
  | "Clinical Evidence"
  | "Regulatory Strategy"
  | "Legal & Privacy"
  | "IP Strategy"
  | "Reimbursement"
  | "Fundraising"
  | "Marketing & Branding"
  | "Go-To-Market"
  | "Health System Navigation"
  | "Operations & Scaling"

/** Professional headshots (Unsplash) — illustrative directory placeholders */
const P = {
  p1: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop",
  p2: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80&auto=format&fit=crop",
  p3: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80&auto=format&fit=crop",
  p4: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&auto=format&fit=crop",
  p5: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80&auto=format&fit=crop",
  p6: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
  p7: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80&auto=format&fit=crop",
  p8: "https://images.unsplash.com/photo-1519345182560-a3d909bfe71b?w=800&q=80&auto=format&fit=crop",
} as const

export type AdvisorDirectoryEntry = {
  id: string
  name: string
  organization: string
  role: string
  location: string
  country: string | string[]
  yearJoined: string
  industries: string[]
  /** Short card summary */
  focus: string
  filter: AdvisorDirectoryFilter
  /** Portrait photo for cards and profile */
  photoSrc: string
  linkedInUrl: string
  /** Personal or org site */
  websiteUrl?: string
  /** Rich modal copy */
  bio: string
  mentoringStyle: string
  highlights: string[]
}

export const ADVISOR_DIRECTORY_SEED: AdvisorDirectoryEntry[] = [
  {
    id: "elena-ruiz",
    name: "Dr. Elena Ruiz",
    organization: "Harbor Clinical Collective",
    role: "Former Chief Medical Officer, health system",
    location: "Boston, MA",
    country: "United States",
    yearJoined: "2024",
    industries: ["Clinical ops", "Digital health"],
    focus: "Care pathway design, clinician adoption, and evidence planning for early deployments.",
    filter: "Health System Navigation",
    photoSrc: P.p1,
    linkedInUrl: "https://www.linkedin.com/in/example-elena-ruiz",
    websiteUrl: "https://www.harborclinical.example",
    bio: "Elena spent fifteen years inside a multi-hospital network leading digital transformation and clinical standardization. She has overseen EHR rollouts, specialty referral redesign, and governance for innovation pilots—always with an eye on adoption metrics nursing stations actually use.",
    mentoringStyle:
      "Prefers structured office hours and async document review. Expect direct feedback on workflow diagrams, pilot protocols, and how you’ll measure utilization without embarrassing clinical champions.",
    highlights: [
      "Designed enterprise-wide documentation templates adopted across twelve hospitals",
      "Led IRB-aligned feasibility studies for SaMD in perioperative pathways",
      "Built escalation paths when vendor timelines slipped—without burning goodwill in IT",
    ],
  },
  {
    id: "jordan-blake",
    name: "Jordan Blake",
    organization: "Northline Regulatory Partners",
    role: "Regulatory & quality advisor",
    location: "New York, NY",
    country: "United States",
    yearJoined: "2024",
    industries: ["MedTech", "SaMD"],
    focus: "FDA strategy, QMS readiness, and design controls without slowing product iteration.",
    filter: "Regulatory Strategy",
    photoSrc: P.p2,
    linkedInUrl: "https://www.linkedin.com/in/example-jordan-blake",
    websiteUrl: "https://www.northlinereg.example",
    bio: "Jordan blends former FDA-facing consulting with hands-on QMS builds for venture-backed device and SaMD teams. They’ve taken multiple Class II submissions from DHF gaps to clean audits—and know when to challenge scope creep that delays filing.",
    mentoringStyle:
      "Works best with artifact-heavy teams: risk files, trace matrices, and labeling drafts. Will push you to narrow indication scope early so verification stays proportional.",
    highlights: [
      "Zero observations on last three QSIT-style readiness audits clients ran",
      "Mapped predicate strategies for combination products touching digital + hardware",
      "Coaches founders on consultant overload—when to hire RA vs build muscle internally",
    ],
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    organization: "Relay GTM Advisory",
    role: "GTM & partnerships operator",
    location: "San Francisco, CA",
    country: "United States",
    yearJoined: "2025",
    industries: ["B2B", "Payers"],
    focus: "Enterprise sales motion, pilot contracting, and procurement navigation.",
    filter: "Go-To-Market",
    photoSrc: P.p3,
    linkedInUrl: "https://www.linkedin.com/in/example-priya-nair",
    websiteUrl: "https://www.relaygtm.example",
    bio: "Priya carried quota in enterprise health SaaS before advising founders on repeatable outbound and partner-led pipelines. She maps buyer committees, security review choreography, and pilot pricing so procurement doesn’t stall your roadmap.",
    mentoringStyle:
      "Expect workshop-style sessions with role-play on discovery calls and mutual close plans. Shares anonymized templates from complex payer RFP cycles.",
    highlights: [
      "Closed eight-figure multi-year agreements across IDNs and specialty networks",
      "Built partner ecosystems with three major EHR marketplaces",
      "Negotiated pilot→enterprise ramps that survived CFO scrutiny",
    ],
  },
  {
    id: "henry-moss",
    name: "Dr. Henry Moss",
    organization: "Atlas Outcomes Institute",
    role: "Academic PI, outcomes research",
    location: "Chicago, IL",
    country: "United States",
    yearJoined: "2024",
    industries: ["Clinical evidence", "Diagnostics"],
    focus: "Study design, endpoints, and publication strategy aligned to buyer questions.",
    filter: "Clinical Evidence",
    photoSrc: P.p4,
    linkedInUrl: "https://www.linkedin.com/in/example-henry-moss",
    websiteUrl: "https://www.atlasoutcomes.example",
    bio: "Henry runs an outcomes lab collaborating with health systems on pragmatic trials and real-world evidence programs. He translates statistical rigor into milestones founders can explain to clinical buyers and payers without overstating certainty.",
    mentoringStyle:
      "Reviews protocols and manuscript framing; connects teams with academic sites when thesis aligns. Keeps founders honest on feasibility vs splashy endpoints.",
    highlights: [
      "Principal investigator on NIH-adjacent studies spanning diagnostics and digital therapeutics",
      "Editorial board experience across two clinical specialty journals",
      "Designs interim analyses so boards see credible signals before Series B narratives harden",
    ],
  },
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    organization: "Clearwave Interop Labs",
    role: "Product & interoperability lead",
    location: "Austin, TX",
    country: "United States",
    yearJoined: "2024",
    industries: ["Digital health", "Infrastructure"],
    focus: "EHR integration patterns, security reviews, and scalable data contracts.",
    filter: "Product Development",
    photoSrc: P.p5,
    linkedInUrl: "https://www.linkedin.com/in/example-alex-rivera",
    websiteUrl: "https://www.clearwaveinterop.example",
    bio: "Alex led integration platforms consumed by dozens of provider clients—FHIR-first where possible, HL7 v2 where reality demands. They pressure-test architecture diagrams, OAuth scopes, and audit logging before your largest customer’s security team does.",
    mentoringStyle:
      "Hands-on architecture reviews with annotated diagrams; surfaces vendor-specific quirks early. Prefers weekly async threads plus one deep session per milestone.",
    highlights: [
      "Shipped SMART-on-FHIR apps used across Epic and Cerner footprints",
      "Built reusable consent flows aligned to HIPAA minimum-necessary interpretations teams could defend",
      "Reduced integration timelines by standardizing sandbox fixtures and test patients",
    ],
  },
  {
    id: "sam-okonkwo",
    name: "Sam Okonkwo",
    organization: "Meridian Venture Fellows",
    role: "Finance & venture advisor",
    location: "Toronto, ON",
    country: "Canada",
    yearJoined: "2025",
    industries: ["Fundraising", "MedTech"],
    focus: "Modeling, diligence prep, and milestone planning for seed–Series A.",
    filter: "Fundraising",
    photoSrc: P.p6,
    linkedInUrl: "https://www.linkedin.com/in/example-sam-okonkwo",
    websiteUrl: "https://www.meridianvf.example",
    bio: "Sam bridges institutional diligence norms with founder-friendly projections. Former buyside analyst turned fractional CFO for medtech startups navigating bridge rounds, bridge-to-Series A metrics, and board-ready variance explanations.",
    mentoringStyle:
      "Walks through model assumptions line-by-line; challenges vanity charts early. Shares anonymized cap table scenarios when governance questions arise.",
    highlights: [
      "Supported twelve seed/Series A processes across diagnostics and digital therapeutics",
      "Built recurring diligence rooms investors praised for clarity under time pressure",
      "Aligns milestone definitions between founders and lead angels before term sheets land",
    ],
  },
  {
    id: "mei-tan",
    name: "Dr. Mei Tan",
    organization: "Vantage Care Delivery",
    role: "VP Clinical Transformation",
    location: "Seattle, WA",
    country: "United States",
    yearJoined: "2024",
    industries: ["Care delivery", "Operations"],
    focus: "Implementation science and adoption metrics for ward-level workflows.",
    filter: "Health System Navigation",
    photoSrc: P.p7,
    linkedInUrl: "https://www.linkedin.com/in/example-mei-tan",
    websiteUrl: "https://www.vantagecare.example",
    bio: "Mei operationalized transformation programs touching nursing ratios, pharmacy reconciliation, and patient throughput across urban networks. She connects operational KPIs to frontline incentives—where many digital pilots quietly fail.",
    mentoringStyle:
      "Uses structured adoption scorecards and shadowing plans. Expect homework: interviews with charge nurses and realistic training calendars.",
    highlights: [
      "Cut unnecessary clicks from nursing workflows adopted across forty units",
      "Partnered with unions on change management without slowing vendor timelines",
      "Published internally on variation reduction metrics executives actually track weekly",
    ],
  },
  {
    id: "chris-dalton",
    name: "Chris Dalton",
    organization: "Ironwood Compliance",
    role: "Privacy & security counsel",
    location: "London",
    country: "United Kingdom",
    yearJoined: "2025",
    industries: ["HIPAA", "SOC 2"],
    focus: "Threat modeling for PHI pipelines and vendor diligence questionnaires.",
    filter: "Legal & Privacy",
    photoSrc: P.p8,
    linkedInUrl: "https://www.linkedin.com/in/example-chris-dalton",
    websiteUrl: "https://www.ironwoodcompliance.example",
    bio: "Chris advises growth-stage health tech on pragmatic privacy programs—BAAs that hold up, DPIAs teams finish, and SOC 2 controls mapped to actual architecture—not checkbox theater.",
    mentoringStyle:
      "Redlines vendor questionnaires with commentary founders can reuse; runs tabletop exercises for breach workflows before prospects ask uncomfortable questions.",
    highlights: [
      "SOC 2 Type II programs across Series A–C infrastructure vendors",
      "Negotiated data-processing terms with hyperscaler marketplaces under aggressive timelines",
      "Translates OCR guidance into engineering tickets teams can estimate",
    ],
  },
]

export const ADVISOR_FILTER_OPTIONS: Array<{ id: "all" | AdvisorDirectoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "Product Design & UI/UX", label: "Product Design & UI/UX" },
  { id: "Product Development", label: "Product Development" },
  { id: "Clinical Evidence", label: "Clinical Evidence" },
  { id: "Regulatory Strategy", label: "Regulatory Strategy" },
  { id: "Legal & Privacy", label: "Legal & Privacy" },
  { id: "IP Strategy", label: "IP Strategy" },
  { id: "Reimbursement", label: "Reimbursement" },
  { id: "Fundraising", label: "Fundraising" },
  { id: "Marketing & Branding", label: "Marketing & Branding" },
  { id: "Go-To-Market", label: "Go-To-Market" },
  { id: "Health System Navigation", label: "Health System Navigation" },
  { id: "Operations & Scaling", label: "Operations & Scaling" },
]
