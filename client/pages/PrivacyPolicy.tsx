import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import PageHeader from "@/components/PageHeader"

const EFFECTIVE_DATE = "March 18, 2026";

type BulletGroup = {
  label?: string;
  items: string[];
};

type Section = {
  title: string;
  /** Plain paragraphs (split on \\n\\n) */
  body?: string;
  /** Text before bullet groups */
  preamble?: string;
  /** Grouped bullets with optional subheadings */
  bulletGroups?: BulletGroup[];
  /** One list without sub-groups */
  bullets?: string[];
  /** Paragraph(s) after bullets */
  closing?: string;
  contactInfo?: {
    intro: string
    email: string
  }
};

const SECTIONS: Section[] = [
  {
    title: "1. Who We Are",
    body: `Rellia Health is a digital health incubator incorporated in Ontario, Canada. We provide programming, resources, community, and advisory support to health technology founders. This Privacy Policy applies solely to Rellia Health and does not cover any separate Rellia entities or affiliates.`,
  },
  {
    title: "2. Information We Collect",
    preamble: "We collect personal information in the following ways:",
    bulletGroups: [
      {
        label: "Information you provide directly:",
        items: [
          "Name, email address, phone number, and company name",
          "Professional background, stage of company development, and area of focus (collected via intake forms, applications, and surveys)",
          "Information shared in written communications, event registrations, or program applications",
          "Payment information for program and membership fees (processed through secure third-party payment processors — Rellia Health does not store payment card data)",
        ],
      },
      {
        label: "Information collected automatically when you visit our website:",
        items: [
          "IP address and general location",
          "Device type, browser, and operating system",
          "Pages visited, time spent, and referral sources (collected via cookies and analytics tools)",
          "Email open and click data for our newsletters and program communications",
        ],
      },
      {
        label: "Information from third parties:",
        items: [
          "If you connect with us via social media, an event platform, or a partner organization, we may receive information you have shared through those channels",
        ],
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    preamble: "We use your personal information to:",
    bullets: [
      "Assess applications and enroll participants in incubator programs",
      "Deliver programming, events, workshops, and webinars",
      "Communicate with you about your participation, program updates, and scheduling",
      "Send newsletters, event invitations, and educational content you have opted into",
      "Process payments and maintain records of program fees",
      "Improve our programming and website based on how participants and visitors engage with us",
      "Comply with applicable legal obligations",
    ],
    closing:
      "We do not sell your personal information to third parties, and we do not use it for automated decision-making that produces legal or similarly significant effects on you.",
  },
  {
    title: "4. Sharing Your Information",
    preamble:
      "Rellia Health does not sell or rent personal information. We may share it with:",
    bullets: [
      "Service providers who support our operations — including our CRM, email platform, event registration tools, and payment processor — under contractual data protection terms",
      "Guest speakers, mentors, or facilitators, to the extent needed to coordinate your participation in a program (limited to name and contact details)",
      "Professional advisors on a strict need-to-know basis or when mutually agreed upon to provide approved advisory services",
      "Regulatory or law enforcement authorities where required by law",
      "A successor entity in the event of a business transfer or acquisition, with notice provided to affected individuals",
    ],
    closing:
      "We require all third-party service providers to use your information only for the purposes we specify and to maintain appropriate security standards.",
  },
  {
    title: "5. Community Spaces",
    body: `Rellia Health programming and events often take place in shared environments where other participants may see or hear information you share. Please exercise your own judgment about what you disclose in these settings. Rellia Health is not responsible for how other participants handle information shared voluntarily in community spaces.`,
  },
  {
    title: "6. Cookies",
    body: `Our website uses cookies to support functionality and understand how visitors engage with our content. This includes essential cookies (required for the site to work), analytics cookies (to measure traffic and usage), and marketing cookies (to track communications performance, where you have consented).

You may disable cookies through your browser settings. Doing so may affect parts of the site experience.`,
  },
  {
    title: "7. Data Retention",
    preamble:
      "We retain personal information for as long as necessary to fulfil the purpose for which it was collected:",
    bullets: [
      "Paid participant records are retained for a minimum of seven (7) years following payment completion, consistent with applicable legal and tax requirements",
      "Marketing contact information is retained until you withdraw consent or request deletion",
      "Website analytics data is retained in accordance with our analytics provider's default retention settings",
    ],
    closing: "When personal information is no longer needed, we delete or anonymize it securely.",
  },
  {
    title: "8. Your Rights",
    preamble: "You have the right to:",
    bullets: [
      "Access the personal information we hold about you",
      "Request correction of inaccurate or incomplete information",
      "Withdraw consent for marketing communications at any time (via the unsubscribe link in any email, or by contacting us)",
      "Request deletion of your personal information, subject to any legal retention obligations",
      "Ask how your information is being used",
    ],
    closing: "To exercise any of these rights, contact us at the address below.",
  },
  {
    title: "9. Security",
    body: `We take reasonable administrative, technical, and physical steps to protect your personal information from unauthorized access, use, or disclosure. However, no digital transmission or storage system is completely secure. In the event of a privacy breach that poses a real risk of significant harm, we will notify affected individuals and the Office of the Privacy Commissioner of Canada as required by law.`,
  },
  {
    title: "10. Cross-Border Data",
    body: `Rellia Health is incorporated in Ontario, Canada, and serves founders globally. Your information may be stored or processed in another country, through service providers operating in those jurisdictions. Where data crosses borders, we take steps to ensure appropriate protections are in place.`,
  },
  {
    title: "11. Children's Privacy",
    body: `Rellia Health's programs are intended for adult professionals. We do not knowingly collect personal information from individuals under the age of 16. If you believe we have inadvertently done so, please contact us and we will take steps to delete it.`,
  },
  {
    title: "12. Updates to This Policy",
    body: `We may update this Privacy Policy from time to time. Changes will be posted on our website with a revised effective date. For material changes, we will provide notice through appropriate channels. Continued use of our services following an update constitutes acceptance of the revised policy.`,
  },
  {
    title: "13. Contact",
    contactInfo: {
      intro: "Questions, access requests, or privacy concerns can be directed to",
      email: "hello@relliahealth.com",
    },
  },
];

const sectionTitleClass =
  "font-host-grotesk text-2xl md:text-3xl font-bold tracking-tight text-rellia-teal border-b border-black/10 pb-4 mb-6";

const bulletListClass =
  "list-disc space-y-2 pl-6 font-urbanist text-lg leading-relaxed text-black/70 marker:text-rellia-mint";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className={bulletListClass}>
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
}

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
        <p className="mt-12 max-w-none text-lg leading-relaxed text-black/70 font-urbanist sm:mt-16">
          If you are unsatisfied with our response, you may contact the Office of the Privacy Commissioner of
          Canada at{" "}
          <a
            href="https://www.priv.gc.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-rellia-teal underline decoration-rellia-teal/30 underline-offset-2 transition-colors hover:text-rellia-teal/80"
          >
            www.priv.gc.ca
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

      {section.bulletGroups?.map((group) => (
        <div key={group.label ?? "group"} className={group.label ? "mb-8 last:mb-0" : "mb-6"}>
          {group.label ? (
            <p className="mb-3 font-host-grotesk text-base font-semibold text-rellia-teal md:text-lg">
              {group.label}
            </p>
          ) : null}
          <BulletList items={group.items} />
        </div>
      ))}

      {section.bullets?.length ? (
        <div className="mb-6">
          <BulletList items={section.bullets} />
        </div>
      ) : null}

      {section.closing ? (
        <p className="mt-6 text-black/70 text-lg font-urbanist leading-relaxed">{section.closing}</p>
      ) : null}

      {section.body ? (
        <div className="space-y-4">
          {section.body.split("\n\n").map((para, i) => (
            <p key={i} className="text-black/70 text-lg font-urbanist leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <PageHeader
          variant="dark"
          subtitle={`Effective ${EFFECTIVE_DATE}`}
          title={
            <>
              Privacy <span className="text-rellia-mint">Policy</span>
            </>
          }
        />

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[860px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <p className="text-rellia-teal font-urbanist text-lg font-medium leading-relaxed mb-6">
                Rellia Health is committed to handling your personal information with care and transparency. This Privacy Policy describes how we collect, use, store, and share information in connection with our incubator programs, events, community, website, and communications.
              </p>
              <p className="mb-10 text-lg font-urbanist italic leading-relaxed text-black/65 md:mb-12 md:text-xl">
                Rellia Health operates in accordance with the Personal Information Protection and Electronic Documents
                Act (PIPEDA) and applicable provincial privacy legislation in Canada.
              </p>
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
