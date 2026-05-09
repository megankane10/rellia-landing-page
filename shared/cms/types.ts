export type SanityPortableText = Array<{
  _type: string
  _key?: string
  [key: string]: unknown
}>

export type NavItem = {
  enabled?: boolean
  label: string
  href: string
  description?: string
  badge?: string
  children?: NavItem[]
}

export type NavigationContent = {
  primary: NavItem[]
  footer: NavItem[]
}

export type CareersPageContent = {
  defaultTab?: "hiring" | "volunteer"
  enableHiringTab?: boolean
  enableVolunteerTab?: boolean
  tabsLabelHiring?: string
  tabsLabelVolunteer?: string
  seo?: SeoContent
}

export type SeoContent = {
  metaTitle?: string
  metaDescription?: string
  ogTitle?: string
  ogDescription?: string
  ogImageUrl?: string
  noIndex?: boolean
  noFollow?: boolean
}

export type HomePathsCard = {
  roleId: "founder" | "advisor" | "investor" | "partner"
  tagLabel?: string
  title?: string
  subtitle?: string
  imageSrc?: string
  imageAlt?: string
  ctaLabel?: string
  ctaTo?: string
}

export type CmsSectionHero = {
  _type: "sectionHero"
  _key?: string
  tag?: string
  badge?: string
  headline: string | SanityPortableText
  subheadline?: string | SanityPortableText
  primaryCta?: NavItem
  secondaryCta?: NavItem
  imageUrl?: string
  imageAlt?: string
}

export type CmsSectionRichText = {
  _type: "sectionRichText"
  _key?: string
  tag?: string
  title?: string
  body?: SanityPortableText | null
}

export type CmsSectionCardsGridCard = {
  _key?: string
  title: string
  body?: string
  badge?: string
  /** Lucide icon component name, e.g. Sparkles, ShieldCheck */
  iconKey?: string
  imageUrl?: string
  imageAlt?: string
  cta?: NavItem
  tags?: string[]
}

export type CmsSectionCardsGrid = {
  _type: "sectionCardsGrid"
  _key?: string
  tag?: string
  title?: string
  subtitle?: string
  cards?: CmsSectionCardsGridCard[]
}

export type CmsSectionEligibilityBentoItem = {
  _key?: string
  text: string
  pexelsQuery?: string
  imageUrl?: string
}

export type CmsSectionEligibilityBento = {
  _type: "sectionEligibilityBento"
  _key?: string
  badge?: string
  title?: string
  description?: string
  items?: CmsSectionEligibilityBentoItem[]
}

export type CmsSectionFeatureGridItem = {
  _key?: string
  title: string
  body?: string
  icon?: string
}

export type CmsSectionFeatureGrid = {
  _type: "sectionFeatureGrid"
  _key?: string
  badge?: string
  title?: string | SanityPortableText
  subtitle?: string | SanityPortableText
  items?: CmsSectionFeatureGridItem[]
}

export type CmsSectionEngageBandItem = {
  _key?: string
  title: string
  body?: string
  icon?: string
  href?: string
}

export type CmsSectionEngageBand = {
  _type: "sectionEngageBand"
  _key?: string
  badge?: string
  title?: string | SanityPortableText
  subtitle?: string | SanityPortableText
  items?: CmsSectionEngageBandItem[]
}

export type CmsSectionJourneyTimelineStep = {
  _key?: string
  id: string
  label: string
  detail: string
  icon?: string
}

export type CmsSectionJourneyTimeline = {
  _type: "sectionJourneyTimeline"
  _key?: string
  badge?: string
  title?: string | SanityPortableText
  description?: string | SanityPortableText
  leftColumnTitle?: string
  leftColumnBody?: string
  leftColumnSteps?: CmsSectionJourneyTimelineStep[]
  rightColumnTitle?: string
  rightColumnBody?: string
  rightColumnSteps?: CmsSectionJourneyTimelineStep[]
}

export type CmsSectionDiagnosticSurvey = {
  _type: "sectionDiagnosticSurvey"
  _key?: string
  badge?: string
  title?: string | SanityPortableText
  subtitle?: string | SanityPortableText
  ctaLabel?: string
  ctaHref?: string
  categoriesTitle?: string
  categories?: string[]
}

export type CmsPageSection =
  | CmsSectionHero
  | CmsSectionRichText
  | CmsSectionCardsGrid
  | CmsSectionEligibilityBento
  | CmsSectionFeatureGrid
  | CmsSectionEngageBand
  | CmsSectionJourneyTimeline
  | CmsSectionDiagnosticSurvey

