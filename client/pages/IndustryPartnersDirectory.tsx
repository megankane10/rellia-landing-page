import { useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion"
import { Calendar, Search, ShieldCheck, Mail, FileText } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

type PartnerCategory = "Legal" | "Manufacturing" | "Clinical Research" | "Design"

type IndustryPartner = {
  id: string
  name: string
  category: PartnerCategory
  vetted: boolean
  description: string
  email: string
  onePagerPdfs: string[]
  calendly: string
}

const SEED_PARTNERS: IndustryPartner[] = [
  {
    id: "1",
    name: "Nexus Medical Legal",
    category: "Legal",
    vetted: true,
    description: "Specializing in HIPAA compliance and IP strategy for early-stage digital health startups.",
    email: "partners@nexusmed.com",
    onePagerPdfs: [],
    calendly: "#",
  },
  {
    id: "2",
    name: "BioForge Manufacturing",
    category: "Manufacturing",
    vetted: true,
    description: "ISO 13485 certified manufacturing partner for Class II and III medical devices.",
    email: "build@bioforge.io",
    onePagerPdfs: [],
    calendly: "#",
  },
  {
    id: "3",
    name: "Pathfinder CRO",
    category: "Clinical Research",
    vetted: true,
    description: "Facilitating clinical validation studies and IRB submissions with a focus on usability testing.",
    email: "clinical@pathfinder.com",
    onePagerPdfs: [],
    calendly: "#",
  },
]

const FILTERS: Array<{ id: "all" | PartnerCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "Legal", label: "Legal" },
  { id: "Manufacturing", label: "Manufacturing" },
  { id: "Clinical Research", label: "Clinical Research" },
  { id: "Design", label: "Design" },
]

function PartnerCard({
  partner,
  onViewDetails,
}: {
  partner: IndustryPartner
  onViewDetails: () => void
}) {
  return (
    <motion.article
      layout
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white",
        "shadow-sm transition-[box-shadow,transform] duration-300 motion-reduce:transition-none",
        "hover:shadow-md hover:-translate-y-[1px]",
      )}
    >
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-host-grotesk text-xl font-semibold tracking-tight text-black">
              {partner.name}
            </h3>
            <p className="mt-1 font-host-grotesk text-xs font-semibold uppercase tracking-[0.16em] text-rellia-teal/70">
              {partner.category}
            </p>
          </div>

          <div className="shrink-0">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                "border-rellia-teal/15 bg-rellia-mint/25 text-rellia-teal",
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-rellia-teal" aria-hidden />
              Vetted by Rellia
            </span>
          </div>
        </div>

        <p className="mt-4 font-urbanist text-sm leading-relaxed text-black/70">
          {partner.description}
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm text-black/65">
          <Mail className="h-4 w-4 text-black/50" aria-hidden />
          <a
            className="font-urbanist underline decoration-black/20 underline-offset-4 hover:decoration-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
            href={`mailto:${partner.email}`}
          >
            {partner.email}
          </a>
        </div>
      </div>

      <div className="border-t border-black/10 bg-white p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <RelliaAction asChild variant="tealFilledLift" size="compact" className="w-full sm:w-auto px-5">
            <a
              href={partner.calendly}
              target="_blank"
              rel="noreferrer"
              aria-label={`Schedule intro call with ${partner.name}`}
            >
              Schedule Intro Call
              <Calendar aria-hidden />
            </a>
          </RelliaAction>

          <RelliaAction
            type="button"
            variant="outlineOnWhite"
            size="compact"
            className="w-full sm:w-auto px-5"
            onClick={onViewDetails}
            aria-label={`View details for ${partner.name}`}
          >
              View details
              <FileText aria-hidden />
          </RelliaAction>
        </div>
      </div>
    </motion.article>
  )
}

