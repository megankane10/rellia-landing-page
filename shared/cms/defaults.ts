import {
  threePartHeroHeadline,
  DEFAULT_HOME_TESTIMONIALS_TITLE_PORTABLE,
  DEFAULT_PROGRAMS_LANDING_HERO_PORTABLE,
} from "./inlineHeroHeadline"
import type {
  AboutPageContent,
  ApplyPageContent,
  ConsultingPageContent,
  ContactPageContent,
  ContactSubjectOption,
  DiagnosticLandingPageContent,
  FaqPageContent,
  GlobalSettingsContent,
  HomePageContent,
  HomePathsCard,
  HomeWhyFeature,
  MarketingPageContent,
  NotFoundContent,
  PaymentPageContent,
  ProgramsLandingContent,
  ProgramsProgramCard,
  QmsProgramContent,
  SanityPortableText,
  TrustedMemberTestimonial,
} from "./types"

/** Drop nullish values so `{ ...defaults, ...partial }` cannot wipe strings with CMS nulls */
const omitNullish = <T extends Record<string, unknown>>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as Partial<T>

/** Trim CMS CTA copy and strip zero-width characters that render as empty buttons */
export const normalizeCmsCtaField = (value?: string | null): string =>
  (value ?? "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim()

const compactList = <T>(arr: T[] | null | undefined): NonNullable<T>[] =>
  (arr ?? []).filter((x): x is NonNullable<T> => x != null)

/** Default portable text for Leadership Under Pressure — mirrors CMS-authored blocks. */
const LEADERSHIP_UNDER_PRESSURE_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "leadership-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "leadership-p1span",
        text: "Founders and Investors often operate under intense responsibility and visibility.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "leadership-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "leadership-p2span",
        text: "Join Dr Sabina Nagpal for this interactive, neuroscience-informed session which focuses on maintaining judgment, clarity, and presence when navigating complex decisions, competing priorities and high-pressure situations.",
        marks: [],
      },
    ],
  },
]

const WHY_HEALTHCARE_SAYS_NO_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "chai-noai-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "chai-noai-p1s",
        text: "You've built something that works. So why are you struggling to make the sale?",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "chai-noai-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "chai-noai-p2s",
        text: 'The problem is that healthcare buyers have a different definition of "ready to purchase" than most founders expect.',
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "chai-noai-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "chai-noai-p3s",
        text: "This webinar will help you get in the door.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "chai-noai-h3",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "chai-noai-h3s",
        text: "What you'll walk away with:",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "chai-noai-li1",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "chai-noai-li1s",
        text: "How to revise your pitch for what healthcare buyers actually care about",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "chai-noai-li2",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "chai-noai-li2s",
        text: "How to turn your model card into your most persuasive sales asset",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "chai-noai-li3",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "chai-noai-li3s",
        text: "What AI regulations actually mean for your product and timeline",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "chai-noai-li4",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "chai-noai-li4s",
        text: "How to align your positioning with health system priorities instead of only selling your features",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "chai-noai-p4",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "chai-noai-p4label",
        text: "Your speaker:",
        marks: ["strong"],
      },
      {
        _type: "span",
        _key: "chai-noai-p4body",
        text: " Brenton Hill, Head of Operations and General Counsel at the Coalition for Health AI (CHAI). Before CHAI, Brenton spent years at Mayo Clinic Platform doing exactly what health system buyers do: evaluating AI vendors, assessing regulatory risk, and deciding what gets purchased.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "chai-noai-p5",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "chai-noai-p5label",
        text: "About CHAI:",
        marks: ["strong"],
      },
      {
        _type: "span",
        _key: "chai-noai-p5body",
        text: " The nonprofit setting the gold standard for responsible AI in healthcare, representing 3,000+ organizations across health systems, academia, and industry. Their frameworks are increasingly what buyers reference when evaluating AI vendors.",
        marks: [],
      },
    ],
  },
]

const ASK_QMS_EXPERT_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "qms-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "qms-p1s",
        text: "Whether you are building a quality management system for the first time or trying to improve the QMS you already have, this session is designed to help you answer your questions.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "qms-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "qms-p2s",
        text: "Join this live 1:1 session with quality experts who have supported medical device teams through writing SOPs, passing certification audits, and securing regulatory approvals.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "qms-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "qms-p3s",
        text: "This is a safe space to ask questions and get guidance on how to build the right-sized QMS processes for your company.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "qms-h3",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "qms-h3s",
        text: "The quality reviewers bring knowledge and experience in:",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "qms-b1",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: "qms-b1s", text: "ISO 13485", marks: [] }],
  },
  {
    _type: "block",
    _key: "qms-b2",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: "qms-b2s", text: "ISO 14971", marks: [] }],
  },
  {
    _type: "block",
    _key: "qms-b3",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: "qms-b3s", text: "IEC 62304", marks: [] }],
  },
  {
    _type: "block",
    _key: "qms-b4",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: "qms-b4s", text: "ISO 27001", marks: [] }],
  },
  {
    _type: "block",
    _key: "qms-b5",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: "qms-b5s", text: "21 CFR Part 820", marks: [] }],
  },
  {
    _type: "block",
    _key: "qms-b6",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: "qms-b6s", text: "MDSAP", marks: [] }],
  },
  {
    _type: "block",
    _key: "qms-b7",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: "qms-b7s", text: "MDR/IVDR and more", marks: [] }],
  },
  {
    _type: "block",
    _key: "qms-p4",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "qms-p4s",
        text: "Building or updating your QMS does not have to feel overwhelming. Our experts are excited to help you.",
        marks: [],
      },
    ],
  },
]

const SET_YOUR_STAGE_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "sys-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "sys-p1s",
        text: "Learn about how small adjustments to your physicality and storytelling create a big stage presence, with public speaking coach, Alexis Orchard.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "sys-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "sys-p2s",
        text: "We will share quick, practical adjustments you can start using right away so you can deliver your health tech pitch with more ease and authority.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "sys-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "sys-p3s",
        text: "This session will focus on how you show up: body language, vocal tone, and the way you tell your story so people actually remember it.",
        marks: [],
      },
    ],
  },
]

const CLINICIAN_CONNECT_WOMENS_HEALTH_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "cc-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "cc-p1s",
        text: "This event is for clinicians and founders to meet and share ideas to make healthcare technology better.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "cc-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "cc-p2s",
        text: "For healthcare professionals, this is a chance to share your expertise on what works and what doesn't. We know you're tired of being told to adopt technology that doesn't function the way it should. Your feedback can make a major impact for founders, while also opening potential avenues for advisory or leadership opportunities in the tech industry.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "cc-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "cc-p3s",
        text: "For founders, this is a unique opportunity to gain 1:1 feedback directly from interested clinicians. Understanding how your technology will fit into real workflows will help strengthen your product's design and adoption.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "cc-h3",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "cc-h3s",
        text: "These sessions can open doors to:",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "cc-b1",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "cc-b1s",
        text: "Co-developing solutions based on real unmet needs",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "cc-b2",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "cc-b2s",
        text: "Filling advisory board member, co-founder, or chief medical officer roles",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "cc-b3",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "cc-b3s",
        text: "Discussing feedback to help make innovations more practical and effective in clinical settings",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "cc-b4",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "cc-b4s",
        text: "Exploring pilot programs, validation studies, or new business opportunities",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "cc-p4",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "cc-p4s",
        text: "Like everything we do at Rellia and Thrive MD Connect, this event is about genuine connection. There are no obligations to commit to anything, but you may find someone here who changes the course of your career for the better.",
        marks: [],
      },
    ],
  },
]

const SCALING_WITH_PURPOSE_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "swp-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "swp-p1s",
        text: "This session explores the commercialization journey for health startups, focusing on how to move beyond the prototype stage and build a purposeful business strategy that connects your idea to your customer's needs.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "swp-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "swp-p2s",
        text: "Drawing on real-world expertise, we'll cover the critical elements of funding and business strategy from prototype to scale, and why understanding the foundations of your business creates the path for success.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "swp-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "swp-p3s",
        text: "Attendees will leave with actionable insights on how to avoid common pitfalls, position their product for adoption, and scale with intention in the competitive health innovation landscape.",
        marks: [],
      },
    ],
  },
]

const BEYOND_THE_PRODUCT_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "btp-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "btp-p1s",
        text: "Most digital health founders lead with technology, but growth starts with trust. Beyond the Product helps you turn complex science into a clear, credible brand that connects with the people who matter most—investors, partners, and patients.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "btp-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "btp-p2s",
        text: "Rellia has partnered with Brave Tale to bring you a workshop for translating your technical product features into a compelling brand story.",
        marks: [],
      },
    ],
  },
]

const RELLIA_PITCH_EVENT_FORUM_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "pv-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "pv-p1s",
        text: "Rellia members get exclusive access to 1:1 pitch opportunities with Forum Ventures, a leading early-stage fund for B2B SaaS founders.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "pv-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "pv-p2s",
        text: "No crowded competitions or flashy events—just direct conversations about what you're building with people who want to help you grow.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "pv-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "pv-p3s",
        text: "Forum has backed 500+ companies who went on to raise over $1B in follow-on funding. Now they're looking at healthcare startups innovating in:",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "pv-b1",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "pv-b1s",
        text: "Staff management: tackling shortages and burnout with tools that improve retention, create flexible staffing, or offload manual work.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "pv-b2",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "pv-b2s",
        text: "Operational efficiency: reducing patient length of stay, preventing denials, and streamlining communication through AI and automation.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "pv-b3",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "pv-b3s",
        text: "Access to care: hybrid and virtual models that expand reach, improve patient engagement, and tie directly to outcomes in risk-based contracts.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "pv-p4",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "pv-p4s",
        text: "This is your chance to connect with investors who are actively writing checks and genuinely excited about healthcare innovation.",
        marks: [],
      },
    ],
  },
]

const ETHICS_IN_AI_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "eth-ai-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "eth-ai-p1s",
        text: "AI ethics is often framed as a technical checklist—fairness, transparency, accountability. But the truth is, the biggest risks in AI don't come from the machines. They come from us. From the assumptions we code in, the decisions we greenlight, and the people we leave out of the room.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "eth-ai-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "eth-ai-p2s",
        text: "Join Argentina Beltran, founder of InclusifAI and author of What We Teach the Machines, for a provocative and honest talk on the human side of AI ethics. Through real-world case studies and personal storytelling, she'll challenge us to see ethics not as an abstract framework, but as a mirror—asking what we're teaching the machines, and whether we're willing to learn from ourselves.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "eth-ai-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "eth-ai-p3s",
        text: "Hosted by Rellia Health and StartUp Lab, this session is for builders, funders, and anyone shaping AI systems who wants to move beyond buzzwords toward responsibility with depth, courage, and humanity.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "eth-ai-p4",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "eth-ai-p4s",
        text: "We are official event hosts with Waterloo Tech Week 2025, a celebration of what's been built here, and what's still to come. We're building something great together. September 8-11, 2025. waterlootechweek.ca",
        marks: [],
      },
    ],
  },
]

const SECOND_OPINION_USER_RESEARCH_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "so-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "so-p1s",
        text: "You're building healthcare products that need to work for real patients and providers, but how do you know if you're on the right track?",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "so-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "so-p2s",
        text: "Join a seasoned UX researcher with 20 years of experience in health tech to see how user research actually works in practice.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "so-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "so-p3s",
        text: "We'll start with a real case study from a healthcare startup that used research to dramatically improve their onboarding—and the impressive numbers that followed. Then we'll break down the decisions behind the research: how they chose the right methods, found the right participants, and turned insights into action.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "so-p4",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "so-p4s",
        text: "Walk away understanding when research makes sense for your startup and when it's time to bring in expert help.",
        marks: [],
      },
    ],
  },
]

