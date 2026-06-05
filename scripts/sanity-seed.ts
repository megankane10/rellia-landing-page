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
  DEFAULT_APPLY_PAGE,
  DEFAULT_PAYMENT_PAGE,
  DEFAULT_PROGRAMS_LANDING,
  DEFAULT_QMS_PROGRAM,
} from "../shared/cms/defaults"
import { DIAGNOSTIC_SURVEY_SECTIONS } from "../client/data/diagnosticSurveySections"
import {
  DEFAULT_EVENTS_LANDING_HERO_PORTABLE,
  DEFAULT_STORIES_PAGE_HEADLINE_PORTABLE,
} from "../shared/cms/inlineHeroHeadline"
import { ADVISOR_DIRECTORY_SEED, ADVISOR_FILTER_OPTIONS } from "../client/data/advisorDirectory"
import { FOUNDER_DIRECTORY, ALL_LEVELS, ALL_SPECIALTIES } from "../client/data/founderDirectory"
import { PORTFOLIO_LOGO_MARKS, INVESTOR_BRAND_SVG_MARKS } from "../client/data/portfolioLogos"
import { ROUTE_SEO } from "../client/config/seo"
import { STORIES } from "../client/content/stories"
import { CAREERS_OPEN_ROLES } from "../shared/careersOpenRoles"
import { threePartHeroHeadline } from "../shared/cms/inlineHeroHeadline"
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
      { enabled: true, label: "Startup Diagnostic", href: "/diagnostics" },
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

/** Careers join-team band — uploaded to Sanity so production does not rely on Pexels fallbacks. */
const CAREERS_TEAM_MARQUEE_URLS = [
  "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900",
] as const

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
    const assetId = await resolveImageAssetId(client, mark.src)
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

