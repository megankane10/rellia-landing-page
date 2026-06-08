import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta from "@/components/RelliaCta"
import PillTag from "@/components/PillTag"
import WhyRellia from "@/components/WhyRellia"
import { FilloutStandardEmbed } from "@fillout/react"
import { FILLOUT_APPLY_FORM_ID, FILLOUT_EMBED_VIEWPORT_MIN_CLASS } from "@/lib/filloutApplyForm"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { LinkedInFilled, InstagramFilled, GlobeFilled } from "@/components/icons/SocialIcons"
import {
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  Laptop,
  MapPin,
  Users,
  UserRound,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Video,
  FileText,
  Facebook,
  type LucideIcon,
  Pause,
  Play
} from "lucide-react"
import type { CareersOpenRole, CareersContentMode, CareersPageContent, HomeWhyFeature } from "@shared/cms/types"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { CAREERS_VOLUNTEER_ENABLED } from "@shared/careersPageConfig"
import { resolveCareersOpenRoles } from "@shared/careersOpenRolesVisibility"
import { cn } from "@/lib/utils"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { useCareersPage } from "@/hooks/useCmsDocuments"
import { buildPageUrl } from "@/config/seo"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
import RelliaAction from "@/components/RelliaAction"
import { isSanityConfigured } from "@/lib/sanity"
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv"
import { useMemo, useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { ShareIconCopy } from "@/components/share/sharePageIcons"
import { RoleHero } from "./network/_shared"

const g = DEFAULT_GLOBAL_SETTINGS

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
      "Startup reality: clear priorities, Direct feedback, and permission to fix how we work—without layers of process for its own sake.",
  },
  {
    iconKey: "mapPin",
    title: "Out with the community",
    description:
      "Member events, partner conversations, and field context on how buying decisions get made—so you are not guessing from a distance.",
  },
]

const getPerkIcon = (key: string): LucideIcon => {
  switch (key) {
    case "users":
      return Users
    case "building2":
      return Building2
    case "laptop":
      return Laptop
    case "mapPin":
      return MapPin
    case "userRound":
      return UserRound
    default:
      return Users
  }
}

const LIFE_AT_RELLIA_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80"
]

const inferSocialIconKey = (iconKey: string, href: string) => {
  const key = iconKey.trim().toLowerCase()
  if (key && key !== "link") return key
  const url = href.toLowerCase()
  if (url.includes("linkedin.com")) return "linkedin"
  if (url.includes("instagram.com")) return "instagram"
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter"
  if (url.includes("facebook.com")) return "facebook"
  return key || "link"
}

function getSocialIcon(iconKey: string, href = "") {
  switch (inferSocialIconKey(iconKey, href)) {
    case "linkedin":
      return LinkedInFilled
    case "instagram":
      return InstagramFilled
    case "twitter":
    case "x":
      return Twitter
    case "facebook":
      return Facebook
    case "youtube":
      return Youtube
    case "video":
      return Video
    case "article":
    case "document":
      return FileText
    case "website":
    case "globe":
    case "link":
      return GlobeFilled
    default:
      return GlobeFilled
  }
}

function LifeAtRelliaSlider({ images }: { images?: Array<{ src?: string; alt?: string; caption?: string }> }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const slides = useMemo(() => {
    const list = images?.filter(Boolean) ?? []
    if (list.length > 0) return list.map(img => ({ src: img.src || '', caption: img.caption || '' }))
    return LIFE_AT_RELLIA_IMAGES.map(src => ({ src, caption: '' }))
  }, [images])

  const goToSlide = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1)
    setCurrentSlide(idx)
    setProgress(0)
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(prev => prev - 1)
      setProgress(0)
    }
  }

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1)
      setCurrentSlide(prev => prev + 1)
      setProgress(0)
    }
  }

  useEffect(() => {
    if (slides.length <= 1) return
    if (isPaused) return

    const intervalTime = 30 // ms
    const step = (intervalTime / 5000) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % slides.length)
          setDirection(1)
          return 0
        }
        return prev + step
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [slides.length, isPaused])

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="flex flex-col">
      <div className="relative aspect-square w-full max-w-[480px] overflow-hidden rounded-[2.5rem] bg-rellia-cream/40 shadow-md">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]?.src}
            alt="Life at Rellia"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        
        {slides.length > 1 && (
          <>
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2.5 rounded-full bg-black/35 px-3 py-2 backdrop-blur-md">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "relative h-2.5 overflow-hidden rounded-full transition-all duration-300",
                    currentSlide === index ? "w-10 bg-white/30" : "w-2.5 bg-white/80 hover:bg-rellia-mint"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {currentSlide === index && (
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-rellia-mint shadow-[0_0_10px_rgba(157,214,208,0.85)]"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="absolute bottom-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 active:scale-95"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play className="h-3.5 w-3.5 fill-white" /> : <Pause className="h-3.5 w-3.5 fill-white" />}
            </button>
          </>
        )}
      </div>
      {slides[currentSlide]?.caption && (
        <p className="mt-3 font-urbanist text-sm text-black/60 text-center max-w-[480px]">
          {slides[currentSlide].caption}
        </p>
      )}
    </div>
  )
}

