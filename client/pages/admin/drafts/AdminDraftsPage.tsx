import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { ExternalLink, FileEdit } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import type { AdminSanityDataset } from "@shared/cms/sanityEnv"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminContentQueueList from "@/components/admin/AdminContentQueueList"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  
  const [searchParams, setSearchParams] = useSearchParams()
  const datasetParam = searchParams.get("dataset")
  
  const defaultDataset = (datasetParam as AdminSanityDataset) || (getSanityDataset() as AdminSanityDataset) || "production"
  const [selectedDataset, setSelectedDataset] = useState<AdminSanityDataset>(
    defaultDataset === "preview" || defaultDataset === "production" ? defaultDataset : "production"
  )
  
  const dataset = selectedDataset
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const { data, isLoading, error } = useQuery({
    queryKey: cmsContentQueryKey(dataset),
    queryFn: () => fetchCmsContentQueueForDataset(token, dataset),
    staleTime: 60_000,
    enabled: cmsConfigured && Boolean(token),
  })

  const handleDatasetChange = (nextDataset: AdminSanityDataset) => {
    setSelectedDataset(nextDataset)
    setTypeFilter("all")
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev)
        nextParams.set("dataset", nextDataset)
        return nextParams
      },
      { replace: true }
    )
  }

  const draftRows = data ?? []

  const typeOptions = useMemo(() => [...new Set(draftRows.map((row) => row._type))].sort(), [draftRows])

  const filteredRows = useMemo(() => {
    if (typeFilter === "all") return draftRows
    return draftRows.filter((row) => row._type === typeFilter)
  }, [draftRows, typeFilter])

  return (
    <div>
      <AdminPageHeader
        title="Sanity Drafts"
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
            title="Drafts Guide"
            icon={FileEdit}
            storageKey="rellia-admin-drafts-tip-collapsed"
            className="mb-6"
          >
            <div className="space-y-3 font-urbanist text-sm text-black/75">
              <p>
                This page displays content edits (such as updates to programs, events, or team profiles) that are saved in the editing system (Sanity Studio) but are not yet live. Select a dataset view below to check its drafts:
              </p>
              <div className="flex flex-col gap-2 pl-3.5 border-l-2 border-rellia-teal/15 my-2">
                <p>
                  <strong>Production (Live Site):</strong> Contains draft changes for the live, public website. Once published, these changes will appear to all visitors on the web.
                </p>
                <p>
                  <strong>Preview (Staging Site):</strong> Contains draft changes for the staging/preview testing site. Use this to review and test layout adjustments in a safe environment before copying edits over to the live site.
                </p>
              </div>
              <p>
                To make these changes visible on the website, click the <strong>Open Studio</strong> button above, find the page or section you edited, and click <strong>Publish</strong>.
              </p>
            </div>
          </AdminTipBox>

          <Tabs
            value={selectedDataset}
            onValueChange={(val) => handleDatasetChange(val as AdminSanityDataset)}
            className="mb-6"
          >
            <TabsList className="h-[48px] w-full bg-slate-100/80 p-1 rounded-2xl border border-black/5 shadow-sm max-w-none">
              <div className="grid w-full grid-cols-2 h-full items-center">
                {ADMIN_SANITY_DATASET_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      "w-full h-full rounded-xl px-4 py-2 font-urbanist text-sm font-bold transition-all duration-200",
                      "data-[state=active]:bg-white data-[state=active]:text-rellia-teal data-[state=active]:shadow-[0_4px_12px_rgba(0,0,0,0.06)] data-[state=active]:border data-[state=active]:border-black/5",
                      "data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:bg-transparent",
                    )}
                  >
                    {tab.shortLabel}
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </Tabs>

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
