export type ProgramMeta = {
  title: string
  href: string
  imageSrc: string
  imageAlt: string
}

export const PROGRAM_META_BY_HREF: Record<string, ProgramMeta> = {
  "/programs/prototype-lab": {
    title: "Low-Fidelity Prototype Lab",
    href: "/programs/prototype-lab",
    imageSrc: "/images/programs-PrototypeLab.png",
    imageAlt: "Low-Fidelity Prototype Lab",
  },
  "/programs/regulatory": {
    title: "Regulatory Strategy Sprint",
    href: "/programs/regulatory",
    imageSrc: "/images/program-regulatoryRoadmap.png",
    imageAlt: "Regulatory Strategy Sprint",
  },
  "/programs/brand": {
    title: "Design Your Brand Strategy",
    href: "/programs/brand",
    imageSrc: "/images/programs-brandStrategy.png",
    imageAlt: "Design Your Brand Strategy",
  },
  "/programs/first-50": {
    title: "First 50 Users",
    href: "/programs/first-50",
    imageSrc: "/images/programs-first50Users.png",
    imageAlt: "First 50 Users",
  },
  "/programs/elevate-capital": {
    title: "Elevate: Healthcare Capital",
    href: "/programs/elevate-capital",
    imageSrc: "/images/programs-HealthcareCapital.png",
    imageAlt: "Elevate: Healthcare Capital",
  },
  "/programs/advisory-board-match": {
    title: "Advisory Board Match",
    href: "/programs/advisory-board-match",
    imageSrc: "/images/programs-AdvisoryBoard.png",
    imageAlt: "Advisory Board Match",
  },
  "/programs/ignite-pitch": {
    title: "Ignite: Pitch Foundations",
    href: "/programs/ignite-pitch",
    imageSrc: "/images/programs-IgnitepItch.png",
    imageAlt: "Ignite: Pitch Foundations",
  },
  "/programs/dataroom": {
    title: "Advance: Data Room Deep Dive",
    href: "/programs/dataroom",
    imageSrc: "/images/programs-DataRoom.png",
    imageAlt: "Advance: Data Room Deep Dive",
  },
}

