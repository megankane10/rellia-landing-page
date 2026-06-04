import { DIAGNOSTIC_SURVEY_SECTIONS } from "../client/data/diagnosticSurveySections";
import { PROGRAM_META_BY_HREF } from "../client/config/programMeta";

const DATA_MAP: Record<
  string,
  { mentor: string; program: string; programHref?: string }
> = {
  product_design: {
    mentor: "UX & Product Design",
    program: "Prototype Lab",
    programHref: "/programs/low-fidelity-prototype-lab",
  },
  product_dev: {
    mentor: "Engineering",
    program: "Build Your QMS",
    programHref: "/programs/build-your-quality-management-system",
  },
  clinical: {
    mentor: "Clinical Affairs",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory-strategy-sprint",
  },
  regulatory: {
    mentor: "Regulatory",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory-strategy-sprint",
  },
  legal: {
    mentor: "Legal & Privacy",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory-strategy-sprint",
  },
  ip: {
    mentor: "Intellectual Property",
    program: "Advance Dataroom",
    programHref: "/programs/advance-data-room-deep-dive",
  },
  reimbursement: {
    mentor: "Reimbursement",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory-strategy-sprint",
  },
  fundraising: {
    mentor: "Fundraising",
    program: "Elevate Capital",
    programHref: "/programs/elevate-healthcare-capital",
  },
  marketing: {
    mentor: "Marketing",
    program: "Brand Strategy",
    programHref: "/programs/design-your-brand-strategy",
  },
  gtm: {
    mentor: "Commercial Strategy",
    program: "First 50 Users",
    programHref: "/programs/first-50-users-clinical-feedback-intensive",
  },
  healthcare: {
    mentor: "Health Systems",
    program: "Advisory Board Match",
    programHref: "/programs/advisory-board-match",
  },
  operations: {
    mentor: "Operations & Scaling",
    program: "Ignite Pitch",
    programHref: "/programs/ignite-pitch-foundations",
  },
};

console.log("Resolving program metadata for all default section titles:");
for (const section of DIAGNOSTIC_SURVEY_SECTIONS) {
  const mapItem = DATA_MAP[section.id];
  if (!mapItem) {
    console.log(`- Section "${section.title}" (id: ${section.id}) has NO mapping in DATA_MAP`);
    continue;
  }
  const href = mapItem.programHref || "/programs";
  const meta = PROGRAM_META_BY_HREF[href];
  console.log(
    `- Section: "${section.title}" (id: ${section.id}) -> Program Href: "${href}" -> Meta Found: ${!!meta} (Image: ${
      meta?.imageSrc
    })`
  );
}
