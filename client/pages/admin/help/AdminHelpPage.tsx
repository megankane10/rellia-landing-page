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
const SUPABASE_AUTH_USERS_URL =
  "https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy/auth/users"

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
      description="Guides, tool links, and account setup notes for the Rellia admin dashboard."
    />

    <Card>
      <CardHeader>
        <CardTitle className="font-host-grotesk text-lg">Admin names</CardTitle>
        <CardDescription className="font-urbanist">
          New signups and invite acceptances collect a display name stored in Supabase user metadata (
          <code className="text-xs">full_name</code>).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 font-urbanist text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">Existing users without a name:</strong> In Supabase → Authentication →
          Users, open the user → User Metadata → add{" "}
          <code className="rounded bg-muted px-1 text-xs">{`"full_name": "First Last"`}</code> → Save.
        </p>
        <p>
          Or run in the SQL editor (replace id and name):{" "}
          <code className="block mt-2 overflow-x-auto rounded bg-muted p-2 text-xs">
            {`update auth.users set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"full_name":"Jane Doe"}'::jsonb where id = 'USER_UUID';`}
          </code>
        </p>
        <Button type="button" variant="outline" size="sm" asChild className="rounded-full">
          <a href={SUPABASE_AUTH_USERS_URL} target="_blank" rel="noopener noreferrer">
            Open Supabase Auth
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
          </a>
        </Button>
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
