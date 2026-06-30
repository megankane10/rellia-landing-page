import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ExternalLink,
  Globe,
  Loader2,
  PenLine,
  X,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import AdminPageReveal from "@/components/admin/AdminPageReveal"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  airtableDirectoryDetailQueryKey,
  airtableDirectoryQueryKey,
  fetchAirtableDirectoryDetail,
  syncAirtableProfileToSanity,
} from "@/lib/adminAirtableDirectory"
import type { AirtableDirectoryKind } from "@shared/admin/airtableDirectoryMeta"
import {
  adminInteractiveBoxClass,
  adminOutlineActionButtonClass,
} from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

const parseKind = (value: string | undefined): AirtableDirectoryKind | null =>
  value === "founder" || value === "advisor" ? value : null

const profileInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase()
  }
  return name.charAt(0).toUpperCase() || "?"
}

const AdminNetworkProfileDetailPage = () => {
  const { kind: kindParam, recordId = "" } = useParams<{ kind: string; recordId: string }>()
  const kind = parseKind(kindParam)
  const { session } = useAuth()
  const token = session?.access_token ?? ""
  const queryClient = useQueryClient()
  const [coverageOpen, setCoverageOpen] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const detailQuery = useQuery({
    queryKey: kind ? airtableDirectoryDetailQueryKey(kind, recordId) : ["admin-airtable-detail-invalid"],
    queryFn: () => fetchAirtableDirectoryDetail(token, kind!, recordId),
    enabled: Boolean(token && kind && recordId),
  })

  const syncMutation = useMutation({
    mutationFn: () => syncAirtableProfileToSanity(token, kind!, recordId),
    onSuccess: async (result) => {
      setSyncError(null)
      await queryClient.invalidateQueries({ queryKey: airtableDirectoryQueryKey })
      await queryClient.invalidateQueries({ queryKey: airtableDirectoryDetailQueryKey(kind!, recordId) })
      window.open(result.studioUrl, "_blank", "noopener,noreferrer")
    },
    onError: (error: Error) => setSyncError(error.message),
  })

  const profile = detailQuery.data

  const statusBanner = useMemo(() => {
    if (!profile) return null
    if (profile.siteStatus === "published") {
      return {
        title: "Live on the website",
        description: "This profile is published in Sanity and visible on the public site.",
        className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100",
        icon: Globe,
      }
    }
    if (profile.siteStatus === "draft") {
      return {
        title: "Draft in CMS — not live yet",
        description: "A Sanity draft exists. Review in Studio and click Publish when ready.",
        className: "border-sky-500/30 bg-sky-500/10 text-sky-950 dark:text-sky-100",
        icon: PenLine,
      }
    }
    return {
      title: "Not on the website",
      description: "This Airtable profile has not been synced to Sanity yet, or the CMS draft was removed.",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100",
      icon: PenLine,
    }
  }, [profile])

  if (!kind) {
    return (
      <p className="font-urbanist text-sm text-destructive">Invalid profile type.</p>
    )
  }

  return (
    <AdminPageReveal>
      <div className="space-y-6">
        <Link
          to="/admin/content?source=airtable"
          className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to network profiles
        </Link>

        {detailQuery.isLoading ? (
          <div className="flex items-center gap-2 font-urbanist text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Loading profile…
          </div>
        ) : null}

        {detailQuery.error ? (
          <p className="font-urbanist text-sm text-destructive">
            {detailQuery.error instanceof Error ? detailQuery.error.message : "Could not load profile."}
          </p>
        ) : null}

        {profile && statusBanner ? (
          <>
            <div className={cn("rounded-2xl border p-5 md:p-6", statusBanner.className)}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-current/15 bg-white/50 dark:bg-black/10">
                    <statusBanner.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <h1 className="font-host-grotesk text-xl font-bold md:text-2xl">{profile.displayName}</h1>
                    <p className="mt-1 font-host-grotesk text-base font-semibold">{statusBanner.title}</p>
                    <p className="mt-2 max-w-2xl font-urbanist text-sm opacity-90">{statusBanner.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.publicUrl ? (
                    <Button type="button" variant="outline" asChild className={adminOutlineActionButtonClass}>
                      <a href={profile.publicUrl} target="_blank" rel="noopener noreferrer">
                        View on site
                        <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
                      </a>
                    </Button>
                  ) : null}
                  {profile.sanityStudioUrl ? (
                    <Button type="button" variant="outline" asChild className={adminOutlineActionButtonClass}>
                      <a href={profile.sanityStudioUrl} target="_blank" rel="noopener noreferrer">
                        {profile.siteStatus === "published" ? "Edit in Studio" : "Open in Studio"}
                        <PenLine className="ml-2 h-4 w-4" aria-hidden />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="bg-rellia-teal text-white hover:bg-rellia-teal/90"
                      disabled={syncMutation.isPending}
                      onClick={() => syncMutation.mutate()}
                    >
                      {syncMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                      ) : null}
                      Create CMS draft
                    </Button>
                  )}
                  {profile.airtableRecordUrl ? (
                    <Button type="button" variant="outline" asChild className={adminOutlineActionButtonClass}>
                      <a href={profile.airtableRecordUrl} target="_blank" rel="noopener noreferrer">
                        Open in Airtable
                        <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            {syncError ? (
              <p className="font-urbanist text-sm text-destructive">{syncError}</p>
            ) : null}

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-host-grotesk text-lg font-bold text-foreground">Website preview</h2>
              <p className="mt-1 font-urbanist text-sm text-muted-foreground">
                Sections built from Airtable data. Missing sections stay off the public profile.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {profile.previewSections.map((section) => (
                  <div
                    key={section.id}
                    className={cn(
                      "rounded-xl border p-4",
                      section.complete ? "border-border/80 bg-card" : "border-dashed border-border/80 bg-muted/20",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          section.complete
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {section.complete ? (
                          <Check className="h-4 w-4" aria-hidden />
                        ) : (
                          <X className="h-4 w-4" aria-hidden />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-host-grotesk text-sm font-bold text-foreground">{section.title}</h3>
                        <p className="mt-1 font-urbanist text-xs text-muted-foreground">{section.message}</p>
                        {section.previewImageUrl ? (
                          <img
                            src={section.previewImageUrl}
                            alt=""
                            className="mt-3 max-h-28 rounded-lg border border-border/70 object-contain"
                          />
                        ) : null}
                        {section.previewText ? (
                          <p className="mt-3 line-clamp-4 font-urbanist text-sm leading-relaxed text-foreground/80">
                            {section.previewText}
                          </p>
                        ) : null}
                        {section.tags && section.tags.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {section.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-0.5 font-urbanist text-[11px] font-semibold text-black/70"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Collapsible open={coverageOpen} onOpenChange={setCoverageOpen}>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
                  <div>
                    <h2 className="font-host-grotesk text-base font-bold text-foreground">Completion status</h2>
                    <p className="font-urbanist text-sm text-muted-foreground">
                      Airtable field mapping and whether each value is live on the site
                    </p>
                  </div>
                  <ChevronDown
                    className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform", coverageOpen && "rotate-180")}
                    aria-hidden
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="overflow-x-auto border-t border-border px-5 py-4">
                    <table className="w-full min-w-[36rem] font-urbanist text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                          <th className="py-2 pr-4">Airtable field</th>
                          <th className="py-2 pr-4">Filled</th>
                          <th className="py-2 pr-4">Maps to</th>
                          <th className="py-2 pr-4">Live on site</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.fieldCoverage.map((field) => (
                          <tr key={field.airtableField} className="border-b border-border/60">
                            <td className="py-2.5 pr-4 font-medium">{field.airtableField}</td>
                            <td className="py-2.5 pr-4">
                              {field.filled ? (
                                <Check className="h-4 w-4 text-emerald-600" aria-label="Yes" />
                              ) : (
                                <X className="h-4 w-4 text-muted-foreground" aria-label="No" />
                              )}
                            </td>
                            <td className="py-2.5 pr-4 text-muted-foreground">
                              {field.mappedToSanity ?? "—"}
                            </td>
                            <td className="py-2.5">
                              {field.liveOnSite ? (
                                <Check className="h-4 w-4 text-emerald-600" aria-label="Yes" />
                              ) : (
                                <X className="h-4 w-4 text-muted-foreground" aria-label="No" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            <div className={cn(adminInteractiveBoxClass, "p-4 font-urbanist text-sm text-muted-foreground")}>
              <strong className="text-foreground">How admins approve:</strong> use{" "}
              <strong>Create CMS draft</strong> (or set <em>Website status → Ready for review</em> in Airtable when
              automation is enabled). Then open Studio, review the draft, and click <strong>Publish</strong>. Publishing
              cannot be done from this admin — only from Sanity Studio.
            </div>
          </>
        ) : null}
      </div>
    </AdminPageReveal>
  )
}

export default AdminNetworkProfileDetailPage
