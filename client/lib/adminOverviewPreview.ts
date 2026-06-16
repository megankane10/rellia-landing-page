import type { SubmissionStatus } from "@/lib/adminSubmissionStatus"
import type { CompanyProfileRow, ContactRow } from "@/lib/adminSubmissions"

const daysAgoIso = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export const OVERVIEW_PREVIEW_KPI = {
  webForms: 24,
  surveys: 7,
  drafts: 0,
} as const

/** Mixed inbox activity for the header notification pill in preview mode */
export const OVERVIEW_PREVIEW_TODAY_SNAPSHOT = {
  contacts: 2,
  diagnostics: 1,
  total: 3,
} as const

export const OVERVIEW_PREVIEW_STATUS_BREAKDOWN: { status: SubmissionStatus; count: number }[] = [
  { status: "New", count: 14 },
  { status: "In Progress", count: 9 },
  { status: "Resolved", count: 52 },
]

export const OVERVIEW_PREVIEW_STAGE_ROWS = [
  { name: "Idea", value: 9 },
  { name: "Early traction", value: 14 },
  { name: "Growth", value: 11 },
  { name: "Scale", value: 6 },
] as const

const previewDiagnosticStatuses: SubmissionStatus[] = ["New", "In Progress", "Resolved"]

export const OVERVIEW_PREVIEW_ALL_DIAGNOSTICS: CompanyProfileRow[] = OVERVIEW_PREVIEW_STAGE_ROWS.flatMap(
  (row, rowIndex) =>
    Array.from({ length: row.value }, (_, itemIndex) => ({
      id: `preview-all-diagnostic-${rowIndex}-${itemIndex}`,
      created_at: daysAgoIso(itemIndex % 7),
      name: "Preview Applicant",
      work_email: `preview-${rowIndex}-${itemIndex}@example.com`,
      company_name: "Preview Co",
      stage: row.name,
      description: null,
      status: previewDiagnosticStatuses[itemIndex % previewDiagnosticStatuses.length],
    })),
)

export const OVERVIEW_PREVIEW_STAGE_NAMES = OVERVIEW_PREVIEW_STAGE_ROWS.map((row) => row.name)

export const OVERVIEW_PREVIEW_STRENGTHS = [
  { name: "Product-market fit", value: 18 },
  { name: "Team & leadership", value: 15 },
  { name: "Customer discovery", value: 12 },
  { name: "Go-to-market", value: 10 },
  { name: "Financial planning", value: 8 },
  { name: "Operations", value: 6 },
] as const

export const OVERVIEW_PREVIEW_WEAKNESSES = [
  { name: "Fundraising readiness", value: 16 },
  { name: "Sales pipeline", value: 14 },
  { name: "Hiring & culture", value: 11 },
  { name: "Legal & compliance", value: 9 },
  { name: "Data & analytics", value: 7 },
  { name: "Partnerships", value: 5 },
] as const

export const OVERVIEW_PREVIEW_RECENT_CONTACTS: ContactRow[] = [
  {
    id: "preview-contact-1",
    created_at: daysAgoIso(0),
    first_name: "Amara",
    last_name: "Okafor",
    email: "amara@northwindlabs.io",
    company: "Northwind Labs",
    job_title: "Founder",
    message: "Interested in the accelerator program.",
    status: "New",
    submission_type: "general",
  },
  {
    id: "preview-contact-2",
    created_at: daysAgoIso(1),
    first_name: "James",
    last_name: "Chen",
    email: "james@brightpath.co",
    company: "Brightpath",
    job_title: "COO",
    message: "Partnership inquiry.",
    status: "In Progress",
    submission_type: "partnership",
  },
  {
    id: "preview-contact-3",
    created_at: daysAgoIso(2),
    first_name: "Sofia",
    last_name: "Martinez",
    email: "sofia@helix.ai",
    company: "Helix AI",
    job_title: "CEO",
    message: "Media request.",
    status: "New",
    submission_type: "media",
  },
  {
    id: "preview-contact-4",
    created_at: daysAgoIso(3),
    first_name: "Noah",
    last_name: "Patel",
    email: "noah@loomstack.dev",
    company: "Loomstack",
    job_title: "Head of Product",
    message: "Demo follow-up.",
    status: "In Progress",
    submission_type: "general",
  },
  {
    id: "preview-contact-5",
    created_at: daysAgoIso(4),
    first_name: "Elena",
    last_name: "Rossi",
    email: "elena@verdant.bio",
    company: "Verdant Bio",
    job_title: "Founder",
    message: "Program question.",
    status: "Resolved",
    submission_type: "general",
  },
]

export const OVERVIEW_PREVIEW_RECENT_DIAGNOSTICS: CompanyProfileRow[] = [
  {
    id: "preview-diagnostic-1",
    created_at: daysAgoIso(0),
    name: "Maya Thompson",
    work_email: "maya@atlasrobotics.com",
    company_name: "Atlas Robotics",
    stage: "Growth",
    description: null,
    status: "New",
  },
  {
    id: "preview-diagnostic-2",
    created_at: daysAgoIso(1),
    name: "Daniel Kim",
    work_email: "daniel@stripeforge.io",
    company_name: "Stripeforge",
    stage: "Early traction",
    description: null,
    status: "In Progress",
  },
  {
    id: "preview-diagnostic-3",
    created_at: daysAgoIso(2),
    name: "Priya Nair",
    work_email: "priya@greenloop.earth",
    company_name: "Greenloop",
    stage: "Idea",
    description: null,
    status: "New",
  },
  {
    id: "preview-diagnostic-4",
    created_at: daysAgoIso(3),
    name: "Oliver Wright",
    work_email: "oliver@cloudharbor.dev",
    company_name: "Cloud Harbor",
    stage: "Scale",
    description: null,
    status: "In Progress",
  },
  {
    id: "preview-diagnostic-5",
    created_at: daysAgoIso(5),
    name: "Hannah Lee",
    work_email: "hannah@pulsehealth.app",
    company_name: "Pulse Health",
    stage: "Growth",
    description: null,
    status: "Resolved",
  },
]