const AI_HEALTHCARE_COMPLIANCE_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "ahc-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p1s",
        text: "The Human Layer: the missing layer above the tech stack - trust, coordination, and shared understanding - so humanity and technology can advance in harmony.",
        marks: [],
      },
    ],
  },
  {
    _type: "eventDetailInlineImage",
    _key: "ahc-img-desc",
    imageSrc: "/images/complianceevent-desc.jpeg",
    alt: "The Human Layer — trust, coordination, and shared understanding in healthcare AI",
  },
  {
    _type: "block",
    _key: "ahc-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p3s",
        text: "As AI becomes embedded in healthcare products, the compliance stakes have never been higher. This event brings together compliance leaders, startup operators, and senior executives on one stage to cut through the noise — offering honest, experience-backed perspectives on what it actually takes to build in this regulated space.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p4",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p4s",
        text: "Expect candid panel discussions, real-world examples, and a strong emphasis on AI governance and data security — the areas where healthtech teams most often underestimate their exposure.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p5",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p5s",
        text: "What you'll gain",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p6",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p6s",
        text: "Live panel discussions: Real conversations on compliance strategy, AI risk, and security obligations in healthtech",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p7",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p7s",
        text: "Practical guidelines & tips: Actionable frameworks you can apply immediately — not theory, but ground-level advice",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p8",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p8s",
        text: "Exclusive Google Drive resource pack: Curated compliance guidelines and templates shared post-event — a lasting reference for your team",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p9",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p9s",
        text: "Deep dive: AI & security: A dedicated focus on AI-specific compliance risks and how to build secure, trustworthy health products",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p10",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p10s",
        text: "----",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p11",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p11s",
        text: "Our Expert Panelists:",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p12",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p12s",
        text: "Our discussion features leaders who are actively shaping the future of healthtech security:",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p13",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p13s",
        text: "Panelists:",
        marks: ["strong"],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p14",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p14s",
        text: "Megan Kane – Executive Director of Rellia, specializing in AI-enabled SaMD, diagnostics, and global regulatory strategy for FDA, Health Canada, EU MDR, and APAC compliance.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p15",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p15s",
        text: "Andre Padure – Head of Regulatory Affairs and Quality Assurance at RetiSpec, leading global regulatory strategy and quality systems for the company’s AI-powered retinal imaging platform for early Alzheimer’s disease detection.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p16",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p16s",
        text: "Roy Kirshon – COO & Co-Founder of RetiSpec, leading company strategy, financing, and operations to support the development and commercialization of healthcare technologies.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p17",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p17s",
        text: "Moderator:",
        marks: ["strong"],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p18",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p18s",
        text: "Katie Duyen Nguyen - Regional Director of BD @ CyStack",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p19",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p19s",
        text: "Brought to you by:",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p20",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p20s",
        text: "RetiSpec - A Toronto-based medical AI company using advanced imaging technology to detect signs of neurodegenerative disease - including Alzheimer's - through a simple, non-invasive retinal scan. RetiSpec's clinically validated AI analyzes retinal images captured by standard eye clinic cameras to identify disease biomarkers before symptoms appear, putting powerful early detection tools directly at the point of care.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p21",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p21s",
        text: "Rellia Health - A community that connects promising digital health founders with industry experts, healthcare practitioners, and engaged investors. Rellia is a network of people who deeply understand the healthcare industry and will go out of their way to help you succeed. We connect early-stage digital health, medical device, wellness, and diagnostic companies with the personalized solutions that match their unique needs.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p22",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p22s",
        text: "CyStack - Blends deep offensive security knowledge with proprietary tooling to help organizations protect their products, data, and operations. Their suite covers penetration testing, automated vulnerability scanning (VulnScan), crowdsourced bug bounty (WhiteHub), secrets management (Locker), and 24/7 security monitoring — giving healthtech startups everything they need to build secure from day one.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p23",
    style: "blockquote",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p23s",
        text: "“Toronto Tech Week is a citywide celebration of the people building what’s next. From May 26–29, 2026, founders, investors, and builders come together for hundreds of community-led events across Toronto, connecting tens of thousands of people around Canadian tech.”\nTorontotechweek.com",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p24-title",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p24s-title",
        text: "Please be advised",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ahc-p24-body",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ahc-p24s-body",
        text: "Unfortunately, space is very limited at these community events and we can not always accept everyone we would like to. If you are not accepted to this event, please keep applying! We appreciate your application tremendously and we are looking forward to seeing you at a future event very soon!",
        marks: [],
      },
    ],
  },
]

/** Sample in-person Toronto event with inline images in the body (portable text). */
const DIGITAL_HEALTH_SALON_TORONTO_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "toronto-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "toronto-p1a",
        text: "Join us for a small-group evening for digital health operators: product leads, clinical partners, and founders who are shipping in real care settings. We will walk through a candid roundtable on adoption signals, procurement reality, and what “ready for scale” actually looks like in Ontario’s health system.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "toronto-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "toronto-p2a",
        text: "The session includes two short spotlights, open discussion, and time to connect after the formal program. Light refreshments are included. Capacity is limited to keep the conversation high-signal.",
        marks: [],
      },
    ],
  },
  {
    _type: "eventDetailInlineImage",
    _key: "toronto-img-venue",
    imageSrc:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    alt: "Modern open office with people collaborating at a long table",
    caption: "Host venue — MaRS collaboration space, College Street",
  },
  {
    _type: "block",
    _key: "toronto-p3",
    style: "h2",
    markDefs: [],
    children: [
      { _type: "span", _key: "toronto-h2a", text: "Who should attend", marks: [] },
    ],
  },
  {
    _type: "block",
    _key: "toronto-p4",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "toronto-p4a",
        text: "Founders past seed, clinical champions sponsoring pilots, and operators responsible for workflow integration—not slide decks, live deployments.",
        marks: [],
      },
    ],
  },
  {
    _type: "portableImageCarousel",
    _key: "toronto-carousel",
    title: "Scenes from the venue",
    slides: [
      {
        _type: "portableImageCarouselSlide",
        _key: "toronto-car-1",
        imageSrc:
          "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1400&q=80",
        alt: "Modern glass building facade with walkway",
        caption: "MaRS district — short walk from Queen’s Park station",
      },
      {
        _type: "portableImageCarouselSlide",
        _key: "toronto-car-2",
        imageSrc:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
        alt: "Bright open workspace with long communal table",
        caption: "Typical breakout layout for evening roundtables",
      },
      {
        _type: "portableImageCarouselSlide",
        _key: "toronto-car-3",
        imageSrc:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
        alt: "Retail storefront and pedestrians on a city sidewalk",
        caption: "College Street — arrive 15 minutes early for lobby check-in",
      },
    ],
  },
  {
    _type: "block",
    _key: "toronto-p5",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "toronto-p5a",
        text: "We will follow up with calendar logistics and accessibility notes one week before the date.",
        marks: [],
      },
    ],
  },
]

const isSubjectOption = (o: unknown): o is ContactSubjectOption =>
  typeof o === "object" &&
  o != null &&
  "value" in o &&
  "label" in o &&
  typeof (o as ContactSubjectOption).value === "string" &&
  typeof (o as ContactSubjectOption).label === "string"

export const DEFAULT_THEME_COLORS = {
  primary: "#0D3540",
  secondary: "#EEF2F2",
  accent: "#9DD6D0",
} as const

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettingsContent = {
  footerTagline:
    "Rellia connects promising digital health founders with industry experts, clinicians, and engaged investors.",
  supportEmail: "hello@relliahealth.com",
  linkedinUrl: "https://www.linkedin.com/company/relliahealth",
  instagramUrl: "https://www.instagram.com/relliahealth/",
  copyrightLine: "Rellia Health. All rights reserved.",
  announcementEnabled: true,
  announcementText: "The Regulatory Strategy Sprint is now accepting applications.",
  announcementButtonLabel: "Learn More",
  announcementButtonLink: "/programs/regulatory-strategy-sprint",
  announcementPillText: "LIVE",
  priorityModalEnabled: false,
  priorityModalHeading: "Welcome to the Preview Environment",
  priorityModalBody: "This preview environment displays unpublished changes. You can review all current drafts on the drafts dashboard, or edit content in the Sanity Studio.",
  priorityModalPillText: "PREVIEW",
  priorityModalButtonLabel: "View Drafts Dashboard",
  priorityModalButtonLink: "/admin/drafts",
  priorityModalSecondaryButtonLabel: "",
  priorityModalSecondaryButtonLink: "",
  priorityModalFormEnabled: false,
  priorityModalFormButtonLabel: "Subscribe",
  priorityModalFormPlaceholderName: "First name",
  priorityModalFormPlaceholderEmail: "Email address",
}

export const DEFAULT_HOME_PATHS_CARDS: HomePathsCard[] = [
  {
    roleId: "founder",
    tagLabel: "Founders",
    title: "Build with signal",
    subtitle: "Programs, mentors, and warm intros aligned to healthcare reality.",
    imageSrc: "/images/paths-founder-pexels.jpg",
    imageAlt: "Team of founders collaborating around a table",
    ctaLabel: "I'm a founder",
    ctaTo: "/founders",
  },
  {
    roleId: "advisor",
    tagLabel: "Advisors",
    title: "Mentor decisively",
    subtitle: "Join a bench built for outcomes—not open-ended overhead.",
    imageSrc: "/images/paths-advisor-pexels.jpg",
    imageAlt: "Professional advisor working with a colleague",
    ctaLabel: "I'm an advisor",
    ctaTo: "/advisors",
  },
  {
    roleId: "investor",
    tagLabel: "Investors",
    title: "See founder quality",
    subtitle: "Curated pitch events and diligence-friendly updates.",
    imageSrc: "/images/paths-investor-pexels.jpg",
    imageAlt: "Investor in conversation during a business meeting",
    ctaLabel: "I'm an investor",
    ctaTo: "/investors",
  },
  {
    roleId: "partner",
    tagLabel: "Partners",
    title: "Drive adoption",
    subtitle: "Partner pathways designed for pilots, integration, and trust.",
    imageSrc: "/images/paths-partner-pexels.jpg",
    imageAlt: "Two partners shaking hands after an agreement",
    ctaLabel: "I'm a partner",
    ctaTo: "/industry-partners",
  },
]

