import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FileEdit, Search, Users } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import AdminPageReveal from "@/components/admin/AdminPageReveal"
import AdminContentQueueList from "@/components/admin/AdminContentQueueList"
import AdminAirtableDirectoryPanel from "@/components/admin/AdminAirtableDirectoryPanel"
import {
  airtableDirectoryQueryKey,
  fetchAirtableDirectoryQueue,
} from "@/lib/adminAirtableDirectory"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import AdminSelectFilter from "@/components/admin/AdminSelectFilter"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  adminToolbarSearchInputClass,
  adminSegmentedTabCountClass,
  adminSegmentedTabsListClass,
  adminSegmentedTabTriggerClass,
} from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

const PRODUCTION_DATASET = "production" as const

type ContentStatusFilter = "all" | "draft" | "published"
type ContentSourceTab = "sanity" | "airtable"

const DRAFTS_EMPTY_MESSAGE =
  "All caught up. There are no unpublished Sanity documents waiting to go live on www.relliahealth.com."

const PUBLISHED_EMPTY_MESSAGE =
  "No recent publishes yet. Documents will appear here after you publish in Sanity Studio."

const ALL_EMPTY_MESSAGE =
  "No Sanity documents to show. Drafts and recent publishes will appear here as you work in Studio."

const SEARCH_EMPTY_MESSAGE = "No documents match your search. Try a different title or type."

const parseContentSourceTab = (params: URLSearchParams): ContentSourceTab => {
  const source = params.get("source")
  return source === "airtable" ? "airtable" : "sanity"
}

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
  const queryClient = useQueryClient()
  const token = session?.access_token ?? ""
  const cmsConfigured = isCmsContentEnabled()
  const [searchParams, setSearchParams] = useSearchParams()
  const sourceTab = parseContentSourceTab(searchParams)
  const statusFilter = parseContentStatusFilter(searchParams)
  const [searchQuery, setSearchQuery] = useState("")

  const setSourceTab = (next: ContentSourceTab) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev)
        if (next === "sanity") nextParams.delete("source")
        else nextParams.set("source", next)
        return nextParams
      },
      { replace: true },
    )
  }

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

  const airtableQueueQuery = useQuery({
    queryKey: airtableDirectoryQueryKey,
    queryFn: () => fetchAirtableDirectoryQueue(token),
    staleTime: 600_000,
    refetchOnWindowFocus: false,
    enabled: cmsConfigured && Boolean(token),
  })

  const handleRefreshAirtableQueue = () => {
    void queryClient.fetchQuery({
      queryKey: airtableDirectoryQueryKey,
      queryFn: () => fetchAirtableDirectoryQueue(token, { refresh: true }),
    })
  }

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
          {sourceTab === "sanity" ? (
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
          ) : (
            <AdminTipBox
              title="Network profiles (Airtable)"
              icon={Users}
              storageKey="rellia-admin-network-profiles-tip-collapsed-v1"
              defaultExpanded
              className="mb-6"
            >
              <div className="space-y-3 font-urbanist text-sm text-muted-foreground">
                <p>
                  Alumni companies and advisors are maintained in <strong>Airtable</strong> (founders and advisors
                  directories). This tab is a <strong>read-only</strong> view — nothing here writes back to Airtable.
                </p>
                <p>
                  <strong>Site status</strong> compares each row to Sanity: <em>No CMS draft</em>, <em>Draft in CMS</em>,
                  or <em>Live</em>. Profiles without a CMS draft show a dot beside the name. Click a profile to review,
                  preview sections, and sync to CMS.
                </p>
                <p>
                  Planned workflow: when a profile is marked ready in Airtable, sync creates a <strong>Sanity draft</strong>,
                  posts to <code className="text-xs">#website-inbox</code>, and an admin publishes in Studio after review.
                  Publishing always happens in Sanity — not automatically from Airtable.
                </p>
                <p>
                  <strong>Gaps</strong> flags required fields still missing before a profile is ready for website review
                  (logo, bio, headshot, expertise tags, etc.). Founder descriptions stay blank on the public site when
                  empty in Airtable.
                </p>
                <p>
                  Structural Airtable changes (new columns, select options) should be made on a <strong>duplicated base</strong> first,
                  then promoted after field mapping is confirmed. Tech Category is not wired to CMS filters yet — pending client decision.
                </p>
              </div>
            </AdminTipBox>
          )}

          <Tabs
            value={sourceTab}
            onValueChange={(value) => setSourceTab(value as ContentSourceTab)}
            className="space-y-4"
          >
            <TabsList className={adminSegmentedTabsListClass}>
              <TabsTrigger value="sanity" className={adminSegmentedTabTriggerClass}>
                Sanity CMS
                <span className={adminSegmentedTabCountClass}>{allRows.length}</span>
              </TabsTrigger>
              <TabsTrigger value="airtable" className={adminSegmentedTabTriggerClass}>
                Network profiles
                <span className={adminSegmentedTabCountClass}>
                  {(airtableQueueQuery.data?.founders.length ?? 0) +
                    (airtableQueueQuery.data?.advisors.length ?? 0)}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sanity" className="mt-0 space-y-4">
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
            </TabsContent>

            <TabsContent value="airtable" className="mt-0">
              <AdminAirtableDirectoryPanel
                data={airtableQueueQuery.data}
                isLoading={airtableQueueQuery.isLoading}
                error={airtableQueueQuery.error}
                onRefresh={handleRefreshAirtableQueue}
                isRefreshing={airtableQueueQuery.isFetching && !airtableQueueQuery.isLoading}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
      </AdminPageReveal>
    </div>
  )
}

export default AdminContentPage
