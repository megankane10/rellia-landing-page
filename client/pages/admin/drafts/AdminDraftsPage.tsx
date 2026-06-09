import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, FileEdit } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminDownloadCsvButton from "@/components/admin/AdminDownloadCsvButton"
import AdminContentQueueList from "@/components/admin/AdminContentQueueList"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  cmsContentQueryKey,
  fetchCmsContentQueueForDataset,
  formatCmsDocumentTypeLabel,
  isCmsContentEnabled,
} from "@/lib/adminSanityContent"
import AdminTipBox from "@/components/admin/AdminTipBox"
import { cn } from "@/lib/utils"

const PRODUCTION_DATASET = "production" as const

const DATASET_EMPTY_MESSAGE =
  "All caught up. There are no unpublished Sanity documents waiting to go live on www.relliahealth.com."

const AdminDraftsPage = () => {
  const { session } = useAuth()
  const token = session?.access_token ?? ""
  const cmsConfigured = isCmsContentEnabled()
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const { data, isLoading, error } = useQuery({
    queryKey: cmsContentQueryKey(PRODUCTION_DATASET),
    queryFn: () => fetchCmsContentQueueForDataset(token, PRODUCTION_DATASET),
    staleTime: 60_000,
    enabled: cmsConfigured && Boolean(token),
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
        title="Sanity Drafts"
        actions={
          <>
            <AdminDownloadCsvButton
              filename={`rellia-sanity-drafts-${PRODUCTION_DATASET}`}
              rows={filteredRows}
              columns={[
                { header: "Title", value: (row) => row.title ?? row._id },
                { header: "Type", value: (row) => formatCmsDocumentTypeLabel(row._type) },
                { header: "Document ID", value: (row) => row._id },
                { header: "Updated", value: (row) => row._updatedAt ?? "" },
                { header: "Status", value: (row) => row.status },
              ]}
            />
            <Button type="button" variant="outline" size="sm" asChild className="rounded-full">
              <a href="https://relliahealth.sanity.studio" target="_blank" rel="noopener noreferrer">
                Open Studio
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
              </a>
            </Button>
          </>
        }
      />

      {!cmsConfigured ? (
        <Card>
          <CardContent className="pt-6">
            <p className="rounded-lg border border-amber-200/70 bg-amber-50/80 px-4 py-3 font-urbanist text-sm text-amber-950">
              CMS is not configured. Set <code className="text-xs">VITE_SANITY_PROJECT_ID</code> and{" "}
              <code className="text-xs">VITE_SANITY_DATASET=production</code> on this deployment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <AdminTipBox
            title="Drafts guide"
            icon={FileEdit}
            storageKey="rellia-admin-drafts-tip-collapsed"
            className="mb-6"
          >
            <div className="space-y-3 font-urbanist text-sm text-black/75">
              <p>
                This page lists unpublished edits in the <strong>production</strong> Sanity dataset — the same
                database that powers <strong>www.relliahealth.com</strong>. Saved drafts here are not visible to
                public visitors until you publish them in Studio.
              </p>
              <p>
                To preview unpublished work before publishing, use <strong>Presentation</strong> in Sanity Studio
                (it loads www inside Studio only — drafts do not appear on the public site).
              </p>
              <p>
                When you are ready to go live, click <strong>Open Studio</strong>, open the document, and click{" "}
                <strong>Publish</strong>. Changes usually appear on www within about 30 seconds.
              </p>
            </div>
          </AdminTipBox>

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
              dataset={PRODUCTION_DATASET}
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
