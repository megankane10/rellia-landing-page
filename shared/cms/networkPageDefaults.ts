import type {
  NetworkAdvisorsPageContent,
  NetworkEngageCard,
  NetworkFeatureItem,
  NetworkFoundersPageContent,
  NetworkInvestorsPageContent,
  NetworkPartnersPageContent,
} from "./types"
import { twoPartHeroHeadline } from "./inlineHeroHeadline"
import { resolveHeroTitlePortable } from "./resolveHeroHeadline"
import { pickCmsString } from "./cmsFieldUtils"

const pexelsCardImage = (photoId: string) =>
  `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1200`

export const DEFAULT_NETWORK_ENGAGE_FOUNDERS: NetworkEngageCard[] = [
  {
    title: "Apply for membership",
    body: "Single application—we route you to the right onboarding.",
    href: "/apply",
    linkLabel: "Continue",
    iconKey: "UserPlus",
  },
  {
    title: "Browse programs",
    body: "Structured tracks from QMS foundations to cohort programs.",
    href: "/programs",
    linkLabel: "Continue",
    iconKey: "BookOpen",
  },
  {
    title: "Virtual events",
    body: "Learn from operators and meet peers in health tech.",
    href: "/events",
    linkLabel: "Continue",
    iconKey: "Video",
  },
  {
    title: "Contact us",
    body: "We'll point you to the fastest next step.",
    href: "/contact",
    linkLabel: "Continue",
    iconKey: "Mail",
  },
]