export const DEFAULT_HOME_PAGE: HomePageContent = {
  headlinePrefix: "You are the future of health tech.",
  subheadline:
    "Rellia helps founders achieve their milestones to launch their healthcare innovations.",
  primaryCtaLabel: "Apply to Join",
  primaryCtaPath: "/apply",
  secondaryCtaLabel: "See our Programs",
  secondaryCtaPath: "/programs",
  heroBackgroundVideoUrl: "/videos/homehero.mp4",
  metricsHeading: "The right people make all the difference.",
  metrics: [
    { label: "Members in the Rellia community", value: 291 },
    { label: "Health tech startups", value: 81 },
    { label: "Countries around the world", value: 11 },
  ],
  howItWorksSectionTitle: "Where we focus",
  howItWorksSectionDescription:
    "Health tech commercialization is complex, and generic start-up advice won't help you. These are the areas where Rellia can help.",
  howItWorksSteps: [
    {
      iconKey: "BriefcaseBusiness",
      title: "Product Design and Development",
      description:
        "Turn your concept into a credible MVP with smart scope, architecture trade-offs, and interoperability guidance.",
    },
    {
      iconKey: "ClipboardList",
      title: "User Feedback",
      description:
        "Collect the proof that matters—usability, pilots, and validation—so you can iterate fast and show traction clearly.",
    },
    {
      iconKey: "BadgeCheck",
      title: "Regulatory and Legal Compliance",
      description:
        "Navigate privacy, security, IP, and classification with less guesswork—stay compliant without slowing the roadmap.",
    },
    {
      iconKey: "DollarSign",
      title: "Fundraising",
      description:
        "Sharpen your narrative, metrics, and materials—be ready for grants, angels, or VC with a diligence-proof data room.",
    },
    {
      iconKey: "Megaphone",
      title: "Marketing and Commercial Strategy",
      description:
        "Clarify positioning and go-to-market for healthcare—build trust and move prospects from interest to commitment.",
    },
    {
      iconKey: "Building2",
      title: "Navigating Healthcare Systems",
      description:
        "Understand procurement, reimbursement, and adoption realities—so your plan matches how health systems actually buy and roll out.",
    },
    {
      iconKey: "ShieldCheck",
      title: "Security and Trust",
      description:
        "Get ahead of security reviews with practical evidence, policies, and vendor requirements—without stalling progress.",
    },
    {
      iconKey: "Activity",
      title: "Operations and Scaling",
      description:
        "Set the operating rhythm—metrics, customer success, hiring, and finance—so you can scale what's working without chaos.",
    },
    {
      iconKey: "Handshake",
      title: "Partnership Readiness",
      description:
        "Prepare for pilots and partnerships with the right materials, stakeholders, and execution plan—so teams can say yes faster.",
    },
  ],
  whySectionTitle: "Why Rellia?",
  whySectionDescription:
    "A curated network and practical support system to help you move through the moments that make or break a healthcare startup.",
  whyFeatures: [
    {
      iconKey: "target",
      title: "The Outcomes",
      description:
        "Avoid mistakes on your path to market and easily achieve your milestones through our customized programs",
      imageSrc:
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      iconKey: "userRound",
      title: "The Advisors",
      description:
        "Access 1:1 guidance from experts with years of experience scaling health tech businesses.",
      imageSrc:
        "https://images.pexels.com/photos/3182761/pexels-photo-3182761.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      iconKey: "bookOpen",
      title: "The Resources",
      description:
        "Apply tangible tools, hands-on workshops, and proven templates to move your business forward right now",
      imageSrc:
        "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      iconKey: "users",
      title: "The Community",
      description:
        "Beta test your ideas, find an accountability buddy, cheer each other on, share your deepest worries. Connect with fellow health tech founders who have been through it before.",
      imageSrc:
        "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
  ],
  ctaTitle: "Are you the next Rellia Health success story?",
  ctaButtonLabel: "Apply to Join Now",
  ctaButtonPath: "/apply",
  ctaSecondaryButtonLabel: "Explore Programs",
  ctaSecondaryButtonPath: "/programs",
  ctaImageUrl: "/images/cta-home-conference.webp",
  ctaImageAlt: "Man speaking at conference",
  pathsTitle: "Find your place in the community",
  pathsCards: DEFAULT_HOME_PATHS_CARDS,
  testimonialsTitlePortable: DEFAULT_HOME_TESTIMONIALS_TITLE_PORTABLE,
  testimonials: [
    {
      name: "Mazhar Shahen",
      role: "CEO",
      company: "NewGen Health",
      quote:
        "Rellia has been an invaluable partner in our journey. Their regulatory expertise gave us the clarity and confidence to better understand Health Canada and FDA pathways as a health-tech startup. The team genuinely cares about helping early-stage companies succeed, not just with advice, but with hands-on support when it matters most.",
      companyInfo:
        "NewGen Health is developing a novel-assay that is powered by AI to screen for early detection of chronic kidney disease transforming how and when care begins for 40 million people.",
      imageSrc: "/images/testimonials-MazharS.jpeg",
    },
    {
      name: "Zarrah Uy",
      role: "CEO",
      company: "Syncara",
      quote:
        "As an early-stage healthtech startup, Rellia gave us access to resources and people that would have otherwise been incredibly difficult to reach on our own, that access alone accelerated our work in such valuable ways.",
      companyInfo:
        "Syncara is a patient-first digital health platform designed to help Canadians organize, track, and manage their health records. ",
      imageSrc: "/images/testimonials-ZarrahU.jpeg",
    },
    {
      name: "Dr. Sahil Khan",
      role: "Founder",
      company: "NovusTex Corp",
      quote:
        "Rellia has been nothing short of exceptional- a truly dynamic incubator where early ventures are not only given space to grow, but are actively empowered to connect, refine, pitch, and evolve. The ecosystem is deeply professional, energizing, and genuinely supportive of innovation. Rellia is not just an incubator - it’s a launchpad for ambitious founders.",
      companyInfo:
        "A rehabilitation-focused company bringing novel performance textiles and assistive solutions to support mobility, reduce injury risk, and enhance comfort during recovery for patients with musculoskeletal and neurological conditions.",
      imageSrc: "/images/testimonials-sahilkhan.jpeg",
    },
    {
      name: "Dhandre Weekes",
      role: "CEO",
      company: "CareLog",
      quote:
        "Rellia is full of driven founders and healthcare innovators, which is actually where I connected with my advisory council members.",
      companyInfo:
        "An elder care platform to help assisted living, memory care, and specialized residential homes manage daily care, reporting, and family communication.",
      imageSrc: "/images/testimonials-dhandreW.jpeg",
    },
    {
      name: "Melissa Williams",
      role: "Founder & Chief Orchestrator",
      company: "HorminaCare",
      quote:
        "Being part of this group has been a great experience. Rellia has created a supportive space for health tech founders, with valuable resources and opportunities to connect.",
      companyInfo:
        "HorminaCare provides virtual access to expert medical professionals for science-backed treatment for hormone-related conditions such as PCOS, adult acne, PMDD, and beyond.",
      imageSrc: "/images/testimonials-melissaW.jpeg",
    },
    {
      name: "Irene Saliandra",
      role: "CEO",
      company: "Digital Flow",
      quote:
        "I've thoroughly enjoyed being part of the Rellia community—not only has it opened doors to expand my network, but also given me opportunities to test my ideas with like minded folks.",
      companyInfo:
        "Digital Flow empowers entrepreneurs and small business owners through their digital transformation journey.",
      imageSrc: "/images/testimonials-ireneS.jpeg",
    },
    {
      name: "Michelle Risinger",
      role: "CEO",
      company: "Restore Enterprises Corporation",
      quote:
        "I've found the Rellia community full of smart, inclusive and generous members eager to provide support, connections and ideas.",
      companyInfo:
        "Restore is an API that optimizes daily performance using chronobiology.",
      imageSrc: "/images/testimonials-michelleR.png",
    },
    {
      name: "Rafael Rodeiro",
      role: "CEO",
      company: "Roster",
      quote:
        "In a matter of days, Rellia was able to connect me with exactly the right people. Specific, high-quality introductions that would have taken me weeks to find on my own.",
      companyInfo:
        "Roster is the first AI-native employee giving platform built specifically for health systems.",
      imageSrc: "/images/testimonials-rafaelR.jpeg",
    },
    {
      name: "Nick Sabamehr",
      role: "CEO",
      company: "MA EdTech Solutions",
      quote:
        "Rellia has been a big support in our journey from the first conversation, and we have built our strongest relationships through Rellia's support.",
      companyInfo:
        "MA Edtech Solutions helps immigrant children and their parents experience a better life in their country of residence.",
      imageSrc: "/images/testimonials-nickS.jpeg",
    },
    {
      name: "Rooaa Shanshal",
      role: "Co-Founder",
      company: "Power of Play",
      quote:
        "Being part of Rellia has been so incredibly valuable. Since joining, we've made real progress on building our QMS which is something that previously felt overwhelming.",
      companyInfo: "Power of Play takes a play-based approach to pediatric rehabilitation",
      imageSrc: "/images/testimonials-rooaaS.jpeg",
    },
    {
      name: "Rebecca Lyons",
      role: "CEO",
      company: "HerSay",
      quote:
        "Rellia has been a great resource for our team as we have navigated early stage validation and finding market fit.",
      companyInfo:
        "HerSay is an AI-powered doctor visit companion designed to help women feel seen, heard and prepared while navigating the healthcare system.",
      imageSrc: "/images/testimonials-rebeccaL.jpeg",
    },
  ],
}

export const DEFAULT_ABOUT_PAGE: AboutPageContent = {
  heroHeadlinePortable: threePartHeroHeadline("Empowering the", "next generation", " of health tech."),
  heroIntro:
    "Rellia Health is a virtual incubator dedicated to accelerating the commercialization of digital health solutions that matter.",
  missionTitle: "Our Mission",
  missionParagraphs: [
    "The healthcare industry is notoriously difficult to navigate. Brilliant founders often struggle not because their ideas lack merit, but because they are trying to figure it out without the right people around them.",
    "At Rellia, we meet health tech founders where they are, surrounding them with deep industry expertise and individualized support so that the complexities of healthcare innovation feel less overwhelming. Because when founders have the right people in their corner, meaningful innovation actually reaches the patients who need it.",
  ],
  missionImageSrc:
    "https://images.pexels.com/photos/8460371/pexels-photo-8460371.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200",
  missionImageAlt: "Healthcare professionals meeting and collaborating together",
  valuesTitle: "Values",
  valuesSubtitle: "These principles guide every decision we make.",
  values: [
    {
      iconKey: "heart",
      title: "Generous",
      description:
        "Building in health tech is hard enough. Everyone here genuinely wants to see you succeed, and that makes all the difference.",
    },
    {
      iconKey: "stethoscope",
      title: "Healthcare-Specific",
      description:
        "Generic startup guidance does not work in healthcare. Everything we offer is built around the specific realities of health tech commercialization.",
    },
    {
      iconKey: "globe",
      title: "Globally Connected",
      description:
        "Great ideas and great mentors are not concentrated in one city. Rellia is a virtual community, and that breadth makes it stronger.",
    },
    {
      iconKey: "zap",
      title: "Radically Practical",
      description:
        "You don't need more learning, you need more things accomplished. We focus on helping you achieve the outcomes that actually move your business forward.",
    },
  ],
  teamTitle: "Meet The Team",
  teamSubtitle: "Health tech insiders who saw a better way, so they built it. Just like you did.",
  team: [
    {
      name: "Megan Kane",
      role: "Executive Director, Co-Founder",
      bio: "Regulatory and Quality Management executive specializing in global market entry strategy and FDA/Health Canada submissions for SaMD and digital health companies.",
      imageSrc: "https://www.relliahealth.com/images/team-megankane.jpg",
      socialLinks: [
        { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/megankane1/" },
        { platform: "website", label: "Website", url: "https://megankaneportfolio.carrd.co/" },
      ],
    },
    {
      name: "Deena Al-Sammak",
      role: "Program Manager, Co-Founder",
      bio: "Deena brings startup experience in the health tech space and leverages her experience to lead our program development and management",
      imageSrc: "https://www.relliahealth.com/images/team-deenasammak.png",
      socialLinks: [
        { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/deena-al-sammak/" },
      ],
    },
    {
      name: "Khali Abdi",
      role: "User Experience, Community Strategy Manager",
      bio: "A Chemical Engineer & digital health founder, Khali blends her technical background with a deep commitment to human-centred design to ensure Rellia’s ecosystem is as intuitive as it is impactful.",
      imageSrc: "https://www.relliahealth.com/images/team-abdi.JPG",
      socialLinks: [
        { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/khali-abdi/" },
      ],
    },
    {
      name: "Priyanka Ramjagsingh",
      role: "Operations Director",
      bio: "With a decade of experience embedded in early-stage health companies, Priyanka converts her deep regulatory and quality expertise into operational momentum, turning complexity into the strategic edge that moves teams forward.",
      imageSrc: "https://www.relliahealth.com/images/team-priyankaR.jpeg",
      socialLinks: [
        { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/shyama-ramjagsingh/" },
      ],
    },
    {
      name: "Kelly Hu",
      role: "Social Media Manager",
      bio: "A digital health founder herself, Kelly plans and executes content creation to boost engagement and showcase Rellia's growing network.",
      imageSrc: "https://www.relliahealth.com/images/team-KellyH.jpeg",
      socialLinks: [
        { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/kellyjiayihu/" },
      ],
    },
  ],
  ctaTitle: "You're in the right place.",
  ctaBody:
    "If you're a founder who wants to do this right, we have the network and expertise to make it happen.",
  ctaFounderLabel: "Apply to join as a founder",
  ctaTeamLabel: "Join the Rellia team",
}

export const DEFAULT_FAQ_PAGE: FaqPageContent = {
  title: "Everything you need to know about Rellia",
  subtitle: "We've collected the most common questions our members ask before joining.",
  items: [
    {
      id: "products",
      question: "What kind of products does Rellia work with?",
      answer:
        "We specialize in healthcare-focused innovations with a software component - digital health, health tech, medtech, whatever you call it. Whether it's a connected medical device, a diagnostic platform, a digital therapeutic, or a general wellness app, our programs are built to help you succeed specifically in the complex healthcare technology market.",
    },
    {
      id: "funding",
      question: "Does my company need funding or revenue to join?",
      answer:
        "We work with companies at every stage of development, from pre-seed to Series A, with customized programs to meet you where you are. As long as you have a clear idea of the problem you're solving and a vision for the solution, we can help.",
    },
    {
      id: "cost",
      question: "What is the cost to join?",
      answer:
        "Rellia operates on a monthly membership model that gives you full access to our advisors, community, and a core set of included programs. Some specialized programs carry an additional cost, and we are always transparent about what is included before you commit to anything.",
    },
    {
      id: "equity",
      question: "Do founders need to give up equity to join?",
      answer:
        "No. We believe founders should keep control of their companies. Once you're a member, you'll have access to the expertise and resources you need without giving up a stake in your business.",
    },
    {
      id: "country",
      question: "Do I need to be based in a specific country to join?",
      answer:
        "No, Relia Health is a global network with members across the world. We work with the best of the best, regardless of where they happen to live.",
    },
    {
      id: "after-join",
      question: "What happens once I join?",
      answer:
        "Once your application is approved, you will receive an invitation to join our community. From there, you can reach out to our team directly and we will connect you with the specific advisors, programs, clinicians, or fellow founders that match what you are working on.",
    },
    {
      id: "programs-without-membership",
      question: "Can I join a program without becoming a member?",
      answer:
        "Yes, most Rellia programs are available to non-members as well. If you decide to become a member, you will get discounted access to programs alongside everything else membership includes.",
    },
    {
      id: "member-required-for-program",
      question: "Do I need to become a member to join a program?",
      answer: "No - programs are open to members and non-members",
    },
    {
      id: "advisor-time",
      question: "How much time do advisors commit to?",
      answer:
        "Advisors typically volunteer a few hours a month to high-impact conversations with founders who are building in areas they're passionate about.",
    },
    {
      id: "investors",
      question: "What does Rellia Health offer to investors?",
      answer:
        "Investors get curated access to high-potential startups, due diligence support, and the opportunity to invest alongside a network of experienced partners in healthcare and technology.",
    },
    {
      id: "industry-partner",
      question: "I'm an industry partner - how can I collaborate with Rellia Health?",
      answer:
        "Industry partners can engage with our founder community through sponsored programs or events, mentorship, and founder referrals.",
    },
    {
      id: "apply",
      question: "How do I apply or express interest in joining?",
      answer:
        "You can apply through our website by completing the short interest form. Our team will follow up with next steps.",
    },
  ],
  sidebarTitle: "Ready to scale?",
  sidebarBody:
    "We’re looking for the next wave of digital health innovators. If you’re clear on your vision but need the right network to execute, don't wait for the FAQ.",
  sidebarCtaLabel: "Apply to join",
  sidebarCtaPath: "/apply",
  bottomTitle: "Every startup is different",
  bottomBody:
    "Tell us more about where you are today and where you want to be in the next 12–18 months. We'll share how Rellia can help accelerate that path, or recommend a better fit if we're not it.",
  bottomCtaLabel: "Get in Touch",
  bottomCtaPath: "/contact",
}

const INVESTOR_READINESS_DETAIL_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "ir-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ir-p1s",
        text: "Eric Haywood has been on both sides of the investment table. As a four-time founder and investor at InterSystems Ventures, he has built companies, raised capital, and evaluated startups for investment. In this session, he will share what makes a company fundable and how to show up more prepared.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ir-h3",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ir-h3s",
        text: "What you will walk away with:",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ir-b1",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ir-b1s",
        text: "What VCs look for in early-stage health tech companies",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ir-b2",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ir-b2s",
        text: "What signals separate successful companies from the rest",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ir-b3",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ir-b3s",
        text: "How to tell your story in a way that resonates with investors",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ir-b4",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ir-b4s",
        text: "Common mistakes founders make in the fundraising process and how to avoid them",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ir-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ir-p2s",
        text: "This is a practical, no-fluff session for founders who are serious about fundraising and want an honest look at how the process works.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ir-h3b",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ir-h3bs",
        text: "About Us:",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "ir-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "ir-p3s",
        text: "Rellia is a virtual incubator connecting digital health founders with investors, clinicians, and advisors to launch healthcare solutions. https://www.relliahealth.com/",
        marks: [],
      },
    ],
  },
]

/** Default event card image (square AVIF). Use for all placeholder events until CMS provides per-event art. */
const DEFAULT_PROGRAMS_EVENT_IMAGE_SRC = "/images/event-leadershipUnderPressure.avif"

export const DEFAULT_PROGRAMS_LANDING: ProgramsLandingContent = {
  heroTitlePortable: DEFAULT_PROGRAMS_LANDING_HERO_PORTABLE,
  heroSubtitle:
    "Targeted programs and live events designed to help you accomplish your next milestone, not just learn about it.",
  heroPrimaryCtaLabel: "View Programs",
  heroSecondaryCtaLabel: "View Events",
  programsSectionTitle: "Explore programs",
  programsSectionSubtitle: "",
  programs: [
    {
      title: "Build Your Quality Management System",
      description:
        "Build a lean, scalable QMS to comply with ISO 13485, MDSAP, FDA, and MDR requirements, with personalized guidance from quality experts every step of the way",
      imageSrc: "/images/programs-buildYourQMS.png",
      href: "/programs/build-your-quality-management-system",
      buttonText: "Learn more",
    },
    {
      title: "Ignite: Pitch Foundations",
      description:
        "Master the essentials of fundraising by crafting your first pitch deck and presentation. Perfect for early-stage founders looking for a structured starting point to build investor confidence.",
      imageSrc: "/images/programs-IgnitepItch.png",
      href: "/programs/ignite-pitch-foundations",
      buttonText: "Learn more",
      waitlistHref: "https://forms.fillout.com/t/bLGtn6S2jtus",
    },
    {
      title: "Advance: Data Room Deep Dive",
      description:
        "Move beyond the basics into the mechanics of due diligence and data room management. Gain the practical tools and execution tips needed to navigate the complexities of the raising process.",
      imageSrc: "/images/programs-DataRoom.png",
      href: "/programs/advance-data-room-deep-dive",
      buttonText: "Learn more",
      waitlistHref: "https://forms.fillout.com/t/bLGtn6S2jtus",
    },
    {
      title: "Elevate: Healthcare Capital",
      description:
        "Refine your existing fundraising strategy for the specialized world of health tech. Upgrade your pitch to meet the specific technical and clinical expectations of healthcare investors.",
      imageSrc: "/images/programs-HealthcareCapital.png",
      href: "/programs/elevate-healthcare-capital",
      buttonText: "Learn more",
      waitlistHref: "https://forms.fillout.com/t/bLGtn6S2jtus",
    },
    {
      title: "First 50 Users: A Clinical Feedback Intensive",
      description:
        'Validate your product through facilitated usability testing and "assumption audits" with Rellia\'s clinician network. Gain the IRB guidance and professional feedback needed to bridge the gap between prototype and clinical use.',
      imageSrc: "/images/programs-first50Users.png",
      href: "/programs/first-50-users-clinical-feedback-intensive",
      buttonText: "Learn more",
      waitlistHref: "https://forms.fillout.com/t/bLGtn6S2jtus",
    },
    {
      title: "A Low-Fidelity Prototype Lab",
      description:
        "Transform your vision into a functional low-fidelity prototype and a vendor-ready requirements document. Finish the program by connecting with vetted development firms and testing experts to build your proof of concept.",
      imageSrc: "/images/programs-PrototypeLab.png",
      href: "/programs/low-fidelity-prototype-lab",
      buttonText: "Learn more",
      waitlistHref: "https://forms.fillout.com/t/bLGtn6S2jtus",
    },
    {
      title: "Advisory Board Match",
      description:
        "Identify and recruit the ideal experts for your startup using Rellia's vetted advisor network. We provide the matchmaking, equity benchmarking, and legal frameworks to ensure your advisory relationships are productive from day one.",
      imageSrc: "/images/programs-AdvisoryBoard.png",
      href: "/programs/advisory-board-match",
      buttonText: "Learn more",
      waitlistHref: "https://forms.fillout.com/t/bLGtn6S2jtus",
    },
    {
      title: "Design Your Brand Strategy",
      description:
        "Develop a professionally positioned brand identity that earns trust from both clinicians and investors. This intensive includes specialized sprints for your website copy, UI design, and sales collateral to ensure a cohesive market presence.",
      imageSrc: "/images/programs-brandStrategy.png",
      href: "/programs/design-your-brand-strategy",
      buttonText: "Learn more",
      waitlistHref: "https://forms.fillout.com/t/bLGtn6S2jtus",
    },
    {
      title: "Regulatory Strategy Sprint",
      description:
        "Confirm your medical device classification and global market entry pathway. Leave with a documented regulatory strategy and intended use statements to support your investor due diligence.",
      imageSrc: "/images/programs-regulatoryRoadmap.png",
      href: "/programs/regulatory-strategy-sprint",
      buttonText: "Learn more",
      waitlistHref: "https://forms.fillout.com/t/bLGtn6S2jtus",
    },
  ],
  upcomingEvents: [
    {
      slug: "ai-healthcare-compliance",
      title: "AI Healthcare Compliance (w/ The AI Collective)",
      dateTime: "Wednesday, May 27, 2026 — 6:00 PM - 8:30 PM EDT",
      person: "The AI Collective • Toronto Tech Week",
      imageSrc: "/images/aiHealthcareCompliance.avif",
      location: "RetiSpec, 170 Bedford Rd, Toronto",
      startsAt: "2026-05-27T18:00:00-04:00",
      endsAt: "2026-05-27T20:30:00-04:00",
      lumaEventId: "evt-0wKks8RxsxxgmFh",
      embedLumaOnDetailPage: true,
      detailBodyHeading: "About this event",
      detailBody: AI_HEALTHCARE_COMPLIANCE_DETAIL_BODY,
    },
    {
      slug: "clinician-connect-primary-care",
      title: "Clinician Connect: Primary Care",
      dateTime: "Thursday, July 9, 2026 — 2:00 PM EDT",
      person: "Rellia Health • Company event",
      imageSrc: "/images/events-clinicianConnectPrimaryCare.jpg",
      location: "Virtual",
      addToCalendarEnabled: true,
      startsAt: "2026-07-09T14:00:00-04:00",
      endsAt: "2026-07-09T15:00:00-04:00",
      embedLumaOnDetailPage: false,
      detailBodyHeading: "About this session",
      detailBody: [
        {
          _type: "block",
          _key: "cc-primary-p1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "cc-primary-p1s",
              text: "A practical session for clinicians and founders focused on primary care workflows, adoption signals, and what actually gets used.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "cc-primary-p2",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "cc-primary-p2s",
              text: "Bring your questions. We’ll cover common blockers, simple pilot design, and how to turn frontline feedback into product decisions.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      slug: "investor-readiness-how-vcs-evaluate-startups",
      title: "Investor Readiness: How VCs Evaluate Startups",
      dateTime: "Wednesday, June 17, 2026 — 12:00 PM - 1:00 PM EDT",
      person: "Eric Haywood • InterSystems Ventures",
      imageSrc: "/images/event-investorReadiness.jpg",
      location: "Virtual",
      startsAt: "2026-06-17T12:00:00-04:00",
      endsAt: "2026-06-17T13:00:00-04:00",
      lumaEventId: "evt-5ONXRkPwM81lwuM",
      embedLumaOnDetailPage: true,
      detailBodyHeading: "About this session",
      detailBody: INVESTOR_READINESS_DETAIL_BODY,
    },
  ],
  pastEvents: [
    {
      slug: "leadership-under-pressure",
      title: "Leadership Under Pressure",
      dateTime: "Wednesday, May 6, 2025 — 12:00 PM EST",
      person: "Dr. Sabina Nagpal • Radiate Mind",
      imageSrc: DEFAULT_PROGRAMS_EVENT_IMAGE_SRC,
      href: "https://luma.com/bgvqn7ia",
      location: "Virtual",
      lumaEventId: "evt-h1FZAFHZ8gzGjJn",
      embedLumaOnDetailPage: true,
      detailBodyHeading: "About this session",
      detailBody: LEADERSHIP_UNDER_PRESSURE_DETAIL_BODY,
    },
    {
      slug: "health-system-adoption-for-startups",
      title: "Health System Adoption for Startups",
      dateTime: "Thursday, April 9, 2025 — 2:00 PM EDT",
      person: "Rellia Health • Company event",
      imageSrc: "/images/events-healthsystem.avif",
      href: "https://luma.com/ao1g8a7h",
      buttonText: "View Event",
      location: "Virtual",
    },
    {
      slug: "why-healthcare-says-no-to-your-ai",
      title: "Why Healthcare Keeps Saying No to Your AI (And How to Fix It)",
      dateTime: "Thursday, March 12, 2025 — 1:00 PM EDT",
      person: "Brenton Hill • CHAI",
      imageSrc: "/images/events-whyHealthcareKeeps.avif",
      href: "https://luma.com/1vx5stu2",
      buttonText: "View Event",
      location: "Virtual",
      detailBodyHeading: "About this session",
      detailBody: WHY_HEALTHCARE_SAYS_NO_DETAIL_BODY,
    },
    {
      slug: "ask-a-qms-expert",
      title: "Ask a QMS Expert",
      dateTime: "Thursday, February 19, 2025 — 12:00 PM EST",
      person: "QMS Expert Panel • Company event",
      imageSrc: "/images/events-askQMS.avif",
      href: "https://luma.com/w61qj0g5",
      buttonText: "View Event",
      location: "Virtual",
      detailBodyHeading: "About this session",
      detailBody: ASK_QMS_EXPERT_DETAIL_BODY,
    },
    {
      slug: "set-your-stage",
      title: "Set Your Stage",
      dateTime: "Thursday, December 4, 2025 — 12:00 PM EST",
      person: "Alexis Orchard • Orchard Presents",
      imageSrc: "/images/events-setYourStage.avif",
      href: "https://luma.com/5s736thc",
      buttonText: "View Event",
      location: "Virtual",
      detailBodyHeading: "About this session",
      detailBody: SET_YOUR_STAGE_DETAIL_BODY,
    },
    {
      slug: "clinician-connect-womens-health",
      title: "Clinician Connect: Women's Health",
      dateTime: "Thursday, November 20, 2025 — 12:00 PM EST",
      person: "Rellia Health • Company event",
      imageSrc: "/images/events-clinicianConnect.avif",
      href: "https://luma.com/k6fbogr8",
      buttonText: "View Event",
      location: "Virtual",
      detailBodyHeading: "About this session",
      detailBody: CLINICIAN_CONNECT_WOMENS_HEALTH_DETAIL_BODY,
    },
    {
      slug: "scaling-with-purpose-from-prototype-to-customer-in-health-startups",
      title: "Scaling with Purpose: From Prototype to Customer in Health Startups",
      dateTime: "Thursday, November 13, 2025 — 12:00 PM EST",
      person: "Rellia Health • Company event",
      imageSrc: "/images/events-scalingPurpose.avif",
      buttonText: "View Event",
      location: "Virtual",
      detailBodyHeading: "About this session",
      detailBody: SCALING_WITH_PURPOSE_DETAIL_BODY,
    },
    {
      slug: "beyond-the-product-how-digital-health-brands-earn-trust-and-drive-growth",
      title: "Beyond the Product: How digital health brands earn trust and drive growth",
      dateTime: "Thursday, October 23, 2025 — 12:00 PM EDT",
      person: "Rellia Health • Company event",
      imageSrc: "/images/events-beyondProduct.avif",
      buttonText: "View Event",
      location: "Virtual",
      detailBodyHeading: "About this session",
      detailBody: BEYOND_THE_PRODUCT_DETAIL_BODY,
    },
    {
      slug: "rellia-pitch-event-forum-ventures",
      title: "Rellia Pitch Event: Forum Ventures",
      dateTime: "Thursday, October 16, 2025 — 12:30 PM EDT",
      person: "Rellia Health • Company event",
      imageSrc: "/images/Relliapitchevent.avif",
      buttonText: "View Event",
      location: "Virtual",
      detailBodyHeading: "About this session",
      detailBody: RELLIA_PITCH_EVENT_FORUM_DETAIL_BODY,
    },
    {
      slug: "ethics-in-ai-less-about-tech-more-about-humans",
      title: "Ethics in AI: Less About Tech, More About Humans",
      dateTime: "Thursday, September 11, 2025 — 2:00 PM EDT",
      person: "Rellia Health • Waterloo Tech Week",
      imageSrc: "/images/events-ethicsinAi.avif",
      buttonText: "View Event",
      location: "Virtual",
      detailBodyHeading: "About this session",
      detailBody: ETHICS_IN_AI_DETAIL_BODY,
    },
    {
      slug: "second-opinion-when-healthcare-startups-need-user-research",
      title: "Second Opinion: When Healthcare Startups Need User Research",
      dateTime: "Thursday, August 14, 2025 — 1:00 PM EDT",
      person: "Rellia Health • Company event",
      imageSrc: "/images/events-secondOpinion.avif",
      buttonText: "View Event",
      location: "Virtual",
      detailBodyHeading: "About this session",
      detailBody: SECOND_OPINION_USER_RESEARCH_DETAIL_BODY,
    },
  ],
  ctaTitle: "Want the full experience?",
  ctaBody:
    "Rellia members get access to all event recordings, program discounts, and individual mentorship.",
  ctaButtonLabel: "Apply to join",
  ctaButtonHref: "/apply",
}

export const DEFAULT_CONTACT_PAGE: ContactPageContent = {
  sideImageSrc: "/health_tech_collaboration_1778023064936.png",
  sideImageAlt: "Rellia contact — team and collaboration",
  leftLogoImageSrc: "/images/hologram-logo.png",
  quotePersonImageSrc: "/images/megan-headshot.jpeg",
  quoteText:
    "We meet health tech founders where they’re at, surrounding them with people who get it and get them",
  quoteAttributionName: "Megan Kane",
  quoteAttributionRole: "Executive Director",
  footerEmail: "hello@relliahealth.com",
  successTitle: "Message sent",
  successBody: "Thanks for reaching out. We'll be in touch shortly.",
  labels: {
    firstName: "First Name",
    lastName: "Last Name",
    email: "E-mail Address",
    phone: "Phone",
    companyName: "Company Name",
    jobTitle: "Job Title",
    companySize: "Company Size",
    subject: "Subject",
    message: "Your Message",
  },
  placeholders: {
    firstName: "Jane",
    lastName: "Doe",
    email: "you@company.com",
    phone: "+1 (555) 000-0000",
    companyName: "Your company",
    jobTitle: "Your role",
    message: "Tell us what you're looking for…",
  },
  subjectPlaceholder: "Please Select",
  companySizePlaceholder: "Please Select",
  subjectOptions: [
    { value: "general", label: "General inquiry" },
    { value: "programs", label: "Programs" },
    { value: "partnerships", label: "Partnerships" },
    { value: "careers", label: "Careers" },
    { value: "media", label: "Media" },
    { value: "other", label: "Other" },
  ],
  companySizeOptions: [
    { value: "1-10", label: "1–10" },
    { value: "11-50", label: "11–50" },
    { value: "51-200", label: "51–200" },
    { value: "201-500", label: "201–500" },
    { value: "501+", label: "501+" },
    { value: "unsure", label: "Prefer not to say" },
  ],
  submitLabel: "Submit",
  sendingLabel: "Sending…",
}

/** Stripe Payment Link fallback for `/membership` when checkout session env is not configured */
export const DEFAULT_STRIPE_PAYMENT_LINK_FALLBACK = "https://buy.stripe.com/14A4gs2jF6Lla0HgCC6wE03"

export const DEFAULT_QMS_PROGRAM: QmsProgramContent = {
  paymentUrl: "https://forms.fillout.com/t/1GPWpbBbWcus",
  heroTitle: "Build Your Quality Management System",
  heroDescription:
    "A simplified, mentor-led program that helps medical device founders build an audit-ready Quality Management System - without needing a background in regulatory affairs",
  heroCtaLabel: "Get started",
  outcomesTitle: "Program Outcomes",
  outcomesIntro:
    "By the end of this program, you will have a complete quality management system. A well-designed QMS enables your company to:",
  outcomes: [
    "A compliant Quality Management System tailored to your product classification",
    "Pass regulator audits and inspections",
    "Demonstrate a critical early milestone to investors",
    "Execute business operations more efficiently",
    "Gain customer trust and competitive advantage",
  ],
  howItWorksTitle: "How It Works",
  howItWorksIntro:
    "Each week, you will receive the following guidance to ensure your success throughout the program.",
  pillarsTitle: "Program Pillars",
  timelineTitle: "Program Timeline & Details",
  timelineSubtitle: "A structured journey through the key requirements for a successful QMS",
  pricingBadge: "Monthly subscription",
  pricingAmount: "$2000",
  pricingDiscountEnabled: true,
  pricingCompareAmount: "$3,000",
  pricingSubAmount: ".00",
  pricingDescription:
    "Join the only program designed to help you implement an audit-ready Quality Management System without the headaches.",
  pricingBullets: [
    "Pause or cancel at any time.",
    "Weekly consultations",
    "Instructional content",
    "Frameworks & templates",
  ],
  bottomCtaTitle: "Let's Build Your QMS",
  bottomCtaBody:
    "Still have questions or want to learn more about the program? Reach out at any time to speak with us directly.",
  bottomCtaButtonLabel: "Contact",
  bottomContactHref: "/contact",
  testimonials: [
    {
      name: "Dr Stevie Foglia",
      role: "Founder & CEO",
      company: "Neuro-Mod",
      image: "/images/drstrevie.png",
      quote:
        "The QMS fits seamlessly within our workflows and is directly personalized to our company and product. Rellia has been excellent to work with - they are true experts in their field.",
    },
    {
      name: "Ibukun Elebute",
      role: "Founder & COO",
      company: "Cellect",
      image: "/images/ibukun.jpg",
      quote:
        "The Rellia QMS program was practical and startup-friendly, the process was easy to follow, and the support helped us understand not just what needed to be done, but how to do it properly.",
    },
    {
      name: "Rooaa Shanshal",
      role: "Co-Founder",
      company: "Power of Play",
      image: "/images/testimonials-rooaaS.jpeg",
      quote:
        "Since joining, we've made real progress on building our QMS which is something that previously felt overwhelming.",
    },
  ],
}

/** Fields used by `client/pages/Payment.tsx` — matches Studio membership schema. */
export const DEFAULT_PAYMENT_PAGE: PaymentPageContent = {
  badge: "",
  headline: "",
  introCheckout: "",
  introFallback: "",
  introFallbackError: "",
  benefitsTitle: "Join the Rellia Health Network",
  benefits: [
    "Personalized warm introductions to the right investors, partners, and clinicians",
    "Healthcare industry templates and resources ready to use in your business",
    "Exclusive workshops, webinars, and networking events with industry leaders",
    "Access to advisory consulting that would cost >$300/hr anywhere else",
    "Cancel any time — no long-term commitment required",
  ],
  successTitle: "",
  successBody: "",
  discountBannerEnabled: true,
  discountBannerBadge: "LIMITED OFFER",
  discountBannerTitle:
    "Founding members get 50% off your first purchase — use code RELLIA50",
  discountBannerSubtitle: "",
  discountBannerApplyLabel: "Apply code",
  discountBannerApplyHref: "",
  pricingMonthlyBadge: "",
  pricingAnnualBadge: "",
  pricingMonthlyAmount: "$30",
  pricingAnnualAmount: "$25",
  pricingMonthlyDiscountEnabled: false,
  pricingMonthlyCompareAmount: "$50",
  pricingAnnualDiscountEnabled: false,
  pricingAnnualCompareAmount: "$40",
  benefitsPanelHeadline: "Join the network today",
  choosePlanHeadline: "Choose your plan",
  promoPillEnabled: true,
  promoMessage:
    "Founding members get 50% off first purchase using code {code}",
  pricingPerSuffix: "",
  popularLabel: "",
  monthlyProceedLabel: "Proceed to payment",
  annualProceedLabel: "Proceed to payment",
  questionsTitle: "Questions about membership?",
  questionsBody:
    "Have questions about the membership, billing, or benefits? We're here to help you get the most out of the Rellia network.",
  questionsFaqLabel: "View FAQ",
  questionsFaqPath: "/faq",
  questionsContactLabel: "Contact us",
  questionsContactPath: "/contact",
}

export const DEFAULT_APPLY_PAGE: ApplyPageContent = {
  headingTitle: "Path to Membership",
  subheading:
    "What happens after you apply—from submission to joining—and tailored links below if you want more detail for your role before you hear back.",
  steps: [
    {
      title: "Submit Application",
      description:
        "Complete the application. Our team reviews every submission to keep the network valuable for every member.",
    },
    {
      title: "Review & Approval",
      description:
        "We'll review your background and goals. You'll hear from us by email within a few business days.",
    },
    {
      title: "Secure Your Spot",
      description:
        "Once approved, you'll get a link to choose your membership and complete payment.",
    },
    {
      title: "Join the Network",
      description: "Get immediate access to the community, resources, and network benefits.",
    },
  ],
  showRoleLinks: true,
  roleLinks: [
    {
      title: "Founders",
      description: "Programs, cohorts, and support for health tech builders.",
      href: "/founders",
    },
    {
      title: "Advisors",
      description: "How we work with operators, clinicians, and domain experts.",
      href: "/advisors",
    },
    {
      title: "Investors",
      description: "Deal flow, diligence, and how we connect capital to the network.",
      href: "/investors",
    },
    {
      title: "Industry partners",
      description: "Collaboration models for organizations backing the ecosystem.",
      href: "/industry-partners",
    },
  ],
  applyButtonLabel: "Apply Now",
  bottomCtaTitle: "Explore the Rellia network",
  bottomCtaBody:
    "See how members connect across programs, partners, and resources—or get in touch with questions about membership.",
  bottomCtaPrimaryLabel: "Explore programs",
  bottomCtaPrimaryHref: "/programs",
  bottomCtaSecondaryLabel: "Contact us",
  bottomCtaSecondaryHref: "/contact",
}

export const DEFAULT_NOT_FOUND: NotFoundContent = {
  title: "Page not found",
  message: "The page you're looking for doesn't exist or has been moved.",
  ctaLabel: "Back to home",
}

export const DEFAULT_MARKETING_PLACEHOLDER: MarketingPageContent = {
  title: "Coming soon",
  subtitle: "This page is currently under development. Stay tuned for the full Rellia Health experience!",
}

export function mergeGlobalSettings(
  partial: Partial<GlobalSettingsContent> | null | undefined,
): GlobalSettingsContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<GlobalSettingsContent>
  const base = { ...DEFAULT_GLOBAL_SETTINGS, ...p }
  if (
    typeof base.announcementText === "string" &&
    base.announcementText.trim() &&
    p.announcementEnabled !== false
  ) {
    base.announcementEnabled = true
  }
  const priorityPrimaryLabel = normalizeCmsCtaField(base.priorityModalButtonLabel)
  const prioritySecondaryLabel = normalizeCmsCtaField(base.priorityModalSecondaryButtonLabel)
  const prioritySecondaryLink = normalizeCmsCtaField(base.priorityModalSecondaryButtonLink)
  if (base.priorityModalEnabled && !priorityPrimaryLabel && !prioritySecondaryLabel) {
    base.priorityModalFormEnabled = true
  }
  if (partial != null) {
    const rawSecondaryLabel = normalizeCmsCtaField(partial.priorityModalSecondaryButtonLabel)
    const rawSecondaryLink = normalizeCmsCtaField(partial.priorityModalSecondaryButtonLink)
    if (!rawSecondaryLabel || !rawSecondaryLink) {
      base.priorityModalSecondaryButtonLabel = ""
      base.priorityModalSecondaryButtonLink = ""
    }
  } else if (!prioritySecondaryLabel || !prioritySecondaryLink) {
    base.priorityModalSecondaryButtonLabel = ""
    base.priorityModalSecondaryButtonLink = ""
  }
  return base
}

const mergePathsCards = (fromCms: HomePathsCard[] | null | undefined): HomePathsCard[] => {
  const byRole = new Map<HomePathsCard["roleId"], HomePathsCard>()
  for (const card of compactList(fromCms)) {
    if (card?.roleId) byRole.set(card.roleId, card)
  }
  return DEFAULT_HOME_PATHS_CARDS.map((defaultCard) => {
    const cms = byRole.get(defaultCard.roleId)
    if (!cms) return defaultCard
    return {
      ...defaultCard,
      ...cms,
      roleId: defaultCard.roleId,
      tagLabel: cms.tagLabel?.trim() || defaultCard.tagLabel,
      title: cms.title?.trim() || defaultCard.title,
      subtitle: cms.subtitle?.trim() || defaultCard.subtitle,
      imageSrc: cms.imageSrc?.trim() || defaultCard.imageSrc,
      imageAlt: cms.imageAlt?.trim() || defaultCard.imageAlt,
      ctaLabel: cms.ctaLabel?.trim() || defaultCard.ctaLabel,
      ctaTo: cms.ctaTo?.trim() || defaultCard.ctaTo,
    }
  })
}

const mergeWhyFeatures = (
  fromCms: HomeWhyFeature[] | null | undefined,
): HomeWhyFeature[] =>
  DEFAULT_HOME_PAGE.whyFeatures.map((defaultFeature, index) => {
    const cmsFeature = compactList(fromCms)[index]
    if (!cmsFeature) return defaultFeature

    return {
      ...defaultFeature,
      ...cmsFeature,
      iconKey: cmsFeature.iconKey?.trim() || defaultFeature.iconKey,
      title: cmsFeature.title?.trim() || defaultFeature.title,
      description: cmsFeature.description?.trim() || defaultFeature.description,
      buttonLabel: cmsFeature.buttonLabel?.trim() || defaultFeature.buttonLabel,
      buttonPath: cmsFeature.buttonPath?.trim() || defaultFeature.buttonPath,
      imageSrc: cmsFeature.imageSrc?.trim() || defaultFeature.imageSrc,
    }
  })

const mergeHowItWorksSteps = (
  fromCms: HomePageContent["howItWorksSteps"] | null | undefined,
): HomePageContent["howItWorksSteps"] =>
  DEFAULT_HOME_PAGE.howItWorksSteps!.map((defaultStep, index) => {
    const cmsStep = compactList(fromCms)[index]
    if (!cmsStep) return defaultStep

    return {
      ...defaultStep,
      ...cmsStep,
      iconKey: cmsStep.iconKey?.trim() || defaultStep.iconKey,
      title: cmsStep.title?.trim() || defaultStep.title,
      description: cmsStep.description?.trim() || defaultStep.description,
    }
  })

export function mergeHomePage(partial: Partial<HomePageContent> | null | undefined): HomePageContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<HomePageContent>
  const base = { ...DEFAULT_HOME_PAGE, ...p }
  const metrics = compactList(p.metrics)
  base.metrics = metrics.length > 0 ? metrics : DEFAULT_HOME_PAGE.metrics
  base.whyFeatures = mergeWhyFeatures(p.whyFeatures)
  if (!base.whySectionTitle?.trim()) {
    base.whySectionTitle = DEFAULT_HOME_PAGE.whySectionTitle
  }
  if (!base.whySectionDescription?.trim()) {
    base.whySectionDescription = DEFAULT_HOME_PAGE.whySectionDescription
  }
  if (!base.howItWorksSectionTitle?.trim()) {
    base.howItWorksSectionTitle = DEFAULT_HOME_PAGE.howItWorksSectionTitle
  }
  if (!base.howItWorksSectionDescription?.trim()) {
    base.howItWorksSectionDescription = DEFAULT_HOME_PAGE.howItWorksSectionDescription
  }
  base.howItWorksSteps = mergeHowItWorksSteps(p.howItWorksSteps)
  const testimonials = compactList(p.testimonials)
  base.testimonials = testimonials.length > 0 ? testimonials : DEFAULT_HOME_PAGE.testimonials
  base.pathsCards = mergePathsCards(p.pathsCards)
  if (!base.pathsTitle?.trim()) {
    base.pathsTitle = DEFAULT_HOME_PAGE.pathsTitle
  }
  if (!Array.isArray(base.testimonialsTitlePortable) || base.testimonialsTitlePortable.length === 0) {
    base.testimonialsTitlePortable = DEFAULT_HOME_PAGE.testimonialsTitlePortable
  }
  return base
}

export function mergeAboutPage(partial: Partial<AboutPageContent> | null | undefined): AboutPageContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<AboutPageContent>
  const base = { ...DEFAULT_ABOUT_PAGE, ...p }
  const missionParagraphs = compactList(p.missionParagraphs)
  base.missionParagraphs =
    missionParagraphs.length > 0 ? missionParagraphs : DEFAULT_ABOUT_PAGE.missionParagraphs
  const values = compactList(p.values)
  base.values = values.length > 0 ? values : DEFAULT_ABOUT_PAGE.values
  const team = compactList(p.team)
  base.team = team.length > 0 ? team : DEFAULT_ABOUT_PAGE.team
  if (!Array.isArray(base.heroHeadlinePortable) || base.heroHeadlinePortable.length === 0) {
    base.heroHeadlinePortable = DEFAULT_ABOUT_PAGE.heroHeadlinePortable
  }
  return base
}

export function mergeFaqPage(partial: Partial<FaqPageContent> | null | undefined): FaqPageContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<FaqPageContent>
  const base = { ...DEFAULT_FAQ_PAGE, ...p }
  const items = compactList(p.items)
  base.items = items.length > 0 ? items : DEFAULT_FAQ_PAGE.items
  return base
}

