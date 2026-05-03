import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import PageHeader from "@/components/PageHeader"

const EFFECTIVE_DATE = "March 18, 2026";

const SECTIONS = [
  {
    title: "1. About Rellia Health",
    body: `Rellia Health is a digital health incubator that supports health technology founders through programming, education, community, and strategic resources. Our offerings include programs, events, mentorship, and online community, all designed to help early-stage health tech companies build a foundation for growth.\n\nThese Terms apply solely to Rellia Health Inc and its associated platforms, events, and content.`,
  },
  {
    title: "2. Scope of These Terms",
    preamble: "These Terms of Use apply to:",
    bullets: [
      "Rellia Health's website and any associated online platforms or member portals",
      "Incubator programming, including structured programs, advisory meetings, and events (in-person and virtual)",
      "Educational content, newsletters, and published resources",
      "Community spaces, discussion forums, or group communications facilitated by Rellia Health",
    ],
    closing:
      "Participation in specific programs may be subject to additional terms outlined in a program agreement or application process. In the event of a conflict, program-specific terms take precedence.",
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
        body: `Participants are expected to engage respectfully and professionally. By participating in Rellia Health programming, membership, or events, you agree not to:`,
        bullets: [
          "Misrepresent your identity, credentials, or company",
          "Share confidential information belonging to other participants without consent",
          "Use programming, content, or connections made through Rellia Health for purposes that harm other participants or the broader community",
          "Engage in harassment, discrimination, or disruptive behaviour at events or in community spaces",
        ],
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
    preamble:
      "Certain Rellia Health programs and membership tiers require payment of fees. Fee amounts, payment schedules, and refund terms will be communicated at the time of enrollment. Unless otherwise stated:",
    bullets: [
      "Fees are non-refundable once a program has commenced",
      "Rellia Health reserves the right to modify program fees for future cohorts",
      "Payment obligations are not contingent on program outcomes or results",
    ],
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
    },
  },
];

type Subsection = {
  subtitle: string;
  body?: string;
  bullets?: string[];
};

type Section = {
  title: string;
  body?: string;
  preamble?: string;
  bullets?: string[];
  closing?: string;
  subsections?: Subsection[];
  contactInfo?: {
    intro: string
    email: string
  }
};

const sectionTitleClass =
  "font-host-grotesk text-2xl md:text-3xl font-bold tracking-tight text-rellia-teal border-b border-black/10 pb-4 mb-6";

const subsectionTitleClass =
  "font-host-grotesk text-lg md:text-xl font-semibold tracking-tight text-rellia-teal mb-3";

const bulletListClass =
  "list-disc space-y-2 pl-6 font-urbanist text-lg leading-relaxed text-black/70 marker:text-rellia-mint";

const BulletList = ({ items }: { items: string[] }) => (
  <ul className={bulletListClass}>
    {items.map((item) => (
      <li key={item} className="pl-1">
        {item}
      </li>
    ))}
  </ul>
);

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
      </div>
    );
  }

  return (
    <div>
      <h2 className={sectionTitleClass}>{section.title}</h2>
      {section.preamble ? (
        <p className="mb-4 text-black/80 text-lg font-urbanist leading-relaxed">{section.preamble}</p>
      ) : null}
      {section.bullets?.length ? (
        <div className="mb-6">
          <BulletList items={section.bullets} />
        </div>
      ) : null}
      {section.closing ? (
        <p className="text-black/70 text-lg font-urbanist leading-relaxed">{section.closing}</p>
      ) : null}
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
              {sub.body ? (
                <p
                  className={
                    sub.bullets?.length
                      ? "mb-4 text-black/70 text-lg font-urbanist leading-relaxed"
                      : "text-black/70 text-lg font-urbanist leading-relaxed"
                  }
                >
                  {sub.body}
                </p>
              ) : null}
              {sub.bullets?.length ? <BulletList items={sub.bullets} /> : null}
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

      <main id="main-content">
        <PageHeader
          variant="dark"
          effectiveDate={EFFECTIVE_DATE}
          title={
            <>
              Terms of <span className="text-rellia-mint">Use</span>
            </>
          }
          subtitle="Please read these Terms of Use carefully before participating in Rellia Health's programs, accessing our platforms, or engaging with our content. By using our services, you agree to be bound by these terms."
        />

        <section className="py-16 md:py-24 bg-white">
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