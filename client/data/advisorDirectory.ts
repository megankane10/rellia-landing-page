export type AdvisorDirectoryFilter = "Clinical" | "Regulatory" | "GTM" | "Technical"

export type AdvisorDirectoryEntry = {
  id: string
  name: string
  organization: string
  /** Optional logo path under public/ — omit to show initials */
  logoSrc?: string
  role: string
  industries: string[]
  focus: string
  filter: AdvisorDirectoryFilter
  linkedInUrl?: string
}

export const ADVISOR_DIRECTORY_SEED: AdvisorDirectoryEntry[] = [
  {
    id: "a1",
    name: "Dr. Elena Ruiz",
    organization: "Harbor Clinical Collective",
    role: "Former Chief Medical Officer, health system",
    industries: ["Clinical ops", "Digital health"],
    focus: "Care pathway design, clinician adoption, and evidence planning for early deployments.",
    filter: "Clinical",
  },
  {
    id: "a2",
    name: "Jordan Blake",
    organization: "Northline Regulatory Partners",
    role: "Regulatory & quality advisor",
    industries: ["MedTech", "SaMD"],
    focus: "FDA strategy, QMS readiness, and design controls without slowing product iteration.",
    filter: "Regulatory",
  },
  {
    id: "a3",
    name: "Priya Nair",
    organization: "Relay GTM Advisory",
    role: "GTM & partnerships operator",
    industries: ["B2B", "Payers"],
    focus: "Enterprise sales motion, pilot contracting, and procurement navigation.",
    filter: "GTM",
  },
  {
    id: "a4",
    name: "Dr. Henry Moss",
    organization: "Atlas Outcomes Institute",
    role: "Academic PI, outcomes research",
    industries: ["Clinical evidence", "Diagnostics"],
    focus: "Study design, endpoints, and publication strategy aligned to buyer questions.",
    filter: "Clinical",
  },
  {
    id: "a5",
    name: "Alex Rivera",
    organization: "Clearwave Interop Labs",
    role: "Product & interoperability lead",
    industries: ["Digital health", "Infrastructure"],
    focus: "EHR integration patterns, security reviews, and scalable data contracts.",
    filter: "Technical",
  },
  {
    id: "a6",
    name: "Sam Okonkwo",
    organization: "Meridian Venture Fellows",
    role: "Finance & venture advisor",
    industries: ["Fundraising", "MedTech"],
    focus: "Modeling, diligence prep, and milestone planning for seed–Series A.",
    filter: "GTM",
  },
  {
    id: "a7",
    name: "Dr. Mei Tan",
    organization: "Vantage Care Delivery",
    role: "VP Clinical Transformation",
    industries: ["Care delivery", "Operations"],
    focus: "Implementation science and adoption metrics for ward-level workflows.",
    filter: "Clinical",
  },
  {
    id: "a8",
    name: "Chris Dalton",
    organization: "Ironwood Compliance",
    role: "Privacy & security counsel",
    industries: ["HIPAA", "SOC 2"],
    focus: "Threat modeling for PHI pipelines and vendor diligence questionnaires.",
    filter: "Technical",
  },
]

export const ADVISOR_FILTER_OPTIONS: Array<{ id: "all" | AdvisorDirectoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "Clinical", label: "Clinical" },
  { id: "Regulatory", label: "Regulatory" },
  { id: "GTM", label: "GTM" },
  { id: "Technical", label: "Technical" },
]