export const DEFAULT_NETWORK_FOUNDERS_PAGE: NetworkFoundersPageContent = {
  title: "Founders",
  heroEyebrow: "Founders",
  heroTitlePortable: twoPartHeroHeadline("Are you building in", "health tech?"),
  heroTitle: "Are you building in",
  heroAccentPhrase: "health tech?",
  heroSubtitle:
    "You're building something that can change healthcare. We bring the experts, programs, and connections to help you get there.",
  heroImageSrc: "/images/founders.jpg",
  heroPrimaryCtaLabel: "Apply to join",
  heroPrimaryCtaHref: "/apply",
  heroSecondaryCtaLabel: "Explore Alumni",
  heroSecondaryCtaHref: "/founders/alumni",
  eligibilityTitle: "Built for serious health tech teams",
  eligibilityDescription:
    "Rellia works with companies where healthcare complexity is core to the product—evidence, regulation, workflow, and traction at once.",
  eligibilityItems: [
    {
      text: "Digital health & care delivery software",
      imageUrl:
        "https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      text: "Software as a medical device (SaMD) and connected devices",
      imageUrl: "/images/samd.jpg",
    },
    {
      text: "Diagnostics, lab, and decision-support platforms",
      imageUrl:
        "https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      text: "Medtech and DTx with a credible path to evidence and regulation",
      imageUrl:
        "https://images.pexels.com/photos/7089017/pexels-photo-7089017.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      text: "Founding teams from idea through Series A",
      imageUrl:
        "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      text: "AI and machine learning in clinical workflows",
      imageUrl:
        "https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      text: "Payer and value-based care infrastructure",
      imageUrl:
        "https://images.pexels.com/photos/7089012/pexels-photo-7089012.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      text: "Direct-to-consumer healthcare and wellness",
      imageUrl:
        "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
  ],
  engageTitle: "How to plug in this week",
  engageSubtitle: "Every path reconnects to the same high-trust network—pick what fits your sprint.",
  engageItems: DEFAULT_NETWORK_ENGAGE_FOUNDERS,
  whyTitle: "What makes Rellia membership different",
  whyDescription:
    "Operator-led support in a community where quality is defended by application review—not open signup churn.",
  whyFeatures: [
    {
      title: "Warm, qualified intros",
      body: "Introductions to investors, partners, and clinicians who understand your stage—not spray-and-pray blasts.",
      iconKey: "UserPlus",
      imageSrc: pexelsCardImage("5668858"),
    },
    {
      title: "Slack community with signal",
      body: "A vetted network where people answer with operator context because application review keeps quality high.",
      iconKey: "MessagesSquare",
      imageSrc: pexelsCardImage("3184296"),
    },
    {
      title: "Programs for healthcare reality",
      body: "Workshops and tracks built for regulatory, clinical, and commercial work—not generic startup content.",
      iconKey: "GraduationCap",
      imageSrc: pexelsCardImage("3845126"),
    },
    {
      title: "Equity-friendly access",
      body: "Depth from experienced advisors and operators without giving up ownership to join.",
      iconKey: "Percent",
      imageSrc: pexelsCardImage("3184465"),
    },
  ],
  journeyTitle: "Where Rellia meets your trajectory",
  showJourneySection: true,
  journeyHelpBadge: "We help with",
  journeyHelpHeading:
    "Programs, operators, and warm intros aligned to milestones that survive clinical, regulatory, and buyer scrutiny.",
  journeySteps: [
    {
      id: "idea",
      label: "Product idea",
      zone: "outside",
      iconKey: "Lightbulb",
      detail:
        "Exploring problems and narratives on your own or with peers—the groundwork before scoped execution. Not where Rellia substitutes for your discovery process.",
    },
    {
      id: "edu",
      label: "Industry education",
      zone: "outside",
      iconKey: "GraduationCap",
      detail:
        "Learning reimbursement, stakeholder maps, and regulatory vocabulary broadly available through courses and content—foundational, not a substitute for operator feedback.",
    },
    {
      id: "problem",
      label: "Problem statement",
      zone: "outside",
      iconKey: "MessagesSquare",
      detail:
        "Clarifying who benefits and what would count as success in a care or buyer workflow. Rellia does not write your strategy doc for you—but we help pressure-test it once you're building.",
    },
    {
      id: "mvp",
      label: "MVP development",
      zone: "rellia",
      iconKey: "Hammer",
      detail:
        "Ship a scope operators can review: safety basics, interoperability touchpoints, and a validation plan that won't be thrown away in the next phase.",
    },
    {
      id: "feedback",
      label: "User feedback",
      zone: "rellia",
      iconKey: "MessagesSquare",
      detail:
        "Structured feedback from clinicians, patients, and buyers so you learn what to fix before you scale sales or studies.",
    },
    {
      id: "funding",
      label: "Funding",
      zone: "rellia",
      iconKey: "Percent",
      detail:
        "A de-risked story: milestones, clinical or economic logic, and a use-of-funds plan that matches healthcare diligence.",
    },
    {
      id: "reg",
      label: "Regulatory",
      zone: "rellia",
      iconKey: "ShieldCheck",
      detail:
        "Map QMS, labeling, and risk early so evidence and software releases stay aligned to submission pathways.",
    },
    {
      id: "clinical",
      label: "Clinical evidence",
      zone: "rellia",
      iconKey: "Stethoscope",
      detail:
        "Pilots and studies that produce decision-grade signal: workflow fit, outcomes, and endpoints buyers actually care about.",
    },
    {
      id: "commercial",
      label: "Commercialization",
      zone: "rellia",
      iconKey: "Target",
      detail:
        "Repeatable revenue: pricing, procurement, channel partners, and delivery that holds up at scale.",
    },
    {
      id: "launch",
      label: "Launch & scale",
      zone: "rellia",
      iconKey: "Rocket",
      detail:
        "Grow into health systems and markets with the intros, playbooks, and peer network to sustain momentum after first revenue.",
    },
  ],
  exploreTitle: "Explore the network",
  exploreSubtitle:
    "Browse alumni and advisors—then apply when you want curated intros and the right programming for your stage.",
  exploreCards: [
    {
      title: "See our alumni portfolio",
      badge: "Alumni",
      imageUrl: "/images/founders-header.jpg",
      ctaLabel: "Explore Alumni",
      ctaHref: "/founders/alumni",
    },
    {
      title: "Find the operators you want",
      badge: "Advisors",
      imageUrl: "/images/paths-advisor-pexels.jpg",
      ctaLabel: "Explore Advisors",
      ctaHref: "/advisors/directory",
    },
  ],
  deeperHelpTitle: "Need deeper help?",
  deeperHelpSubtitle:
    "Scoped working sessions beyond community rhythm—clear deliverables for the milestone you're staring down.",
  deeperHelpFeatures: [
    {
      title: "Regulatory + evidence planning",
      body: "QMS foundations, pathway mapping, and study planning you can take to diligence and buyers.",
      iconKey: "CheckCircle2",
    },
    {
      title: "Narrative + diligence preparation",
      body: "Positioning, milestones, and materials built for healthcare scrutiny—not pitch-deck theater.",
      iconKey: "BookOpen",
    },
    {
      title: "Commercial + buyer workflow",
      body: "Procurement reality checks, pricing logic, and adoption constraints that show up in pilots.",
      iconKey: "Users",
    },
    {
      title: "Warm intros (when you're ready)",
      body: "Introductions matched to your roadmap so you talk to the right operators, partners, and investors.",
      iconKey: "UserPlus",
    },
  ],
  deeperHelpCtaLabel: "Explore consulting",
  deeperHelpCtaHref: "/consulting",
  ctaTitle: "Ready to join?",
  ctaBody: "Apply once—we'll follow up with fit, onboarding, and the fastest path into programs and intros.",
  ctaPrimaryLabel: "Apply to join",
  ctaPrimaryHref: "/apply",
  ctaSecondaryLabel: "View programs",
  ctaSecondaryHref: "/programs",
}

export const DEFAULT_NETWORK_ADVISORS_PAGE: NetworkAdvisorsPageContent = {
  title: "Advisors",
  heroEyebrow: "Advisors",
  heroTitlePortable: twoPartHeroHeadline("Some people are just wired to help", "others succeed."),
  heroTitle: "Some people are just wired to help",
  heroAccentPhrase: "others succeed.",
  heroSubtitle:
    "Mentor serious health tech founders through structured, respectful engagements—stay sharp on innovation while keeping flexibility for your career.",
  heroImageSrc: "/images/advisors.jpg",
  heroPrimaryCtaLabel: "Apply to join",
  heroPrimaryCtaHref: "/apply",
  heroSecondaryCtaLabel: "Explore Advisors",
  heroSecondaryCtaHref: "/advisors/directory",
  engageTitle: "Three ways to work with Rellia",
  engageSubtitle:
    "Community presence, formal advisory work, or program leadership—pick surfaces that fit your cadence.",
  engageItems: [
    {
      title: "Community & network",
      body: "Engage on your terms inside Slack and curated introductions—meet founders and fellow advisors without rigid mandates.",
      href: "/founders/alumni",
      linkLabel: "Explore Alumni Directory",
      iconKey: "Network",
    },
    {
      title: "Advisory board roles",
      body: "Serve as a formal advisor when there is mutual fit—typically lightweight charters scoped to milestone cadence.",
      href: "/advisors/directory",
      linkLabel: "Meet Our Advisors",
      iconKey: "Award",
    },
    {
      title: "Program advisor",
      body: "Shape cohort sessions and office hours inside Rellia programs—see our curriculum on the programs page.",
      href: "/programs",
      linkLabel: "Browse Programs",
      iconKey: "BookOpen",
    },
  ],
  scheduleTitle: "Built for busy schedules",
  scheduleItems: [
    {
      title: "1–3 hours, on your terms",
      body: "Advisory roles are designed for short, high-leverage blocks—adjustable as your capacity changes. Depth when you opt in, never a second job by default.",
      iconKey: "Clock",
    },
    {
      title: "Volunteer role",
      body: "Advisors serve on a volunteer basis, focused on impact and ecosystem development. We protect your boundaries while ensuring founders get high-signal feedback.",
      iconKey: "HeartHandshake",
    },
  ],
  benefitsTitle: "Mentorship that compounds",
  benefitsDescription:
    "Stay close to innovation without ambient noise—sharp conversations with founders who execute.",
  benefitsBullets: [
    "Stay up to date on the latest innovations happening in your industry",
    "Sharpen your own career skills",
    "Build your network",
    "Be highlighted as an expert in your field",
    "Help bring healthcare improvements to patients",
  ],
  whyTitle: "What we look for",
  whyDescription: "Effective advisors combine depth, specificity, and respect for founder momentum.",
  whyFeatures: [
    {
      title: "Senior judgment",
      body: "You have led, practiced, or scaled inside healthcare—not only consulted from the sidelines.",
      iconKey: "Scale",
      imageSrc: pexelsCardImage("3184311"),
    },
    {
      title: "Specific edge",
      body: "A narrow expertise beats a general resume—matching works best when your strengths are obvious.",
      iconKey: "Crosshair",
      imageSrc: pexelsCardImage("3184287"),
    },
    {
      title: "Boundaries with generosity",
      body: "You protect scope and safety while still leaving founders with a crisp next step.",
      iconKey: "ShieldCheck",
      imageSrc: pexelsCardImage("3184306"),
    },
    {
      title: "Momentum-aware advice",
      body: "Guidance is timed to milestones founders must hit—not theoretical debates detached from evidence plans.",
      iconKey: "Gauge",
      imageSrc: pexelsCardImage("3184317"),
    },
  ],
  ctaTitle: "Apply as an advisor",
  ctaBody: "Share your background—we'll follow up with fit, expectations, and onboarding paths.",
  ctaPrimaryLabel: "Apply to join",
  ctaPrimaryHref: "/apply",
  ctaSecondaryLabel: "Contact",
  ctaSecondaryHref: "/contact",
}

export const DEFAULT_NETWORK_INVESTORS_PAGE: NetworkInvestorsPageContent = {
  title: "Investors",
  heroEyebrow: "Investors",
  heroTitlePortable: twoPartHeroHeadline("Stop sorting through", "cold pitch decks."),
  heroTitle: "Stop sorting through",
  heroAccentPhrase: "cold pitch decks.",
  heroSubtitle:
    "Meet Rellia-backed teams with sharper milestones—clinical, regulatory, and commercial—before the usual diligence scramble.",
  heroImageSrc: "/images/investors.jpg",
  heroPrimaryCtaLabel: "Get notified",
  whyTitle: "Benefits of investing alongside Rellia",
  whyDescription:
    "We shorten the distance between credible narrative and reality checks from people who have scaled in healthcare.",
  whyFeatures: [
    {
      title: "Diligence-ready narratives",
      body: "Teams arrive with clearer milestones across clinical, regulatory, and commercial tracks—less scramble in your inbox.",
      iconKey: "ShieldCheck",
      imageSrc: pexelsCardImage("3184291"),
    },
    {
      title: "Operator-backed signal",
      body: "Founders are coached by advisors who have shipped in healthcare—not generic mentors recycling buzzwords.",
      iconKey: "Sparkles",
      imageSrc: pexelsCardImage("3182811"),
    },
    {
      title: "Curated intros",
      body: "Sessions are thesis-aware and hosted virtually—focused conversations instead of crowded demo days.",
      iconKey: "Users",
      imageSrc: pexelsCardImage("5668858"),
    },
    {
      title: "Pattern visibility",
      body: "See how companies cluster by stage, modality, and buyer so you can tune allocation faster.",
      iconKey: "BarChart3",
      imageSrc: pexelsCardImage("3183158"),
    },
  ],
  pitchTitle: "Exclusive connections and pitch events",
  pitchSubtitle:
    "Host a focused virtual session aligned to your mandate—or join a larger showcase to compare teams alongside fellow investors.",
  foundersClusterTitle: "How founders cluster",
  foundersClusterSubtitle:
    "Illustrative distributions based on active introductions—useful for thesis alignment.",
  foundersClusterDisclaimer: "Illustrative mix for thesis fit—not a fund mandate.",
  pitchCards: [
    {
      title: "Individual pitch session",
      body: "A virtual session scoped to your thesis—dig into workflow, reimbursement, or regulatory edge cases without competing noise.",
      imageUrl: "/images/whyrellia-founders.jpg",
    },
    {
      title: "Group pitch event",
      body: "Compare multiple teams in one session—see how founders cluster by stage, modality, and buyer before you follow up one-on-one.",
      imageUrl: "/images/whyrellia-network-2.jpg",
    },
  ],
  ctaTitle: "Get notified about investor sessions",
  ctaBody: "Share your thesis and we'll reach out when a session matches your mandate.",
  ctaPrimaryLabel: "Get notified",
}

export const DEFAULT_NETWORK_PARTNERS_PAGE: NetworkPartnersPageContent = {
  title: "Industry Partners",
  heroEyebrow: "Industry partners",
  heroTitlePortable: twoPartHeroHeadline("Reach the health tech founders", "who need you."),
  heroTitle: "Reach the health tech founders",
  heroAccentPhrase: "who need you.",
  heroSubtitle:
    "Pilot design, integration support, and enterprise credibility—so promising products don't die in procurement limbo.",
  heroImageSrc: "/images/industrypartners.jpg",
  heroPrimaryCtaLabel: "Apply to join",
  heroPrimaryCtaHref: "/apply",
  engageTitle: "Three ways to work with Rellia",
  engageSubtitle: "Large cards, clear intent—pick the path that matches how your team likes to start.",
  engageItems: [
    {
      title: "Partner directory",
      body: "Centralize your offers and verified references inside our exclusive marketplace for health tech execution.",
      href: "https://getproven.co/vendors/grid",
      linkLabel: "Explore Industry Partners",
      iconKey: "LayoutGrid",
    },
    {
      title: "Sponsor",
      body: "Put your brand behind programs and events where execution-quality teams spend their time.",
      href: "/contact",
      linkLabel: "Talk sponsorship",
      iconKey: "Megaphone",
    },
    {
      title: "Become a partner",
      body: "Co-design pilots, APIs, and enterprise handoffs with a community that treats adoption as the product.",
      href: "/contact",
      linkLabel: "Start a conversation",
      iconKey: "Handshake",
    },
  ],
  benefitsTitle: "Why partners stay",
  benefitsDescription: "What partners tell us they value most once programs are underway.",
  benefitsBullets: [
    "Pilot-ready founders with clearer scope and success metrics",
    "Structured introductions to technical and clinical leaders",
    "Shared language on security, compliance, and deployment",
    "Credibility inside a network built for health system reality",
    "Long-term relationships—not one-off vendor fairs",
  ],
  directoryTitle: "An exclusive directory for health tech execution",
  directoryDescription:
    "We maintain a curated directory of service providers and vendors with exclusive offers for Rellia members. Unlike generic marketplaces, our members trust these recommendations because they are grounded in peer usage and verified health tech experience.",
  directoryBullets: [
    "Independent vendor marketplace focused on health tech needs",
    "Exclusive deals with pre-negotiated terms for Rellia portcos",
    "Pre-vetted service providers with verified healthcare references",
    "Peer-to-peer insights on implementation and support quality",
  ],
  whyTitle: "Why industry leaders partner with Rellia",
  whyDescription:
    "We align commercial innovators, healthcare systems, and clinical networks around active pilots and structured technology adoption.",
  whyFeatures: [
    {
      title: "Vetted healthcare scale",
      body: "Skip cold emails and pre-screened meetings—connect directly with startups whose product, funding, and clinical roadmap are validated.",
      iconKey: "ShieldCheck",
      imageSrc: pexelsCardImage("3184319"),
    },
    {
      title: "Active pilot sequencing",
      body: "Work with founders who know exactly what success metrics and integration boundaries they need to hit in system deployments.",
      iconKey: "Target",
      imageSrc: pexelsCardImage("3184296"),
    },
    {
      title: "Secure compliance",
      body: "Ensure technical standards and compliance logic align with hospital requirements right from first touch.",
      iconKey: "ShieldCheck",
      imageSrc: pexelsCardImage("3184465"),
    },
    {
      title: "Direct GTM engagement",
      body: "Co-design channels, APIs, and commercial handoffs within a community structured around real healthcare adoption.",
      iconKey: "Megaphone",
      imageSrc: pexelsCardImage("3184311"),
    },
  ],
  ctaTitle: "Partner with Rellia",
  ctaBody:
    "Tell us about your organization, integration surface area, and the founder profiles you want to see more of. We'll route you to the right partner lead.",
  ctaPrimaryLabel: "Apply",
  ctaPrimaryHref: "/apply",
}

const pickList = <T>(cms: T[] | undefined, fallback: T[]): T[] =>
  Array.isArray(cms) && cms.length > 0 ? cms : fallback

export const mergeNetworkWhyFeatures = (
  cms: NetworkFeatureItem[] | null | undefined,
  defaults: NetworkFeatureItem[],
): NetworkFeatureItem[] =>
  defaults.map((defaultFeature, index) => {
    const cmsFeature = cms?.[index]
    if (!cmsFeature) return defaultFeature
    return {
      ...defaultFeature,
      ...cmsFeature,
      title: pickCmsString(cmsFeature.title, defaultFeature.title),
      body: pickCmsString(cmsFeature.body, defaultFeature.body),
      iconKey: pickCmsString(cmsFeature.iconKey, defaultFeature.iconKey),
      imageSrc: pickCmsString(cmsFeature.imageSrc, defaultFeature.imageSrc),
      buttonLabel: pickCmsString(cmsFeature.buttonLabel, defaultFeature.buttonLabel),
      buttonPath: pickCmsString(cmsFeature.buttonPath, defaultFeature.buttonPath),
    }
  })

export const mergeNetworkJourneySteps = (
  cms: NetworkFoundersPageContent["journeySteps"] | null | undefined,
  defaults: NonNullable<NetworkFoundersPageContent["journeySteps"]>,
): NonNullable<NetworkFoundersPageContent["journeySteps"]> => {
  if (!Array.isArray(cms) || cms.length === 0) return defaults
  return cms.map((cmsStep, index) => {
    const defaultStep = defaults[index] ?? defaults.find((step) => step.id === cmsStep.id)
    if (!defaultStep) return cmsStep
    return {
      ...defaultStep,
      ...cmsStep,
      id: pickCmsString(cmsStep.id, defaultStep.id),
      label: pickCmsString(cmsStep.label, defaultStep.label),
      zone: cmsStep.zone ?? defaultStep.zone,
      detail: pickCmsString(cmsStep.detail, defaultStep.detail),
      iconKey: pickCmsString(cmsStep.iconKey, defaultStep.iconKey),
    }
  })
}

const mergeNetworkHeroFields = <T extends NetworkFoundersPageContent>(
  cms: Partial<T> | null | undefined,
  defaults: T,
): T => ({
  ...defaults,
  ...cms,
  heroTitlePortable: resolveHeroTitlePortable(cms, defaults.heroTitlePortable!),
})

export const mergeNetworkFoundersPage = (
  cms?: Partial<NetworkFoundersPageContent> | null,
): NetworkFoundersPageContent => ({
  ...mergeNetworkHeroFields(cms, DEFAULT_NETWORK_FOUNDERS_PAGE),
  eligibilityItems: pickList(cms?.eligibilityItems, DEFAULT_NETWORK_FOUNDERS_PAGE.eligibilityItems ?? []),
  engageItems: pickList(cms?.engageItems, DEFAULT_NETWORK_FOUNDERS_PAGE.engageItems ?? []),
  whyFeatures: mergeNetworkWhyFeatures(
    cms?.whyFeatures,
    DEFAULT_NETWORK_FOUNDERS_PAGE.whyFeatures ?? [],
  ),
  journeySteps: mergeNetworkJourneySteps(
    cms?.journeySteps,
    DEFAULT_NETWORK_FOUNDERS_PAGE.journeySteps ?? [],
  ),
  exploreCards: pickList(cms?.exploreCards, DEFAULT_NETWORK_FOUNDERS_PAGE.exploreCards ?? []),
  deeperHelpFeatures: pickList(
    cms?.deeperHelpFeatures,
    DEFAULT_NETWORK_FOUNDERS_PAGE.deeperHelpFeatures ?? [],
  ),
  logoMarquee: pickList(cms?.logoMarquee, DEFAULT_NETWORK_FOUNDERS_PAGE.logoMarquee ?? []),
})

export const mergeNetworkAdvisorsPage = (
  cms?: Partial<NetworkAdvisorsPageContent> | null,
): NetworkAdvisorsPageContent => ({
  ...mergeNetworkHeroFields(cms, DEFAULT_NETWORK_ADVISORS_PAGE),
  engageItems: pickList(cms?.engageItems, DEFAULT_NETWORK_ADVISORS_PAGE.engageItems ?? []),
  scheduleItems: pickList(cms?.scheduleItems, DEFAULT_NETWORK_ADVISORS_PAGE.scheduleItems ?? []),
  benefitsBullets: pickList(cms?.benefitsBullets, DEFAULT_NETWORK_ADVISORS_PAGE.benefitsBullets ?? []),
  whyFeatures: mergeNetworkWhyFeatures(
    cms?.whyFeatures,
    DEFAULT_NETWORK_ADVISORS_PAGE.whyFeatures ?? [],
  ),
})

export const mergeNetworkInvestorsPage = (
  cms?: Partial<NetworkInvestorsPageContent> | null,
): NetworkInvestorsPageContent => ({
  ...mergeNetworkHeroFields(cms, DEFAULT_NETWORK_INVESTORS_PAGE),
  whyFeatures: mergeNetworkWhyFeatures(
    cms?.whyFeatures,
    DEFAULT_NETWORK_INVESTORS_PAGE.whyFeatures ?? [],
  ),
  pitchCards: pickList(cms?.pitchCards, DEFAULT_NETWORK_INVESTORS_PAGE.pitchCards ?? []),
  foundersClusterTitle: pickCmsString(
    cms?.foundersClusterTitle,
    DEFAULT_NETWORK_INVESTORS_PAGE.foundersClusterTitle ?? "",
  ),
  foundersClusterSubtitle: pickCmsString(
    cms?.foundersClusterSubtitle,
    DEFAULT_NETWORK_INVESTORS_PAGE.foundersClusterSubtitle ?? "",
  ),
  foundersClusterDisclaimer: pickCmsString(
    cms?.foundersClusterDisclaimer,
    DEFAULT_NETWORK_INVESTORS_PAGE.foundersClusterDisclaimer ?? "",
  ),
  foundersCluster: pickList(cms?.foundersCluster, DEFAULT_NETWORK_INVESTORS_PAGE.foundersCluster ?? []),
  logoMarquee: pickList(cms?.logoMarquee, DEFAULT_NETWORK_INVESTORS_PAGE.logoMarquee ?? []),
})

export const mergeNetworkPartnersPage = (
  cms?: Partial<NetworkPartnersPageContent> | null,
): NetworkPartnersPageContent => ({
  ...mergeNetworkHeroFields(cms, DEFAULT_NETWORK_PARTNERS_PAGE),
  engageItems: pickList(cms?.engageItems, DEFAULT_NETWORK_PARTNERS_PAGE.engageItems ?? []),
  benefitsBullets: pickList(cms?.benefitsBullets, DEFAULT_NETWORK_PARTNERS_PAGE.benefitsBullets ?? []),
  directoryBullets: pickList(cms?.directoryBullets, DEFAULT_NETWORK_PARTNERS_PAGE.directoryBullets ?? []),
  whyFeatures: mergeNetworkWhyFeatures(
    cms?.whyFeatures,
    DEFAULT_NETWORK_PARTNERS_PAGE.whyFeatures ?? [],
  ),
})
