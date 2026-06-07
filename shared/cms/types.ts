export type TrustedMemberTestimonial = {
  name: string
  role: string
  company: string
  image: string
  quote: string
}

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

export type CareersOpenRole = {
  id: string
  roleId?: string
  title: string
  location: string
  employmentType: string
  description: string
  responsibilities: string[]
  linkedInApplyUrl: string
}



export type CareersLifeAtRelliaLink = {
  platformName: string
  url: string
  iconKey: string
  tooltip: string
}

export type CareersLifeAtRelliaImage = {
  src?: string
  alt?: string
}

export type CareersContentMode = "both" | "hiring_only" | "volunteer_only"

export type CareersPageContent = {
  careersContentMode?: CareersContentMode
  /** Show HIRING pill next to Careers in nav/footer. Default off in Studio until you enable it. */
  showHiringNavBadge?: boolean
  /** Show VOLUNTEER pill next to Careers in nav/footer. Default off in Studio until you enable it. */
  showVolunteerNavBadge?: boolean
  openRoles?: CareersOpenRole[]
  seo?: SeoContent
  sections?: CmsPageSection[]
  lifeAtRelliaHeading?: string
  lifeAtRelliaSubheading?: string
  lifeAtRelliaImages?: CareersLifeAtRelliaImage[]
  lifeAtRelliaLinks?: CareersLifeAtRelliaLink[]
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

export type LegalPageContent = {
  title?: string
  intro?: string
  effectiveDate?: string
  legalNotice?: string
  body?: SanityPortableText
  seo?: SeoContent
}

export type PageVisibility = "live" | "hidden" | "placeholder"

export type CmsPageVisibility = {
  pageVisibility?: PageVisibility
  placeholderTitle?: string
  placeholderMessage?: string
  placeholderCtaLabel?: string
  placeholderCtaHref?: string
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
  showBadge?: boolean
  badge?: string
  headingTone?: "auto" | "light" | "dark"
  background?: "white" | "teal" | "cream"
  title?: string | SanityPortableText
  subtitle?: string | SanityPortableText
  items?: CmsSectionFeatureGridItem[]
}

export type CmsCtaButton = {
  label: string
  href: string
  variant?: "primary" | "secondary" | "text"
  openInNewTab?: boolean
}

export type CmsSectionTestimonials = {
  _type: "sectionTestimonials"
  _key?: string
  heading?: string
  testimonials?: TrustedMemberTestimonial[]
}

export type CmsSectionRelliaCta = {
  _type: "sectionRelliaCta"
  _key?: string
  title: string
  body?: string
  primaryCta: CmsCtaButton
  secondaryCta?: CmsCtaButton
  size?: "default" | "compact"
  primaryStyle?: "button" | "text"
  aboveSectionTone?: "none" | "white" | "grey"
}

export type CmsSectionEngageBandItem = {
  _key?: string
  title: string
  body?: string
  icon?: string
  href?: string
  link?: NavItem
}

export type CmsSectionEngageBand = {
  _type: "sectionEngageBand"
  _key?: string
  showBadge?: boolean
  badge?: string
  headingTone?: "auto" | "light" | "dark"
  title?: string | SanityPortableText
  subtitle?: string | SanityPortableText
  items?: CmsSectionEngageBandItem[]
}

export type CmsBuilderCtaAction = {
  label: string
  actionType?: "link" | "embed"
  href?: string
  filloutFormUrl?: string
}

export type CmsSectionJourneyTimelineStep = {
  _key?: string
  title: string
  description: string
}

export type CmsSectionJourneyTimelineRoleLink = {
  _key?: string
  title: string
  description: string
  href: string
}

export type CmsSectionJourneyTimeline = {
  _type: "sectionJourneyTimeline"
  _key?: string
  badge?: string
  headingTitle?: string
  subheading?: string
  steps?: CmsSectionJourneyTimelineStep[]
  showRoleLinks?: boolean
  roleLinks?: CmsSectionJourneyTimelineRoleLink[]
  cta?: CmsBuilderCtaAction
  /** @deprecated Legacy two-column layout */
  title?: string | SanityPortableText
  description?: string | SanityPortableText
  leftColumnTitle?: string
  leftColumnBody?: string
  leftColumnSteps?: Array<{ _key?: string; id: string; label: string; detail: string; icon?: string }>
  rightColumnTitle?: string
  rightColumnBody?: string
  rightColumnSteps?: Array<{ _key?: string; id: string; label: string; detail: string; icon?: string }>
  leftColumn?: {
    title?: string
    body?: string
    steps?: Array<{ _key?: string; id: string; label: string; detail: string; icon?: string }>
  }
  rightColumn?: {
    title?: string
    body?: string
    steps?: Array<{ _key?: string; id: string; label: string; detail: string; icon?: string }>
  }
}

export type CmsSectionDiagnosticSurvey = {
  _type: "sectionDiagnosticSurvey"
  _key?: string
  layout?: "categories" | "imageSplit"
  badge?: string
  title?: string | SanityPortableText
  subtitle?: string | SanityPortableText
  primaryCta?: NavItem
  secondaryCta?: NavItem
  /** @deprecated Use primaryCta / secondaryCta */
  cta?: CmsBuilderCtaAction
  /** @deprecated Use primaryCta */
  ctaLabel?: string
  /** @deprecated Use primaryCta */
  ctaHref?: string
  categoriesTitle?: string
  categories?: string[]
  categoryIcon?: string
  imageUrl?: string
  imageAlt?: string
}

export type CmsSectionFaqItem = {
  _key?: string
  question: string
  answer: string
}

export type CmsSectionFaq = {
  _type: "sectionFaq"
  _key?: string
  title?: string
  subtitle?: string
  items?: CmsSectionFaqItem[]
}

export type CmsSectionMarketingHero = {
  _type: "sectionMarketingHero"
  _key?: string
  eyebrowLabel?: string
  title: string
  accentPhrase?: string
  subtitle?: string
  imageUrl?: string
  imageAlt?: string
  primaryCta?: NavItem
  secondaryCta?: NavItem
}

export type CmsSectionMetricsItem = {
  _key?: string
  label: string
  value: number
  suffix?: string
}

export type CmsSectionMetrics = {
  _type: "sectionMetrics"
  _key?: string
  showBadge?: boolean
  badgeLabel?: string
  heading: string
  subheading?: string
  metrics?: CmsSectionMetricsItem[]
  imageUrl?: string
  imageAlt?: string
}

export type CmsSectionFormEmbed = {
  _type: "sectionFormEmbed"
  _key?: string
  layout?: "standalone" | "split"
  filloutFormUrl: string
  panelHeadline?: string
  panelBody?: string
  benefits?: string[]
  panelImageUrl?: string
  ctaLabel?: string
}

export type CmsPageSection =
  | CmsSectionMarketingHero
  | CmsSectionMetrics
  | CmsSectionFormEmbed
  | CmsSectionHero
  | CmsSectionRichText
  | CmsSectionCardsGrid
  | CmsSectionEligibilityBento
  | CmsSectionFeatureGrid
  | CmsSectionEngageBand
  | CmsSectionJourneyTimeline
  | CmsSectionDiagnosticSurvey
  | CmsSectionFaq
  | CmsSectionTestimonials
  | CmsSectionRelliaCta

export type CmsPageContent = {
  title: string
  slug: string
  seo?: SeoContent
  sections?: CmsPageSection[]
  pageBuilder?: CmsPageSection[]
}

export type ClusterChartSegment = {
  name: string
  value: number
}

export type ClusterChart = {
  title: string
  segments: ClusterChartSegment[]
}

export type CmsSingletonPageContent = {
  title: string
  logoMarquee?: Array<{ name: string; src: string; href?: string }>
  seo?: SeoContent
  sections?: CmsPageSection[]
  foundersCluster?: ClusterChart[]
}

export type ProgramsLayoutPageContent = CmsSingletonPageContent

export type ConsultingServiceCard = {
  title: string
  body: string
  ctaLabel?: string
  iconKey?: string
}

export type LandingStatRow = {
  label: string
  value: string
}

export type ConsultingPageContent = CmsSingletonPageContent & {
  heroEyebrow?: string
  heroTitle?: string
  heroAccentPhrase?: string
  heroSubtitle?: string
  heroImageSrc?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaHref?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaHref?: string
  fitTitle?: string
  fitDescription?: string
  fitBullets?: string[]
  fitImageSrc?: string
  servicesTitle?: string
  servicesSubtitle?: string
  services?: ConsultingServiceCard[]
  testimonialsTitle?: string
  testimonials?: TrustedMemberTestimonial[]
  membershipTitle?: string
  membershipDescription?: string
  membershipStats?: LandingStatRow[]
  membershipSavingsTitle?: string
  membershipSavingsBody?: string
  membershipPrimaryCtaLabel?: string
  membershipPrimaryCtaHref?: string
  membershipSecondaryCtaLabel?: string
  membershipSecondaryCtaHref?: string
  ctaTitle?: string
  ctaBody?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
}

export type DiagnosticReadinessFeature = {
  title: string
  description: string
  imageSrc?: string
}

export type DiagnosticLandingPageContent = CmsSingletonPageContent & {
  heroBadgeLabel?: string
  heroTitle?: string
  heroAccentPhrase?: string
  heroSubtitle?: string
  heroImageSrc?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaHref?: string
  readinessTitle?: string
  readinessDescription?: string
  readinessFeatures?: DiagnosticReadinessFeature[]
  infographicTitle?: string
  infographicBody?: string
  infographicTopWeaknessLabel?: string
  infographicTopWeaknessScore?: number
  infographicGapLabel?: string
  infographicAdvisorMatchLabel?: string
  infographicAdvisorRole?: string
  infographicAdvisorSubtitle?: string
  infographicBlobRoadmap?: string
  infographicBlobAdvisors?: string
  infographicBlobBlindSpot?: string
  timelineTitle?: string
  timelineSubheading?: string
  timelineSteps?: ApplyPageStep[]
  ctaTitle?: string
  ctaBody?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
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
  metrics: HomeMetric[]
  whyFeatures: HomeWhyFeature[]
  ctaTitle: string
  ctaButtonLabel: string
  ctaButtonPath: string
  ctaSecondaryButtonLabel?: string
  ctaSecondaryButtonPath?: string
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
  announcementEnabled?: boolean
  announcementText?: string
  announcementButtonLabel?: string
  announcementButtonLink?: string
  announcementPillText?: string
  priorityModalEnabled?: boolean
  priorityModalHeading?: string
  priorityModalBody?: string
  priorityModalPillText?: string
  priorityModalButtonLabel?: string
  priorityModalButtonLink?: string
  priorityModalSecondaryButtonLabel?: string
  priorityModalSecondaryButtonLink?: string
  priorityModalImageUrl?: string
  priorityModalImageAlt?: string
  priorityModalFormEnabled?: boolean
  priorityModalFormButtonLabel?: string
  priorityModalFormPlaceholderName?: string
  priorityModalFormPlaceholderEmail?: string
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
  heroHeadlinePortable: SanityPortableText
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
  /** ISO 8601 start instant — used for cards, sorting, and Add to Calendar. */
  startsAt?: string
  /** ISO 8601 end instant — optional; defaults to 90 minutes after `startsAt` when omitted. */
  endsAt?: string
  /** Rich description from Sanity `eventDescription` (portable text). */
  eventDescription?: SanityPortableText
  ticketingUrl?: string
  customLinkButton?: { buttonText?: string; url?: string }
  /** Manual label in Studio; listing/detail prefer `startsAt` / `endsAt` when set. */
  status?: "upcoming" | "past" | "hidden"
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
  heroHeadline: string
  /** @deprecated Use heroHeadline */
  pageTitle?: string
  intro: string
  sideImageSrc: string
  sideImageAlt: string
  leftLogoImageSrc?: string
  quoteText: string
  quotePersonImageSrc?: string
  quoteAttributionName: string
  quoteAttributionRole: string
  footerEmail?: string
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
  timelineSteps?: ApplyPageStep[]
  pricingBadge: string
  pricingAmount: string
  pricingDiscountEnabled?: boolean
  pricingCompareAmount?: string
  pricingSubAmount: string
  pricingDescription: string
  pricingBullets: string[]
  bottomCtaTitle: string
  bottomCtaBody: string
  bottomCtaButtonLabel: string
  bottomContactHref: string
  testimonials?: TrustedMemberTestimonial[]
  seo?: SeoContent
}

export type ApplyPageStep = {
  title: string
  description: string
}

export type ApplyPageRoleLink = {
  title: string
  description: string
  href: string
}

export type ApplyPageContent = {
  headingTitle: string
  subheading: string
  steps: ApplyPageStep[]
  showRoleLinks: boolean
  roleLinks?: ApplyPageRoleLink[]
  applyButtonLabel: string
  bottomCtaTitle: string
  bottomCtaBody: string
  bottomCtaPrimaryLabel: string
  bottomCtaPrimaryHref: string
  bottomCtaSecondaryLabel: string
  bottomCtaSecondaryHref: string
  seo?: SeoContent
}

export type DiagnosticSurveyCmsSection = {
  id: string
  icon?: string
  title?: string
  desc?: string
  questions?: {
    text?: string
    type?: string
    options?: { label?: string; desc?: string; score?: number }[]
  }[]
}

export type DiagnosticSurveyCmsJourneyStep = {
  title: string
  description: string
  icon?: string
}

export type DiagnosticSurveyContent = {
  introTitle?: string
  introSubtitle?: string
  stages?: string[]
  introJourneyTitle?: string
  introJourneySteps?: DiagnosticSurveyCmsJourneyStep[]
  introWhatYouGetTitle?: string
  introWhatYouGetBullets?: string[]
  introStartupDetailsTitle?: string
  introStartButtonLabel?: string
  submitTitle?: string
  submitSubtitle?: string
  submitProfileTitle?: string
  submitGeneratingTitle?: string
  submitGeneratingBody?: string
  submitGeneratingBullets?: string[]
  submitDetailsTitle?: string
  submitConfirmButtonLabel?: string
  processingTitle?: string
  processingSubtitle?: string
  processingSteps?: string[]
  reportHeaderThankYou?: string
  reportStrengthsTitle?: string
  reportGapsTitle?: string
  reportRoadmapTitle?: string
  reportFullBreakdownTitle?: string
  reportProgramsTitle?: string
  reportAdvisorsTitle?: string
  reportMembershipCtaTitle?: string
  reportMembershipCtaBody?: string
  reportMembershipCtaButton?: string
  reportMembershipCtaImageSrc?: string
  sections?: DiagnosticSurveyCmsSection[]
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

export type PaymentPageContent = CmsPageVisibility & {
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
  /** Legacy membership layout — not rendered on /membership */
  heroHeadlinePortable?: SanityPortableText
  heroSubheadline?: string
  imageCardBadge?: string
  imageCardHeadlinePortable?: SanityPortableText
  imageCardSrc?: string
  imageCardAlt?: string
  highlightBenefits?: string[]
  pricingMonthlyBadge: string
  pricingAnnualBadge: string
  pricingMonthlyAmount: string
  pricingAnnualAmount: string
  pricingMonthlyDiscountEnabled?: boolean
  pricingMonthlyCompareAmount?: string
  pricingAnnualDiscountEnabled?: boolean
  pricingAnnualCompareAmount?: string
  benefitsPanelHeadline?: string
  choosePlanHeadline?: string
  promoMessage?: string
  pricingPerSuffix: string
  popularLabel: string
  monthlyProceedLabel: string
  annualProceedLabel: string
  questionsTitle: string
  questionsBody?: string
  questionsFaqLabel: string
  questionsFaqPath: string
  questionsContactLabel: string
  questionsContactPath: string
  seo?: SeoContent
}
