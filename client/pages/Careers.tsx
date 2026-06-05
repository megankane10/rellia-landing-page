import { useState, useEffect, useRef } from "react"
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
import {
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  Laptop,
  MapPin,
  Users,
  UserRound,
  Check,
  ArrowRight,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Video,
  FileText,
  type LucideIcon
} from "lucide-react"
import type { HomeWhyFeature } from "@shared/cms/types"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { CAREERS_VOLUNTEER_ENABLED, careersHasPublishedOpenRoles } from "@shared/careersPageConfig"
import { CAREERS_OPEN_ROLES } from "@shared/careersOpenRoles"
import { cn } from "@/lib/utils"
import { buildPageUrl } from "@/config/seo"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
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

const getSocialIcon = (key: string): LucideIcon => {
  switch (key.toLowerCase()) {
    case "linkedin":
      return Linkedin
    case "instagram":
      return Instagram
    case "youtube":
      return Youtube
    case "twitter":
    case "x":
      return Twitter
    case "video":
      return Video
    case "article":
    case "paper":
      return FileText
    case "website":
    case "globe":
      return Globe
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
    <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] bg-rellia-cream/40 shadow-md">
      <AnimatePresence mode="wait">
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
          "flex h-14 w-14 items-center justify-center rounded-full border border-black/10 text-black/60",
          "transition-all duration-300 hover:border-rellia-teal hover:bg-rellia-teal/[0.03] hover:text-rellia-teal"
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

  const [copiedRoleId, setCopiedRoleId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleCopyRoleLink = (roleId: string) => {
    const roleUrl = `${buildPageUrl("/careers")}#${roleId}`
    navigator.clipboard.writeText(roleUrl)
    setCopiedRoleId(roleId)
    setTimeout(() => setCopiedRoleId(null), 2000)
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

        <section id="open-roles" className="scroll-mt-28 px-0 py-16 md:py-20">
          <div className="flex min-h-[max(46rem,92svh)] w-full flex-col rounded-[2.5rem] md:rounded-[3.5rem] bg-rellia-cream/60 py-16 md:py-20">
            <div className="mx-auto w-full max-w-[1300px] px-6 md:px-10 flex flex-col">
              <ScrollReveal className="flex min-w-0 flex-col">
                <h2 className="font-host-grotesk text-2xl font-semibold tracking-tight text-black md:text-[32px]">
                  Open Roles
                </h2>

                <div className="mt-10 w-full shrink-0">
                {CAREERS_OPEN_ROLES.length > 0 ? (
                <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white px-0 shadow-sm md:px-2">
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

                          <div className="mt-8 flex items-center gap-3">
                            <a
                              href={role.linkedInApplyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-rellia-teal border-2 border-rellia-teal px-8 font-host-grotesk text-base font-bold text-white shadow-sm outline-none transition-all duration-300 hover:bg-[#07242a] hover:border-[#07242a]"
                              aria-label={`Apply for ${role.title} on LinkedIn (opens in new tab)`}
                            >
                              <span className="relative z-10 inline-flex items-center gap-2">
                                Apply
                                <ExternalLink className="h-4.5 w-4.5" aria-hidden />
                              </span>
                            </a>
                            
                            <button
                              type="button"
                              onClick={() => handleCopyRoleLink(role.id)}
                              className="group relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-black/15 bg-white text-black/60 shadow-sm outline-none transition-all duration-300 hover:border-black/30 hover:text-black/80 hover:bg-black/5"
                              title={copiedRoleId === role.id ? "Copied!" : "Copy link to role"}
                              aria-label={copiedRoleId === role.id ? "Copied!" : "Copy link to role"}
                            >
                              <span className="relative z-10 flex items-center justify-center">
                                {copiedRoleId === role.id ? (
                                  <Check className="h-5 w-5 animate-scale-in text-rellia-teal" />
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
                  <PillTag label="Culture" className="mb-4" />
                  <h2 className="font-host-grotesk text-3xl font-bold tracking-tight text-black sm:text-4xl">
                    Life at Rellia
                  </h2>
                  <p className="mt-4 font-urbanist text-lg text-black/60 leading-relaxed max-w-xl">
                    We are building a remote-first, high-standards health-tech company. Our team brings deep clinical, technical, and operational expertise to help founders transform care. We focus on outcome-oriented work, mutual support, and constant learning.
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
          title="Questions before you **apply**?"
          body="Tell us what you are looking for—we are happy to point you to the right conversation."
          primary={{ label: "Contact Rellia", to: "/contact" }}
        />
      </main>

      <Footer />
    </div>
  )
}
