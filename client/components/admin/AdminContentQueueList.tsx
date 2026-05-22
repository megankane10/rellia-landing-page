import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { FileEdit } from "lucide-react"
import {
  formatCmsContentRelative,
  studioUrlForRow,
  type SanityContentRow,
} from "@/lib/adminSanityContent"
import { cn } from "@/lib/utils"

const formatTypeLabel = (type: string) =>
  type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim()

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

const ContentCard = ({ row }: { row: SanityContentRow }) => (
  <li className="flex flex-col justify-between gap-4 rounded-2xl border border-black/[0.07] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
    <div className="min-w-0">
      <div className="flex flex-wrap items-start gap-2">
        <p className="min-w-0 flex-1 font-host-grotesk text-base font-semibold text-black">
          {row.title || row._id}
        </p>
        <Badge
          className={cn(
            "shrink-0 rounded-full font-urbanist text-[11px] font-medium",
            row.status === "unpublished"
              ? "bg-amber-100 text-amber-900 hover:bg-amber-100"
              : "bg-rellia-mint/40 text-rellia-teal hover:bg-rellia-mint/40",
          )}
        >
          {row.status === "unpublished" ? "Unpublished" : "Published"}
        </Badge>
      </div>
      <p className="mt-1 font-urbanist text-sm text-black/60">
        {formatCmsContentRelative(row._updatedAt)}
      </p>
    </div>
    <Button
      type="button"
      variant="outline"
      size="sm"
      asChild
      className="w-fit rounded-full border-rellia-teal/20 text-rellia-teal hover:bg-rellia-mint/15"
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
    <div className="space-y-8">
      {groups.map(([type, items]) => (
        <section key={type} aria-labelledby={`content-type-${type}`}>
          <h2
            id={`content-type-${type}`}
            className="mb-3 font-host-grotesk text-sm font-semibold uppercase tracking-[0.12em] text-black/45"
          >
            {formatTypeLabel(type)}
            <span className="ml-2 font-urbanist text-xs font-normal normal-case tracking-normal text-black/40">
              ({items.length})
            </span>
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((row) => (
              <ContentCard key={`${row.status}-${row._id}`} row={row} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default AdminContentQueueList
