import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta, { optionalCtaAction } from "@/components/RelliaCta"
import PillTag from "@/components/PillTag"
import WhyRellia from "@/components/WhyRellia"
import HowItWorks from "@/components/HowItWorks"
import { FilloutStandardEmbed } from "@fillout/react"
import { FILLOUT_APPLY_FORM_ID, FILLOUT_EMBED_VIEWPORT_MIN_CLASS } from "@/lib/filloutApplyForm"
import { CareersOpenRolesSection } from "@/components/careers/CareersOpenRolesSection"
import { SectionsRenderer } from "@/components/cms/PageRenderer"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { LinkedInFilled, InstagramFilled, GlobeFilled } from "@/components/icons/SocialIcons"
import {
  Building2,
  Laptop,
  MapPin,
  Users,
  UserRound,
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
  Pause,
  Play,
} from "lucide-react"
import { resolveLucideIcon } from "@/lib/resolveLucideIcon"
import type { CareersContentMode, CareersPageContent } from "@shared/cms/types"
import { mapNetworkWhyFeatures } from "@/lib/whyRelliaFeatures"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { CAREERS_VOLUNTEER_ENABLED } from "@shared/careersPageConfig"
import { resolveCareersOpenRoles } from "@shared/careersOpenRolesVisibility"
import { cn } from "@/lib/utils"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { deriveHeroPageSeo } from "@/lib/cmsPageSeoDefaults"
import { useCareersPage } from "@/hooks/useCmsDocuments"
import RelliaAction from "@/components/RelliaAction"
import { isSanityConfigured } from "@/lib/sanity"
import { isCmsQueryLoading } from "@/lib/cmsQueryState"
import { allowCmsSeedFallbacks, isStrictProductionSite } from "@/lib/deploymentEnv"
import { cmsDisplayText } from "@/lib/cmsStega"
import { useMemo, useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { careersRoleDetailPath, findCareersOpenRoleById, resolveLinkedCareersRoleId } from "@shared/cms/careersRoleShare"
import { RoleHero } from "./network/_shared"
import { SectionHeadlinePortable } from "@/components/cms/SectionHeadlinePortable"
import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import { DEFAULT_CAREERS_PAGE } from "@shared/cms/careersPageDefaults"
import { NetworkHeroTitle } from "@/components/NetworkHeroTitle"

const g = DEFAULT_GLOBAL_SETTINGS

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
          "transition-all duration-300 hover:border-rellia-teal hover:bg-rellia-teal hover:text-white",
        )}
        aria-label={tooltip}
      >
        <IconComponent className={cn("h-6 w-6", isFilledBrandIcon && "fill-current")} />
      </a>
      <div className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 z-20">
        <div className="relative bg-black text-white text-sm font-bold py-2 px-3.5 rounded-xl whitespace-nowrap shadow-md">
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
  const location = useLocation()
  const navigate = useNavigate()
  const [showApplyForm, setShowApplyForm] = useState(false)

  const careersPageQuery = useCareersPage()
  const { data: careersCmsRaw } = careersPageQuery
  const careersPageLoading =
    isSanityConfigured() &&
    (isCmsQueryLoading(careersPageQuery) || careersPageQuery.isError)

  const careersCms = useMemo(
    () => ({ ...DEFAULT_CAREERS_PAGE, ...normalizeCms(careersCmsRaw) }),
    [careersCmsRaw],
  )

  const careersHowWeWorkSteps = useMemo(
    () =>
      (careersCms.perksItems ?? []).map((perk) => ({
        icon: resolveLucideIcon(perk.iconKey ?? "", Users),
        title: perk.title ?? "",
        description: perk.body ?? "",
      })),
    [careersCms.perksItems],
  )

  const openRoles = useMemo(() => {
    if (careersPageLoading) return []
    return resolveCareersOpenRoles(careersCms, {
      allowSeedFallbacks: allowCmsSeedFallbacks(),
      isSanityConfigured: isSanityConfigured(),
      isProductionSite: isStrictProductionSite(),
    })
  }, [careersCms, careersPageLoading])

  useApplyCmsSeo(
    careersCms.seo,
    deriveHeroPageSeo({
      pageTitle: "Careers",
      heroSubtitle: careersCms.heroSubtitle,
      pathname: "/careers",
    }),
  )

  useEffect(() => {
    if (isCmsQueryLoading(careersPageQuery)) return

    const linkedRoleId = resolveLinkedCareersRoleId({
      search: location.search,
      hash: location.hash,
    })
    if (!linkedRoleId) return

    const role = findCareersOpenRoleById(openRoles, linkedRoleId)
    if (!role) return

    navigate(careersRoleDetailPath(linkedRoleId), { replace: true })
  }, [careersPageQuery, location.search, location.hash, navigate, openRoles])

  const volunteerAvailable = CAREERS_VOLUNTEER_ENABLED

  const resolveContentMode = (): CareersContentMode => careersCms.careersContentMode ?? "both"

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
            label: "See open roles",
            ariaLabel: "See open roles — jump to open roles",
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
                eyebrowLabel={cmsDisplayText(careersCms.heroEyebrow ?? "Join the team")}
                imageSrc={careersCms.heroImageSrc ?? "/images/careers-img.jpg"}
                className="lg:flex-1"
                skipNavOffset
                title={
                  <NetworkHeroTitle
                    content={careersCms}
                    fallback={DEFAULT_CAREERS_PAGE.heroTitlePortable!}
                  />
                }
                subtitle={cmsDisplayText(careersCms.heroSubtitle)}
                primaryCta={
                  joinTeamPrimaryCta
                    ? { label: cmsDisplayText(joinTeamPrimaryCta.label) }
                    : { label: cmsDisplayText("See open roles") }
                }
                secondaryCta={
                  joinTeamSecondaryCta
                    ? { label: cmsDisplayText(joinTeamSecondaryCta.label) }
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
          sectionTitle={cmsDisplayText(careersCms.whyTitle ?? "Building What Matters Most")}
          sectionDescription={cmsDisplayText(careersCms.whyDescription)}
          features={mapNetworkWhyFeatures(careersCms.whyFeatures ?? [])}
          sectionClassName="bg-white pt-16 md:pt-20"
        />

        <div className="bg-white pt-10 md:pt-12 pb-4 md:pb-6">
          <HowItWorks
            heading={
              <HeroHeadlinePortable
                value={careersCms.perksTitlePortable ?? careersCms.perksTitle ?? "How we work"}
              />
            }
            subheading={cmsDisplayText(careersCms.perksDescription)}
            steps={careersHowWeWorkSteps}
            columns={2}
          />
        </div>

        {showHiringSection ? (
          <CareersOpenRolesSection
            titlePortable={careersCms.openRolesTitlePortable}
            subtitle={cmsDisplayText(careersCms.openRolesSubtitle ?? DEFAULT_CAREERS_PAGE.openRolesSubtitle ?? "")}
            roles={openRoles}
            formatText={cmsDisplayText}
            rolesLoading={careersPageLoading}
          />
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
                  <SectionHeadlinePortable
                    value={careersCms.lifeAtRelliaHeadingPortable}
                    className="font-host-grotesk text-2xl font-bold tracking-tight text-black sm:text-3xl"
                  />

                <p className="mt-4 font-urbanist text-lg text-black/60 leading-relaxed max-w-xl">
                  {cmsDisplayText(
                    careersCms.lifeAtRelliaSubheading ||
                      "We are a remote-first, high-standards team of builders, clinicians, and operators dedicated to supporting healthtech founders. We cultivate an environment of high autonomy, rapid iteration, and deep clinical empathy to build the future of care.",
                  )}
                </p>

                {/* Socials / proofs container */}
                {Array.isArray(careersCms.lifeAtRelliaLinks) && careersCms.lifeAtRelliaLinks.length > 0 ? (
                  <div className="mt-12 flex flex-wrap gap-4">
                    {careersCms.lifeAtRelliaLinks.map((link) => (
                      <LifeAtRelliaSocialButton
                        key={link.platformName + link.url}
                        href={link.url}
                        iconKey={link.iconKey}
                        tooltip={cmsDisplayText(link.tooltip)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-12 flex flex-wrap gap-4">
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

      {careersCms.sections?.length ? <SectionsRenderer sections={careersCms.sections} /> : null}

      <RelliaCta
        aboveSectionTone="white"
        title={cmsDisplayText(careersCms.ctaTitle ?? "Questions before you apply?")}
        body={cmsDisplayText(careersCms.ctaBody)}
        primary={{
          label: cmsDisplayText(careersCms.ctaPrimaryLabel ?? "Get in touch"),
          to: careersCms.ctaPrimaryHref ?? "/contact",
        }}
        secondary={optionalCtaAction(careersCms.ctaSecondaryLabel, careersCms.ctaSecondaryHref)}
      />
      </main>

      <Footer />
    </div>
  )
}
