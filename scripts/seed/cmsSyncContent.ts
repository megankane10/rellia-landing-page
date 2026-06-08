import { DEFAULT_APPLY_PAGE, DEFAULT_QMS_PROGRAM } from "../../shared/cms/defaults"
import type { ApplyPageContent } from "../../shared/cms/types"
import { QMS_PROGRAM_STATIC_BLOCKS } from "../../shared/cms/programs/qms.static"
import { GETPROVEN_VENDORS_GRID_URL } from "../../client/config/partnerLinks"

type PtBlockFn = (
  key: string,
  text: string,
  style?: "normal" | "h2" | "h3",
) => Array<{
  _type: "block"
  _key: string
  style?: string
  markDefs: unknown[]
  children: Array<{ _type: "span"; _key: string; text: string; marks: string[] }>
}>

type BulletFn = (key: string, text: string) => {
  _type: "block"
  _key: string
  style: "normal"
  listItem: "bullet"
  level: number
  markDefs: unknown[]
  children: Array<{ _type: "span"; _key: string; text: string; marks: string[] }>
}

type BlockFn = (
  key: string,
  text: string,
  style?: "normal" | "h2" | "h3" | "blockquote",
) => {
  _type: "block"
  _key: string
  style?: string
  markDefs: unknown[]
  children: Array<{ _type: "span"; _key: string; text: string; marks: string[] }>
}

export const FOUNDERS_ELIGIBILITY_BENTO_ITEMS = [
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
] as const

export const createRichTextShowcase = (
  prefix: string,
  ptBlock: PtBlockFn,
  bullet: BulletFn,
  block: BlockFn,
) => [
  ...ptBlock(`${prefix}-h2`, "Rich text showcase", "h2"),
  ...ptBlock(
    `${prefix}-intro`,
    "This seeded block demonstrates headings, body copy, quotes, carousels, CTA boxes, bullet lists, and embedded video — the same portable types used on stories, alumni profiles, and custom pages.",
    "normal",
  ),
  block(
    `${prefix}-quote`,
    "Healthcare founders need content blocks that survive clinical scrutiny—not generic blog formatting.",
    "blockquote",
  ),
  {
    _type: "portableImageCarousel",
    _key: `${prefix}-carousel`,
    title: "Image carousel",
    slides: [
      {
        _type: "portableImageCarouselSlide",
        _key: `${prefix}-carousel-0`,
        imageSrc:
          "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Collaborative health tech workspace",
        caption: "Carousel slide with optional caption",
      },
      {
        _type: "portableImageCarouselSlide",
        _key: `${prefix}-carousel-1`,
        imageSrc:
          "https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Founders reviewing product roadmap",
      },
    ],
  },
  {
    _type: "bodyCtaBox",
    _key: `${prefix}-cta`,
    title: "Try the startup diagnostic",
    body: "Benchmark readiness across regulatory, clinical, and commercial domains in about 15 minutes.",
    buttonLabel: "Start diagnostic",
    buttonHref: "/startup-diagnostic",
  },
  bullet(`${prefix}-b1`, "Bullet lists support milestone checklists and evidence plans."),
  bullet(`${prefix}-b2`, "Mix headings, media, and CTA boxes in one About section."),
  {
    _type: "portableVideo",
    _key: `${prefix}-video`,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    caption: "Video embed — YouTube, Vimeo, or direct .mp4 URL.",
  },
]

export const createPowerOfPlayProfileBody = (
  ptBlock: PtBlockFn,
  bullet: BulletFn,
  block: BlockFn,
) => [
  ...ptBlock("pop-h2", "About the company", "h2"),
  ...ptBlock(
    "pop-intro",
    "Power of Play transforms pediatric rehabilitation by replacing rigid, adult-calibrated medical diagnostics with child-centric tools. Standard clinical tools are often too intimidating or insensitive to capture accurate metrics for low muscle tone. Our evidence-based solution integrates diagnostic sensitivity directly into an interactive, dinosaur-shaped hand-strength measurement platform that captures objective maximum effort through play.",
    "normal",
  ),
  ...ptBlock("pop-traction-h2", "Traction & Roadmap", "h2"),
  bullet(
    "pop-t1",
    "Clinical Validation: Formally backed by 4-week usability pilots and over 200 user interviews with healthcare professionals.",
  ),
  bullet(
    "pop-t2",
    "Validation & Reliability: Proven 95% test-retest reliability for grip measurements and 92% reliability for pinch strength, significantly outperforming market alternatives.",
  ),
  bullet(
    "pop-t3",
    "Ecosystem Partnerships: Backed by research grants from Hamilton Health Sciences (DRIVE Spark Recipient), The Forge Business Incubator (1st Place Startup Survivor), and the Synapse Life Science Competition.",
  ),
  bullet(
    "pop-t4",
    "Manufacturing Expansion: Partnered with regional Manufacturing Institutes to transition proof-of-concept prototypes into scaled Minimum Viable Products (MVPs).",
  ),
  block(
    "pop-quote",
    "Play is the bridge between clinical rigor and the way children actually show up in rehab.",
    "blockquote",
  ),
]

