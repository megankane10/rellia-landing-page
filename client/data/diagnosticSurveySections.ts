export type DiagnosticSurveyOption = {
  label: string
  desc: string
  score: number
}

export type DiagnosticSurveyQuestion = {
  text: string
  type: "confidence" | "progress" | "applicability" | "knowledge"
  options: DiagnosticSurveyOption[]
}

export type DiagnosticSurveySection = {
  id: string
  icon: string
  title: string
  desc: string
  questions: DiagnosticSurveyQuestion[]
}

export const DIAGNOSTIC_SURVEY_SECTIONS: DiagnosticSurveySection[] = [
  {
    id: "product_design",
    icon: "✦",
    title: "Product Design & UI/UX",
    desc: "How well do you understand who you're building for and whether your product actually works for them?",
    questions: [
      {
        text: "How well do you understand the real-world workflow your product replaces or disrupts?",
        type: "confidence",
        options: [
          {
            label: "We haven't mapped this yet",
            desc: "Still focused on building the product itself",
            score: 0,
          },
          {
            label: "We have a general sense of it",
            desc: "Based on assumptions or desk research",
            score: 33,
          },
          {
            label: "We've mapped it with input from users",
            desc: "We've observed or interviewed people in that workflow",
            score: 67,
          },
          {
            label: "We know it deeply",
            desc: "Every handoff, pain point, and workaround — in detail",
            score: 100,
          },
        ],
      },
      {
        text: "What's the current state of your usability testing?",
        type: "progress",
        options: [
          {
            label: "We haven't done any yet",
            desc: "Testing is on the roadmap but hasn't happened",
            score: 0,
          },
          {
            label: "We've done informal testing",
            desc: "Friends, colleagues, or a couple of early users",
            score: 33,
          },
          {
            label: "We've tested with real target users",
            desc: "People who match our intended user profile",
            score: 67,
          },
          {
            label: "We test regularly and act on findings",
            desc: "Usability is an ongoing part of our development cycle",
            score: 100,
          },
        ],
      },
      {
        text: "Have you separately interviewed your primary user, economic buyer, and decision-maker?",
        type: "knowledge",
        options: [
          {
            label: "I'm not sure these are different people for us",
            desc: "We haven't thought through these roles yet",
            score: 0,
          },
          {
            label: "We've only spoken to one of these groups",
            desc: "Usually the end user, not the buyer or approver",
            score: 25,
          },
          {
            label: "We've spoken to two of the three",
            desc: "Some gaps remain in our stakeholder understanding",
            score: 67,
          },
          {
            label: "Yes — all three, and we understand each perspective",
            desc: "We know how their priorities align and conflict",
            score: 100,
          },
        ],
      },
      {
        text: "Do you have documented usability requirements separate from functional requirements?",
        type: "progress",
        options: [
          {
            label: "No — we don't have formal requirements yet",
            desc: "Everything is still informal",
            score: 0,
          },
          {
            label: "We have functional requirements but not usability ones",
            desc: "We know what it needs to do, not how it needs to feel",
            score: 33,
          },
          {
            label: "We're working on this",
            desc: "Partially documented or in progress",
            score: 67,
          },
          {
            label: "Yes — both documented and maintained",
            desc: "We treat usability as a first-class requirement",
            score: 100,
          },
        ],
      },
      {
        text: "How independently can a new user onboard with your product today?",
        type: "confidence",
        options: [
          {
            label: "They can't — we walk everyone through it",
            desc: "Onboarding requires our direct involvement",
            score: 0,
          },
          {
            label: "They can start but often get stuck",
            desc: "We get a lot of the same questions",
            score: 33,
          },
          {
            label: "Most users can onboard without help",
            desc: "Occasional edge cases need support",
            score: 67,
          },
          {
            label: "Fully self-serve — and we've validated this",
            desc: "We've watched real users onboard without guidance",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "product_dev",
    icon: "◈",
    title: "Product Development",
    desc: "How structured and traceable is your development process?",
    questions: [
      {
        text: "What's the current state of your product requirements documentation?",
        type: "progress",
        options: [
          {
            label: "It's all in our heads right now",
            desc: "Nothing formally written down",
            score: 0,
          },
          {
            label: "We have informal notes or a shared doc",
            desc: "Not structured, but something exists",
            score: 33,
          },
          {
            label:
              "We have defined requirements, but they lag behind what we've built",
            desc: "Documentation isn't always current",
            score: 67,
          },
          {
            label: "Requirements are documented, versioned, and up to date",
            desc: "We maintain them as a living reference",
            score: 100,
          },
        ],
      },
      {
        text: "How well does your version control connect requirements, code, and testing?",
        type: "progress",
        options: [
          {
            label: "We don't have version control in place yet",
            desc: "No formal process connecting these three",
            score: 0,
          },
          {
            label: "We use version control for code only",
            desc: "Requirements and tests aren't connected",
            score: 33,
          },
          {
            label: "We're working toward a connected system",
            desc: "Improving but still some gaps",
            score: 67,
          },
          {
            label: "All three are versioned and traceable to each other",
            desc: "Any feature can be traced from requirement to test result",
            score: 100,
          },
        ],
      },
      {
        text: "How do you manage changes to requirements once development has started?",
        type: "knowledge",
        options: [
          {
            label: "We just talk about them and update the code",
            desc: "Informal change management",
            score: 0,
          },
          {
            label: "We update docs but don't always track the why",
            desc: "Documentation updates without rationale",
            score: 33,
          },
          {
            label: "We have a process but it's occasionally bypassed",
            desc: "Formal process exists but lacks discipline",
            score: 67,
          },
          {
            label: "Formal change control — impacts are assessed before coding",
            desc: "Changes are deliberate and documented",
            score: 100,
          },
        ],
      },
      {
        text: "How do you ensure that all requirements have been tested before a release?",
        type: "progress",
        options: [
          {
            label: "We test what we think is important",
            desc: "Ad-hoc testing approach",
            score: 0,
          },
          {
            label: "We have a checklist of major features",
            desc: "High-level validation",
            score: 33,
          },
          {
            label: "We map tests to requirements manually",
            desc: "Better coverage but prone to error",
            score: 67,
          },
          {
            label: "Full traceability matrix from requirements to test results",
            desc: "Complete confidence in coverage",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "clinical",
    icon: "✚",
    title: "Clinical Evidence",
    desc: "Is your product's value grounded in clinical reality?",
    questions: [
      {
        text: "How clearly have you defined the clinical endpoints your product aims to impact?",
        type: "confidence",
        options: [
          {
            label: "We have a general idea but nothing specific",
            desc: "End-goals are vague",
            score: 0,
          },
          {
            label: "We know our main goal but haven't defined metrics",
            desc: "Directional but not measurable",
            score: 33,
          },
          {
            label: "We have specific, measurable clinical endpoints defined",
            desc: "Clear metrics for success",
            score: 67,
          },
          {
            label: "Endpoints are defined and validated with clinical experts",
            desc: "Rigorous, expert-backed targets",
            score: 100,
          },
        ],
      },
      {
        text: "What is your plan for clinical validation?",
        type: "progress",
        options: [
          {
            label: "We haven't started planning this yet",
            desc: "Validation is a future concern",
            score: 0,
          },
          {
            label: "We know we need a study but don't have a protocol",
            desc: "Concept exists without a plan",
            score: 33,
          },
          {
            label: "We have a draft clinical evaluation plan (CEP)",
            desc: "Planning is underway",
            score: 67,
          },
          {
            label: "Protocol is finalised and we're preparing for execution",
            desc: "Ready to begin formal validation",
            score: 100,
          },
        ],
      },
      {
        text: "How well does your current product data support your clinical claims?",
        type: "confidence",
        options: [
          {
            label: "We haven't collected data for claims yet",
            desc: "No evidence base yet",
            score: 0,
          },
          {
            label: "We have some pilot data but it's limited",
            desc: "Early signal only",
            score: 33,
          },
          {
            label: "We have strong pilot or real-world data",
            desc: "Good evidence for our claims",
            score: 67,
          },
          {
            label: "We have peer-reviewed or pivotal study data",
            desc: "Decision-grade evidence",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "regulatory",
    icon: "◎",
    title: "Regulatory Strategy",
    desc: "Do you have a clear path through the regulatory maze?",
    questions: [
      {
        text: "How certain are you of your product's regulatory classification?",
        type: "confidence",
        options: [
          {
            label: "We haven't looked into this yet",
            desc: "Regulatory status is unknown",
            score: 0,
          },
          {
            label: "We have an idea but haven't confirmed it",
            desc: "Internal assumption only",
            score: 33,
          },
          {
            label: "We've had an initial assessment by an expert",
            desc: "Professional opinion obtained",
            score: 67,
          },
          {
            label: "We have formal confirmation or a very clear path",
            desc: "Classification is certain",
            score: 100,
          },
        ],
      },
      {
        text: "What is the status of your Quality Management System (QMS)?",
        type: "progress",
        options: [
          {
            label: "We don't have a QMS yet",
            desc: "No formal quality structure",
            score: 0,
          },
          {
            label: "We have some SOPs but not a full system",
            desc: "Fragmented quality processes",
            score: 33,
          },
          {
            label: "QMS is mostly implemented and we're using it",
            desc: "Operational quality system",
            score: 67,
          },
          {
            label: "Full QMS implemented and ready for audit/certification",
            desc: "Audit-ready quality system",
            score: 100,
          },
        ],
      },
      {
        text: "How well is your technical file/documentation structured for submission?",
        type: "progress",
        options: [
          {
            label: "We haven't started the technical file",
            desc: "No submission materials ready",
            score: 0,
          },
          {
            label: "We have some parts ready but it's messy",
            desc: "Incomplete and unorganised",
            score: 33,
          },
          {
            label: "The file is mostly complete and structured",
            desc: "Solid foundation for submission",
            score: 67,
          },
          {
            label: "Submission-ready technical file with full traceability",
            desc: "Complete and professional documentation",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "legal",
    icon: "⚖",
    title: "Legal & Privacy",
    desc: "Are you protecting your company and your users' data?",
    questions: [
      {
        text: "How robust is your data privacy and security framework?",
        type: "confidence",
        options: [
          {
            label: "We haven't formalised this yet",
            desc: "Security is ad-hoc",
            score: 0,
          },
          {
            label: "We have basic policies in place",
            desc: "Compliance is surface-level",
            score: 33,
          },
          {
            label: "We are compliant with major standards (HIPAA, GDPR, etc.)",
            desc: "Formal compliance achieved",
            score: 67,
          },
          {
            label: "Privacy-by-design and regular third-party audits",
            desc: "Security is a core competency",
            score: 100,
          },
        ],
      },
      {
        text: "Are your core contracts (Employment, IP, Founders) fully executed?",
        type: "progress",
        options: [
          {
            label: "Some are missing or incomplete",
            desc: "Legal loose ends remain",
            score: 0,
          },
          {
            label: "Most are done but a few remain",
            desc: "Nearly there",
            score: 67,
          },
          {
            label: "All core contracts are fully executed and filed",
            desc: "Clean legal foundation",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "ip",
    icon: "℗",
    title: "IP Strategy",
    desc: "Have you protected what makes you unique?",
    questions: [
      {
        text: "What is the status of your patent or IP protection strategy?",
        type: "progress",
        options: [
          {
            label: "We haven't filed anything yet",
            desc: "IP is currently unprotected",
            score: 0,
          },
          {
            label: "We have filed provisionals",
            desc: "Initial protection secured",
            score: 33,
          },
          {
            label: "We have a clear IP roadmap and multiple filings",
            desc: "Strategic IP portfolio",
            score: 67,
          },
          {
            label: "Granted patents or a very strong, defensible position",
            desc: "IP is a major asset",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "reimbursement",
    icon: "$",
    title: "Reimbursement",
    desc: "How will you actually get paid?",
    questions: [
      {
        text: "How clearly have you identified your primary reimbursement pathway?",
        type: "confidence",
        options: [
          {
            label: "We haven't figured this out yet",
            desc: "Revenue model is uncertain",
            score: 0,
          },
          {
            label: "We have a few potential paths but no clear winner",
            desc: "Exploring options",
            score: 33,
          },
          {
            label: "We have a clear, primary pathway identified",
            desc: "Targeted reimbursement model",
            score: 67,
          },
          {
            label: "Pathway is validated with payers or experts",
            desc: "Proven route to revenue",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "fundraising",
    icon: "▲",
    title: "Fundraising",
    desc: "Are you ready for the scrutiny of healthcare investors?",
    questions: [
      {
        text: "How complete is your investor dataroom?",
        type: "progress",
        options: [
          {
            label: "We don't have a dataroom yet",
            desc: "No materials prepared for due diligence",
            score: 0,
          },
          {
            label: "Basic deck and some docs are ready",
            desc: "Initial materials only",
            score: 33,
          },
          {
            label: "Comprehensive dataroom is nearly complete",
            desc: "Most diligence items covered",
            score: 67,
          },
          {
            label:
              "Full, audit-ready dataroom with all healthcare-specific items",
            desc: "Ready for deep-dive diligence today",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "marketing",
    icon: "◈",
    title: "Marketing & Branding",
    desc: "Does your brand resonate with healthcare stakeholders?",
    questions: [
      {
        text: "How well-defined is your brand positioning in the healthcare market?",
        type: "confidence",
        options: [
          {
            label: "We have a logo but no clear positioning",
            desc: "Branding is surface-level",
            score: 0,
          },
          {
            label: "We have a value prop but it's generic",
            desc: "Not specific enough for healthcare",
            score: 33,
          },
          {
            label: "Positioning is specific to our key stakeholders",
            desc: "Resonant branding",
            score: 67,
          },
          {
            label: "Positioning is validated and consistently applied",
            desc: "Brand is a differentiator",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "gtm",
    icon: "⚑",
    title: "Go-To-Market",
    desc: "How will you reach and win your first customers?",
    questions: [
      {
        text: "How specific is your target customer profile (Ideal Customer Profile)?",
        type: "confidence",
        options: [
          {
            label: 'We target "hospitals" or "doctors" generally',
            desc: "Too broad to be actionable",
            score: 0,
          },
          {
            label: "We've narrowed it down to a specific department/role",
            desc: "Better focus",
            score: 33,
          },
          {
            label: "We have a detailed ICP including pain points and budget",
            desc: "Highly targeted",
            score: 67,
          },
          {
            label: "ICP is validated by initial sales or deep discovery",
            desc: "We know exactly who we're selling to",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "healthcare",
    icon: "⚙",
    title: "Health System Navigation",
    desc: "Do you understand the complexity of institutional sales?",
    questions: [
      {
        text: "How well do you understand the procurement process of your target customers?",
        type: "knowledge",
        options: [
          {
            label: "We don't know how they buy yet",
            desc: "Sales process is a black box",
            score: 0,
          },
          {
            label: "We have a high-level sense of it",
            desc: "General understanding",
            score: 33,
          },
          {
            label: "We've mapped the decision-makers and timeline",
            desc: "Detailed sales map",
            score: 67,
          },
          {
            label: "We've navigated it at least once or have expert guidance",
            desc: "Proven ability to close",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "operations",
    icon: "▣",
    title: "Operations & Scaling",
    desc: "Whether your business can actually grow without breaking.",
    questions: [
      {
        text: "What metrics are you using to measure product success for your users?",
        type: "confidence",
        options: [
          {
            label: "We aren't tracking success metrics yet",
            desc: "User impact is unmeasured",
            score: 0,
          },
          {
            label: "We track basic usage/engagement",
            desc: "Measuring activity, not value",
            score: 33,
          },
          {
            label: "We track metrics that align with user value",
            desc: "Measuring what matters to users",
            score: 67,
          },
          {
            label: "Metrics are tied to ROI or clinical outcomes",
            desc: "Demonstrable value for the customer",
            score: 100,
          },
        ],
      },
      {
        text: "How aware are you of the manual processes in your business that won't scale?",
        type: "confidence",
        options: [
          {
            label: "We haven't thought about this systematically",
            desc: "Scaling constraints haven't been mapped",
            score: 0,
          },
          {
            label:
              "We're aware of some bottlenecks but haven't documented them",
            desc: "We know things will need to change but haven't planned it",
            score: 33,
          },
          {
            label: "We've identified key manual processes and have a plan",
            desc: "Automation or delegation paths are being worked on",
            score: 67,
          },
          {
            label:
              "We've already addressed scaling bottlenecks or are actively doing so",
            desc: "Operations are being built for scale proactively",
            score: 100,
          },
        ],
      },
      {
        text: "How clearly have you defined the roles you need in the next 12 months?",
        type: "progress",
        options: [
          {
            label: "We haven't thought ahead to next year's team needs",
            desc: "Hiring plans are reactive rather than planned",
            score: 0,
          },
          {
            label:
              "We know we'll need to hire but haven't defined specific roles",
            desc: "Headcount growth is vague",
            score: 33,
          },
          {
            label: "We've defined priority roles and roughly when we need them",
            desc: "A hiring roadmap exists",
            score: 67,
          },
          {
            label:
              "Hiring plans are specific, budgeted, and tied to our growth model",
            desc: "We know exactly who we need and when",
            score: 100,
          },
        ],
      },
      {
        text: "How well do you understand your unit economics — now and at scale?",
        type: "confidence",
        options: [
          {
            label: "We haven't modelled our unit economics yet",
            desc: "CAC, LTV, margins are undefined",
            score: 0,
          },
          {
            label: "Rough estimates but we don't trust the numbers yet",
            desc: "Modelled but not grounded in real data",
            score: 33,
          },
          {
            label:
              "We understand our current unit economics and have a scaling model",
            desc: "Numbers are based on real experience",
            score: 67,
          },
          {
            label:
              "Unit economics are well understood, stress-tested, and improving",
            desc: "We can articulate exactly how the model gets better at scale",
            score: 100,
          },
        ],
      },
    ],
  },
];

