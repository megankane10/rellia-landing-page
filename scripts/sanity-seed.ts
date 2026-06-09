import { createClient } from "@sanity/client"
import "./loadEnv"
import path from "node:path"
import fs from "node:fs"
import { promises as fsp } from "node:fs"
import {
  DEFAULT_ABOUT_PAGE,
  DEFAULT_CONTACT_PAGE,
  DEFAULT_FAQ_PAGE,
  DEFAULT_GLOBAL_SETTINGS,
  DEFAULT_THEME_COLORS,
  DEFAULT_HOME_PAGE,
  DEFAULT_NOT_FOUND,
  DEFAULT_APPLY_PAGE,
  DEFAULT_PAYMENT_PAGE,
  DEFAULT_PROGRAMS_LANDING,
  DEFAULT_QMS_PROGRAM,
  DEFAULT_CONSULTING_PAGE,
  DEFAULT_DIAGNOSTIC_LANDING_PAGE,
} from "../shared/cms/defaults"
import { EVENT_FAVICON_HOST_SLUGS } from "../shared/cms/eventHostImage"
import { DIAGNOSTIC_SURVEY_SECTIONS } from "../client/data/diagnosticSurveySections"
import {
  DEFAULT_EVENTS_LANDING_HERO_PORTABLE,
  DEFAULT_STORIES_PAGE_HEADLINE_PORTABLE,
} from "../shared/cms/inlineHeroHeadline"
import { ADVISOR_FILTER_OPTIONS } from "../client/data/advisorDirectory"

const FOUNDER_SPECIALTY_OPTIONS = [
  "Women's Health",
  "Neurology",
  "Cardiology",
  "Oncology",
  "Mental Health",
  "Pediatrics",
]
import {
  createDummyAdvisorBio,
  createPowerOfPlayProfileBody,
  createWebsiteLaunchStoryBody,
  DUMMY_ADVISOR,
  DUMMY_OPEN_ROLE,
  POWER_OF_PLAY_ALUMNI,
  PRIORITY_MODAL_SEED,
  PROGRAM_STATIC_BLOCKS_BY_SLUG,
  buildProgramPillarsSeed,
  buildProgramHowItWorksCardsSeed,
  buildProgramTimelineFieldsSeed,
  QMS_PROGRAM_TESTIMONIALS_SEED,
  QMS_PROGRAM_TIMELINE_STEPS,
  STUDIO_GUIDE_SECTIONS,
  WEBSITE_LAUNCH_STORY,
} from "./seed/cmsSyncContent"
import { PORTFOLIO_LOGO_MARKS, INVESTOR_LOGO_MARKS } from "../client/data/portfolioLogos"
import { ROUTE_SEO } from "../client/config/seo"
import {
  DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE,
  DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE,
} from "../shared/cms/directoryPageDefaults"
import {
  DEFAULT_NETWORK_ADVISORS_PAGE,
  DEFAULT_NETWORK_FOUNDERS_PAGE,
  DEFAULT_NETWORK_INVESTORS_PAGE,
  DEFAULT_NETWORK_PARTNERS_PAGE,
} from "../shared/cms/networkPageDefaults"
import { DEFAULT_CAREERS_PAGE } from "../shared/cms/careersPageDefaults"
import { threePartHeroHeadline } from "../shared/cms/inlineHeroHeadline"
import { buildStoryFilterMutations, storyFilterIdForTag } from "../shared/cms/storyFilters"
import { buildStorySeoFieldsPayload } from "../shared/cms/storySeo"
import { legalSectionsToPortableText } from "../shared/cms/legal/sectionsToPortableText"
import {
  TERMS_EFFECTIVE_DATE,
  TERMS_PAGE_INTRO,
  TERMS_SECTIONS,
} from "../shared/cms/legal/termsSections"
import {
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_LEGAL_NOTICE,
  PRIVACY_PAGE_INTRO,
  PRIVACY_SECTIONS,
} from "../shared/cms/legal/privacySections"

const MONTH_TO_INDEX: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
}

/** Best-effort ISO instant for seeding events that only have a display `dateTime` string. */
const resolveSeedEventStartsAt = (e: {
  startsAt?: string
  calendarStartsAt?: string
  dateTime?: string
}): string | undefined => {
  const explicit = e.startsAt?.trim() || e.calendarStartsAt?.trim()
  if (explicit) return explicit

  const raw = e.dateTime?.trim()
  if (!raw) return undefined

  const direct = Date.parse(raw)
  if (Number.isFinite(direct)) return new Date(direct).toISOString()

  const m = raw.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b\s+(\d{1,2}),?\s*((?:19|20)\d{2})\s*[—–-]\s*(\d{1,2})(?::(\d{2}))?\s*([AP]M)/i,
  )
  if (!m) return undefined

  const monthIndex = MONTH_TO_INDEX[(m[1] ?? "").toLowerCase()]
  const day = Number(m[2] ?? "")
  const year = Number(m[3] ?? "")
  let hour = Number(m[4] ?? "")
  const minute = Number(m[5] ?? "0")
  const meridiem = (m[6] ?? "").toUpperCase()
  if (!Number.isFinite(monthIndex) || !Number.isFinite(day) || !Number.isFinite(year)) return undefined

  if (meridiem === "PM" && hour < 12) hour += 12
  if (meridiem === "AM" && hour === 12) hour = 0

  const offset = /\bEDT\b/i.test(raw) ? "-04:00" : "-05:00"
  const mm = String(monthIndex + 1).padStart(2, "0")
  const dd = String(day).padStart(2, "0")
  const hh = String(hour).padStart(2, "0")
  const min = String(minute).padStart(2, "0")

  return `${year}-${mm}-${dd}T${hh}:${min}:00${offset}`
}

const resolveSeedEventEndsAt = (e: {
  endsAt?: string
  calendarEndsAt?: string
  startsAt?: string
  calendarStartsAt?: string
}): string | undefined => {
  const explicit = e.endsAt?.trim() || e.calendarEndsAt?.trim()
  if (explicit) return explicit
  const start = resolveSeedEventStartsAt(e)
  if (!start) return undefined
  const startMs = Date.parse(start)
  if (!Number.isFinite(startMs)) return undefined
  return new Date(startMs + 90 * 60 * 1000).toISOString()
}

/**
 * Seeds the Sanity dataset from env (`SANITY_API_DATASET` or `VITE_SANITY_DATASET`) with
 * singleton documents, programs, events, stories, and directory data.
 *
 * Requires `SANITY_API_WRITE_TOKEN` (Editor) and `SANITY_API_PROJECT_ID` (or `VITE_SANITY_PROJECT_ID`).
 * Run: `pnpm run sanity:seed`
 *
 * Optional: `SEED_PUBLIC_SITE_ORIGIN` — base URL for converting relative paths into absolute `url`
 * fields (home page CTA image). Defaults to `https://relliahealth.com`.
 */

const ptBlock = (key: string, text: string, style: "normal" | "h2" = "h2") => [
  {
    _type: "block" as const,
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span" as const, _key: `${key}-span`, text, marks: [] as string[] }],
  },
]

type PortableTextBlock = {
  _type: "block"
  _key: string
  style?: "normal" | "h2" | "h3"
  listItem?: "bullet"
  level?: number
  markDefs?: any[]
  children: Array<{
    _type: "span"
    _key: string
    text: string
    marks?: string[]
  }>
}

const stableKey = (prefix: string, index: number) => `${prefix}-${index}`

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "tag"

/** SEO payload compatible with legacy `seo` object and `sanity-plugin-seofields` (`seoFields`). */
const seoForRoute = (pathname: string) => {
  const cfg = ROUTE_SEO[pathname]
  if (!cfg) return undefined
  const title = cfg.title
  const description = cfg.description
  const noIndex = cfg.indexable === false
  return {
    metaTitle: title,
    metaDescription: description,
    ogTitle: title,
    ogDescription: description,
    noIndex,
    title,
    description,
    openGraph: { title, description },
    robots: { noIndex, noFollow: false },
  }
}

const seedPublicOrigin = (
  process.env.SEED_PUBLIC_SITE_ORIGIN?.replace(/\/$/, "") ||
  process.env.VITE_SITE_URL?.replace(/\/$/, "") ||
  "https://relliahealth.com"
)

/** Sanity `url` fields reject relative paths; seed uses this for `ctaImageUrl` etc. */
const toSanityAbsoluteUrl = (value: string | undefined): string | undefined => {
  if (!value?.trim()) return value
  const v = value.trim()
  if (/^https?:\/\//i.test(v)) return v
  const pathSegment = v.startsWith("/") ? v : `/${v}`
  return `${seedPublicOrigin}${pathSegment}`
}

const block = (
  key: string,
  text: string,
  style: PortableTextBlock["style"] = "normal",
): PortableTextBlock => ({
  _type: "block",
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
})

const bullet = (key: string, text: string): PortableTextBlock => ({
  _type: "block",
  _key: key,
  style: "normal",
  listItem: "bullet",
  level: 1,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
})

const paragraphsToBlocks = (prefix: string, body: string): PortableTextBlock[] =>
  body
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => block(stableKey(prefix, i), p))

type PortableStoryNode =
  | PortableTextBlock
  | {
      _type: "bodyCtaBox"
      _key: string
      title: string
      body?: string
      buttonLabel: string
      buttonHref: string
    }
  | {
      _type: "portableImageCarousel"
      _key: string
      title?: string
      slides: Array<{ _type: "portableImageCarouselSlide"; _key: string; imageSrc?: string; alt: string; caption?: string }>
    }

const directoryFilterGroupId = (slug: string): string => `directoryFilterGroup-${slug}`

