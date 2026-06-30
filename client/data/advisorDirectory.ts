export type AdvisorDirectoryFilter =
  | "Regulatory & Quality"
  | "Marketing"
  | "Healthcare Systems"

/** Diagnostic survey mentor mapping — broader than public directory expertise filters. */
export type DiagnosticAdvisorSpecialty =
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

export type AdvisorDirectoryEntry = {
  id: string
  name: string
  organization: string
  role: string
  location?: string
  countries: string[]
  yearJoined: string
  expertiseTags: string[]
  industries?: string[]
  directoryFilters?: Array<{ groupId?: string; values?: string[]; groupTitle?: string }>
  /** Short card summary (directory card + profile snapshot) */
  focus: string
  snapshot?: string
  /** Portrait photo for cards and profile */
  photoSrc: string
  socialLinks?: Array<{ platform?: string; label?: string; url?: string }>
  email?: string
  /** Rich modal copy */
  bio: string
  mentoringStyle: string
  highlights: string[]
}

/** Preview/dev fallback when Sanity has no advisors — production uses CMS only. */
export const ADVISOR_DIRECTORY_SEED: AdvisorDirectoryEntry[] = [
  {
    id: "dummy-showcase-advisor",
    name: "Dr. Placeholder Example",
    organization: "Example Health Systems (DUMMY)",
    role: "Dummy Advisor Profile — Not Real",
    location: "Toronto, ON",
    countries: ["Canada"],
    yearJoined: "2026",
    expertiseTags: ["Healthcare Systems"],
    industries: ["Digital Health", "Pediatrics", "Clinical Research"],
    directoryFilters: [
      { groupId: "country", groupTitle: "Country", values: ["Canada"] },
      { groupId: "expertise", groupTitle: "Expertise", values: ["Healthcare Systems"] },
    ],
    snapshot:
      "Seeded dummy advisor for testing directory filters, snapshot copy, and the About the advisor section.",
    focus:
      "Seeded dummy advisor for testing directory filters, snapshot copy, and the About the advisor section.",
    photoSrc: "/images/nopicture-male.jpg",
    bio: "This seeded profile demonstrates how advisors appear in the directory and on profile pages. Replace this copy with a real bio before promoting to production.",
    mentoringStyle:
      "Use short paragraphs and bullet lists to outline clinical background, operator experience, and the kinds of founder questions you help teams answer.",
    highlights: [
      "Clinical evidence planning for early digital health pilots",
      "Study design and endpoint selection aligned to buyer questions",
      "Async document review with clear next steps",
    ],
    socialLinks: [
      {
        platform: "linkedin",
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/example-placeholder",
      },
      {
        platform: "website",
        label: "Website",
        url: "https://example.com",
      },
    ],
  },
]

export const ADVISOR_FILTER_OPTIONS: Array<{ id: "all" | AdvisorDirectoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "Regulatory & Quality", label: "Regulatory & Quality" },
  { id: "Marketing", label: "Marketing" },
  { id: "Healthcare Systems", label: "Healthcare Systems" },
]
