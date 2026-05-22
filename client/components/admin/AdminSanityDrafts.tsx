import { useQuery } from "@tanstack/react-query"
import { ExternalLink } from "lucide-react"
import { sanityFetch } from "@/lib/sanity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

const STUDIO_BASE = "https://relliahealth.sanity.studio/desk"

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
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-sanity-drafts"],
    queryFn: async () => {
      const rows = await sanityFetch<SanityDraft[]>("sanityDrafts")
      return rows ?? []
    },
    staleTime: 60_000,
  })

  return (
    <Card className="rounded-[20px] border border-black/10 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="font-host-grotesk text-lg text-rellia-teal">
          Content drafts pending review
        </CardTitle>
        <CardDescription className="font-urbanist text-sm text-black/55">
          Unpublished Sanity documents — open in Studio to edit or publish.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        )}
        {error && (
          <p className="font-urbanist text-sm text-black/60">
            Could not load drafts. Check CMS configuration.
          </p>
        )}
        {data && data.length === 0 && (
          <p className="font-urbanist text-sm text-black/55">No drafts in queue.</p>
        )}
        {data && data.length > 0 && (
          <ul className="divide-y divide-black/8">
            {data.map((draft) => (
              <li
                key={draft._id}
                className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-host-grotesk text-sm font-semibold text-black">
                    {draft.title || draft._id}
                  </p>
                  <p className="font-urbanist text-xs text-black/50">
                    {draft._type} · {formatRelative(draft._updatedAt)}
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
                    Open in Studio
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminSanityDrafts
