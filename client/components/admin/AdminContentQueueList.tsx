import { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { FileEdit } from "lucide-react"
import {
  formatCmsContentRelative,
  formatCmsDocumentTypeLabel,
  studioUrlForRow,
  type SanityContentRow,
} from "@/lib/adminSanityContent"
import { cn } from "@/lib/utils"

type AdminContentQueueListProps = {
  rows: SanityContentRow[]
  isLoading: boolean
  error: Error | null
  dataset: string
  emptyTitle?: string
  groupByType?: boolean
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
      className:
        "border border-amber-200/70 bg-amber-50 text-amber-800 hover:bg-amber-50 dark:border-amber-500/70 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/10",
    }
  }
  return {
    label: "Published",
    title: "Published in this dataset; recently edited (no separate draft open)",
      className:
        "border border-rellia-teal/70 bg-rellia-mint/20 text-rellia-teal hover:bg-rellia-mint/20 dark:border-rellia-mint/70 dark:bg-rellia-mint/10 dark:text-rellia-mint dark:hover:bg-rellia-mint/10",
  }
}

const ContentCard = ({ row }: { row: SanityContentRow }) => {
  const badge = statusBadge(row.status)
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 transition-shadow hover:shadow-[0_6px_24px_-18px_rgba(13,53,64,0.22)]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="min-w-0 flex-1 font-host-grotesk text-sm text-foreground">
            {row.title || row._id}
          </p>
          <Badge
            title={badge.title}
            className={cn("shrink-0 rounded-full font-urbanist text-[10px] font-medium", badge.className)}
          >
            {badge.label}
          </Badge>
        </div>
        <p className="mt-1 font-urbanist text-xs text-muted-foreground">
          {formatCmsDocumentTypeLabel(row._type)} · {formatCmsContentRelative(row._updatedAt)}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        asChild
        className="h-8 w-fit rounded-full border-rellia-teal/20 px-3 text-xs text-rellia-teal hover:bg-rellia-mint/15"
      >
        <a
          href={studioUrlForRow(row)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${row.title ?? row._type} in Sanity Studio`}
        >
          Review in Studio
          <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
        </a>
      </Button>
    </li>
  )
}

type ContentTypeSectionProps = {
  type: string
  items: SanityContentRow[]
  defaultOpen?: boolean
}

const ContentTypeSection = ({ type, items, defaultOpen = false }: ContentTypeSectionProps) => {
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
}: AdminContentQueueListProps) => {
  if (isLoading) {
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
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <ContentCard key={`${row.status}-${row._id}`} row={row} />
        ))}
      </ul>
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
