import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import { cn } from "@/lib/utils"

const VERCEL_ENV_URL = "https://vercel.com/relliahealth/settings/environment-variables"
const GOOGLE_DOC_EDIT_URL =
  "https://docs.google.com/document/d/17lMkt2Jqa4fswCd_DpjHpvwMQH-5QBMDvzcw5MGLDVo/edit?usp=sharing"
const GOOGLE_DOC_EMBED_URL =
  "https://docs.google.com/document/d/e/2PACX-1vSmTtp1CbT0nL2DjluTFCgV6E8ezDIbRPL_iSRvTtLZnmYQNXjHiwnoUuArw0GEg5hUSzw8wAkGroUE/pub?embedded=true"

const WEBSITE_TOOLS = [
  {
    href: GOOGLE_DOC_EDIT_URL,
    label: "Documentation",
    description: "How to use this dashboard and operate the marketing site.",
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
    href: "https://vercel.com/relliahealth",
    label: "Vercel",
    description: "Deployments, domains, and environment variables.",
  },
  {
    href: "https://github.com/Agrolax/rellia-landing-page",
    label: "GitHub",
    description: "Source code and pull requests.",
  },
  {
    href: "https://relliahealth.com",
    label: "Public website",
    description: "Open the live marketing site.",
  },
] as const

const AdminHelpPage = () => (
  <div className="space-y-6">
    <AdminPageHeader
      title="Help"
      description="Plain-language guides for editors plus links to external tools."
    />

    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">What this dashboard is for</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <p>
            This is the <strong className="text-foreground">internal operations dashboard</strong> for Rellia Health —
            not the public website. Use it to read form submissions, track diagnostic leads, and see which CMS pages
            still need publishing.
          </p>
          <p>
            Marketing copy, images, events, and program pages are edited in{" "}
            <strong className="text-foreground">Sanity Studio</strong> (separate app). You do not need to touch code for
            day-to-day content updates.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Two places to edit content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Sanity Studio</strong> — page text, heroes, SEO, events, stories,
            founders directory, legal pages (terms/privacy), and visibility (Live vs coming soon).
          </p>
          <p>
            <strong className="text-foreground">Admin dashboard (here)</strong> — contact forms, investor
            notifications, startup diagnostic results, team accounts, and a list of unpublished Sanity drafts.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Preview site vs live website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <p>
            Changes published in Studio on the <strong className="text-foreground">preview</strong> dataset appear on the
            Vercel preview URL (staging). They do <strong className="text-foreground">not</strong> automatically appear
            on <code className="text-xs">www.relliahealth.com</code> until the same content is in the{" "}
            <strong className="text-foreground">production</strong> dataset.
          </p>
          <p>
            Your developer runs <code className="text-xs">pnpm sanity:promote</code> when preview is approved for launch.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Where website forms go</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <p>
            Contact, investor notify, and similar forms save to the <strong className="text-foreground">Inbox → Web
            forms</strong> tab. Startup diagnostic completions save under{" "}
            <strong className="text-foreground">Startup diagnostic</strong>. Update status as you work each lead.
          </p>
          <p>Membership checkout and payment flows use Stripe — they are not listed in this inbox.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">When to contact a developer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <ul className="list-disc space-y-1 pl-5">
            <li>New page types, forms, or checkout flows</li>
            <li>Site down, login broken, or inbox empty after sign-in</li>
            <li>Promoting preview content to production</li>
            <li>Domain, DNS, or environment variable changes on Vercel</li>
            <li>Adding or removing admin users (invite via Supabase Auth)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Your account</CardTitle>
        </CardHeader>
        <CardContent className="font-urbanist text-sm leading-relaxed text-muted-foreground">
          <p>
            Click your name at the bottom of the sidebar to update your display name, optional profile photo URL, or sign
            out. New invites set their name when accepting the invitation.
          </p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="font-host-grotesk text-lg">Sign-in problems</CardTitle>
        <CardDescription className="font-urbanist">
          If login fails or the inbox stays empty after sign-in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 font-urbanist text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">Hard refresh</strong> the login page or use a private window if you see an
          outdated “admin access” message.
        </p>
        <p>
          <strong className="text-foreground">Database policies:</strong> If a developer enabled strict admin-role RLS,
          run <code className="text-xs">scripts/supabase_revert_admin_role_policies.sql</code> in Supabase so any signed-in
          user can read submissions.
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="font-host-grotesk text-lg">Signup access</CardTitle>
        <CardDescription className="font-urbanist">
          Control whether the public <code className="text-xs">/admin/signup</code> page can create accounts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 font-urbanist text-sm text-muted-foreground">
        <p>
          Set <code className="rounded bg-muted px-1 text-xs">ADMIN_SIGNUP_ENABLED=true</code> on the server (Vercel,
          not <code className="text-xs">VITE_</code>). When disabled, invite users through Supabase instead.
        </p>
        <Button type="button" variant="outline" size="sm" asChild className="rounded-full">
          <a href={VERCEL_ENV_URL} target="_blank" rel="noopener noreferrer">
            Vercel environment variables
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
          </a>
        </Button>
      </CardContent>
    </Card>

    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-host-grotesk text-lg">Operations guide</CardTitle>
            <CardDescription className="font-urbanist">Shared runbook for marketing and submissions.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" asChild className="shrink-0 rounded-full">
            <a href={GOOGLE_DOC_EDIT_URL} target="_blank" rel="noopener noreferrer">
              Open doc
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              src={GOOGLE_DOC_EMBED_URL}
              title="Rellia admin operations guide"
              className="h-[min(60vh,520px)] w-full border-0 bg-white sm:h-[min(70vh,640px)]"
              loading="lazy"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Quick links</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {WEBSITE_TOOLS.map((tool) => (
              <li key={tool.href}>
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group block rounded-lg border border-border px-3 py-2.5 transition-colors",
                    "hover:border-rellia-teal/25 hover:bg-rellia-mint/10",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-urbanist text-sm font-medium group-hover:text-rellia-teal">{tool.label}</span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  </span>
                  <span className="mt-0.5 block font-urbanist text-xs text-muted-foreground">{tool.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
)

export default AdminHelpPage
