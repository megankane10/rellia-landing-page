import type { ReactNode } from "react"
import { useMemo, useState } from "react"
import { PEXELS_OFFICE_COLLABORATION } from "@/config/pexelsFallbacks"
import PageHeader from "@/components/PageHeader"
import SectionHeading from "@/components/SectionHeading"
import WhyRellia from "@/components/WhyRellia"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LogoMarquee from "@/components/LogoMarquee"
import { INVESTOR_BRAND_SVG_MARKS, PORTFOLIO_LOGO_MARKS } from "@/data/portfolioLogos"
import InvestorNotifyForm from "@/components/network/InvestorNotifyForm"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import ScrollReveal from "@/components/ScrollReveal"
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, Users, Check } from "lucide-react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { CreamSection, GlassCard, GlassCardLight, LightSection, Reveal, RoleHero } from "./_shared"
import { useNetworkInvestorsPage } from "@/hooks/useCmsDocuments"
import NetworkCmsPage from "./NetworkCmsPage"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import CmsPageVisibilityGate from "@/components/cms/CmsPageVisibilityGate"

const COLORS = {
  blue: "#2563eb",
  teal: "#0d9488",
  slate: "#475569",
  cyan: "#0891b2",
  indigo: "#4f46e5",
  mint: "#5eead4",
  violet: "#7c3aed",
}

const INVESTOR_BENEFITS = [
  {
    title: "Diligence-ready narratives",
    body: "Teams arrive with clearer milestones across clinical, regulatory, and commercial tracks—less scramble in your inbox.",
    icon: ShieldCheck,
  },
  {
    title: "Operator-backed signal",
    body: "Founders are coached by advisors who have shipped in healthcare—not generic mentors recycling buzzwords.",
    icon: Sparkles,
  },
  {
    title: "Curated intros",
    body: "Sessions are thesis-aware and hosted virtually—focused conversations instead of crowded demo days.",
    icon: Users,
  },
  {
    title: "Pattern visibility",
    body: "See how companies cluster by stage, modality, and buyer so you can tune allocation faster.",
    icon: BarChart3,
  },
] as const

const B2B_DATA = [
  { name: "B2B / enterprise", value: 62, fill: COLORS.blue },
  { name: "B2C / patient", value: 24, fill: COLORS.teal },
  { name: "Hybrid", value: 14, fill: COLORS.slate },
]

const STAGE_DATA = [
  { name: "Idea / pre-product", value: 12, fill: COLORS.violet },
  { name: "Pre-seed", value: 26, fill: COLORS.indigo },
  { name: "Seed", value: 38, fill: COLORS.teal },
  { name: "Series A", value: 24, fill: COLORS.cyan },
]

const DEVICE_DATA = [
  { name: "Med device / diagnostics", value: 34, fill: COLORS.blue },
  { name: "Digital / SaMD", value: 41, fill: COLORS.mint },
  { name: "Services + tech", value: 25, fill: COLORS.slate },
]

function IllustrativePie({
  title,
  data,
  ariaLabel,
}: {
  title: string
  data: Array<{ name: string; value: number; fill: string }>
  ariaLabel: string
}) {
  return (
    <GlassCardLight className="flex h-full flex-col p-6 md:p-8">
      <p className="font-host-grotesk text-lg font-semibold text-rellia-teal">{title}</p>
      <p className="mt-1 font-urbanist text-xs text-black/50">Illustrative mix for thesis fit—not a fund mandate.</p>
      <div
        className="mt-4 h-[220px] w-full min-h-[220px]"
        role="img"
        aria-label={ariaLabel}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Share"]}
              contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)" }}
            />
            <Legend
              verticalAlign="bottom"
              formatter={(value) => <span className="font-urbanist text-xs text-black/75">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCardLight>
  )
}

function PipelinePhotoSection({
  children,
}: {
  children: ReactNode
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] w-full">
      <img
        src="https://images.pexels.com/photos/7578803/pexels-photo-7578803.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/90 via-rellia-teal/75 to-[#0a2830]/88" aria-hidden />
      <div aria-hidden className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
      <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 py-16 md:py-24">{children}</div>
    </section>
  )
}

