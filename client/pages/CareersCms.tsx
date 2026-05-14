import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta from "@/components/RelliaCta"
import RelliaAction from "@/components/RelliaAction"
import PillTag from "@/components/PillTag"
import WhyRellia from "@/components/WhyRellia"
import { FilloutStandardEmbed } from "@fillout/react"
import { FILLOUT_APPLY_FORM_ID, FILLOUT_EMBED_VIEWPORT_MIN_CLASS } from "@/lib/filloutApplyForm"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion, useReducedMotion } from "framer-motion"
import { BriefcaseBusiness, Building2, ExternalLink, Laptop, MapPin, Users } from "lucide-react"
import type { CareersPageContent, HomeWhyFeature } from "@shared/cms/types"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { CAREERS_VOLUNTEER_ENABLED, careersHasPublishedOpenRoles } from "@shared/careersPageConfig"
import { CAREERS_OPEN_ROLES } from "@shared/careersOpenRoles"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { sanityFetch } from "@/lib/sanity"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { useMemo, useState } from "react"

const g = DEFAULT_GLOBAL_SETTINGS

/** Pexels — team, collaboration, workspace (hotlinked per Pexels guidelines) */
const TEAM_MARQUEE_IMAGES: string[] = [
  "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900",
]

const CAREERS_WHY_FEATURES: HomeWhyFeature[] = [
  {
    iconKey: "users",
    title: "Mission you can feel",
    description:
      "Every week you will see founders ship, learn, and reset with support from people who have been in the room when healthcare products actually get adopted.",
  },
  {
    iconKey: "target",
    title: "Craft, not chaos",
    description:
      "We run tight programs with clear owners, thoughtful rituals, and space to improve how we work—so energy goes to members and outcomes, not noise.",
  },
  {
    iconKey: "bookOpen",
    title: "Learn beside experts",
    description:
      "You will sit alongside clinicians, operators, and investors who care about getting the details right—from diligence to deployment.",
  },
  {
    iconKey: "userRound",
    title: "Humans first",
    description:
      "Kindness is not a slogan here. We expect high standards and direct feedback, and we build trust by showing up for each other and the community.",
  },
]

const CAREERS_WHY_CARD_IMAGES: string[] = [
  "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/3184369/pexels-photo-3184369.jpeg?auto=compress&cs=tinysrgb&w=1200",
]

const CAREERS_PERKS: HomeWhyFeature[] = [
  {
    iconKey: "users",
    title: "In the room with the industry",
    description:
      "Clinicians, founders, and operators show up in our programs—you hear what actually moves care and procurement, not polished slide stories.",
  },
  {
    iconKey: "building2",
    title: "Office when it helps",
    description:
      "Remote-first with intentional in-person weeks: cohort sessions, workshops, and shared space when you want to work beside the team.",
  },
  {
    iconKey: "laptop",
    title: "Small team, real ownership",
    description:
      "Startup reality: clear priorities, direct feedback, and permission to fix how we work—without layers of process for its own sake.",
  },
  {
    iconKey: "mapPin",
    title: "Out with the community",
    description:
      "Member events, partner conversations, and field context on how buying decisions get made—so you are not guessing from a distance.",
  },
]

const joinTeamMarqueeImages = [...TEAM_MARQUEE_IMAGES, ...TEAM_MARQUEE_IMAGES]

const JOIN_TEAM_MARQUEE_LOOP_SEC = 56

/** Shared geometry + mint sweep hover so primary and outline CTAs match pixel-for-pixel */
const joinTeamCtaSharedClass = cn(
  "group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-rellia-teal outline-none",
  "px-8 py-3.5 font-host-grotesk text-base font-semibold leading-none tracking-tight md:px-10 md:py-4 md:text-lg",
  "transition-[transform,box-shadow,border-color,background-color] duration-300 motion-reduce:transition-none",
  "before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:rounded-full before:bg-rellia-mint before:transition-transform before:duration-300 before:ease-out",
  "hover:before:scale-x-100",
  "focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-greyTeal",
  "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg",
)

