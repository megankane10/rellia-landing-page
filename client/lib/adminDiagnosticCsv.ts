import type { CsvColumn } from "@/lib/downloadCsv"
import { formatAdminDate } from "@/lib/adminSubmissionStatus"
import type { CompanyProfileRow, DiagnosticResponseSummary } from "@/lib/adminSubmissions"

const joinList = (items: string[]) => items.filter(Boolean).join("; ")

const formatSectionScores = (scores: DiagnosticResponseSummary["section_scores"]) => {
  if (!scores?.length) return ""
  return scores.map((item) => `${item.category}: ${item.score}%`).join("; ")
}

const formatStrengths = (strengths: DiagnosticResponseSummary["top3_strengths"]) => {
  if (!strengths?.length) return ""
  return strengths
    .map((item) => `${item.category} (${item.score}%${item.note ? ` — ${item.note}` : ""})`)
    .join("; ")
}

const formatWeaknesses = (weaknesses: DiagnosticResponseSummary["top3_weaknesses"]) => {
  if (!weaknesses?.length) return ""
  return weaknesses
    .map(
      (item) =>
        `${item.category} (${item.score}%, ${item.priority}${item.note ? ` — ${item.note}` : ""})`,
    )
    .join("; ")
}

export const diagnosticAverageScore = (scores: DiagnosticResponseSummary["section_scores"]) => {
  if (!scores?.length) return ""
  const total = scores.reduce((sum, item) => sum + item.score, 0)
  return Math.round(total / scores.length)
}

export const adminCompanyDetailPath = (profileId: string) => `/admin/companies/${profileId}`

export const adminCompanyDetailUrl = (profileId: string) => {
  if (typeof window === "undefined") return adminCompanyDetailPath(profileId)
  return `${window.location.origin}${adminCompanyDetailPath(profileId)}`
}

export const diagnosticCsvColumns = (): CsvColumn<CompanyProfileRow>[] => [
  { header: "Founder", value: (row) => row.name },
  { header: "Company", value: (row) => row.company_name },
  { header: "Email", value: (row) => row.work_email },
  { header: "Stage", value: (row) => row.stage ?? "" },
  { header: "Received", value: (row) => formatAdminDate(row.created_at) },
  { header: "Status", value: (row) => row.status ?? "New" },
  { header: "Note", value: (row) => row.admin_note ?? "" },
  {
    header: "Average score (%)",
    value: (row) => {
      const avg = diagnosticAverageScore(row.diagnostic_response?.section_scores ?? null)
      return avg === "" ? "" : String(avg)
    },
  },
  {
    header: "Section scores",
    value: (row) => formatSectionScores(row.diagnostic_response?.section_scores ?? null),
  },
  { header: "Summary", value: (row) => row.diagnostic_response?.summary ?? "" },
  {
    header: "Top strengths",
    value: (row) => formatStrengths(row.diagnostic_response?.top3_strengths ?? null),
  },
  {
    header: "Top weaknesses",
    value: (row) => formatWeaknesses(row.diagnostic_response?.top3_weaknesses ?? null),
  },
  {
    header: "Recommendations",
    value: (row) => joinList(row.diagnostic_response?.recommendations ?? []),
  },
  {
    header: "Mentor areas needed",
    value: (row) => joinList(row.diagnostic_response?.mentor_areas_needed ?? []),
  },
  { header: "Detail URL", value: (row) => adminCompanyDetailUrl(row.id) },
]
