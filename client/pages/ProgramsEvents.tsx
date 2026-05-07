import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta";
import { HorizontalCard } from "@/components/cards";
import PageHeader from "@/components/PageHeader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePrograms, useProgramsLandingPage } from "@/hooks/useCmsDocuments";
import { cn } from "@/lib/utils"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import FilteredListEmptyState from "@/components/FilteredListEmptyState";

type ProgramFilter = "all" | "available" | "waitlist";
const PAGE_SIZE = 12

export default function ProgramsEvents() {
  const { data } = useProgramsLandingPage();
  const pl = data ?? DEFAULT_PROGRAMS_LANDING;
  const { data: programsData } = usePrograms()
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("all");
  const [page, setPage] = useState(1)

  const { availablePrograms, waitlistPrograms } = useMemo(() => {
    const programs = pl.programs ?? []
    const available = programs.filter((p) => Boolean(p.href && p.href.trim().length > 0) && !Boolean(p.waitlistHref && p.waitlistHref.trim().length > 0))
    const waitlist = programs.filter(
      (p) => Boolean(p.waitlistHref && p.waitlistHref.trim().length > 0),
    )
    return { availablePrograms: available, waitlistPrograms: waitlist }
  }, [pl.programs])

  const programs = Array.isArray(programsData) && programsData.length > 0 ? programsData : (pl.programs ?? [])

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
          title={
            <>
              Programming that <span className="text-rellia-mint">fits your startup</span>
            </>
          }
          subtitle={pl.programsSectionSubtitle}
        />

        <section id="view-programs" className="pt-8 pb-12 md:pt-10 md:pb-16 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="mb-4">
                <h2 className="font-host-grotesk text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-black">
                  Browse Programs
                </h2>
              </div>
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:w-auto">
                  {/* Mobile: full-width segmented options */}
                  <div className="md:hidden">
                    <Tabs value={programFilter} onValueChange={(v) => setProgramFilter(v as ProgramFilter)}>
                      <TabsList
                        className={cn(
                          "relative h-auto w-full gap-1 rounded-full bg-white p-1.5",
                          "border border-black/10 shadow-[0_12px_32px_-22px_rgba(0,0,0,0.22)]",
                        )}
                      >
                        {filters.map((f) => (
                          <TabsTrigger
                            key={f.value}
                            value={f.value}
                            className={cn(
                              "relative flex-1 rounded-full px-3 py-2.5 text-center",
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

                  {/* Desktop: segmented tabs */}
                  <div className="hidden md:block">
                    <Tabs value={programFilter} onValueChange={(v) => setProgramFilter(v as ProgramFilter)}>
                      <TabsList
                        className={cn(
                          "relative h-auto w-fit gap-1 rounded-full bg-white p-1.5",
                          "border border-black/10 shadow-[0_12px_32px_-22px_rgba(0,0,0,0.22)]",
                        )}
                      >
                        {filters.map((f) => (
                          <TabsTrigger
                            key={f.value}
                            value={f.value}
                            className={cn(
                              "relative rounded-full px-4 py-2.5",
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
                </div>

                <p className="font-urbanist text-sm text-black/55 md:text-right">
                  Showing {pagePrograms.length} of {visiblePrograms.length} programs
                </p>
              </div>

              {visiblePrograms.length === 0 ? (
                <FilteredListEmptyState
                  className="mt-6"
                  icon={LayoutGrid}
                  title="No programs match this filter"
                  description="Try the All tab, or check back as we open new cohorts and waitlists."
                />
              ) : (
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }}
                  className="flex flex-col gap-6 will-change-transform"
                >
                  <AnimatePresence mode="sync" initial={false}>
                    {pagePrograms.map((p) => (
                      <motion.div
                        key={`${p.title}-${p.imageSrc}`}
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

        <RelliaCta
          title={pl.ctaTitle}
          body={pl.ctaBody}
          primary={ctaActionFromHref(pl.ctaButtonLabel, pl.ctaButtonHref)}
        />
      </main>

      <Footer />
    </div>
  );
}
