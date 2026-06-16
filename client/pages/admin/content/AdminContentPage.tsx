import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { FileEdit, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import AdminPageReveal from "@/components/admin/AdminPageReveal"
import AdminContentQueueList from "@/components/admin/AdminContentQueueList"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import AdminSelectFilter from "@/components/admin/AdminSelectFilter"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  cmsContentQueryKey,
  cmsPublishedQueryKey,
  fetchCmsContentQueueForDataset,
  fetchCmsPublishedQueueForDataset,
  formatCmsDocumentTypeLabel,
  isCmsContentEnabled,
  type SanityContentRow,
} from "@/lib/adminSanityContent"
import AdminTipBox from "@/components/admin/AdminTipBox"
import { adminToolbarSearchInputClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

const PRODUCTION_DATASET = "production" as const

type ContentStatusFilter = "all" | "draft" | "published"

const DRAFTS_EMPTY_MESSAGE =
  "All caught up. There are no unpublished Sanity documents waiting to go live on www.relliahealth.com."

const PUBLISHED_EMPTY_MESSAGE =
  "No recent publishes yet. Documents will appear here after you publish in Sanity Studio."

const ALL_EMPTY_MESSAGE =
  "No Sanity documents to show. Drafts and recent publishes will appear here as you work in Studio."

const SEARCH_EMPTY_MESSAGE = "No documents match your search. Try a different title or type."

const parseContentStatusFilter = (params: URLSearchParams): ContentStatusFilter => {
  const status = params.get("status")
  const tab = params.get("tab")
  if (status === "published" || tab === "published") return "published"
  if (status === "draft" || status === "drafts" || tab === "drafts") return "draft"
  return "all"
}

const matchesContentSearch = (row: SanityContentRow, query: string): boolean => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    row.title ?? "",
    row._type,
    formatCmsDocumentTypeLabel(row._type),
    row._id,
  ]
    .join(" ")
    .toLowerCase()
  return haystack.includes(q)
}

const sortRowsByUpdated = (rows: SanityContentRow[]) =>
  [...rows].sort(
    (a, b) =>
      new Date(b._updatedAt ?? 0).getTime() - new Date(a._updatedAt ?? 0).getTime(),
  )

const AdminContentPage = () => {
  const { session } = useAuth()
  const token = session?.access_token ?? ""
  const cmsConfigured = isCmsContentEnabled()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = parseContentStatusFilter(searchParams)
  const [searchQuery, setSearchQuery] = useState("")

  const setStatusFilter = (next: ContentStatusFilter) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev)
        nextParams.delete("tab")
        if (next === "all") nextParams.delete("status")
        else nextParams.set("status", next)
        return nextParams
      },
      { replace: true },
    )
  }

  const draftsQuery = useQuery({
    queryKey: cmsContentQueryKey(PRODUCTION_DATASET),
    queryFn: () => fetchCmsContentQueueForDataset(token, PRODUCTION_DATASET),
    staleTime: 60_000,
    enabled: cmsConfigured && Boolean(token),
  })

  const publishedQuery = useQuery({
    queryKey: cmsPublishedQueryKey(PRODUCTION_DATASET),
    queryFn: () => fetchCmsPublishedQueueForDataset(token, PRODUCTION_DATASET),
    staleTime: 60_000,
    enabled: cmsConfigured && Boolean(token),
  })

  const draftRows = draftsQuery.data ?? []
  const publishedRows = publishedQuery.data ?? []

  const allRows = useMemo(
    () => sortRowsByUpdated([...draftRows, ...publishedRows]),
    [draftRows, publishedRows],
  )

  const statusFilteredRows = useMemo(() => {
    if (statusFilter === "published") return publishedRows
    if (statusFilter === "draft") return draftRows
    return allRows
  }, [allRows, draftRows, publishedRows, statusFilter])

  const filteredRows = useMemo(
    () => statusFilteredRows.filter((row) => matchesContentSearch(row, searchQuery)),
    [searchQuery, statusFilteredRows],
  )

  const isLoading =
    statusFilter === "published"
      ? publishedQuery.isLoading
      : statusFilter === "draft"
        ? draftsQuery.isLoading
        : draftsQuery.isLoading || publishedQuery.isLoading

  const queryError =
    statusFilter === "published"
      ? publishedQuery.error
      : statusFilter === "draft"
        ? draftsQuery.error
        : draftsQuery.error ?? publishedQuery.error

  const emptyMessage = useMemo(() => {
    if (searchQuery.trim() && statusFilteredRows.length > 0) return SEARCH_EMPTY_MESSAGE
    if (statusFilter === "draft") return DRAFTS_EMPTY_MESSAGE
    if (statusFilter === "published") return PUBLISHED_EMPTY_MESSAGE
    return ALL_EMPTY_MESSAGE
  }, [searchQuery, statusFilter, statusFilteredRows.length])

  const emptyTitle = useMemo(() => {
    if (searchQuery.trim() && statusFilteredRows.length > 0) return "No matches"
    if (statusFilter === "draft") return "All caught up"
    if (statusFilter === "published") return "No recent publishes"
    return "Nothing here yet"
  }, [searchQuery, statusFilter, statusFilteredRows.length])

  const statusFilterOptions = useMemo(
    () => [
      { value: "all" as const, label: "All content", count: allRows.length },
      { value: "draft" as const, label: "Drafts", count: draftRows.length },
      { value: "published" as const, label: "Published", count: publishedRows.length },
    ],
    [allRows.length, draftRows.length, publishedRows.length],
  )

  return (
    <div>
      <AdminPageReveal>
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
            title="Sanity content"
            icon={FileEdit}
            storageKey="rellia-admin-content-tip-collapsed-v2"
            defaultExpanded
            className="mb-6"
          >
            <div className="space-y-3 font-urbanist text-sm text-muted-foreground">
              <p>
                <strong>Drafts</strong> are unpublished edits in the <strong>production</strong> Sanity dataset — the
                same database that powers <strong>www.relliahealth.com</strong>. They are not visible to public visitors
                until you publish in Studio.
              </p>
              <p>
                <strong>Published</strong> shows the 16 most recently updated live documents, newest first — not the
                full archive. Use the status filter or search to narrow the list.
              </p>
              <p>
                To preview unpublished work before publishing, use <strong>Presentation</strong> in Sanity Studio. When
                you are ready to go live, open the document and click <strong>Publish</strong>.
              </p>
            </div>
          </AdminTipBox>

          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="relative min-w-0 w-full flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search title or document type…"
                  className={cn("h-10 w-full pl-9", adminToolbarSearchInputClass)}
                  aria-label="Search Sanity content"
                />
              </div>
              <div className="flex w-auto max-w-[9rem] shrink-0 self-start sm:max-w-none sm:self-auto">
                <AdminSelectFilter
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statusFilterOptions}
                  ariaLabel="Filter by draft or published status"
                />
              </div>
            </div>

            {!isLoading && !queryError && filteredRows.length === 0 ? (
              <AdminCompactEmptyState
                icon={FileEdit}
                title={emptyTitle}
                description={emptyMessage}
              />
            ) : (
              <AdminContentQueueList
                rows={filteredRows}
                isLoading={isLoading}
                error={queryError}
                dataset={PRODUCTION_DATASET}
                emptyTitle={emptyMessage}
                groupByType={false}
                updatedColumnLabel="Updated"
              />
            )}
          </div>
        </>
      )}
      </AdminPageReveal>
    </div>
  )
}

export default AdminContentPage
