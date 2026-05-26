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
  DEFAULT_HOME_PAGE,
  DEFAULT_NOT_FOUND,
  DEFAULT_PAYMENT_PAGE,
  DEFAULT_PROGRAMS_LANDING,
  DEFAULT_QMS_PROGRAM,
} from "../shared/cms/defaults"
import {
  DEFAULT_EVENTS_LANDING_HERO_PORTABLE,
  DEFAULT_STORIES_PAGE_HEADLINE_PORTABLE,
} from "../shared/cms/inlineHeroHeadline"
import { ADVISOR_DIRECTORY_SEED, ADVISOR_FILTER_OPTIONS } from "../client/data/advisorDirectory"
import { FOUNDER_DIRECTORY, ALL_LEVELS, ALL_SPECIALTIES } from "../client/data/founderDirectory"
import { ROUTE_SEO } from "../client/config/seo"
import { STORIES } from "../client/content/stories"

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

const pagePublishingLive = { pageVisibility: "live" as const }

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

const storyFilterIdForTag = (tag: string): string => `storyFilter-${slugify(tag)}`

const directoryFilterGroupId = (slug: string): string => `directoryFilterGroup-${slug}`

const portableStoryBody = (story: (typeof STORIES)[number]): PortableStoryNode[] => {
  const nodes: PortableStoryNode[] = []

  story.body.forEach((b, i) => {
    const key = stableKey(`story-${story.slug}`, i)

    if (b.type === "p") {
      nodes.push(block(key, b.text, "normal"))
      return
    }
    if (b.type === "h2") {
      nodes.push(block(key, b.text, "h2"))
      return
    }
    if (b.type === "h3") {
      nodes.push(block(key, b.text, "h3"))
      return
    }

    // Quotes/images in the local format don't map 1:1 to our portable schema.
    // We convert them into supported portable types.
    if (b.type === "quote") {
      const attribution = (b.attribution ?? "").trim()
      const text = attribution ? `${b.text}\n— ${attribution}` : b.text
      nodes.push({
        _type: "block",
        _key: key,
        style: "blockquote",
        markDefs: [],
        children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
      })
      return
    }

    if (b.type === "cta") {
      nodes.push({
        _type: "bodyCtaBox",
        _key: key,
        title: b.title,
        body: b.body,
        buttonLabel: b.buttonLabel,
        buttonHref: b.buttonHref,
      })
      return
    }

    if (b.type === "imageCarousel") {
      nodes.push({
        _type: "portableImageCarousel",
        _key: key,
        title: b.title,
        slides: b.slides.map((s, slideIndex) => ({
          _type: "portableImageCarouselSlide",
          _key: stableKey(`${key}-slide`, slideIndex),
          imageSrc: s.src,
          alt: s.alt,
          caption: s.caption,
        })),
      })
      return
    }

    if (b.type === "image") {
      // The portable rich text schema's standalone `image` requires a Sanity asset ref.
      // Our local stories use remote URLs, so we represent it as a 1-slide carousel,
      // which supports a plain imageSrc string URL.
      nodes.push({
        _type: "portableImageCarousel",
        _key: key,
        slides: [
          {
            _type: "portableImageCarouselSlide",
            _key: stableKey(`${key}-slide`, 0),
            imageSrc: b.src,
            alt: b.alt,
            caption: b.caption,
          },
        ],
      })
      return
    }
  })

  return nodes
}

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
    href: "/network",
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
      { enabled: true, label: "Startup Diagnostic", href: "/diagnostics" },
      { enabled: true, label: "Consulting", href: "/consulting" },
    ],
  },
  {
    enabled: true,
    label: "Network",
    href: "/network",
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
      { enabled: true, label: "Industry Partners Directory", href: "/industry-partners/directory" },
    ],
  },
  {
    enabled: true,
    label: "Company",
    href: "/about",
    children: [
      { enabled: true, label: "About Us", href: "/about" },
      { enabled: true, label: "FAQ", href: "/faq" },
      { enabled: true, label: "Careers", href: "/careers" },
      { enabled: true, label: "Contact", href: "/contact" },
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

  // Singletons: IDs match deskStructure documentIds
  mutations.push({
    createOrReplace: { _id: "globalSettings", _type: "globalSettings", ...DEFAULT_GLOBAL_SETTINGS },
  })
  mutations.push({
    createOrReplace: {
      _id: "eventsLandingPage",
      _type: "eventsLandingPage",
      heroTitlePortable: DEFAULT_EVENTS_LANDING_HERO_PORTABLE,
      heroSubtitle: "Join live sessions with operators, clinicians, and health tech leaders.",
      ctaTitle: "Want to **speak** at a Rellia event?",
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
      title: "Founders",
      useModularPage: false,
      ...pagePublishingLive,
      seo: seoForRoute("/founders"),
      sections: [
        {
          _type: "sectionHero",
          _key: "hero",
          badge: "Founders",
          headline: [block("nf-hero-hl", "Are you building in health tech?", "normal")],
          subheadline: [
            block(
              "nf-hero-sub",
              "Rellia is for founders who are serious about building in health tech — from idea through Series A.",
              "normal",
            ),
          ],
          primaryCta: { label: "Apply to join", href: "/apply" },
          secondaryCta: { label: "View alumni directory", href: "/founders/alumni" },
        },
        {
          _type: "sectionRichText",
          _key: "intro",
          title: "What you’ll get",
          body: [
            {
              _type: "block",
              _key: "p1",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "p1s1",
                  text: "Clear outcomes, direct access to domain experts, and a high-signal community built for founders navigating healthcare.",
                  marks: [],
                },
              ],
            },
          ],
        },
        {
          _type: "sectionCardsGrid",
          _key: "cards",
          title: "Why founders join",
          subtitle: "Edit, add, remove, and reorder these cards in Sanity.",
          cards: [
            {
              _type: "card",
              _key: "c1",
              title: "Regulatory & evidence clarity",
              body: "Avoid costly missteps and build the right documentation and evidence at the right time.",
            },
            {
              _type: "card",
              _key: "c2",
              title: "Advisors who’ve done it",
              body: "Get practical guidance from operators, clinicians, and specialists with real experience.",
            },
            {
              _type: "card",
              _key: "c3",
              title: "Community + accountability",
              body: "Surround yourself with builders facing the same constraints and timelines.",
            },
          ],
        },
      ],
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkAdvisorsPage",
      _type: "networkAdvisorsPage",
      title: "Advisors",
      useModularPage: false,
      ...pagePublishingLive,
      seo: seoForRoute("/advisors"),
      sections: [
        {
          _type: "sectionHero",
          _key: "hero",
          badge: "Advisors",
          headline: [block("na-hero-hl", "Some people are wired to help others succeed.", "normal")],
          subheadline: [
            block(
              "na-hero-sub",
              "Mentor serious health tech founders through structured, respectful engagements — stay close to innovation while keeping flexibility.",
              "normal",
            ),
          ],
          primaryCta: { label: "Apply to join", href: "/apply" },
          secondaryCta: { label: "Browse our Advisors", href: "/advisors/directory" },
        },
        {
          _type: "sectionCardsGrid",
          _key: "models",
          title: "Ways to support founders",
          subtitle: "These are editable sections — you can reorder or rewrite anytime.",
          cards: [
            { _type: "card", _key: "m1", title: "Community & network", body: "Engage in curated intros and async support without rigid mandates." },
            { _type: "card", _key: "m2", title: "Advisory roles", body: "Join milestone-scoped charters when there’s mutual fit." },
            { _type: "card", _key: "m3", title: "Workshops", body: "Lead targeted sessions where founders need pattern-level clarity." },
          ],
        },
      ],
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkInvestorsPage",
      _type: "networkInvestorsPage",
      title: "Investors",
      useModularPage: false,
      ...pagePublishingLive,
      seo: seoForRoute("/investors"),
      sections: [
        {
          _type: "sectionHero",
          _key: "hero",
          badge: "Investors",
          headline: [block("ni-hero-hl", "Stop sorting through cold pitch decks.", "normal")],
          subheadline: [
            block(
              "ni-hero-sub",
              "Meet Rellia-backed teams with sharper clinical, regulatory, and commercial milestones — before diligence becomes a fire drill.",
              "normal",
            ),
          ],
          primaryCta: { label: "Get notified", href: "/contact" },
        },
        {
          _type: "sectionRichText",
          _key: "note",
          title: "How it works",
          body: [
            {
              _type: "block",
              _key: "p1",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "p1s1",
                  text: "This page is now fully CMS-driven. Add sections for thesis alignment, dealflow, cohort updates, and more — and reorder them any time.",
                  marks: [],
                },
              ],
            },
          ],
        },
      ],
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkPartnersPage",
      _type: "networkPartnersPage",
      title: "Industry Partners",
      useModularPage: false,
      ...pagePublishingLive,
      seo: seoForRoute("/industry-partners"),
      sections: [
        {
          _type: "sectionHero",
          _key: "hero",
          badge: "Industry partners",
          headline: [block("np-hero-hl", "Reach the founders who need you.", "normal")],
          subheadline: [
            block(
              "np-hero-sub",
              "Pilot design, integration support, and enterprise credibility — so promising products don’t die in procurement limbo.",
              "normal",
            ),
          ],
          primaryCta: { label: "Apply to join", href: "/apply" },
          secondaryCta: { label: "See vendor directory", href: "/industry-partners/directory" },
        },
        {
          _type: "sectionCardsGrid",
          _key: "engage",
          title: "Partner engagement",
          subtitle: "Swap these cards, change CTAs, or add new sections anytime.",
          cards: [
            {
              _type: "card",
              _key: "p1",
              title: "Integrations",
              body: "Support founders with integration guidance and distribution clarity.",
              cta: { label: "Contact", href: "/contact" },
            },
            {
              _type: "card",
              _key: "p2",
              title: "Pilot pathways",
              body: "Create credible routes to pilot and evaluate products in real environments.",
              cta: { label: "Contact", href: "/contact" },
            },
            {
              _type: "card",
              _key: "p3",
              title: "Services & vendors",
              body: "Offer vetted services that reduce time-to-evidence and time-to-market.",
              cta: { label: "Contact", href: "/contact" },
            },
          ],
        },
      ],
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "consultingPage",
      _type: "consultingPage",
      title: "Consulting",
      seo: seoForRoute("/consulting"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "homePage",
      _type: "homePage",
      ...DEFAULT_HOME_PAGE,
      ctaImageUrl: toSanityAbsoluteUrl(DEFAULT_HOME_PAGE.ctaImageUrl),
      seo: seoForRoute("/"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "aboutPage",
      _type: "aboutPage",
      ...DEFAULT_ABOUT_PAGE,
      seo: seoForRoute("/about"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "careersPage",
      _type: "careersPage",
      defaultTab: "hiring",
      enableHiringTab: true,
      enableVolunteerTab: true,
      tabsLabelHiring: "Hiring",
      tabsLabelVolunteer: "Volunteer",
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

  // Programs: one document per program (card + detail page content)
  for (const [index, program] of DEFAULT_PROGRAMS_LANDING.programs.entries()) {
    const title = program.title?.trim()
    if (!title) continue
    const slug = (program.href || "").split("/").filter(Boolean).pop() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const programAssetId = await resolveImageAssetId(client, program.imageSrc)
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
              pricingBadge: DEFAULT_QMS_PROGRAM.pricingBadge,
              pricingAmount: DEFAULT_QMS_PROGRAM.pricingAmount,
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
        href: e.href,
        comingSoon: (e as any).comingSoon,
        buttonText: (e as any).buttonText,
        location: (e as any).location,
        lumaEventId: (e as any).lumaEventId,
        eventDescription: (e as any).detailBody,
        detailBodyHeading: (e as any).detailBodyHeading,
        embedLumaOnDetailPage: (e as any).embedLumaOnDetailPage,
        addToCalendarEnabled: (e as any).addToCalendarEnabled,
        status: "upcoming",
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
        href: e.href,
        comingSoon: (e as any).comingSoon,
        buttonText: (e as any).buttonText,
        location: (e as any).location,
        lumaEventId: (e as any).lumaEventId,
        eventDescription: (e as any).detailBody,
        detailBodyHeading: (e as any).detailBodyHeading,
        embedLumaOnDetailPage: (e as any).embedLumaOnDetailPage,
        addToCalendarEnabled: (e as any).addToCalendarEnabled,
        status: "past",
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
      _id: "paymentPage",
      _type: "paymentPage",
      ...DEFAULT_PAYMENT_PAGE,
      seo: { ...(seoForRoute("/membership") ?? {}), noIndex: true },
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

  // Site settings singleton exists in desk; seed minimal safe defaults
  mutations.push({
    createOrReplace: {
      _id: "siteSettings",
      _type: "siteSettings",
      brandName: "Rellia Health",
      faviconPath: "/favicon.ico",
    },
  })

  // Story filters (used by story documents)
  const storyTagSet = new Set(STORIES.map((s) => s.tag).filter(Boolean))
  Array.from(storyTagSet)
    .sort((a, b) => a.localeCompare(b))
    .forEach((tag, index) => {
      const id = storyFilterIdForTag(tag)
      mutations.push({
        createOrReplace: {
          _id: id,
          _type: "storyFilter",
          title: tag,
          slug: { _type: "slug", current: slugify(tag) },
          description: `Stories tagged as ${tag}.`,
          order: index,
        },
      })
    })

  // Stories
  for (const story of STORIES) {
    const slug = (story.slug || "").trim()
    if (!slug) continue

    const storyFilterId = storyFilterIdForTag(story.tag)
    const storyImageAssetId = await resolveImageAssetId(client, story.coverImageSrc)
    mutations.push({
      createOrReplace: {
        _id: `story.${slug}`,
        _type: "story",
        featured: Boolean(story.featured),
        title: story.title,
        slug: { _type: "slug", current: slug },
        filters: story.tag
          ? [{ _type: "reference", _ref: storyFilterId }]
          : undefined,
        publishedAt: story.publishedAt ? new Date(story.publishedAt).toISOString() : undefined,
        excerpt: story.excerpt,
        headerImage: toSanityImageFieldValue(storyImageAssetId),
        headerImageAlt: story.coverImageAlt,
        body: portableStoryBody(story),
        seo: {
          metaTitle: story.seoTitle,
          metaDescription: story.seoDescription,
          ogTitle: story.seoTitle,
          ogDescription: story.seoDescription,
        },
      },
    })
  }

  // Legal pages as modular CMS pages (so /terms and /privacy resolve via CmsCatchAll)
  mutations.push({
    createOrReplace: {
      _id: "page.terms",
      _type: "page",
      title: "Terms of Use",
      slug: { _type: "slug", current: "terms" },
      sections: [
        {
          _type: "sectionHero",
          _key: "terms-hero",
          tag: "Legal",
          title: "Terms of Use",
          subtitle:
            "Please read these Terms of Use carefully before participating in Rellia Health's programs, accessing our platforms, or engaging with our content.",
        },
        {
          _type: "sectionRichText",
          _key: "terms-body",
          title: "Terms",
          body: termsPortableText(),
        },
      ],
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "page.privacy",
      _type: "page",
      title: "Privacy Policy",
      slug: { _type: "slug", current: "privacy" },
      sections: [
        {
          _type: "sectionHero",
          _key: "privacy-hero",
          tag: "Legal",
          title: "Privacy Policy",
          subtitle:
            "Rellia Health is committed to handling your personal information with care and transparency.",
        },
        {
          _type: "sectionRichText",
          _key: "privacy-body",
          title: "Policy",
          body: privacyPortableText(),
        },
      ],
    },
  })

  // Directory taxonomy: seed editable filter/level/specialty docs first so advisors and
  // alumni companies can reference them.
  const advisorFilterIdByLabel = new Map<string, string>()
  for (const [index, opt] of ADVISOR_FILTER_OPTIONS.entries()) {
    if (opt.id === "all") continue
    const label = opt.label
    const docId = `advisorFilter-${slugify(label)}`
    advisorFilterIdByLabel.set(label, docId)
    mutations.push({
      createOrReplace: {
        _id: docId,
        _type: "advisorFilter",
        label,
        slug: { _type: "slug", current: slugify(label) },
        sortOrder: index,
      },
    })
  }

  // New directory filter groups (power the dynamic directory filter UI)
  const advisorsGroupSlug = slugify("Expertise")
  const foundersCountryGroupSlug = slugify("Country")
  const foundersSpecialtyGroupSlug = slugify("Specialty")
  const foundersBusinessModelGroupSlug = slugify("Business Model")

  mutations.push({
    createOrReplace: {
      _id: directoryFilterGroupId(advisorsGroupSlug),
      _type: "directoryFilterGroup",
      title: "Expertise",
      slug: { _type: "slug", current: advisorsGroupSlug },
      appliesTo: "advisors",
      sortOrder: 0,
      options: ADVISOR_FILTER_OPTIONS.filter((o) => o.id !== "all").map((o) => ({
        _type: "option",
        label: o.label,
      })),
    },
  })

  mutations.push({ delete: { id: "directoryFilterGroup-level" } })

  mutations.push({
    createOrReplace: {
      _id: directoryFilterGroupId(foundersCountryGroupSlug),
      _type: "directoryFilterGroup",
      title: "Country",
      slug: { _type: "slug", current: foundersCountryGroupSlug },
      appliesTo: "founders",
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
      _id: directoryFilterGroupId(foundersSpecialtyGroupSlug),
      _type: "directoryFilterGroup",
      title: "Specialty",
      slug: { _type: "slug", current: foundersSpecialtyGroupSlug },
      appliesTo: "founders",
      sortOrder: 1,
      options: ALL_SPECIALTIES.map((label) => ({ _type: "option", label })),
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

  // Removed Level taxonomy document seeding

  const founderSpecialtyIdByLabel = new Map<string, string>()
  for (const [index, label] of ALL_SPECIALTIES.entries()) {
    const docId = `founderSpecialty-${slugify(label)}`
    founderSpecialtyIdByLabel.set(label, docId)
    mutations.push({
      createOrReplace: {
        _id: docId,
        _type: "founderSpecialty",
        label,
        slug: { _type: "slug", current: slugify(label) },
        sortOrder: index,
      },
    })
  }

  // Directory data
  for (const advisor of ADVISOR_DIRECTORY_SEED) {
    const filterRefId = advisor.filter ? advisorFilterIdByLabel.get(advisor.filter) : undefined
    mutations.push({
      createOrReplace: {
        _id: `advisor-${advisor.id}`,
        _type: "advisor",
        slug: { _type: "slug", current: advisor.id },
        name: advisor.name,
        organization: advisor.organization,
        role: advisor.role,
        location: advisor.location,
        country: advisor.country,
        yearJoined: advisor.yearJoined,
        industries: advisor.industries,
        focus: advisor.focus,
        filter: filterRefId
          ? { _type: "reference", _ref: filterRefId }
          : undefined,
        directoryFilters: advisor.filter
          ? [
              {
                _type: "directoryFilterAssignment",
                group: { _type: "reference", _ref: directoryFilterGroupId(advisorsGroupSlug) },
                values: [advisor.filter],
              },
            ]
          : undefined,
        photoSrc: advisor.photoSrc,
        linkedInUrl: advisor.linkedInUrl,
        websiteUrl: advisor.websiteUrl,
        bio: advisor.bio,
        mentoringStyle: advisor.mentoringStyle,
        highlights: advisor.highlights,
      },
    })
  }

  for (const company of FOUNDER_DIRECTORY) {
    const specialtyRefs = (company.specialties ?? [])
      .map((label) => founderSpecialtyIdByLabel.get(label))
      .filter((id): id is string => Boolean(id))
      .map((id) => ({
        _type: "reference",
        _ref: id,
      }))
    mutations.push({
      createOrReplace: {
        _id: `alumniCompany-${company.id}`,
        _type: "alumniCompany",
        slug: { _type: "slug", current: company.id },
        name: company.logoName,
        tagline: company.tagline,
        specialties: specialtyRefs,
        directoryFilters: [
          ...(company.country ?? []).map((c) => ({
            _type: "directoryFilterAssignment",
            group: { _type: "reference", _ref: directoryFilterGroupId(foundersCountryGroupSlug) },
            values: [c],
          })),
          ...(company.specialties ?? []).map((s) => ({
            _type: "directoryFilterAssignment",
            group: { _type: "reference", _ref: directoryFilterGroupId(foundersSpecialtyGroupSlug) },
            values: [s],
          })),
          ...(company.businessModel ?? []).map((bm) => ({
            _type: "directoryFilterAssignment",
            group: { _type: "reference", _ref: directoryFilterGroupId(foundersBusinessModelGroupSlug) },
            values: [bm],
          })),
        ].filter(Boolean),
        shortDescription: company.shortDescription,
        longDescription: company.longDescription,
        websiteUrl: company.websiteUrl,
        linkedinUrl: company.linkedinUrl,
        traction: company.traction,
        relliaCollaboration: company.relliaCollaboration,
        imageSrc: company.imageSrc,
        country: company.country,
        businessModel: company.businessModel,
        yearJoined: company.yearJoined,
        programs: company.programs,
        logoSrc: company.logoSrc,
        founders: company.founders,
      },
    })
  }

  // Batch in chunks (Sanity has request size limits)
  const chunkSize = 50
  for (let i = 0; i < mutations.length; i += chunkSize) {
    const chunk = mutations.slice(i, i + chunkSize)
    // eslint-disable-next-line no-console
    console.log(`Committing ${chunk.length} mutations (${i + 1}-${Math.min(i + chunkSize, mutations.length)}/${mutations.length})`)
    await client.mutate(chunk, { autoGenerateArrayKeys: true })
  }

  // eslint-disable-next-line no-console
  console.log("Seed complete")
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})

