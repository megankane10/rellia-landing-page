import { useState } from "react"
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Cloud,
  DatabaseZap,
  ExternalLink,
  FileText,
  FolderKanban,
  Github,
  Globe,
  Maximize2,
  PenLine,
  Search,
  TableProperties,
  Tags,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminPageReveal from "@/components/admin/AdminPageReveal"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  adminCardClass,
  adminCardTitleClass,
  adminIconTileClass,
  adminInteractiveBoxClass,
  adminInteractiveLinkArrowClass,
  adminInteractiveLinkTitleClass,
  adminOutlineActionButtonClass,
} from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"
import {
  OPERATIONS_DOC_EDIT_URL,
  OPERATIONS_DOC_EMBED_URL,
} from "@shared/cms/operationsDocUrl"
import { AIRTABLE_DIRECTORY_HUB_URL } from "@shared/admin/airtableConfig"

const WEBSITE_TOOLS = [
  {
    href: "https://vercel.com/relliahealth",
    label: "Vercel",
    description: "Hosting and environment variables (production deploy).",
    icon: Cloud,
  },
  {
    href: "https://relliahealth.sanity.studio",
    label: "Sanity Studio",
    description: "Edit pages, stories, events, and program content.",
    icon: PenLine,
  },
  {
    href: "https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy",
    label: "Supabase",
    description: "Auth users, database tables, and invitation emails.",
    icon: DatabaseZap,
  },
  {
    href: "https://github.com/megankane10/rellia-landing-page",
    label: "GitHub",
    description: "Source code and pull requests.",
    icon: Github,
  },
  {
    href: "https://tagmanager.google.com/#/container/accounts/6357523633/containers/253642837/workspaces/4",
    label: "Google Tag Manager",
    description: "Install and manage marketing tags, triggers, and conversion tracking on the public site.",
    icon: Tags,
  },
  {
    href: "https://analytics.google.com/analytics/web/#/a396061604p539275076/reports/intelligenthome",
    label: "Google Analytics 4",
    description: "Monitor website traffic, visitor behavior, and conversion events.",
    icon: BarChart3,
  },
  {
    href: "https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Frelliahealth.com%2F",
    label: "Google Search Console",
    description: "Track search traffic, indexation status, and search visibility.",
    icon: Search,
  },
  {
    href: AIRTABLE_DIRECTORY_HUB_URL,
    label: "Airtable directory",
    description: "Network profiles — alumni companies and advisors source data.",
    icon: TableProperties,
  },
  {
    href: "https://relliahealth.com",
    label: "Public website",
    description: "Open the live marketing site.",
    icon: Globe,
  },
] as const

const cardShellClass = adminCardClass

