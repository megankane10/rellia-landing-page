export type StoryTag = "Founder Story" | "Industry Insight" | "Program Update"

export type Story = {
  slug: string
  title: string
  excerpt: string
  tag: StoryTag
  featured: boolean
  coverImageSrc: string
  coverImageAlt: string
  publishedAt: string
  seoTitle?: string
  seoDescription?: string
  body: Array<{ type: "p"; text: string }>
}

export const STORIES: Story[] = [
  {
    slug: "why-rellia-exists",
    title: "Why Rellia exists",
    excerpt:
      "Healthcare is hard to build in—especially when you’re doing it alone. Here’s the story behind Rellia and the kind of support we wished existed sooner.",
    tag: "Founder Story",
    featured: true,
    coverImageSrc: "/images/cta-home-conference.webp",
    coverImageAlt: "Rellia community event",
    publishedAt: "2026-04-01",
    seoTitle: "Why Rellia exists — Rellia Health",
    seoDescription:
      "The founding story of Rellia Health and the network we’re building for digital health founders.",
    body: [
      {
        type: "p",
        text: "Healthcare innovation is full of brilliant teams—and avoidable pitfalls. Rellia exists to surround founders with the expertise that prevents costly detours.",
      },
      {
        type: "p",
        text: "We connect founders to operators, clinicians, and partners who have lived the details: procurement, compliance, evidence, and adoption inside complex systems.",
      },
      {
        type: "p",
        text: "What we wish we’d had earlier is simple: a way to pressure-test decisions before they become expensive. Not just advice, but applied experience — the nuance of what hospitals buy, how pilots actually scale, and where teams lose time without realizing it.",
      },
      {
        type: "p",
        text: "Rellia is built for founders who want signal over noise. We help you turn ambiguity into an execution plan: who needs to say yes, what proof matters, and how to ship in a way that earns trust inside healthcare.",
      },
    ],
  },
  {
    slug: "the-real-cost-of-generic-startup-advice",
    title: "The real cost of generic startup advice in healthcare",
    excerpt:
      "What works in consumer or SaaS often breaks in health tech. Here are the common traps—and the better questions to ask.",
    tag: "Industry Insight",
    featured: true,
    coverImageSrc: "/images/hero-network.png",
    coverImageAlt: "Network visualization",
    publishedAt: "2026-03-18",
    body: [
      {
        type: "p",
        text: "In health tech, credibility is part of the product. Your commercialization plan must account for evidence, workflows, and the realities of adoption inside healthcare systems.",
      },
      {
        type: "p",
        text: "The fastest path is usually not the loudest one—it’s the path aligned to clinical utility, reimbursement, and implementation.",
      },
      {
        type: "p",
        text: "Generic advice tends to optimize for speed without accounting for risk. In healthcare, risk has owners: compliance, security, clinical governance, operations, finance. If your plan doesn’t reduce risk for those owners, you’ll stall — even with a great product.",
      },
      {
        type: "p",
        text: "A better question than “How do we grow?” is “What uncertainty blocks the next stakeholder from saying yes?” Design milestones that change what’s true: validated workflow fit, measurable outcomes, clear data boundaries, and implementation feasibility.",
      },
    ],
  },
  {
    slug: "program-update-qms-sprints",
    title: "Program update: QMS sprints that actually ship",
    excerpt:
      "A behind-the-scenes look at how we structure work so founders leave with artifacts—not just notes.",
    tag: "Program Update",
    featured: false,
    coverImageSrc: "/images/programs-qms.png",
    coverImageAlt: "QMS program",
    publishedAt: "2026-02-27",
    body: [
      {
        type: "p",
        text: "Our programs are outcome-first. Each sprint is designed so you can produce tangible deliverables and reduce uncertainty in the path ahead.",
      },
      {
        type: "p",
        text: "We start by clarifying the artifact that matters most: a QMS scope, a risk trace, a decision log, or a validation plan. Then we work backwards to the smallest set of steps that produces it with confidence.",
      },
      {
        type: "p",
        text: "The goal isn’t to add process. It’s to add momentum — while making sure what you ship holds up when partners, buyers, or regulators ask hard questions.",
      },
    ],
  },
  {
    slug: "founder-story-from-pilot-to-procurement",
    title: "Founder story: from pilot to procurement without losing momentum",
    excerpt:
      "A candid look at what changed when one founder treated implementation, evidence, and stakeholder alignment as one plan—not three separate workstreams.",
    tag: "Founder Story",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/8460092/pexels-photo-8460092.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Clinician and founder reviewing a product workflow",
    publishedAt: "2026-03-05",
    body: [
      {
        type: "p",
        text: "The turning point wasn’t a new feature. It was a clearer implementation plan: who owns the workflow, what success looks like in 30 days, and how to document impact without slowing care.",
      },
      {
        type: "p",
        text: "Once the pilot had a single source of truth for outcomes and stakeholder feedback, procurement conversations became specific—and much faster.",
      },
      {
        type: "p",
        text: "They also reframed their demo: instead of showing everything, they showed the three workflow moments that mattered. Clinicians could immediately map the product to their day, and leadership could see the operational benefit.",
      },
      {
        type: "p",
        text: "The biggest unlock was aligning evidence to the buyer’s language. Not “engagement,” but reduced no-shows. Not “automation,” but fewer handoffs. Suddenly, the conversation shifted from interest to implementation planning.",
      },
    ],
  },
  {
    slug: "industry-insight-evidence-credibility-loop",
    title: "Industry insight: the evidence–credibility loop that unlocks adoption",
    excerpt:
      "In healthcare, trust is cumulative. Here’s how to design evidence collection that builds credibility while still supporting rapid iteration.",
    tag: "Industry Insight",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Healthcare team discussing outcomes data",
    publishedAt: "2026-03-22",
    body: [
      { type: "p", text: "Adoption is rarely blocked by product alone. It’s blocked by uncertainty: clinical utility, workflow fit, and operational risk." },
      { type: "p", text: "The best teams bake evidence into the rollout—so every implementation step teaches something and reduces risk for the next stakeholder." },
      { type: "p", text: "A simple pattern works: define the decision you want to enable, identify the risk owner, then design evidence that makes that decision easy. Repeat that cycle every two to four weeks as you learn." },
      { type: "p", text: "The teams that win don’t “do research later.” They embed measurement into the product and implementation so learning is continuous, not a separate project." },
    ],
  },
  {
    slug: "program-update-office-hours-that-compound",
    title: "Program update: office hours that compound, not just check the box",
    excerpt:
      "We redesigned office hours around decision-making. Here’s the format we use to turn questions into next steps founders can ship.",
    tag: "Program Update",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Team workshop with sticky notes and laptops",
    publishedAt: "2026-01-30",
    body: [
      { type: "p", text: "Great office hours don’t produce answers—they produce decisions. Our sessions end with a single next move, a risk list, and an owner." },
      { type: "p", text: "Founders leave with artifacts: stakeholder maps, evidence plans, and a weekly execution cadence." },
      { type: "p", text: "We also timebox context. If a founder needs a deep dive, we move it to a focused working session so office hours stay crisp and actionable." },
      { type: "p", text: "The end result is compounding clarity: each week closes loops, reduces unknowns, and strengthens the narrative for the next stakeholder conversation." },
    ],
  },
  {
    slug: "founder-story-avoiding-the-compliance-panic",
    title: "Founder story: avoiding the compliance panic by starting earlier",
    excerpt:
      "A founder shares how they built privacy and security into the product roadmap early—without turning development into molasses.",
    tag: "Founder Story",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/7578806/pexels-photo-7578806.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Laptop with security checklist and planning notes",
    publishedAt: "2026-02-10",
    body: [
      { type: "p", text: "The secret wasn’t more documentation. It was fewer unknowns: which data we store, why we store it, and how access is controlled." },
      { type: "p", text: "By treating compliance as product design, the team shipped faster and avoided last-minute rework." },
      { type: "p", text: "They created a lightweight threat model and used it to drive practical decisions: access roles, audit trails, and what to log. Most work was incremental, not a big-bang “compliance sprint.”" },
      { type: "p", text: "The bonus: sales calls became easier. They could explain security posture clearly, which improved trust and shortened the due diligence cycle." },
    ],
  },
  {
    slug: "industry-insight-commercialization-milestones",
    title: "Industry insight: commercialization milestones that actually reduce risk",
    excerpt:
      "Not all milestones are equal. Here’s a practical checklist for choosing milestones that reduce clinical, operational, and buyer risk.",
    tag: "Industry Insight",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Team reviewing a roadmap on a whiteboard",
    publishedAt: "2026-04-12",
    body: [
      { type: "p", text: "Milestones should change what’s true. If a milestone doesn’t reduce uncertainty for a buyer, it’s probably vanity." },
      { type: "p", text: "The best milestones translate into proof: workflow fit, stakeholder alignment, implementation feasibility, and measurable outcomes." },
      { type: "p", text: "Start by naming the buyer’s fear. Then build milestones that address it directly. A security review, a clinical champion, a measurable operational outcome — each one removes a reason to say no." },
      { type: "p", text: "When milestones are designed this way, the roadmap becomes a risk-reduction engine. That’s what makes teams look ‘inevitable’ to partners and investors." },
    ],
  },
]

export const getStoryBySlug = (slug: string): Story | undefined =>
  STORIES.find((s) => s.slug === slug)

export const getFeaturedStories = (): Story[] =>
  STORIES.filter((s) => s.featured)

