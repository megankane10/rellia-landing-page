import { useQuery } from "@tanstack/react-query"
import { ExternalLink, FileEdit } from "lucide-react"
import { getSanityDataset, isSanityConfigured, sanityFetch } from "@/lib/sanity"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STUDIO_BASE = "https://relliahealth.sanity.studio/desk"
const STUDIO_HOME = "https://relliahealth.sanity.studio"

type SanityContentRow = {
  _id: string
  _type: string
  title?: string
  _updatedAt?: string
  status: "unpublished" | "published"
}

const formatRelative = (iso?: string) => {
  if (!iso) return "Recently"
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 48) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const studioUrl = (row: SanityContentRow) => {
  const rawId = typeof row._id === "string" ? row._id : ""
  const docId = rawId.replace(/^drafts\./, "")
  if (!docId || !row._type) return STUDIO_HOME
  return `${STUDIO_BASE}/${row._type};${docId}`
}

const isContentRow = (row: {
  _id?: string
  _type?: string
}): row is { _id: string; _type: string; title?: string; _updatedAt?: string } =>
  typeof row?._id === "string" &&
  typeof row?._type === "string" &&
  !row._type.startsWith("sanity.") &&
  row._type !== "system.schema"

const fetchCmsQueue = async (): Promise<SanityContentRow[]> => {
  const [draftRows, recentRows] = await Promise.all([
    sanityFetch<{ _id: string; _type: string; title?: string; _updatedAt?: string }[]>("sanityDrafts"),
    sanityFetch<{ _id: string; _type: string; title?: string; _updatedAt?: string }[]>("sanityRecentEdits"),
  ])

  const drafts = (Array.isArray(draftRows) ? draftRows : [])
    .filter(isContentRow)
    .map((row) => ({
      ...row,
      status: "unpublished" as const,
    }))

  const draftBaseIds = new Set(
    drafts.map((d) => d._id.replace(/^drafts\./, "")),
  )

  const published = (Array.isArray(recentRows) ? recentRows : [])
    .filter(isContentRow)
    .filter((row) => !draftBaseIds.has(row._id))
    .map((row) => ({
      ...row,
      status: "published" as const,
    }))

  return [...drafts, ...published]
}

const AdminSanityDrafts = () => {
  const cmsConfigured = isSanityConfigured()
  const dataset = getSanityDataset() || "not configured"

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-sanity-content-queue", dataset],
    queryFn: fetchCmsQueue,
    staleTime: 60_000,
    enabled: cmsConfigured,
  })

  const rows = data ?? []

  return (
    <section aria-labelledby="sanity-drafts-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="sanity-drafts-heading" className="font-host-grotesk text-lg font-semibold text-black">
            Content drafts
          </h2>
          <p className="mt-1 max-w-2xl font-urbanist text-sm text-black/55">
            Unpublished drafts plus recently edited published pages in the{" "}
            <span className="font-medium text-black/70">{dataset}</span> dataset. Preview-only pages
            appear here after you publish in Studio — not as “missing from main.”
          </p>
          <p className="mt-2 font-host-grotesk text-3xl font-bold text-rellia-teal">
            {cmsConfigured ? (isLoading ? "—" : rows.length) : "—"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          asChild
          className="rounded-full border-rellia-teal/20 text-rellia-teal hover:bg-rellia-mint/15"
        >
          <a href={STUDIO_HOME} target="_blank" rel="noopener noreferrer">
            Open Studio
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
          </a>
        </Button>
      </div>

      {!cmsConfigured && (
        <p className="rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 font-urbanist text-sm text-amber-950">
          CMS is not configured here. Set <code className="text-xs">VITE_SANITY_PROJECT_ID</code> and{" "}
          <code className="text-xs">VITE_SANITY_DATASET</code> to match where you edit content.
        </p>
      )}

      {cmsConfigured && isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      )}

      {cmsConfigured && error && (
        <p className="font-urbanist text-sm text-red-700">
          Could not load content queue. Check CMS credentials and that the admin app queries the same
          dataset as Studio (currently <span className="font-medium">{dataset}</span>).
        </p>
      )}

      {cmsConfigured && !isLoading && !error && rows.length === 0 && (
        <AdminCompactEmptyState
          icon={FileEdit}
          title="No content in queue"
          description={`Nothing to review in the ${dataset} dataset yet.`}
        />
      )}

      {cmsConfigured && !isLoading && !error && rows.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <li
              key={`${row.status}-${row._id}`}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-black/[0.07] bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-host-grotesk text-base font-semibold text-black">
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
                    {row.status === "unpublished" ? "Unpublished draft" : "Published in dataset"}
                  </Badge>
                </div>
                <p className="mt-1 font-urbanist text-sm text-black/60">
                  {row._type} · {formatRelative(row._updatedAt)}
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
                  href={studioUrl(row)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${row.title ?? row._type} in Sanity Studio`}
                >
                  Review in Studio
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
                </a>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default AdminSanityDrafts