export const createNetworkFoundersSections = (
  ptBlock: PtBlockFn,
  applyPage: ApplyPageContent = DEFAULT_APPLY_PAGE,
) => [
  {
    _type: "sectionMarketingHero",
    _key: "founders-hero",
    eyebrowLabel: "Founders",
    title: "Are you building in",
    accentPhrase: "health tech?",
    subtitle:
      "You're building something that can change healthcare. We bring the experts, programs, and connections to help you get there.",
    imageUrl: "/images/founders.jpg",
    primaryCta: { label: "Apply to join", href: "/apply" },
    secondaryCta: { label: "Explore Alumni", href: "/founders/alumni" },
  },
  {
    _type: "sectionEligibilityBento",
    _key: "founders-bento",
    title: "Built for serious health tech teams",
    description:
      "Rellia works with companies where healthcare complexity is core to the product—evidence, regulation, workflow, and traction at once.",
    items: FOUNDERS_ELIGIBILITY_BENTO_ITEMS.map((item, index) => ({
      _key: `founders-bento-${index}`,
      text: item.text,
      imageUrl: item.imageUrl,
    })),
  },
  {
    _type: "sectionEngageBand",
    _key: "founders-engage",
    headingTone: "light",
    title: ptBlock("founders-engage-title", "How to plug in this week"),
    subtitle: ptBlock(
      "founders-engage-sub",
      "Every path reconnects to the same high-trust network—pick what fits your sprint.",
      "normal",
    ),
    items: [
      {
        _key: "fe1",
        icon: "UserPlus",
        title: "Apply for membership",
        body: "Single application—we route you to the right onboarding.",
        link: { label: "Continue", href: "/apply" },
      },
      {
        _key: "fe2",
        icon: "BookOpen",
        title: "Browse programs",
        body: "Structured tracks from QMS foundations to cohort programs.",
        link: { label: "Continue", href: "/programs" },
      },
      {
        _key: "fe3",
        icon: "Video",
        title: "Virtual events",
        body: "Learn from operators and meet peers in health tech.",
        link: { label: "Continue", href: "/events" },
      },
      {
        _key: "fe4",
        icon: "Mail",
        title: "Contact us",
        body: "We'll point you to the fastest next step.",
        link: { label: "Continue", href: "/contact" },
      },
    ],
  },
  {
    _type: "sectionFeatureGrid",
    _key: "founders-membership",
    background: "white",
    title: ptBlock("founders-fg-title", "What makes Rellia membership different"),
    subtitle: ptBlock(
      "founders-fg-sub",
      "Operator-led support in a community where quality is defended by application review—not open signup churn.",
      "normal",
    ),
    items: [
      {
        _key: "fm1",
        icon: "UserPlus",
        title: "Warm, qualified intros",
        body: "Introductions to investors, partners, and clinicians who understand your stage—not spray-and-pray blasts.",
      },
      {
        _key: "fm2",
        icon: "MessagesSquare",
        title: "Slack community with signal",
        body: "A vetted network where people answer with operator context because application review keeps quality high.",
      },
      {
        _key: "fm3",
        icon: "GraduationCap",
        title: "Programs for healthcare reality",
        body: "Workshops and tracks built for regulatory, clinical, and commercial work—not generic startup content.",
      },
      {
        _key: "fm4",
        icon: "Percent",
        title: "Equity-friendly access",
        body: "Depth from experienced advisors and operators without giving up ownership to join.",
      },
    ],
  },
  {
    _type: "sectionJourneyTimeline",
    _key: "founders-timeline",
    badge: "Membership",
    headingTitle: "Application timeline",
    subheading: applyPage.subheading,
    steps: (applyPage.steps ?? []).map((step, index) => ({
      _key: `founders-step-${index}`,
      title: step.title,
      description: step.description,
    })),
    showRoleLinks: false,
    cta: { label: "Apply now", actionType: "link", href: "/apply" },
  },
  {
    _type: "sectionCardsGrid",
    _key: "founders-explore",
    title: "Explore the network",
    subtitle:
      "Browse alumni and advisors—then apply when you want curated intros and the right programming for your stage.",
    cards: [
      {
        _key: "founders-card-alumni",
        title: "See our alumni portfolio",
        badge: "Alumni",
        imageUrl: "/images/founders-header.jpg",
        cta: { label: "Explore Alumni", href: "/founders/alumni" },
      },
      {
        _key: "founders-card-advisors",
        title: "Find the operators you want",
        badge: "Advisors",
        imageUrl: "/images/paths-advisor-pexels.jpg",
        cta: { label: "Explore Advisors", href: "/advisors/directory" },
      },
    ],
  },
  {
    _type: "sectionFeatureGrid",
    _key: "founders-consulting",
    background: "teal",
    headingTone: "light",
    title: ptBlock("founders-consult-title", "Need deeper help?"),
    subtitle: ptBlock(
      "founders-consult-sub",
      "Scoped working sessions beyond community rhythm—clear deliverables for the milestone you're staring down.",
      "normal",
    ),
    items: [
      {
        _key: "fc1",
        icon: "CheckCircle2",
        title: "Regulatory + evidence planning",
        body: "QMS foundations, pathway mapping, and study planning you can take to diligence and buyers.",
      },
      {
        _key: "fc2",
        icon: "BookOpen",
        title: "Narrative + diligence preparation",
        body: "Positioning, milestones, and materials built for healthcare scrutiny—not pitch-deck theater.",
      },
      {
        _key: "fc3",
        icon: "Users",
        title: "Commercial + buyer workflow",
        body: "Procurement reality checks, pricing logic, and adoption constraints that show up in pilots.",
      },
      {
        _key: "fc4",
        icon: "UserPlus",
        title: "Warm intros (when you're ready)",
        body: "Introductions matched to your roadmap so you talk to the right operators, partners, and investors.",
      },
    ],
  },
  {
    _type: "sectionRelliaCta",
    _key: "founders-cta",
    title: "Ready to join?",
    body: "Apply once—we'll follow up with fit, onboarding, and the fastest path into programs and intros.",
    primaryCta: { label: "Apply to join", href: "/apply", variant: "primary" },
    secondaryCta: { label: "View programs", href: "/programs", variant: "secondary" },
    aboveSectionTone: "white",
  },
]

