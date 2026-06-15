import {
  contactDisplayName,
  contactTypeLabel,
  type CompanyProfileRow,
  type ContactRow,
} from "@/lib/adminSubmissions"

export const matchesAdminSearch = (haystack: string, query: string): boolean => {
  const q = query.trim().toLowerCase()
  if (!q) return false
  return haystack.toLowerCase().includes(q)
}

export type AdminSearchResult = {
  id: string
  label: string
  meta: string
  href: string
  kind: "contact" | "diagnostic"
}

export const buildAdminSearchResults = (
  query: string,
  contacts: ContactRow[],
  diagnostics: CompanyProfileRow[],
  limit = 8,
): AdminSearchResult[] => {
  const q = query.trim()
  if (!q) return []

  const contactHits: AdminSearchResult[] = contacts
    .filter((row) =>
      matchesAdminSearch(
        [contactDisplayName(row), row.email, row.company ?? "", contactTypeLabel(row)].join(" "),
        q,
      ),
    )
    .slice(0, limit)
    .map((row) => ({
      id: row.id,
      label: contactDisplayName(row) || row.email,
      meta: [contactTypeLabel(row), row.email].filter(Boolean).join(" · "),
      href: `/admin/contacts/${row.id}`,
      kind: "contact" as const,
    }))

  const remaining = Math.max(0, limit - contactHits.length)
  const diagnosticHits: AdminSearchResult[] = diagnostics
    .filter((row) =>
      matchesAdminSearch([row.name, row.work_email, row.company_name, row.stage ?? ""].join(" "), q),
    )
    .slice(0, remaining)
    .map((row) => ({
      id: row.id,
      label: row.company_name || row.name,
      meta: [row.name, row.work_email].filter(Boolean).join(" · "),
      href: `/admin/companies/${row.id}`,
      kind: "diagnostic" as const,
    }))

  return [...contactHits, ...diagnosticHits]
}
