import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelliaCta from "@/components/RelliaCta";
import { cn } from "@/lib/utils";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Building2, Search, ChevronDown } from "lucide-react";
import FilteredListEmptyState from "@/components/FilteredListEmptyState";
import { useNavigate } from "react-router-dom";
import { NETWORK_PATH_ROLE_TAG } from "@/lib/networkPathRoles";
import { useAlumniCompanies, useFounderLevels, useFounderSpecialties } from "@/hooks/useCmsDocuments";
import {
  FOUNDER_DIRECTORY,
  ALL_SPECIALTIES,
  ALL_LEVELS,
  type FounderCompany,
  type Specialty,
  type FounderLevel,
} from "@/data/founderDirectory";

/** Gray-teal tone for directory heroes */
const DIRECTORY_TITLE_CLASS =
  "font-host-grotesk text-4xl font-extrabold tracking-tight text-black md:text-5xl";

function FounderDirectoryCard({
  company,
  onOpen,
}: {
  company: FounderCompany;
  onOpen: () => void;
}) {
  return (
    <motion.article
      layout
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white",
        "shadow-sm transition-[box-shadow,transform] duration-300 motion-reduce:transition-none",
        "cursor-pointer hover:shadow-md hover:-translate-y-[1px]",
      )}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${company.logoName}`}
    >
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex min-h-[132px] w-full items-center justify-center py-1">
          <img
            src={company.logoSrc}
            alt=""
            className="max-h-[120px] w-auto max-w-full object-contain object-center"
          />
        </div>
        <h3 className="mt-5 font-host-grotesk text-base font-bold tracking-tight text-black md:text-lg group-hover:underline decoration-2 underline-offset-4">
          {company.logoName}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full border border-rellia-teal/20 bg-rellia-mint/20 px-2.5 py-0.5 font-urbanist text-[11px] font-bold text-rellia-teal">
            {company.level}
          </span>
          {company.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-0.5 font-urbanist text-[11px] font-bold text-black/60"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-4 line-clamp-3 font-urbanist text-[13px] leading-relaxed text-black/70 sm:text-sm">
          {company.shortDescription}
        </p>
      </div>
    </motion.article>
  );
}

export default function FoundersDirectory() {
  const reduceMotion = useReducedMotion();
  const { data: cmsCompanies } = useAlumniCompanies();
  const { data: cmsLevels } = useFounderLevels();
  const { data: cmsSpecialties } = useFounderSpecialties();
  const [query, setQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const companies = useMemo<FounderCompany[]>(() => {
    if (Array.isArray(cmsCompanies) && cmsCompanies.length > 0) {
      return cmsCompanies
        .filter((c: any) => c && typeof c.id === "string" && typeof c.name === "string")
        .map((c: any): FounderCompany => {
          return {
            id: c.id,
            slug: c.id,
            logoName: c.name,
            logoSrc: c.logoSrc,
            tagline: c.tagline ?? "",
            specialties: Array.isArray(c.specialties) ? c.specialties : [],
            level: c.level,
            shortDescription: c.shortDescription ?? "",
            longDescription: c.longDescription ?? "",
            websiteUrl: c.websiteUrl ?? "",
            traction: c.traction ?? "",
            relliaCollaboration: c.relliaCollaboration ?? "",
            imageSrc: "",
            country: c.country ?? "",
            yearJoined: typeof c.yearJoined === "number" ? c.yearJoined : 0,
            founders: Array.isArray(c.founders) ? c.founders : [],
            programs: Array.isArray(c.programs) ? c.programs : [],
            linkedinUrl: c.linkedinUrl,
          }
        })
    }
    return FOUNDER_DIRECTORY;
  }, [cmsCompanies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => {
      const matchLevel = levelFilter === "all" || c.level === levelFilter;
      const matchSpecialty =
        specialtyFilter === "all" ||
        c.specialties.includes(specialtyFilter as Specialty);
      if (!matchLevel || !matchSpecialty) return false;
      if (!q) return true;
      const blob =
        `${c.logoName} ${c.shortDescription} ${c.specialties.join(" ")} ${c.level} ${c.traction}`.toLowerCase();
      return blob.includes(q);
    });
  }, [companies, query, specialtyFilter, levelFilter]);

  const levelFilters = useMemo<Array<{ id: string; label: string }>>(() => {
    if (Array.isArray(cmsLevels) && cmsLevels.length > 0) {
      return [
        { id: "all", label: "All Levels" },
        ...cmsLevels.map((l) => ({ id: l.label, label: l.label })),
      ];
    }
    return [
      { id: "all", label: "All Levels" },
      ...ALL_LEVELS.map((l) => ({ id: l, label: l })),
    ];
  }, [cmsLevels]);

  const specialtyFilters = useMemo<Array<{ id: string; label: string }>>(() => {
    if (Array.isArray(cmsSpecialties) && cmsSpecialties.length > 0) {
      return [
        { id: "all", label: "All specialties" },
        ...cmsSpecialties.map((s) => ({ id: s.label, label: s.label })),
      ];
    }
    return [
      { id: "all", label: "All specialties" },
      ...ALL_SPECIALTIES.map((s) => ({ id: s, label: s })),
    ];
  }, [cmsSpecialties]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filtered, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, specialtyFilter, levelFilter]);

  const active = useMemo(
    () => companies.find((c) => c.id === activeId) ?? null,
    [activeId, companies],
  );

  const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
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
            staggerChildren: 0.06,
          },
    },
  };
  const item: Variants = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 14 },
    show: reduceMotion
      ? {}
      : { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  };

  const navigate = useNavigate();
  const tag = NETWORK_PATH_ROLE_TAG["founder"];
  const TagIcon = tag.icon;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-black/10 bg-rellia-greyTeal pt-28 pb-12 md:pt-36 md:pb-16">
          <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
          {/* Mobile-only mint blur blobs */}
          <div className="md:hidden absolute -left-12 -top-12 h-32 w-32 rounded-full bg-rellia-mint/20 blur-2xl pointer-events-none" />
          <div className="md:hidden absolute -right-8 top-1/4 h-24 w-24 rounded-full bg-rellia-mint/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1300px] px-6 md:px-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-rellia-teal px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/95 ring-1 ring-white/15 mb-4">
              <TagIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Founders
            </div>
            <h1 className={DIRECTORY_TITLE_CLASS}>Explore Alumni</h1>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              Representative companies from the Rellia portfolio
              network—specialty tags and summaries help you see who is building
              alongside you.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            {/* Top Filter Bar */}
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center">
              <label className="relative flex-1 block">
                <span className="sr-only">Search companies</span>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/45"
                  aria-hidden
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search alumni by name, keyword…"
                  className={cn(
                    "h-14 w-full rounded-2xl border border-black/10 bg-black/[0.02] pl-12 pr-4 transition-colors",
                    "font-urbanist text-base text-black placeholder:text-black/45 hover:border-black/20",
                    "outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white",
                  )}
                />
              </label>

              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-4">
                {/* Level Filter */}
                <div className="relative w-full md:w-auto">
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="h-14 w-full appearance-none rounded-2xl border border-black/10 bg-black/[0.02] pl-5 pr-14 md:min-w-[160px] font-urbanist text-base font-semibold text-black/80 outline-none hover:border-black/20 focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white cursor-pointer"
                  >
                    {levelFilters.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/45"
                    aria-hidden
                  />
                </div>

                <div className="relative w-full md:w-auto">
                  <select
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="h-14 w-full appearance-none rounded-2xl border border-black/10 bg-black/[0.02] pl-5 pr-14 md:min-w-[160px] font-urbanist text-base font-semibold text-black/80 outline-none hover:border-black/20 focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white cursor-pointer"
                  >
                    {specialtyFilters.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/45"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
              <p className="font-urbanist text-sm font-semibold text-black/60">
                Showing {paginated.length} of {filtered.length} results
              </p>
            </div>

            {filtered.length === 0 ? (
              <FilteredListEmptyState
                className="mt-10"
                icon={Building2}
                title="No companies match this search"
                description="Adjust your keywords, specialty, or category filters to explore the alumni directory."
              />
            ) : (
              <div className="flex flex-col">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence mode="popLayout">
                    {paginated.map((c) => (
                      <motion.div key={c.id} variants={item} layout>
                        <FounderDirectoryCard
                          company={c}
                          onOpen={() => navigate(`/founders/alumni/${c.id}`)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {totalPages > 1 && (
                  <div className="mt-14 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 font-urbanist text-sm font-semibold text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
                    >
                      &larr;
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPage(i + 1)}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full font-urbanist text-sm font-semibold transition-colors",
                          page === i + 1
                            ? "bg-black text-white"
                            : "text-black/70 hover:bg-black/5",
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 font-urbanist text-sm font-semibold text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
                    >
                      &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <RelliaCta
          title="Ready to build your network?"
          body="Apply for membership to access exclusive events, diagnostic tools, and directly connect with operators in our directory."
          primary={{ label: "Apply for Membership", to: "/apply" }}
        />
      </main>

      <Footer />
    </div>
  );
}
