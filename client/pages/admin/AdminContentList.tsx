import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminContentQueueList from "@/components/admin/AdminContentQueueList"
import {
  cmsContentQueryKey,
  fetchCmsContentQueue,
  isCmsContentEnabled,
} from "@/lib/adminSanityContent"
import { getSanityDataset } from "@/lib/sanity"
import { cn } from "@/lib/utils"

type ContentFilter = "all" | "unpublished" | "published"

const STUDIO_HOME = "https://relliahealth.sanity.studio"

const AdminContentList = () => {
  const dataset = getSanityDataset() || "not configured"
  const cmsConfigured = isCmsContentEnabled()
  const [filter, setFilter] = useState<ContentFilter>("all")

  const { data, isLoading, error } = useQuery({
    queryKey: cmsContentQueryKey(),
    queryFn: fetchCmsContentQueue,
    staleTime: 60_000,
    enabled: cmsConfigured,
  })

  const allRows = data ?? []

  const filtered = useMemo(() => {
    if (filter === "unpublished") return allRows.filter((r) => r.status === "unpublished")
    if (filter === "published") return allRows.filter((r) => r.status === "published")
    return allRows
  }, [allRows, filter])

  const counts = useMemo(
    () => ({
      all: allRows.length,
      unpublished: allRows.filter((r) => r.status === "unpublished").length,
      published: allRows.filter((r) => r.status === "published").length,
    }),
    [allRows],
  )

  const filterOptions: { id: ContentFilter; label: string }[] = [
    { id: "all", label: `All (${counts.all})` },
    { id: "unpublished", label: `Unpublished (${counts.unpublished})` },
    { id: "published", label: `Recently edited (${counts.published})` },
  ]

  return (
    <div className="space-y-8">
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-1.5 font-urbanist text-sm text-rellia-teal/80 transition-colors hover:text-rellia-teal"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Dashboard
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-host-grotesk text-2xl font-bold text-black md:text-3xl">
            Content drafts
          </h1>
          <p className="mt-2 font-urbanist text-sm text-black/60">
            Dataset: <span className="font-medium text-rellia-teal">{dataset}</span>
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
          CMS is not configured. Set <code className="text-xs">VITE_SANITY_PROJECT_ID</code> and{" "}
          <code className="text-xs">VITE_SANITY_DATASET</code> on this deployment.
        </p>
      )}

      {cmsConfigured && (
        <>
          <div className="rounded-2xl border border-rellia-teal/15 bg-rellia-mint/10 px-5 py-4 font-urbanist text-sm leading-relaxed text-black/75">
            <p className="font-host-grotesk font-semibold text-rellia-teal">How this list works</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                <strong>Draft</strong> — document exists only as an unpublished draft in Sanity (
                <code className="text-xs">drafts.*</code> id). Not on the public site until you publish
                in Studio.
              </li>
              <li>
                <strong>Published</strong> — document is published in this dataset and was edited
                recently; there is no open draft for it right now.
              </li>
              <li>
                <strong>Categories</strong> — grouped by Sanity document type (
                <code className="text-xs">_type</code>), e.g. <em>Advisor</em> vs{" "}
                <em>Advisor filter tag</em> are different schemas, not duplicates.
              </li>
            </ul>
          </div>

          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter content by status"
          >
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={filter === opt.id}
                onClick={() => setFilter(opt.id)}
                className={cn(
                  "rounded-full border px-4 py-1.5 font-urbanist text-sm transition-colors",
                  filter === opt.id
                    ? "border-rellia-teal/30 bg-rellia-teal text-white"
                    : "border-black/10 bg-white text-black/65 hover:border-rellia-teal/20 hover:text-rellia-teal",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <AdminContentQueueList
            rows={filtered}
            isLoading={isLoading}
            error={error}
            dataset={dataset}
            emptyTitle={
              filter === "unpublished"
                ? "No unpublished drafts"
                : filter === "published"
                  ? "No recently edited documents"
                  : "No content in queue"
            }
            groupByType
          />
        </>
      )}
    </div>
  )
}

export default AdminContentList