export default function IndustryPartnersDirectory() {
  const reduceMotion = useReducedMotion()
  const [activeFilter, setActiveFilter] = useState<"all" | PartnerCategory>("all")
  const [query, setQuery] = useState("")
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SEED_PARTNERS.filter((p) => {
      const matchesFilter = activeFilter === "all" ? true : p.category === activeFilter
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      return matchesFilter && matchesSearch
    })
  }, [activeFilter, query])

  const activePartner = useMemo(
    () => SEED_PARTNERS.find((p) => p.id === activePartnerId) ?? null,
    [activePartnerId],
  )

  const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

  const container: Variants = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? undefined
        : {
            duration: 0.35,
            ease: EASE_OUT,
            when: "beforeChildren",
            staggerChildren: 0.08,
          },
    },
  }

  const item: Variants = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 14 },
    show: reduceMotion
      ? {}
      : { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  }

  return (
    <div className="min-h-screen bg-slate-50 text-black overflow-x-hidden font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <section className="pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rellia-teal/70">
                Industry partners
              </p>
              <h1 className="mt-6 font-host-grotesk text-4xl font-extrabold tracking-tight text-black md:text-6xl leading-[1.05]">
                Industry Partner & Resource Directory
              </h1>
              <p className="mt-5 font-urbanist text-base leading-relaxed text-black/70 md:text-lg">
                A curated shortlist of vendors and specialists recommended by Rellia to help founders move faster with
                confidence.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 rounded-2xl border border-black/10 bg-white p-4 md:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <label className="relative">
                <span className="sr-only">Search partners</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45" aria-hidden />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or description…"
                  className={cn(
                    "h-12 w-full rounded-2xl border border-black/10 bg-white pl-10 pr-4",
                    "font-urbanist text-sm text-black placeholder:text-black/45",
                    "outline-none transition-[border-color,box-shadow] duration-200",
                    "focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:border-rellia-mint/60",
                  )}
                  type="search"
                />
              </label>

              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
                {FILTERS.map((f) => {
                  const isActive = activeFilter === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFilter(f.id)}
                      className={cn(
                        "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-[13px] font-semibold uppercase tracking-[0.16em]",
                        "font-host-grotesk transition-[background-color,color,transform] duration-200 motion-reduce:transition-none",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        isActive
                          ? "bg-rellia-teal text-white"
                          : "bg-white text-black/70 hover:text-rellia-teal hover:scale-[1.02] border border-black/10",
                      )}
                      aria-pressed={isActive}
                      aria-label={`Filter by ${f.label}`}
                    >
                      {f.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <motion.div key={p.id} variants={item} layout>
                    <PartnerCard partner={p} onViewDetails={() => setActivePartnerId(p.id)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 ? (
              <div className="mt-12 rounded-2xl border border-black/10 bg-white p-8 text-center">
                <p className="font-host-grotesk text-lg font-semibold text-black">No matches</p>
                <p className="mt-2 font-urbanist text-sm text-black/65">
                  Try a different search term or clear filters.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <RelliaAction
                    type="button"
                    variant="outlineOnWhite"
                    size="compact"
                    className="px-5"
                    onClick={() => {
                      setQuery("")
                      setActiveFilter("all")
                    }}
                    aria-label="Clear search and filters"
                  >
                    Clear
                  </RelliaAction>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <Dialog open={Boolean(activePartner)} onOpenChange={(open) => (!open ? setActivePartnerId(null) : null)}>
          <DialogContent
            aria-label="Industry partner details"
            className={cn(
              "w-[min(92vw,980px)] max-w-none",
              "max-h-[min(86vh,860px)] overflow-hidden",
              "rounded-2xl md:rounded-3xl border border-black/10 bg-white p-0 shadow-2xl",
            )}
          >
            {activePartner ? (
              <div className="max-h-[min(86vh,860px)] overflow-y-auto">
                <div className="border-b border-black/10 px-5 py-4 md:px-8 md:py-6">
                  <DialogHeader className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-rellia-teal/15 bg-rellia-mint/25 px-3 py-1 text-xs font-semibold text-rellia-teal">
                        Vetted by Rellia
                      </span>
                      <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rellia-teal/70">
                        {activePartner.category}
                      </span>
                    </div>
                    <DialogTitle className="font-host-grotesk text-2xl md:text-3xl font-bold tracking-tight text-black">
                      {activePartner.name}
                    </DialogTitle>
                    <DialogDescription className="font-urbanist text-sm md:text-base text-black/65">
                      {activePartner.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <a
                      className="inline-flex items-center gap-2 font-urbanist text-sm text-black/70 underline decoration-black/20 underline-offset-4 hover:decoration-black/60"
                      href={`mailto:${activePartner.email}`}
                    >
                      <Mail className="h-4 w-4 text-black/50" aria-hidden />
                      {activePartner.email}
                    </a>

                    <RelliaAction asChild variant="tealFilledLift" size="compact" className="px-5">
                      <a
                        href={activePartner.calendly}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Schedule intro call with ${activePartner.name}`}
                      >
                        Schedule Intro Call
                        <Calendar aria-hidden />
                      </a>
                    </RelliaAction>
                  </div>
                </div>

                <div className="px-5 py-5 md:px-8 md:py-7">
                  <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.16em] text-rellia-teal/70">
                    One-pager
                  </h3>

                  {activePartner.onePagerPdfs.length > 0 ? (
                    <div className="mt-4">
                      <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent>
                          {activePartner.onePagerPdfs.map((src, idx) => (
                            <CarouselItem key={`${src}-${idx}`}>
                              <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                                <div className="aspect-[16/10] w-full bg-white">
                                  <iframe
                                    title={`${activePartner.name} one-pager ${idx + 1}`}
                                    src={src}
                                    className="h-full w-full"
                                  />
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-3 md:-left-5" />
                        <CarouselNext className="-right-3 md:-right-5" />
                      </Carousel>
                      <p className="mt-3 font-urbanist text-sm text-black/55">
                        Tip: upload PDFs to `public/` and reference them like `/pdfs/vendor-onepager.pdf`.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-black/10 bg-rellia-cream/35 p-5 md:p-6">
                      <p className="font-urbanist text-sm text-black/65">
                        No PDF uploaded yet. Add a PDF file under `public/pdfs/` and set the partner’s `onePagerPdfs`
                        to that path (example: `/pdfs/nexus-medical-legal.pdf`).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  )
}

