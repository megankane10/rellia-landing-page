import { useEffect, useMemo, useState } from "react"
import { ExternalLink, RefreshCw, Search, Users } from "lucide-react"
import { Link } from "react-router-dom"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import AdminRecordList from "@/components/admin/AdminRecordList"
import AdminSelectFilter from "@/components/admin/AdminSelectFilter"
import {
  adminOutlineActionButtonClass,
  adminTableActionsClusterClass,
  adminTableActionsColumnClass,
  adminToolbarSearchInputClass,
} from "@/components/admin/adminThemeClasses"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import type { AirtableDirectoryQueuePayload, AirtableDirectoryQueueRow } from "@shared/admin/airtableDirectoryMeta"
import { networkProfileAdminPath } from "@/lib/adminAirtableDirectory"
import type { AdminTableColumn } from "@/components/admin/AdminDataTable"
import { cn } from "@/lib/utils"

type AirtableKindFilter = "all" | "founder" | "advisor"
type AirtableStatusFilter = "all" | "not_on_site" | "draft" | "published"

const PAGE_SIZE = 20

const siteStatusLabel: Record<AirtableDirectoryQueueRow["siteStatus"], string> = {
  not_on_site: "Not on site",
  draft: "Draft in CMS",
  published: "Live",
}

const siteStatusClass: Record<AirtableDirectoryQueueRow["siteStatus"], string> = {
  not_on_site: "bg-amber-500/15 text-amber-900 dark:text-amber-200",
  draft: "bg-sky-500/15 text-sky-900 dark:text-sky-200",
  published: "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200",
}

const matchesNetworkSearch = (row: AirtableDirectoryQueueRow, query: string): boolean => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    row.displayName,
    row.organization ?? "",
    row.slugCandidate,
    row.kind === "founder" ? "alumni" : "advisor",
    siteStatusLabel[row.siteStatus],
    row.missingForPublish.join(" "),
  ]
    .join(" ")
    .toLowerCase()
  return haystack.includes(q)
}

const profileInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase()
  }
  return name.charAt(0).toUpperCase() || "?"
}

const ProfileNameLink = ({ row }: { row: AirtableDirectoryQueueRow }) => (
  <Link
    to={networkProfileAdminPath(row.kind, row.airtableRecordId)}
    className="truncate font-medium text-rellia-teal underline-offset-4 hover:underline"
  >
    {row.displayName}
  </Link>
)

const OpenInAirtableButton = ({ row }: { row: AirtableDirectoryQueueRow }) => {
  if (!row.airtableRecordUrl) return null

  return (
    <Button
      type="button"
      variant="outline"
      asChild
      className={cn(adminOutlineActionButtonClass, "h-10 px-4 text-sm")}
    >
      <a
        href={row.airtableRecordUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${row.displayName} in Airtable`}
      >
        Open in Airtable
        <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
      </a>
    </Button>
  )
}

const OpenInStudioButton = ({ row }: { row: AirtableDirectoryQueueRow }) => {
  if (!row.sanityStudioUrl) return null

  return (
    <Button
      type="button"
      variant="outline"
      asChild
      className={cn(adminOutlineActionButtonClass, "h-10 px-4 text-sm")}
    >
      <a
        href={row.sanityStudioUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${row.displayName} in Sanity Studio`}
      >
        Open in Studio
        <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
      </a>
    </Button>
  )
}

const ProfileRowActions = ({ row }: { row: AirtableDirectoryQueueRow }) => (
  <div className={adminTableActionsClusterClass}>
    <OpenInAirtableButton row={row} />
    <OpenInStudioButton row={row} />
  </div>
)

type AdminAirtableDirectoryPanelProps = {
  data?: AirtableDirectoryQueuePayload
  isLoading: boolean
  error: Error | null
  onRefresh?: () => void
  isRefreshing?: boolean
}

