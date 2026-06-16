import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SectionHeading from "@/components/SectionHeading"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { SectionsRenderer } from "@/components/cms/PageRenderer"
import ScrollReveal from "@/components/ScrollReveal"
import ProgramTrustedMembersSection from "@/components/program/ProgramTrustedMembersSection"
import { useConsultingPage } from "@/hooks/useCmsDocuments"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { deriveHeroPageSeo } from "@/lib/cmsPageSeoDefaults"
import { CmsModularSingletonPage } from "@/components/cms/CmsModularSingletonPage"
import { DEFAULT_CONSULTING_PAGE } from "@shared/cms/defaults"
import { NetworkHeroTitle } from "@/components/NetworkHeroTitle"
import type { ConsultingPageContent } from "@shared/cms/types"
import {
  CheckCircle2,
  Palette,
  ShieldCheck,
  Stethoscope,
  Megaphone,
  ArrowRight,
} from "lucide-react"
import { resolveLucideIcon } from "@/lib/resolveLucideIcon"
import { Link } from "react-router-dom"
import { cmsDisplayText } from "@/lib/cmsStega"
import { LightSection, Reveal, RoleHero } from "./network/_shared"

function FitSectionSplit({ content }: { content: ConsultingPageContent }) {
  return (
    <LightSection className="bg-rellia-cream/20 pt-12 md:pt-16">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            animated={false}
            title={cmsDisplayText(content.fitTitle ?? DEFAULT_CONSULTING_PAGE.fitTitle!)}
            description={cmsDisplayText(content.fitDescription ?? DEFAULT_CONSULTING_PAGE.fitDescription)}
            className="mt-5"
          />
          <ul className="mt-10 max-w-3xl space-y-4" role="list">
            {(content.fitBullets ?? DEFAULT_CONSULTING_PAGE.fitBullets ?? []).map((line, idx) => (
              <Reveal key={`${line.slice(0, 32)}-${idx}`} delay={0.04 * idx}>
                <li className="flex gap-3 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rellia-teal" aria-hidden />
                  {cmsDisplayText(line)}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={0.06}>
          <div className="overflow-hidden rounded-2xl border border-rellia-teal/15 shadow-[0_28px_80px_-48px_rgba(13,53,64,0.4)]">
            <img
              src={content.fitImageSrc ?? DEFAULT_CONSULTING_PAGE.fitImageSrc}
              alt="Clinical and commercial leaders in a focused working session"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </LightSection>
  )
}

function ServicesGridSection({ content }: { content: ConsultingPageContent }) {
  const services = content.services ?? DEFAULT_CONSULTING_PAGE.services ?? []

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
            {cmsDisplayText(content.servicesTitle ?? DEFAULT_CONSULTING_PAGE.servicesTitle)}
          </h2>
          <p className="mt-4 max-w-2xl font-urbanist text-base font-medium leading-relaxed text-black/80 md:text-lg">
            {cmsDisplayText(content.servicesSubtitle ?? DEFAULT_CONSULTING_PAGE.servicesSubtitle)}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {services.map((card) => {
              const Icon = resolveLucideIcon(card.iconKey, ShieldCheck)
              return (
                <Link
                  key={card.title}
                  to="/contact"
                  className="group flex min-h-[240px] cursor-pointer flex-col rounded-2xl border border-black/10 bg-gradient-to-br from-rellia-teal to-[#144853] p-8 transition duration-300 hover:from-[#113f4a] hover:to-[#0f3842] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <Icon className="h-8 w-8 text-rellia-mint transition-transform duration-300 group-hover:scale-105" aria-hidden />
                  <h3 className="mt-5 font-host-grotesk text-xl font-semibold tracking-tight text-white">{cmsDisplayText(card.title)}</h3>
                  <p className="mt-4 flex-1 font-urbanist text-sm leading-relaxed text-white/80">{cmsDisplayText(card.body)}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-mint">
                    {cmsDisplayText(card.ctaLabel ?? "Learn more")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function ConsultingFallback({ content }: { content: ConsultingPageContent }) {
  const stats = content.membershipStats ?? DEFAULT_CONSULTING_PAGE.membershipStats ?? []

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <div className="lg:flex lg:h-[82vh] lg:flex-col">
          <RoleHero
            eyebrowLabel={cmsDisplayText(content.heroEyebrow ?? DEFAULT_CONSULTING_PAGE.heroEyebrow)}
            imageSrc={content.heroImageSrc ?? DEFAULT_CONSULTING_PAGE.heroImageSrc}
            className="lg:flex-1"
            title={
              <NetworkHeroTitle
                content={content}
                fallback={DEFAULT_CONSULTING_PAGE.heroTitlePortable!}
              />
            }
            subtitle={cmsDisplayText(content.heroSubtitle ?? DEFAULT_CONSULTING_PAGE.heroSubtitle)}
            primaryCta={{
              label: cmsDisplayText(content.heroPrimaryCtaLabel ?? DEFAULT_CONSULTING_PAGE.heroPrimaryCtaLabel!),
              to: content.heroPrimaryCtaHref ?? DEFAULT_CONSULTING_PAGE.heroPrimaryCtaHref!,
            }}
            secondaryCta={{
              label: cmsDisplayText(content.heroSecondaryCtaLabel ?? DEFAULT_CONSULTING_PAGE.heroSecondaryCtaLabel!),
              to: content.heroSecondaryCtaHref ?? DEFAULT_CONSULTING_PAGE.heroSecondaryCtaHref!,
            }}
          />
        </div>

        <FitSectionSplit content={content} />
        <ServicesGridSection content={content} />
        <ProgramTrustedMembersSection
          title={cmsDisplayText(content.testimonialsTitle ?? DEFAULT_CONSULTING_PAGE.testimonialsTitle)}
          testimonials={content.testimonials ?? DEFAULT_CONSULTING_PAGE.testimonials}
        />

        <LightSection className="bg-rellia-cream/20">
          <div className="mx-auto max-w-[1300px]">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
              <ScrollReveal>
                <SectionHeading
                  animated={false}
                  title={cmsDisplayText(content.membershipTitle ?? DEFAULT_CONSULTING_PAGE.membershipTitle!)}
                  description={cmsDisplayText(content.membershipDescription ?? DEFAULT_CONSULTING_PAGE.membershipDescription)}
                  className="mt-5"
                />
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <RelliaAction asChild variant="relliaCtaPrimary" size="comfortable">
                    <Link
                      to={content.membershipPrimaryCtaHref ?? DEFAULT_CONSULTING_PAGE.membershipPrimaryCtaHref!}
                      className="inline-flex cursor-pointer items-center justify-center"
                    >
                      {cmsDisplayText(content.membershipPrimaryCtaLabel ?? DEFAULT_CONSULTING_PAGE.membershipPrimaryCtaLabel)}
                    </Link>
                  </RelliaAction>
                  <RelliaAction
                    asChild
                    variant="outlineOnWhite"
                    size="comfortable"
                    className="hover:!border-rellia-mint hover:!bg-rellia-mint hover:!text-rellia-teal"
                  >
                    <Link
                      to={content.membershipSecondaryCtaHref ?? DEFAULT_CONSULTING_PAGE.membershipSecondaryCtaHref!}
                      className="inline-flex cursor-pointer items-center justify-center"
                    >
                      {cmsDisplayText(content.membershipSecondaryCtaLabel ?? DEFAULT_CONSULTING_PAGE.membershipSecondaryCtaLabel)}
                    </Link>
                  </RelliaAction>
                </div>
              </ScrollReveal>

              <Reveal delay={0.06}>
                <div className="relative overflow-hidden rounded-3xl border border-rellia-teal/10 bg-white p-6 shadow-[0_28px_80px_-52px_rgba(13,53,64,0.35)] md:p-8">
                  <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-24 h-[340px] w-[340px] rounded-full bg-rellia-mint/22 blur-3xl" />
                    <div className="absolute -right-28 bottom-0 h-[380px] w-[380px] rounded-full bg-rellia-teal/10 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.10),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(167,219,214,0.18),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(13,53,64,0.08),transparent_55%)]" />
                  </div>

                  <div className="relative z-10 grid gap-4">
                    {stats.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/80 px-5 py-4 backdrop-blur-sm"
                      >
                        <p className="font-urbanist text-sm font-medium text-black/60">{cmsDisplayText(row.label)}</p>
                        <p className="font-host-grotesk text-base font-semibold text-rellia-teal">{cmsDisplayText(row.value)}</p>
                      </div>
                    ))}

                    <div className="mt-2 rounded-2xl bg-rellia-teal px-5 py-4 text-white shadow-sm">
                      <p className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.14em] text-rellia-mint">
                        {cmsDisplayText(content.membershipSavingsTitle ?? DEFAULT_CONSULTING_PAGE.membershipSavingsTitle)}
                      </p>
                      <p className="mt-2 font-urbanist text-sm leading-relaxed text-white/85">
                        {cmsDisplayText(content.membershipSavingsBody ?? DEFAULT_CONSULTING_PAGE.membershipSavingsBody)}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </LightSection>

        {content.sections?.length ? <SectionsRenderer sections={content.sections} /> : null}

        <div className="bg-rellia-cream/20">
          <RelliaCta
            title={cmsDisplayText(content.ctaTitle ?? DEFAULT_CONSULTING_PAGE.ctaTitle!)}
            body={cmsDisplayText(content.ctaBody ?? DEFAULT_CONSULTING_PAGE.ctaBody)}
            primary={{
              label: cmsDisplayText(content.ctaPrimaryLabel ?? DEFAULT_CONSULTING_PAGE.ctaPrimaryLabel!),
              to: content.ctaPrimaryHref ?? DEFAULT_CONSULTING_PAGE.ctaPrimaryHref!,
            }}
            secondary={
              content.ctaSecondaryLabel && content.ctaSecondaryHref
                ? {
                    label: cmsDisplayText(content.ctaSecondaryLabel),
                    to: content.ctaSecondaryHref,
                  }
                : undefined
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function Consulting() {
  const { data: cmsPage } = useConsultingPage()
  const content = cmsPage ?? DEFAULT_CONSULTING_PAGE

  useApplyCmsSeo(
    content.seo,
    deriveHeroPageSeo({
      pageTitle: "Founder consulting",
      heroSubtitle: content.heroSubtitle,
      pathname: "/consulting",
    }),
  )

  return (
    <CmsModularSingletonPage
      fallback={<ConsultingFallback content={content} />}
    />
  )
}