const buildCareersTeamMarqueeImages = async (client: ReturnType<typeof createClient>) => {
  const images: Array<{ _key: string; alt: string; asset?: { _type: "reference"; _ref: string } }> = []
  let index = 0
  for (const url of CAREERS_TEAM_MARQUEE_URLS) {
    const filename = `careers-marquee-${index + 1}.jpg`
    const assetId = await resolveRemoteImageAssetId(client, url, filename)
    if (!assetId) continue
    images.push({
      _key: `careers-marquee-${index}`,
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

/** Membership fields actually rendered on /membership (no legacy hero/image-card copy). */
const paymentPageSeedDocument = () => ({
  _id: "paymentPage",
  _type: "paymentPage",
  ...pagePublishingLive,
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
  const investorsLogoMarquee = await buildLogoMarqueeItems(client, INVESTOR_BRAND_SVG_MARKS)
  const careersTeamMarqueeImages = await buildCareersTeamMarqueeImages(client)
  const careersLifeAtRelliaImages = await buildCareersLifeAtRelliaImages(client)

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
    createOrReplace: {
      _id: "globalSettings",
      _type: "globalSettings",
      ...DEFAULT_GLOBAL_SETTINGS,
      priorityModalEnabled: dataset === "preview",
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "eventsLandingPage",
      _type: "eventsLandingPage",
      ...pagePublishingLive,
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
      ...pagePublishingLive,
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
      ...pagePublishingLive,
      logoMarquee: foundersLogoMarquee.length > 0 ? foundersLogoMarquee : undefined,
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkAdvisorsPage",
      _type: "networkAdvisorsPage",
      title: "Advisors",
      ...pagePublishingLive,
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "networkInvestorsPage",
      _type: "networkInvestorsPage",
      title: "Investors",
      ...pagePublishingLive,
      logoMarquee: investorsLogoMarquee.length > 0 ? investorsLogoMarquee : undefined,
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
      title: "Industry Partners",
      ...pagePublishingLive,
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "consultingPage",
      _type: "consultingPage",
      title: "Consulting",
      ...pagePublishingLive,
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "diagnosticLandingPage",
      _type: "diagnosticLandingPage",
      title: "Startup Diagnostic",
      ...pagePublishingLive,
    },
  })
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
      ...pagePublishingLive,
      ...DEFAULT_HOME_PAGE,
      ctaImageUrl: toSanityAbsoluteUrl(DEFAULT_HOME_PAGE.ctaImageUrl),
      seo: seoForRoute("/"),
    },
  })
  const { heroHeadlinePortable: _aboutHeroDefault, ...aboutFields } = DEFAULT_ABOUT_PAGE
  mutations.push({
    createOrReplace: {
      _id: "aboutPage",
      _type: "aboutPage",
      ...pagePublishingLive,
      ...aboutFields,
      heroHeadlinePortable: threePartHeroHeadline("Empowering the", "next generation", " of health tech."),
      seo: seoForRoute("/about"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "careersPage",
      _type: "careersPage",
      ...pagePublishingLive,
      defaultTab: "hiring",
      enableHiringTab: true,
      enableVolunteerTab: true,
      tabsLabelHiring: "Hiring",
      tabsLabelVolunteer: "Volunteer",
      openRoles: CAREERS_OPEN_ROLES.map((role) => ({
        _type: "openRole",
        _key: role.id,
        roleId: role.id,
        title: role.title,
        location: role.location,
        employmentType: role.employmentType,
        description: role.description,
        responsibilities: role.responsibilities,
        linkedInApplyUrl: role.linkedInApplyUrl,
      })),
      teamMarqueeImages:
        careersTeamMarqueeImages.length > 0 ? careersTeamMarqueeImages : undefined,
      lifeAtRelliaHeading: "Life at Rellia",
      lifeAtRelliaSubheading: "We are building a remote-first, high-standards health-tech company. Our team brings deep clinical, technical, and operational expertise to help founders transform care. We focus on outcome-oriented work, mutual support, and constant learning.",
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
      ...pagePublishingLive,
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
      ...pagePublishingLive,
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
              pricingDiscountEnabled: DEFAULT_QMS_PROGRAM.pricingDiscountEnabled ?? false,
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
      ...pagePublishingLive,
      ...DEFAULT_CONTACT_PAGE,
      seo: seoForRoute("/contact"),
    },
  })
  mutations.push({
    createOrReplace: {
      _id: "applyPage",
      _type: "applyPage",
      ...pagePublishingLive,
      ...DEFAULT_APPLY_PAGE,
      seo: seoForRoute("/apply"),
    },
  })
  mutations.push({
    createOrReplace: paymentPageSeedDocument(),
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
      submitSubtitle: "You’re about to submit your responses. After confirmation, we’ll generate your report and save your submission in the Rellia CMS.",
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
      reportMembershipCtaTitle: "Detailed report access is restricted",
      reportMembershipCtaBody: "Join Rellia Health to unlock your custom advisory board, full gap analysis, and personalized actions - and accelerate your journey.",
      reportMembershipCtaButton: "Apply for Membership",
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

  // Site settings singleton exists in desk; seed minimal safe defaults
  const siteDefaultSeo = seoForRoute("/")
  mutations.push({
    createOrReplace: {
      _id: "siteSettings",
      _type: "siteSettings",
      brandName: "Rellia Health",
      faviconPath: "/favicon.ico",
      lookerStudioEmbedUrl:
        "https://datastudio.google.com/embed/reporting/694548a7-7a81-4328-8519-b655996dc800/page/FvRzF",
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
      sections: [
        {
          _type: "guideSection",
          _key: "seo",
          heading: "SEO in Studio",
          body:
            "Each page has an SEO tab with a live Google preview (free). Ignore SEO Health Dashboard — it requires a paid license. Use the per-page SEO fields instead. Site-wide defaults live under Site → Site settings → Default SEO.",
        },
        {
          _type: "guideSection",
          _key: "analytics",
          heading: "Analytics",
          body:
            "Use the Analytics tool in the Studio top bar (full-screen Looker embed). Set the URL under Site → Site settings → Analytics (Studio). In Looker: Share → Embed report → copy iframe src. Public site traffic also uses Vercel Analytics; add GA4 or Plausible in Vercel if you need marketing funnels beyond Looker.",
        },
        {
          _type: "guideSection",
          _key: "publish",
          heading: "Drafts vs published vs the live site",
          body:
            "Two different ideas: (1) Studio “Published” = saved to the dataset. (2) Page visibility (Live / Hidden / Placeholder) = whether the marketing site shows the real page or a coming-soon message. A page can be Published in Studio but still show Placeholder on the site if visibility is set to Placeholder — change it under Publishing → Page visibility → Live. Preview Vercel deploys use the preview dataset; www uses production after pnpm sanity:promote.",
        },
        {
          _type: "guideSection",
          _key: "presentation",
          heading: "Visual editing (Presentation)",
          body:
            "On Vercel Preview (not www): set SANITY_API_READ_TOKEN, SANITY_STUDIO_URL=https://relliahealth.sanity.studio, and SANITY_STUDIO_PREVIEW_URL to your exact preview URL (no trailing slash). In website-cms/.env for hosted Studio, set the same SANITY_STUDIO_PREVIEW_URL. Open Presentation, wait for the iframe to load, then click content to edit. WebSocket warnings in the Studio console are usually harmless.",
        },
      ],
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
        snapshot: advisor.focus,
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
        country: company.country,
        businessModel: company.businessModel,
        yearJoined: company.yearJoined,
        logoSrc: company.logoSrc,
        founders: company.founders,
      },
    })
  }

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