const AdminAirtableDirectoryPanel = ({
  data,
  isLoading,
  error,
  onRefresh,
  isRefreshing = false,
}: AdminAirtableDirectoryPanelProps) => {
  const [kindFilter, setKindFilter] = useState<AirtableKindFilter>("all")
  const [statusFilter, setStatusFilter] = useState<AirtableStatusFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)

  const allRows = useMemo(() => {
    const founders = data?.founders ?? []
    const advisors = data?.advisors ?? []
    return [...founders, ...advisors]
  }, [data])

  const statusFilteredRows = useMemo(
    () =>
      allRows.filter((row) => {
        if (kindFilter !== "all" && row.kind !== kindFilter) return false
        if (statusFilter !== "all" && row.siteStatus !== statusFilter) return false
        return true
      }),
    [allRows, kindFilter, statusFilter],
  )

  const filteredRows = useMemo(
    () => statusFilteredRows.filter((row) => matchesNetworkSearch(row, searchQuery)),
    [searchQuery, statusFilteredRows],
  )

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [filteredRows, page])

  useEffect(() => {
    setPage(1)
  }, [kindFilter, statusFilter, searchQuery])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const kindOptions = useMemo(
    () => [
      { value: "all" as const, label: "All profiles", count: allRows.length },
      {
        value: "founder" as const,
        label: "Alumni",
        count: allRows.filter((r) => r.kind === "founder").length,
      },
      {
        value: "advisor" as const,
        label: "Advisors",
        count: allRows.filter((r) => r.kind === "advisor").length,
      },
    ],
    [allRows],
  )

  const statusOptions = useMemo(
    () => [
      { value: "all" as const, label: "All statuses", count: statusFilteredRows.length },
      {
        value: "not_on_site" as const,
        label: "Not on site",
        count: allRows.filter((r) => r.siteStatus === "not_on_site").length,
      },
      {
        value: "draft" as const,
        label: "CMS drafts",
        count: allRows.filter((r) => r.siteStatus === "draft").length,
      },
      {
        value: "published" as const,
        label: "Live",
        count: allRows.filter((r) => r.siteStatus === "published").length,
      },
    ],
    [allRows, statusFilteredRows.length],
  )

  const columns: AdminTableColumn<AirtableDirectoryQueueRow>[] = [
    {
      key: "name",
      header: "Profile",
      cell: (row) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0 rounded-xl border border-border/80">
            {row.imageUrl ? <AvatarImage src={row.imageUrl} alt="" /> : null}
            <AvatarFallback className="rounded-xl bg-rellia-mint/20 font-urbanist text-xs font-semibold text-rellia-teal">
              {profileInitials(row.displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <ProfileNameLink row={row} />
            {row.organization && row.kind === "advisor" ? (
              <p className="truncate font-urbanist text-xs text-muted-foreground">{row.organization}</p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      key: "kind",
      header: "Type",
      cell: (row) => (
        <span className="font-urbanist text-sm text-muted-foreground">
          {row.kind === "founder" ? "Alumni" : "Advisor"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Site status",
      cell: (row) => (
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 font-urbanist text-xs font-semibold",
            siteStatusClass[row.siteStatus],
          )}
        >
          {siteStatusLabel[row.siteStatus]}
        </span>
      ),
    },
    {
      key: "gaps",
      header: "Gaps",
      cell: (row) => (
        <span className="font-urbanist text-sm text-muted-foreground">
          {row.missingForPublish.length > 0
            ? `${row.missingForPublish.length} required field${row.missingForPublish.length === 1 ? "" : "s"}`
            : "Ready to review"}
        </span>
      ),
    },
    {
      key: "action",
      header: "Actions",
      className: cn("min-w-[11.5rem] shrink-0", adminTableActionsColumnClass),
      cell: (row) => <ProfileRowActions row={row} />,
    },
  ]

  const emptyMessage =
    searchQuery.trim() && statusFilteredRows.length > 0
      ? "No profiles match your search. Try a different name, company, or status."
      : "No profiles match the current filters."

  const emptyTitle =
    searchQuery.trim() && statusFilteredRows.length > 0 ? "No matches" : "No profiles"

  const showingFrom = filteredRows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const showingTo = Math.min(page * PAGE_SIZE, filteredRows.length)

  return (
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
            placeholder="Search name, company, or status…"
            className={cn("h-10 w-full pl-9", adminToolbarSearchInputClass)}
            aria-label="Search network profiles"
          />
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            className={cn(adminOutlineActionButtonClass, "h-10 px-4 text-sm")}
            onClick={onRefresh}
            disabled={!onRefresh || isRefreshing}
            aria-label="Refresh network profiles from Airtable"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} aria-hidden />
            Refresh
          </Button>
          <AdminSelectFilter
            value={kindFilter}
            onChange={(value) => setKindFilter(value as AirtableKindFilter)}
            options={kindOptions}
            ariaLabel="Filter network profiles by type"
            className="w-full sm:w-auto"
          />
          <AdminSelectFilter
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as AirtableStatusFilter)}
            options={statusOptions}
            ariaLabel="Filter network profiles by site status"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="font-urbanist text-sm text-destructive">
          {error.message || "Could not load network profiles from Airtable."}
        </p>
      ) : null}

      {!isLoading && !error && filteredRows.length === 0 ? (
        <AdminCompactEmptyState icon={Users} title={emptyTitle} description={emptyMessage} />
      ) : null}

      {!isLoading && !error && filteredRows.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm [&_ul]:p-3 [&_ul]:md:p-0">
            <AdminRecordList
              rows={pageRows}
              getRowKey={(row) => `${row.kind}-${row.airtableRecordId}`}
              columns={columns}
              mobileFields={[
                {
                  label: "Profile",
                  value: (row) => (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                        {row.imageUrl ? <AvatarImage src={row.imageUrl} alt="" /> : null}
                        <AvatarFallback className="rounded-lg bg-rellia-mint/20 text-[10px] font-semibold text-rellia-teal">
                          {profileInitials(row.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <ProfileNameLink row={row} />
                    </div>
                  ),
                },
                { label: "Status", value: (row) => siteStatusLabel[row.siteStatus] },
                {
                  label: "Gaps",
                  value: (row) =>
                    row.missingForPublish.length > 0
                      ? row.missingForPublish.join(", ")
                      : "Ready to review",
                },
              ]}
              mobileActions={(row) => <ProfileRowActions row={row} />}
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="shrink-0 font-urbanist text-sm text-muted-foreground">
              Showing {showingFrom}–{showingTo} of {filteredRows.length}{" "}
              {filteredRows.length === 1 ? "profile" : "profiles"}
            </p>
            {totalPages > 1 ? (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        setPage((p) => Math.max(1, p - 1))
                      }}
                      className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === page}
                        onClick={(event) => {
                          event.preventDefault()
                          setPage(pageNumber)
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        setPage((p) => Math.min(totalPages, p + 1))
                      }}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default AdminAirtableDirectoryPanel
