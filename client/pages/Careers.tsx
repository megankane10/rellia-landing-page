import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta from "@/components/RelliaCta"
import PillTag from "@/components/PillTag"
import WhyRellia from "@/components/WhyRellia"
import { FilloutStandardEmbed } from "@fillout/react"
import { FILLOUT_APPLY_FORM_ID, FILLOUT_EMBED_VIEWPORT_MIN_CLASS } from "@/lib/filloutApplyForm"
import { CareersOpenRolesSection } from "@/components/careers/CareersOpenRolesSection"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { LinkedInFilled, InstagramFilled, GlobeFilled } from "@/components/icons/SocialIcons"
import {
  Building2,
  ExternalLink,
  Laptop,
  MapPin,
  Users,
  UserRound,
  ArrowRight,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Video,
  FileText,
  Facebook,
} from "lucide-react"
import { resolveLucideIcon } from "@/lib/resolveLucideIcon"
import type { HomeWhyFeature } from "@shared/cms/types"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { CAREERS_VOLUNTEER_ENABLED, careersHasPublishedOpenRoles } from "@shared/careersPageConfig"
import { CAREERS_OPEN_ROLES } from "@shared/careersOpenRoles"
import { hasOpenRoleApplyButton } from "@shared/careersOpenRolesVisibility"
import { cn } from "@/lib/utils"
import { buildCareersRoleShareUrl } from "@/config/seo"
import { DEFAULT_CAREERS_PAGE } from "@shared/cms/careersPageDefaults"
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

const LIFE_AT_RELLIA_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80"
]

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
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
    case "document":
      return FileText
    case "website":
    case "globe":
      return GlobeFilled
    default:
      return ExternalLink
  }
}

function LifeAtRelliaSlider({ images = LIFE_AT_RELLIA_IMAGES }: { images?: string[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="relative aspect-square w-full max-w-[480px] overflow-hidden rounded-[2.5rem] bg-rellia-cream/40 shadow-md">
      <AnimatePresence>
        <motion.img
          key={currentSlide}
          src={images[currentSlide]}
          alt="Life at Rellia"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentSlide === index ? "w-6 bg-white" : "w-2 bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
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
  const IconComponent = getSocialIcon(iconKey)

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
        <IconComponent className="h-6 w-6" />
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

export default function Careers() {
  const hiring = careersHasPublishedOpenRoles()
  const volunteer = CAREERS_VOLUNTEER_ENABLED

  const [showForm, setShowForm] = useState(false)

  const handleCopyRoleLink = (roleId: string) => {
    const roleUrl = buildCareersRoleShareUrl(roleId)
    navigator.clipboard.writeText(roleUrl)
  }

  const joinTeamPrimaryCta = hiring
    ? {
        href: "#open-roles",
        label: "See open roles",
        ariaLabel: "See open roles",
      }
    : volunteer
      ? {
          href: "#careers-volunteer",
          label: "Volunteer with us",
          ariaLabel: "Volunteer with us — jump to form",
        }
      : null

  const joinTeamSecondaryCta =
    hiring && volunteer
      ? {
          href: "#careers-volunteer",
          label: "Volunteer with us",
          ariaLabel: "Volunteer with us — jump to form",
        }
      : null

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <AnimatePresence mode="wait">
          {showForm ? (
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
                  onClick={() => setShowForm(false)}
                  className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-black/60 hover:text-black transition-colors"
                >
                  ← Back
                </button>
                <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg">
                  <FilloutStandardEmbed
                    filloutId={FILLOUT_APPLY_FORM_ID}
                    inheritParameters
                    dynamicResize
                  />
                </div>
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
                eyebrowLabel="Careers"
                imageSrc="/images/careers-img.jpg"
                className="lg:flex-1"
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
                  if (joinTeamPrimaryCta?.href.startsWith("#")) {
                    const targetId = joinTeamPrimaryCta.href.slice(1)
                    const target = document.getElementById(targetId)
                    target?.scrollIntoView({ behavior: "smooth", block: "start" })
                  } else {
                    const target = document.getElementById("open-roles")
                    target?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }}
                onSecondaryClick={
                  joinTeamSecondaryCta
                    ? () => {
                        setShowForm(true)
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
          sectionClassName="bg-white pt-28 md:pt-32"
        />

        <section className="bg-white pb-16 pt-10 md:pb-20 md:pt-12">
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
                const IconComponent = resolveLucideIcon(perk.iconKey, Users)
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

        <CareersOpenRolesSection
          titlePortable={DEFAULT_CAREERS_PAGE.openRolesTitlePortable}
          subtitle={DEFAULT_CAREERS_PAGE.openRolesSubtitle}
          roles={CAREERS_OPEN_ROLES}
          onCopyRoleLink={handleCopyRoleLink}
          renderApplyButton={(role) =>
            hasOpenRoleApplyButton(role) ? (
              <a
                href={role.applyButtonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full border-2 border-rellia-teal bg-rellia-teal px-8 font-host-grotesk text-base font-bold text-white shadow-sm outline-none transition-all duration-300 hover:border-[#07242a] hover:bg-[#07242a] sm:min-w-[12.5rem] sm:w-auto"
                aria-label={`${role.applyButtonLabel} for ${role.title} (opens in new tab)`}
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  {role.applyButtonLabel}
                  <ExternalLink className="h-4.5 w-4.5" aria-hidden />
                </span>
              </a>
            ) : null
          }
        />

        {/* Life at Rellia Section */}
        <section id="life-at-rellia" className="bg-white py-24 border-t border-black/10">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Image Slider */}
              <ScrollReveal>
                <LifeAtRelliaSlider />
              </ScrollReveal>

              {/* Copy & Social Links */}
              <ScrollReveal>
                <div className="flex flex-col items-start justify-center">
                  <h2 className="font-host-grotesk text-2xl font-bold tracking-tight text-black sm:text-3xl">
                    Built by healthtech insiders, for builders
                  </h2>
                  <p className="mt-4 font-urbanist text-lg text-black/60 leading-relaxed max-w-xl">
                    We are a remote-first, high-standards team of builders, clinicians, and operators dedicated to supporting healthtech founders. We cultivate an environment of high autonomy, rapid iteration, and deep clinical empathy to build the future of care.
                  </p>
                  
                  {/* Socials / proofs container */}
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
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <RelliaCta
          aboveSectionTone="white"
          title="Questions before you apply?"
          body="Tell us what you are looking for—we are happy to point you to the right conversation."
          primary={{ label: "Contact Rellia", to: "/contact" }}
        />
      </main>

      <Footer />
    </div>
  )
}
