import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams, Link, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import AdminSubmissionStatusBadge from "@/components/admin/AdminSubmissionStatusBadge"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AdminSubmissionStatusSelect from "@/components/admin/AdminSubmissionStatusSelect"
import AdminDeleteSubmissionButton from "@/components/admin/AdminDeleteSubmissionButton"
import AdminMailtoButton from "@/components/admin/AdminMailtoButton"
import AdminSubmissionNoteEditor from "@/components/admin/AdminSubmissionNoteEditor"
import AdminDiagnosticAnswers from "@/components/admin/AdminDiagnosticAnswers"
import AdminPageReveal from "@/components/admin/AdminPageReveal"
import { adminBackLinkClass, adminErrorBannerClass, adminInternalNotePanelClass, adminPageHeaderDividerClass, adminPageTitleClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  formatAdminDateLong,
  submissionStatusUpdatePayload,
  type SubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import { ArrowLeft } from "lucide-react"

type CompanyProfile = {
  id: string
  created_at: string
  name: string
  work_email: string
  company_name: string
  stage: string | null
  description: string | null
  status?: SubmissionStatus | null
  admin_note?: string | null
}

type SectionScore = { category: string; score: number }
type Strength = { category: string; score: number; note: string }
type Weakness = { category: string; score: number; note: string; priority: string }

type DiagnosticResponse = {
  id: string
  created_at: string
  section_scores: SectionScore[] | null
  raw_answers: Record<string, Record<string, number>> | null
  summary: string | null
  top3_strengths: Strength[] | null
  top3_weaknesses: Weakness[] | null
  recommendations: string[] | null
  mentor_areas_needed: string[] | null
}

const fetchCompanyData = async (id: string) => {
  const [profileRes, responseRes] = await Promise.all([
    supabase.from("company_profiles").select("*").eq("id", id).single(),
    supabase
      .from("diagnostic_responses")
      .select("*")
      .eq("company_profile_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ])

  if (profileRes.error) throw new Error(profileRes.error.message)
  return {
    profile: profileRes.data as CompanyProfile,
    response: responseRes.data as DiagnosticResponse | null,
  }
}

const scoreColor = (score: number) => {
  if (score >= 70) return "text-rellia-teal dark:text-rellia-mint"
  if (score >= 40) return "text-amber-600 dark:text-amber-400"
  return "text-red-600 dark:text-red-400"
}

const weaknessTextClass = "text-red-600 dark:text-red-400"

const AdminCompany = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [statusWritesEnabled, setStatusWritesEnabled] = useState(true)

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-company", id],
    queryFn: () => fetchCompanyData(id!),
    enabled: !!id,
  })

  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    if (!id || !statusWritesEnabled) return
    setUpdatingStatus(true)
    const { error: updateError } = await supabase
      .from("company_profiles")
      .update(submissionStatusUpdatePayload(newStatus))
      .eq("id", id)
    setUpdatingStatus(false)
    if (updateError) {
      if (updateError.message.includes("status") || updateError.message.includes("policy")) {
        setStatusWritesEnabled(false)
      }
      return
    }
    void queryClient.invalidateQueries({ queryKey: ["admin-company", id] })
    void queryClient.invalidateQueries({ queryKey: ["admin-company-profiles"] })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
  }

  const handleDelete = async () => {
    if (!id) return
    const { error: deleteError } = await supabase.from("company_profiles").delete().eq("id", id)
    if (deleteError) return
    void queryClient.invalidateQueries({ queryKey: ["admin-company-profiles"] })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
    navigate("/admin/inbox?tab=diagnostic", { replace: true })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-40 rounded-[20px]" />
        <Skeleton className="h-64 rounded-[20px]" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className={adminErrorBannerClass}>
        Failed to load: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    )
  }

  const { profile, response } = data
  const status = (profile.status ?? "New") as SubmissionStatus
  const hasStatusField = "status" in profile

  return (
    <div className="space-y-6">
      <AdminPageReveal>
      <Link
        to="/admin/inbox?tab=diagnostic"
        className={adminBackLinkClass}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All diagnostic submissions
      </Link>
      </AdminPageReveal>

      <AdminPageReveal delay={0.06}>
      <div className="space-y-6">
      <article className="overflow-hidden rounded-2xl border border-border bg-card/90 shadow-sm">
        <div className={cn("bg-gradient-to-r from-rellia-mint/12 to-white px-5 py-5 md:px-6 dark:to-card/90", adminPageHeaderDividerClass)}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className={cn("font-host-grotesk text-xl font-bold md:text-2xl", adminPageTitleClass)}>{profile.name}</h1>
              <p className="mt-1 font-urbanist text-sm text-muted-foreground">{profile.work_email}</p>
              <p className="font-urbanist text-sm text-muted-foreground">{formatAdminDateLong(profile.created_at)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hasStatusField && statusWritesEnabled ? (
                <AdminSubmissionStatusSelect
                  value={status}
                  disabled={updatingStatus}
                  ariaLabel={`Status for ${profile.company_name}`}
                  onValueChange={(value) => void handleStatusChange(value)}
                />
              ) : (
                <AdminSubmissionStatusBadge status={status} />
              )}
              <AdminDeleteSubmissionButton
                label="Delete diagnostic submission?"
                description="This removes the company profile and linked diagnostic response."
                onConfirm={handleDelete}
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 md:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-urbanist text-sm font-medium text-muted-foreground">Company name</p>
              <p className="mt-1 font-urbanist text-base text-foreground">{profile.company_name}</p>
            </div>
            {profile.stage ? (
              <div>
                <p className="font-urbanist text-sm font-medium text-muted-foreground">Current stage</p>
                <p className="mt-1 font-urbanist text-base text-foreground">{profile.stage}</p>
              </div>
            ) : null}
          </div>
          {profile.description ? (
            <div>
              <p className="font-urbanist text-sm font-medium text-muted-foreground">Mission / description</p>
              <p className="mt-2 whitespace-pre-wrap font-urbanist text-base leading-relaxed text-foreground">
                {profile.description}
              </p>
            </div>
          ) : null}
          <div className="border-t border-border pt-5">
            <AdminMailtoButton
              email={profile.work_email}
              subject={`Re: ${profile.company_name} diagnostic submission`}
              body={`Hi ${profile.name},\n\n`}
              label="Email sender"
            />
          </div>
        </div>
      </article>

      <article className={adminInternalNotePanelClass}>
        <div className="px-5 py-5 md:px-6">
          <AdminSubmissionNoteEditor
            table="company_profiles"
            submissionId={profile.id}
            initialNote={profile.admin_note}
            onSaved={() => void queryClient.invalidateQueries({ queryKey: ["admin-company", id] })}
          />
        </div>
      </article>

      {!response && (
        <p className="font-urbanist text-muted-foreground">No diagnostic response found for this company.</p>
      )}

      {response && (
        <>
          {/* Section scores */}
          {response.section_scores && response.section_scores.length > 0 && (
            <Card className="rounded-[20px] border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="font-host-grotesk text-base font-semibold text-foreground">Section Scores</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-urbanist">Domain</TableHead>
                      <TableHead className="text-right font-urbanist">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...response.section_scores]
                      .sort((a, b) => b.score - a.score)
                      .map((s) => (
                        <TableRow key={s.category}>
                          <TableCell className="font-urbanist text-sm">{s.category}</TableCell>
                          <TableCell className={`text-right font-host-grotesk font-semibold ${scoreColor(s.score)}`}>
                            {s.score}%
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {response.raw_answers && (
            <Accordion
              type="single"
              collapsible
              className="rounded-2xl border border-border bg-card/90 px-4 shadow-sm md:px-6"
            >
              <AccordionItem value="survey-responses" className="border-none">
                <AccordionTrigger className="py-4 font-host-grotesk text-base font-semibold text-foreground hover:no-underline">
                  Survey responses
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <AdminDiagnosticAnswers rawAnswers={response.raw_answers} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid gap-4 sm:grid-cols-2">
            {response.top3_strengths && response.top3_strengths.length > 0 && (
              <Card className="rounded-[20px] border border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="font-host-grotesk text-base font-semibold text-foreground">
                    Top Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {response.top3_strengths.map((s) => (
                    <div
                      key={s.category}
                      className="rounded-xl border border-rellia-mint/30 bg-rellia-mint/20 p-4 dark:border-rellia-mint/25 dark:bg-rellia-mint/10"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 font-host-grotesk text-base font-semibold leading-snug text-rellia-teal dark:text-rellia-mint">
                          {s.category}
                        </span>
                        <span className="shrink-0 font-host-grotesk text-base font-bold tabular-nums leading-none text-rellia-teal dark:text-rellia-mint">
                          {s.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {response.top3_weaknesses && response.top3_weaknesses.length > 0 && (
              <Card className="rounded-[20px] border border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="font-host-grotesk text-base font-semibold text-foreground">
                    Top Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {response.top3_weaknesses.map((w) => (
                    <div key={w.category} className="rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className={cn("min-w-0 font-host-grotesk text-base font-semibold leading-snug", weaknessTextClass)}>
                          {w.category}
                        </span>
                        <span className={cn("shrink-0 font-host-grotesk text-base font-bold tabular-nums leading-none", weaknessTextClass)}>
                          {w.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recommendations */}
          {response.recommendations && response.recommendations.length > 0 && (
            <Card className="rounded-[20px] border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="font-host-grotesk text-base font-semibold text-foreground">
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {response.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-2 font-urbanist text-sm text-muted-foreground">
                      <span className="mt-0.5 shrink-0 font-semibold text-rellia-teal dark:text-rellia-mint">{i + 1}.</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Mentor areas */}
          {response.mentor_areas_needed && response.mentor_areas_needed.length > 0 && (
            <Card className="rounded-[20px] border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="font-host-grotesk text-base font-semibold text-foreground">
                  Mentor Areas Needed
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {response.mentor_areas_needed.map((area) => (
                  <Badge
                    key={area}
                    className="rounded-full bg-rellia-mint/90 font-urbanist text-rellia-teal hover:bg-rellia-mint dark:bg-rellia-mint/20 dark:text-rellia-mint dark:hover:bg-rellia-mint/30"
                  >
                    {area}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

        </>
      )}
      </div>
      </AdminPageReveal>
    </div>
  )
}

export default AdminCompany