export type CmsPageContent = {
  title: string
  slug: string
  seo?: SeoContent
  sections?: CmsPageSection[]
}

export type CmsSingletonPageContent = {
  title: string
  /** When true and sections exist, `/founders` etc. render modular CMS sections instead of the full marketing page. */
  useModularPage?: boolean
  seo?: SeoContent
  sections?: CmsPageSection[]
}

export type SanityImageAsset = {
  _type?: string
  asset?: {
    _ref?: string
    url?: string
  }
  url?: string
}

export type HomeMetric = {
  label: string
  value: number
  suffix?: string
}

export type HomeWhyFeature = {
  iconKey: string
  title: string
  description: string
  imageSrc?: string
  buttonLabel?: string
  buttonPath?: string
}

export type HomeTestimonial = {
  name: string
  role: string
  company: string
  quote: string
  companyInfo: string
  imageSrc: string
}

export type HomePageContent = {
  headlinePrefix: string
  subheadline: string
  primaryCtaLabel: string
  primaryCtaPath: string
  secondaryCtaLabel: string
  secondaryCtaPath: string
  /** Resolved MP4/WebM URL: uploaded file in Studio, or fallback string, or site default in merge */
  heroBackgroundVideoUrl?: string
  metricsHeading: string
  metricsSubheading: string
  metrics: HomeMetric[]
  whyFeatures: HomeWhyFeature[]
  ctaTitle: string
  ctaButtonLabel: string
  ctaButtonPath: string
  ctaImageUrl: string
  ctaImageAlt: string
  howItWorksSectionTitle: string
  testimonialsTitlePortable: SanityPortableText
  testimonials: HomeTestimonial[]
  pathsTitle?: string
  pathsCards?: HomePathsCard[]
  seo?: SeoContent
}

export type GlobalSettingsContent = {
  footerTagline: string
  supportEmail: string
  linkedinUrl: string
  instagramUrl: string
  copyrightLine: string
}

export type SiteSettingsContent = {
  siteName?: string
  logoUrl?: string
  defaultSeo?: SeoContent
}

export type AboutValue = {
  iconKey: string
  title: string
  description: string
}

export type AboutTeamMember = {
  name: string
  role?: string
  bio?: string
  imageSrc: string
  linkedinUrl?: string
  websiteUrl?: string
}

export type AboutPageContent = {
  heroLine1: string
  heroLine2Portable: SanityPortableText
  heroLine3: string
  heroIntro: string
  missionTitle: string
  missionParagraphs: string[]
  missionImageSrc: string
  missionImageAlt: string
  valuesTitle: string
  valuesSubtitle: string
  values: AboutValue[]
  teamTitle: string
  teamSubtitle: string
  team: AboutTeamMember[]
  ctaTitle: string
  ctaBody: string
  ctaFounderLabel: string
  ctaTeamLabel: string
  seo?: SeoContent
}

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export type FaqPageContent = {
  badge: string
  title: string
  subtitle: string
  items: FaqItem[]
  sidebarTitle: string
  sidebarBody: string
  sidebarCtaLabel: string
  sidebarCtaPath: string
  bottomTitle: string
  bottomBody: string
  bottomCtaLabel: string
  bottomCtaPath: string
  seo?: SeoContent
}

export type ProgramsEventCard = {
  title: string
  dateTime: string
  person: string
  imageSrc: string
  href?: string
  comingSoon?: boolean
  buttonText?: string
  /** Optional stable path segment for `/events/:slug`. Generated from title + date when omitted. */
  slug?: string
  /** Defaults to "Virtual" in the UI when empty. */
  location?: string
  /** Luma API-style id (`evt-…`) for the `/embed/event/evt-…/simple` iframe. */
  lumaEventId?: string
  /**
   * Body below the hero on `/events/:slug`. Prefer Sanity portable text (headings, lists, links,
   * **CTA box**, **Section divider**). Same article column width as story pages (`max-w-[900px]`).
   * Plain string still supported for fallbacks (`\\n\\n` = paragraphs).
   */
  detailBody?: string | SanityPortableText
  /** Optional label above the detail body column (e.g. “About this session”). */
  detailBodyHeading?: string
  /**
   * When `false`, the inline Luma iframe is omitted on the detail page body.
   * Omit or `true` = show iframe when **`lumaEventId`** is set.
   */
  embedLumaOnDetailPage?: boolean
  /**
   * When `true`, the hero CTA downloads a calendar file (**Add to Calendar**) instead of opening registration.
   * Toggle off to use the normal Register flow (`href` / Luma embed).
   */
  addToCalendarEnabled?: boolean
  /** ISO 8601 start instant — use with `addToCalendarEnabled` for accurate `.ics` / calendar apps. */
  calendarStartsAt?: string
  /** ISO 8601 end instant — optional; defaults to 90 minutes after `calendarStartsAt` when omitted. */
  calendarEndsAt?: string
}

