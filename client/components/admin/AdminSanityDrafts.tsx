import { useQuery } from "@tanstack/react-query"
import { ExternalLink, FileEdit } from "lucide-react"
import { sanityFetch } from "@/lib/sanity"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { isSanityConfigured } from "@/lib/sanity"

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
  const docId = draft._id.replace(/^drafts\./, "")
  return `${STUDIO_BASE}/${draft._type};${docId}`
}

const AdminSanityDrafts = () => {
  const cmsConfigured = isSanityConfigured()

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-sanity-drafts"],
    queryFn: async () => {
      const rows = await sanityFetch<SanityDraft[]>("sanityDrafts")
      return rows ?? []
    },
    staleTime: 60_000,
    enabled: cmsConfigured,
  })

  const draftCount = data?.length ?? 0

  return (
    <section
      className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white/90 shadow-sm"
      aria-labelledby="sanity-drafts-heading"
    >
      <div className="border-b border-black/[0.06] bg-gradient-to-r from-rellia-mint/15 via-white to-white px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <FileEdit className="mt-0.5 h-5 w-5 shrink-0 text-rellia-teal" aria-hidden />
            <div>
              <h2
                id="sanity-drafts-heading"
                className="font-host-grotesk text-lg font-semibold text-rellia-teal"
              >
                Sanity content drafts
              </h2>
              <p className="mt-1 max-w-2xl font-urbanist text-sm text-black/55">
                Unpublished documents saved in Sanity with a{" "}
                <code className="rounded bg-black/5 px-1 py-0.5 text-[11px]">drafts.</code> ID prefix.
                Editors work in Studio; publishing removes the draft and makes content live on the site.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className="shrink-0 rounded-full border-rellia-teal/20 text-rellia-teal hover:bg-rellia-mint/15"
          >
            <a href={STUDIO_HOME} target="_blank" rel="noopener noreferrer">
              Open Studio
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </a>
          </Button>
        </div>
        <p className="mt-3 font-urbanist text-xs text-black/45">
          {cmsConfigured
            ? `${isLoading ? "Loading" : draftCount} draft${draftCount === 1 ? "" : "s"} awaiting review`
            : "CMS env vars are not configured in this environment"}
        </p>
      </div>

      <div className="px-5 py-4 md:px-6">
        {!cmsConfigured && (
          <p className="font-urbanist text-sm text-black/55">
            Set <code className="text-xs">VITE_SANITY_PROJECT_ID</code> and{" "}
            <code className="text-xs">VITE_SANITY_DATASET</code> to load drafts here. The CMS status pill
            will show &quot;Not set up&quot; until then.
          </p>
        )}

        {cmsConfigured && isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        )}

        {cmsConfigured && error && (
          <p className="font-urbanist text-sm text-red-700">
            Could not load drafts. If CMS shows Offline, check Sanity credentials and the{" "}
            <code className="text-xs">/api/sanity/query</code> proxy.
          </p>
        )}

        {cmsConfigured && data && data.length === 0 && (
          <p className="rounded-xl border border-dashed border-black/10 bg-rellia-cream/40 px-4 py-8 text-center font-urbanist text-sm text-black/55">
            No drafts in queue — published content is up to date.
          </p>
        )}

        {cmsConfigured && data && data.length > 0 && (
          <ul className="divide-y divide-black/[0.06]">
            {data.map((draft) => (
              <li
                key={draft._id}
                className="flex flex-col gap-3 py-4 first:pt-2 last:pb-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-host-grotesk text-sm font-semibold text-black">
                    {draft.title || draft._id}
                  </p>
                  <p className="font-urbanist text-xs text-black/50">
                    {draft._type} · updated {formatRelative(draft._updatedAt)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                  className="shrink-0 rounded-full border-rellia-teal/20 text-rellia-teal hover:bg-rellia-mint/15"
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
      </div>
    </section>
  )
}

export default AdminSanityDrafts