const AdminHelpPage = () => {
  const [guideOpen, setGuideOpen] = useState(false)

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Help" />

      <AdminPageReveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className={cardShellClass}>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2.5 text-lg", adminCardTitleClass)}>
                <span className={cn("h-9 w-9", adminIconTileClass)}>
                  <FolderKanban className="h-5 w-5" aria-hidden />
                </span>
                Managing Dashboard Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 font-urbanist text-sm leading-relaxed text-muted-foreground">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Changing Status</h4>
                <p>
                  Keep track of submission states (e.g., New, In Progress, Resolved) by updating the status selector on the inbox overview or within each item&apos;s detail view.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Adding a Note</h4>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <strong>From Overview:</strong> Click the note icon next to the trash icon to open the note editor box.
                  </li>
                  <li>
                    <strong>Inside Item:</strong> Scroll to the bottom of the item detail view to find the note field located below the email sender details.
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Deleting Submissions</h4>
                <p>
                  Remove unwanted or spam submissions permanently by clicking the trash icon. A confirmation dialog will appear.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={cardShellClass}>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2.5 text-lg", adminCardTitleClass)}>
                <span className={cn("h-9 w-9", adminIconTileClass)}>
                  <BellRing className="h-5 w-5" aria-hidden />
                </span>
                Slack Integration & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 font-urbanist text-sm leading-relaxed text-muted-foreground">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Instant Notifications</h4>
                <p>
                  Whenever a user submits a contact form, requests investor notifications, or completes the startup diagnostic, our Slack App triggers an instant notification.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Target Channel</h4>
                <p>
                  These alerts are sent directly to the{" "}
                  <code className="rounded bg-rellia-mint/10 px-1 py-0.5 text-xs font-semibold text-rellia-teal">
                    #website-inbox
                  </code>{" "}
                  channel on the Rellia Health Slack workspace.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Collaborative Actions</h4>
                <p>
                  Slack alerts include key details and quick links to view submissions, making it easy to coordinate lead follow-ups.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={cardShellClass}>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2.5 text-lg", adminCardTitleClass)}>
                <span className={cn("h-9 w-9", adminIconTileClass)}>
                  <TableProperties className="h-5 w-5" aria-hidden />
                </span>
                Network profiles (Airtable)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 font-urbanist text-sm leading-relaxed text-muted-foreground">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Where profiles live</h4>
                <p>
                  Founders (alumni companies) and advisors are edited in Airtable. The admin{" "}
                  <strong>Content → Network profiles</strong> tab shows a read-only queue with site status,
                  missing fields, and links to Sanity Studio when a draft exists.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Publishing workflow</h4>
                <p>
                  Airtable is intake and approval; <strong>Sanity Studio</strong> is where you publish. When sync
                  runs, ready profiles become <strong>CMS drafts</strong> only. Slack alerts go to{" "}
                  <code className="rounded bg-rellia-mint/10 px-1 py-0.5 text-xs font-semibold text-rellia-teal">
                    #website-inbox
                  </code>
                  . Nothing goes live until you click <strong>Publish</strong> in Studio.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Reviewing CMS drafts</h4>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Open the profile from <strong>Content → Network profiles</strong> and use the Studio link when a draft exists.</li>
                  <li>In Studio, review the profile copy, images, and directory tags, then click <strong>Publish</strong>.</li>
                  <li>If the queue shows missing fields, update the Airtable record first, then wait for the next sync or ask engineering to re-run sync.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(cardShellClass, "flex flex-col")}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle className={cn("flex items-center gap-2.5 text-lg", adminCardTitleClass)}>
                  <span className={cn("h-9 w-9", adminIconTileClass)}>
                    <FileText className="h-5 w-5" aria-hidden />
                  </span>
                  Operations guide
                </CardTitle>
                <a
                  href={OPERATIONS_DOC_EDIT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    adminOutlineActionButtonClass,
                    "inline-flex items-center gap-2 px-3 py-1.5",
                    "font-urbanist text-xs font-semibold shadow-sm",
                  )}
                >
                  Open in Google Doc
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col font-urbanist text-sm leading-relaxed text-muted-foreground">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">What&apos;s inside</h4>
                <ul className="list-disc space-y-1 pl-5">
                  <li>How to process web forms + diagnostic surveys</li>
                  <li>Publishing flow for CMS content drafts</li>
                  <li>Where key tools live (Vercel, Supabase, Sanity)</li>
                </ul>
              </div>

              <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      adminInteractiveBoxClass,
                      "mt-4 flex w-full flex-1 flex-col items-center justify-center p-6",
                    )}
                    aria-label="Preview operations guide"
                  >
                    <Maximize2 className="mb-3 h-11 w-11 text-rellia-teal dark:text-rellia-mint" aria-hidden />
                    <span className="font-host-grotesk text-lg font-bold text-foreground dark:text-white">Preview</span>
                    <span className="mt-1.5 font-urbanist text-sm font-medium text-muted-foreground">
                      Open full-screen preview
                    </span>
                  </button>
                </DialogTrigger>

                <DialogContent
                  className={cn(
                    "h-[calc(100vh-1.25rem)] w-[calc(100vw-1.25rem)] max-w-none overflow-hidden rounded-3xl border border-border bg-card p-0",
                  )}
                  overlayClassName="bg-black/70"
                  hideClose
                >
                  <div className="flex h-full flex-col">
                    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-card/90 px-5 py-4 backdrop-blur">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-rellia-mint/20 text-rellia-teal">
                          <FileText className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-host-grotesk text-lg font-semibold text-foreground">
                            Operations guide
                          </div>
                          <div className="font-urbanist text-xs text-muted-foreground">Full-screen preview</div>
                        </div>
                      </div>

                      <DialogClose asChild>
                        <button
                          type="button"
                          className={cn(
                            "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm",
                            "transition-colors hover:bg-muted/50 hover:text-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/30",
                          )}
                          aria-label="Close preview"
                        >
                          <span className="text-xl leading-none" aria-hidden>
                            ×
                          </span>
                        </button>
                      </DialogClose>
                    </div>

                    <div className="min-h-0 flex-1 bg-white">
                      <iframe
                        src={OPERATIONS_DOC_EMBED_URL}
                        title="Rellia admin operations guide"
                        className="h-full w-full border-0 bg-white"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4 pt-2">
          <h2 className="font-host-grotesk text-lg font-semibold text-foreground">Quick links</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {WEBSITE_TOOLS.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative flex min-w-0 items-start gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3.5 shadow-sm transition",
                  "hover:-translate-y-px hover:border-rellia-teal/25 hover:bg-rellia-mint/10 hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-rellia-mint/20 text-rellia-teal">
                  <tool.icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className={cn("truncate font-urbanist text-sm font-semibold text-foreground", adminInteractiveLinkTitleClass)}>
                    {tool.label}
                  </div>
                  <div className="mt-0.5 line-clamp-2 font-urbanist text-xs leading-relaxed text-muted-foreground">
                    {tool.description}
                  </div>
                </div>
                <ArrowRight
                  className={cn("mt-1 h-4 w-4 shrink-0 text-muted-foreground", adminInteractiveLinkArrowClass)}
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </section>
      </AdminPageReveal>
    </div>
  )
}

export default AdminHelpPage
