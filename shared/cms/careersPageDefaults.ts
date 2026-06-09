import { mergeNetworkWhyFeatures } from "./networkPageDefaults"
import type { CareersPageContent, NetworkFeatureItem } from "./types"

export const DEFAULT_CAREERS_WHY_FEATURES: NetworkFeatureItem[] = [
  {
    iconKey: "users",
    title: "Mission you can feel",
    body:
      "Every week you will see founders ship, learn, and reset with support from people who have been in the room when healthcare products actually get adopted.",
    imageSrc:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    iconKey: "target",
    title: "Craft, not chaos",
    body:
      "We run tight programs with clear owners, thoughtful rituals, and space to improve how we work—so energy goes to members and outcomes, not noise.",
    imageSrc:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    iconKey: "bookOpen",
    title: "Learn beside experts",
    body:
      "You will sit alongside clinicians, operators, and investors who care about getting the details right—from diligence to deployment.",
    imageSrc:
      "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    iconKey: "userRound",
    title: "Humans first",
    body:
      "Kindness is not a slogan here. We expect high standards and direct feedback, and we build trust by showing up for each other and the community.",
    imageSrc:
      "https://images.pexels.com/photos/3184369/pexels-photo-3184369.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
]

export const DEFAULT_CAREERS_PERKS: NetworkFeatureItem[] = [
  {
    iconKey: "users",
    title: "In the room with the industry",
    body:
      "Clinicians, founders, and operators show up in our programs—you hear what actually moves care and procurement, not polished slide stories.",
  },
  {
    iconKey: "building2",
    title: "Office when it helps",
    body:
      "Remote-first with intentional in-person weeks: cohort sessions, workshops, and shared space when you want to work beside the team.",
  },
  {
    iconKey: "laptop",
    title: "Small team, real ownership",
    body:
      "Startup reality: clear priorities, Direct feedback, and permission to fix how we work—without layers of process for its own sake.",
  },
  {
    iconKey: "mapPin",
    title: "Out with the community",
    body:
      "Member events, partner conversations, and field context on how buying decisions get made—so you are not guessing from a distance.",
  },
]

export const DEFAULT_CAREERS_PAGE: CareersPageContent = {
  heroEyebrow: "Join the team",
  heroTitle: "Build the",
  heroAccentPhrase: "future of health",
  heroTitleSuffix: "at Rellia",
  heroSubtitle:
    "We connect founders, clinicians, and capital so the right ideas reach patients. If you thrive in fast-moving, mission-driven environments, we would love to meet you.",
  heroImageSrc: "/images/careers-img.jpg",
  whyTitle: "Building What Matters Most",
  whyDescription:
    "What it feels like to build here: pace without panic, depth without gatekeeping, and a team that sweats the small stuff so members do not have to.",
  whyFeatures: DEFAULT_CAREERS_WHY_FEATURES,
  perksTitle: "How we work",
  perksDescription:
    "A lean health-tech team: industry proximity, intentional office time, and the pace of a startup—not a corporate perks sheet.",
  perksItems: DEFAULT_CAREERS_PERKS,
  openRolesTitle: "Open Roles",
  ctaTitle: "Questions before you apply?",
  ctaBody: "Tell us what you are looking for—we are happy to point you to the right conversation.",
  ctaPrimaryLabel: "Get in touch",
  ctaPrimaryHref: "/contact",
}

const mergePerksItems = (
  cms: NetworkFeatureItem[] | null | undefined,
  defaults: NetworkFeatureItem[],
): NetworkFeatureItem[] =>
  defaults.map((defaultItem, index) => {
    const cmsItem = cms?.[index]
    if (!cmsItem) return defaultItem
    return {
      ...defaultItem,
      ...cmsItem,
      title: cmsItem.title?.trim() || defaultItem.title,
      body: cmsItem.body?.trim() || defaultItem.body,
      iconKey: cmsItem.iconKey?.trim() || defaultItem.iconKey,
    }
  })

export const mergeCareersPage = (
  cms?: Partial<CareersPageContent> | null,
): CareersPageContent => ({
  ...DEFAULT_CAREERS_PAGE,
  ...cms,
  heroEyebrow: cms?.heroEyebrow?.trim() || DEFAULT_CAREERS_PAGE.heroEyebrow,
  heroTitle: cms?.heroTitle?.trim() || DEFAULT_CAREERS_PAGE.heroTitle,
  heroAccentPhrase: cms?.heroAccentPhrase?.trim() || DEFAULT_CAREERS_PAGE.heroAccentPhrase,
  heroTitleSuffix: cms?.heroTitleSuffix?.trim() || DEFAULT_CAREERS_PAGE.heroTitleSuffix,
  heroSubtitle: cms?.heroSubtitle?.trim() || DEFAULT_CAREERS_PAGE.heroSubtitle,
  heroImageSrc: cms?.heroImageSrc?.trim() || DEFAULT_CAREERS_PAGE.heroImageSrc,
  whyTitle: cms?.whyTitle?.trim() || DEFAULT_CAREERS_PAGE.whyTitle,
  whyDescription: cms?.whyDescription?.trim() || DEFAULT_CAREERS_PAGE.whyDescription,
  whyFeatures: mergeNetworkWhyFeatures(cms?.whyFeatures, DEFAULT_CAREERS_WHY_FEATURES),
  perksTitle: cms?.perksTitle?.trim() || DEFAULT_CAREERS_PAGE.perksTitle,
  perksDescription: cms?.perksDescription?.trim() || DEFAULT_CAREERS_PAGE.perksDescription,
  perksItems: mergePerksItems(cms?.perksItems, DEFAULT_CAREERS_PERKS),
  openRolesTitle: cms?.openRolesTitle?.trim() || DEFAULT_CAREERS_PAGE.openRolesTitle,
  ctaTitle: cms?.ctaTitle?.trim() || DEFAULT_CAREERS_PAGE.ctaTitle,
  ctaBody: cms?.ctaBody?.trim() || DEFAULT_CAREERS_PAGE.ctaBody,
  ctaPrimaryLabel: cms?.ctaPrimaryLabel?.trim() || DEFAULT_CAREERS_PAGE.ctaPrimaryLabel,
  ctaPrimaryHref: cms?.ctaPrimaryHref?.trim() || DEFAULT_CAREERS_PAGE.ctaPrimaryHref,
})
