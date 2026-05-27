import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, FileEdit } from "lucide-react"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminContentQueueList from "@/components/admin/AdminContentQueueList"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  cmsContentQueryKey,
  fetchCmsContentQueue,
  formatCmsDocumentTypeLabel,
  isCmsContentEnabled,
} from "@/lib/adminSanityContent"
import { cn } from "@/lib/utils"

const AdminDraftsPage = () => {
  const cmsConfigured = isCmsContentEnabled()
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const { data, isLoading, error } = useQuery({
    queryKey: cmsContentQueryKey(),
    queryFn: fetchCmsContentQueue,
    staleTime: 60_000,
    enabled: cmsConfigured,
  })

  const draftRows = data ?? []

  const typeOptions = useMemo(() => [...new Set(draftRows.map((row) => row._type))].sort(), [draftRows])

  const filteredRows = useMemo(() => {
    if (typeFilter === "all") return draftRows
    return draftRows.filter((row) => row._type === typeFilter)
  }, [draftRows, typeFilter])

  return (
    <div>
      <AdminPageHeader
        title="Sanity drafts"
        description="Unpublished CMS documents waiting for review. Open Sanity Studio to edit and publish."
        actions={
          <Button type="button" variant="outline" size="sm" asChild className="rounded-full">
            <a href="https://relliahealth.sanity.studio" target="_blank" rel="noopener noreferrer">
              Open Studio
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </a>
          </Button>
        }
      />

      {!cmsConfigured ? (
        <Card>
          <CardContent className="pt-6">
            <p className="rounded-lg border border-amber-200/70 bg-amber-50/80 px-4 py-3 font-urbanist text-sm text-amber-950">
              CMS is not configured. Set <code className="text-xs">VITE_SANITY_PROJECT_ID</code> and{" "}
              <code className="text-xs">VITE_SANITY_DATASET</code> on this deployment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by document type">
            <button
              type="button"
              onClick={() => setTypeFilter("all")}
              className={cn(
                "rounded-full px-3 py-1.5 font-urbanist text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                typeFilter === "all"
                  ? "bg-rellia-mint/35 text-rellia-teal"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              All ({draftRows.length})
            </button>
            {typeOptions.map((type) => {
              const count = draftRows.filter((row) => row._type === type).length
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "rounded-full px-3 py-1.5 font-urbanist text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    typeFilter === type
                      ? "bg-rellia-mint/35 text-rellia-teal"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  {formatCmsDocumentTypeLabel(type)} ({count})
                </button>
              )
            })}
          </div>

          {!isLoading && !error && filteredRows.length === 0 ? (
            <AdminCompactEmptyState
              icon={FileEdit}
              title="No drafts in this category"
              description="Published content or drafts in other types may still exist in Sanity Studio."
            />
          ) : (
            <AdminContentQueueList
              rows={filteredRows}
              isLoading={isLoading}
              error={error}
              dataset=""
              emptyTitle="No drafts in this category"
              groupByType={false}
            />
          )}
        </>
      )}
    </div>
  )
}

export default AdminDraftsPage
