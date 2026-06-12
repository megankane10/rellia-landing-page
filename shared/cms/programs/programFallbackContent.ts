import type { QmsProgramContent } from "../types"

/** Per-slug copy fallbacks when a program document is empty in Sanity. */
export const PROGRAM_PAGE_FALLBACKS: Record<string, Partial<QmsProgramContent>> = {
  "ignite-pitch-foundations": {
    paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
    heroTitle: "Ignite: Pitch Foundations",
    heroDescription:
      "Master the essentials of fundraising by crafting your first pitch deck and presentation. Perfect for early-stage founders looking for a structured starting point to build investor confidence.",
    heroCtaLabel: "Join Waitlist",
    outcomesTitle: "Program Outcomes",
    outcomesIntro:
      "By the end of this program, you will have the tools and confidence to pitch your health tech startup to investors.",
    outcomes: [
      "A polished, investor-ready pitch deck tailored to healthcare investors",
      "A rehearsed 5-minute pitch with confident delivery",
      "Clear understanding of what healthcare investors look for at pre-seed and seed",
      "Financial model basics specific to health tech business models",
      "Peer-reviewed narrative and slide design",
    ],
    howItWorksTitle: "How It Works",
    howItWorksIntro:
      "Each week you receive structured coaching, peer feedback, and live practice sessions to build your pitch from the ground up.",
    pillarsTitle: "Program Pillars",
    timelineTitle: "Program Timeline & Details",
    timelineSubtitle: "An 8-week intensive to take you from idea to investor-ready pitch",
    pricingBadge: "Waitlist",
    pricingAmount: "$1,500",
    pricingSubAmount: ".00",
    pricingDescription:
      "Join the waitlist to be the first to know when Ignite: Pitch Foundations opens for enrollment.",
    pricingBullets: [
      "8-week structured curriculum",
      "Live pitch practice sessions",
      "1-on-1 narrative coaching",
      "Investor-ready deck template",
    ],
    bottomCtaTitle: "Ready to pitch with confidence?",
    bottomCtaBody: "Join the waitlist and we'll notify you as soon as the next cohort opens.",
    bottomCtaButtonLabel: "Contact",
    bottomContactHref: "/contact",
  },
  "advance-data-room-deep-dive": {
    paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
    heroTitle: "Advance: Data Room Deep Dive",
    heroDescription:
      "Move beyond the basics into the mechanics of due diligence and data room management. Gain the practical tools and execution tips needed to navigate the complexities of the raising process.",
    heroCtaLabel: "Join Waitlist",
    outcomesTitle: "Program Outcomes",
    outcomesIntro:
      "By the end of this program, you will have an investor-grade data room and the confidence to navigate due diligence.",
    outcomes: [
      "A structured, investor-grade data room ready for due diligence",
      "Clean cap table and corporate documentation",
      "Healthcare-specific regulatory and clinical document organization",
      "Mock diligence experience with real investor feedback",
      "Comprehensive diligence checklist covering legal, financial, IP, and regulatory",
    ],
    howItWorksTitle: "How It Works",
    howItWorksIntro:
      "A hands-on, document-driven program that builds your data room piece by piece with expert guidance at every step.",
    pillarsTitle: "Program Pillars",
    timelineTitle: "Program Timeline & Details",
    timelineSubtitle: "8 weeks to build a diligence-ready data room from scratch",
    pricingBadge: "Waitlist",
    pricingAmount: "$1,800",
    pricingSubAmount: ".00",
    pricingDescription:
      "Join the waitlist to be notified when Advance: Data Room Deep Dive opens for the next cohort.",
    pricingBullets: [
      "Data room platform setup",
      "Cap table and legal document templates",
      "Mock diligence with investors",
      "Healthcare-specific compliance docs",
    ],
    bottomCtaTitle: "Ready for due diligence?",
    bottomCtaBody: "Join the waitlist and we'll let you know when the next cohort begins.",
    bottomCtaButtonLabel: "Contact",
    bottomContactHref: "/contact",
  },
  "elevate-healthcare-capital": {
    paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
    heroTitle: "Elevate: Healthcare Capital",
    heroDescription:
      "Refine your existing fundraising strategy for the specialized world of health tech. Upgrade your pitch to meet the specific technical and clinical expectations of healthcare investors.",
    heroCtaLabel: "Join Waitlist",
    outcomesTitle: "Program Outcomes",
    outcomesIntro:
      "By the end of this program, you will have a healthcare-specific fundraising strategy and materials ready for specialized investors.",
    outcomes: [
      "A refined pitch deck calibrated for healthcare-specialized investors",
      "Financial projections reflecting reimbursement and procurement models",
      "Clinical and regulatory narrative that builds investor conviction",
      "Warm introductions to matched healthcare investors through Rellia's network",
      "Diligence-ready materials that withstand healthcare-specific scrutiny",
    ],
    howItWorksTitle: "How It Works",
    howItWorksIntro:
      "Upgrade your fundraising approach with healthcare-specific strategy, materials, and investor access.",
    pillarsTitle: "Program Pillars",
    timelineTitle: "Program Timeline & Details",
    timelineSubtitle: "8 weeks to elevate your fundraising for healthcare capital",
    pricingBadge: "Waitlist",
    pricingAmount: "$2,200",
    pricingSubAmount: ".00",
    pricingDescription:
      "Join the waitlist to be the first to know when Elevate: Healthcare Capital opens for enrollment.",
    pricingBullets: [
      "Healthcare investor mapping",
      "Financial model upgrade",
      "Mock pitch with investor panel",
      "Warm intro strategy",
    ],
    bottomCtaTitle: "Ready to raise healthcare capital?",
    bottomCtaBody: "Join the waitlist and we'll notify you when the next cohort starts.",
    bottomCtaButtonLabel: "Contact",
    bottomContactHref: "/contact",
  },
  "first-50-users-clinical-feedback-intensive": {
    paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
    heroTitle: "First 50 Users: A Clinical Feedback Intensive",
    heroDescription:
      "Validate your product through facilitated usability testing and assumption audits with Rellia's clinician network. Bridge the gap between prototype and clinical use.",
    heroCtaLabel: "Join Waitlist",
    outcomesTitle: "Program Outcomes",
    outcomesIntro:
      "By the end of this program, you will have real clinical feedback and a validation framework investors trust.",
    outcomes: [
      "Structured usability feedback from matched clinical end-users",
      "IRB-compliant research methodology and documentation",
      "Validated product-market fit with clinician-generated evidence",
      "Actionable product improvement recommendations based on real workflow testing",
      "Investor-ready clinical validation summary",
    ],
    howItWorksTitle: "How It Works",
    howItWorksIntro:
      "Connect with real clinicians, run structured feedback sessions, and produce evidence that matters to investors and buyers.",
    pillarsTitle: "Program Pillars",
    timelineTitle: "Program Timeline & Details",
    timelineSubtitle: "8 weeks from prototype to validated clinical feedback",
    pricingBadge: "Waitlist",
    pricingAmount: "$2,500",
    pricingSubAmount: ".00",
    pricingDescription:
      "Join the waitlist to be notified when First 50 Users opens for the next cohort.",
    pricingBullets: [
      "Clinician network access",
      "Facilitated usability sessions",
      "IRB guidance and templates",
      "Publishable findings report",
    ],
    bottomCtaTitle: "Ready to validate with real users?",
    bottomCtaBody: "Join the waitlist and we'll notify you when the next cohort begins.",
    bottomCtaButtonLabel: "Contact",
    bottomContactHref: "/contact",
  },
  "low-fidelity-prototype-lab": {
    paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
    heroTitle: "A Low-Fidelity Prototype Lab",
    heroDescription:
      "Transform your vision into a functional low-fidelity prototype and a vendor-ready requirements document. Connect with vetted development firms to build your proof of concept.",
    heroCtaLabel: "Join Waitlist",
    outcomesTitle: "Program Outcomes",
    outcomesIntro:
      "By the end of this program, you will have a testable prototype and the documentation to take it to production.",
    outcomes: [
      "A functional low-fidelity prototype you can demo to users and investors",
      "A vendor-ready requirements document with user stories and technical specs",
      "Clinical workflow validation for your core product flows",
      "Introductions to vetted development firms and testing partners",
      "Technical architecture decisions documented for your build phase",
    ],
    howItWorksTitle: "How It Works",
    howItWorksIntro:
      "A sprint-based program that takes you from product vision to a testable prototype with vendor introductions.",
    pillarsTitle: "Program Pillars",
    timelineTitle: "Program Timeline & Details",
    timelineSubtitle: "8 weeks from concept to prototype with vendor-ready specs",
    pricingBadge: "Waitlist",
    pricingAmount: "$1,800",
    pricingSubAmount: ".00",
    pricingDescription:
      "Join the waitlist to be notified when the Low-Fidelity Prototype Lab opens.",
    pricingBullets: [
      "Requirements documentation",
      "Rapid prototyping tools",
      "Vendor matching and intros",
      "Technical architecture guidance",
    ],
    bottomCtaTitle: "Ready to build your prototype?",
    bottomCtaBody: "Join the waitlist and we'll notify you when the next cohort starts.",
    bottomCtaButtonLabel: "Contact",
    bottomContactHref: "/contact",
  },
  "advisory-board-match": {
    paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
    heroTitle: "Advisory Board Match",
    heroDescription:
      "Identify and recruit the ideal experts for your startup using Rellia's vetted advisor network. We provide the matchmaking, equity benchmarking, and legal frameworks for productive advisory relationships.",
    heroCtaLabel: "Join Waitlist",
    outcomesTitle: "Program Outcomes",
    outcomesIntro:
      "By the end of this program, you will have a structured advisory board with clear terms and productive relationships.",
    outcomes: [
      "A balanced advisory board covering clinical, regulatory, and commercial expertise",
      "Market-benchmarked equity compensation and vesting structures",
      "Signed advisory agreements with clear deliverables and expectations",
      "First advisory sessions facilitated and running",
      "Ongoing advisory meeting cadence and accountability framework",
    ],
    howItWorksTitle: "How It Works",
    howItWorksIntro:
      "From needs assessment to signed agreements — we match you with the right advisors and structure the relationship for results.",
    pillarsTitle: "Program Pillars",
    timelineTitle: "Program Timeline & Details",
    timelineSubtitle: "8 weeks to build your advisory board with the right experts",
    pricingBadge: "Waitlist",
    pricingAmount: "$1,200",
    pricingSubAmount: ".00",
    pricingDescription:
      "Join the waitlist to be notified when Advisory Board Match opens for enrollment.",
    pricingBullets: [
      "Advisor matching from Rellia's network",
      "Equity benchmarking data",
      "Legal agreement templates",
      "Facilitated onboarding",
    ],
    bottomCtaTitle: "Ready to build your advisory board?",
    bottomCtaBody: "Join the waitlist and we'll let you know when the next cohort opens.",
    bottomCtaButtonLabel: "Contact",
    bottomContactHref: "/contact",
  },
  "design-your-brand-strategy": {
    paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
    heroTitle: "Design Your Brand Strategy",
    heroDescription:
      "Develop a professionally positioned brand identity that earns trust from both clinicians and investors. Includes sprints for website copy, UI design, and sales collateral.",
    heroCtaLabel: "Join Waitlist",
    outcomesTitle: "Program Outcomes",
    outcomesIntro:
      "By the end of this program, you will have a cohesive brand identity and assets that earn trust across healthcare audiences.",
    outcomes: [
      "A complete visual identity system — logo direction, colors, typography",
      "Rewritten website copy structured for healthcare credibility",
      "Sales collateral designed for procurement and investor conversations",
      "A brand voice framework consistent across all touchpoints",
      "A lightweight design system for ongoing consistency as you scale",
    ],
    howItWorksTitle: "How It Works",
    howItWorksIntro:
      "Sprint-based brand development that covers identity, messaging, and all the assets you need to look professional from day one.",
    pillarsTitle: "Program Pillars",
    timelineTitle: "Program Timeline & Details",
    timelineSubtitle: "8 weeks to build a brand that earns healthcare trust",
    pricingBadge: "Waitlist",
    pricingAmount: "$2,000",
    pricingSubAmount: ".00",
    pricingDescription:
      "Join the waitlist to be notified when Design Your Brand Strategy opens for the next cohort.",
    pricingBullets: [
      "Visual identity development",
      "Website copy restructuring",
      "Sales collateral templates",
      "Design system documentation",
    ],
    bottomCtaTitle: "Ready to build your brand?",
    bottomCtaBody: "Join the waitlist and we'll notify you when the next cohort begins.",
    bottomCtaButtonLabel: "Contact",
    bottomContactHref: "/contact",
  },
  "regulatory-strategy-sprint": {
    paymentUrl: "https://forms.fillout.com/t/qnMWtHtTkyus",
    heroTitle: "Regulatory Strategy Sprint",
    heroDescription:
      "Navigate the complexities of medical device classification and global commercialization milestones. Leave with a documented regulatory strategy that supports investor due diligence.",
    heroCtaLabel: "Get started",
    outcomesTitle: "Program Outcomes",
    outcomesIntro:
      "By the end of this program, you will have a clear regulatory strategy and timeline you can execute against and share with stakeholders.",
    outcomes: [
      "Product classification across FDA, Health Canada, and EU MDR",
      "A documented regulatory pathway with submission requirements",
      "Precise intended use and indications for use statements",
      "A phased global commercialization timeline with regulatory dependencies",
      "An investor-ready regulatory milestone document",
    ],
    howItWorksTitle: "How It Works",
    howItWorksIntro:
      "Work with regulatory experts to classify your device, choose the right pathway, and build a timeline investors trust.",
    pillarsTitle: "Program Pillars",
    timelineTitle: "Program Timeline & Details",
    timelineSubtitle: "4 weeks to build your regulatory roadmap from classification to market",
    pricingBadge: "Upcoming",
    pricingAmount: "$2,000",
    pricingSubAmount: ".00",
    pricingDescription:
      "The next cohort of the Regulatory Strategy Sprint is opening soon. Secure your spot now to ensure your participation.",
    pricingBullets: [
      "Multi-jurisdiction classification",
      "Pathway selection guidance",
      "Intended use statement drafting",
      "Regulatory milestone timeline",
    ],
    bottomCtaTitle: "Not sure if your product needs a regulatory pathway?",
    bottomCtaBody:
      "Many health tech products require regulatory clearance — but not all do. Reach out and we'll help you figure out where you stand.",
    bottomCtaButtonLabel: "Contact Us",
    bottomContactHref: "/contact",
    testimonials: [
      {
        name: "Ibukun Elebute",
        role: "Founder & COO",
        company: "Cellect",
        image: "/images/ibukun.jpg",
        quote:
          "As an early-stage medtech company navigating regulatory readiness, having a structured system with clear guidance made a huge difference. The templates were practical and startup-friendly, the process was easy to follow, and the support helped us understand not just what needed to be done, but how to do it properly.",
      },
      {
        name: "Dr Stevie Foglia",
        role: "Founder & CEO",
        company: "Neuro-Mod",
        image: "/images/drstrevie.png",
        quote:
          "Rellia has been excellent to work with and has played an integral role in building our regulatory plans. I would highly recommend them to anyone looking to navigate regulatory submissions for a medical-related product. They are true experts in their field.",
      },
    ],
  },
}

export const getProgramPageFallback = (slug: string): Partial<QmsProgramContent> =>
  PROGRAM_PAGE_FALLBACKS[slug.trim()] ?? {}