export const createNetworkAdvisorsSections = (ptBlock: PtBlockFn) => [
  {
    _type: "sectionMarketingHero",
    _key: "advisors-hero",
    eyebrowLabel: "Advisors",
    title: "Some people are just wired to help",
    accentPhrase: "others succeed.",
    subtitle:
      "Mentor serious health tech founders through structured, respectful engagements—stay sharp on innovation while keeping flexibility for your career.",
    imageUrl: "/images/advisors.jpg",
    primaryCta: { label: "Apply to join", href: "/apply" },
    secondaryCta: { label: "Explore Advisors", href: "/advisors/directory" },
  },
  {
    _type: "sectionEngageBand",
    _key: "advisors-engage",
    headingTone: "light",
    title: ptBlock("advisors-engage-title", "Three ways to work with Rellia"),
    subtitle: ptBlock(
      "advisors-engage-sub",
      "Community presence, formal advisory work, or program leadership—pick surfaces that fit your cadence.",
      "normal",
    ),
    items: [
      {
        _key: "ae1",
        icon: "Network",
        title: "Community & network",
        body: "Engage on your terms inside Slack and curated introductions—meet founders and fellow advisors without rigid mandates.",
        link: { label: "Explore Alumni Directory", href: "/founders/alumni" },
      },
      {
        _key: "ae2",
        icon: "Award",
        title: "Advisory board roles",
        body: "Serve as a formal advisor when there is mutual fit—typically lightweight charters scoped to milestone cadence.",
        link: { label: "Meet Our Advisors", href: "/advisors/directory" },
      },
      {
        _key: "ae3",
        icon: "BookOpen",
        title: "Program advisor",
        body: "Shape cohort sessions and office hours inside Rellia programs—see our curriculum on the programs page.",
        link: { label: "Browse Programs", href: "/programs" },
      },
    ],
  },
  {
    _type: "sectionFeatureGrid",
    _key: "advisors-schedule",
    background: "cream",
    title: ptBlock("advisors-schedule-title", "Built for busy schedules"),
    subtitle: ptBlock(
      "advisors-schedule-sub",
      "Advisory roles are designed for short, high-leverage blocks—adjustable as your capacity changes. Depth when you opt in, never a second job by default.",
      "normal",
    ),
    items: [
      {
        _key: "as1",
        icon: "Clock",
        title: "1–3 hours, on your terms",
        body: "Advisory roles are designed for short, high-leverage blocks—adjustable as your capacity changes.",
      },
      {
        _key: "as2",
        icon: "HeartHandshake",
        title: "Volunteer role",
        body: "Advisors serve on a volunteer basis, focused on impact and ecosystem development. We protect your boundaries while ensuring founders get high-signal feedback.",
      },
    ],
  },
  {
    _type: "sectionFeatureGrid",
    _key: "advisors-benefits",
    background: "white",
    title: ptBlock("advisors-benefits-title", "Mentorship that compounds"),
    subtitle: ptBlock(
      "advisors-benefits-sub",
      "Stay close to innovation without ambient noise—sharp conversations with founders who execute.",
      "normal",
    ),
    items: [
      {
        _key: "ab1",
        icon: "Sparkles",
        title: "Stay up to date on innovations",
        body: "Stay up to date on the latest innovations happening in your industry.",
      },
      {
        _key: "ab2",
        icon: "GraduationCap",
        title: "Sharpen career skills",
        body: "Sharpen your own career skills through founder-facing work.",
      },
      {
        _key: "ab3",
        icon: "Network",
        title: "Build your network",
        body: "Build your network across operators, clinicians, and repeat founders.",
      },
      {
        _key: "ab4",
        icon: "Award",
        title: "Be highlighted as an expert",
        body: "Be highlighted as an expert in your field inside a curated directory.",
      },
    ],
  },
  {
    _type: "sectionFeatureGrid",
    _key: "advisors-criteria",
    background: "white",
    title: ptBlock("advisors-criteria-title", "What we look for"),
    subtitle: ptBlock(
      "advisors-criteria-sub",
      "Effective advisors combine depth, specificity, and respect for founder momentum.",
      "normal",
    ),
    items: [
      {
        _key: "ac1",
        icon: "Scale",
        title: "Senior judgment",
        body: "You have led, practiced, or scaled inside healthcare—not only consulted from the sidelines.",
      },
      {
        _key: "ac2",
        icon: "Crosshair",
        title: "Specific edge",
        body: "A narrow expertise beats a general resume—matching works best when your strengths are obvious.",
      },
      {
        _key: "ac3",
        icon: "ShieldCheck",
        title: "Boundaries with generosity",
        body: "You protect scope and safety while still leaving founders with a crisp next step.",
      },
      {
        _key: "ac4",
        icon: "Gauge",
        title: "Momentum-aware advice",
        body: "Guidance is timed to milestones founders must hit—not theoretical debates detached from evidence plans.",
      },
    ],
  },
  {
    _type: "sectionRelliaCta",
    _key: "advisors-cta",
    title: "Apply as an advisor",
    body: "Share your background—we'll follow up with fit, expectations, and onboarding paths.",
    primaryCta: { label: "Apply to join", href: "/apply", variant: "primary" },
    secondaryCta: { label: "Contact", href: "/contact", variant: "secondary" },
    aboveSectionTone: "white",
  },
]

