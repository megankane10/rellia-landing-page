import {
  DEFAULT_ABOUT_HERO_LINE2_PORTABLE,
  DEFAULT_HOME_TESTIMONIALS_TITLE_PORTABLE,
  DEFAULT_PAYMENT_HERO_PORTABLE,
  DEFAULT_PAYMENT_IMAGE_CARD_HEADLINE_PORTABLE,
  DEFAULT_PROGRAMS_LANDING_HERO_PORTABLE,
} from "./inlineHeroHeadline"
import type {
  AboutPageContent,
  ContactPageContent,
  ContactSubjectOption,
  FaqPageContent,
  GlobalSettingsContent,
  HomePageContent,
  MarketingPageContent,
  NotFoundContent,
  PaymentPageContent,
  ProgramsLandingContent,
  ProgramsProgramCard,
  QmsProgramContent,
  SanityPortableText,
} from "./types"

/** Drop nullish values so `{ ...defaults, ...partial }` cannot wipe strings with CMS nulls */
const omitNullish = <T extends Record<string, unknown>>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as Partial<T>

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

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettingsContent = {
  footerTagline:
    "Rellia connects promising digital health founders with industry experts, clinicians, and engaged investors.",
  supportEmail: "hello@relliahealth.com",
  linkedinUrl: "https://www.linkedin.com/company/relliahealth",
  instagramUrl: "https://www.instagram.com/relliahealth/",
  copyrightLine: "Rellia Health. All rights reserved.",
}

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
  metricsSubheading:
    "Here is a look at the Rellia network—where health tech founders are connected with people who understand exactly what you're up against.",
  metrics: [
    { label: "Members in the Rellia community", value: 291 },
    { label: "Health tech startups", value: 81 },
    { label: "Countries around the world", value: 11 },
  ],
  howItWorksSectionTitle: "How does it work?",
  whyFeatures: [
    {
      iconKey: "target",
      title: "The Outcomes",
      description:
        "Avoid mistakes on your path to market and easily achieve your milestones through our customized programs",
    },
    {
      iconKey: "userRound",
      title: "The Advisors",
      description:
        "Access 1:1 guidance from experts with years of experience scaling health tech businesses.",
    },
    {
      iconKey: "bookOpen",
      title: "The Resources",
      description:
        "Apply tangible tools, hands-on workshops, and proven templates to move your business forward right now",
    },
    {
      iconKey: "users",
      title: "The Community",
      description:
        "Beta test your ideas, find an accountability buddy, cheer each other on, share your deepest worries. Connect with fellow health tech founders who have been through it before.",
    },
  ],
  ctaTitle: "Are you the next **Rellia Health** success story?",
  ctaButtonLabel: "Apply to Join Now",
  ctaButtonPath: "/apply",
  ctaImageUrl: "/images/cta-home-conference.webp",
  ctaImageAlt: "Man speaking at conference",
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
  heroLine1: "Empowering the",
  heroLine2Portable: DEFAULT_ABOUT_HERO_LINE2_PORTABLE,
  heroLine3: "of health tech.",
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
      imageSrc: "/images/team-megankane.jpg",
      linkedinUrl: "https://www.linkedin.com/in/megankane1/",
      websiteUrl: "https://megankaneportfolio.carrd.co/",
    },
    {
      name: "Deena Al-Sammak",
      role: "Program Manager, Co-Founder",
      bio: "Deena brings startup experience in the health tech space and leverages her experience to lead our program development and management",
      imageSrc: "/images/team-deenasammak.png",
      linkedinUrl: "https://www.linkedin.com/in/deena-al-sammak/",
    },
    {
      name: "Khali Abdi",
      role: "User Experience, Community Strategy Manager",
      bio: "A Chemical Engineer & digital health founder, Khali blends her technical background with a deep commitment to human-centred design to ensure Rellia’s ecosystem is as intuitive as it is impactful.",
      imageSrc: "/images/team-abdi.JPG",
      linkedinUrl: "https://www.linkedin.com/in/khali-abdi/",
    },
    {
      name: "Priyanka Ramjagsingh",
      role: "Operations Director",
      bio: "With a decade of experience embedded in early-stage health companies, Priyanka converts her deep regulatory and quality expertise into operational momentum, turning complexity into the strategic edge that moves teams forward.",
      imageSrc: "/images/team-priyankaR.jpeg",
      linkedinUrl: "https://www.linkedin.com/in/shyama-ramjagsingh/",
    },
    {
      name: "Kelly Hu",
      role: "Social Media Manager",
      bio: "A digital health founder herself, Kelly plans and executes content creation to boost engagement and showcase Rellia's growing network.",
      imageSrc: "/images/team-KellyH.jpeg",
      linkedinUrl: "https://www.linkedin.com/in/kellyjiayihu/",
    },
  ],
  ctaTitle: "You're in the **right** place.",
  ctaBody:
    "If you're a founder who wants to do this right, we have the network and expertise to make it happen.",
  ctaFounderLabel: "Apply to join as a founder",
  ctaTeamLabel: "Join the Rellia team",
}

