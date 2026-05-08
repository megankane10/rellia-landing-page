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
import { Search, UserSearch, ChevronDown } from "lucide-react";
import FilteredListEmptyState from "@/components/FilteredListEmptyState";
import { useAdvisors, useAdvisorFilters } from "@/hooks/useCmsDocuments";
import {
  ADVISOR_DIRECTORY_SEED,
  ADVISOR_FILTER_OPTIONS,
  type AdvisorDirectoryEntry,
} from "@/data/advisorDirectory";
import { useNavigate } from "react-router-dom";
import { NETWORK_PATH_ROLE_TAG } from "@/lib/networkPathRoles";

const DIRECTORY_TITLE_CLASS =
  "font-host-grotesk text-4xl font-extrabold tracking-tight text-black md:text-5xl";

function AdvisorCard({
  advisor,
  onDetails,
}: {
  advisor: AdvisorDirectoryEntry;
  onDetails: () => void;
}) {
  return (
    <motion.article
      layout
      className={cn(
        "group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/10 bg-white",
        "shadow-sm transition-[box-shadow,transform] duration-300 motion-reduce:transition-none",
        "hover:shadow-md hover:-translate-y-[1px]",
      )}
      onClick={onDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDetails();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open profile for ${advisor.name}`}
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-gradient-to-br from-rellia-cream to-rellia-cream/40">
        <img
          src={advisor.photoSrc}
          alt=""
          className="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          loading="lazy"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-80"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-host-grotesk text-lg font-bold tracking-tight text-black group-hover:underline decoration-2 underline-offset-4">
          {advisor.name}
        </h3>
        <p className="mt-1 font-urbanist text-sm font-medium text-black/70">
          {advisor.organization}
        </p>
        <p className="mt-0.5 font-urbanist text-sm text-black/60">
          {advisor.role}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-rellia-teal/20 bg-rellia-mint/15 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal">
            {advisor.filter}
          </span>
          {advisor.industries.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 font-urbanist text-xs font-medium text-black/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 line-clamp-3 flex-1 font-urbanist text-sm leading-relaxed text-black/75">
          {advisor.focus}
        </p>
      </div>
    </motion.article>
  );
}

export default function AdvisorsDirectory() {
  const reduceMotion = useReducedMotion();
  const { data: cmsAdvisors } = useAdvisors();
  const { data: cmsFilters } = useAdvisorFilters();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const advisors = useMemo<AdvisorDirectoryEntry[]>(() => {
    if (Array.isArray(cmsAdvisors) && cmsAdvisors.length > 0)
      return cmsAdvisors as AdvisorDirectoryEntry[];
    return ADVISOR_DIRECTORY_SEED;
  }, [cmsAdvisors]);

  const filterOptions = useMemo<Array<{ id: string; label: string }>>(() => {
    if (Array.isArray(cmsFilters) && cmsFilters.length > 0) {
      return [{ id: "all", label: "All" }, ...cmsFilters.map((f) => ({ id: f.label, label: f.label }))]
    }
    return ADVISOR_FILTER_OPTIONS as Array<{ id: string; label: string }>
  }, [cmsFilters])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return advisors.filter((a) => {
      if (filter !== "all" && a.filter !== filter) return false;
      if (!q) return true;
      const blob =
        `${a.name} ${a.organization} ${a.role} ${a.industries.join(" ")} ${a.focus} ${a.bio}`.toLowerCase();
      return blob.includes(q);
    });
  }, [advisors, filter, query]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filtered, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, filter]);

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
  const tag = NETWORK_PATH_ROLE_TAG["advisor"];
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
              {tag.label}
            </div>
            <h1 className={DIRECTORY_TITLE_CLASS}>Explore Advisors</h1>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              Search and filter operators, clinicians, and specialists who opt
              into high-signal mentorship with serious founders.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            {/* Top Filter Bar */}
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center">
              <label className="relative flex-1 block">
                <span className="sr-only">Search advisors</span>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/45"
                  aria-hidden
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search advisors by name, keyword…"
                  className={cn(
                    "h-14 w-full rounded-2xl border border-black/10 bg-black/[0.02] pl-12 pr-4 transition-colors",
                    "font-urbanist text-base text-black placeholder:text-black/45 hover:border-black/20",
                    "outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white",
                  )}
                />
              </label>

              <div className="flex w-full shrink-0 md:w-auto">
                <div className="relative w-full md:w-auto">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-14 w-full appearance-none rounded-2xl border border-black/10 bg-black/[0.02] pl-5 pr-14 md:min-w-[200px] font-urbanist text-base font-semibold text-black/80 outline-none hover:border-black/20 focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white cursor-pointer"
                  >
                    {filterOptions.map((f) => (
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
                icon={UserSearch}
                title="No advisors match this search"
                description="Try another keyword or filter to find operators and specialists in the directory."
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
                    {paginated.map((a) => (
                      <motion.div key={a.id} variants={item} layout>
                        <AdvisorCard
                          advisor={a}
                          onDetails={() =>
                            navigate(`/advisors/directory/${a.id}`)
                          }
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
          title="Looking for specialized advice?"
          body="Access our full network of operators, clinicians, and subject matter experts."
          primary={{ label: "Apply for Membership", to: "/apply" }}
          secondary={{ label: "Learn about Advisors", to: "/advisors" }}
        />
      </main>

      <Footer />
    </div>
  );
}
