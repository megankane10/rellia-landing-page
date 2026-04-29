export type StoryTag = "Founder Story" | "Industry Insight" | "Program Update"

export type StoryBodyBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "cta"; title: string; body: string; buttonLabel: string; buttonHref: string }

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
  body: StoryBodyBlock[]
}

export const STORIES: Story[] = [
  {
    slug: "the-one-decision-healthcare-buyers-need",
    title: "The One Decision Healthcare Buyers Need to Say Yes",
    excerpt:
      "Most deals don’t fail because the product is weak. They fail because the next stakeholder can’t safely approve it. Here’s a practical way to structure proof so every meeting reduces risk.",
    tag: "Industry Insight",
    featured: true,
    coverImageSrc: "https://images.pexels.com/photos/7988690/pexels-photo-7988690.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Team discussing strategy in a meeting",
    publishedAt: "2026-04-18",
    seoTitle: "The one decision healthcare buyers need — Rellia Health",
    seoDescription: "A practical way to align evidence, workflow, and risk so stakeholders can approve your solution.",
    body: [
      {
        type: "h2",
        text: "The real product is decision safety",
      },
      {
        type: "p",
        text: "In healthcare, a purchase is rarely a single “yes.” It’s a chain of approvals, each owned by someone whose job is to prevent failure: clinical leaders protecting patient safety, IT safeguarding systems, compliance reducing regulatory exposure, finance managing spend, operations protecting throughput. Your product can be compelling and still stall if you don’t make the next approval easy.",
      },
      {
        type: "p",
        text: "A useful reframing is this: every stakeholder is asking one question—“Can I defend this decision if something goes wrong?” When you answer that, you stop selling features and start selling risk reduction. And that’s what moves deals forward.",
      },
      {
        type: "p",
        text: "Start by naming the next gate. Is it a security review? A clinical champion? An implementation plan with clear resource requirements? A data-sharing agreement? A budget line item? Pick one. Then define what proof changes that stakeholder’s risk calculus. Proof isn’t a PDF. It’s the smallest set of artifacts that makes “yes” rational.",
      },
      {
        type: "p",
        text: "For clinical stakeholders, proof often means: a workflow map that matches reality, a clear definition of clinical responsibility, and an outcomes plan that doesn’t punish staff. For IT, it means: precise data boundaries, authentication approach, auditability, and a timeline they can support. For finance, it means: the unit economics of time saved, reduced leakage, or avoided cost—with assumptions they can inspect.",
      },
      {
        type: "p",
        text: "Then run your pilot like an approval engine. Every week should produce one thing that reduces uncertainty. A decision log. A short security one-pager. A signed implementation plan. A before/after metric you can reproduce. If you can’t name what you’re trying to make true next, you’re not piloting—you’re waiting.",
      },
      {
        type: "p",
        text: "Finally, align the story. A buyer wants to repeat a coherent narrative internally: problem → risk → proof → cost → rollout. If your materials don’t fit into that shape, the person who likes you can’t advocate for you. Your job is to hand them a clean story they can reuse.",
      },
      {
        type: "quote",
        text: "If you make the next stakeholder’s job easier, you’ll feel momentum. If you make it harder, you’ll feel “interest” without commitment.",
        attribution: "Rellia Health",
      },
      {
        type: "p",
        text: "One practical tool is a stakeholder proof matrix. Make a table with each stakeholder on the left and three columns: “What they fear,” “What they need to see,” and “What we will produce.” Keep it brutally concrete. “IT needs confidence” is not concrete. “IT needs a data flow diagram, list of integrations, and retention policy” is concrete.",
      },
      {
        type: "p",
        text: "If you do this well, meetings become shorter. Not because the buyer is rushing, but because you remove re-litigation. The same questions stop resurfacing because you answered them once and captured the answers in an artifact the organization can reuse.",
      },
      {
        type: "p",
        text: "The mistake to avoid is over-producing. Founders sometimes respond to healthcare complexity by creating a mountain of documentation. That usually backfires: it creates more surface area for stakeholders to debate. The goal is the smallest credible proof set that reduces risk for the next decision.",
      },
      {
        type: "p",
        text: "If you’re unsure what to build, watch what buyers forward. The artifacts that get shared internally are the ones that matter: a one-page summary, a security overview, a rollout plan, an outcomes snapshot. Build those first. They are your real sales collateral.",
      },
      {
        type: "cta",
        title: "Want help shaping your decision packet?",
        body: "If you’re preparing for a pilot, security review, or rollout, we can help you identify the next gate and build the smallest credible proof set to get to yes.",
        buttonLabel: "Get involved",
        buttonHref: "/network",
      },
    ],
  },
  {
    slug: "founder-spotlight-the-pilot-that-became-procurement",
    title: "Founder Spotlight: The Pilot That Became Procurement",
    excerpt:
      "A founder shares the three changes that turned a promising pilot into a signed rollout—without adding months of bureaucracy or burning out the clinical team.",
    tag: "Founder Story",
    featured: true,
    coverImageSrc: "https://images.pexels.com/photos/8133852/pexels-photo-8133852.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Two professionals collaborating at a table with a laptop",
    publishedAt: "2026-04-09",
    seoTitle: "Founder spotlight: the pilot that became procurement — Rellia Health",
    seoDescription: "A candid breakdown of what changed when a pilot was treated as an implementation plan, not a demo.",
    body: [
      {
        type: "h2",
        text: "The pilot wasn’t the problem—ambiguity was",
      },
      {
        type: "p",
        text: "The pilot started strong: engaged clinicians, supportive leadership, early signal that the workflow fit. But the founder could feel the drift—weeks were passing and the “next step” conversations weren’t arriving. Everyone liked the product. No one was committing to rollout.",
      },
      {
        type: "p",
        text: "The first change was to treat the pilot like a procurement pre-brief. The founder built a one-page “decision packet” that named the stakeholders, the risks each owned, and the exact artifact that would de-risk those risks. Instead of asking for “feedback,” they asked for decisions: approve access model, confirm workflow owner, validate measurement plan.",
      },
      {
        type: "p",
        text: "The second change was to shift the outcomes conversation from “nice-to-have metrics” to “what changes staffing and budget.” They stopped reporting engagement and started reporting operational impact: minutes saved per encounter, reduced back-and-forth, fewer escalations. Leadership could translate that into capacity and cost without inventing assumptions.",
      },
      {
        type: "p",
        text: "The third change was implementation clarity. The founder walked through a 30/60/90-day rollout plan with the operations lead: training, escalation paths, support hours, ownership by role. That plan made IT comfortable, because “rollout” became a bounded project—not an open-ended request.",
      },
      {
        type: "p",
        text: "What surprised the founder most was how small the changes were. The product didn’t change much. The narrative did. When the pilot produced artifacts the organization already knew how to approve, the rollout stopped feeling risky.",
      },
      {
        type: "p",
        text: "The takeaway: pilots convert when they reduce uncertainty on a schedule. If your pilot isn’t generating approvals, it’s missing a decision cadence. A great product earns interest; a great plan earns commitment.",
      },
      {
        type: "p",
        text: "One detail that mattered: the founder stopped promising “we can do whatever you need.” Instead they scoped the pilot tightly and documented the “won’t do” list. That created trust. The hospital could see the team understood boundaries—which is exactly what safety-focused organizations look for.",
      },
      {
        type: "p",
        text: "They also changed who they met with. Early meetings were mostly with end users. The conversion required pairing end-user signal with operational owners: the manager who could allocate training time, the analyst who owned reporting, the IT contact who could approve access. The pilot became multi-threaded in a controlled way.",
      },
      {
        type: "p",
        text: "Finally, they reduced the buyer’s work. The founder drafted the internal email the champion would send, wrote the agenda for the next meeting, and pre-filled a rollout checklist with realistic timelines. That “buyer enablement” is often what separates stalled pilots from signed rollouts.",
      },
      {
        type: "image",
        src: "https://images.pexels.com/photos/7089029/pexels-photo-7089029.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Medical technology in a clinical setting",
        caption: "Implementation wins when the work is legible to the org.",
      },
    ],
  },
  {
    slug: "program-update-the-qms-sprint-playbook",
    title: "Program Update: The QMS Sprint Playbook (Built for Shipping)",
    excerpt:
      "A behind-the-scenes look at how we run quality sprints so teams leave with real artifacts: scope, risk decisions, document skeletons, and a plan they can execute next week.",
    tag: "Program Update",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/6931341/pexels-photo-6931341.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Hands working with documents in a work session",
    publishedAt: "2026-03-28",
    seoTitle: "Program update: the QMS sprint playbook — Rellia Health",
    seoDescription: "How we structure quality work so it produces shippable artifacts instead of endless notes.",
    body: [
      {
        type: "h2",
        text: "Outcome-first quality work",
      },
      {
        type: "p",
        text: "Quality work breaks teams when it becomes a parallel universe: endless templates, unclear ownership, and “we’ll finish it later.” Our goal is the opposite: a sprint that produces the minimal artifact set you need to move forward with confidence.",
      },
      {
        type: "p",
        text: "We start by picking the single most valuable output for the next 30 days—usually a QMS scope that’s defensible, a risk register that reflects reality, or a document map that makes audits survivable. Then we define the smallest credible version of that artifact and assign owners.",
      },
      {
        type: "p",
        text: "Next, we compress decisions. The team builds a decision log: what we’re doing, what we’re not doing, and why. This is where quality becomes a growth lever—because it stops churn and rework later.",
      },
      {
        type: "p",
        text: "We also timebox “perfect.” If a document needs 20 hours to be immaculate, we still ship a 2-hour version with a clear upgrade path. The goal is not to win an imaginary audit; it’s to build a system you can maintain while shipping product.",
      },
      {
        type: "p",
        text: "Finally, every sprint ends with a forward plan: what’s next, who owns it, and what ‘done’ means. That’s how teams compound quality instead of restarting it every quarter.",
      },
      {
        type: "p",
        text: "A common misconception is that quality equals paperwork. In reality, quality equals clarity: what you intend to do, what you actually do, and how you know it worked. The documents are just the representation of that clarity.",
      },
      {
        type: "p",
        text: "We design sprints around leverage points. A clean scope statement prevents weeks of debate. A risk register with real owners prevents compliance panic later. A document map prevents teams from writing the same thing three times in three different formats.",
      },
      {
        type: "p",
        text: "Teams also leave with templates that match their stage. Early-stage companies shouldn’t copy an enterprise QMS. They need a lightweight system that can be upgraded, not replaced, as they grow.",
      },
    ],
  },
  {
    slug: "industry-insight-security-reviews-without-stalling",
    title: "Passing Security Review Without Stalling the Deal",
    excerpt:
      "Security reviews can either become a momentum-killer or a trust accelerant. Here’s how to show your work, reduce uncertainty, and keep the timeline moving.",
    tag: "Industry Insight",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/8062285/pexels-photo-8062285.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Laptop on desk during a work session",
    publishedAt: "2026-03-11",
    seoTitle: "Passing security review without stalling — Rellia Health",
    seoDescription: "A practical approach to security reviews that builds trust and preserves momentum.",
    body: [
      {
        type: "h2",
        text: "Make the boundary explicit",
      },
      {
        type: "p",
        text: "Security reviews feel slow when you treat them as a hurdle you hope to clear. They move faster when you treat them as a collaborative design review with a clear scope, a clear owner, and a clear packet of evidence.",
      },
      {
        type: "p",
        text: "Start by defining the integration boundary. What systems do you touch? What data do you process? Where does it live? If you can’t draw the boundary on one page, you’re not ready for the review. This is also how you avoid the “we need to evaluate everything” trap.",
      },
      {
        type: "p",
        text: "Then assemble a lightweight security packet: auth model, least-privilege access, logging strategy, incident response contact, and your data retention policy. The packet doesn’t need to be long—just complete. The review accelerates when the reviewer doesn’t have to interrogate you for basics.",
      },
      {
        type: "p",
        text: "Finally, set a cadence. A reviewer will block time if they trust you’ll respond quickly. If it takes you two weeks to answer questions, you teach them to move you to the back of the queue. Speed is part of your security posture—not because it’s “secure,” but because it signals operational maturity.",
      },
      {
        type: "p",
        text: "The result is counterintuitive: the more transparent you are, the less defensive the review becomes. You’re not trying to “win” the review. You’re trying to make the buyer comfortable owning the decision.",
      },
      {
        type: "p",
        text: "A small but powerful addition is a “known limitations” section. Security teams get nervous when vendors sound too confident. Naming limitations—what you don’t support yet, what requires manual process, what you’re actively improving—signals honesty and reduces surprises later.",
      },
      {
        type: "p",
        text: "If you can, offer options. Many healthcare organizations have different acceptable patterns. Give them a default approach and one alternative. That turns the review from “approve or reject” into “choose the best fit,” which is a psychologically easier decision.",
      },
      {
        type: "quote",
        text: "Security isn’t a checkbox. It’s trust you can operationalize.",
      },
    ],
  },
  {
    slug: "founder-spotlight-what-we-stopped-building",
    title: "Founder Spotlight: What We Stopped Building to Ship Faster",
    excerpt:
      "A founder explains how they cut scope without sacrificing outcomes—and why “less product” was the reason implementation finally worked.",
    tag: "Founder Story",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/8133957/pexels-photo-8133957.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "People collaborating with a laptop and documents",
    publishedAt: "2026-02-22",
    seoTitle: "Founder spotlight: what we stopped building — Rellia Health",
    seoDescription: "How focusing the product around one workflow moment unlocked implementation momentum.",
    body: [
      {
        type: "h2",
        text: "Scope is adoption cost",
      },
      {
        type: "p",
        text: "The founder had a familiar problem: every customer conversation added a feature request, and every feature request felt like a requirement. The roadmap ballooned. The team shipped constantly—and still felt behind.",
      },
      {
        type: "p",
        text: "The turning point came during implementation. The customer didn’t need more capability; they needed clarity. The biggest blocker wasn’t missing functionality. It was ambiguity: who owned the workflow, what happened when something went wrong, and how the tool fit into existing handoffs.",
      },
      {
        type: "p",
        text: "So the team did something uncomfortable: they stopped building “nice” features and built one painfully clear workflow moment. They defined the single action that mattered most in the user’s day and optimized around it. Everything else moved to “later.”",
      },
      {
        type: "p",
        text: "What changed wasn’t just speed—it was trust. The customer could finally explain the tool to other teams. Training became simpler. Support requests dropped. The product felt more stable because it was less ambiguous.",
      },
      {
        type: "p",
        text: "The lesson: in healthcare, scope is not just engineering cost. It’s adoption cost. Every extra surface area creates questions, and questions create delays. A smaller product that is easier to operationalize often wins.",
      },
      {
        type: "p",
        text: "They also rewrote the product narrative. Instead of “here’s everything we do,” they led with “here’s the one workflow moment we make reliable.” Buyers could map that to their own processes immediately. The product became legible.",
      },
      {
        type: "p",
        text: "The founder kept a simple rule for new requests: if the request doesn’t improve the core workflow moment or reduce implementation effort, it goes into a parking lot. That rule reduced thrash—and made the team’s roadmap defensible to customers and investors.",
      },
    ],
  },
  {
    slug: "industry-insight-evidence-that-compounds",
    title: "Evidence That Compounds (Without Slowing Shipping)",
    excerpt:
      "Trust is cumulative—but only if you collect evidence in a way that fits the product lifecycle. Here’s a lightweight approach that strengthens credibility every month.",
    tag: "Industry Insight",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/5313152/pexels-photo-5313152.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Team working together in a meeting",
    publishedAt: "2026-04-02",
    seoTitle: "Evidence that compounds — Rellia Health",
    seoDescription: "A lightweight evidence loop that improves credibility without freezing product iteration.",
    body: [
      {
        type: "h2",
        text: "Build an evidence loop, not an evidence project",
      },
      {
        type: "p",
        text: "Many teams think of evidence as a big project: a study, a publication, a formal evaluation. That can be valuable, but it’s often too slow to support early-stage iteration. The result is a painful tradeoff: ship fast without credibility, or build credibility without shipping.",
      },
      {
        type: "p",
        text: "A better approach is an evidence loop—small, repeatable measurements that accumulate into a story stakeholders trust. The key is to tie evidence to decisions. If a metric won’t change a buyer’s decision, it’s not evidence; it’s trivia.",
      },
      {
        type: "p",
        text: "Start with operational measures that are easy to capture: time saved, fewer handoffs, reduced rework, faster throughput. Pair those with qualitative proof: a short quote from a workflow owner, a screenshot of adoption inside an existing tool, a before/after process map.",
      },
      {
        type: "p",
        text: "Then build your narrative like a ladder: workflow fit → operational impact → clinical relevance → financial value. You don’t need to jump to the top rung on day one. You need to show you’re climbing consistently.",
      },
      {
        type: "p",
        text: "When you run this loop monthly, credibility compounds. You’ll walk into meetings with proof that is legible to multiple stakeholders—and you won’t have to pause shipping to get it.",
      },
      {
        type: "p",
        text: "A practical cadence is: week 1 baseline, week 2 small change, week 3 measure impact, week 4 summarize and socialize. The summary should be one page. If it takes longer, you’re likely measuring the wrong thing or writing for the wrong audience.",
      },
      {
        type: "p",
        text: "The point isn’t to look like an academic lab. The point is to be trustworthy. Trust comes from consistency, transparency, and the ability to reproduce your claims—not from jargon.",
      },
    ],
  },
  {
    slug: "program-update-office-hours-to-decisions",
    title: "Program Update: Office Hours Redesigned Around Decisions",
    excerpt:
      "We rebuilt office hours so founders leave with one thing: a decision they can ship this week. Here’s the format and why it works.",
    tag: "Program Update",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/8133949/pexels-photo-8133949.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Team review session with notes and laptop",
    publishedAt: "2026-03-02",
    seoTitle: "Office hours redesigned around decisions — Rellia Health",
    seoDescription: "How we run office hours that translate questions into shippable next steps.",
    body: [
      {
        type: "h2",
        text: "Advice doesn’t compound—decisions do",
      },
      {
        type: "p",
        text: "Traditional office hours often feel productive in the moment—then nothing changes. The founder leaves with “things to think about,” and the week disappears. We wanted a different outcome: something concrete that improves execution immediately.",
      },
      {
        type: "p",
        text: "So we redesigned the session around decisions. Every question gets translated into: what decision needs to be made, who owns it, what information is missing, and what the smallest next action is to close the gap.",
      },
      {
        type: "p",
        text: "We timebox context. We pressure-test assumptions. We end with a written artifact: a one-page plan, a stakeholder map, a decision log entry, or a message the founder can send to a buyer to unblock the next step.",
      },
      {
        type: "p",
        text: "Over time, the effect compounds: fewer open loops, clearer ownership, and faster iteration. Founders stop collecting advice and start collecting outcomes.",
      },
      {
        type: "p",
        text: "We also track follow-through. Each founder returns with what happened after the decision: did the stakeholder respond, did the pilot progress, did the metric move? That feedback loop improves the quality of future decisions.",
      },
      {
        type: "p",
        text: "The result is a different kind of confidence. Not the confidence of having answers, but the confidence of having a repeatable way to turn uncertainty into the next step.",
      },
    ],
  },
  {
    slug: "industry-insight-commercialization-milestones-that-reduce-risk",
    title: "Commercialization Milestones That Actually Reduce Risk",
    excerpt:
      "Not all milestones change what’s true for the buyer. Here’s a checklist for choosing milestones that reduce clinical, operational, security, and financial risk.",
    tag: "Industry Insight",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Stethoscope on a medical document",
    publishedAt: "2026-04-24",
    body: [
      {
        type: "h2",
        text: "Design milestones for stakeholders, not vanity",
      },
      {
        type: "p",
        text: "Milestones should change what’s true. If a milestone doesn’t reduce uncertainty for a buyer, it’s probably vanity. The most useful milestones are the ones a stakeholder can point to and say, “This is why we can move forward.”",
      },
      {
        type: "p",
        text: "A strong milestone is specific and stakeholder-owned: a completed security review, a signed data-sharing agreement, a validated workflow map, or a measured operational improvement that survives scrutiny. These are not “growth” metrics—they’re risk metrics.",
      },
      {
        type: "p",
        text: "Start by naming the buyer’s fear. Then design milestones that remove reasons to say no. If the fear is implementation burden, produce a 30/60/90 plan. If the fear is patient safety, define clinical responsibility and escalation. If the fear is cost, prove an operational lever with transparent assumptions.",
      },
      {
        type: "p",
        text: "When milestones are designed this way, your roadmap becomes a risk-reduction engine. That’s what makes teams look inevitable—not because they’re loud, but because they’re predictable.",
      },
      {
        type: "p",
        text: "A helpful pattern is to make each milestone answer a stakeholder question. “Will it break something?” (IT) “Will it hurt patients?” (clinical) “Will it create extra work?” (operations) “Will it save money or unlock capacity?” (finance). Your milestones become a set of answers.",
      },
      {
        type: "p",
        text: "If you’re stuck, write the internal memo the buyer would need to justify the purchase. The missing sections of that memo usually point directly to your next milestone.",
      },
    ],
  },
  {
    slug: "founder-spotlight-the-first-clinical-champion",
    title: "Founder Spotlight: How We Found Our First Clinical Champion",
    excerpt:
      "Your first champion is not your biggest fan—they’re your first risk partner. Here’s what worked, what didn’t, and the script that finally got a real yes.",
    tag: "Founder Story",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/7651923/pexels-photo-7651923.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Team discussion in a professional setting",
    publishedAt: "2026-01-18",
    body: [
      {
        type: "h2",
        text: "Champions are risk partners",
      },
      {
        type: "p",
        text: "Finding a clinical champion often gets described as networking. In practice, it’s closer to product design. A real champion is someone who is willing to attach their name to the rollout—and that means they need risk clarity, not just enthusiasm.",
      },
      {
        type: "p",
        text: "The founder started by asking for “support.” That yielded warm conversations and vague offers. What changed was asking for ownership: “If we can reduce X burden and measure Y outcome, would you sponsor a pilot with your team?”",
      },
      {
        type: "p",
        text: "They also made the ask smaller and clearer: one workflow, one team, one metric, one month. Champions say yes when the commitment is bounded and the downside is understood.",
      },
      {
        type: "p",
        text: "The last step was giving the champion the tools to advocate internally: a one-page summary, a workflow map, and a list of stakeholder questions with pre-written answers. That’s when the pilot went from “interesting” to “scheduled.”",
      },
      {
        type: "p",
        text: "A subtle but important move was to listen for language of ownership. Champions say things like “my team,” “our process,” and “we need.” Supporters say things like “you should talk to.” The founder learned to optimize for ownership language, not compliments.",
      },
      {
        type: "p",
        text: "Once the first champion was secured, the second was easier. The founder could point to a real pilot plan, a real metric, and a real cadence. In healthcare, proof of seriousness attracts serious partners.",
      },
    ],
  },
  {
    slug: "program-update-how-we-run-founder-salons",
    title: "Program Update: How We Run Founder Salons That Actually Help",
    excerpt:
      "Founder salons can become performative. We designed ours to produce clarity: one constraint, one decision, and one next move per founder.",
    tag: "Program Update",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/5313131/pexels-photo-5313131.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "People collaborating in a focused working session",
    publishedAt: "2026-02-03",
    body: [
      {
        type: "h2",
        text: "Structure creates calm",
      },
      {
        type: "p",
        text: "A good salon isn’t a stage. It’s a workshop. We structure time so founders can surface one constraint and get help turning it into an actionable plan within the session.",
      },
      {
        type: "p",
        text: "We keep the group small. We force specificity. We prioritize the question that unlocks momentum in the next two weeks—not the question that sounds impressive.",
      },
      {
        type: "p",
        text: "The format is simple: context in 3 minutes, constraint in 1 sentence, then structured feedback. Each founder leaves with a decision and a message they can send to the next stakeholder that day.",
      },
      {
        type: "p",
        text: "Over time, founders report the same thing: less thrash, fewer competing priorities, and more consistent stakeholder alignment.",
      },
      {
        type: "p",
        text: "We also keep a running list of reusable patterns: the most effective email asks, the most common buyer objections, the best ways to scope a pilot, and the fastest paths through security review. That pattern library becomes a force multiplier for the whole group.",
      },
      {
        type: "p",
        text: "The best salons feel calm. That’s not because the problems are small—it’s because the conversation is structured. Clarity is the product, and structure is how we deliver it.",
      },
    ],
  },
  {
    slug: "industry-insight-implementation-is-a-product",
    title: "Implementation Is a Product, Not a Checklist",
    excerpt:
      "Implementation isn’t what happens after the sale. It’s part of what the buyer is buying. Here’s how to design onboarding that earns trust fast.",
    tag: "Industry Insight",
    featured: false,
    coverImageSrc: "https://images.pexels.com/photos/8133809/pexels-photo-8133809.jpeg?auto=compress&cs=tinysrgb&w=1600",
    coverImageAlt: "Work session with laptop and documents",
    publishedAt: "2026-03-20",
    body: [
      {
        type: "h2",
        text: "Design the rollout like you design the UI",
      },
      {
        type: "p",
        text: "Buyers don’t purchase software; they purchase outcomes with acceptable risk. Implementation is where that risk becomes real. If your implementation plan is vague, your product feels risky—even if the UI is great.",
      },
      {
        type: "p",
        text: "Design implementation like a product: clear steps, clear owners, clear success criteria, and clear support boundaries. Make the path legible to IT, operations, and clinical leads alike.",
      },
      {
        type: "p",
        text: "The best implementation plans are boring in the best way: predictable, documented, and easy to defend internally. That’s what gets you from pilot to rollout.",
      },
      {
        type: "p",
        text: "If you want a simple test: could a hospital PM run your rollout using your materials without you in the room? If not, your implementation product is incomplete.",
      },
      {
        type: "p",
        text: "Implementation becomes easier when you name the “unhappy paths.” What happens when a user can’t log in? When a data feed fails? When an alert is wrong? Hospitals aren’t scared of problems—they’re scared of surprises. Make your failure modes explicit.",
      },
      {
        type: "p",
        text: "And remember: the buyer’s operational reality is your product surface area. If your tool requires heroics to maintain, it will be replaced. If it fits into existing roles and routines, it will stick.",
      },
    ],
  },
]

export const getStoryBySlug = (slug: string): Story | undefined =>
  STORIES.find((s) => s.slug === slug)

export const getFeaturedStories = (): Story[] =>
  STORIES.filter((s) => s.featured)