export const DEFAULT_FAQ_PAGE: FaqPageContent = {
  badge: "Frequently Asked Questions",
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
  bottomTitle: "Every startup is **different**",
  bottomBody:
    "Tell us more about where you are today and where you want to be in the next 12–18 months. We'll share how Rellia can help accelerate that path, or recommend a better fit if we're not it.",
  bottomCtaLabel: "Get in Touch",
  bottomCtaPath: "/contact",
}

/** Default event card image (square AVIF). Use for all placeholder events until CMS provides per-event art. */
const DEFAULT_PROGRAMS_EVENT_IMAGE_SRC = "/images/event-leadershipUnderPressure.avif"

export const DEFAULT_PROGRAMS_LANDING: ProgramsLandingContent = {
  heroTitlePortable: DEFAULT_PROGRAMS_LANDING_HERO_PORTABLE,
  heroSubtitle:
    "Targeted programs and live events designed to help you accomplish your next milestone, not just learn about it.",
  heroPrimaryCtaLabel: "View Programs",
  heroSecondaryCtaLabel: "View Events",
  programsSectionTitle: [
    {
      _type: "block",
      style: "normal",
      _key: "programsSectionTitle",
      markDefs: [],
      children: [
        { _type: "span", _key: "t1", text: "Programming that ", marks: [] },
        { _type: "span", _key: "t2", text: "fit your startup", marks: ["mint"] },
      ],
    },
  ],
  programsSectionSubtitle:
    "Every program is built around a single, focused outcome. Spend your time on exactly what you need right now, and leave the rest for later.",
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
      href: "/programs/regulatory-roadmap",
      buttonText: "Learn more",
      waitlistHref: "https://forms.fillout.com/t/bLGtn6S2jtus",
    },
  ],
  upcomingEvents: [
    {
      slug: "clinician-connect-primary-care",
      title: "Clinician Connect: Primary Care",
      dateTime: "Thursday, July 9, 2026 — 2:00 PM EDT",
      person: "Rellia Health • Company event",
      imageSrc: "/images/events-clinicianConnectPrimaryCare.jpg",
      location: "Virtual",
      addToCalendarEnabled: true,
      calendarStartsAt: "2026-07-09T14:00:00-04:00",
      calendarEndsAt: "2026-07-09T15:00:00-04:00",
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
  ctaTitle: "Want the **full** experience?",
  ctaBody:
    "Rellia members get access to all event recordings, program discounts, and individual mentorship.",
  ctaButtonLabel: "Apply to join",
  ctaButtonHref: "/apply",
}

export const DEFAULT_CONTACT_PAGE: ContactPageContent = {
  heroBadge: "Contact",
  pageTitle: "Let's Get in Touch",
  intro:
    "Have questions or want to explore opportunities with Rellia Health?\n\nWe’re here to listen, support, and collaborate. Drop us a message!",
  sideImageSrc: "/images/hero-contact.png",
  sideImageAlt: "Rellia contact — team and collaboration",
  quoteText:
    "We meet health tech founders where they’re at, surrounding them with people who get it and get them",
  quoteAttributionName: "Megan Kane",
  quoteAttributionRole: "Executive Director",
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
  pricingSubAmount: ".00",
  pricingDescription:
    "Join the only program designed to help you implement an audit-ready Quality Management System without the headaches.",
  pricingBullets: [
    "Pause or cancel at any time.",
    "Weekly consultations",
    "Instructional content",
    "Frameworks & templates",
  ],
  bottomCtaTitle: "Let's **Build** Your QMS",
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
      logo: "/images/portfolio-neuromod.png",
      quote:
        "The QMS fits seamlessly within our workflows and is directly personalized to our company and product. Rellia has been excellent to work with - they are true experts in their field.",
    },
    {
      name: "Ibukun Elebute",
      role: "Founder & COO",
      company: "Cellect",
      image: "/images/ibukun.jpg",
      logo: "/images/cellect-logo.png",
      quote:
        "The Rellia QMS program was practical and startup-friendly, the process was easy to follow, and the support helped us understand not just what needed to be done, but how to do it properly.",
    },
  ],
}