const TERMS_EFFECTIVE_DATE = "March 18, 2026"
const TERMS_SECTIONS: Array<{
  title: string
  body?: string
  preamble?: string
  bullets?: string[]
  closing?: string
  subsections?: Array<{ subtitle: string; body?: string; bullets?: string[] }>
  contactInfo?: { intro: string; email: string }
}> = [
  {
    title: "1. About Rellia Health",
    body: `Rellia Health is a digital health incubator that supports health technology founders through programming, education, community, and strategic resources. Our offerings include programs, events, mentorship, and online community, all designed to help early-stage health tech companies build a foundation for growth.\n\nThese Terms apply solely to Rellia Health Inc and its associated platforms, events, and content.`,
  },
  {
    title: "2. Scope of These Terms",
    preamble: "These Terms of Use apply to:",
    bullets: [
      "Rellia Health's website and any associated online platforms or member portals",
      "Incubator programming, including structured programs, advisory meetings, and events (in-person and virtual)",
      "Educational content, newsletters, and published resources",
      "Community spaces, discussion forums, or group communications facilitated by Rellia Health",
    ],
    closing:
      "Participation in specific programs may be subject to additional terms outlined in a program agreement or application process. In the event of a conflict, program-specific terms take precedence.",
  },
  {
    title: "3. Regulatory or Legal Advice",
    body: `Content shared through our programs, events, webinars, newsletters, and other communications — including any content shared by Rellia Health's founders, team members, speakers, or mentors — is provided for general informational and educational purposes only.\n\nNothing shared within Rellia Health's programming constitutes formal regulatory, legal, or clinical advice, and should not be relied upon as such. Rellia Health expressly disclaims liability for any actions taken or not taken based on information shared in an educational or community context.`,
  },
  {
    title: "4. Program Participation",
    subsections: [
      {
        subtitle: "4.1 Eligibility",
        body: `Rellia Health's programs and community are intended for health technology founders, operators, and professionals at the early to growth stages of building a digital health or medical device company. We reserve the right to determine eligibility and admit participants at our discretion.`,
      },
      {
        subtitle: "4.2 Conduct",
        body: `Participants are expected to engage respectfully and professionally. By participating in Rellia Health programming, membership, or events, you agree not to:`,
        bullets: [
          "Misrepresent your identity, credentials, or company",
          "Share confidential information belonging to other participants without consent",
          "Use programming, content, or connections made through Rellia Health for purposes that harm other participants or the broader community",
          "Engage in harassment, discrimination, or disruptive behaviour at events or in community spaces",
        ],
      },
      {
        subtitle: "4.3 Removal",
        body: `Rellia Health reserves the right to remove any participant from a program, community, or event who violates these Terms or whose conduct is determined to be harmful to the community, without refund where fees have been paid.`,
      },
    ],
  },
  {
    title: "5. Intellectual Property",
    subsections: [
      {
        subtitle: "5.1 Rellia Health Content",
        body: `All content created by Rellia Health, including frameworks, curricula, presentations, templates, worksheets, recordings, and written materials, is owned by Rellia Health or its licensors and is protected by applicable intellectual property laws.`,
      },
      {
        subtitle: "5.2 Permitted Use",
        body: `Program or event participants, members, and website visitors may not reproduce, distribute, resell, sublicense, or share Rellia Health content without prior written permission.`,
      },
      {
        subtitle: "5.3 Recordings",
        body: `Rellia Health may record programs and events for educational or archival purposes. By participating, you consent to being recorded. Recordings remain the property of Rellia Health and may be shared with program participants or used in Rellia Health's marketing, unless you request otherwise in advance.`,
      },
      {
        subtitle: "5.4 Participant Content",
        body: `You retain ownership of any pitch materials or proprietary information you share within Rellia Health programming. By sharing such content, you grant Rellia Health a limited, non-exclusive license to use it for internal program purposes (e.g., facilitator feedback, cohort review). Rellia Health will not publicly share your proprietary business information without your consent.`,
      },
    ],
  },
  {
    title: "6. Fees and Payments",
    preamble:
      "Certain Rellia Health programs and membership tiers require payment of fees. Fee amounts, payment schedules, and refund terms will be communicated at the time of enrollment. Unless otherwise stated:",
    bullets: [
      "Fees are non-refundable once a program has commenced",
      "Rellia Health reserves the right to modify program fees for future cohorts",
      "Payment obligations are not contingent on program outcomes or results",
    ],
  },
  {
    title: "7. Third-Party Speakers, Mentors, and Resources",
    body: `Rellia Health programming regularly features guest speakers, mentors, and external experts. The views, opinions, and information shared by third parties do not necessarily reflect the positions of Rellia Health. Rellia Health is not responsible for the accuracy of third-party content and does not endorse any specific products, services, or regulatory strategies referenced by speakers or mentors.\n\nOur website and materials may also include links to external resources, content, and tools. These links are provided for convenience only. Rellia Health is not responsible for the content, accuracy, or practices of third-party websites.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `To the fullest extent permitted by applicable law, Rellia Health, its founders, team members, and affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your participation in our programs or use of our content, platforms, or communications.\n\nRellia Health does not guarantee any specific outcome, funding result, regulatory approval, or business success as a result of participation in its programming.\n\nRellia Health's total liability for any claim arising under these Terms shall not exceed the fees paid by you to Rellia Health in the three (3) months preceding the claim, or CAD $200, whichever is greater.`,
  },
  {
    title: "9. Privacy",
    body: `Your participation in Rellia Health programs and membership involves the collection and use of personal information. Please review our Privacy Policy, available on our website, to understand how we handle your data. By using our services, you consent to the practices described in that policy.`,
  },
  {
    title: "10. Governing Law",
    body: `These Terms of Use are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes shall be subject to the exclusive jurisdiction of the courts of Ontario, Canada.`,
  },
  {
    title: "11. Changes to These Terms",
    body: `Rellia Health may update these Terms from time to time. Updates will be posted on our website with a revised effective date. Continued participation in our programs or use of our platforms following any update constitutes acceptance of the revised Terms.`,
  },
  {
    title: "12. Contact",
    contactInfo: {
      intro: "Questions about these Terms? Reach us at",
      email: "hello@relliahealth.com",
    },
  },
]

const PRIVACY_EFFECTIVE_DATE = "March 18, 2026"
const PRIVACY_SECTIONS: Array<{
  title: string
  body?: string
  preamble?: string
  bullets?: string[]
  bulletGroups?: Array<{ label?: string; items: string[] }>
  closing?: string
  contactInfo?: { intro: string; email: string }
}> = [
  {
    title: "1. Who We Are",
    body: `Rellia Health is a digital health incubator incorporated in Ontario, Canada. We provide programming, resources, community, and advisory support to health technology founders. This Privacy Policy applies solely to Rellia Health and does not cover any separate Rellia entities or affiliates.`,
  },
  {
    title: "2. Information We Collect",
    preamble: "We collect personal information in the following ways:",
    bulletGroups: [
      {
        label: "Information you provide directly:",
        items: [
          "Name, email address, phone number, and company name",
          "Professional background, stage of company development, and area of focus (collected via intake forms, applications, and surveys)",
          "Information shared in written communications, event registrations, or program applications",
          "Payment information for program and membership fees (processed through secure third-party payment processors — Rellia Health does not store payment card data)",
        ],
      },
      {
        label: "Information collected automatically when you visit our website:",
        items: [
          "IP address and general location",
          "Device type, browser, and operating system",
          "Pages visited, time spent, and referral sources (collected via cookies and analytics tools)",
          "Email open and click data for our newsletters and program communications",
        ],
      },
      {
        label: "Information from third parties:",
        items: [
          "If you connect with us via social media, an event platform, or a partner organization, we may receive information you have shared through those channels",
        ],
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    preamble: "We use your personal information to:",
    bullets: [
      "Assess applications and enroll participants in incubator programs",
      "Deliver programming, events, workshops, and webinars",
      "Communicate with you about your participation, program updates, and scheduling",
      "Send newsletters, event invitations, and educational content you have opted into",
      "Process payments and maintain records of program fees",
      "Improve our programming and website based on how participants and visitors engage with us",
      "Comply with applicable legal obligations",
    ],
    closing:
      "We do not sell your personal information to third parties, and we do not use it for automated decision-making that produces legal or similarly significant effects on you.",
  },
  {
    title: "4. Sharing Your Information",
    preamble:
      "Rellia Health does not sell or rent personal information. We may share it with:",
    bullets: [
      "Service providers who support our operations — including our CRM, email platform, event registration tools, and payment processor — under contractual data protection terms",
      "Guest speakers, mentors, or facilitators, to the extent needed to coordinate your participation in a program (limited to name and contact details)",
      "Professional advisors on a strict need-to-know basis or when mutually agreed upon to provide approved advisory services",
      "Regulatory or law enforcement authorities where required by law",
      "A successor entity in the event of a business transfer or acquisition, with notice provided to affected individuals",
    ],
    closing:
      "We require all third-party service providers to use your information only for the purposes we specify and to maintain appropriate security standards.",
  },
  {
    title: "5. Community Spaces",
    body: `Rellia Health programming and events often take place in shared environments where other participants may see or hear information you share. Please exercise your own judgment about what you disclose in these settings. Rellia Health is not responsible for how other participants handle information shared voluntarily in community spaces.`,
  },
  {
    title: "6. Cookies",
    body: `Our website uses cookies to support functionality and understand how visitors engage with our content. This includes essential cookies (required for the site to work), analytics cookies (to measure traffic and usage), and marketing cookies (to track communications performance, where you have consented).\n\nYou may disable cookies through your browser settings. Doing so may affect parts of the site experience.`,
  },
  {
    title: "7. Data Retention",
    preamble:
      "We retain personal information for as long as necessary to fulfil the purpose for which it was collected:",
    bullets: [
      "Paid participant records are retained for a minimum of seven (7) years following payment completion, consistent with applicable legal and tax requirements",
      "Marketing contact information is retained until you withdraw consent or request deletion",
      "Website analytics data is retained in accordance with our analytics provider's default retention settings",
    ],
    closing: "When personal information is no longer needed, we delete or anonymize it securely.",
  },
  {
    title: "8. Your Rights",
    preamble: "You have the right to:",
    bullets: [
      "Access the personal information we hold about you",
      "Request correction of inaccurate or incomplete information",
      "Withdraw consent for marketing communications at any time (via the unsubscribe link in any email, or by contacting us)",
      "Request deletion of your personal information, subject to any legal retention obligations",
      "Ask how your information is being used",
    ],
    closing: "To exercise any of these rights, contact us at the address below.",
  },
  {
    title: "9. Security",
    body: `We take reasonable administrative, technical, and physical steps to protect your personal information from unauthorized access, use, or disclosure. However, no digital transmission or storage system is completely secure. In the event of a privacy breach that poses a real risk of significant harm, we will notify affected individuals and the Office of the Privacy Commissioner of Canada as required by law.`,
  },
  {
    title: "10. Cross-Border Data",
    body: `Rellia Health is incorporated in Ontario, Canada, and serves founders globally. Your information may be stored or processed in another country, through service providers operating in those jurisdictions. Where data crosses borders, we take steps to ensure appropriate protections are in place.`,
  },
  {
    title: "11. Children's Privacy",
    body: `Rellia Health's programs are intended for adult professionals. We do not knowingly collect personal information from individuals under the age of 16. If you believe we have inadvertently done so, please contact us and we will take steps to delete it.`,
  },
  {
    title: "12. Updates to This Policy",
    body: `We may update this Privacy Policy from time to time. Changes will be posted on our website with a revised effective date. For material changes, we will provide notice through appropriate channels. Continued use of our services following an update constitutes acceptance of the revised policy.`,
  },
  {
    title: "13. Contact",
    contactInfo: {
      intro: "Questions, access requests, or privacy concerns can be directed to",
      email: "hello@relliahealth.com",
    },
  },
]

const termsPortableText = (): PortableTextBlock[] => {
  const blocks: PortableTextBlock[] = []
  blocks.push(block("terms-effective", `Effective date: ${TERMS_EFFECTIVE_DATE}`))
  for (const [sectionIndex, section] of TERMS_SECTIONS.entries()) {
    blocks.push(block(`terms-h2-${sectionIndex}`, section.title, "h2"))
    if (section.preamble) blocks.push(...paragraphsToBlocks(`terms-pre-${sectionIndex}`, section.preamble))
    if (section.bullets?.length) {
      section.bullets.forEach((t, i) => blocks.push(bullet(`terms-b-${sectionIndex}-${i}`, t)))
    }
    if (section.closing) blocks.push(...paragraphsToBlocks(`terms-close-${sectionIndex}`, section.closing))
    if (section.body) blocks.push(...paragraphsToBlocks(`terms-body-${sectionIndex}`, section.body))
    if (section.subsections?.length) {
      for (const [subIndex, sub] of section.subsections.entries()) {
        blocks.push(block(`terms-h3-${sectionIndex}-${subIndex}`, sub.subtitle, "h3"))
        if (sub.body) blocks.push(...paragraphsToBlocks(`terms-sub-body-${sectionIndex}-${subIndex}`, sub.body))
        if (sub.bullets?.length) {
          sub.bullets.forEach((t, i) => blocks.push(bullet(`terms-sub-b-${sectionIndex}-${subIndex}-${i}`, t)))
        }
      }
    }
    if (section.contactInfo) {
      blocks.push(
        block(
          `terms-contact-${sectionIndex}`,
          `${section.contactInfo.intro} ${section.contactInfo.email}.`,
        ),
      )
    }
  }
  return blocks
}

const privacyPortableText = (): PortableTextBlock[] => {
  const blocks: PortableTextBlock[] = []
  blocks.push(block("privacy-effective", `Effective date: ${PRIVACY_EFFECTIVE_DATE}`))
  for (const [sectionIndex, section] of PRIVACY_SECTIONS.entries()) {
    blocks.push(block(`privacy-h2-${sectionIndex}`, section.title, "h2"))
    if (section.preamble) blocks.push(...paragraphsToBlocks(`privacy-pre-${sectionIndex}`, section.preamble))
    if (section.bulletGroups?.length) {
      for (const [gIndex, group] of section.bulletGroups.entries()) {
        if (group.label) blocks.push(block(`privacy-h3-${sectionIndex}-${gIndex}`, group.label, "h3"))
        group.items.forEach((t, i) =>
          blocks.push(bullet(`privacy-g-${sectionIndex}-${gIndex}-${i}`, t)),
        )
      }
    }
    if (section.bullets?.length) {
      section.bullets.forEach((t, i) => blocks.push(bullet(`privacy-b-${sectionIndex}-${i}`, t)))
    }
    if (section.closing) blocks.push(...paragraphsToBlocks(`privacy-close-${sectionIndex}`, section.closing))
    if (section.body) blocks.push(...paragraphsToBlocks(`privacy-body-${sectionIndex}`, section.body))
    if (section.contactInfo) {
      blocks.push(
        block(
          `privacy-contact-${sectionIndex}`,
          `${section.contactInfo.intro} ${section.contactInfo.email}.`,
        ),
      )
    }
  }
  return blocks
}

const FALLBACK_NAV_PRIMARY = [
  { enabled: true, label: "Programs", href: "/programs" },
  { enabled: true, label: "Events", href: "/events" },
  {
    enabled: true,
    label: "Network",
    href: "/founders",
    children: [
      { enabled: true, label: "Founders", href: "/founders" },
      { enabled: true, label: "Advisors", href: "/advisors" },
      { enabled: true, label: "Investors", href: "/investors" },
      { enabled: true, label: "Industry partners", href: "/industry-partners" },
    ],
  },
  {
    enabled: true,
    label: "About",
    href: "/about",
    children: [
      { enabled: true, label: "About Us", href: "/about" },
      { enabled: true, label: "Stories", href: "/stories" },
      { enabled: true, label: "Careers", href: "/careers" },
    ],
  },
  { enabled: true, label: "FAQ", href: "/faq" },
  { enabled: true, label: "Contact", href: "/contact" },
] as const

const FALLBACK_FOOTER_COLUMNS = [
  {
    enabled: true,
    label: "Solutions",
    href: "/",
    children: [
      { enabled: true, label: "Apply", href: "/apply" },
      { enabled: true, label: "Programs", href: "/programs" },
      { enabled: true, label: "Events", href: "/events" },
      { enabled: true, label: "Startup Diagnostic", href: "/startup-diagnostic" },
      { enabled: true, label: "Consulting", href: "/consulting" },
    ],
  },
  {
    enabled: true,
    label: "Network",
    href: "/founders",
    children: [
      { enabled: true, label: "Founders", href: "/founders" },
      { enabled: true, label: "Advisors", href: "/advisors" },
      { enabled: true, label: "Investors", href: "/investors" },
      { enabled: true, label: "Industry Partners", href: "/industry-partners" },
    ],
  },
  {
    enabled: true,
    label: "Resources",
    href: "/stories",
    children: [
      { enabled: true, label: "Stories", href: "/stories" },
      { enabled: true, label: "Explore Alumni", href: "/founders/alumni" },
      { enabled: true, label: "Explore Advisors", href: "/advisors/directory" },
      {
        enabled: true,
        label: "Explore Industry Partners",
        href: "https://relliahealthresources.getproven.com/vendors?limit=10&view=grid",
      },
    ],
  },
  {
    enabled: true,
    label: "Company",
    href: "/about",
    children: [
      { enabled: true, label: "About Us", href: "/about" },
      { enabled: true, label: "FAQ", href: "/faq" },
      { enabled: true, label: "Contact", href: "/contact" },
      { enabled: true, label: "Careers", href: "/careers" },
    ],
  },
] as const

const requireEnv = (key: string): string => {
  const v = process.env[key]?.trim()
  if (!v) throw new Error(`Missing required env var: ${key}`)
  return v
}

const SANITY_UPLOADABLE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])

