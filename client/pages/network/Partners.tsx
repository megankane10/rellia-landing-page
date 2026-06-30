import type { LucideIcon } from "lucide-react"
import PageHeader from "@/components/PageHeader"
import SectionHeading from "@/components/SectionHeading"
import WhyRellia from "@/components/WhyRellia"
import { mapNetworkWhyFeatures } from "@/lib/whyRelliaFeatures"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import ScrollReveal from "@/components/ScrollReveal"
import { GETPROVEN_VENDORS_GRID_URL } from "@/config/partnerLinks"
import { ArrowRight, ArrowUpRight, Check, ExternalLink, Handshake, LayoutGrid, Megaphone } from "lucide-react"
import { Link } from "react-router-dom"
import LogoMarquee from "@/components/LogoMarquee"
import RelliaCta, { optionalCtaAction } from "@/components/RelliaCta"
import { SectionsRenderer } from "@/components/cms/PageRenderer"
import { CreamSection, GlassCardLight, LightSection, Reveal, RoleHero } from "./_shared"
import { useNetworkPartnersPage } from "@/hooks/useCmsDocuments"
import { isCmsPageContentReady } from "@/lib/cmsQueryState"
import CmsPageLoadingShell from "@/components/cms/CmsPageLoadingShell"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { deriveHeroPageSeo } from "@/lib/cmsPageSeoDefaults"
import { mergeNetworkPartnersPage, DEFAULT_NETWORK_PARTNERS_PAGE } from "@shared/cms/networkPageDefaults"
import { NetworkHeroTitle } from "@/components/NetworkHeroTitle"
import { cmsDisplayText } from "@/lib/cmsStega"
import type { NetworkPartnersPageContent } from "@shared/cms/types"
import { resolveNetworkIcon } from "@/lib/resolveNetworkIcon"

const engagementCardClass =
  "group flex min-h-[190px] md:min-h-[220px] flex-col rounded-2xl border border-black/10 bg-gradient-to-br from-rellia-teal to-[#144853] p-5 md:p-7 transition duration-300 hover:from-[#113f4a] hover:to-[#0f3842] hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 focus-visible:ring-offset-white"

type EngagementItem =
  | {
      title: string
      body: string
      cta: string
      icon: LucideIcon
      to: string
    }
  | {
      title: string
      body: string
      cta: string
      icon: LucideIcon
      href: string
      external: true
    }

const GETPROVEN_BENEFITS = [
  "Independent vendor marketplace—VC-grade firms use Proven to centralize vendor libraries instead of scattered spreadsheets",
  "Portfolio companies access exclusive vendor deals with redemption tracking so savings stay visible",
  "Pre-vetted service providers and verified references reduce bad-fit spend across tools and services",
  "Analytics on what portfolio companies search for and adopt—so recommendations stay grounded in usage data",
  "Community features let portcos share vendor experiences and discover trusted providers faster",
] as const

const ENGAGEMENT: readonly EngagementItem[] = [
  {
    title: "Partner directory",
    body: "Centralize your offers and verified references inside our exclusive marketplace for health tech execution.",
    href: GETPROVEN_VENDORS_GRID_URL,
    external: true,
    cta: "Explore Industry Partners",
    icon: LayoutGrid,
  },
  {
    title: "Sponsor",
    body: "Put your brand behind programs and events where execution-quality teams spend their time.",
    to: "/contact",
    cta: "Talk sponsorship",
    icon: Megaphone,
  },
  {
    title: "Become a partner",
    body: "Co-design pilots, APIs, and enterprise handoffs with a community that treats adoption as the product.",
    to: "/contact",
    cta: "Start a conversation",
    icon: Handshake,
  },
]

const BENEFITS = [
  "Pilot-ready founders with clearer scope and success metrics",
  "Structured introductions to technical and clinical leaders",
  "Shared language on security, compliance, and deployment",
  "Credibility inside a network built for health system reality",
  "Long-term relationships—not one-off vendor fairs",
] as const

