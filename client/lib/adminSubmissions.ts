import { supabase } from "@/lib/supabase"
import type { SubmissionStatus } from "@/lib/adminSubmissionStatus"

export type CompanyProfileRow = {
  id: string
  created_at: string
  name: string
  work_email: string
  company_name: string
  stage: string | null
  description: string | null
  status?: SubmissionStatus | null
}

export type ContactRow = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  company: string | null
  job_title: string | null
  message: string
  status?: SubmissionStatus | null
  submission_type?: string | null
}

export const fetchContactSubmissions = async (): Promise<ContactRow[]> => {
  const { data, error } = await supabase.from("contact_responses").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as ContactRow[]
}

export const fetchDiagnosticSubmissions = async (): Promise<CompanyProfileRow[]> => {
  const { data, error } = await supabase.from("company_profiles").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as CompanyProfileRow[]
}

export const contactDisplayName = (row: ContactRow) =>
  `${row.first_name} ${row.last_name === "." ? "" : row.last_name}`.trim()

export const contactTypeLabel = (row: ContactRow) => {
  if (row.submission_type === "investor") return "Investor notify"
  if (row.submission_type === "modal") return "Priority modal"
  return "Contact"
}