const isLocalPublicImagePath = (src: string): boolean => /^\/images\/[^/].+/i.test(src.trim())

const localPublicImageFilePath = (src: string): string =>
  path.join(process.cwd(), "public", src.replace(/^\//, ""))

const resolveImageAssetId = async (
  client: ReturnType<typeof createClient>,
  imageSrc: string | undefined,
): Promise<string | null> => {
  const src = (imageSrc ?? "").trim()
  if (!src) return null
  if (!isLocalPublicImagePath(src)) return null

  const filePath = localPublicImageFilePath(src)
  const ext = path.extname(filePath).toLowerCase()
  if (!SANITY_UPLOADABLE_EXTENSIONS.has(ext)) return null
  try {
    await fsp.stat(filePath)
  } catch {
    return null
  }

  const filename = path.basename(filePath)

  if (filename === "portfolio-geoclaim.png") {
    const existingIds = await client.fetch<string[]>(
      `*[_type == "sanity.imageAsset" && originalFilename == $filename]._id`,
      { filename },
    )
    for (const existingId of existingIds) {
      console.log(`Force deleting old asset ${existingId} for new portfolio-geoclaim.png`)
      await client.delete(existingId).catch(() => {})
    }
  }

  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename },
  )
  if (existing) return existing

  const stream = fs.createReadStream(filePath)
  const uploaded = await client.assets.upload("image", stream as any, { filename })
  return uploaded?._id ?? null
}

const toSanityImageFieldValue = (assetId: string | null) =>
  assetId
    ? {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
      }
    : undefined

const CAREERS_LIFE_AT_RELLIA_URLS = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80"
] as const

const resolveRemoteImageAssetId = async (
  client: ReturnType<typeof createClient>,
  url: string,
  filename: string,
): Promise<string | null> => {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    const uploaded = await client.assets.upload("image", buffer, { filename })
    return uploaded?._id ?? null
  } catch {
    return null
  }
}

const resolveStoryCoverImageAssetId = async (
  client: ReturnType<typeof createClient>,
  imageSrc: string | undefined,
  filenameHint: string,
): Promise<string | null> => {
  const src = (imageSrc ?? "").trim()
  if (!src) return null
  if (isLocalPublicImagePath(src)) {
    return resolveImageAssetId(client, src)
  }
  if (/^https?:\/\//i.test(src)) {
    const ext = src.toLowerCase().includes(".webp")
      ? "webp"
      : src.toLowerCase().includes(".jpg") || src.toLowerCase().includes("jpeg")
        ? "jpg"
        : "png"
    return resolveRemoteImageAssetId(client, src, `${filenameHint}.${ext}`)
  }
  return null
}

const buildLogoMarqueeItems = async (
  client: ReturnType<typeof createClient>,
  marks: ReadonlyArray<{ readonly name: string; readonly src: string }>,
) => {
  const items: Array<{
    _type: "logoMarqueeItem"
    _key: string
    name: string
    logo?: ReturnType<typeof toSanityImageFieldValue>
  }> = []
  for (const mark of marks) {
    let assetId: string | null = null
    if (isLocalPublicImagePath(mark.src)) {
      assetId = await resolveImageAssetId(client, mark.src)
    } else if (/^https?:\/\//i.test(mark.src)) {
      const ext = mark.src.toLowerCase().endsWith(".svg") ? "svg" : "png"
      assetId = await resolveRemoteImageAssetId(
        client,
        mark.src,
        `${slugify(mark.name)}-logo.${ext}`,
      )
    }
    const logo = toSanityImageFieldValue(assetId)
    if (!logo) continue
    items.push({
      _type: "logoMarqueeItem",
      _key: `logo-${slugify(mark.name)}`,
      name: mark.name,
      logo,
    })
  }
  return items
}

const buildCareersLifeAtRelliaImages = async (client: ReturnType<typeof createClient>) => {
  const images: Array<{ _key: string; alt: string; asset?: { _type: "reference"; _ref: string } }> = []
  let index = 0
  for (const url of CAREERS_LIFE_AT_RELLIA_URLS) {
    const filename = `careers-life-at-rellia-${index + 1}.jpg`
    const assetId = await resolveRemoteImageAssetId(client, url, filename)
    if (!assetId) continue
    images.push({
      _key: `careers-life-at-rellia-${index}`,
      alt: "",
      asset: { _type: "reference", _ref: assetId },
    })
    index += 1
  }
  return images.map((row) => ({
    _key: row._key,
    alt: row.alt,
    _type: "image" as const,
    asset: row.asset,
  }))
}

const consultingPageSeedDocument = () => {
  const c = DEFAULT_CONSULTING_PAGE
  return {
    _id: "consultingPage",
    _type: "consultingPage",
    title: c.title,
    heroEyebrow: c.heroEyebrow,
    heroTitle: c.heroTitle,
    heroAccentPhrase: c.heroAccentPhrase,
    heroSubtitle: c.heroSubtitle,
    heroImageUrl: c.heroImageSrc,
    heroPrimaryCtaLabel: c.heroPrimaryCtaLabel,
    heroPrimaryCtaHref: c.heroPrimaryCtaHref,
    heroSecondaryCtaLabel: c.heroSecondaryCtaLabel,
    heroSecondaryCtaHref: c.heroSecondaryCtaHref,
    fitTitle: c.fitTitle,
    fitDescription: c.fitDescription,
    fitBullets: c.fitBullets,
    fitImageUrl: c.fitImageSrc,
    servicesTitle: c.servicesTitle,
    servicesSubtitle: c.servicesSubtitle,
    services: (c.services ?? []).map((service, index) => ({
      _type: "consultingService",
      _key: `service-${index}`,
      title: service.title,
      body: service.body,
      ctaLabel: service.ctaLabel,
      iconKey: service.iconKey,
    })),
    testimonialsTitle: c.testimonialsTitle,
    testimonials: (c.testimonials ?? []).map((item, index) => ({
      _type: "landingTestimonialItem",
      _key: `testimonial-${index}`,
      quote: item.quote,
      name: item.name,
      role: item.role,
      company: item.company,
      imageSrc: item.image,
    })),
    membershipTitle: c.membershipTitle,
    membershipDescription: c.membershipDescription,
    membershipStats: (c.membershipStats ?? []).map((stat, index) => ({
      _key: `stat-${index}`,
      label: stat.label,
      value: stat.value,
    })),
    membershipSavingsTitle: c.membershipSavingsTitle,
    membershipSavingsBody: c.membershipSavingsBody,
    membershipPrimaryCtaLabel: c.membershipPrimaryCtaLabel,
    membershipPrimaryCtaHref: c.membershipPrimaryCtaHref,
    membershipSecondaryCtaLabel: c.membershipSecondaryCtaLabel,
    membershipSecondaryCtaHref: c.membershipSecondaryCtaHref,
    ctaTitle: c.ctaTitle,
    ctaBody: c.ctaBody,
    ctaPrimaryLabel: c.ctaPrimaryLabel,
    ctaPrimaryHref: c.ctaPrimaryHref,
    seo: seoForRoute("/consulting"),
  }
}

