import { useQuery } from "@tanstack/react-query"
import { ExternalLink, FileEdit } from "lucide-react"
import { getSanityDataset, isSanityConfigured, sanityFetch } from "@/lib/sanity"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

const STUDIO_BASE = "https://relliahealth.sanity.studio/desk"
const STUDIO_HOME = "https://relliahealth.sanity.studio"

type SanityDraft = {
  _id: string
  _type: string
  title?: string
  _updatedAt?: string
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

const studioUrl = (draft: SanityDraft) => {
  const rawId = typeof draft._id === "string" ? draft._id : ""
  const docId = rawId.replace(/^drafts\./, "")
  if (!docId || !draft._type) return STUDIO_HOME
  return `${STUDIO_BASE}/${draft._type};${docId}`
}

const AdminSanityDrafts = () => {
  const cmsConfigured = isSanityConfigured()
  const dataset = getSanityDataset() || "not configured"

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-sanity-drafts"],
    queryFn: async () => {
      const rows = await sanityFetch<SanityDraft[]>("sanityDrafts")
      if (!Array.isArray(rows)) return []
      return rows.filter(
        (row): row is SanityDraft =>
          typeof row?._id === "string" && typeof row?._type === "string",
      )
    },
    staleTime: 60_000,
    enabled: cmsConfigured,
  })

  const draftCount = data?.length ?? 0

  return (
    <section aria-labelledby="sanity-drafts-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="sanity-drafts-heading" className="font-host-grotesk text-lg font-semibold text-black">
            Content drafts
          </h2>
          <p className="mt-1 font-host-grotesk text-3xl font-bold text-rellia-teal">
            {cmsConfigured ? (isLoading ? "—" : draftCount) : "—"}
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
          Could not load drafts. Check CMS credentials and that the admin app queries the same dataset as Studio (
          currently <span className="font-medium">{dataset}</span>).
        </p>
      )}

      {cmsConfigured && !isLoading && !error && draftCount === 0 && (
        <AdminCompactEmptyState
          icon={FileEdit}
          title="No drafts in queue"
          description={`Nothing unpublished in the ${dataset} dataset.`}
        />
      )}

      {cmsConfigured && data && data.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.map((draft) => (
            <li
              key={draft._id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-black/[0.07] bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-host-grotesk text-base font-semibold text-black">
                  {draft.title || draft._id}
                </p>
                <p className="mt-1 font-urbanist text-sm text-black/60">
                  {draft._type} · {formatRelative(draft._updatedAt)}
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
                  href={studioUrl(draft)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${draft.title ?? draft._type} in Sanity Studio`}
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