export const createNetworkInvestorsSections = (ptBlock: PtBlockFn) => [
  {
    _type: "sectionMarketingHero",
    _key: "investors-hero",
    eyebrowLabel: "Investors",
    title: "Stop sorting through",
    accentPhrase: "cold pitch decks.",
    subtitle:
      "Meet Rellia-backed teams with sharper milestones—clinical, regulatory, and commercial—before the usual diligence scramble.",
    imageUrl: "/images/investors.jpg",
    primaryCta: { label: "Get notified", href: "/contact" },
  },
  {
    _type: "sectionFeatureGrid",
    _key: "investors-benefits",
    background: "cream",
    title: ptBlock("investors-fg-title", "Benefits of investing alongside Rellia"),
    subtitle: ptBlock(
      "investors-fg-sub",
      "We shorten the distance between credible narrative and reality checks from people who have scaled in healthcare.",
      "normal",
    ),
    items: [
      {
        _key: "ib1",
        icon: "ShieldCheck",
        title: "Diligence-ready narratives",
        body: "Teams arrive with clearer milestones across clinical, regulatory, and commercial tracks—less scramble in your inbox.",
      },
      {
        _key: "ib2",
        icon: "Sparkles",
        title: "Operator-backed signal",
        body: "Founders are coached by advisors who have shipped in healthcare—not generic mentors recycling buzzwords.",
      },
      {
        _key: "ib3",
        icon: "Users",
        title: "Curated intros",
        body: "Sessions are thesis-aware and hosted virtually—focused conversations instead of crowded demo days.",
      },
      {
        _key: "ib4",
        icon: "BarChart3",
        title: "Pattern visibility",
        body: "See how companies cluster by stage, modality, and buyer so you can tune allocation faster.",
      },
    ],
  },
  {
    _type: "sectionCardsGrid",
    _key: "investors-pitch",
    title: "Exclusive connections and pitch events",
    subtitle:
      "Host a focused virtual session aligned to your mandate—or join a larger showcase to compare teams alongside fellow investors.",
    cards: [
      {
        _key: "ip1",
        title: "Individual pitch session",
        body: "A virtual session scoped to your thesis—dig into workflow, reimbursement, or regulatory edge cases without competing noise.",
        imageUrl: "/images/whyrellia-founders.jpg",
      },
      {
        _key: "ip2",
        title: "Group pitch event",
        body: "See multiple teams with standardized milestones—ideal for pattern recognition and efficient filtering before deeper diligence.",
        imageUrl: "/images/whyrellia-network-2.jpg",
      },
    ],
  },
  {
    _type: "sectionFeatureGrid",
    _key: "investors-portfolio",
    background: "white",
    title: ptBlock("investors-portfolio-title", "Offer Rellia to your portfolio"),
    subtitle: ptBlock(
      "investors-portfolio-sub",
      "Plug your teams into operators, advisors, and partner pathways that shorten cycles from pilot to procurement.",
      "normal",
    ),
    items: [
      {
        _key: "ipo1",
        icon: "Target",
        title: "Pilot pathways",
        body: "Teams get structured support to define scope, metrics, and technical requirements for system pilots.",
      },
      {
        _key: "ipo2",
        icon: "Wrench",
        title: "Integration support",
        body: "Connect founders with technical leaders who understand the reality of deployments.",
      },
      {
        _key: "ipo3",
        icon: "ShieldCheck",
        title: "Regulatory edge",
        body: "Access advisors who have successfully navigated FDA submissions and modality shifts.",
      },
      {
        _key: "ipo4",
        icon: "Network",
        title: "Ecosystem access",
        body: "Shorten the distance to procurement by aligning with shared clinical standards.",
      },
    ],
  },
  {
    _type: "sectionRelliaCta",
    _key: "investors-cta",
    title: "Partner concierge",
    body: "Share a portfolio company and the milestone you want to unlock—we'll suggest the lightest-weight Rellia touchpoints to match.",
    primaryCta: { label: "Explore the Alumni Directory", href: "/founders/alumni", variant: "primary" },
    aboveSectionTone: "grey",
  },
]

