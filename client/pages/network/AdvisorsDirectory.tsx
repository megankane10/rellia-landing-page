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
import { useAdvisors, useAdvisorFilters, useDirectoryFilterGroups } from "@/hooks/useCmsDocuments";
import {
  ADVISOR_DIRECTORY_SEED,
  ADVISOR_FILTER_OPTIONS,
  type AdvisorDirectoryEntry,
} from "@/data/advisorDirectory";
import { useNavigate, useLocation } from "react-router-dom";
import { NETWORK_PATH_ROLE_TAG } from "@/lib/networkPathRoles";
import { isSanityConfigured } from "@/lib/sanity";
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv";
import { isAnyCmsQueryLoading, isCmsListAwaitingData } from "@/lib/cmsQueryState";
import {
  DirectoryFilterSelectSkeleton,
  DirectoryGridSkeleton,
} from "@/components/cms/CmsPageLoadingShell";

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
      </div>
    </motion.article>
  );
}

export default function AdvisorsDirectory() {
  const reduceMotion = useReducedMotion();
  const advisorsQuery = useAdvisors();
  const { data: cmsAdvisors } = advisorsQuery;
  const advisorFiltersQuery = useAdvisorFilters();
  const { data: cmsFilters } = advisorFiltersQuery;
  const filterGroupsQuery = useDirectoryFilterGroups();
  const { data: cmsFilterGroups } = filterGroupsQuery;
  const directoryFiltersLoading =
    isSanityConfigured() &&
    (isAnyCmsQueryLoading(advisorsQuery, advisorFiltersQuery, filterGroupsQuery) ||
      isCmsListAwaitingData(advisorsQuery) ||
      isCmsListAwaitingData(filterGroupsQuery));
  const [query, setQuery] = useState("");
  const [legacyFilter, setLegacyFilter] = useState<string>("all")
  const [groupFilters, setGroupFilters] = useState<Record<string, string>>({})
  const location = useLocation();
  const [countryFilter, setCountryFilter] = useState<string>("all");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const country = params.get("country");
    if (country) setCountryFilter(country);
    const specialty = params.get("specialty");
    if (specialty) {
      setLegacyFilter(specialty);
      setGroupFilters((prev) => ({ ...prev, "directoryFilterGroup-expertise": specialty }));
    }
  }, [location.search]);
  const advisors = useMemo<AdvisorDirectoryEntry[]>(() => {
    if (!isSanityConfigured()) return []

    if (Array.isArray(cmsAdvisors) && cmsAdvisors.length > 0)
      return cmsAdvisors as AdvisorDirectoryEntry[];
    return allowCmsSeedFallbacks() ? ADVISOR_DIRECTORY_SEED : [];
  }, [cmsAdvisors]);

  const dynamicGroups = useMemo(() => {
    const groups = Array.isArray(cmsFilterGroups) ? cmsFilterGroups : []
    return groups
      .filter((g) => g && (g.appliesTo === "advisors" || g.appliesTo === "both"))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title))
  }, [cmsFilterGroups])

  const dynamicGroupOptions = useMemo(() => {
    const optionsByGroupId = new Map<string, string[]>()

    for (const group of dynamicGroups) {
      const base = new Set<string>()
      const suggested = Array.isArray(group.options) ? group.options : []
      for (const opt of suggested) {
        const label = (opt?.label ?? "").trim()
        if (label) base.add(label)
      }
      optionsByGroupId.set(group.id, Array.from(base))
    }

    // Pull any values that exist on advisors so new groups “just work”
    for (const a of advisors as any[]) {
      const assignments = Array.isArray(a?.directoryFilters) ? a.directoryFilters : []
      for (const assignment of assignments) {
        const groupId = (assignment?.groupId ?? "").trim()
        if (!groupId) continue
        if (!optionsByGroupId.has(groupId)) optionsByGroupId.set(groupId, [])
        const current = new Set(optionsByGroupId.get(groupId) ?? [])
        const values = Array.isArray(assignment?.values) ? assignment.values : []
        for (const v of values) {
          const label = typeof v === "string" ? v.trim() : ""
          if (label) current.add(label)
        }
        optionsByGroupId.set(groupId, Array.from(current))
      }
    }

    for (const [groupId, opts] of optionsByGroupId.entries()) {
      optionsByGroupId.set(groupId, opts.sort((a, b) => a.localeCompare(b)))
    }

    return optionsByGroupId
  }, [advisors, dynamicGroups])

  const countryFilters = useMemo<Array<{ id: string; label: string }>>(() => {
    const list = new Set<string>();
    advisors.forEach((a: any) => {
      if (Array.isArray(a.country)) {
        a.country.forEach((ct: string) => {
          if (ct?.trim()) list.add(ct.trim());
        });
      } else if (typeof a.country === "string" && a.country.trim()) {
        list.add(a.country.trim());
      }
    });
    return [
      { id: "all", label: "All Countries" },
      ...Array.from(list)
        .sort((a, b) => a.localeCompare(b))
        .map((ct) => ({ id: ct, label: ct })),
    ];
  }, [advisors]);

  const filterOptions = useMemo<Array<{ id: string; label: string }>>(() => {
    if (Array.isArray(cmsFilters) && cmsFilters.length > 0) {
      return [{ id: "all", label: "All Specialties" }, ...cmsFilters.map((f) => ({ id: f.label, label: f.label }))]
    }
    return [
      { id: "all", label: "All Specialties" },
      ...(ADVISOR_FILTER_OPTIONS as Array<{ id: string; label: string }>).filter((f) => f.id !== "all")
    ]
  }, [cmsFilters])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return advisors.filter((a) => {
      // Filter by Country
      if (countryFilter !== "all") {
        const countries = Array.isArray(a.country) ? a.country : (a.country ? [a.country] : []);
        const hasMatch = countries.some((ct: string) => ct.trim().toLowerCase() === countryFilter.toLowerCase());
        if (!hasMatch) return false;
      }

      if (dynamicGroups.length > 0) {
        for (const group of dynamicGroups) {
          const selected = (groupFilters[group.id] ?? "all").trim()
          if (!selected || selected === "all") continue
          const assignments = Array.isArray((a as any)?.directoryFilters) ? (a as any).directoryFilters : []
          const match = assignments.some((as: any) => {
            if ((as?.groupId ?? "").trim() !== group.id) return false
            const values = Array.isArray(as?.values) ? as.values : []
            return values.some((v: any) => typeof v === "string" && v.trim() === selected)
          })
          if (!match) return false
        }
      } else {
        if (legacyFilter !== "all" && a.filter !== legacyFilter) return false;
      }
      if (!q) return true;
      const blob =
        `${a.name} ${a.organization} ${a.role} ${a.industries.join(" ")} ${a.focus} ${a.bio}`.toLowerCase();
      return blob.includes(q);
    });
  }, [advisors, dynamicGroups, groupFilters, legacyFilter, query, countryFilter]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filtered, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, legacyFilter, groupFilters, countryFilter]);

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
      <Navbar forceSolid />

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

              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:flex-wrap md:items-center">
                {/* Country Filter Select */}
                <div className="relative w-full md:w-auto">
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="h-14 w-full appearance-none rounded-2xl border border-black/10 bg-black/[0.02] pl-5 pr-14 md:min-w-[200px] font-urbanist text-base font-semibold text-black/80 outline-none hover:border-black/20 focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white cursor-pointer"
                    aria-label="Filter by Country"
                  >
                    {countryFilters.map((f) => (
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

                {directoryFiltersLoading ? (
                  <>
                    <DirectoryFilterSelectSkeleton />
                    <DirectoryFilterSelectSkeleton />
                  </>
                ) : dynamicGroups.length > 0 ? (
                  <>
                    {dynamicGroups.map((g) => {
                      const options = dynamicGroupOptions.get(g.id) ?? []
                      const value = groupFilters[g.id] ?? "all"
                      let displayTitle = g.title;
                      if (displayTitle.toLowerCase() === "specialty") {
                        displayTitle = "Specialties";
                      } else if (displayTitle.toLowerCase() === "industry") {
                        displayTitle = "Industries";
                      } else if (displayTitle.toLowerCase() === "country") {
                        displayTitle = "Countries";
                      } else if (displayTitle.toLowerCase() === "business model") {
                        displayTitle = "Business Models";
                      } else if (!displayTitle.endsWith("s")) {
                        displayTitle = displayTitle + "s";
                      }
                      return (
                        <div key={g.id} className="flex w-full md:w-auto">
                          <div className="relative w-full md:w-auto">
                            <select
                              value={value}
                              onChange={(e) =>
                                setGroupFilters((prev) => ({
                                  ...prev,
                                  [g.id]: e.target.value,
                                }))
                              }
                              className="h-14 w-full appearance-none rounded-2xl border border-black/10 bg-black/[0.02] pl-5 pr-14 md:min-w-[200px] font-urbanist text-base font-semibold text-black/80 outline-none hover:border-black/20 focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white cursor-pointer"
                              aria-label={`Filter by ${g.title}`}
                            >
                              <option value="all">All {displayTitle}</option>
                              {options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/45"
                              aria-hidden
                            />
                          </div>
                        </div>
                      )
                    })}
                  </>
                ) : (
                  <div className="flex w-full shrink-0 md:w-auto">
                    <div className="relative w-full md:w-auto">
                      <select
                        value={legacyFilter}
                        onChange={(e) => setLegacyFilter(e.target.value)}
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
                )}
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
              <p className="font-urbanist text-sm font-semibold text-black/60">
                Showing {paginated.length} of {filtered.length} results
              </p>
            </div>

            {directoryFiltersLoading ? (
              <DirectoryGridSkeleton />
            ) : advisors.length === 0 ? (
              <FilteredListEmptyState
                className="mt-10"
                icon={UserSearch}
                title="No advisors found"
                description="There are no advisor listings in the directory yet. Check back as we add more mentors to the network."
              />
            ) : filtered.length === 0 ? (
              <FilteredListEmptyState
                className="mt-10"
                icon={Search}
                title="No results match your filters"
                description="Try clearing search or filters to see more advisors."
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