export type ProgramsProgramCard = {
  title: string
  description: string
  imageSrc: string
  /** Route for program details (optional for waitlist/coming soon programs). */
  href?: string
  buttonText: string
  /** Optional: external waitlist form URL. If omitted, button can be shown disabled. */
  waitlistHref?: string
  /** Optional; can be derived from the program detail page pricing for known programs. */
  priceLabel?: string
  priceAmount?: string
  priceSuffix?: string
  /** Optional; if omitted, UI may show a default or derived deadline. */
  deadline?: string
}

export type ProgramsLandingContent = {
  heroTitlePortable: SanityPortableText
  heroSubtitle: string
  heroPrimaryCtaLabel: string
  heroSecondaryCtaLabel: string
  programsSectionTitle: SanityPortableText
  programsSectionSubtitle: string
  programs: ProgramsProgramCard[]
  upcomingEvents: ProgramsEventCard[]
  pastEvents: ProgramsEventCard[]
  ctaTitle: string
  ctaBody: string
  ctaButtonLabel: string
  ctaButtonHref: string
  seo?: SeoContent
}

export type ContactSubjectOption = {
  value: string
  label: string
}

export type ContactPageContent = {
  heroBadge: string
  pageTitle: string
  intro: string
  sideImageSrc: string
  sideImageAlt: string
  quoteText: string
  quoteAttributionName: string
  quoteAttributionRole: string
  successTitle: string
  successBody: string
  labels: {
    firstName: string
    lastName: string
    email: string
    phone: string
    companyName: string
    jobTitle: string
    companySize: string
    subject: string
    message: string
  }
  placeholders: {
    firstName: string
    lastName: string
    email: string
    phone: string
    companyName: string
    jobTitle: string
    message: string
  }
  subjectPlaceholder: string
  companySizePlaceholder: string
  subjectOptions: ContactSubjectOption[]
  companySizeOptions: ContactSubjectOption[]
  submitLabel: string
  sendingLabel: string
  seo?: SeoContent
}

export type QmsProgramContent = {
  paymentUrl: string
  heroTitle: string
  heroDescription: string
  heroCtaLabel: string
  outcomesTitle: string
  outcomesIntro: string
  outcomes: string[]
  howItWorksTitle: string
  howItWorksIntro: string
  pillarsTitle: string
  timelineTitle: string
  timelineSubtitle: string
  pricingBadge: string
  pricingAmount: string
  pricingSubAmount: string
  pricingDescription: string
  pricingBullets: string[]
  bottomCtaTitle: string
  bottomCtaBody: string
  bottomCtaButtonLabel: string
  bottomContactHref: string
  seo?: SeoContent
}

export type MarketingPageContent = {
  title: string
  subtitle: string
  body?: SanityPortableText | null
  seo?: SeoContent
}

export type NotFoundContent = {
  title: string
  message: string
  ctaLabel: string
  seo?: SeoContent
}

export type PaymentPageContent = {
  badge: string
  headline: string
  introCheckout: string
  introFallback: string
  introFallbackError: string
  benefitsTitle: string
  benefits: string[]
  successTitle: string
  successBody: string
  discountBannerEnabled: boolean
  discountBannerBadge: string
  discountBannerTitle: string
  discountBannerSubtitle: string
  discountBannerApplyLabel: string
  discountBannerApplyHref: string
  heroHeadlinePortable: SanityPortableText
  heroSubheadline: string
  imageCardBadge: string
  imageCardHeadlinePortable: SanityPortableText
  imageCardSrc: string
  imageCardAlt: string
  highlightBenefits: string[]
  pricingMonthlyBadge: string
  pricingAnnualBadge: string
  pricingMonthlyAmount: string
  pricingAnnualAmount: string
  pricingPerSuffix: string
  popularLabel: string
  monthlyProceedLabel: string
  annualProceedLabel: string
  questionsTitle: string
  questionsFaqLabel: string
  questionsFaqPath: string
  questionsContactLabel: string
  questionsContactPath: string
  seo?: SeoContent
}