export function mergeProgramsLanding(
  partial: Partial<ProgramsLandingContent> | null | undefined,
): ProgramsLandingContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<ProgramsLandingContent>
  const base = { ...DEFAULT_PROGRAMS_LANDING, ...p }
  const programs = compactList(p.programs).filter((program): program is ProgramsProgramCard => {
    if (typeof program !== "object" || program == null) return false

    const hasTitle = typeof program.title === "string" && program.title.trim() !== ""
    const hasDescription = typeof program.description === "string" && program.description.trim() !== ""
    const hasImageSrc = typeof program.imageSrc === "string" && program.imageSrc.trim() !== ""
    const hasButtonText = typeof program.buttonText === "string" && program.buttonText.trim() !== ""

    return hasTitle && hasDescription && hasImageSrc && hasButtonText
  })
  const sourcePrograms = programs.length > 0 ? programs : DEFAULT_PROGRAMS_LANDING.programs

  const enrichProgramPricing = (program: ProgramsProgramCard): ProgramsProgramCard => {
    if (program.href === "/programs/qms") {
      const amount = `${DEFAULT_QMS_PROGRAM.pricingAmount}${DEFAULT_QMS_PROGRAM.pricingSubAmount}`
      return {
        ...program,
        imageSrc: "/images/programs-qms.png",
        priceLabel: DEFAULT_QMS_PROGRAM.pricingBadge,
        priceAmount: amount,
        priceSuffix: "/month",
      }
    }

    return program
  }

  base.programs = sourcePrograms.map(enrichProgramPricing)
  base.upcomingEvents = DEFAULT_PROGRAMS_LANDING.upcomingEvents
  base.pastEvents = DEFAULT_PROGRAMS_LANDING.pastEvents
  if (!Array.isArray(base.heroTitlePortable) || base.heroTitlePortable.length === 0) {
    base.heroTitlePortable = DEFAULT_PROGRAMS_LANDING.heroTitlePortable
  }
  if (!base.programsSectionTitle?.trim()) {
    base.programsSectionTitle = DEFAULT_PROGRAMS_LANDING.programsSectionTitle
  }
  return base
}

