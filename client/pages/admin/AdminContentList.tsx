import { useMemo } from "react"
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
import AdminTipBox from "@/components/admin/AdminTipBox"
import { getSanityDataset } from "@/lib/sanity"
import { FileEdit } from "lucide-react"

const STUDIO_HOME = "https://relliahealth.sanity.studio"

const AdminContentList = () => {
  const dataset = getSanityDataset() || "not configured"
  const cmsConfigured = isCmsContentEnabled()

  const { data, isLoading, error } = useQuery({
    queryKey: cmsContentQueryKey(),
    queryFn: fetchCmsContentQueue,
    staleTime: 60_000,
    enabled: cmsConfigured,
  })

  const draftRows = data ?? []

  const counts = useMemo(
    () => ({
      drafts: draftRows.length,
    }),
    [draftRows],
  )

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
          <h1 className="font-host-grotesk text-2xl font-bold text-foreground md:text-3xl">
            Content drafts
          </h1>
          <p className="mt-2 font-urbanist text-sm text-muted-foreground">
            Dataset: <span className="font-medium text-rellia-teal">{dataset}</span>
            {counts.drafts > 0 ? (
              <>
                {" "}
                · <span className="font-medium text-muted-foreground">{counts.drafts} unpublished</span>
              </>
            ) : null}
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
          <AdminTipBox
            title="How this list works"
            icon={FileEdit}
            storageKey="rellia-admin-content-tip-collapsed"
            className="mb-6"
          >
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Only <strong>unpublished drafts</strong> appear here (
                <code className="text-xs">drafts.*</code> ids in Sanity). They are not on the public
                site until you publish in Studio.
              </li>
              <li>
                <strong>Published</strong> documents are not listed — they stay in Sanity after
                publish and do not accumulate in this queue.
              </li>
              <li>
                <strong>Categories</strong> — grouped by document type (
                <code className="text-xs">_type</code>), e.g. <em>Directory filter group</em> vs{" "}
                <em>Advisor</em>.
              </li>
            </ul>
          </AdminTipBox>

          <AdminContentQueueList
            rows={draftRows}
            isLoading={isLoading}
            error={error}
            dataset={dataset}
            emptyTitle="No unpublished drafts"
            groupByType
          />
        </>
      )}
    </div>
  )
}

export default AdminContentList
