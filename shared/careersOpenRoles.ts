export type CareersOpenRole = {
  id: string
  title: string
  location: string
  employmentType: string
  description: string
  responsibilities: string[]
  linkedInApplyUrl: string
}

/** Preview/dev fallback for /careers#open-roles when CMS has no openRole documents. */
export const CAREERS_OPEN_ROLES: CareersOpenRole[] = [
  {
    id: "dummy-placeholder-role",
    title: "[DUMMY] Placeholder Role — Not a Real Opening",
    location: "Remote (example location only)",
    employmentType: "Part-time (sample)",
    description:
      "This is dummy seed text for editors and engineering to verify the open roles accordion. Replace this document with a real role before promoting careers content to production.",
    responsibilities: [
      "[DUMMY] Example responsibility — delete before publishing",
      "[DUMMY] Second placeholder bullet for layout testing",
      "[DUMMY] Third bullet to confirm list rendering",
    ],
    linkedInApplyUrl: "https://www.linkedin.com/company/relliahealth/jobs/",
  },
]
