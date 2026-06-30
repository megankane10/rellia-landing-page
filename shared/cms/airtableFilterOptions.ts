/**
 * Canonical directory filter labels aligned with Airtable multiselect options (read-only audit).
 * Tech Category is intentionally omitted — no Sanity filter group yet (client confirmation pending).
 */

export const AIRTABLE_COUNTRY_OPTIONS = [
  "US",
  "Canada",
  "United Kingdom",
  "Iran",
  "Dubai",
  "Israel",
  "Spain",
  "Singapore",
  "Germany",
  "France",
  "India",
  "Poland",
  "Finland",
  "Belgium",
  "Australia",
  "Ukraine",
] as const

export const AIRTABLE_BUSINESS_MODEL_OPTIONS = ["B2B", "B2C", "B2B2C"] as const

export const AIRTABLE_CLINICAL_SPECIALTY_OPTIONS = [
  "Administration or Infrastructure",
  "Cardiology",
  "Clinical Trials",
  "EHR",
  "Emergency",
  "Geriatrics",
  "Healthcare Systems",
  "Imaging",
  "Mental Health",
  "n/a",
  "Neurology",
  "Oncology",
  "Optometry",
  "Orthopedics",
  "Pediatrics",
  "Pharma",
  "Pharma / Biotech",
  "Physical / Occupational",
  "Primary Care",
  "Radiology",
  "Respiratory",
  "Surgery",
  "Telehealth",
  "Urology",
  "Wellness",
  "Women's Health",
] as const

/** Not wired to a CMS filter group yet — founders only in Airtable. */
export const AIRTABLE_TECH_CATEGORY_OPTIONS = [
  "Hardware MedTech",
  "Health Data / Infrastructure",
  "Diagnostic",
  "Clinical Decision Support",
  "Administrative Workflow",
  "Telehealth",
  "Remote Patient Monitoring",
  "Digital Therapeutics",
] as const

export const AIRTABLE_ADVISOR_EXPERTISE_OPTIONS = [
  "Regulatory & Quality",
  "Marketing",
  "Healthcare Systems",
] as const

export const AIRTABLE_ADVISOR_INDUSTRY_OPTIONS = ["MedTech", "AI", "FDA"] as const