export const createNetworkPartnersSections = (ptBlock: PtBlockFn) => [
  {
    _type: "sectionMarketingHero",
    _key: "partners-hero",
    eyebrowLabel: "Industry Partners",
    title: "Reach the health tech founders",
    accentPhrase: "who need you.",
    subtitle:
      "Pilot design, integration support, and enterprise credibility—so promising products don't die in procurement limbo.",
    imageUrl: "/images/industrypartners.jpg",
    primaryCta: { label: "Apply to join", href: "/apply" },
  },
  {
    _type: "sectionEngageBand",
    _key: "partners-engage",
    headingTone: "light",
    title: ptBlock("partners-engage-title", "Three ways to work with Rellia"),
    subtitle: ptBlock(
      "partners-engage-sub",
      "Large cards, clear intent—pick the path that matches how your team likes to start.",
      "normal",
    ),
    items: [
      {
        _key: "pe1",
        icon: "LayoutGrid",
        title: "Partner directory",
        body: "Centralize your offers and verified references inside our exclusive marketplace for health tech execution.",
        link: { label: "Explore Industry Partners", href: GETPROVEN_VENDORS_GRID_URL },
      },
      {
        _key: "pe2",
        icon: "Megaphone",
        title: "Sponsor",
        body: "Put your brand behind programs and events where execution-quality teams spend their time.",
        link: { label: "Talk sponsorship", href: "/contact" },
      },
      {
        _key: "pe3",
        icon: "Handshake",
        title: "Become a partner",
        body: "Co-design pilots, APIs, and enterprise handoffs with a community that treats adoption as the product.",
        link: { label: "Start a conversation", href: "/contact" },
      },
    ],
  },
  {
    _type: "sectionFeatureGrid",
    _key: "partners-benefits",
    background: "cream",
    title: ptBlock("partners-benefits-title", "Why partners stay"),
    subtitle: ptBlock(
      "partners-benefits-sub",
      "What partners tell us they value most once programs are underway.",
      "normal",
    ),
    items: [
      {
        _key: "pb1",
        icon: "Target",
        title: "Pilot-ready founders",
        body: "Pilot-ready founders with clearer scope and success metrics.",
      },
      {
        _key: "pb2",
        icon: "Users",
        title: "Structured introductions",
        body: "Structured introductions to technical and clinical leaders.",
      },
      {
        _key: "pb3",
        icon: "ShieldCheck",
        title: "Shared compliance language",
        body: "Shared language on security, compliance, and deployment.",
      },
      {
        _key: "pb4",
        icon: "Award",
        title: "Network credibility",
        body: "Credibility inside a network built for health system reality.",
      },
      {
        _key: "pb5",
        icon: "HeartHandshake",
        title: "Long-term relationships",
        body: "Long-term relationships—not one-off vendor fairs.",
      },
    ],
  },
  {
    _type: "sectionCardsGrid",
    _key: "partners-directory",
    title: "An exclusive directory for health tech execution",
    subtitle:
      "We maintain a curated directory of service providers and vendors with exclusive offers for Rellia members.",
    cards: [
      {
        _key: "pd1",
        title: "Vendor marketplace",
        body: "Independent vendor marketplace focused on health tech needs with peer-verified references.",
        imageUrl: "/images/partnersdirectory.png",
        cta: { label: "Explore directory", href: GETPROVEN_VENDORS_GRID_URL },
      },
    ],
  },
  {
    _type: "sectionFeatureGrid",
    _key: "partners-why",
    background: "cream",
    title: ptBlock("partners-why-title", "Why industry leaders partner with Rellia"),
    subtitle: ptBlock(
      "partners-why-sub",
      "We align commercial innovators, healthcare systems, and clinical networks around active pilots and structured technology adoption.",
      "normal",
    ),
    items: [
      {
        _key: "pw1",
        icon: "ShieldCheck",
        title: "Vetted healthcare scale",
        body: "Skip cold emails and pre-screened meetings—connect directly with startups whose product, funding, and clinical roadmap are validated.",
      },
      {
        _key: "pw2",
        icon: "Rocket",
        title: "Active pilot sequencing",
        body: "Work with founders who know exactly what success metrics and integration boundaries they need to hit in system deployments.",
      },
      {
        _key: "pw3",
        icon: "Lock",
        title: "Secure compliance",
        body: "Ensure technical standards and compliance logic align with hospital requirements right from first touch.",
      },
      {
        _key: "pw4",
        icon: "Handshake",
        title: "Direct GTM engagement",
        body: "Co-design channels, APIs, and commercial handoffs within a community structured around real healthcare adoption.",
      },
    ],
  },
  {
    _type: "sectionRelliaCta",
    _key: "partners-cta",
    title: "Partner with Rellia",
    body: "Tell us about your organization, integration surface area, and the founder profiles you want to see more of. We'll route you to the right partner lead.",
    primaryCta: { label: "Apply", href: "/apply", variant: "primary" },
    aboveSectionTone: "grey",
  },
]

export const createCareersSections = (ptBlock: PtBlockFn) => [
  {
    _type: "sectionMarketingHero",
    _key: "careers-hero",
    eyebrowLabel: "Careers",
    title: "Build the",
    accentPhrase: "future of health",
    subtitle:
      "We connect founders, clinicians, and capital so the right ideas reach patients. If you thrive in fast-moving, mission-driven environments, we would love to meet you.",
    imageUrl: "/images/careers-img.jpg",
    primaryCta: { label: "See open roles", href: "#open-roles" },
    secondaryCta: { label: "Volunteer with us", href: "#careers-volunteer" },
  },
  {
    _type: "sectionFeatureGrid",
    _key: "careers-why",
    background: "white",
    title: ptBlock("careers-why-title", "Building What Matters Most"),
    subtitle: ptBlock(
      "careers-why-sub",
      "What it feels like to build here: pace without panic, depth without gatekeeping, and a team that sweats the small stuff so members do not have to.",
      "normal",
    ),
    items: [
      {
        _key: "cw1",
        icon: "Users",
        title: "Mission you can feel",
        body: "Every week you will see founders ship, learn, and reset with support from people who have been in the room when healthcare products actually get adopted.",
      },
      {
        _key: "cw2",
        icon: "Target",
        title: "Craft, not chaos",
        body: "We run tight programs with clear owners, thoughtful rituals, and space to improve how we work.",
      },
      {
        _key: "cw3",
        icon: "BookOpen",
        title: "Learn beside experts",
        body: "You will sit alongside clinicians, operators, and investors who care about getting the details right.",
      },
      {
        _key: "cw4",
        icon: "UserRound",
        title: "Humans first",
        body: "Kindness is not a slogan here. We expect high standards and direct feedback, and we build trust by showing up for each other.",
      },
    ],
  },
  {
    _type: "sectionFeatureGrid",
    _key: "careers-perks",
    background: "white",
    title: ptBlock("careers-perks-title", "How we work"),
    subtitle: ptBlock(
      "careers-perks-sub",
      "A lean health-tech team: industry proximity, intentional office time, and the pace of a startup—not a corporate perks sheet.",
      "normal",
    ),
    items: [
      {
        _key: "cp1",
        icon: "Users",
        title: "In the room with the industry",
        body: "Clinicians, founders, and operators show up in our programs—you hear what actually moves care and procurement.",
      },
      {
        _key: "cp2",
        icon: "Building2",
        title: "Office when it helps",
        body: "Remote-first with intentional in-person weeks: cohort sessions, workshops, and shared space when you want to work beside the team.",
      },
      {
        _key: "cp3",
        icon: "Laptop",
        title: "Small team, real ownership",
        body: "Startup reality: clear priorities, direct feedback, and permission to fix how we work.",
      },
      {
        _key: "cp4",
        icon: "MapPin",
        title: "Out with the community",
        body: "Member events, partner conversations, and field context on how buying decisions get made.",
      },
    ],
  },
  {
    _type: "sectionFormEmbed",
    _key: "careers-volunteer",
    layout: "split",
    filloutFormUrl: "https://forms.fillout.com/t/r5hdDmQodfus",
    panelHeadline: "Volunteer with us",
    panelBody:
      "Share your expertise with health tech founders—flexible commitment, meaningful impact. This seeded form block mirrors the Careers volunteer flow.",
    panelImageUrl:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ctaLabel: "Open volunteer application",
    benefits: [
      "Flexible advisory cadence",
      "Curated founder introductions",
      "Operator-led community context",
    ],
  },
  {
    _type: "sectionRelliaCta",
    _key: "careers-cta",
    title: "Questions before you apply?",
    body: "Tell us what you are looking for—we are happy to point you to the right conversation.",
    primaryCta: { label: "Contact Rellia", href: "/contact", variant: "primary" },
    aboveSectionTone: "white",
  },
]

