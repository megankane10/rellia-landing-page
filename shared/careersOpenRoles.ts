import type { CareersOpenRole } from "./cms/types"
import { plainStringToPortableTextBlocks } from "./cms/normalizePortableText"

/** Preview/dev fallback for /careers#open-roles when CMS has no openRole documents. */
export const CAREERS_OPEN_ROLES: CareersOpenRole[] = [
  {
    id: "dummy-placeholder-role",
    title: "[DUMMY] Placeholder Role — Not a Real Opening",
    location: "Remote (example location only)",
    employmentType: "Part-time (sample)",
    description: plainStringToPortableTextBlocks(
      "This is dummy seed text for editors and engineering to verify the open roles accordion. Replace this document with a real role before promoting careers content to production.",
    ),
    responsibilities: [
      "[DUMMY] Example responsibility — delete before publishing",
      "[DUMMY] Second placeholder bullet for layout testing",
      "[DUMMY] Third bullet to confirm list rendering",
    ],
    applyButtonLabel: "Apply",
    applyButtonUrl: "https://www.linkedin.com/company/relliahealth/jobs/",
  },
]
