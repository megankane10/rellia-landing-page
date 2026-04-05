import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const EFFECTIVE_DATE = "March 18, 2026";

const SECTIONS = [
  {
    title: "1. About Rellia Health",
    body: `Rellia Health is a digital health incubator that supports health technology founders through programming, education, community, and strategic resources. Our offerings include programs, events, mentorship, and online community, all designed to help early-stage health tech companies build a foundation for growth.\n\nThese Terms apply solely to Rellia Health Inc and its associated platforms, events, and content.`,
  },
  {
    title: "2. Scope of These Terms",
    body: `These Terms of Use apply to: Rellia Health's website and any associated online platforms or member portals; incubator programming, including structured programs, advisory meetings, and events (in-person and virtual); educational content, newsletters, and published resources; and community spaces, discussion forums, or group communications facilitated by Rellia Health.\n\nParticipation in specific programs may be subject to additional terms outlined in a program agreement or application process. In the event of a conflict, program-specific terms take precedence.`,
  },
  {
    title: "3. Regulatory or Legal Advice",
    body: `Content shared through our programs, events, webinars, newsletters, and other communications — including any content shared by Rellia Health's founders, team members, speakers, or mentors — is provided for general informational and educational purposes only.\n\nNothing shared within Rellia Health's programming constitutes formal regulatory, legal, or clinical advice, and should not be relied upon as such. Rellia Health expressly disclaims liability for any actions taken or not taken based on information shared in an educational or community context.`,
  },
  {
    title: "4. Program Participation",
    subsections: [
      {
        subtitle: "4.1 Eligibility",
        body: `Rellia Health's programs and community are intended for health technology founders, operators, and professionals at the early to growth stages of building a digital health or medical device company. We reserve the right to determine eligibility and admit participants at our discretion.`,
      },
      {
        subtitle: "4.2 Conduct",
        body: `Participants are expected to engage respectfully and professionally. By participating in Rellia Health programming, membership, or events, you agree not to: misrepresent your identity, credentials, or company; share confidential information belonging to other participants without consent; use programming, content, or connections made through Rellia Health for purposes that harm other participants or the broader community; or engage in harassment, discrimination, or disruptive behaviour at events or in community spaces.`,
      },
      {
        subtitle: "4.3 Removal",
        body: `Rellia Health reserves the right to remove any participant from a program, community, or event who violates these Terms or whose conduct is determined to be harmful to the community, without refund where fees have been paid.`,
      },
    ],
  },
  {
    title: "5. Intellectual Property",
    subsections: [
      {
        subtitle: "5.1 Rellia Health Content",
        body: `All content created by Rellia Health, including frameworks, curricula, presentations, templates, worksheets, recordings, and written materials, is owned by Rellia Health or its licensors and is protected by applicable intellectual property laws.`,
      },
      {
        subtitle: "5.2 Permitted Use",
        body: `Program or event participants, members, and website visitors may not reproduce, distribute, resell, sublicense, or share Rellia Health content without prior written permission.`,
      },
      {
        subtitle: "5.3 Recordings",
        body: `Rellia Health may record programs and events for educational or archival purposes. By participating, you consent to being recorded. Recordings remain the property of Rellia Health and may be shared with program participants or used in Rellia Health's marketing, unless you request otherwise in advance.`,
      },
      {
        subtitle: "5.4 Participant Content",
        body: `You retain ownership of any pitch materials or proprietary information you share within Rellia Health programming. By sharing such content, you grant Rellia Health a limited, non-exclusive license to use it for internal program purposes (e.g., facilitator feedback, cohort review). Rellia Health will not publicly share your proprietary business information without your consent.`,
      },
    ],
  },
  {
    title: "6. Fees and Payments",
    body: `Certain Rellia Health programs and membership tiers require payment of fees. Fee amounts, payment schedules, and refund terms will be communicated at the time of enrollment. Unless otherwise stated: fees are non-refundable once a program has commenced; Rellia Health reserves the right to modify program fees for future cohorts; and payment obligations are not contingent on program outcomes or results.`,
  },
  {
    title: "7. Third-Party Speakers, Mentors, and Resources",
    body: `Rellia Health programming regularly features guest speakers, mentors, and external experts. The views, opinions, and information shared by third parties do not necessarily reflect the positions of Rellia Health. Rellia Health is not responsible for the accuracy of third-party content and does not endorse any specific products, services, or regulatory strategies referenced by speakers or mentors.\n\nOur website and materials may also include links to external resources, content, and tools. These links are provided for convenience only. Rellia Health is not responsible for the content, accuracy, or practices of third-party websites.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `To the fullest extent permitted by applicable law, Rellia Health, its founders, team members, and affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your participation in our programs or use of our content, platforms, or communications.\n\nRellia Health does not guarantee any specific outcome, funding result, regulatory approval, or business success as a result of participation in its programming.\n\nRellia Health's total liability for any claim arising under these Terms shall not exceed the fees paid by you to Rellia Health in the three (3) months preceding the claim, or CAD $200, whichever is greater.`,
  },
  {
    title: "9. Privacy",
    body: `Your participation in Rellia Health programs and membership involves the collection and use of personal information. Please review our Privacy Policy, available on our website, to understand how we handle your data. By using our services, you consent to the practices described in that policy.`,
  },
  {
    title: "10. Governing Law",
    body: `These Terms of Use are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes shall be subject to the exclusive jurisdiction of the courts of Ontario, Canada.`,
  },
  {
    title: "11. Changes to These Terms",
    body: `Rellia Health may update these Terms from time to time. Updates will be posted on our website with a revised effective date. Continued participation in our programs or use of our platforms following any update constitutes acceptance of the revised Terms.`,
  },
  {
    title: "12. Contact",
    contactInfo: {
      intro: "Questions about these Terms? Reach us at",
      email: "hello@relliahealth.com",
      lines: ["Rellia Health", "Ontario, Canada"],
      websiteLabel: "relliahealth.com",
      websiteHref: "https://www.relliahealth.com",
    },
  },
];

