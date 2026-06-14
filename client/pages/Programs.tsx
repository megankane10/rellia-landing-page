import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { SectionsRenderer } from "@/components/cms/PageRenderer"
import { DiagnosticSurveySection } from "@/components/DiagnosticSurveySection"
import { HorizontalCard } from "@/components/cards"
import PageHeader from "@/components/PageHeader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePrograms, useProgramsLandingPage } from "@/hooks/useCmsDocuments"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { clampMetaDescription, clampMetaTitle, getSeoForPathname } from "@/config/seo"
import { cn } from "@/lib/utils"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import { DEFAULT_PROGRAMS_LANDING_HERO_PORTABLE } from "@shared/cms/inlineHeroHeadline"
import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
import { cmsDisplayText } from "@/lib/cmsStega"

type ProgramFilter = "all" | "available" | "waitlist"
const PAGE_SIZE = 12

export default function Programs() {
  const { data } = useProgramsLandingPage()
  const pl = data ?? DEFAULT_PROGRAMS_LANDING
  const programsRouteSeo = getSeoForPathname("/programs")
  const cmsSeoWithoutLegacyTitle = pl.seo
    ? { ...pl.seo, metaTitle: undefined, ogTitle: undefined }
    : pl.seo
  useApplyCmsSeo(cmsSeoWithoutLegacyTitle, {
    title: clampMetaTitle(programsRouteSeo.title),
    description: clampMetaDescription(programsRouteSeo.description),
  })
  const { data: programsData } = usePrograms()
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("all")
  const [page, setPage] = useState(1)

  const programs = useMemo(() => {
    // Favor the standalone program collection, fallback to the landing page array, finally the hardcoded defaults.
    const rawList = (programsData && programsData.length > 0) ? programsData : (pl.programs ?? [])

    const seenTitles = new Set<string>()
    const processed = rawList.filter((p: any) => {
      if (!p.title) return false
      const normalizedTitle = p.title.toLowerCase().trim().replace(/[^a-z0-9]/g, "")

      if (seenTitles.has(normalizedTitle)) return false
      seenTitles.add(normalizedTitle)

      return true
    })

    // Custom sort:
    // 1. QMS first
    // 2. Upcoming second
    // 3. Others (available then waitlist)
    return [...processed].sort((a: any, b: any) => {
      const titleA = a.title.toLowerCase().trim().replace(/[^a-z0-9]/g, "")
      const titleB = b.title.toLowerCase().trim().replace(/[^a-z0-9]/g, "")
      const isQmsA = titleA === "buildyourqualitymanagementsystem"
      const isQmsB = titleB === "buildyourqualitymanagementsystem"
      if (isQmsA && !isQmsB) return -1
      if (!isQmsA && isQmsB) return 1

      const isUpcomingA = a.status === "upcoming"
      const isUpcomingB = b.status === "upcoming"
      if (isUpcomingA && !isUpcomingB) return -1
      if (!isUpcomingA && isUpcomingB) return 1

      const isWaitlistA = a.status === "waitlist" || Boolean(a.waitlistHref)
      const isWaitlistB = b.status === "waitlist" || Boolean(b.waitlistHref)
      if (!isWaitlistA && isWaitlistB) return -1
      if (isWaitlistA && !isWaitlistB) return 1

      return 0
    })
  }, [programsData, pl.programs])

  const { availablePrograms, waitlistPrograms } = useMemo(() => {
    const available = programs.filter(
      (p: any) =>
        Boolean(p.href && p.href.trim().length > 0) &&
        p.status !== "waitlist" && !(p.waitlistHref && p.waitlistHref.trim().length > 0),
    )
    const waitlist = programs.filter((p: any) => p.status === "waitlist" || Boolean(p.waitlistHref && p.waitlistHref.trim().length > 0))
    return { availablePrograms: available, waitlistPrograms: waitlist }
  }, [programs])

  const visiblePrograms =
    programFilter === "all"
      ? programs
      : programFilter === "available"
        ? availablePrograms
        : waitlistPrograms

  const filters: Array<{ label: string; value: ProgramFilter }> = [
    { label: "All", value: "all" },
    { label: "Available", value: "available" },
    { label: "Waitlist", value: "waitlist" },
  ]

  useEffect(() => {
    setPage(1)
  }, [programFilter])

  useEffect(() => {
    const el = document.getElementById("view-programs")
    if (el && page > 1) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [page])

  const totalPages = Math.max(1, Math.ceil(visiblePrograms.length / PAGE_SIZE))
  const pagePrograms = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return visiblePrograms.slice(start, start + PAGE_SIZE)
  }, [page, visiblePrograms])

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1))
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1))

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <PageHeader
          variant="dark"
          titleClassName="text-4xl md:text-5xl lg:text-6xl"
          title={
            <HeroHeadlinePortable
              value={pl.heroTitlePortable ?? DEFAULT_PROGRAMS_LANDING_HERO_PORTABLE}
            />
          }
          subtitle={
            cmsDisplayText(pl.heroSubtitle) ||
            "Every program is designed to help you accomplish your next milestone, not just learn about it."
          }
        />

        <section id="view-programs" className="pt-8 pb-12 md:pt-10 md:pb-16 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <h2 className="mb-6 font-host-grotesk text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-black">
                {cmsDisplayText(pl.programsSectionTitle ?? "Explore programs")}
              </h2>
              {pl.programsSectionSubtitle?.trim() ? (
                <p className="mb-6 max-w-3xl font-urbanist text-base leading-relaxed text-black/60 md:text-lg">
                  {cmsDisplayText(pl.programsSectionSubtitle)}
                </p>
              ) : null}

              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:w-auto">
                  <Tabs value={programFilter} onValueChange={(v) => setProgramFilter(v as ProgramFilter)}>
                    <TabsList
                      className={cn(
                        "relative h-auto w-full md:w-fit gap-1 rounded-full bg-white p-1.5",
                        "border border-black/10 shadow-[0_12px_32px_-22px_rgba(0,0,0,0.22)]",
                      )}
                    >
                      {filters.map((f) => (
                        <TabsTrigger
                          key={f.value}
                          value={f.value}
                          className={cn(
                            "relative flex-1 md:flex-initial rounded-full px-5 py-2.5",
                            "font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em]",
                            "text-black/80 hover:text-rellia-teal",
                            "bg-transparent data-[state=active]:bg-rellia-teal data-[state=active]:text-white data-[state=active]:shadow-none",
                            "focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                          )}
                        >
                          {programFilter === f.value ? (
                            <motion.span
                              layoutId="programs-filter-pill"
                              className="absolute inset-0 z-0 rounded-full bg-rellia-teal shadow-sm"
                              transition={{ type: "spring", stiffness: 520, damping: 42 }}
                              aria-hidden
                            />
                          ) : null}
                          <span className="relative z-[1]">{f.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <p className="font-urbanist text-sm text-black/55 md:text-right">
                  Showing {pagePrograms.length} of {visiblePrograms.length} programs
                </p>
              </div>

              {visiblePrograms.length === 0 ? (
                <FilteredListEmptyState
                  className="mt-6"
                  icon={LayoutGrid}
                  title="No programs"
                  description="No programs match this filter. Try the All tab, or check back as we open new cohorts and waitlists."
                />
              ) : (
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }}
                  className="flex flex-col gap-8 will-change-transform"
                >
                  <AnimatePresence mode="sync" initial={false}>
                    {pagePrograms.map((p: any) => (
                      <motion.div
                        key={p.title.toLowerCase().trim().replace(/[^a-z0-9]/g, "")}
                        layout="position"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{
                          duration: 0.26,
                          ease: [0.16, 1, 0.3, 1],
                          layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                        }}
                      >
                        <HorizontalCard type="program" item={p} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {totalPages > 1 ? (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                    className={[
                      "inline-flex h-12 w-12 items-center justify-center rounded-full border font-host-grotesk font-semibold transition-colors",
                      page <= 1
                        ? "cursor-not-allowed border-black/10 bg-white text-black/30"
                        : "border-black/10 bg-white text-rellia-teal hover:border-rellia-teal hover:text-rellia-teal",
                    ].join(" ")}
                    aria-label="Previous programs page"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>

                  <p className="font-urbanist text-base text-black/60" aria-label="Programs page indicator">
                    Page {page} of {totalPages}
                  </p>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                    className={[
                      "inline-flex h-12 w-12 items-center justify-center rounded-full border font-host-grotesk font-semibold transition-colors",
                      page >= totalPages
                        ? "cursor-not-allowed border-black/10 bg-white text-black/30"
                        : "border-black/10 bg-white text-rellia-teal hover:border-rellia-teal hover:text-rellia-teal",
                    ].join(" ")}
                    aria-label="Next programs page"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              ) : null}
            </ScrollReveal>
          </div>
        </section>
        
        <DiagnosticSurveySection />

        {pl.sections?.length ? <SectionsRenderer sections={pl.sections} /> : null}

        <RelliaCta
          title={pl.ctaTitle}
          body={pl.ctaBody}
          primary={ctaActionFromHref(pl.ctaButtonLabel, pl.ctaButtonHref)}
        />
      </main>

      <Footer />
    </div>
  )
}