export const DEFAULT_PAYMENT_PAGE: PaymentPageContent = {
  badge: "Rellia Health",
  headline: "You're approved for the Rellia program!",
  introCheckout: "Complete your enrollment with the secure checkout below.",
  introFallback:
    "Complete your enrollment with the secure Stripe payment page (opens in a new tab).",
  introFallbackError:
    "We couldn't load embedded checkout. Use the secure Stripe payment page below (opens in a new tab).",
  benefitsTitle: "Join the Rellia Health Network",
  benefits: [
    "Personalized warm introductions to the right investors, partners, and clinicians",
    "Healthcare industry templates and resources ready to use in your business",
    "Exclusive workshops, webinars, and networking events with industry leaders",
    "Access to advisory consulting that would cost >$300/hr anywhere else",
    "Cancel any time — no long-term commitment required",
  ],
  successTitle: "Payment received",
  successBody:
    "Thank you — your enrollment payment went through. We'll be in touch with next steps.",
  discountBannerEnabled: false,
  discountBannerBadge: "LIMITED OFFER",
  discountBannerTitle:
    "Founding members get 50% off your first purchase — use code RELLIA50",
  discountBannerSubtitle: "",
  discountBannerApplyLabel: "Apply code",
  discountBannerApplyHref: "",
  heroHeadlinePortable: DEFAULT_PAYMENT_HERO_PORTABLE,
  heroSubheadline:
    "Where founders, mentors, investors, and clinicians build the future of healthcare — together.",
  imageCardBadge: "The benefits",
  imageCardHeadlinePortable: DEFAULT_PAYMENT_IMAGE_CARD_HEADLINE_PORTABLE,
  imageCardSrc: "/images/cta-home-conference.webp",
  imageCardAlt: "Healthcare community event space",
  highlightBenefits: [
    "Find investors who are excited about your healthcare",
    "Get feedback directly from clinicians and patients",
    "Secure placement in hospital pilot programs",
    "Partner with digital health industry leaders",
  ],
  pricingMonthlyBadge: "Monthly membership",
  pricingAnnualBadge: "Annual membership",
  pricingMonthlyAmount: "$30",
  pricingAnnualAmount: "$25",
  pricingPerSuffix: "/month",
  popularLabel: "POPULAR",
  monthlyProceedLabel: "Proceed to payment",
  annualProceedLabel: "Proceed to payment",
  questionsTitle: "Questions before getting started?",
  questionsFaqLabel: "See Frequently Asked Questions",
  questionsFaqPath: "/faq",
  questionsContactLabel: "Get in Touch",
  questionsContactPath: "/contact",
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
  return { ...DEFAULT_GLOBAL_SETTINGS, ...p }
}

