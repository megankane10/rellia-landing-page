import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type CompanyProfile = {
  id: string
  created_at: string
  name: string
  work_email: string
  company_name: string
  stage: string | null
  description: string | null
}

const fetchProfiles = async (): Promise<CompanyProfile[]> => {
  const { data, error } = await supabase
    .from("company_profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })

const AdminDashboard = () => {
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ["admin-company-profiles"],
    queryFn: fetchProfiles,
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-host-grotesk text-2xl font-bold text-rellia-teal">
          Diagnostic Submissions
        </h1>
        {profiles && (
          <p className="mt-1 font-urbanist text-sm text-black/60">
            {profiles.length} submission{profiles.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-[20px]" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-[20px] border border-red-200 bg-red-50 p-4 font-urbanist text-sm text-red-700">
          Failed to load submissions: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {profiles && profiles.length === 0 && (
        <p className="font-urbanist text-black/60">No submissions yet.</p>
      )}

      {profiles && profiles.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <Link key={p.id} to={`/admin/companies/${p.id}`} className="group">
              <Card className="h-full rounded-[20px] border border-black/10 bg-white shadow-sm transition-shadow group-hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="font-host-grotesk text-base font-semibold text-rellia-teal">
                    {p.company_name}
                  </CardTitle>
                  <CardDescription className="font-urbanist text-xs text-black/60">
                    {p.name} · {p.work_email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-2">
                  {p.stage && (
                    <Badge className="rounded-full bg-rellia-mint/90 font-urbanist text-rellia-teal hover:bg-rellia-mint">
                      {p.stage}
                    </Badge>
                  )}
                  <span className="ml-auto font-urbanist text-xs text-black/50">
                    {formatDate(p.created_at)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