export const DUMMY_OPEN_ROLE = {
  id: "dummy-placeholder-role",
  title: "[DUMMY] Placeholder Role — Not a Real Opening",
  location: "Remote (example location only)",
  employmentType: "Part-time (sample)",
  description:
    "This is dummy seed text for editors and engineering to verify the open roles accordion. Replace this document with a real role before promoting careers content to production.",
  responsibilities: [
    "[DUMMY] Example responsibility — delete before publishing",
    "[DUMMY] Second placeholder bullet for layout testing",
    "[DUMMY] Third bullet to confirm list rendering",
  ],
  linkedInApplyUrl: "https://www.linkedin.com/company/relliahealth/jobs/",
}

export const DUMMY_ADVISOR = {
  id: "dummy-showcase-advisor",
  name: "Dr. Placeholder Example",
  organization: "Example Health Systems (DUMMY)",
  role: "Dummy Advisor Profile — Not Real",
  location: "Toronto, ON",
  country: ["Canada"],
  yearJoined: "2026",
  industries: ["Digital health", "Clinical ops"],
  snapshot:
    "Seeded dummy advisor for testing directory filters, snapshot copy, and portable rich text blocks.",
  photoSrc: "/images/nopicture-male.jpg",
  mentoringStyle:
    "Async document review with crisp next steps—this is placeholder copy for Studio previews only.",
  highlights: [
    "[DUMMY] Highlight one for rich profile testing",
    "[DUMMY] Highlight two for list rendering",
  ],
  specialtyFilter: "Clinical Evidence",
  socialLinks: [
    {
      _type: "socialLink",
      _key: "linkedin",
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/example-placeholder",
    },
    {
      _type: "socialLink",
      _key: "website",
      platform: "website",
      label: "Website",
      url: "https://example.com",
    },
  ],
}

export const POWER_OF_PLAY_ALUMNI = {
  id: "power-of-play",
  slug: "power-of-play",
  name: "Power of Play",
  logoSrc: "/images/portfolio-pop.png",
  tagline: "Taking a Play-Based Approach To Pediatric Rehabilitation",
  shortDescription: "Taking a Play-Based Approach To Pediatric Rehabilitation",
  specialties: ["Pediatrics"],
  businessModel: ["B2B", "B2B2C", "Hardware"],
  country: ["Canada"],
  yearJoined: 2024,
  websiteUrl: "https://powerofplayinc.com",
  linkedinUrl: "https://www.linkedin.com/company/power-of-play-pop/",
  email: "info@powerofplayinc.com",
  founders: [
    {
      name: "Deena Al-Sammak",
      role: "Co-founder, Health Sciences Graduate",
      bio: "Co-founder focused on clinical validation and program development for pediatric rehab tooling.",
      imageSrc: "/images/deenasammak-team.png",
      socialLinks: [
        {
          _type: "socialLink",
          _key: "deena-linkedin",
          platform: "linkedin",
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/deena-al-sammak/",
        },
      ],
    },
    {
      name: "Rooaa Shanshal",
      role: "Co-founder, Software & Biomedical Engineer",
      bio: "Co-founder leading product engineering for play-based strength measurement.",
      imageSrc: "/images/testimonials-rooaaS.jpeg",
      socialLinks: [
        {
          _type: "socialLink",
          _key: "rooaa-linkedin",
          platform: "linkedin",
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/rooaashanshal/",
        },
      ],
    },
  ],
}

export const WEBSITE_LAUNCH_STORY = {
  slug: "website-launch",
  title: "Welcome to the new Rellia website",
  tag: "Program Update",
  featured: true,
  excerpt:
    "Explore clearer paths for founders—benchmark readiness, join programs, meet advisors, and stay close to what is happening across the Rellia community.",
  coverImageSrc:
    "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600",
  coverImageAlt: "Health tech team collaborating in a bright workspace",
  seoTitle: "Welcome to the new Rellia website",
  seoDescription:
    "Discover Rellia Health: startup diagnostic, structured programs, live events, and network paths built for health tech founders.",
  publishedAt: "2026-06-01",
}