export function mergeHomePage(partial: Partial<HomePageContent> | null | undefined): HomePageContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<HomePageContent>
  const base = { ...DEFAULT_HOME_PAGE, ...p }
  const metrics = compactList(p.metrics)
  base.metrics = metrics.length > 0 ? metrics : DEFAULT_HOME_PAGE.metrics
  const whyFeatures = compactList(p.whyFeatures)
  base.whyFeatures = whyFeatures.length > 0 ? whyFeatures : DEFAULT_HOME_PAGE.whyFeatures
  const testimonials = compactList(p.testimonials)
  base.testimonials = testimonials.length > 0 ? testimonials : DEFAULT_HOME_PAGE.testimonials
  const pathsCards = compactList(p.pathsCards)
  if (pathsCards.length > 0) base.pathsCards = pathsCards
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
  if (!Array.isArray(base.heroLine2Portable) || base.heroLine2Portable.length === 0) {
    base.heroLine2Portable = DEFAULT_ABOUT_PAGE.heroLine2Portable
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
  const upcomingEvents = compactList(p.upcomingEvents)
  base.upcomingEvents =
    upcomingEvents.length > 0 ? upcomingEvents : DEFAULT_PROGRAMS_LANDING.upcomingEvents
  const pastEvents = compactList(p.pastEvents)
  base.pastEvents = pastEvents.length > 0 ? pastEvents : DEFAULT_PROGRAMS_LANDING.pastEvents
  if (!Array.isArray(base.heroTitlePortable) || base.heroTitlePortable.length === 0) {
    base.heroTitlePortable = DEFAULT_PROGRAMS_LANDING.heroTitlePortable
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
  if (!base.heroBadge?.trim()) {
    base.heroBadge = DEFAULT_CONTACT_PAGE.heroBadge
  }
  if (!base.sideImageSrc?.trim()) {
    base.sideImageSrc = DEFAULT_CONTACT_PAGE.sideImageSrc
  }
  if (!base.sideImageAlt?.trim()) {
    base.sideImageAlt = DEFAULT_CONTACT_PAGE.sideImageAlt
  }
  return base
}

export function mergeQmsProgram(
  partial: Partial<QmsProgramContent> | null | undefined,
): QmsProgramContent {
  const p = omitNullish((partial ?? {}) as Record<string, unknown>) as Partial<QmsProgramContent>
  const base = { ...DEFAULT_QMS_PROGRAM, ...p }
  const outcomes = compactList(p.outcomes)
  base.outcomes = outcomes.length > 0 ? outcomes : DEFAULT_QMS_PROGRAM.outcomes
  const pricingBullets = compactList(p.pricingBullets)
  base.pricingBullets =
    pricingBullets.length > 0 ? pricingBullets : DEFAULT_QMS_PROGRAM.pricingBullets
  const testimonials = compactList(p.testimonials)
  if (testimonials.length > 0) base.testimonials = testimonials
  if (typeof base.paymentUrl !== "string" || !base.paymentUrl.trim()) {
    base.paymentUrl = DEFAULT_QMS_PROGRAM.paymentUrl
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
  const highlightBenefits = compactList(p.highlightBenefits).filter(
    (x): x is string => typeof x === "string" && x.trim() !== "",
  )
  base.highlightBenefits =
    highlightBenefits.length > 0 ? highlightBenefits : DEFAULT_PAYMENT_PAGE.highlightBenefits
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
  fill("questionsFaqLabel", DEFAULT_PAYMENT_PAGE.questionsFaqLabel)
  fill("questionsFaqPath", DEFAULT_PAYMENT_PAGE.questionsFaqPath)
  fill("questionsContactLabel", DEFAULT_PAYMENT_PAGE.questionsContactLabel)
  fill("questionsContactPath", DEFAULT_PAYMENT_PAGE.questionsContactPath)
  if (typeof base.discountBannerEnabled !== "boolean") {
    base.discountBannerEnabled = DEFAULT_PAYMENT_PAGE.discountBannerEnabled
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