/** Teal band + glass link cards — aligned with homepage How It Works rhythm */
function PartnerEngageTealBand({ content }: { content: NetworkPartnersPageContent }) {
  const cards = content.engageItems?.length ? content.engageItems : ENGAGEMENT.map((card, index) => ({
    title: card.title,
    body: card.body,
    href: "href" in card ? card.href : card.to,
    linkLabel: card.cta,
    iconKey: ["LayoutGrid", "Megaphone", "Handshake"][index],
    external: "external" in card ? card.external : false,
  }))

  return (
    <section className="relative w-full overflow-hidden bg-white px-6 py-16 md:px-10 md:py-24">
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 top-6 w-[320px] max-w-[55vw] opacity-[0.15] md:right-0 md:top-4 md:w-[420px]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-12 h-[450px] w-[450px] rounded-full bg-rellia-mint/10 blur-[120px]" />
        <div className="absolute -right-32 -bottom-16 h-[500px] w-[500px] rounded-full bg-rellia-mint/8 blur-[130px]" />
        <div className="absolute left-1/3 top-1/4 h-[350px] w-[350px] rounded-full bg-rellia-mint/5 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.25] [background-image:radial-gradient(circle_at_30%_15%,rgba(13,53,64,0.02),transparent_52%),radial-gradient(circle_at_75%_40%,rgba(157,214,208,0.06),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px]">
        <ScrollReveal>
          <h2 className="mt-5 font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-rellia-teal md:text-[32px] lg:text-[36px]">
            {cmsDisplayText(content.engageTitle ?? "Three ways to work with Rellia")}
          </h2>
          <p className="mt-4 max-w-2xl font-urbanist text-base font-medium leading-relaxed text-black/80 md:text-lg">
            {cmsDisplayText(
              content.engageSubtitle ??
                "Large cards, clear intent—pick the path that matches how your team likes to start.",
            )}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-3 lg:gap-6">
            {cards.map((card) => {
              const Icon = resolveNetworkIcon(card.iconKey, LayoutGrid)
              const isExternal = Boolean((card as { external?: boolean }).external) || (card.href?.startsWith("http") ?? false)
              const inner = (
                <>
                  <Icon className="h-6 w-6 md:h-7 md:w-7 text-rellia-mint transition-transform duration-300 group-hover:scale-105" aria-hidden />
                  <h3 className="mt-4 font-host-grotesk text-lg font-semibold tracking-tight text-white md:text-xl">{cmsDisplayText(card.title)}</h3>
                  <p className="mt-3 flex-1 font-urbanist text-xs leading-relaxed text-white/80 md:text-sm md:leading-relaxed">{cmsDisplayText(card.body)}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-host-grotesk text-xs font-semibold text-rellia-mint md:text-sm">
                    {cmsDisplayText(card.linkLabel ?? "Learn more")}
                    {isExternal ? (
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    ) : (
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                    )}
                  </span>
                </>
              )
              return isExternal ? (
                <a
                  key={card.title}
                  href={card.href ?? GETPROVEN_VENDORS_GRID_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={engagementCardClass}
                >
                  {inner}
                </a>
              ) : (
                <Link key={card.title} to={card.href ?? "/contact"} className={engagementCardClass}>
                  {inner}
                </Link>
              )
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function BenefitsWithImageSplit({ content }: { content: NetworkPartnersPageContent }) {
  const bullets = content.benefitsBullets?.length ? content.benefitsBullets : BENEFITS

  return (
    <CreamSection>
      <div className="grid gap-12 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-16">
        <Reveal>
          <SectionHeading
            animated={false}
            title={cmsDisplayText(content.benefitsTitle ?? "Why partners stay")}
            description={cmsDisplayText(
              content.benefitsDescription ??
                "What partners tell us they value most once programs are underway.",
            )}
            className="mt-5"
          />
          <ul className="mt-10 max-w-xl space-y-4" aria-label="Partner benefits">
            {bullets.map((line, idx) => (
              <Reveal key={line} delay={0.04 * idx}>
                <li className="flex gap-3 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rellia-mint/35">
                    <Check className="h-3.5 w-3.5 text-rellia-teal" strokeWidth={3} aria-hidden />
                  </span>
                  {cmsDisplayText(line)}
                </li>
              </Reveal>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="overflow-hidden rounded-2xl border border-rellia-teal/15 shadow-[0_28px_80px_-48px_rgba(13,53,64,0.45)]">
            <img
              src="/images/metrics-bg-pexels-2.jpg"
              alt="Partners collaborating in a professional setting"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </CreamSection>
  )
}


function ExclusiveDirectorySplit({ content }: { content: NetworkPartnersPageContent }) {
  const bullets = content.directoryBullets?.length ? content.directoryBullets : [
    "Independent vendor marketplace focused on health tech needs",
    "Exclusive deals with pre-negotiated terms for Rellia portcos",
    "Pre-vetted service providers with verified healthcare references",
    "Peer-to-peer insights on implementation and support quality",
  ]

  return (
    <LightSection className="bg-rellia-cream/15">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <Reveal className="order-2 lg:order-1" delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-black/5 shadow-2xl">
            <img
              src="/images/partnersdirectory.png"
              alt="Exclusive partner directory interface"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <div className="max-w-xl">
            <h2 className="mt-6 font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-black md:mt-8 md:text-[32px] lg:text-[36px]">
              {content.directoryTitle ? (
                cmsDisplayText(content.directoryTitle)
              ) : (
                <>
                  An exclusive <span className="text-rellia-teal">directory</span> for health tech execution
                </>
              )}
            </h2>
            <p className="mt-4 font-urbanist text-base font-medium leading-relaxed text-black/70 md:text-lg">
              {cmsDisplayText(
                content.directoryDescription ??
                  "We maintain a curated directory of service providers and vendors with exclusive offers for Rellia members. Unlike generic marketplaces, our members trust these recommendations because they are grounded in peer usage and verified health tech experience.",
              )}
            </p>
            
            <ul className="mt-8 space-y-4" aria-label="Directory benefits">
              {bullets.map((line, idx) => (
                <Reveal key={idx} delay={0.04 * idx}>
                  <li className="flex gap-3 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px]">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rellia-mint/35">
                      <Check className="h-3.5 w-3.5 text-rellia-teal" strokeWidth={3} aria-hidden />
                    </span>
                    {cmsDisplayText(line)}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </LightSection>
  )
}

export default function Partners() {
  const partnersPageQuery = useNetworkPartnersPage()
  const pageReady = isCmsPageContentReady(partnersPageQuery)
  const { data: page } = partnersPageQuery
  const content = pageReady ? mergeNetworkPartnersPage(page) : null
  useApplyCmsSeo(
    page?.seo,
    content
      ? deriveHeroPageSeo({
          pageTitle: content.title ?? "Industry Partners",
          heroSubtitle: content.heroSubtitle,
          pathname: "/industry-partners",
        })
      : undefined,
  )

  if (!content) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
        <Navbar />
        <main id="main-content">
          <CmsPageLoadingShell variant="network" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <div className="lg:flex lg:h-[82vh] lg:flex-col">
          <RoleHero
            roleId="partner"
            eyebrowLabel={cmsDisplayText(content.heroEyebrow ?? "Industry partners")}
            imageSrc={content.heroImageSrc ?? "/images/industrypartners.jpg"}
            className="lg:flex-1"
          title={
            <>
              <NetworkHeroTitle content={content} fallback={DEFAULT_NETWORK_PARTNERS_PAGE.heroTitlePortable!} />
            </>
          }
          subtitle={cmsDisplayText(content.heroSubtitle ?? "Pilot design, integration support, and enterprise credibility—so promising products don't die in procurement limbo.")}
          primaryCta={{ label: cmsDisplayText(content.heroPrimaryCtaLabel ?? "Apply to join"), to: content.heroPrimaryCtaHref ?? "/apply" }}
        />
        </div>

        <PartnerEngageTealBand content={content} />
        <BenefitsWithImageSplit content={content} />
        <ExclusiveDirectorySplit content={content} />

        <WhyRellia
          sectionTitle={cmsDisplayText(content.whyTitle ?? "Why industry leaders partner with Rellia")}
          sectionDescription={cmsDisplayText(
            content.whyDescription ??
              "We align commercial innovators, healthcare systems, and clinical networks around active pilots and structured technology adoption.",
          )}
          features={mapNetworkWhyFeatures(
            content.whyFeatures?.length
              ? content.whyFeatures
              : [
                  {
                    title: "Vetted healthcare scale",
                    body: "Skip cold emails and pre-screened meetings—connect directly with startups whose product, funding, and clinical roadmap are validated.",
                  },
                  {
                    title: "Active pilot sequencing",
                    body: "Work with founders who know exactly what success metrics and integration boundaries they need to hit in system deployments.",
                  },
                  {
                    title: "Secure compliance",
                    body: "Ensure technical standards and compliance logic align with hospital requirements right from first touch.",
                  },
                  {
                    title: "Direct GTM engagement",
                    body: "Co-design channels, APIs, and commercial handoffs within a community structured around real healthcare adoption.",
                  },
                ],
          )}
          sectionClassName="bg-rellia-cream/20"
        />

        {content.sections?.length ? <SectionsRenderer sections={content.sections} /> : null}

        <div className="bg-rellia-cream/20">
          <RelliaCta
            title={content.ctaTitle ?? "Partner with Rellia"}
            body={
              content.ctaBody ??
              "Tell us about your organization, integration surface area, and the founder profiles you want to see more of. We'll route you to the right partner lead."
            }
            primary={{ label: content.ctaPrimaryLabel ?? "Apply", to: content.ctaPrimaryHref ?? "/apply" }}
            secondary={optionalCtaAction(content.ctaSecondaryLabel, content.ctaSecondaryHref)}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
