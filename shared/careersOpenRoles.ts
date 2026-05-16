export type CareersOpenRole = {
  id: string
  title: string
  location: string
  employmentType: string
  description: string
  responsibilities: string[]
  linkedInApplyUrl: string
}

/** Source of truth for open roles on /careers#open-roles when `CAREERS_OPEN_ROLES_PUBLISHED` is true — see `shared/careersPageConfig.ts` */
export const CAREERS_OPEN_ROLES: CareersOpenRole[] = [
  {
    id: "program-operations-manager",
    title: "Program Operations Manager",
    location: "Remote (US) with occasional travel",
    employmentType: "Full-time",
    description:
      "Own the day-to-day execution of founder programs—cohort logistics, stakeholder coordination, and quality bar for sessions and deliverables. You will partner with clinical, investor, and operator leads so every touchpoint feels intentional.",
    responsibilities: [
      "Run cohort calendars, RSVPs, and materials in tight loops with leadership",
      "Improve playbooks for workshops, salons, and office hours based on feedback",
      "Coordinate with partners and vendors; track outcomes and reporting",
    ],
    linkedInApplyUrl: "https://www.linkedin.com/company/relliahealth/jobs/",
  },
  {
    id: "community-events-coordinator",
    title: "Community & Events Coordinator",
    location: "Hybrid — New York metro preferred",
    employmentType: "Full-time",
    description:
      "Shape how members experience Rellia in person and online—from flagship events to small founder dinners. You care about hospitality, brand consistency, and making busy operators feel looked after.",
    responsibilities: [
      "Plan and run events end-to-end with clear run-of-show and contingency plans",
      "Manage attendee comms, registration tools, and post-event follow-ups",
      "Support content capture (photos, quotes) for stories and social in brand voice",
    ],
    linkedInApplyUrl: "https://www.linkedin.com/company/relliahealth/jobs/",
  },
]