export function mergeContactPage(
  partial: Partial<ContactPageContent> | null | undefined,
): ContactPageContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<ContactPageContent>
  const labelOverrides = omitNullish((p.labels ?? {}) as Record<string, unknown>) as Partial<
    ContactPageContent["labels"]
  >
  const placeholderOverrides = omitNullish((p.placeholders ?? {}) as Record<string, unknown>) as Partial<
    ContactPageContent["placeholders"]
  >
  const base: ContactPageContent = {
    ...DEFAULT_CONTACT_PAGE,
    ...p,
    labels: { ...DEFAULT_CONTACT_PAGE.labels, ...labelOverrides },
    placeholders: { ...DEFAULT_CONTACT_PAGE.placeholders, ...placeholderOverrides },
  }
  const subjectOptions = compactList(p.subjectOptions).filter(isSubjectOption)
  base.subjectOptions =
    subjectOptions.length > 0 ? subjectOptions : DEFAULT_CONTACT_PAGE.subjectOptions
  const companySizeOptions = compactList(p.companySizeOptions).filter(isSubjectOption)
  base.companySizeOptions =
    companySizeOptions.length > 0 ? companySizeOptions : DEFAULT_CONTACT_PAGE.companySizeOptions
  if (!base.quoteText?.trim()) {
    base.quoteText = DEFAULT_CONTACT_PAGE.quoteText
  }
  if (!base.quoteAttributionName?.trim()) {
    base.quoteAttributionName = DEFAULT_CONTACT_PAGE.quoteAttributionName
  }
  if (!base.quoteAttributionRole?.trim()) {
    base.quoteAttributionRole = DEFAULT_CONTACT_PAGE.quoteAttributionRole
  }
  if (!base.companySizePlaceholder?.trim()) {
    base.companySizePlaceholder = DEFAULT_CONTACT_PAGE.companySizePlaceholder
  }
  if (!base.sideImageSrc?.trim()) {
    base.sideImageSrc = DEFAULT_CONTACT_PAGE.sideImageSrc
  }
  if (!base.sideImageAlt?.trim()) {
    base.sideImageAlt = DEFAULT_CONTACT_PAGE.sideImageAlt
  }
  if (!base.leftLogoImageSrc?.trim()) {
    base.leftLogoImageSrc = DEFAULT_CONTACT_PAGE.leftLogoImageSrc
  }
  if (!base.quotePersonImageSrc?.trim()) {
    base.quotePersonImageSrc = DEFAULT_CONTACT_PAGE.quotePersonImageSrc
  }
  if (!base.footerEmail?.trim()) {
    base.footerEmail = DEFAULT_CONTACT_PAGE.footerEmail
  }
  return base
}