export const createWebsiteLaunchStoryBody = (
  ptBlock: PtBlockFn,
  bullet: BulletFn,
  block: BlockFn,
) => [
  ...ptBlock("launch-h2", "Built for health tech builders", "h2"),
  ...ptBlock(
    "launch-intro",
    "Whether you are validating your first clinical workflow, preparing for a seed round, or looking for operators who have shipped in regulated environments, Rellia is designed to meet you where you are. Our site brings the essentials into one place—so you can move from curiosity to action without hunting across tabs.",
    "normal",
  ),
  ...ptBlock(
    "launch-intro-2",
    "Start with a quick readiness check, explore programs that match your stage, and see how founders, advisors, and partners plug into the same ecosystem. Everything here is meant to feel practical: fewer buzzwords, more signal about what happens next when you engage with Rellia.",
    "normal",
  ),
  block(
    "launch-quote",
    "The best health tech teams do not need more generic advice—they need clarity on regulatory, clinical, and commercial gaps before capital and pilots accelerate the wrong priorities.",
    "blockquote",
  ),
  ...ptBlock("launch-dx-h2", "Startup diagnostic", "h2"),
  ...ptBlock(
    "launch-dx-p",
    "Our Startup Diagnostic benchmarks your company across twelve domains that matter in health tech—from regulatory posture and clinical evidence to go-to-market motion and team readiness. In about fifteen minutes you receive a personalized report with strengths, priority gaps, and suggested next steps.",
    "normal",
  ),
  ...ptBlock(
    "launch-dx-p2",
    "Founders use the diagnostic to align co-founders before a fundraise, sharpen advisor conversations, and decide which Rellia programs fit their current stage. It is private, structured, and built for teams who want an honest baseline—not a vanity score.",
    "normal",
  ),
  {
    _type: "bodyCtaBox",
    _key: "launch-dx-cta",
    title: "See where you stand",
    body: "Take the Startup Diagnostic and get a readiness snapshot with gap analysis you can share with your team.",
    buttonLabel: "Start the diagnostic",
    buttonHref: "/startup-diagnostic",
  },
  ...ptBlock("launch-programs-h2", "Programs & events", "h2"),
  ...ptBlock(
    "launch-programs-p",
    "Rellia programs combine operator-led curriculum, peer accountability, and access to advisors who have navigated FDA pathways, health system pilots, and reimbursement realities. Cohorts are stage-aware—whether you are building QMS foundations, refining your clinical story, or preparing for investor conversations.",
    "normal",
  ),
  bullet("launch-p1", "Structured tracks with clear outcomes, office hours, and milestone reviews."),
  bullet("launch-p2", "Live virtual events with clinicians, operators, and health tech leaders—designed for practical takeaways, not keynote theater."),
  bullet("launch-p3", "Registration and waitlists for upcoming cohorts, so you can plan around your roadmap."),
  block(
    "launch-quote-2",
    "Programs work best when founders know their gaps first—then every session, office hour, and intro compounds instead of feeling like another calendar block.",
    "blockquote",
  ),
  ...ptBlock(
    "launch-network-p",
    "Beyond programs, Rellia connects founders with advisors, alumni, and industry partners through dedicated network paths. Explore stories from the community, see who is building in your specialty, and find the right door in—whether you are applying as a founder, advisor, investor, or partner.",
    "normal",
  ),
  {
    _type: "bodyCtaBox",
    _key: "launch-programs-cta",
    title: "Find your next step",
    body: "Browse structured programs or see upcoming live sessions with the Rellia community.",
    buttonLabel: "View programs",
    buttonHref: "/programs",
    secondaryButtonLabel: "See events",
    secondaryButtonHref: "/events",
  },
]

