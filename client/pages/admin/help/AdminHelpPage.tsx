import { Link } from "react-router-dom"
import { ExternalLink, ShieldAlert, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminTipBox from "@/components/admin/AdminTipBox"
import { cn } from "@/lib/utils"

const VERCEL_ENV_URL = "https://vercel.com/relliahealth/settings/environment-variables"
const GOOGLE_DOC_EMBED_URL =
  "https://docs.google.com/document/d/e/2PACX-1vRHFF2JddINakhOmHkg2_nFO_dgENKl7ygBQAAPxT1CfDC-fFZeId9KAgYxnzDTPxqKjV96CUV4l5nS/pub?embedded=true"
const GOOGLE_DOC_VIEW_URL =
  "https://docs.google.com/document/d/e/2PACX-1vRHFF2JddINakhOmHkg2_nFO_dgENKl7ygBQAAPxT1CfDC-fFZeId9KAgYxnzDTPxqKjV96CUV4l5nS/pub"

const routeBadge = (to: string, label: string) => (
  <Link
    to={to}
    className="inline-flex rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-800 transition-colors hover:bg-slate-200"
  >
    {label}
  </Link>
)

const WEBSITE_TOOLS = [
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
    <AdminPageHeader
      title="Help"
    />

    <div id="docs" className="scroll-mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="rounded-2xl">
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
            <a
              href="https://relliahealth.sanity.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-rellia-teal underline hover:text-rellia-teal/80"
            >
              Sanity Studio
            </a>{" "}
            (separate app). You do not need to touch code for day-to-day content updates.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Two places to edit content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <p>
            <a
              href="https://relliahealth.sanity.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline decoration-rellia-teal/40 hover:text-rellia-teal"
            >
              Sanity Studio
            </a>{" "}
            — page text, heroes, images, SEO, events, stories, advisors, founders directory, legal pages (terms/privacy),
            and visibility (Live vs coming soon).
          </p>
          <p>
            <strong className="text-foreground">Admin dashboard (here)</strong> — contact forms, investor notifications,
            startup diagnostic results, team accounts, and a list of unpublished Sanity drafts. Start from{" "}
            {routeBadge("/admin/overview", "Overview")} or {routeBadge("/admin/inbox", "Inbox")}.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Publishing to the live site</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <p>
            Sanity Studio edits the <strong className="text-foreground">live website</strong> directly. When you click{" "}
            <strong className="text-foreground">Publish</strong>, changes appear on{" "}
            <a
              href="https://www.relliahealth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-slate-800 underline hover:text-rellia-teal"
            >
              www.relliahealth.com
            </a>{" "}
            within about a minute (refresh the page if needed).
          </p>
          <p>
            Use <strong className="text-foreground">Presentation</strong> in Studio to preview draft changes before
            publishing. Track unpublished work in {routeBadge("/admin/drafts", "Sanity drafts")}.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Where website forms go</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <p>
            Contact, investor notify, and similar forms save under {routeBadge("/admin/inbox?tab=contact", "Inbox")} →{" "}
            <span className="font-medium text-foreground">Web forms</span>. Startup diagnostic completions save under{" "}
            {routeBadge("/admin/inbox?tab=diagnostic", "Inbox")} →{" "}
            <span className="font-medium text-foreground">Startup diagnostic</span>. Update status as you work each lead.
          </p>
          <p>Membership checkout and payment flows use Stripe — they are not listed in this inbox.</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">When to contact a developer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-urbanist text-sm leading-relaxed text-muted-foreground">
          <ul className="list-disc space-y-1 pl-5">
            <li>New page types, forms, or checkout flows</li>
            <li>Site down, login broken, or inbox empty after sign-in</li>
            <li>Domain, DNS, or environment variable changes on Vercel</li>
            <li>
              Adding or removing admin users — see {routeBadge("/admin/team", "Team")} or invite via Supabase Auth
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card id="account" className="scroll-mt-6 rounded-2xl">
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Your account</CardTitle>
        </CardHeader>
        <CardContent className="font-urbanist text-sm leading-relaxed text-muted-foreground">
          <p>
            Click your profile at the bottom of the sidebar and choose <strong className="text-foreground">View Profile</strong>{" "}
            to update your display name or photo, or <strong className="text-foreground">Logout</strong> when finished.
            New invites set their name when accepting the invitation.
          </p>
        </CardContent>
      </Card>
    </div>

    <Card className="rounded-2xl border-rellia-teal/15 bg-gradient-to-r from-rellia-mint/5 via-white to-rellia-cream/10">
      <CardHeader>
        <CardTitle className="font-host-grotesk text-lg text-rellia-teal">CMS Page Builder & Custom Pages Guide</CardTitle>
        <CardDescription className="font-urbanist">Step-by-step instructions on creating new pages, adding sections, embedding forms, and setting up pricing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 font-urbanist text-sm leading-relaxed text-muted-foreground">
        <div>
          <h4 className="font-host-grotesk font-bold text-foreground mb-1">1. Creating a New Page</h4>
          <p>
            To build a brand new page on your website, open <strong>Sanity Studio</strong>, navigate to the <strong>Pages</strong> menu in the sidebar, and click the "+" icon to create a new page document. Give it a title and a unique URL slug (e.g. <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-rellia-teal bg-rellia-mint/10">/partner-program</code>). <em>Note: Slug names that conflict with pre-built routes (like about, careers, or contact) are reserved and will be blocked by the system to prevent overriding static layouts.</em>
          </p>
        </div>

        <div>
          <h4 className="font-host-grotesk font-bold text-foreground mb-1">2. Composing with Page Sections (Blocks)</h4>
          <p>
            Custom pages are composed entirely of modular blocks added to the <strong>Page sections</strong> list. You can add, reorder, or remove sections as needed:
          </p>
          <ul className="list-disc pl-5 mt-1.5 space-y-1">
            <li><strong>Marketing Hero & Section Hero:</strong> Standard banner designs with large headings, support text, background images, and action call-to-buttons (CTAs).</li>
            <li><strong>Section Rich Text:</strong> Standard editor for text articles, headings, bullet lists, and basic styled paragraphs.</li>
            <li><strong>Cards Grid:</strong> A grid layout displaying images/icons, badges, descriptions, tags, and individual action buttons.</li>
            <li><strong>Eligibility Bento:</strong> A stylized layout showcasing structured criteria cards with graphic backgrounds.</li>
            <li><strong>Journey Timeline:</strong> Side-by-side timelines mapping comparisons or steps.</li>
            <li><strong>FAQ Section:</strong> Collapsible question-and-answer accordion cards.</li>
            <li><strong>Form Embed:</strong> Standalone or split layouts displaying registration forms.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-host-grotesk font-bold text-foreground mb-1">3. Embedding Luma Forms</h4>
          <p>
            You can embed interactive Luma event signup forms in two ways:
          </p>
          <ul className="list-disc pl-5 mt-1.5 space-y-1">
            <li><strong>On Event Detail Pages:</strong> Inside any <strong>Event</strong> document, copy the stable Luma ID (e.g. <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-rellia-teal bg-rellia-mint/10">evt-xxxxxx</code>) and paste it into the <em>Luma Event ID</em> field. Toggle on the <em>Embed Luma on Detail Page</em> option to automatically insert the registration widget.</li>
            <li><strong>On Modular Pages:</strong> Add a <strong>Form embed</strong> section block to your page. Input the full Luma event URL (e.g. <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-rellia-teal bg-rellia-mint/10">https://lu.ma/event/evt-xxxxxx</code>) into the form link field to display it as an inline registration page.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-host-grotesk font-bold text-foreground mb-1">4. Program Pricing Sections</h4>
          <p>
            When creating or updating <strong>Program</strong> documents, you can customize program pricing modules without code. Navigate to the <em>Detail page</em> tab group on the program schema:
          </p>
          <ul className="list-disc pl-5 mt-1.5 space-y-1">
            <li>Fill in the <strong>Price (sale)</strong> field (e.g. <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-rellia-teal bg-rellia-mint/10">$1,500</code>) and sub-amount details.</li>
            <li>Toggle on <strong>Show strikethrough compare price</strong> and enter a compare amount to highlight a discount (e.g., compare price <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-rellia-teal bg-rellia-mint/10">$2,000</code>).</li>
            <li>Add descriptive bullet items to the pricing details list to summarize what is included in the program purchase.</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <div className="w-full">
      <AdminTipBox
        title="Sign-in Help"
        icon={ShieldAlert}
        storageKey="rellia-admin-signin-help-tip-collapsed"
        className="rounded-2xl"
      >
        <p>
          If you cannot sign in or see an error message, try opening a private browsing window (Incognito mode) or refreshing your browser window. If your account has not been activated yet, ask a manager to resend your invitation email.
        </p>
      </AdminTipBox>
    </div>

    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-host-grotesk text-lg">Operations guide</CardTitle>
            <CardDescription className="font-urbanist">Shared runbook for marketing and submissions.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" asChild className="shrink-0 rounded-full">
            <a href={GOOGLE_DOC_VIEW_URL} target="_blank" rel="noopener noreferrer">
              Open doc
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </a>
          </Button>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <iframe
              src={GOOGLE_DOC_EMBED_URL}
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