export function mergeQmsProgram(
  partial: Partial<QmsProgramContent> | null | undefined,
  defaultFallback: QmsProgramContent = DEFAULT_QMS_PROGRAM,
): QmsProgramContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<QmsProgramContent>
  const base = { ...defaultFallback, ...p }
  const outcomes = compactList(p.outcomes)
  base.outcomes = outcomes.length > 0 ? outcomes : defaultFallback.outcomes
  const pricingBullets = compactList(p.pricingBullets)
  base.pricingBullets =
    pricingBullets.length > 0 ? pricingBullets : defaultFallback.pricingBullets
  const testimonials = compactList(p.testimonials)
  if (testimonials.length > 0) base.testimonials = testimonials
  const pillars = compactList(p.pillars)
  if (pillars.length > 0) base.pillars = pillars
  const howItWorksCards = compactList(p.howItWorksCards)
  if (howItWorksCards.length > 0) base.howItWorksCards = howItWorksCards
  const timelineSteps = compactList(p.timelineSteps).filter((step) => Boolean(step?.title?.trim()))
  if (timelineSteps.length > 0) base.timelineSteps = timelineSteps
  if (typeof base.paymentUrl !== "string" || !base.paymentUrl.trim()) {
    base.paymentUrl = defaultFallback.paymentUrl
  }
  return base
}