const diagnosticLandingPageSeedDocument = () => {
  const d = DEFAULT_DIAGNOSTIC_LANDING_PAGE
  return {
    _id: "diagnosticLandingPage",
    _type: "diagnosticLandingPage",
    title: d.title,
    heroBadgeLabel: d.heroBadgeLabel,
    heroTitle: d.heroTitle,
    heroAccentPhrase: d.heroAccentPhrase,
    heroSubtitle: d.heroSubtitle,
    heroImageUrl: d.heroImageSrc,
    heroPrimaryCtaLabel: d.heroPrimaryCtaLabel,
    heroPrimaryCtaHref: d.heroPrimaryCtaHref,
    readinessTitle: d.readinessTitle,
    readinessDescription: d.readinessDescription,
    readinessFeatures: (d.readinessFeatures ?? []).map((feature, index) => ({
      _type: "readinessFeature",
      _key: `readiness-${index}`,
      title: feature.title,
      description: feature.description,
      imageSrc: feature.imageSrc,
    })),
    infographicTitle: d.infographicTitle,
    infographicBody: d.infographicBody,
    infographicTopWeaknessLabel: d.infographicTopWeaknessLabel,
    infographicTopWeaknessScore: d.infographicTopWeaknessScore,
    infographicGapLabel: d.infographicGapLabel,
    infographicAdvisorMatchLabel: d.infographicAdvisorMatchLabel,
    infographicAdvisorRole: d.infographicAdvisorRole,
    infographicAdvisorSubtitle: d.infographicAdvisorSubtitle,
    infographicBlobRoadmap: d.infographicBlobRoadmap,
    infographicBlobAdvisors: d.infographicBlobAdvisors,
    infographicBlobBlindSpot: d.infographicBlobBlindSpot,
    timelineTitle: d.timelineTitle,
    timelineSubheading: d.timelineSubheading,
    timelineSteps: (d.timelineSteps ?? []).map((step, index) => ({
      _key: `timeline-${index}`,
      title: step.title,
      description: step.description,
    })),
    ctaTitle: d.ctaTitle,
    ctaBody: d.ctaBody,
    ctaPrimaryLabel: d.ctaPrimaryLabel,
    ctaPrimaryHref: d.ctaPrimaryHref,
    ctaSecondaryLabel: d.ctaSecondaryLabel,
    ctaSecondaryHref: d.ctaSecondaryHref,
    seo: seoForRoute("/startup-diagnostic"),
  }
}

/** Membership fields actually rendered on /membership (no legacy hero/image-card copy). */
const paymentPageSeedDocument = () => ({
  _id: "paymentPage",
  _type: "paymentPage",
  benefitsPanelHeadline: DEFAULT_PAYMENT_PAGE.benefitsPanelHeadline,
  benefitsTitle: DEFAULT_PAYMENT_PAGE.benefitsTitle,
  benefits: DEFAULT_PAYMENT_PAGE.benefits,
  choosePlanHeadline: DEFAULT_PAYMENT_PAGE.choosePlanHeadline,
  pricingMonthlyAmount: DEFAULT_PAYMENT_PAGE.pricingMonthlyAmount,
  pricingAnnualAmount: DEFAULT_PAYMENT_PAGE.pricingAnnualAmount,
  pricingMonthlyDiscountEnabled: DEFAULT_PAYMENT_PAGE.pricingMonthlyDiscountEnabled,
  pricingMonthlyCompareAmount: DEFAULT_PAYMENT_PAGE.pricingMonthlyCompareAmount,
  pricingAnnualDiscountEnabled: DEFAULT_PAYMENT_PAGE.pricingAnnualDiscountEnabled,
  pricingAnnualCompareAmount: DEFAULT_PAYMENT_PAGE.pricingAnnualCompareAmount,
  monthlyProceedLabel: DEFAULT_PAYMENT_PAGE.monthlyProceedLabel,
  annualProceedLabel: DEFAULT_PAYMENT_PAGE.annualProceedLabel,
  discountBannerEnabled: DEFAULT_PAYMENT_PAGE.discountBannerEnabled,
  discountBannerBadge: DEFAULT_PAYMENT_PAGE.discountBannerBadge,
  discountBannerTitle: DEFAULT_PAYMENT_PAGE.discountBannerTitle,
  discountBannerSubtitle: DEFAULT_PAYMENT_PAGE.discountBannerSubtitle,
  discountBannerApplyLabel: DEFAULT_PAYMENT_PAGE.discountBannerApplyLabel,
  promoPillEnabled: DEFAULT_PAYMENT_PAGE.promoPillEnabled,
  promoMessage: DEFAULT_PAYMENT_PAGE.promoMessage,
  questionsTitle: DEFAULT_PAYMENT_PAGE.questionsTitle,
  questionsBody: DEFAULT_PAYMENT_PAGE.questionsBody,
  questionsContactLabel: DEFAULT_PAYMENT_PAGE.questionsContactLabel,
  questionsContactPath: DEFAULT_PAYMENT_PAGE.questionsContactPath,
  questionsFaqLabel: DEFAULT_PAYMENT_PAGE.questionsFaqLabel,
  questionsFaqPath: DEFAULT_PAYMENT_PAGE.questionsFaqPath,
  welcomeSplashEnabled: DEFAULT_PAYMENT_PAGE.welcomeSplashEnabled,
  welcomeSplashHeading: DEFAULT_PAYMENT_PAGE.welcomeSplashHeading,
  welcomeSplashSubheading: DEFAULT_PAYMENT_PAGE.welcomeSplashSubheading,
  welcomeSplashBackgroundSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashBackgroundSrc,
  welcomeSplashLogoSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashLogoSrc,
  welcomeSplashDurationSeconds: DEFAULT_PAYMENT_PAGE.welcomeSplashDurationSeconds,
  benefitsPanelDescription: DEFAULT_PAYMENT_PAGE.benefitsPanelDescription,
  benefitsPanelImageEnabled: DEFAULT_PAYMENT_PAGE.benefitsPanelImageEnabled,
  benefitsPanelImageSrc: DEFAULT_PAYMENT_PAGE.benefitsPanelImageSrc,
  seo: { ...(seoForRoute("/membership") ?? {}), noIndex: true },
})

