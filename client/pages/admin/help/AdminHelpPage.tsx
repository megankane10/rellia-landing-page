import { ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminPageReveal from "@/components/admin/AdminPageReveal"
import { cn } from "@/lib/utils"
import {
  OPERATIONS_DOC_EDIT_URL,
  OPERATIONS_DOC_EMBED_URL,
} from "@shared/cms/operationsDocUrl"

const VERCEL_ENV_URL = "https://vercel.com/relliahealth/settings/environment-variables"

const WEBSITE_TOOLS = [
  {
    href: OPERATIONS_DOC_EDIT_URL,
    label: "Documentation",
    description: "Operations guide for the dashboard and marketing site.",
  },
  {
    href: "https://vercel.com/relliahealth",
    label: "Vercel",
    description: "Hosting and environment variables (production deploy).",
  },
  {
    href: "https://relliahealth.sanity.studio",
    label: "Sanity Studio",
    description: "Edit pages, stories, events, and program content.",
  },
  {
    href: "https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy",
    label: "Supabase",
    description: "Auth users, database tables, and invitation emails.",
  },
  {
    href: "https://github.com/Agrolax/rellia-landing-page",
    label: "GitHub",
    description: "Source code and pull requests.",
  },
  {
    href: "https://analytics.google.com/analytics/",
    label: "Google Analytics 4",
    description: "Monitor website traffic, visitor behavior, and conversion events.",
  },
  {
    href: "https://search.google.com/search-console/performance",
    label: "Google Search Console",
    description: "Track search traffic, indexation status, and search visibility.",
  },
  {
    href: "https://relliahealth.com",
    label: "Public website",
    description: "Open the live marketing site.",
  },
] as const

const AdminHelpPage = () => (
  <div className="space-y-6">
    <AdminPageReveal>
    <AdminPageHeader
      title="Help"
    />
    </AdminPageReveal>

    <AdminPageReveal delay={0.06}>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="rounded-2xl border border-black/[0.06] bg-white">
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">
            Managing Dashboard Items
          </CardTitle>
          <CardDescription className="font-urbanist">
            How to process web forms, startup diagnostics, and leads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <div className="space-y-2">
            <h4 className="font-bold text-foreground">Changing Status</h4>
            <p>
              Keep track of submission states (e.g., New, In Progress, Resolved) by updating the status selector on the inbox overview or within each item's detail view.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-foreground">Adding a Note</h4>
            <ul className="list-disc pl-5 space-y-1">
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

      <Card className="rounded-2xl border border-black/[0.06] bg-white">
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">
            Slack Integration & Alerts
          </CardTitle>
          <CardDescription className="font-urbanist">
            Real-time notifications for the team.
          </CardDescription>
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
              These alerts are sent directly to the <code className="text-xs font-semibold text-rellia-teal bg-rellia-mint/10 px-1 py-0.5 rounded">#website-inbox</code> channel on the Rellia Health Slack workspace.
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
    </div>
    </AdminPageReveal>

    <AdminPageReveal delay={0.1}>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-host-grotesk text-lg">Operations guide</CardTitle>
            <CardDescription className="font-urbanist">Shared runbook for marketing and submissions.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" asChild className="shrink-0 rounded-full">
            <a href={OPERATIONS_DOC_EDIT_URL} target="_blank" rel="noopener noreferrer">
              Open doc
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </a>
          </Button>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <iframe
              src={OPERATIONS_DOC_EMBED_URL}
              title="Rellia admin operations guide"
              className="h-[min(60vh,520px)] w-full border-0 bg-white sm:h-[min(70vh,640px)] max-sm:w-[125%] max-sm:h-[650px] max-sm:scale-[0.8] max-sm:origin-top-left"
              loading="lazy"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Quick links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {WEBSITE_TOOLS.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative flex min-h-[88px] flex-col justify-center gap-2 rounded-2xl border border-border/70 bg-white px-4 py-3.5 shadow-sm transition",
                  "hover:-translate-y-px hover:border-rellia-teal/25 hover:bg-rellia-mint/10 hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-urbanist text-sm font-semibold text-foreground transition-colors group-hover:text-rellia-teal">
                      {tool.label}
                    </div>
                    <div className="mt-0.5 line-clamp-2 font-urbanist text-xs leading-relaxed text-muted-foreground">
                      {tool.description}
                    </div>
                  </div>
                  <ArrowRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-rellia-teal"
                    aria-hidden
                  />
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </AdminPageReveal>
  </div>
)

export default AdminHelpPage