export function mergePaymentPage(
  partial: Partial<PaymentPageContent> | null | undefined,
): PaymentPageContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<PaymentPageContent>
  const base = { ...DEFAULT_PAYMENT_PAGE, ...p }
  const benefits = compactList(p.benefits).filter((x): x is string => typeof x === "string" && x.trim() !== "")
  base.benefits = benefits.length > 0 ? benefits : DEFAULT_PAYMENT_PAGE.benefits
  const fill = (key: keyof PaymentPageContent, fallback: string) => {
    const v = base[key]
    if (typeof v === "string" && !v.trim()) {
      ;(base as Record<string, unknown>)[key as string] = fallback
    }
  }
  fill("badge", DEFAULT_PAYMENT_PAGE.badge)
  fill("headline", DEFAULT_PAYMENT_PAGE.headline)
  fill("introCheckout", DEFAULT_PAYMENT_PAGE.introCheckout)
  fill("introFallback", DEFAULT_PAYMENT_PAGE.introFallback)
  fill("introFallbackError", DEFAULT_PAYMENT_PAGE.introFallbackError)
  fill("benefitsTitle", DEFAULT_PAYMENT_PAGE.benefitsTitle)
  fill("successTitle", DEFAULT_PAYMENT_PAGE.successTitle)
  fill("successBody", DEFAULT_PAYMENT_PAGE.successBody)
  fill("discountBannerBadge", DEFAULT_PAYMENT_PAGE.discountBannerBadge)
  fill("discountBannerTitle", DEFAULT_PAYMENT_PAGE.discountBannerTitle)
  fill("discountBannerSubtitle", DEFAULT_PAYMENT_PAGE.discountBannerSubtitle)
  fill("discountBannerApplyLabel", DEFAULT_PAYMENT_PAGE.discountBannerApplyLabel)
  fill("discountBannerApplyHref", DEFAULT_PAYMENT_PAGE.discountBannerApplyHref)
  fill("heroSubheadline", DEFAULT_PAYMENT_PAGE.heroSubheadline)
  fill("imageCardBadge", DEFAULT_PAYMENT_PAGE.imageCardBadge)
  fill("imageCardSrc", DEFAULT_PAYMENT_PAGE.imageCardSrc)
  if (!Array.isArray(base.heroHeadlinePortable) || base.heroHeadlinePortable.length === 0) {
    base.heroHeadlinePortable = DEFAULT_PAYMENT_PAGE.heroHeadlinePortable
  }
  if (!Array.isArray(base.imageCardHeadlinePortable) || base.imageCardHeadlinePortable.length === 0) {
    base.imageCardHeadlinePortable = DEFAULT_PAYMENT_PAGE.imageCardHeadlinePortable
  }
  fill("imageCardAlt", DEFAULT_PAYMENT_PAGE.imageCardAlt)
  fill("pricingMonthlyBadge", DEFAULT_PAYMENT_PAGE.pricingMonthlyBadge)
  fill("pricingAnnualBadge", DEFAULT_PAYMENT_PAGE.pricingAnnualBadge)
  fill("pricingMonthlyAmount", DEFAULT_PAYMENT_PAGE.pricingMonthlyAmount)
  fill("pricingAnnualAmount", DEFAULT_PAYMENT_PAGE.pricingAnnualAmount)
  fill("pricingPerSuffix", DEFAULT_PAYMENT_PAGE.pricingPerSuffix)
  fill("popularLabel", DEFAULT_PAYMENT_PAGE.popularLabel)
  fill("monthlyProceedLabel", DEFAULT_PAYMENT_PAGE.monthlyProceedLabel)
  fill("annualProceedLabel", DEFAULT_PAYMENT_PAGE.annualProceedLabel)
  fill("questionsTitle", DEFAULT_PAYMENT_PAGE.questionsTitle)
  fill("questionsBody", DEFAULT_PAYMENT_PAGE.questionsBody ?? "")
  fill("questionsFaqLabel", DEFAULT_PAYMENT_PAGE.questionsFaqLabel)
  fill("questionsFaqPath", DEFAULT_PAYMENT_PAGE.questionsFaqPath)
  fill("questionsContactLabel", DEFAULT_PAYMENT_PAGE.questionsContactLabel)
  fill("questionsContactPath", DEFAULT_PAYMENT_PAGE.questionsContactPath)
  if (typeof base.discountBannerEnabled !== "boolean") {
    base.discountBannerEnabled = DEFAULT_PAYMENT_PAGE.discountBannerEnabled
  }
  if (typeof base.pricingMonthlyDiscountEnabled !== "boolean") {
    base.pricingMonthlyDiscountEnabled = DEFAULT_PAYMENT_PAGE.pricingMonthlyDiscountEnabled
  }
  if (typeof base.pricingAnnualDiscountEnabled !== "boolean") {
    base.pricingAnnualDiscountEnabled = DEFAULT_PAYMENT_PAGE.pricingAnnualDiscountEnabled
  }
  if (typeof base.promoPillEnabled !== "boolean") {
    base.promoPillEnabled = DEFAULT_PAYMENT_PAGE.promoPillEnabled
  }
  fill("benefitsPanelHeadline", DEFAULT_PAYMENT_PAGE.benefitsPanelHeadline ?? "")
  fill("choosePlanHeadline", DEFAULT_PAYMENT_PAGE.choosePlanHeadline ?? "")
  fill("promoMessage", DEFAULT_PAYMENT_PAGE.promoMessage ?? "")
  return base
}

export function mergeApplyPage(
  partial: Partial<ApplyPageContent> | null | undefined,
): ApplyPageContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<ApplyPageContent>
  const base = { ...DEFAULT_APPLY_PAGE, ...p }
  const steps = compactList(p.steps).filter(
    (s): s is ApplyPageContent["steps"][number] =>
      Boolean(s?.title?.trim() && s?.description?.trim()),
  )
  base.steps = steps.length > 0 ? steps : DEFAULT_APPLY_PAGE.steps
  if (typeof base.showRoleLinks !== "boolean") {
    base.showRoleLinks = DEFAULT_APPLY_PAGE.showRoleLinks
  }
  const roleLinks = compactList(p.roleLinks).filter(
    (link): link is NonNullable<ApplyPageContent["roleLinks"]>[number] =>
      Boolean(link?.title?.trim() && link?.description?.trim() && link?.href?.trim()),
  )
  base.roleLinks = roleLinks.length > 0 ? roleLinks : DEFAULT_APPLY_PAGE.roleLinks
  const fill = (key: keyof ApplyPageContent, fallback: string) => {
    const v = base[key]
    if (typeof v === "string" && !v.trim()) {
      ;(base as Record<string, unknown>)[key as string] = fallback
    }
  }
  fill("headingTitle", DEFAULT_APPLY_PAGE.headingTitle)
  fill("subheading", DEFAULT_APPLY_PAGE.subheading)
  fill("applyButtonLabel", DEFAULT_APPLY_PAGE.applyButtonLabel)
  fill("bottomCtaTitle", DEFAULT_APPLY_PAGE.bottomCtaTitle)
  fill("bottomCtaBody", DEFAULT_APPLY_PAGE.bottomCtaBody)
  fill("bottomCtaPrimaryLabel", DEFAULT_APPLY_PAGE.bottomCtaPrimaryLabel)
  fill("bottomCtaPrimaryHref", DEFAULT_APPLY_PAGE.bottomCtaPrimaryHref)
  fill("bottomCtaSecondaryLabel", DEFAULT_APPLY_PAGE.bottomCtaSecondaryLabel)
  fill("bottomCtaSecondaryHref", DEFAULT_APPLY_PAGE.bottomCtaSecondaryHref)
  return base
}

const DEFAULT_CONSULTING_TESTIMONIALS: TrustedMemberTestimonial[] = [
  {
    name: "Dr Stevie Foglia",
    role: "Founder & CEO",
    company: "Neuro-Mod",
    image: "/images/drstrevie.png",
    quote:
      "The QMS fits seamlessly within our workflows and is directly personalized to our company and product. Rellia has been excellent to work with - they are true experts in their field.",
  },
  {
    name: "Ibukun Elebute",
    role: "Founder & COO",
    company: "Cellect",
    image: "/images/ibukun.jpg",
    quote:
      "The Rellia QMS program was practical and startup-friendly, the process was easy to follow, and the support helped us understand not just what needed to be done, but how to do it properly.",
  },
  {
    name: "Rooaa Shanshal",
    role: "Co-Founder",
    company: "Power of Play",
    image: "/images/testimonials-rooaaS.jpeg",
    quote:
      "Being part of Rellia has been so incredibly valuable. Since joining, we've made real progress on building our QMS which is something that previously felt overwhelming.",
  },
]

