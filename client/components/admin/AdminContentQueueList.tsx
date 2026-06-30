import { useState } from "react"
import { ArrowUpRight, ChevronDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import AdminRecordList from "@/components/admin/AdminRecordList"
import type { AdminTableColumn } from "@/components/admin/AdminDataTable"
import { FileEdit } from "lucide-react"
import {
  formatCmsContentRelative,
  formatCmsDocumentTypeLabel,
  publicWebsiteUrlForRow,
  studioUrlForRow,
  type SanityContentRow,
} from "@/lib/adminSanityContent"
import { adminOutlineActionButtonClass, adminPendingSurfaceClass, adminStatusBadgeShellClass, adminTableActionsClusterClass, adminTableActionsColumnClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

type AdminContentQueueListProps = {
  rows: SanityContentRow[]
  isLoading: boolean
  error: Error | null
  dataset: string
  emptyTitle?: string
  groupByType?: boolean
  updatedColumnLabel?: string
}

const groupRowsByType = (rows: SanityContentRow[]) => {
  const map = new Map<string, SanityContentRow[]>()
  for (const row of rows) {
    const list = map.get(row._type) ?? []
    list.push(row)
    map.set(row._type, list)
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
}

const statusBadge = (status: SanityContentRow["status"]) => {
  if (status === "unpublished") {
    return {
      label: "Draft",
      title: "Saved in Studio but not published — not visible on the live site",
      className: cn(
        "border hover:bg-orange-50 dark:hover:bg-orange-500/10",
        adminPendingSurfaceClass,
      ),
    }
  }
  return {
    label: "Published",
    title: "Published in this dataset; recently edited (no separate draft open)",
      className:
        "border border-rellia-teal/70 bg-rellia-mint/20 text-rellia-teal hover:bg-rellia-mint/20 dark:border-rellia-mint/70 dark:bg-rellia-mint/10 dark:text-rellia-mint dark:hover:bg-rellia-mint/10",
  }
}

const ContentTitle = ({ row }: { row: SanityContentRow }) => {
  const label = row.title || row._id
  const publicUrl = publicWebsiteUrlForRow(row)

  if (!publicUrl) {
    return <span className="font-host-grotesk font-medium text-foreground">{label}</span>
  }

  return (
    <a
      href={publicUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-host-grotesk font-medium text-rellia-teal underline-offset-4 hover:underline"
      aria-label={`View ${label} on the website`}
    >
      <span>{label}</span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
    </a>
  )
}

const StudioLinkButton = ({ row }: { row: SanityContentRow }) => (
  <Button
    type="button"
    variant="outline"
    asChild
    className={cn(adminOutlineActionButtonClass, "h-10 px-4 text-sm")}
  >
    <a
      href={studioUrlForRow(row)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${row.title ?? row._type} in Sanity Studio`}
    >
      View in Studio
      <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
    </a>
  </Button>
)

const StatusBadge = ({ status }: { status: SanityContentRow["status"] }) => {
  const badge = statusBadge(status)
  return (
    <Badge
      variant="outline"
      title={badge.title}
      className={cn(
        adminStatusBadgeShellClass,
        badge.className,
      )}
    >
      {badge.label}
    </Badge>
  )
}

const draftTableColumns = (updatedColumnLabel: string): AdminTableColumn<SanityContentRow>[] => [
  {
    key: "title",
    header: "Title",
    className: "min-w-[12rem]",
    cell: (row) => <ContentTitle row={row} />,
  },
  {
    key: "type",
    header: "Type",
    className: "min-w-[6rem] whitespace-nowrap",
    cell: (row) => formatCmsDocumentTypeLabel(row._type),
  },
  {
    key: "updated",
    header: updatedColumnLabel,
    className: "min-w-[6.5rem] whitespace-nowrap",
    cell: (row) => (
      <span className="text-muted-foreground">{formatCmsContentRelative(row._updatedAt)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "min-w-[6rem] whitespace-nowrap",
    cell: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "action",
    header: "Actions",
    className: cn("min-w-[11.5rem] shrink-0", adminTableActionsColumnClass),
    cell: (row) => (
      <div className={adminTableActionsClusterClass}>
        <StudioLinkButton row={row} />
      </div>
    ),
  },
]

const ContentCard = ({ row }: { row: SanityContentRow }) => {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 transition-shadow hover:shadow-[0_6px_24px_-18px_rgba(13,53,64,0.22)]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <ContentTitle row={row} />
          </div>
          <StatusBadge status={row.status} />
        </div>
        <p className="mt-1 font-urbanist text-xs text-muted-foreground">
          {formatCmsDocumentTypeLabel(row._type)} · {formatCmsContentRelative(row._updatedAt)}
        </p>
      </div>
      <StudioLinkButton row={row} />
    </li>
  )
}

type ContentTypeSectionProps = {
  type: string
  items: SanityContentRow[]
  defaultOpen?: boolean
}

const ContentTypeSection = ({ type, items, defaultOpen = true }: ContentTypeSectionProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const label = formatCmsDocumentTypeLabel(type)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-2xl border border-border bg-rellia-greyTeal/30">
      <CollapsibleTrigger
        type="button"
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 rounded-2xl"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="font-host-grotesk text-lg text-rellia-teal md:text-xl">{label}</p>
          <p className="mt-0.5 font-urbanist text-xs text-muted-foreground">
            Sanity schema: <span className="font-mono text-muted-foreground">{type}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-rellia-teal px-2.5 font-host-grotesk text-sm text-white">
            {items.length}
          </span>
          <ChevronDown
            className={cn("h-5 w-5 text-rellia-teal transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="grid gap-3 border-t border-border px-5 pb-5 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((row) => (
            <ContentCard key={`${row.status}-${row._id}`} row={row} />
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

const AdminContentQueueList = ({
  rows,
  isLoading,
  error,
  dataset,
  emptyTitle = "No content in queue",
  groupByType = true,
  updatedColumnLabel = "Updated",
}: AdminContentQueueListProps) => {
  if (isLoading) {
    if (!groupByType) {
      return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="hidden space-y-0 md:block">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-none border-b border-border/60 last:border-0" />
            ))}
          </div>
          <ul className="space-y-3 p-3 md:hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i}>
                <Skeleton className="h-28 rounded-xl" />
              </li>
            ))}
          </ul>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="font-urbanist text-sm text-red-700">
        Could not load content. Check CMS credentials and dataset (
        <span className="font-medium">{dataset}</span>).
      </p>
    )
  }

  if (rows.length === 0) {
    return (
      <AdminCompactEmptyState
        icon={FileEdit}
        title={emptyTitle}
        description={`Nothing to review in the ${dataset} dataset.`}
      />
    )
  }

  if (!groupByType) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm [&_ul]:p-3 [&_ul]:md:p-0">
        <AdminRecordList
          rows={rows}
          getRowKey={(row) => `${row.status}-${row._id}`}
          columns={draftTableColumns(updatedColumnLabel)}
          mobileFields={[
            {
              label: "Title",
              value: (row) => <ContentTitle row={row} />,
            },
            {
              label: "Type",
              value: (row) => formatCmsDocumentTypeLabel(row._type),
            },
            {
              label: updatedColumnLabel,
              value: (row) => formatCmsContentRelative(row._updatedAt),
            },
            {
              label: "Status",
              value: (row) => <StatusBadge status={row.status} />,
            },
          ]}
          mobileActions={(row) => <StudioLinkButton row={row} />}
        />
      </div>
    )
  }

  const groups = groupRowsByType(rows)

  return (
    <div className="space-y-4">
      {groups.map(([type, items]) => (
        <ContentTypeSection key={type} type={type} items={items} />
      ))}
    </div>
  )
}

export default AdminContentQueueList