type Section = {
  title: string;
  body?: string;
  subsections?: { subtitle: string; body: string }[];
  contactInfo?: {
    intro: string;
    email: string;
    lines: string[];
    websiteLabel: string;
    websiteHref: string;
  };
};

const sectionTitleClass =
  "font-host-grotesk text-2xl md:text-3xl font-bold tracking-tight text-rellia-teal border-b border-black/10 pb-4 mb-6";

const subsectionTitleClass =
  "font-host-grotesk text-lg md:text-xl font-semibold tracking-tight text-rellia-teal mb-3";

function SectionBlock({ section }: { section: Section }) {
  if (section.contactInfo) {
    const c = section.contactInfo;
    return (
      <div>
        <h2 className={sectionTitleClass}>{section.title}</h2>
        <p className="mb-3 text-black/80 text-lg font-urbanist leading-relaxed">
          {c.intro}{" "}
          <a
            href={`mailto:${c.email}`}
            className="font-medium text-rellia-teal underline decoration-rellia-teal/30 underline-offset-2 transition-colors hover:text-rellia-teal/80 hover:decoration-rellia-teal"
          >
            {c.email}
          </a>
          .
        </p>
        <div
          className="mt-12 flex w-full min-w-0 flex-row flex-nowrap items-center font-urbanist text-sm leading-snug text-black/80 sm:mt-16 sm:text-base md:text-lg"
          role="group"
          aria-label="Rellia Health contact details"
        >
          <div className="flex min-w-0 flex-1 items-center justify-start pr-2">
            <span className="truncate font-host-grotesk font-semibold text-rellia-teal">{c.lines[0]}</span>
          </div>
          <span className="shrink-0 px-1 text-black/30 sm:px-2" aria-hidden>
            |
          </span>
          <div className="flex min-w-0 flex-1 items-center justify-center px-1 text-center">
            <span>{c.lines[1]}</span>
          </div>
          <span className="shrink-0 px-1 text-black/30 sm:px-2" aria-hidden>
            |
          </span>
          <div className="flex min-w-0 flex-1 items-center justify-end pl-2 text-right">
            <a
              href={c.websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-medium text-rellia-teal underline decoration-rellia-teal/30 underline-offset-2 transition-colors hover:text-rellia-teal/80"
            >
              {c.websiteLabel}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className={sectionTitleClass}>{section.title}</h2>
      {section.body && (
        <div className="space-y-4">
          {section.body.split("\n\n").map((para, i) => (
            <p key={i} className="text-black/70 text-lg font-urbanist leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      )}
      {section.subsections && (
        <div className="space-y-8">
          {section.subsections.map((sub) => (
            <div key={sub.subtitle}>
              <h3 className={subsectionTitleClass}>{sub.subtitle}</h3>
              <p className="text-black/70 text-lg font-urbanist leading-relaxed">{sub.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative flex h-[28rem] flex-shrink-0 flex-col overflow-hidden bg-rellia-teal pt-32 pb-12 md:h-[32rem] md:pt-40 md:pb-16">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rellia-mint via-transparent to-transparent blur-3xl" />
          </div>

          <img
            src="/images/hologram-logo.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[70%] md:h-[90%] w-auto object-contain opacity-[0.07] select-none"
          />

          <div className="relative z-10 mx-auto flex w-full max-w-[1300px] flex-1 flex-col justify-center px-6 md:px-10">
            <ScrollReveal>
              <p className="text-rellia-mint/80 text-sm md:text-base font-urbanist uppercase tracking-widest mb-4">
                Effective {EFFECTIVE_DATE}
              </p>
              <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
                Terms of <span className="text-rellia-mint">Use</span>
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-2xl font-urbanist leading-relaxed">
                Please read these Terms of Use carefully before participating in Rellia Health's programs, accessing our platforms, or engaging with our content. By using our services, you agree to be bound by these terms.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Body */}
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-[860px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="space-y-12">
                {SECTIONS.map((section) => (
                  <SectionBlock key={section.title} section={section} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}