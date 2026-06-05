import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, FileEdit } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import type { AdminSanityDataset } from "@shared/cms/sanityEnv"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminContentQueueList from "@/components/admin/AdminContentQueueList"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ADMIN_SANITY_DATASET_TABS,
  cmsContentQueryKey,
  fetchCmsContentQueueForDataset,
  formatCmsDocumentTypeLabel,
  isCmsContentEnabled,
} from "@/lib/adminSanityContent"
import AdminTipBox from "@/components/admin/AdminTipBox"
import { getSanityDataset } from "@/lib/sanity"
import { cn } from "@/lib/utils"

const DATASET_EMPTY_MESSAGE =
  "Dataset is currently synchronized. There are no unpublished changes or document drafts waiting inside this workspace connection."

const AdminDraftsPage = () => {
  const { session } = useAuth()
  const token = session?.access_token ?? ""
  const cmsConfigured = isCmsContentEnabled()
  const [dataset, setDataset] = useState<AdminSanityDataset>(() => {
    const defaultDs = getSanityDataset();
    return defaultDs === "preview" ? "preview" : "production";
  })
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const { data, isLoading, error } = useQuery({
    queryKey: cmsContentQueryKey(dataset),
    queryFn: () => fetchCmsContentQueueForDataset(token, dataset),
    staleTime: 60_000,
    enabled: cmsConfigured && Boolean(token),
  })

  const draftRows = data ?? []

  const typeOptions = useMemo(() => [...new Set(draftRows.map((row) => row._type))].sort(), [draftRows])

  const filteredRows = useMemo(() => {
    if (typeFilter === "all") return draftRows
    return draftRows.filter((row) => row._type === typeFilter)
  }, [draftRows, typeFilter])

  const handleDatasetChange = (next: AdminSanityDataset) => {
    setDataset(next)
    setTypeFilter("all")
  }

  return (
    <div>
      <AdminPageHeader
        title="Sanity Drafts"
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
          <AdminTipBox
            title="Preview vs Production"
            icon={FileEdit}
            storageKey="rellia-admin-drafts-tip-collapsed"
            className="mb-6"
          >
            <p>
              Drafts live inside a specific Sanity dataset. Switch datasets to see unpublished work that will affect the staging site (preview) vs the live site (production).
            </p>
          </AdminTipBox>
          <div className="mb-6 h-[48px] w-full bg-slate-100/80 p-1 rounded-2xl border border-black/5 shadow-sm max-w-none">
            <div className="grid w-full grid-cols-2 h-full items-center" role="tablist" aria-label="Sanity dataset">
              {ADMIN_SANITY_DATASET_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={dataset === tab.id}
                  onClick={() => handleDatasetChange(tab.id)}
                  className={cn(
                    "w-full h-full rounded-xl px-4 py-2 font-urbanist text-sm font-bold transition-all duration-200 text-center flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    dataset === tab.id
                      ? "bg-white text-rellia-teal shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-black/5"
                      : "text-slate-600 hover:text-slate-900 bg-transparent",
                  )}
                >
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {typeOptions.length > 0 ? (
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
          ) : null}

          {!isLoading && !error && filteredRows.length === 0 ? (
            <AdminCompactEmptyState
              icon={FileEdit}
              title="All caught up"
              description={DATASET_EMPTY_MESSAGE}
            />
          ) : (
            <AdminContentQueueList
              rows={filteredRows}
              isLoading={isLoading}
              error={error}
              dataset={dataset}
              emptyTitle={DATASET_EMPTY_MESSAGE}
              groupByType={false}
            />
          )}
        </>
      )}
    </div>
  )
}

export default AdminDraftsPage