function LifeAtRelliaSocialButton({
  href,
  iconKey,
  tooltip,
}: {
  href: string
  iconKey: string
  tooltip: string
}) {
  const IconComponent = getSocialIcon(iconKey, href)
  const isFilledBrandIcon = ["linkedin", "instagram", "globe", "link", "website"].includes(
    inferSocialIconKey(iconKey, href),
  )

  return (
    <div className="relative group">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full border border-rellia-teal bg-white text-rellia-teal",
          "transition-all duration-300 hover:bg-rellia-mint hover:border-rellia-mint hover:text-rellia-teal"
        )}
        aria-label={tooltip}
      >
        <IconComponent className={cn("h-6 w-6", isFilledBrandIcon && "fill-current")} />
      </a>
      <div className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 z-20">
        <div className="relative bg-black text-white text-xs font-bold py-1.5 px-3 rounded-xl whitespace-nowrap shadow-md">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
        </div>
      </div>
    </div>
  )
}


const normalizeCms = (raw: unknown): CareersPageContent => {
  if (typeof raw !== "object" || raw == null) return {}
  return raw as CareersPageContent
}

export default function CareersCms() {
  const [copiedRoleId, setCopiedRoleId] = useState<string | null>(null)
  const [activeRole, setActiveRole] = useState<string | undefined>(undefined)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const location = useLocation()

  const { data: careersCmsRaw } = useCareersPage()

  const careersCms = normalizeCms(careersCmsRaw)
  useApplyCmsSeo(careersCms.seo)

  const openRoles = useMemo(
    (): CareersOpenRole[] =>
      resolveCareersOpenRoles(careersCms, {
        allowSeedFallbacks: allowCmsSeedFallbacks(),
        isSanityConfigured: isSanityConfigured(),
      }),
    [careersCms],
  )

  const handleCopyRoleLink = (roleId: string) => {
    const roleUrl = `${buildPageUrl("/careers")}#${roleId}`
    navigator.clipboard.writeText(roleUrl)
    setCopiedRoleId(roleId)
    setTimeout(() => setCopiedRoleId(null), 2000)
  }

  useEffect(() => {
    const hash = location.hash
    if (hash) {
      const roleId = hash.replace("#", "")
      const roleExists = openRoles.some(r => r.id === roleId)
      if (roleExists) {
        setActiveRole(roleId)
        setTimeout(() => {
          const el = document.getElementById(roleId)
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 150)
      }
    }
  }, [location.hash, openRoles])

  const volunteerAvailable = CAREERS_VOLUNTEER_ENABLED

  const resolveContentMode = (): CareersContentMode => {
    if (careersCms.careersContentMode) return careersCms.careersContentMode
    const legacyHiring = (careersCms as { enableHiringTab?: boolean }).enableHiringTab !== false
    const legacyVolunteer =
      (careersCms as { enableVolunteerTab?: boolean }).enableVolunteerTab !== false &&
      volunteerAvailable
    if (legacyHiring && legacyVolunteer) return "both"
    if (legacyVolunteer) return "volunteer_only"
    if (legacyHiring) return "hiring_only"
    return "both"
  }

  const contentMode = resolveContentMode()
  const showHiringSection = contentMode === "both" || contentMode === "hiring_only"
  const showVolunteerFlow =
    (contentMode === "both" || contentMode === "volunteer_only") && volunteerAvailable

  const joinTeamPrimaryCta =
    contentMode === "volunteer_only" && showVolunteerFlow
      ? {
          label: "Volunteer with us",
          ariaLabel: "Volunteer with us — show application form",
          opensForm: true,
        }
      : showHiringSection
        ? {
            href: "#open-roles",
            label: "Work with us",
            ariaLabel: "Work with us — jump to open roles",
            opensForm: false,
          }
        : null

  const joinTeamSecondaryCta =
    contentMode === "both" && showVolunteerFlow
      ? {
          label: "Volunteer with us",
          ariaLabel: "Volunteer with us — show application form",
        }
      : null



  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar darkHeroNav forceSolid={showApplyForm} />

      <main id="main-content">
        <AnimatePresence mode="wait">
          {showApplyForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn("w-full bg-white pt-24 pb-12", FILLOUT_EMBED_VIEWPORT_MIN_CLASS)}
            >
              <div className="mx-auto max-w-[1100px] px-6 md:px-10">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="mb-8 font-host-grotesk text-sm font-semibold text-rellia-teal underline-offset-4 hover:underline"
                >
                  ← Back to details
                </button>
              </div>
              <div className="w-full min-h-[700px] md:min-h-[1000px]">
                <FilloutStandardEmbed
                  filloutId={FILLOUT_APPLY_FORM_ID}
                  inheritParameters
                  dynamicResize
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:flex lg:h-[82vh] lg:flex-col"
            >
              <RoleHero
                eyebrowLabel="Join the team"
                imageSrc="/images/careers-img.jpg"
                className="lg:flex-1"
                skipNavOffset
                title={
                  <>
                    Build the <span className="text-rellia-mint">future of health</span> at Rellia
                  </>
                }
                subtitle="We connect founders, clinicians, and capital so the right ideas reach patients. If you thrive in fast-moving, mission-driven environments, we would love to meet you."
                primaryCta={
                  joinTeamPrimaryCta
                    ? { label: joinTeamPrimaryCta.label }
                    : { label: "See open roles" }
                }
                secondaryCta={
                  joinTeamSecondaryCta
                    ? { label: joinTeamSecondaryCta.label }
                    : undefined
                }
                onPrimaryClick={() => {
                  if (!joinTeamPrimaryCta) return
                  if (joinTeamPrimaryCta.opensForm) {
                    setShowApplyForm(true)
                    return
                  }
                  const target = document.getElementById("open-roles")
                  target?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                onSecondaryClick={
                  joinTeamSecondaryCta
                    ? () => {
                        setShowApplyForm(true)
                      }
                    : undefined
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        <WhyRellia
          sectionTitle="Building What Matters Most"
          sectionDescription="What it feels like to build here: pace without panic, depth without gatekeeping, and a team that sweats the small stuff so members do not have to."
          features={CAREERS_WHY_FEATURES}
          cardImages={CAREERS_WHY_CARD_IMAGES}
          sectionClassName="bg-white pt-16 md:pt-20"
        />

        <section className="bg-white py-24 md:py-32 border-t border-black/10">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            <ScrollReveal className="max-w-3xl mb-16">
              <h2 className="font-host-grotesk text-2xl font-semibold tracking-tight text-black md:text-[32px]">
                How we work
              </h2>
              <p className="mt-4 font-urbanist text-lg md:text-xl text-black/60 leading-relaxed">
                A lean health-tech team: industry proximity, intentional office time, and the pace of a startup—not a corporate perks sheet.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 lg:gap-x-16 lg:gap-y-12">
              {CAREERS_PERKS.map((perk) => {
                const IconComponent = getPerkIcon(perk.iconKey)
                return (
                  <ScrollReveal key={perk.title} className="flex flex-col items-start text-left">
                    <IconComponent className="h-8 w-8 text-rellia-teal mb-4" aria-hidden />
                    <div>
                      <h3 className="font-host-grotesk text-xl font-bold tracking-tight text-black mb-2">
                        {perk.title}
                      </h3>
                      <p className="font-urbanist text-base leading-relaxed text-black/70">
                        {perk.description}
                      </p>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>

        {showHiringSection ? (
          <section id="open-roles" className="scroll-mt-28 px-0 py-16 md:py-20">
            <div className="flex min-h-[max(46rem,92svh)] w-full flex-col rounded-[2.5rem] md:rounded-[3.5rem] bg-rellia-cream/60 py-16 md:py-20">
              <div className="mx-auto w-full max-w-[1300px] px-6 md:px-10 flex flex-col">
                <ScrollReveal className="flex min-w-0 flex-col">
                  <h2 className="font-host-grotesk text-2xl font-semibold tracking-tight text-black md:text-[32px]">
                    Open Roles
                  </h2>

                  <div className="mt-10 w-full shrink-0">
                  {openRoles.length > 0 ? (
                    <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white px-0 shadow-sm md:px-2">
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={activeRole}
                        onValueChange={setActiveRole}
                      >
                        {openRoles.map((role, index) => (
                          <AccordionItem
                            key={role.id}
                            id={role.id}
                            value={role.id}
                            className={
                              index === openRoles.length - 1
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

                              <div className="mt-8 flex items-center gap-3">
                                <a
                                  href={role.linkedInApplyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative isolate inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-rellia-mint bg-rellia-mint px-8 font-host-grotesk text-base font-bold text-rellia-teal shadow-sm outline-none transition-[transform,background-color,color,border-color,box-shadow] duration-300 before:hidden motion-safe:hover:-translate-y-0.5 hover:border-rellia-teal hover:bg-rellia-teal hover:text-white"
                                  aria-label={`Apply for ${role.title} on LinkedIn (opens in new tab)`}
                                >
                                  <span className="relative z-10">
                                    Apply
                                  </span>
                                </a>
                                
                                <button
                                  type="button"
                                  onClick={() => handleCopyRoleLink(role.id)}
                                  className="group relative isolate inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black/15 bg-white text-black shadow-sm outline-none transition-[transform,background-color,color,border-color,box-shadow] duration-300 before:hidden motion-safe:hover:-translate-y-0.5 hover:border-rellia-teal hover:bg-rellia-teal hover:text-white"
                                  title={copiedRoleId === role.id ? "Copied!" : "Copy link to role"}
                                  aria-label={copiedRoleId === role.id ? "Copied!" : "Copy link to role"}
                                >
                                  <span className="relative z-10 flex items-center justify-center">
                                    {copiedRoleId === role.id ? (
                                      <Check className="h-5 w-5 animate-scale-in" />
                                    ) : (
                                      <ShareIconCopy className="h-5 w-5" />
                                    )}
                                  </span>
                                  {copiedRoleId === role.id && (
                                    <span className="absolute -top-11 left-1/2 -translate-x-1/2 rounded-full bg-rellia-teal px-3 py-1 text-xs font-bold text-white shadow-md whitespace-nowrap transition-all duration-200 z-50 animate-bounce">
                                      Copied!
                                    </span>
                                  )}
                                </button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ) : (
                    <FilteredListEmptyState
                      className="mt-12"
                      icon={BriefcaseBusiness}
                      title="No open roles"
                      description="No vacant roles are available at the moment. Check back later or follow us on LinkedIn for updates."
                    />
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      ) : null}

      {/* Life at Rellia Section */}
      <section id="life-at-rellia" className="bg-white py-14 md:py-18">
        <div className="mx-auto max-w-[1300px] px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Image Slider */}
            <ScrollReveal>
              <LifeAtRelliaSlider images={careersCms.lifeAtRelliaImages} />
            </ScrollReveal>

            {/* Copy & Social Links */}
            <ScrollReveal>
              <div className="flex flex-col items-start justify-center">
                <h2 className="font-host-grotesk text-2xl font-bold tracking-tight text-black sm:text-3xl">
                  {careersCms.lifeAtRelliaHeading || "Built by healthtech insiders, for builders"}
                </h2>

                <p className="mt-4 font-urbanist text-lg text-black/60 leading-relaxed max-w-xl">
                  {careersCms.lifeAtRelliaSubheading || "We are a remote-first, high-standards team of builders, clinicians, and operators dedicated to supporting healthtech founders. We cultivate an environment of high autonomy, rapid iteration, and deep clinical empathy to build the future of care."}
                </p>

                {/* Socials / proofs container */}
                {Array.isArray(careersCms.lifeAtRelliaLinks) && careersCms.lifeAtRelliaLinks.length > 0 ? (
                  <div className="mt-8 flex flex-wrap gap-4">
                    {careersCms.lifeAtRelliaLinks.map((link) => (
                      <LifeAtRelliaSocialButton
                        key={link.platformName + link.url}
                        href={link.url}
                        iconKey={link.iconKey}
                        tooltip={link.tooltip}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 flex flex-wrap gap-4">
                    <LifeAtRelliaSocialButton
                      href={g.linkedinUrl}
                      iconKey="linkedin"
                      tooltip="Follow us on LinkedIn"
                    />
                    <LifeAtRelliaSocialButton
                      href="https://www.instagram.com/relliahealth"
                      iconKey="instagram"
                      tooltip="Follow us on Instagram"
                    />
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <RelliaCta
        aboveSectionTone="white"
        title="Questions before you apply?"
        body="Tell us what you are looking for—we are happy to point you to the right conversation."
        primary={{ label: "Get in touch", to: "/contact" }}
      />
      </main>

      <Footer />
    </div>
  )
}
