import { useQuery } from "@tanstack/react-query"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type CompanyProfile = {
  id: string
  created_at: string
  name: string
  work_email: string
  company_name: string
  stage: string | null
  description: string | null
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
  if (score >= 70) return "text-rellia-teal"
  if (score >= 40) return "text-amber-600"
  return "text-red-600"
}

const priorityLabel = (priority: string) => {
  if (priority === "Critical") return "bg-red-100 text-red-700"
  if (priority === "High") return "bg-amber-100 text-amber-700"
  return "bg-rellia-mint/20 text-rellia-teal"
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })

const AdminCompany = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-company", id],
    queryFn: () => fetchCompanyData(id!),
    enabled: !!id,
  })

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
      <div className="rounded-[20px] border border-red-200 bg-red-50 p-4 font-urbanist text-sm text-red-700">
        Failed to load: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    )
  }

  const { profile, response } = data

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/admin/dashboard"
        className="font-urbanist text-sm text-rellia-teal/70 hover:text-rellia-teal transition-colors"
      >
        ← All submissions
      </Link>

      {/* Company header */}
      <Card className="rounded-[20px] border border-black/10 bg-white shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="font-host-grotesk text-xl font-bold text-rellia-teal">
                {profile.company_name}
              </CardTitle>
              <p className="mt-1 font-urbanist text-sm text-black/60">
                Submitted by {profile.name} · {profile.work_email}
              </p>
              <p className="font-urbanist text-xs text-black/40">{formatDate(profile.created_at)}</p>
            </div>
            {profile.stage && (
              <Badge className="rounded-full bg-rellia-mint/90 font-urbanist text-rellia-teal hover:bg-rellia-mint">
                {profile.stage}
              </Badge>
            )}
          </div>
        </CardHeader>
        {profile.description && (
          <CardContent>
            <p className="font-urbanist text-sm leading-relaxed text-black/60">
              {profile.description}
            </p>
          </CardContent>
        )}
      </Card>

      {!response && (
        <p className="font-urbanist text-black/60">No diagnostic response found for this company.</p>
      )}

      {response && (
        <>
          {/* Summary */}
          {response.summary && (
            <Card className="rounded-[20px] border border-black/10 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-host-grotesk text-base font-semibold">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-urbanist text-sm leading-relaxed text-black/70">{response.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Section scores */}
          {response.section_scores && response.section_scores.length > 0 && (
            <Card className="rounded-[20px] border border-black/10 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-host-grotesk text-base font-semibold">Section Scores</CardTitle>
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

          {/* Strengths & Weaknesses */}
          <div className="grid gap-4 sm:grid-cols-2">
            {response.top3_strengths && response.top3_strengths.length > 0 && (
              <Card className="rounded-[20px] border border-black/10 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="font-host-grotesk text-base font-semibold text-rellia-teal">
                    Top Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {response.top3_strengths.map((s) => (
                    <div
                      key={s.category}
                      className="rounded-xl border border-rellia-mint/30 bg-rellia-mint/20 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-host-grotesk text-sm font-semibold text-rellia-teal">
                          {s.category}
                        </span>
                        <span className="font-host-grotesk text-sm font-bold text-rellia-teal">
                          {s.score}%
                        </span>
                      </div>
                      <p className="mt-1 font-urbanist text-xs text-rellia-teal/70">{s.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {response.top3_weaknesses && response.top3_weaknesses.length > 0 && (
              <Card className="rounded-[20px] border border-black/10 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="font-host-grotesk text-base font-semibold text-red-700">
                    Top Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {response.top3_weaknesses.map((w) => (
                    <div key={w.category} className="rounded-xl border border-red-100 bg-red-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-host-grotesk text-sm font-semibold text-rellia-teal">
                          {w.category}
                        </span>
                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 font-urbanist text-xs font-medium ${priorityLabel(w.priority)}`}
                          >
                            {w.priority}
                          </span>
                          <span className="font-host-grotesk text-sm font-bold text-red-600">
                            {w.score}%
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 font-urbanist text-xs text-black/60">{w.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recommendations */}
          {response.recommendations && response.recommendations.length > 0 && (
            <Card className="rounded-[20px] border border-black/10 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-host-grotesk text-base font-semibold">
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {response.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-2 font-urbanist text-sm text-black/70">
                      <span className="mt-0.5 shrink-0 font-semibold text-rellia-teal">{i + 1}.</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Mentor areas */}
          {response.mentor_areas_needed && response.mentor_areas_needed.length > 0 && (
            <Card className="rounded-[20px] border border-black/10 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-host-grotesk text-base font-semibold">
                  Mentor Areas Needed
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {response.mentor_areas_needed.map((area) => (
                  <Badge
                    key={area}
                    className="rounded-full bg-rellia-mint/90 font-urbanist text-rellia-teal hover:bg-rellia-mint"
                  >
                    {area}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Raw answers (collapsible) */}
          {response.raw_answers && (
            <Accordion type="single" collapsible>
              <AccordionItem value="raw" className="rounded-[20px] border border-black/10 bg-white px-6 shadow-sm">
                <AccordionTrigger className="font-urbanist text-sm text-black/50 hover:text-black/70 hover:no-underline">
                  View raw question answers
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="overflow-x-auto rounded-xl bg-rellia-cream p-4 font-urbanist text-xs text-black/70">
                    {JSON.stringify(response.raw_answers, null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </>
      )}
    </div>
  )
}

export default AdminCompany