type CareersJoinTeamCta = {
  href?: string
  onClick?: () => void
  label: string
  ariaLabel: string
}

/** Grey-teal band: fixed viewport height; marquee overflows horizontally with soft edge mask */
const CareersJoinTeamSection = ({
  primaryCta,
  secondaryCta,
  showVolunteerForm,
}: {
  primaryCta: CareersJoinTeamCta | null
  secondaryCta: CareersJoinTeamCta | null
  showVolunteerForm: boolean
}) => {
  const reduceMotion = useReducedMotion()

  /** Narrow fade only at viewport edges; full-opacity center so the strip clearly overflows */
  const marqueeMaskStyle = {
    maskImage:
      "linear-gradient(90deg, transparent 0%, black 1.25%, black 98.75%, transparent 100%)",
    WebkitMaskImage:
      "linear-gradient(90deg, transparent 0%, black 1.25%, black 98.75%, transparent 100%)",
  } as const

  const joinTeamImageTileClass =
    "relative h-40 w-[12rem] shrink-0 overflow-hidden rounded-2xl sm:h-[13.5rem] sm:w-[13.5rem] md:h-[15rem] md:w-[16.5rem] lg:h-[16.5rem] lg:w-[19rem]"

  return (
    <section className="relative z-[2] w-full overflow-x-hidden bg-white">
      <div className="relative flex min-h-0 shrink-0 flex-col overflow-x-hidden bg-rellia-greyTeal py-10 pb-16 md:h-[80svh] md:max-h-[80svh] md:pb-14 md:py-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/15 via-rellia-greyTeal to-rellia-mint/15" />
          <div className="absolute inset-0 opacity-90 [background:radial-gradient(ellipse_120%_70%_at_0%_0%,rgba(157,214,208,0.35),transparent_55%),radial-gradient(ellipse_90%_60%_at_100%_15%,rgba(13,53,64,0.18),transparent_50%),radial-gradient(ellipse_80%_55%_at_50%_100%,rgba(157,214,208,0.22),transparent_52%),radial-gradient(ellipse_45%_40%_at_75%_55%,rgba(255,255,255,0.14),transparent_45%)]" />
          <div className="absolute inset-0 opacity-[0.65] mix-blend-soft-light [background-image:radial-gradient(ellipse_85%_45%_at_12%_-8%,rgba(255,255,255,0.2),transparent_55%),radial-gradient(ellipse_70%_50%_at_92%_22%,rgba(157,214,208,0.2),transparent_50%),radial-gradient(ellipse_60%_42%_at_48%_92%,rgba(13,53,64,0.1),transparent_52%)]" />
          <div className="absolute -right-[10%] top-[-8%] h-[min(68vw,26rem)] w-[min(68vw,26rem)] rounded-full bg-gradient-to-bl from-rellia-mint/40 via-rellia-mint/15 to-transparent blur-[76px] md:top-0 md:h-[30rem] md:w-[30rem] md:blur-[92px]" />
          <div className="absolute -left-[16%] top-[22%] h-[min(78vw,24rem)] w-[min(78vw,24rem)] rounded-[55%] bg-gradient-to-tr from-rellia-teal/28 via-rellia-teal/8 to-transparent blur-[84px]" />
          <div className="absolute left-[55%] top-[35%] h-[min(70vw,22rem)] w-[min(85vw,28rem)] -translate-x-1/2 rounded-[48%] bg-gradient-to-b from-rellia-mint/25 via-rellia-teal/10 to-transparent blur-[88px] md:left-1/2" />
          <div className="absolute -right-[4%] bottom-[0%] h-[min(55vw,18rem)] w-[min(55vw,20rem)] rounded-full bg-gradient-to-t from-white/30 via-rellia-mint/12 to-transparent blur-[70px]" />
          <div className="absolute left-[-8%] bottom-[8%] h-[min(50vw,16rem)] w-[min(60vw,20rem)] rounded-[45%] bg-gradient-to-br from-rellia-mint/20 to-transparent blur-[64px]" />
          <div className="absolute right-[20%] top-[12%] h-[min(40vw,12rem)] w-[min(48vw,14rem)] rounded-full bg-gradient-to-br from-white/22 to-rellia-mint/10 blur-[56px] md:right-[18%]" />
          <div className="absolute left-0 top-0 h-[280px] w-[200px] -translate-x-[72px] md:h-[340px] md:w-[240px] md:-translate-x-[88px]">
            <div className="absolute left-8 top-8 h-[220px] w-[2px] bg-gradient-to-b from-rellia-mint/45 via-rellia-mint/15 to-transparent md:h-[280px]" />
            <div className="absolute left-12 top-12 h-[200px] w-px bg-gradient-to-b from-rellia-mint/35 via-white/12 to-transparent md:h-[260px]" />
            <div className="absolute left-16 top-4 h-[240px] w-[2px] bg-gradient-to-b from-rellia-mint/38 via-rellia-mint/12 to-transparent md:h-[300px]" />
            <div className="absolute left-[4.5rem] top-10 h-[210px] w-px bg-gradient-to-b from-white/20 via-rellia-mint/10 to-transparent md:h-[270px]" />
            <div className="absolute left-[5.5rem] top-14 h-[190px] w-[2px] bg-gradient-to-b from-rellia-mint/32 via-white/8 to-transparent md:h-[250px]" />
            <div className="absolute left-[6.75rem] top-6 h-[230px] w-px bg-gradient-to-b from-rellia-mint/28 via-rellia-mint/8 to-transparent md:h-[290px]" />
            <div className="absolute left-[8rem] top-16 h-[180px] w-[2px] bg-gradient-to-b from-white/14 via-rellia-mint/12 to-transparent md:h-[240px]" />
          </div>
        </div>

        <div className="relative z-10 flex h-full min-h-0 w-full flex-1 flex-col">
          <div className="mx-auto w-full max-w-[1300px] shrink-0 px-6 md:px-10">
            <h2 className="max-w-3xl font-host-grotesk text-3xl font-bold leading-[1.12] tracking-tight text-black sm:text-[2rem] md:text-4xl lg:max-w-4xl lg:text-[2.65rem]">
              Help us <span className="text-rellia-teal">empower the founders</span> who are changing the world.
            </h2>

            {primaryCta || secondaryCta ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-10">
                {primaryCta ? (
                  primaryCta.href ? (
                    <a
                      href={primaryCta.href}
                      className={cn(joinTeamCtaSharedClass, "bg-rellia-teal hover:border-rellia-mint")}
                      aria-label={primaryCta.ariaLabel}
                    >
                      <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-rellia-teal">
                        {primaryCta.label}
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={primaryCta.onClick}
                      className={cn(joinTeamCtaSharedClass, "bg-rellia-teal hover:border-rellia-mint")}
                      aria-label={primaryCta.ariaLabel}
                    >
                      <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-rellia-teal">
                        {primaryCta.label}
                      </span>
                    </button>
                  )
                ) : null}
                {secondaryCta ? (
                  secondaryCta.href ? (
                    <a
                      href={secondaryCta.href}
                      className={cn(
                        joinTeamCtaSharedClass,
                        "bg-transparent border-white/45 hover:border-rellia-mint",
                      )}
                      aria-label={secondaryCta.ariaLabel}
                    >
                      <span className="relative z-10 text-white transition-colors duration-300">
                        {secondaryCta.label}
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={secondaryCta.onClick}
                      className={cn(
                        joinTeamCtaSharedClass,
                        "bg-transparent border-white/45 hover:border-rellia-mint",
                      )}
                      aria-label={secondaryCta.ariaLabel}
                    >
                      <span className="relative z-10 text-white transition-colors duration-300">
                        {secondaryCta.label}
                      </span>
                    </button>
                  )
                ) : null}
              </div>
            ) : null}

            {showVolunteerForm && (
              <div className="mt-12 w-full max-w-4xl rounded-3xl border border-black/10 bg-white p-2 shadow-2xl md:mt-16">
                <FilloutStandardEmbed
                  filloutId={FILLOUT_APPLY_FORM_ID}
                  inheritParameters
                  dynamicResize
                />
              </div>
            )}
          </div>

          <div className="mt-8 min-h-0 w-full flex-1 overflow-x-clip overflow-y-visible md:mt-12 md:overflow-y-hidden lg:mt-16">
            <div
              className="relative h-full min-h-0 w-full overflow-x-clip py-2 md:py-3 [mask-size:100%_100%] [mask-repeat:no-repeat]"
              style={marqueeMaskStyle}
            >
              <motion.div
                className="flex w-max min-w-max gap-3 will-change-transform md:gap-5"
                animate={reduceMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: JOIN_TEAM_MARQUEE_LOOP_SEC, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
                }
              >
                {joinTeamMarqueeImages.map((src, index) => (
                  <div key={`${src}-${index}`} className={joinTeamImageTileClass}>
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const normalizeCms = (raw: unknown): CareersPageContent => {
  if (typeof raw !== "object" || raw == null) return {}
  return raw as CareersPageContent
}

export default function CareersCms() {
  const [showVolunteerForm, setShowVolunteerForm] = useState(false)
  const { data: careersCmsRaw } = useQuery({
    queryKey: ["cms", "careersPage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<CareersPageContent>>("careersPage")
      return raw ?? null
    },
    staleTime: 5 * 60 * 1000,
  })

  const careersCms = normalizeCms(careersCmsRaw)
  useApplyCmsSeo(careersCms.seo)

  const volunteerAvailable = CAREERS_VOLUNTEER_ENABLED

  // Hiring tab should be allowed even if there are currently no published roles.
  const enableHiring = careersCms.enableHiringTab !== false
  const enableVolunteer = careersCms.enableVolunteerTab !== false && volunteerAvailable

  const joinTeamPrimaryCta: CareersJoinTeamCta | null = enableHiring
    ? {
        href: "#open-roles",
        label: "Work with us",
        ariaLabel: "Work with us — jump to open roles",
      }
    : null

  const joinTeamSecondaryCta: CareersJoinTeamCta | null = enableVolunteer
    ? {
        onClick: () => setShowVolunteerForm(true),
        label: "Volunteer with us",
        ariaLabel: "Volunteer with us — show form",
      }
    : null

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <PageHeader
          variant="dark"
          title={
            <>
              Build the <span className="text-rellia-mint">future of health</span> at Rellia
            </>
          }
          subtitle="We connect founders, clinicians, and capital so the right ideas reach patients. If you thrive in fast-moving, mission-driven environments, we would love to meet you."
        />

        <CareersJoinTeamSection 
          primaryCta={joinTeamPrimaryCta} 
          secondaryCta={joinTeamSecondaryCta} 
          showVolunteerForm={showVolunteerForm}
        />

        <WhyRellia
          sectionTitle="Building What Matters Most"
          sectionDescription="What it feels like to build here: pace without panic, depth without gatekeeping, and a team that sweats the small stuff so members do not have to."
          features={CAREERS_WHY_FEATURES}
          cardImages={CAREERS_WHY_CARD_IMAGES}
          sectionClassName="bg-white pt-28 md:pt-32"
        />

        <WhyRellia
          sectionTitle="How we work"
          sectionDescription="A lean health-tech team: industry proximity, intentional office time, and the pace of a startup—not a corporate perks sheet."
          features={CAREERS_PERKS}
        />

        {enableHiring ? (
          <section
            id="open-roles"
            className="scroll-mt-28 flex min-h-[max(46rem,92svh)] flex-col bg-rellia-cream/60"
          >
            <div className="mx-auto flex w-full max-w-[1300px] flex-col px-6 py-16 md:px-10 md:py-20">
              <ScrollReveal className="flex min-w-0 flex-col">
                <h2 className="font-host-grotesk text-3xl font-semibold tracking-tight text-black md:text-4xl">
                  Open Roles
                </h2>

                <div className="mt-10 w-full shrink-0">
                  {CAREERS_OPEN_ROLES.length > 0 ? (
                    <div className="overflow-hidden rounded-3xl border border-black/10 bg-white px-0 shadow-sm md:px-2">
                      <Accordion type="single" collapsible className="w-full">
                        {CAREERS_OPEN_ROLES.map((role, index) => (
                          <AccordionItem
                            key={role.id}
                            value={role.id}
                            className={
                              index === CAREERS_OPEN_ROLES.length - 1
                                ? "border-b-0 px-6 md:px-8"
                                : "border-b border-black/10 px-6 md:px-8"
                            }
                          >
                            <AccordionTrigger
                              className={[
                                "items-start gap-3 py-5 hover:no-underline md:gap-4 md:py-6",
                                "[&>svg]:mt-1 [&>svg]:shrink-0 [&>svg]:text-rellia-teal",
                              ].join(" ")}
                            >
                              <span className="flex min-w-0 flex-1 flex-col gap-1.5 text-left sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                                <span className="min-w-0 text-lg font-medium text-black md:text-xl">
                                  {role.title}
                                </span>
                                <span className="shrink-0 font-urbanist text-sm font-normal leading-snug text-black/55 sm:max-w-[min(280px,42%)] sm:pt-0.5 sm:text-right md:text-base">
                                  {role.location}
                                </span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 pt-0 md:pb-8">
                              <span className="inline-flex rounded-full bg-rellia-teal/10 px-3 py-1 font-urbanist text-sm font-medium text-rellia-teal">
                                {role.employmentType}
                              </span>

                              <p className="mt-5 font-urbanist text-sm leading-relaxed text-black/75 md:text-base">
                                {role.description}
                              </p>

                              <div className="mt-6">
                                <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-wider text-black/80">
                                  Role highlights
                                </h3>
                                <ul className="mt-3 list-disc space-y-2 pl-5 font-urbanist text-sm leading-relaxed text-black/70 md:text-base">
                                  {role.responsibilities.map((line) => (
                                    <li key={line}>{line}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="mt-8">
                                <RelliaAction asChild variant="outlineOnWhite" size="comfortable" className="gap-2">
                                  <a
                                    href={role.linkedInApplyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Apply for ${role.title} on LinkedIn (opens in new tab)`}
                                  >
                                    Apply on LinkedIn
                                    <ExternalLink className="h-4 w-4" aria-hidden />
                                  </a>
                                </RelliaAction>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-black/10 bg-white px-6 py-16 text-center shadow-sm md:py-24">
                      <BriefcaseBusiness
                        className="h-20 w-20 text-rellia-teal/35 md:h-28 md:w-28 md:text-rellia-teal/30"
                        strokeWidth={1.25}
                        aria-hidden
                      />
                      <p className="mt-8 max-w-lg font-urbanist text-lg font-medium leading-relaxed text-black/70 md:mt-10 md:text-xl">
                        No vacant roles are available at the moment
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              <p className="shrink-0 pt-8 text-center font-urbanist text-sm leading-relaxed text-black/70 md:pt-10 md:text-base">
                Follow us on{" "}
                <a
                  href={g.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-rellia-teal underline underline-offset-4 transition-colors hover:text-rellia-mint"
                  aria-label="Follow Rellia on LinkedIn (opens in new tab)"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </section>
        ) : null}



        <RelliaCta
          title="Questions before you **apply**?"
          body="Tell us what you are looking for—we are happy to point you to the right conversation."
          primary={{ label: "Contact Rellia", to: "/contact" }}
        />
      </main>

      <Footer />
    </div>
  )
}