export const STUDIO_GUIDE_SECTIONS = [
  {
    _type: "guideSection",
    _key: "seo",
    heading: "SEO in Studio",
    body:
      "Each page has an SEO tab with a live Google preview (free). Ignore SEO Health Dashboard — it requires a paid license. Use the per-page SEO fields instead. Site-wide defaults live under Site → Site settings → Default SEO.",
  },
  {
    _type: "guideSection",
    _key: "publish",
    heading: "Drafts vs published vs the live site",
    body:
      "Studio “Published” means saved to the dataset. Custom builder pages also have Page visibility (Live / Hidden / Placeholder). Preview Vercel deploys use the preview dataset; www uses production after pnpm sanity:promote.",
  },
  {
    _type: "guideSection",
    _key: "presentation",
    heading: "Visual editing (Presentation)",
    body:
      "On Vercel Preview (not www): set SANITY_API_READ_TOKEN, SANITY_STUDIO_URL=https://relliahealth.sanity.studio, and SANITY_STUDIO_PREVIEW_URL to your exact preview URL (no trailing slash). Open Presentation, wait for the iframe to load, then click content to edit.",
  },
  {
    _type: "guideSection",
    _key: "prebuilt_pages",
    heading: "Pre-built pages vs custom pages",
    body:
      "Most site routes (About, Careers, Network paths, Consulting, Startup diagnostic, Programs, etc.) use fixed layouts in code. Edit their copy and media through the structured fields on each page document — not modular page sections.\n\nModular page builder blocks are only for custom pages under Pages → + Create page. Those documents use Page sections and Page visibility (Live / Hidden / Placeholder).",
  },
  {
    _type: "guideSection",
    _key: "custom_builder_fields",
    heading: "Custom page builder — block field names (custom pages only)",
    body:
      "Page sections use these block types and key fields:\n\n• Marketing hero block — eyebrowLabel, title, accentPhrase, subtitle, imageUrl, primaryCta, secondaryCta\n• Engage band block — title/subtitle (portable text), items[] with icon, title, body, link\n• Text and icon grid — title/subtitle (portable text), items[] with icon (Lucide name), title, body; optional badge, headingTone, background\n• Eligibility bento block — title, description, items[] with text + imageUrl\n• Journey timeline block — headingTitle, subheading, steps[], optional roleLinks[], cta\n• Image grid block — title, subtitle, cards[] with title, body, imageUrl, badge, iconKey, cta, tags\n• CTA band block — title, body, primaryCta, secondaryCta, aboveSectionTone\n• Testimonial carousel block — heading, testimonials[] (quote, name, role, company, imageSrc)\n• FAQ block — title, subtitle, items[] question/answer\n• Form embed block — filloutFormUrl, layout (split/standalone), panel copy + benefits\n• Rich text (in stories/profiles) — headings, bullets, blockquote, bodyCtaBox, portableImageCarousel, portableVideo",
  },
  {
    _type: "guideSection",
    _key: "quick_links",
    heading: "Quick links",
    body:
      "Documentation — https://docs.google.com/document/d/17lMkt2Jqa4fswCd_DpjHpvwMQH-5QBMDvzcw5MGLDVo/edit?usp=sharing\nSanity Studio — https://relliahealth.sanity.studio\nSupabase — https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy\nVercel — https://vercel.com/relliahealth\nGitHub — https://github.com/Agrolax/rellia-landing-page\nWebsite — https://relliahealth.com",
  },
  {
    _type: "guideSection",
    _key: "create_pages",
    heading: "Creating a new custom page",
    body:
      "Under Pages, click + to create a page document. Set the page title and URL slug (e.g. partner-program). Reserved slugs like about, careers, and contact are blocked to protect static routes.",
  },
  {
    _type: "guideSection",
    _key: "program_pricing",
    heading: "Program pricing sections",
    body:
      "On each Program document → Detail page: set Price (sale), toggle Show strikethrough compare price only when a real discount exists, and list pricing bullets. Timeline steps and testimonials live on the same detail tab.",
  },
  {
    _type: "guideSection",
    _key: "careers_open_roles",
    heading: "Careers and open roles",
    body:
      "Careers page mode controls hero buttons and volunteer visibility. Job listings live under Collections → Open roles. HIRING and VOLUNTEER nav badges are toggles on the Careers page document.",
  },
  {
    _type: "guideSection",
    _key: "directories",
    heading: "Advisor & alumni directories",
    body:
      "Filter groups (Countries, Specialties, etc.) live under Collections → Directory filter groups. Assign tags per profile under Directory filters. Alumni specialty tags are plain strings on the company profile; advisor industry tags are separate from filter groups.",
  },
  {
    _type: "guideSection",
    _key: "do_not_touch",
    heading: "What not to touch",
    body:
      "Diagnostic survey scoring weights, reserved URL slugs, admin dashboard routes, and Stripe payment links — contact engineering before changing.",
  },
]

export const PRIORITY_MODAL_SEED = {
  priorityModalEnabled: true,
  priorityModalHeading: "Welcome to the new Rellia website",
  priorityModalBody:
    "We rebuilt the marketing site with a full CMS—explore updated network pages, programs, diagnostics, and stories. Read the launch post for a guided tour.",
  priorityModalPillText: "NEW",
  priorityModalButtonLabel: "See what's new",
  priorityModalButtonLink: "/stories/website-launch",
  priorityModalSecondaryButtonLabel: "",
  priorityModalSecondaryButtonLink: "",
  priorityModalFormEnabled: false,
  priorityModalFormButtonLabel: "Subscribe",
  priorityModalFormPlaceholderName: "First name",
  priorityModalFormPlaceholderEmail: "Email address",
}

export const PROGRAMS_LAYOUT_SEED = {
  howItWorksTitle: DEFAULT_QMS_PROGRAM.howItWorksTitle,
  howItWorksIntro: DEFAULT_QMS_PROGRAM.howItWorksIntro,
  pillarsTitle: DEFAULT_QMS_PROGRAM.pillarsTitle,
  pillars: QMS_PROGRAM_STATIC_BLOCKS.pillars.map((pillar, index) => ({
    _key: `pillar-${index}`,
    title: pillar.title,
    body: pillar.description,
  })),
  timelineTitle: DEFAULT_QMS_PROGRAM.timelineTitle,
  timelineSubtitle: DEFAULT_QMS_PROGRAM.timelineSubtitle,
  timelineWeekLabelPrefix: "Week",
}

export const QMS_PROGRAM_TIMELINE_STEPS = QMS_PROGRAM_STATIC_BLOCKS.timeline.flatMap((month) =>
  month.weeks.map((week) => ({
    title: week.heading,
    description: week.points.join("\n"),
    weekLabel: week.heading,
  })),
)

export const QMS_PROGRAM_TESTIMONIALS_SEED = (DEFAULT_QMS_PROGRAM.testimonials ?? []).map(
  (item, index) => ({
    _type: "landingTestimonialItem" as const,
    _key: `qms-testimonial-${index}`,
    quote: item.quote,
    name: item.name,
    role: item.role,
    company: item.company,
    imageSrc: item.image,
  }),
)
