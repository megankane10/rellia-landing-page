import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminSectionCard from "@/components/admin/AdminSectionCard"
import { adminInteractiveLinkTitleClass, adminOutlineActionButtonClass } from "@/components/admin/adminThemeClasses"
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
    description: "Instructions for using this dashboard and operating the marketing site.",
  },
  {
    href: "https://relliahealth.sanity.studio",
    label: "Sanity Studio",
    description: "Edit marketing pages, stories, events, and program content.",
  },
  {
    href: "https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy",
    label: "Supabase",
    description: "Manage auth users, database tables, and invitation emails.",
  },
  {
    href: "https://vercel.com/relliahealth",
    label: "Vercel",
    description: "Deployments, domains, and environment variables.",
  },
  {
    href: "https://github.com/Agrolax/rellia-landing-page",
    label: "GitHub",
    description: "Source code, pull requests, and issue tracking.",
  },
  {
    href: "https://relliahealth.com",
    label: "Website",
    description: "Open the public marketing site in a new tab.",
  },
] as const

const AdminResources = () => (
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
    <div className="space-y-6">
      <AdminSectionCard
        title="Admin access"
        subtitle="How signup and environment settings affect who can use this dashboard."
      >
        <div className="space-y-4 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="font-medium text-foreground">Disabling or enabling signup:</strong> Set{" "}
            <code className="rounded bg-black/[0.04] px-1.5 py-0.5 text-xs">ADMIN_SIGNUP_ENABLED</code> on the
            server (Vercel environment variables, not <code className="text-xs">VITE_</code>). When disabled, new
            accounts must be invited through Supabase Auth instead of the public signup page.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className={adminOutlineActionButtonClass}
          >
            <a href={VERCEL_ENV_URL} target="_blank" rel="noopener noreferrer">
              Edit on Vercel
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </a>
          </Button>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Dashboard & CMS" subtitle="Where day-to-day content and submissions live.">
        <ul className="space-y-3 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-foreground">Submissions:</strong> Contact form, investor notifications, and
            startup diagnostic results. Update status as you work through each inquiry.
          </li>
          <li>
            <strong className="text-foreground">Content drafts:</strong> Unpublished Sanity documents — open Studio
            to review and publish when ready.
          </li>
          <li>
            <strong className="text-foreground">Team:</strong> Admin users with dashboard access. Invite colleagues
            from Supabase Auth; they will set a password via email.
          </li>
        </ul>
      </AdminSectionCard>

      <AdminSectionCard
        title="Operations guide"
        subtitle="Shared runbook for marketing, submissions, and deployments."
        headerActions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className={adminOutlineActionButtonClass}
          >
            <a href={OPERATIONS_DOC_EDIT_URL} target="_blank" rel="noopener noreferrer">
              View on Google Doc
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </a>
          </Button>
        }
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-black/[0.02]">
          <iframe
            src={OPERATIONS_DOC_EMBED_URL}
            title="Rellia admin operations guide"
            className="h-[min(70vh,640px)] w-full border-0 bg-card"
            loading="lazy"
          />
        </div>
      </AdminSectionCard>
    </div>

    <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
      <AdminSectionCard title="Website tools" subtitle="Quick links for CMS, hosting, and source control.">
        <ul className="space-y-4">
          {WEBSITE_TOOLS.map((tool) => (
            <li key={tool.href}>
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group block rounded-2xl border border-border px-4 py-3 transition-colors",
                  "hover:border-rellia-teal/20 hover:bg-rellia-mint/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className={cn("font-urbanist text-sm font-medium text-foreground", adminInteractiveLinkTitleClass)}>
                    {tool.label}
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </span>
                <span className="mt-1 block font-urbanist text-xs leading-snug text-muted-foreground">{tool.description}</span>
              </a>
            </li>
          ))}
        </ul>
      </AdminSectionCard>
    </aside>
  </div>
)

export default AdminResources