function PortfolioSplit() {
  return (
    <CreamSection>
      <div className="grid gap-12 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-16">
        <Reveal>
          <h2 className="mt-5 font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-rellia-teal md:text-[32px]">
            Offer Rellia to your portfolio
          </h2>
          <p className="mt-4 font-urbanist text-base font-medium leading-relaxed text-black/70 md:text-lg">
            Plug your teams into operators, advisors, and partner pathways that shorten cycles from pilot to procurement.
          </p>

          <ul className="mt-10 max-w-xl space-y-4" aria-label="Portfolio benefits">
            {[
              {
                title: "Pilot pathways",
                body: "Teams get structured support to define scope, metrics, and technical requirements for system pilots."
              },
              {
                title: "Integration support",
                body: "Connect founders with technical leaders who understand the reality of deployments."
              },
              {
                title: "Regulatory edge",
                body: "Access advisors who have successfully navigated FDA submissions and modality shifts."
              },
              {
                title: "Ecosystem access",
                body: "Shorten the distance to procurement by aligning with shared clinical standards."
              }
            ].map((point, idx) => (
              <Reveal key={idx} delay={0.04 * idx}>
                <li className="flex gap-3 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rellia-mint/35">
                    <Check className="h-3.5 w-3.5 text-rellia-teal" strokeWidth={3} aria-hidden />
                  </span>
                  <div>
                    <span className="font-bold text-black">{point.title}: </span>
                    {point.body}
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="overflow-hidden rounded-2xl border border-rellia-teal/15 shadow-[0_28px_80px_-48px_rgba(13,53,64,0.45)]">
            <img
              src={PEXELS_OFFICE_COLLABORATION}
              alt="Investors and founders collaborating"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </CreamSection>
  )
}

export default function Investors() {
  const investorsPageQuery = useNetworkInvestorsPage()
  const { data: page } = investorsPageQuery
  useApplyCmsSeo(page?.seo)

  const useModularLayout =
    Boolean(page?.useModularPage) && (page?.sections?.length ?? 0) > 0

  const [showNotifyForm, setShowNotifyForm] = useState(false)

  const logoMarks = useMemo(() => {
    const fromCms = (page?.logoMarquee ?? [])
      .map((entry) => ({
        name: typeof entry?.name === "string" ? entry.name.trim() : "",
        src: typeof entry?.src === "string" ? entry.src.trim() : "",
      }))
      .filter((entry) => {
        if (!entry.name || !entry.src) return false
        // Filter out portfolio logos if they leak into Sanity's investor page document
        const isPortfolio = PORTFOLIO_LOGO_MARKS.some(
          (p) => p.name.toLowerCase() === entry.name.toLowerCase(),
        )
        return !isPortfolio
      })
    if (fromCms.length > 0) return fromCms
    return [...INVESTOR_BRAND_SVG_MARKS]
  }, [page?.logoMarquee])

  const COLOR_PALETTE = useMemo(
    () => [
      COLORS.blue,
      COLORS.teal,
      COLORS.slate,
      COLORS.cyan,
      COLORS.indigo,
      COLORS.mint,
      COLORS.violet,
    ],
    []
  )

  const charts = useMemo(() => {
    if (Array.isArray(page?.foundersCluster) && page.foundersCluster.length > 0) {
      return page.foundersCluster.map((chart) => {
        const segments = (chart.segments ?? []).map((seg, idx) => ({
          name: seg.name || "",
          value: seg.value || 0,
          fill: COLOR_PALETTE[idx % COLOR_PALETTE.length],
        }))
        return {
          title: chart.title || "",
          data: segments,
          ariaLabel: `Pie chart of ${chart.title || "distribution"}`
        }
      })
    }
    return [
      {
        title: "B2B vs B2C",
        data: B2B_DATA,
        ariaLabel: "Pie chart of B2B versus B2C versus hybrid share",
      },
      {
        title: "Stages",
        data: STAGE_DATA,
        ariaLabel: "Pie chart of company stages from idea through Series A",
      },
      {
        title: "Device & delivery",
        data: DEVICE_DATA,
        ariaLabel: "Pie chart of device types and delivery models",
      },
    ]
  }, [page?.foundersCluster, COLOR_PALETTE])

  if (useModularLayout) {
    return (
      <CmsPageVisibilityGate page={page}>
        <NetworkCmsPage page={page} query={investorsPageQuery} />
      </CmsPageVisibilityGate>
    )
  }

  return (
    <CmsPageVisibilityGate page={page}>
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk flex flex-col">
      <Navbar forceSolid={showNotifyForm} />

      <main id="main-content" className={`flex w-full flex-1 flex-col ${showNotifyForm ? "pt-[72px] md:pt-[86px]" : ""}`}>
        <AnimatePresence mode="wait">
          {!showNotifyForm ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="lg:flex lg:h-[82vh] lg:flex-col">
                <RoleHero
                  roleId="investor"
                  imageSrc="/images/investors.jpg"
                  className="lg:flex-1"
                  title={
                    <>
                      Stop sorting through <span className="text-rellia-mint">cold pitch decks.</span>
                    </>
                  }
                  subtitle="Meet Rellia-backed teams with sharper milestones—clinical, regulatory, and commercial—before the usual diligence scramble."
                  primaryCta={{ label: "Get notified" }}
                  onPrimaryClick={() => setShowNotifyForm(true)}
                />
              </div>

              <WhyRellia
                sectionTitle="Benefits of investing alongside Rellia"
                sectionDescription="We shorten the distance between credible narrative and reality checks from people who have scaled in healthcare."
                features={INVESTOR_BENEFITS.map((b) => ({
                  title: b.title,
                  description: b.body,
                  iconKey: "",
                }))}
                cardImages={[
                  "https://images.pexels.com/photos/1666012/pexels-photo-1666012.jpeg?auto=compress&cs=tinysrgb&w=1200",
                  "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&w=1200",
                  "https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=1200",
                  "https://images.pexels.com/photos/1485637/pexels-photo-1485637.jpeg?auto=compress&cs=tinysrgb&w=1200",
                ]}
                sectionClassName="bg-rellia-cream/20"
              />

              <div className="py-10 md:py-16 bg-white">
                <PipelinePhotoSection>
                  <ScrollReveal>
                    <h2 className="mt-5 font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-[40px]">
                      How founders cluster
                    </h2>
                    <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-white/85">
                      Illustrative distributions based on active introductions—useful for thesis alignment.
                    </p>
                  </ScrollReveal>
                  <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {charts.map((chart, idx) => (
                      <Reveal key={chart.title || idx} delay={0.05 + idx * 0.03}>
                        <IllustrativePie
                          title={chart.title}
                          data={chart.data}
                          ariaLabel={chart.ariaLabel}
                        />
                      </Reveal>
                    ))}
                  </div>
                </PipelinePhotoSection>
              </div>

              <section className="relative overflow-hidden bg-[#071018] px-6 py-16 text-white md:px-10 md:py-24">
                <div aria-hidden className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
                  <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
                </div>
                <div className="relative mx-auto max-w-[1300px]">
                  <ScrollReveal>
                    <h2 className="mt-5 font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-rellia-mint md:text-[32px]">
                      Exclusive connections and pitch events
                    </h2>
                    <p className="mt-6 max-w-2xl font-urbanist text-lg leading-relaxed text-white/80">
                      Host a focused virtual session aligned to your mandate—or join a larger showcase to compare teams alongside fellow investors.
                    </p>
                  </ScrollReveal>
                  <div className="mt-8 md:mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Reveal delay={0.06}>
                      <div className="group relative overflow-hidden rounded-[24px] border border-white/10 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-[1px] hover:shadow-md h-[400px] md:h-[480px]">
                        <img
                          src="/images/whyrellia-founders.jpg"
                          alt="Individual pitch session"
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                          <h3 className="font-host-grotesk text-2xl font-semibold text-white drop-shadow-sm">Individual pitch session</h3>
                          <p className="mt-4 font-urbanist leading-relaxed text-white/90 text-lg">
                            A virtual session scoped to your thesis—dig into workflow, reimbursement, or regulatory edge cases without competing noise.
                          </p>
                        </div>
                      </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                      <div className="group relative overflow-hidden rounded-[24px] border border-white/10 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-[1px] hover:shadow-md h-[400px] md:h-[480px]">
                        <img
                          src="/images/whyrellia-network-2.jpg"
                          alt="Group pitch event"
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                          <h3 className="font-host-grotesk text-2xl font-semibold text-white drop-shadow-sm">Group pitch event</h3>
                          <p className="mt-4 font-urbanist leading-relaxed text-white/90 text-lg">
                            See multiple teams with standardized milestones—ideal for pattern recognition and efficient filtering before deeper diligence.
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                </div>
              </section>

              <LightSection className="bg-white">
                <div className="mx-auto max-w-[1300px]">
                  <ScrollReveal>
                    <SectionHeading
                      animated={false}
                      title="VC funds and angel groups we work with"
                      description="Organizations that regularly meet Rellia founders through intros, showcases, and shared diligence."
                      className="mt-5"
                    />
                  </ScrollReveal>
                </div>
                <div className="mt-12 md:mt-16">
                  <LogoMarquee
                    marks={logoMarks}
                    showHeading={false}
                    density="default"
                    sectionClassName="bg-white py-4"
                  />
                </div>
              </LightSection>

              <PortfolioSplit />

              <div className="bg-rellia-cream/35">
                <RelliaCta
                  title="Partner concierge"
                  body="Share a portfolio company and the milestone you want to unlock—we’ll suggest the lightest-weight Rellia touchpoints to match."
                  primary={{ label: "Explore the Alumni Directory", to: "/founders/alumni" }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="notify-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full bg-rellia-cream/40 py-16 md:py-24"
            >
              <div className="mx-auto max-w-[640px] px-6 md:px-10">
                <button
                  type="button"
                  onClick={() => setShowNotifyForm(false)}
                  className="mb-8 font-host-grotesk text-sm font-semibold text-rellia-teal underline-offset-4 hover:underline"
                >
                  ← Back to details
                </button>
                <InvestorNotifyForm />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
    </CmsPageVisibilityGate>
  )
}