export const DEFAULT_CONSULTING_PAGE: ConsultingPageContent = {
  title: "Consulting",
  heroEyebrow: "Consulting",
  heroTitle: "Founder consulting",
  heroAccentPhrase: "built for healthcare reality",
  heroSubtitle:
    "One-to-one and small-team working sessions when you need depth beyond community rhythm—regulatory, clinical, commercial, and narrative—with specialists who have shipped in health tech.",
  heroImageSrc:
    "https://images.pexels.com/photos/7088483/pexels-photo-7088483.jpeg?auto=compress&cs=tinysrgb&w=1200",
  heroPrimaryCtaLabel: "Start a conversation",
  heroPrimaryCtaHref: "/contact",
  heroSecondaryCtaLabel: "Apply for membership",
  heroSecondaryCtaHref: "/apply",
  fitTitle: "When consulting makes sense",
  fitDescription:
    "Membership gives ongoing access to community, programs, and broad intros. Consulting is for concentrated blocks of work where you need explicit outputs and senior judgment on the critical path.",
  fitBullets: [
    "You need scoped deep dives—FDA strategy, clinical evidence design, enterprise sales narrative—in focused sessions",
    "Your team wants documentation or diligence artifacts reviewed before a board or investor cycle",
    "You are navigating a pivot that touches regulatory labeling, pilot contracts, or interoperability commitments",
  ],
  fitImageSrc:
    "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200",
  servicesTitle: "Common consulting sprints",
  servicesSubtitle:
    "Four areas founders most often need concentrated working time—scoped to outputs you can reuse in diligence and execution.",
  services: [
    {
      title: "Regulatory Consulting",
      body: "Secure ISO 13485 QMS compliance and structure your FDA 510(k) or Health Canada classification label.",
      ctaLabel: "Explore regulatory",
      iconKey: "ShieldCheck",
    },
    {
      title: "Clinical Trials",
      body: "Design pre-market feasibility studies, validate investigator protocols, and organize real-world evidence.",
      ctaLabel: "Explore clinical",
      iconKey: "Stethoscope",
    },
    {
      title: "Marketing Strategy",
      body: "Refine B2B health system positioning, sharpen value proposition models, and build pilot trust.",
      ctaLabel: "Explore strategy",
      iconKey: "Megaphone",
    },
    {
      title: "Branding",
      body: "Craft a premium clinical brand identity, consistent design systems, and highly-polished GTM materials.",
      ctaLabel: "Explore branding",
      iconKey: "Palette",
    },
  ],
  testimonialsTitle: "Already trusted by Rellia members",
  testimonials: DEFAULT_CONSULTING_TESTIMONIALS,
  membershipTitle: "Membership makes consulting even more valuable",
  membershipDescription:
    "Rellia members get access to discounts and our full directory of vetted consultants—so you can move faster when a milestone becomes urgent.",
  membershipStats: [
    { label: "Member discount", value: "Up to 25% off" },
    { label: "Vetted consultants", value: "Regulatory · Clinical · GTM" },
    { label: "Fast matching", value: "Book within days" },
  ],
  membershipSavingsTitle: "Example savings",
  membershipSavingsBody:
    "A 6-hour sprint can save hundreds while keeping the same senior operator support.",
  membershipPrimaryCtaLabel: "Apply for membership",
  membershipPrimaryCtaHref: "/apply",
  membershipSecondaryCtaLabel: "Ask about consulting",
  membershipSecondaryCtaHref: "/contact",
  ctaTitle: "Not sure which path fits?",
  ctaBody: "Tell us your milestone—we'll recommend membership, consulting, or a blended rhythm.",
  ctaPrimaryLabel: "Talk to us",
  ctaPrimaryHref: "/contact",
}

export const DEFAULT_DIAGNOSTIC_LANDING_PAGE: DiagnosticLandingPageContent = {
  title: "Startup Diagnostic",
  heroBadgeLabel: "LAUNCH READINESS",
  heroTitle: "Pressure-test your startup for",
  heroAccentPhrase: "healthcare reality.",
  heroSubtitle:
    "Get an instant readiness score, surface hidden blockers across 12 domains, and unlock advisor matching when you join Rellia.",
  heroImageSrc:
    "https://images.pexels.com/photos/3825368/pexels-photo-3825368.jpeg?auto=compress&cs=tinysrgb&w=1600",
  heroPrimaryCtaLabel: "Begin Free Assessment",
  heroPrimaryCtaHref: "/diagnostic-survey",
  readinessTitle: "A complete readiness map",
  readinessDescription:
    "Most founders have a few strong domains and several hidden gaps. This diagnostic exposes the full picture so you can build with confidence.",
  readinessFeatures: [
    {
      title: "12 Scored Domains",
      description:
        "Every critical health tech domain is assessed, from clinical evidence to quality management and unit economics.",
      imageSrc:
        "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      title: "Instant Gap Analysis",
      description:
        "Identify your top 3 strengths and priority gaps instantly. Detailed reports and gap analyses are exclusive to Rellia members.",
      imageSrc:
        "https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      title: "Advisor Matching",
      description:
        "Members are automatically matched and introduced to pre-vetted advisors based on their startup's gap profile.",
      imageSrc:
        "https://images.pexels.com/photos/3182761/pexels-photo-3182761.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      title: "Founding Membership",
      description:
        "Get early access to exclusive networking sessions, peer mentorship, and dedicated resources from day one.",
      imageSrc:
        "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
  ],
  infographicTitle: "No stone left unturned",
  infographicBody:
    "We've distilled years of digital health experience into a comprehensive assessment framework that covers the entire startup lifecycle. Rellia's custom platform maps every critical domain, ensuring regulatory alignment, clinical proof, and bulletproof operational scaling.",
  infographicTopWeaknessLabel: "Regulatory Strategy",
  infographicTopWeaknessScore: 32,
  infographicGapLabel: "Critical Gap",
  infographicAdvisorMatchLabel: "Vetted Advisor Match",
  infographicAdvisorRole: "Regulatory Director",
  infographicAdvisorSubtitle: "Ex-FDA Reviewer",
  infographicBlobRoadmap: "Personalized Roadmap",
  infographicBlobAdvisors: "Matched Advisors",
  infographicBlobBlindSpot: "Blind Spot Discovery",
  timelineTitle: "Survey to insights in 15 minutes",
  timelineSubheading:
    "Four focused steps from startup context to a personalized gap profile you can act on.",
  timelineSteps: [
    {
      title: "Startup Context",
      description: "Provide high-level details about your product mission, stage, and targets.",
    },
    {
      title: "Deep Assessment",
      description: "Evaluate your status across 12 sections with zero-BS honest reflections.",
    },
    {
      title: "Score Analysis",
      description:
        "Our custom assessment framework evaluates your strengths, priority gaps, and blockers.",
    },
    {
      title: "Report Access",
      description:
        "Rellia members immediately unlock their custom diagnostic report and advisor matching.",
    },
  ],
  ctaTitle: "Benchmark your startup today",
  ctaBody:
    "Identify your blind spots, secure regulatory clarity, and discover what gets health systems to say yes.",
  ctaPrimaryLabel: "Take the Diagnostic",
  ctaPrimaryHref: "/diagnostic-survey",
  ctaSecondaryLabel: "Join as Member",
  ctaSecondaryHref: "/apply",
}

const fillString = <T extends Record<string, unknown>>(
  base: T,
  key: keyof T,
  fallback: string,
) => {
  const v = base[key]
  if (typeof v === "string" && !v.trim()) {
    ;(base as Record<string, unknown>)[key as string] = fallback
  }
}

export function mergeConsultingPage(
  partial: Partial<ConsultingPageContent> | null | undefined,
): ConsultingPageContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<ConsultingPageContent>
  const base = { ...DEFAULT_CONSULTING_PAGE, ...p }
  const services = compactList(p.services).filter((s) => Boolean(s?.title?.trim() && s?.body?.trim()))
  base.services = services.length > 0 ? services : DEFAULT_CONSULTING_PAGE.services
  const fitBullets = compactList(p.fitBullets).filter((b) => Boolean(b?.trim()))
  base.fitBullets = fitBullets.length > 0 ? fitBullets : DEFAULT_CONSULTING_PAGE.fitBullets
  const testimonials = compactList(p.testimonials).filter((t) =>
    Boolean(t?.name?.trim() && t?.quote?.trim()),
  )
  base.testimonials =
    testimonials.length > 0 ? testimonials : DEFAULT_CONSULTING_PAGE.testimonials
  const membershipStats = compactList(p.membershipStats).filter((s) =>
    Boolean(s?.label?.trim() && s?.value?.trim()),
  )
  base.membershipStats =
    membershipStats.length > 0 ? membershipStats : DEFAULT_CONSULTING_PAGE.membershipStats
  ;(
    [
      "heroEyebrow",
      "heroTitle",
      "heroAccentPhrase",
      "heroSubtitle",
      "heroPrimaryCtaLabel",
      "heroPrimaryCtaHref",
      "heroSecondaryCtaLabel",
      "heroSecondaryCtaHref",
      "fitTitle",
      "fitDescription",
      "servicesTitle",
      "servicesSubtitle",
      "testimonialsTitle",
      "membershipTitle",
      "membershipDescription",
      "membershipSavingsTitle",
      "membershipSavingsBody",
      "membershipPrimaryCtaLabel",
      "membershipPrimaryCtaHref",
      "membershipSecondaryCtaLabel",
      "membershipSecondaryCtaHref",
      "ctaTitle",
      "ctaBody",
      "ctaPrimaryLabel",
      "ctaPrimaryHref",
    ] as const
  ).forEach((key) => fillString(base, key, DEFAULT_CONSULTING_PAGE[key] as string))
  if (!base.heroImageSrc?.trim()) base.heroImageSrc = DEFAULT_CONSULTING_PAGE.heroImageSrc
  if (!base.fitImageSrc?.trim()) base.fitImageSrc = DEFAULT_CONSULTING_PAGE.fitImageSrc
  return base
}

const mergeReadinessFeatures = (
  fromCms: DiagnosticLandingPageContent["readinessFeatures"] | null | undefined,
): DiagnosticLandingPageContent["readinessFeatures"] =>
  (DEFAULT_DIAGNOSTIC_LANDING_PAGE.readinessFeatures ?? []).map((defaultFeature, index) => {
    const cmsFeature = compactList(fromCms)[index]
    if (!cmsFeature) return defaultFeature

    return {
      ...defaultFeature,
      ...cmsFeature,
      title: cmsFeature.title?.trim() || defaultFeature.title,
      description: cmsFeature.description?.trim() || defaultFeature.description,
      imageSrc: cmsFeature.imageSrc?.trim() || defaultFeature.imageSrc,
      buttonLabel: cmsFeature.buttonLabel?.trim() || defaultFeature.buttonLabel,
      buttonPath: cmsFeature.buttonPath?.trim() || defaultFeature.buttonPath,
    }
  })

export function mergeDiagnosticLandingPage(
  partial: Partial<DiagnosticLandingPageContent> | null | undefined,
): DiagnosticLandingPageContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<DiagnosticLandingPageContent>
  const base = { ...DEFAULT_DIAGNOSTIC_LANDING_PAGE, ...p }
  base.readinessFeatures = mergeReadinessFeatures(p.readinessFeatures)
  const timelineSteps = compactList(p.timelineSteps).filter((s) =>
    Boolean(s?.title?.trim() && s?.description?.trim()),
  )
  base.timelineSteps =
    timelineSteps.length > 0 ? timelineSteps : DEFAULT_DIAGNOSTIC_LANDING_PAGE.timelineSteps
  ;(
    [
      "heroBadgeLabel",
      "heroTitle",
      "heroAccentPhrase",
      "heroSubtitle",
      "heroPrimaryCtaLabel",
      "heroPrimaryCtaHref",
      "readinessTitle",
      "readinessDescription",
      "infographicTitle",
      "infographicBody",
      "infographicTopWeaknessLabel",
      "infographicGapLabel",
      "infographicAdvisorMatchLabel",
      "infographicAdvisorRole",
      "infographicAdvisorSubtitle",
      "infographicBlobRoadmap",
      "infographicBlobAdvisors",
      "infographicBlobBlindSpot",
      "timelineTitle",
      "timelineSubheading",
      "ctaTitle",
      "ctaBody",
      "ctaPrimaryLabel",
      "ctaPrimaryHref",
      "ctaSecondaryLabel",
      "ctaSecondaryHref",
    ] as const
  ).forEach((key) => fillString(base, key, DEFAULT_DIAGNOSTIC_LANDING_PAGE[key] as string))
  if (!base.heroImageSrc?.trim()) base.heroImageSrc = DEFAULT_DIAGNOSTIC_LANDING_PAGE.heroImageSrc
  if (typeof base.infographicTopWeaknessScore !== "number") {
    base.infographicTopWeaknessScore = DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicTopWeaknessScore
  }
  return base
}

export function mergeNotFound(partial: Partial<NotFoundContent> | null | undefined): NotFoundContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<NotFoundContent>
  return { ...DEFAULT_NOT_FOUND, ...p }
}

export function mergeMarketingPage(
  partial: Partial<MarketingPageContent> | null | undefined,
  fallback?: Partial<Pick<MarketingPageContent, "title" | "subtitle">>,
): MarketingPageContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<MarketingPageContent>
  const hasCmsTitle = Boolean(partial?.title && String(partial.title).trim() !== "")
  const hasCmsSubtitle = Boolean(partial?.subtitle && String(partial.subtitle).trim() !== "")
  const base = { ...DEFAULT_MARKETING_PLACEHOLDER, ...p }
  if (fallback?.title && !hasCmsTitle) {
    base.title = fallback.title
  }
  if (fallback?.subtitle && !hasCmsSubtitle) {
    base.subtitle = fallback.subtitle
  }
  return base
}