async function main() {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    "preview"
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const mutations: any[] = []

  const foundersLogoMarquee = await buildLogoMarqueeItems(client, PORTFOLIO_LOGO_MARKS)
  const investorsLogoMarquee = await buildLogoMarqueeItems(client, INVESTOR_LOGO_MARKS)
  const careersLifeAtRelliaImages = await buildCareersLifeAtRelliaImages(client)
  const reportMembershipCtaImageId = await resolveRemoteImageAssetId(
    client,
    "https://images.pexels.com/photos/3783725/pexels-photo-3783725.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "report-membership-cta-image.jpg"
  )
  const reportMembershipCtaImageValue = toSanityImageFieldValue(reportMembershipCtaImageId)
  const logoLightAssetId = await resolveImageAssetId(client, "/images/logo-rellia-footer.webp")
  const logoDarkAssetId = await resolveImageAssetId(client, "/images/logo-rellia-filled.webp")
  const logoLightValue = toSanityImageFieldValue(logoLightAssetId)
  const logoDarkValue = toSanityImageFieldValue(logoDarkAssetId)

  // Clear existing directory docs so seed is the source of truth.
  // These docs were originally created in Studio with random IDs, so deterministic seeding
  // won't replace them unless we delete first.
  const existingAdvisorIds = await client.fetch<string[]>(`*[_type == "advisor"]._id`)
  for (const id of existingAdvisorIds) {
    mutations.push({ delete: { id } })
  }

  const existingAlumniCompanyIds = await client.fetch<string[]>(`*[_type == "alumniCompany"]._id`)
  for (const id of existingAlumniCompanyIds) {
    mutations.push({ delete: { id } })
  }

  const existingStoryIds = await client.fetch<string[]>(`*[_type == "story"]._id`)
  for (const id of existingStoryIds) {
    mutations.push({ delete: { id } })
  }

  const existingStoryFilterIds = await client.fetch<string[]>(`*[_type == "storyFilter"]._id`)
  for (const id of existingStoryFilterIds) {
    mutations.push({ delete: { id } })
  }

  // Singletons: IDs match deskStructure documentIds
  mutations.push({
    createOrReplace: {
      _id: "globalSettings",
      _type: "globalSettings",
      ...DEFAULT_GLOBAL_SETTINGS,
      themeColors: DEFAULT_THEME_COLORS,
      ...PRIORITY_MODAL_SEED,
      priorityModalSecondaryButtonLabel: "",
      priorityModalSecondaryButtonLink: "",
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "eventsLandingPage",
      _type: "eventsLandingPage",
      heroTitlePortable: DEFAULT_EVENTS_LANDING_HERO_PORTABLE,
      heroSubtitle: "Join live sessions with operators, clinicians, and health tech leaders.",
      ctaTitle: "Want to speak at a Rellia event?",
      ctaBody: "If you have a practical playbook for founders building in health tech, we’d love to hear from you.",
      ctaPrimaryLabel: "Contact",
      ctaPrimaryHref: "/contact",
      ctaSecondaryLabel: "Apply to join",
      ctaSecondaryHref: "/apply",
      seo: seoForRoute("/events"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "storiesPage",
      _type: "storiesPage",
      headlinePortable: DEFAULT_STORIES_PAGE_HEADLINE_PORTABLE,
      subheadline:
        "The latest founder spotlights, industry insights, & program updates. Stay current with the people and ideas shaping the future of health.",
      seo: seoForRoute("/stories"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkFoundersPage",
      _type: "networkFoundersPage",
      ...DEFAULT_NETWORK_FOUNDERS_PAGE,
      logoMarquee: foundersLogoMarquee.length > 0 ? foundersLogoMarquee : undefined,
      seo: seoForRoute("/founders"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkAdvisorsPage",
      _type: "networkAdvisorsPage",
      ...DEFAULT_NETWORK_ADVISORS_PAGE,
      seo: seoForRoute("/advisors"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkAlumniDirectoryPage",
      _type: "networkAlumniDirectoryPage",
      ...DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE,
      seo: seoForRoute("/founders/alumni"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkAdvisorsDirectoryPage",
      _type: "networkAdvisorsDirectoryPage",
      ...DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE,
      seo: seoForRoute("/advisors/directory"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkInvestorsPage",
      _type: "networkInvestorsPage",
      ...DEFAULT_NETWORK_INVESTORS_PAGE,
      logoMarquee: investorsLogoMarquee.length > 0 ? investorsLogoMarquee : undefined,
      seo: seoForRoute("/investors"),
      foundersCluster: [
        {
          _key: "chart-b2b",
          title: "B2B vs B2C",
          segments: [
            { _key: "seg-1", name: "B2B / enterprise", value: 62 },
            { _key: "seg-2", name: "B2C / patient", value: 24 },
            { _key: "seg-3", name: "Hybrid", value: 14 },
          ],
        },
        {
          _key: "chart-stages",
          title: "Stages",
          segments: [
            { _key: "seg-1", name: "Idea / pre-product", value: 12 },
            { _key: "seg-2", name: "Pre-seed", value: 26 },
            { _key: "seg-3", name: "Seed", value: 38 },
            { _key: "seg-4", name: "Series A", value: 24 },
          ],
        },
        {
          _key: "chart-device",
          title: "Device & delivery",
          segments: [
            { _key: "seg-1", name: "Med device / diagnostics", value: 34 },
            { _key: "seg-2", name: "Digital / SaMD", value: 41 },
            { _key: "seg-3", name: "Services + tech", value: 25 },
          ],
        },
      ],
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkPartnersPage",
      _type: "networkPartnersPage",
      ...DEFAULT_NETWORK_PARTNERS_PAGE,
      seo: seoForRoute("/industry-partners"),
    },
  })
  mutations.push({ createOrReplace: consultingPageSeedDocument() })
  mutations.push({ createOrReplace: diagnosticLandingPageSeedDocument() })
  mutations.push({
    createOrReplace: {
      _id: "termsPage",
      _type: "termsPage",
      title: "Terms of Use",
      intro: TERMS_PAGE_INTRO,
      effectiveDate: TERMS_EFFECTIVE_DATE,
      body: legalSectionsToPortableText(TERMS_SECTIONS),
      seo: seoForRoute("/terms"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "privacyPage",
      _type: "privacyPage",
      title: "Privacy Policy",
      intro: PRIVACY_PAGE_INTRO,
      effectiveDate: PRIVACY_EFFECTIVE_DATE,
      legalNotice: PRIVACY_LEGAL_NOTICE,
      body: legalSectionsToPortableText(PRIVACY_SECTIONS),
      seo: seoForRoute("/privacy"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "homePage",
      _type: "homePage",
      ...DEFAULT_HOME_PAGE,
      pathsTitle: DEFAULT_HOME_PAGE.pathsTitle,
      pathsCards: (DEFAULT_HOME_PAGE.pathsCards ?? []).map((card) => ({
        _key: card.roleId,
        _type: "pathsCard",
        ...card,
      })),
      howItWorksSteps: (DEFAULT_HOME_PAGE.howItWorksSteps ?? []).map((step, index) => ({
        _key: `hiw-${index}`,
        ...step,
      })),
      seo: seoForRoute("/"),
    },
  })
  const { heroTitlePortable: _aboutHeroDefault, ...aboutFields } = DEFAULT_ABOUT_PAGE
  mutations.push({
    createOrReplace: {
      _id: "aboutPage",
      _type: "aboutPage",
      ...aboutFields,
      heroTitlePortable: threePartHeroHeadline("Empowering the", "next generation", " of health tech."),
      seo: seoForRoute("/about"),
    },
  })
  const existingOpenRoleIds = await client.fetch<string[]>(`*[_type == "openRole"]._id`)
  for (const id of existingOpenRoleIds) {
    mutations.push({ delete: { id } })
    if (id.startsWith("drafts.")) continue
    mutations.push({ delete: { id: `drafts.${id}` } })
  }

  mutations.push({
    createOrReplace: {
      _id: `openRole.${DUMMY_OPEN_ROLE.id}`,
      _type: "openRole",
      roleId: { _type: "slug", current: DUMMY_OPEN_ROLE.id },
      title: DUMMY_OPEN_ROLE.title,
      location: DUMMY_OPEN_ROLE.location,
      employmentType: DUMMY_OPEN_ROLE.employmentType,
      description: DUMMY_OPEN_ROLE.description,
      responsibilities: DUMMY_OPEN_ROLE.responsibilities,
      linkedInApplyUrl: DUMMY_OPEN_ROLE.linkedInApplyUrl,
      sortOrder: 0,
    },
  })

  mutations.push({
    createOrReplace: {
      _id: "careersPage",
      _type: "careersPage",
      careersContentMode: "both",
      showHiringNavBadge: false,
      showVolunteerNavBadge: false,
      heroEyebrow: DEFAULT_CAREERS_PAGE.heroEyebrow,
      heroTitle: DEFAULT_CAREERS_PAGE.heroTitle,
      heroAccentPhrase: DEFAULT_CAREERS_PAGE.heroAccentPhrase,
      heroTitleSuffix: DEFAULT_CAREERS_PAGE.heroTitleSuffix,
      heroSubtitle: DEFAULT_CAREERS_PAGE.heroSubtitle,
      heroImageSrc: DEFAULT_CAREERS_PAGE.heroImageSrc,
      whyTitle: DEFAULT_CAREERS_PAGE.whyTitle,
      whyDescription: DEFAULT_CAREERS_PAGE.whyDescription,
      whyFeatures: DEFAULT_CAREERS_PAGE.whyFeatures,
      perksTitle: DEFAULT_CAREERS_PAGE.perksTitle,
      perksDescription: DEFAULT_CAREERS_PAGE.perksDescription,
      perksItems: DEFAULT_CAREERS_PAGE.perksItems,
      openRolesTitle: DEFAULT_CAREERS_PAGE.openRolesTitle,
      ctaTitle: DEFAULT_CAREERS_PAGE.ctaTitle,
      ctaBody: DEFAULT_CAREERS_PAGE.ctaBody,
      ctaPrimaryLabel: DEFAULT_CAREERS_PAGE.ctaPrimaryLabel,
      ctaPrimaryHref: DEFAULT_CAREERS_PAGE.ctaPrimaryHref,
      lifeAtRelliaHeading: "Built by healthtech insiders, for builders",
      lifeAtRelliaSubheading: "We are a remote-first, high-standards team of builders, clinicians, and operators dedicated to supporting healthtech founders. We cultivate an environment of high autonomy, rapid iteration, and deep clinical empathy to build the future of care.",
      lifeAtRelliaImages:
        careersLifeAtRelliaImages.length > 0 ? careersLifeAtRelliaImages : undefined,
      lifeAtRelliaLinks: [
        {
          _type: "lifeAtRelliaLink",
          _key: "linkedin",
          platformName: "LinkedIn",
          url: "https://www.linkedin.com/company/rellia-health",
          iconKey: "linkedin",
          tooltip: "Follow us on LinkedIn",
        },
        {
          _type: "lifeAtRelliaLink",
          _key: "instagram",
          platformName: "Instagram",
          url: "https://www.instagram.com/relliahealth",
          iconKey: "instagram",
          tooltip: "Follow us on Instagram",
        }
      ],
      seo: seoForRoute("/careers"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "faqPage",
      _type: "faqPage",
      ...DEFAULT_FAQ_PAGE,
      seo: seoForRoute("/faq"),
    },
  })
  const {
    programs: _legacyPrograms,
    upcomingEvents: _legacyUpcoming,
    pastEvents: _legacyPast,
    ...programsLandingFields
  } = DEFAULT_PROGRAMS_LANDING
  mutations.push({
    createOrReplace: {
      _id: "programsLandingPage",
      _type: "programsLandingPage",
      ...programsLandingFields,
      seo: seoForRoute("/programs"),
    },
  })
  const legacyProgramPages = await client.fetch<string[]>('*[_type == "programPage"]._id')
  for (const id of legacyProgramPages) {
    mutations.push({ delete: { id } })
    if (id.startsWith("drafts.")) continue
    mutations.push({ delete: { id: `drafts.${id}` } })
  }

  // Retired program slug (canonical: regulatory-strategy-sprint)
  for (const retiredProgramId of ["program.regulatory-roadmap", "drafts.program.regulatory-roadmap"]) {
    mutations.push({ delete: { id: retiredProgramId } })
  }

  const buildProgramDetailBlocksSeed = async (slug: string) => {
    const staticBlocks = PROGRAM_STATIC_BLOCKS_BY_SLUG[slug]
    if (!staticBlocks) return {}

    const pillars = buildProgramPillarsSeed(staticBlocks)
    const howItWorksCards = []
    for (const card of buildProgramHowItWorksCardsSeed(staticBlocks)) {
      const cardAssetId = card.imageSrc
        ? await resolveImageAssetId(client, card.imageSrc)
        : null
      howItWorksCards.push({
        _key: card._key,
        title: card.title,
        description: card.description,
        image: toSanityImageFieldValue(cardAssetId),
      })
    }

    return {
      pillars,
      howItWorksCards,
      ...buildProgramTimelineFieldsSeed(slug, staticBlocks),
    }
  }

  const faviconHostAssetId = await resolveImageAssetId(client, "/images/favicon-192.png")

  // Programs: one document per program (card + detail page content)
  for (const [index, program] of DEFAULT_PROGRAMS_LANDING.programs.entries()) {
    const title = program.title?.trim()
    if (!title) continue
    const slug = (program.href || "").split("/").filter(Boolean).pop() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const programAssetId = await resolveImageAssetId(client, program.imageSrc)
    const programDetailBlocks = await buildProgramDetailBlocksSeed(slug)
    const isQms = slug === "build-your-quality-management-system"
    mutations.push({
      createOrReplace: {
        _id: `program.${slug}`,
        _type: "program",
        title,
        slug: { _type: "slug", current: slug },
        description: program.description,
        image: toSanityImageFieldValue(programAssetId),
        href: program.href,
        buttonText: program.buttonText,
        waitlistHref: (program as any).waitlistHref,
        status: (program as any).waitlistHref ? "waitlist" : "available",
        sortOrder: index,
        pricingDiscountEnabled: false,
        ...programDetailBlocks,
        ...(isQms
          ? {
              paymentUrl: DEFAULT_QMS_PROGRAM.paymentUrl,
              heroTitle: DEFAULT_QMS_PROGRAM.heroTitle,
              heroDescription: DEFAULT_QMS_PROGRAM.heroDescription,
              heroCtaLabel: DEFAULT_QMS_PROGRAM.heroCtaLabel,
              outcomesTitle: DEFAULT_QMS_PROGRAM.outcomesTitle,
              outcomesIntro: DEFAULT_QMS_PROGRAM.outcomesIntro,
              outcomes: DEFAULT_QMS_PROGRAM.outcomes,
              howItWorksTitle: DEFAULT_QMS_PROGRAM.howItWorksTitle,
              howItWorksIntro: DEFAULT_QMS_PROGRAM.howItWorksIntro,
              pillarsTitle: DEFAULT_QMS_PROGRAM.pillarsTitle,
              timelineTitle: DEFAULT_QMS_PROGRAM.timelineTitle,
              timelineSubtitle: DEFAULT_QMS_PROGRAM.timelineSubtitle,
              timelineSteps: QMS_PROGRAM_TIMELINE_STEPS,
              testimonials: QMS_PROGRAM_TESTIMONIALS_SEED,
              pricingBadge: DEFAULT_QMS_PROGRAM.pricingBadge,
              pricingAmount: DEFAULT_QMS_PROGRAM.pricingAmount,
              pricingCompareAmount: DEFAULT_QMS_PROGRAM.pricingCompareAmount ?? "",
              pricingSubAmount: DEFAULT_QMS_PROGRAM.pricingSubAmount,
              pricingDescription: DEFAULT_QMS_PROGRAM.pricingDescription,
              pricingBullets: DEFAULT_QMS_PROGRAM.pricingBullets,
              bottomCtaTitle: DEFAULT_QMS_PROGRAM.bottomCtaTitle,
              bottomCtaBody: DEFAULT_QMS_PROGRAM.bottomCtaBody,
              bottomCtaButtonLabel: DEFAULT_QMS_PROGRAM.bottomCtaButtonLabel,
              bottomContactHref: DEFAULT_QMS_PROGRAM.bottomContactHref,
            }
          : {}),
      },
    })
  }

  // Events as separate documents (source of truth for /events and /events/:slug)
  for (const [index, e] of DEFAULT_PROGRAMS_LANDING.upcomingEvents.entries()) {
    const slug = (e.slug || "").trim()
    if (!slug) continue
    const eventAssetId = await resolveImageAssetId(client, (e as any).imageSrc)
    mutations.push({
      createOrReplace: {
        _id: `event.${slug}`,
        _type: "event",
        title: e.title,
        slug: { _type: "slug", current: slug },
        startsAt: resolveSeedEventStartsAt(e as any),
        endsAt: resolveSeedEventEndsAt(e as any),
        person: e.person,
        image: toSanityImageFieldValue(eventAssetId),
        hostImage: EVENT_FAVICON_HOST_SLUGS.has(slug)
          ? toSanityImageFieldValue(faviconHostAssetId)
          : undefined,
        href: e.href,
        buttonText: (e as any).buttonText,
        location: (e as any).location,
        lumaEventId: (e as any).lumaEventId,
        eventDescription: (e as any).detailBody,
        detailBodyHeading: (e as any).detailBodyHeading,
        embedLumaOnDetailPage: (e as any).embedLumaOnDetailPage,
        addToCalendarEnabled: (e as any).addToCalendarEnabled,
        status: "visible",
        sortOrder: index,
      },
    })
  }

  for (const [index, e] of DEFAULT_PROGRAMS_LANDING.pastEvents.entries()) {
    const slug = (e.slug || "").trim()
    if (!slug) continue
    const eventAssetId = await resolveImageAssetId(client, (e as any).imageSrc)
    mutations.push({
      createOrReplace: {
        _id: `event.${slug}`,
        _type: "event",
        title: e.title,
        slug: { _type: "slug", current: slug },
        startsAt: resolveSeedEventStartsAt(e as any),
        endsAt: resolveSeedEventEndsAt(e as any),
        person: e.person,
        image: toSanityImageFieldValue(eventAssetId),
        hostImage: EVENT_FAVICON_HOST_SLUGS.has(slug)
          ? toSanityImageFieldValue(faviconHostAssetId)
          : undefined,
        href: e.href,
        buttonText: (e as any).buttonText,
        location: (e as any).location,
        lumaEventId: (e as any).lumaEventId,
        eventDescription: (e as any).detailBody,
        detailBodyHeading: (e as any).detailBodyHeading,
        embedLumaOnDetailPage: (e as any).embedLumaOnDetailPage,
        addToCalendarEnabled: (e as any).addToCalendarEnabled,
        status: "visible",
        sortOrder: index,
      },
    })
  }

  mutations.push({
    createOrReplace: {
      _id: "contactPage",
      _type: "contactPage",
      ...DEFAULT_CONTACT_PAGE,
      seo: seoForRoute("/contact"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "applyPage",
      _type: "applyPage",
      ...DEFAULT_APPLY_PAGE,
      seo: seoForRoute("/apply"),
    },
  })
  mutations.push({
    createIfNotExists: paymentPageSeedDocument(),
  })
  mutations.push({
    patch: {
      id: "paymentPage",
      setIfMissing: {
        welcomeSplashEnabled: DEFAULT_PAYMENT_PAGE.welcomeSplashEnabled,
        welcomeSplashHeading: DEFAULT_PAYMENT_PAGE.welcomeSplashHeading,
        welcomeSplashSubheading: DEFAULT_PAYMENT_PAGE.welcomeSplashSubheading,
        welcomeSplashBackgroundSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashBackgroundSrc,
        welcomeSplashLogoSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashLogoSrc,
        welcomeSplashDurationSeconds: DEFAULT_PAYMENT_PAGE.welcomeSplashDurationSeconds,
        benefitsPanelDescription: DEFAULT_PAYMENT_PAGE.benefitsPanelDescription,
        benefitsPanelImageEnabled: DEFAULT_PAYMENT_PAGE.benefitsPanelImageEnabled,
        benefitsPanelImageSrc: DEFAULT_PAYMENT_PAGE.benefitsPanelImageSrc,
      },
    },
  })
  mutations.push({
    patch: {
      id: "paymentPage",
      set: {
        welcomeSplashDurationSeconds: DEFAULT_PAYMENT_PAGE.welcomeSplashDurationSeconds,
      },
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "diagnosticSurveyContent",
      _type: "diagnosticSurveyContent",
      introTitle: "How ready is your startup, really?",
      introSubtitle: "Our diagnostic tool assesses your health tech startup across 12 critical domains. Get an automated report, personalized advisory board matches, and a program roadmap tailored to your gaps.",
      stages: [
        "Idea / Discovery",
        "Prototype / MVP",
        "Pilot / Seed",
        "Early Growth (Series A+)",
        "Scale-up",
      ],
      introJourneyTitle: "Your Diagnostic Journey",
      introJourneySteps: [
        { title: "Capture Your Context", description: "Tell us about your startup, stage, and mission.", icon: "Building2" },
        { title: "12-Domain Deep Dive", description: "15-minute assessment of your regulatory, clinical, and commercial readiness.", icon: "Target" },
        { title: "Personalized Growth Roadmap", description: "Immediate analysis of your top strengths and priority gaps.", icon: "Sparkles" },
        { title: "Advisory Board Match", description: "Personalized assignment of mentors based on your results.", icon: "Users" }
      ],
      introWhatYouGetTitle: "What you’ll get",
      introWhatYouGetBullets: [
        "Top 3 strengths + gaps with priority level",
        "Concrete roadmap recommendations",
        "Advisor focus areas matched to your gaps"
      ],
      introStartupDetailsTitle: "Tell us about your startup",
      introStartButtonLabel: "Start Assessment",
      submitTitle: "Review, then generate your roadmap",
      submitSubtitle: "You’re about to submit your responses. After confirmation, we’ll generate your personalized readiness report.",
      submitProfileTitle: "Your Assessment Profile",
      submitGeneratingTitle: "Generating Your Report",
      submitGeneratingBody: "We're assessing your results in order to assign you your personalized advisory board and recommended Rellia programs.",
      submitGeneratingBullets: [
        "Top 3 Gaps & Strengths",
        "Customized Recommendation Roadmap",
        "Assigned Advisory Board Matches",
        "Meeting Links for Advisors"
      ],
      submitDetailsTitle: "Submission details",
      submitConfirmButtonLabel: "Confirm & Generate Report",
      processingTitle: "Personalizing your report",
      processingSubtitle: "We're assessing your results in order to assign you your personalized advisory board and program roadmap.",
      processingSteps: [
        "Analyzing section scores",
        "Mapping gaps to advisors",
        "Building your roadmap"
      ],
      reportHeaderThankYou: "Thanks - we've saved your diagnostic submission for {company}. Your next step is to focus on the lowest-scoring domains first, then reinforce what's already working so you can move faster with less risk.",
      reportStrengthsTitle: "Top Strengths",
      reportGapsTitle: "Priority Gaps",
      reportRoadmapTitle: "Recommended Roadmap",
      reportFullBreakdownTitle: "Full Readiness Breakdown",
      reportProgramsTitle: "Program Matches",
      reportAdvisorsTitle: "Custom Advisory Board",
      reportMembershipCtaTitle: "Unlock your custom growth roadmap",
      reportMembershipCtaBody: "Join Rellia Health to unlock your custom advisory board, full gap analysis, and personalized actions - and accelerate your journey.",
      reportMembershipCtaButton: "Apply for Membership",
      reportMembershipCtaImage: reportMembershipCtaImageValue,
      sections: DIAGNOSTIC_SURVEY_SECTIONS,
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "notFoundPage",
      _type: "notFoundPage",
      ...DEFAULT_NOT_FOUND,
      seo: { metaTitle: DEFAULT_NOT_FOUND.title, metaDescription: DEFAULT_NOT_FOUND.message, noIndex: true },
    },
  })

  // Navigation singleton (no shared defaults; app has component fallbacks)
  mutations.push({
    createOrReplace: {
      _id: "navigation",
      _type: "navigation",
      primary: FALLBACK_NAV_PRIMARY,
      footer: FALLBACK_FOOTER_COLUMNS,
    },
  })

  // Site settings singleton exists in desk; seed text fields + logos when assets exist locally
  const siteDefaultSeo = seoForRoute("/")
  mutations.push({
    createOrReplace: {
      _id: "siteSettings",
      _type: "siteSettings",
      brandName: "Rellia Health",
      faviconPath: "/favicon.ico",
      logoLight: logoLightValue,
      logoDark: logoDarkValue,
      socialLinks: [
        {
          _type: "socialLink",
          _key: "linkedin",
          platform: "linkedin",
          label: "Rellia on LinkedIn",
          url: "https://www.linkedin.com/company/relliahealth",
        },
        {
          _type: "socialLink",
          _key: "instagram",
          platform: "instagram",
          label: "Rellia on Instagram",
          url: "https://www.instagram.com/relliahealth/",
        },
      ],
      defaultSeo: siteDefaultSeo
        ? {
            title: siteDefaultSeo.title ?? siteDefaultSeo.metaTitle,
            description: siteDefaultSeo.description ?? siteDefaultSeo.metaDescription,
            noIndex: siteDefaultSeo.noIndex ?? false,
          }
        : undefined,
    },
  })

  mutations.push({
    createOrReplace: {
      _id: "studioGuide",
      _type: "studioGuide",
      title: "How to use this CMS",
      intro:
        "Quick reference for editors using Rellia Web Studio. Update this page anytime — it is not shown on the public website.",
      sections: STUDIO_GUIDE_SECTIONS,
    },
  })

  // Story filters (used by story documents) — seed all confirmed categories
  mutations.push(...buildStoryFilterMutations())

  const websiteLaunchStoryFilterId = storyFilterIdForTag(WEBSITE_LAUNCH_STORY.tag)
  const websiteLaunchImageAssetId = await resolveStoryCoverImageAssetId(
    client,
    WEBSITE_LAUNCH_STORY.coverImageSrc,
    WEBSITE_LAUNCH_STORY.slug,
  )
  mutations.push({
    createOrReplace: {
      _id: `story.${WEBSITE_LAUNCH_STORY.slug}`,
      _type: "story",
      featured: WEBSITE_LAUNCH_STORY.featured,
      title: WEBSITE_LAUNCH_STORY.title,
      slug: { _type: "slug", current: WEBSITE_LAUNCH_STORY.slug },
      filters: [{ _type: "reference", _ref: websiteLaunchStoryFilterId }],
      publishedAt: WEBSITE_LAUNCH_STORY.publishedAt
        ? new Date(WEBSITE_LAUNCH_STORY.publishedAt).toISOString()
        : undefined,
      excerpt: WEBSITE_LAUNCH_STORY.excerpt,
      headerImage: toSanityImageFieldValue(websiteLaunchImageAssetId),
      headerImageAlt: WEBSITE_LAUNCH_STORY.coverImageAlt,
      headerLayout: "block",
      body: createWebsiteLaunchStoryBody(ptBlock, bullet, block),
      seo: buildStorySeoFieldsPayload({
        storyTitle: WEBSITE_LAUNCH_STORY.title,
        tag: WEBSITE_LAUNCH_STORY.tag,
        description: WEBSITE_LAUNCH_STORY.seoDescription,
      }),
    },
  })

  // Remove deprecated modular legal/handoff pages — legal routes use termsPage/privacyPage singletons
  for (const deprecatedPageId of ["page.terms", "page.privacy", "page.cms-handoff-test"]) {
    mutations.push({ delete: { id: deprecatedPageId } })
  }

  mutations.push({
    createOrReplace: {
      _id: "page.supporting-health-founders",
      _type: "page",
      title: "Supporting Health Founders — Page Builder Showcase",
      slug: { _type: "slug", current: "supporting-health-founders" },
      pageVisibility: "live",
      sections: [
        {
          _type: "sectionMarketingHero",
          _key: "shf-hero",
          eyebrowLabel: "Hero with image",
          title: "Supporting health founders",
          accentPhrase: "at every stage",
          subtitle:
            "Full-bleed teal hero with eyebrow label, mint accent phrase, background image, and primary/secondary navItem CTAs.",
          imageUrl:
            "https://images.pexels.com/photos/3182761/pexels-photo-3182761.jpeg?auto=compress&cs=tinysrgb&w=1600",
          primaryCta: { label: "Apply to join", href: "/apply" },
          secondaryCta: { label: "Take the diagnostic", href: "/startup-diagnostic" },
        },
        {
          _type: "sectionRichText",
          _key: "shf-rich",
          title: "Rich text",
          tag: "Portable text with headings, lists, inline images, URL images, video embeds, carousels, and CTA boxes.",
          body: [
            {
              _type: "block",
              _key: "shf-rich-p1",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "shf-rich-p1-span",
                  text: "Rellia is a curated network and practical support system for health tech founders navigating clinical validation, regulatory pathways, and enterprise procurement.",
                  marks: [],
                },
              ],
            },
            {
              _type: "eventDetailInlineImage",
              _key: "shf-rich-img",
              imageSrc:
                "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
              alt: "Founders collaborating in a health tech workspace",
              caption: "Inline image block — upload in Studio or paste a URL.",
            },
            {
              _type: "portableVideo",
              _key: "shf-rich-vid",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              caption: "Video block — YouTube, Vimeo, or direct .mp4 URL.",
            },
          ],
        },
        {
          _type: "sectionMetrics",
          _key: "shf-metrics",
          showBadge: true,
          badgeLabel: "Metrics band",
          heading: "Outcomes that compound over time",
          subheading:
            "White full-width band: optional badge, heading, subheading, up to six animated stats, and an optional side image box on the right.",
          imageUrl:
            "https://images.pexels.com/photos/3183158/pexels-photo-3183158.jpeg?auto=compress&cs=tinysrgb&w=800",
          imageAlt: "Health tech team reviewing metrics",
          metrics: [
            { _key: "m1", label: "Critical domains assessed", value: 12 },
            { _key: "m2", label: "Advisor network", value: 150, suffix: "+" },
            { _key: "m3", label: "Avg. diagnostic time (min)", value: 15 },
          ],
        },
        {
          _type: "sectionFeatureGrid",
          _key: "shf-features",
          showBadge: true,
          badge: "Text and icon grid",
          headingTone: "auto",
          background: "white",
          title: ptBlock("shf-fg-title", "Support at every inflection point"),
          subtitle: ptBlock(
            "shf-fg-sub",
            "Toggle badge visibility, heading tone (light/dark/auto), and background (white/teal/cream). Each item uses a Lucide icon key, title, and body.",
            "normal",
          ),
          items: [
            {
              _key: "f1",
              icon: "Target",
              title: "Readiness diagnostics",
              body: "Benchmark across regulatory, clinical, commercial, and operational domains.",
            },
            {
              _key: "f2",
              icon: "Users",
              title: "Matched advisors",
              body: "Connect with ex-FDA reviewers, health system leaders, and repeat founders.",
            },
            {
              _key: "f3",
              icon: "Layers",
              title: "Programs & playbooks",
              body: "Cohort sprints for QMS, evidence generation, and procurement readiness.",
            },
            {
              _key: "f4",
              icon: "Heart",
              title: "Founder community",
              body: "Learn alongside peers navigating the same buyer and validation cycles.",
            },
          ],
        },
        {
          _type: "sectionCardsGrid",
          _key: "shf-cards",
          title: "Image grid",
          subtitle:
            "Unlimited cards in a responsive 1–3 column grid. Image, Lucide icon, badge, tags, and CTA are all optional per card — omit any field to hide it.",
          cards: [
            {
              _key: "c1",
              title: "QMS Sprint",
              body: "Build a startup-friendly quality system with expert guidance.",
              iconKey: "ShieldCheck",
              badge: "Program",
              imageUrl:
                "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
              cta: { label: "Learn more", href: "/programs" },
            },
            {
              _key: "c2",
              title: "Startup Diagnostic",
              body: "15-minute assessment with instant readiness scoring.",
              iconKey: "Zap",
              badge: "Free tool",
              imageUrl:
                "https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=1200",
              cta: { label: "Start now", href: "/startup-diagnostic" },
            },
            {
              _key: "c3",
              title: "Text-only card",
              body: "No image, icon, badge, or tags — title and body only.",
            },
            {
              _key: "c4",
              title: "Advisor matching",
              body: "Card with image and CTA but no icon or badge.",
              imageUrl:
                "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1200",
              cta: { label: "Browse advisors", href: "/advisors" },
            },
          ],
        },
        {
          _type: "sectionEligibilityBento",
          _key: "shf-bento",
          badge: "Eligibility bento",
          title: "Built for serious health tech teams",
          description: "Four-column photo bento with badge, title, description, and per-card image or Pexels fallback.",
          items: [
            {
              _key: "b1",
              text: "Digital health & SaMD founders",
              imageUrl:
                "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200",
            },
            {
              _key: "b2",
              text: "Teams preparing for health-system pilots",
              imageUrl:
                "https://images.pexels.com/photos/3182761/pexels-photo-3182761.jpeg?auto=compress&cs=tinysrgb&w=1200",
            },
            {
              _key: "b3",
              text: "Companies navigating FDA or CE pathways",
              imageUrl:
                "https://images.pexels.com/photos/3183158/pexels-photo-3183158.jpeg?auto=compress&cs=tinysrgb&w=1200",
            },
            {
              _key: "b4",
              text: "Founders building enterprise-grade evidence",
              imageUrl:
                "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
            },
          ],
        },
        {
          _type: "sectionEngageBand",
          _key: "shf-engage",
          showBadge: true,
          badge: "Engage band",
          headingTone: "light",
          title: ptBlock("shf-engage-title", "Three ways to engage with Rellia"),
          subtitle: ptBlock(
            "shf-engage-sub",
            "Teal full-width band with badge, portable text heading/subheading, and linked cards (Lucide icon, title, body, navItem link).",
            "normal",
          ),
          items: [
            {
              _key: "e1",
              icon: "ClipboardCheck",
              title: "Startup diagnostic",
              body: "Take a 15-minute assessment and receive an instant readiness score.",
              link: { label: "Start diagnostic", href: "/startup-diagnostic" },
            },
            {
              _key: "e2",
              icon: "Rocket",
              title: "Apply to programs",
              body: "Join structured cohorts designed for health tech founders.",
              link: { label: "View programs", href: "/programs" },
            },
            {
              _key: "e3",
              icon: "Users",
              title: "Explore the network",
              body: "Meet founders, advisors, and industry partners in the Rellia ecosystem.",
              link: { label: "Browse network", href: "/founders" },
            },
            {
              _key: "e4",
              icon: "Compass",
              title: "Read founder stories",
              body: "See how members navigated pilots, procurement, and regulatory milestones.",
              link: { label: "View stories", href: "/stories" },
            },
          ],
        },
        {
          _type: "sectionJourneyTimeline",
          _key: "shf-journey",
          badge: "Timeline",
          headingTitle: "Path to membership",
          subheading:
            "Same numbered timeline as /apply — steps, optional role link cards, and an optional primary button below the steps.",
          steps: DEFAULT_APPLY_PAGE.steps.map((step, index) => ({
            _key: `shf-step-${index}`,
            title: step.title,
            description: step.description,
          })),
          showRoleLinks: true,
          roleLinks: DEFAULT_APPLY_PAGE.roleLinks?.map((link, index) => ({
            _key: `shf-role-${index}`,
            title: link.title,
            description: link.description,
            href: link.href,
          })),
          cta: { label: "Apply now", actionType: "link", href: "/apply" },
        },
        {
          _type: "sectionDiagnosticSurvey",
          _key: "shf-survey",
          layout: "categories",
          badge: "Text split",
          title: ptBlock("shf-survey-title", "Text + list layout"),
          subtitle: ptBlock(
            "shf-survey-sub",
            "Copy and primary/secondary link buttons on the left. Optional list with Lucide icon on the right.",
            "normal",
          ),
          primaryCta: { label: "Explore programs", href: "/programs" },
          secondaryCta: { label: "Contact us", href: "/contact" },
          categoriesTitle: "What you can highlight",
          categories: [
            "Program milestones",
            "Advisor expertise",
            "Community benefits",
            "Application steps",
            "Member resources",
            "Support channels",
          ],
        },
        {
          _type: "sectionDiagnosticSurvey",
          _key: "shf-survey-image",
          layout: "imageSplit",
          badge: "Text split",
          title: ptBlock("shf-survey-img-title", "Text + full-height image layout"),
          subtitle: ptBlock(
            "shf-survey-img-sub",
            "Switch layout to image split for a full-height right-side photo with link buttons on the left.",
            "normal",
          ),
          primaryCta: { label: "View programs", href: "/programs" },
          secondaryCta: { label: "Apply now", href: "/apply" },
          imageUrl:
            "https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=1600",
          imageAlt: "Team collaborating on health tech strategy",
        },
        {
          _type: "sectionTestimonials",
          _key: "shf-testimonials",
          heading: "Testimonials",
          testimonials: (DEFAULT_CONSULTING_PAGE.testimonials ?? []).slice(0, 3).map((item, index) => ({
            _type: "landingTestimonialItem",
            _key: `shf-t-${index}`,
            quote: item.quote,
            name: item.name,
            role: item.role,
            company: item.company,
            imageSrc: item.image,
          })),
        },
        {
          _type: "sectionFormEmbed",
          _key: "shf-form",
          layout: "split",
          filloutFormUrl: "https://forms.fillout.com/t/r5hdDmQodfus",
          panelHeadline: "Form embed",
          panelBody:
            "Split layout uses a full-width teal band (headline, body, bullets, optional image) before revealing the Fillout form. Standalone layout embeds the form full width.",
          panelImageUrl:
            "https://images.pexels.com/photos/3182761/pexels-photo-3182761.jpeg?auto=compress&cs=tinysrgb&w=1600",
          ctaLabel: "Apply now",
          benefits: [
            "Vetted advisor introductions",
            "Programs matched to your stage",
            "Private founder community access",
          ],
        },
        {
          _type: "sectionFaq",
          _key: "shf-faq",
          title: "FAQ",
          subtitle: "Accordion with section title, subtitle, and unlimited Q&A items in a rounded card.",
          items: [
            {
              _key: "q1",
              question: "Who is Rellia for?",
              answer:
                "Early- to growth-stage health tech founders building products that must navigate clinical validation, regulatory pathways, and enterprise procurement.",
            },
            {
              _key: "q2",
              question: "Can I customize section tags and heading colors?",
              answer:
                "Yes. Feature grid and engage band sections support show/hide badge, heading tone (light/dark/auto), and background color for feature grids.",
            },
            {
              _key: "q3",
              question: "How does advisor matching work?",
              answer:
                "Based on your diagnostic gaps and stage, we suggest vetted advisors with relevant healthcare operating experience.",
            },
          ],
        },
        {
          _type: "sectionRelliaCta",
          _key: "shf-cta",
          title: "Call to action (CTA band)",
          body: "Grey-teal footer band with headline, body, primary/secondary ctaButton fields, size, primary style, and above-section tone.",
          primaryCta: { label: "Apply now", href: "/apply", variant: "primary" },
          secondaryCta: { label: "Contact us", href: "/contact", variant: "secondary" },
          aboveSectionTone: "white",
        },
      ],
      seo: {
        title: "Supporting Health Founders — Rellia Health",
        metaTitle: "Supporting Health Founders — Rellia Health",
        metaDescription:
          "Rellia Health connects healthcare founders with diagnostics, vetted advisors, and programs built for regulated markets.",
        description:
          "Rellia Health connects healthcare founders with diagnostics, vetted advisors, and programs built for regulated markets.",
        ogTitle: "Supporting Health Founders — Rellia Health",
        ogDescription:
          "Diagnostics, advisor matching, and practical programs for health tech founders.",
      },
    },
  })

  const existingAdvisorFilterIds = await client.fetch<string[]>(`*[_type == "advisorFilter"]._id`)
  for (const id of existingAdvisorFilterIds) {
    mutations.push({ delete: { id } })
  }
  const existingFounderSpecialtyDocIds = await client.fetch<string[]>(`*[_type == "founderSpecialty"]._id`)
  for (const id of existingFounderSpecialtyDocIds) {
    mutations.push({ delete: { id } })
  }

  // Directory filter groups (power the dynamic directory filter UI)
  const sharedCountryGroupSlug = slugify("Country")
  const advisorsExpertiseGroupSlug = slugify("Expertise")
  const foundersSpecialtyGroupSlug = slugify("Specialty")
  const foundersBusinessModelGroupSlug = slugify("Business Model")

  const existingFilterGroupIds = await client.fetch<string[]>(
    `*[_type == "directoryFilterGroup"]._id`,
  )
  for (const id of existingFilterGroupIds) {
    mutations.push({ delete: { id } })
    if (id.startsWith("drafts.")) continue
    mutations.push({ delete: { id: `drafts.${id}` } })
  }
  mutations.push({ delete: { id: "directoryFilterGroup-level" } })

  mutations.push({
    createOrReplace: {
      _id: directoryFilterGroupId(sharedCountryGroupSlug),
      _type: "directoryFilterGroup",
      title: "Country",
      slug: { _type: "slug", current: sharedCountryGroupSlug },
      appliesTo: "both",
      sortOrder: 0,
      options: [
        { _type: "option", label: "United States" },
        { _type: "option", label: "Canada" },
        { _type: "option", label: "United Kingdom" },
        { _type: "option", label: "Germany" },
        { _type: "option", label: "France" },
        { _type: "option", label: "Australia" },
      ],
    },
  })

  mutations.push({
    createOrReplace: {
      _id: directoryFilterGroupId(advisorsExpertiseGroupSlug),
      _type: "directoryFilterGroup",
      title: "Expertise",
      slug: { _type: "slug", current: advisorsExpertiseGroupSlug },
      appliesTo: "advisors",
      sortOrder: 1,
      options: ADVISOR_FILTER_OPTIONS.filter((o) => o.id !== "all").map((o) => ({
        _type: "option",
        label: o.label,
      })),
    },
  })

  mutations.push({
    createOrReplace: {
      _id: directoryFilterGroupId(foundersSpecialtyGroupSlug),
      _type: "directoryFilterGroup",
      title: "Specialty",
      slug: { _type: "slug", current: foundersSpecialtyGroupSlug },
      appliesTo: "founders",
      sortOrder: 1,
      options: FOUNDER_SPECIALTY_OPTIONS.map((label) => ({ _type: "option", label })),
    },
  })

  mutations.push({
    createOrReplace: {
      _id: directoryFilterGroupId(foundersBusinessModelGroupSlug),
      _type: "directoryFilterGroup",
      title: "Business Model",
      slug: { _type: "slug", current: foundersBusinessModelGroupSlug },
      appliesTo: "founders",
      sortOrder: 2,
      options: [
        { _type: "option", label: "B2B" },
        { _type: "option", label: "B2C" },
        { _type: "option", label: "B2B2C" },
        { _type: "option", label: "SaaS" },
        { _type: "option", label: "Marketplace" },
        { _type: "option", label: "Hardware" },
        { _type: "option", label: "Services" },
        { _type: "option", label: "Subscription" },
      ],
    },
  })

  const advisorCountryValues = (country: string | string[] | undefined): string[] => {
    if (!country) return []
    return Array.isArray(country) ? country : [country]
  }

  type SeedAdvisor = {
    id: string
    linkedInUrl?: string
    websiteUrl?: string
    socialLinks?: Array<{ platform?: string; label?: string; url?: string }>
    country?: string | string[]
    filter?: string
  }

  const buildAdvisorSocialLinks = (advisor: SeedAdvisor) => {
    if (Array.isArray(advisor.socialLinks) && advisor.socialLinks.length > 0) {
      return advisor.socialLinks.map((link, index) => ({
        _type: "socialLink" as const,
        _key: `social-${index}`,
        platform: link.platform ?? "website",
        label: link.label ?? "Website",
        url: link.url ?? advisor.websiteUrl ?? advisor.linkedInUrl,
      }))
    }
    const links: Array<{
      _type: "socialLink"
      _key: string
      platform: string
      label: string
      url: string
    }> = []
    if (advisor.linkedInUrl) {
      links.push({
        _type: "socialLink",
        _key: "linkedin",
        platform: "linkedin",
        label: "LinkedIn",
        url: advisor.linkedInUrl,
      })
    }
    if (advisor.websiteUrl) {
      links.push({
        _type: "socialLink",
        _key: "website",
        platform: "website",
        label: "Website",
        url: advisor.websiteUrl,
      })
    }
    return links.length > 0 ? links : undefined
  }

  const buildAdvisorDirectoryFilters = (advisor: SeedAdvisor & { filter?: string }) => {
    const filters: Array<{
      _type: "directoryFilterAssignment"
      group: { _type: "reference"; _ref: string }
      values: string[]
    }> = []
    const countries = advisorCountryValues(advisor.country)
    if (countries.length > 0) {
      filters.push({
        _type: "directoryFilterAssignment",
        group: { _type: "reference", _ref: directoryFilterGroupId(sharedCountryGroupSlug) },
        values: countries,
      })
    }
    if (advisor.filter) {
      filters.push({
        _type: "directoryFilterAssignment",
        group: { _type: "reference", _ref: directoryFilterGroupId(advisorsExpertiseGroupSlug) },
        values: [advisor.filter],
      })
    }
    return filters.length > 0 ? filters : undefined
  }

  mutations.push({
    createOrReplace: {
      _id: `advisor-${DUMMY_ADVISOR.id}`,
      _type: "advisor",
      slug: { _type: "slug", current: DUMMY_ADVISOR.id },
      name: DUMMY_ADVISOR.name,
      organization: DUMMY_ADVISOR.organization,
      role: DUMMY_ADVISOR.role,
      yearJoined: DUMMY_ADVISOR.yearJoined,
      industries: DUMMY_ADVISOR.industries,
      snapshot: DUMMY_ADVISOR.snapshot,
      directoryFilters: [
        {
          _type: "directoryFilterAssignment",
          group: { _type: "reference", _ref: directoryFilterGroupId(sharedCountryGroupSlug) },
          values: DUMMY_ADVISOR.countries,
        },
        {
          _type: "directoryFilterAssignment",
          group: { _type: "reference", _ref: directoryFilterGroupId(advisorsExpertiseGroupSlug) },
          values: [DUMMY_ADVISOR.expertiseFilter],
        },
      ],
      photoSrc: DUMMY_ADVISOR.photoSrc,
      socialLinks: DUMMY_ADVISOR.socialLinks,
      bio: createDummyAdvisorBio(ptBlock, bullet),
    },
  })

  // Directory data — only seeded showcase alumni (placeholders removed).
  mutations.push({
    createOrReplace: {
      _id: `alumniCompany-${POWER_OF_PLAY_ALUMNI.id}`,
      _type: "alumniCompany",
      slug: { _type: "slug", current: POWER_OF_PLAY_ALUMNI.slug },
      name: POWER_OF_PLAY_ALUMNI.name,
      logoSrc: POWER_OF_PLAY_ALUMNI.logoSrc,
      tagline: POWER_OF_PLAY_ALUMNI.tagline,
      shortDescription: POWER_OF_PLAY_ALUMNI.shortDescription,
      yearJoined: POWER_OF_PLAY_ALUMNI.yearJoined,
      socialLinks: POWER_OF_PLAY_ALUMNI.socialLinks,
      email: POWER_OF_PLAY_ALUMNI.email,
      founders: POWER_OF_PLAY_ALUMNI.founders,
      profileBody: createPowerOfPlayProfileBody(ptBlock, bullet, block),
      directoryFilters: [
        {
          _type: "directoryFilterAssignment",
          group: { _type: "reference", _ref: directoryFilterGroupId(sharedCountryGroupSlug) },
          values: POWER_OF_PLAY_ALUMNI.countries,
        },
        {
          _type: "directoryFilterAssignment",
          group: { _type: "reference", _ref: directoryFilterGroupId(foundersSpecialtyGroupSlug) },
          values: POWER_OF_PLAY_ALUMNI.specialtyTags,
        },
        {
          _type: "directoryFilterAssignment",
          group: { _type: "reference", _ref: directoryFilterGroupId(foundersBusinessModelGroupSlug) },
          values: POWER_OF_PLAY_ALUMNI.businessModels,
        },
      ],
    },
  })

  // Batch in chunks (Sanity has request size limits)
  const chunkSize = 50
  for (let i = 0; i < mutations.length; i += chunkSize) {
    const chunk = mutations.slice(i, i + chunkSize)
     
    console.log(`Committing ${chunk.length} mutations (${i + 1}-${Math.min(i + chunkSize, mutations.length)}/${mutations.length})`)
    await client.mutate(chunk, { autoGenerateArrayKeys: true })
  }

   
  console.log("Seed complete")
}

main().catch((err) => {
   
  console.error(err)
  process.exitCode = 1
})

