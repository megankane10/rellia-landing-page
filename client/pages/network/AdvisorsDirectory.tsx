import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelliaCta, { optionalCtaAction } from "@/components/RelliaCta";
import { cn } from "@/lib/utils";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Search, UserSearch, ChevronDown, ArrowLeft } from "lucide-react";
import FilteredListEmptyState from "@/components/FilteredListEmptyState";
import { useAdvisors, useDirectoryFilterGroups, useNetworkAdvisorsDirectoryPage } from "@/hooks/useCmsDocuments";
import { mergeNetworkAdvisorsDirectoryPage } from "@shared/cms/directoryPageDefaults"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { deriveDirectoryPageSeo } from "@/lib/cmsPageSeoDefaults"
import {
  ADVISOR_DIRECTORY_SEED,
  ADVISOR_FILTER_OPTIONS,
  type AdvisorDirectoryEntry,
} from "@/data/advisorDirectory";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { NETWORK_PATH_ROLE_TAG } from "@/lib/networkPathRoles";
import { isSanityConfigured } from "@/lib/sanity";
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv";
import { isCmsQueryLoading } from "@/lib/cmsQueryState";
import { DirectoryGridSkeleton } from "@/components/cms/CmsPageLoadingShell";
import AdvisorDirectoryCard from "@/components/network/AdvisorDirectoryCard";
import {
  filterAdvisorDirectoryGroups,
  findExpertiseGroup,
  getDirectoryGroupOptionLabels,
  matchesDirectoryFilterSelection,
} from "@/lib/directoryFilterOptions";
import { cmsDisplayText } from "@/lib/cmsStega"

const DIRECTORY_TITLE_CLASS =
  "font-host-grotesk text-4xl font-extrabold tracking-tight text-black md:text-5xl";

const formatAdvisorLocation = (advisor: AdvisorDirectoryEntry): string => {
  const city = advisor.location?.trim()
  const country = advisor.countries.filter(Boolean).join(", ")
  if (city && country) return `${city}, ${country}`
  return city || country
}

export default function AdvisorsDirectory() {
  const { data: advisorsDirectoryRaw } = useNetworkAdvisorsDirectoryPage()
  const advisorsDirectory = mergeNetworkAdvisorsDirectoryPage(advisorsDirectoryRaw ?? undefined)
  useApplyCmsSeo(
    advisorsDirectory.seo,
    deriveDirectoryPageSeo(advisorsDirectory, "/advisors/directory"),
  )
  const reduceMotion = useReducedMotion();
  const advisorsQuery = useAdvisors();
  const { data: cmsAdvisors } = advisorsQuery;
  const filterGroupsQuery = useDirectoryFilterGroups();
  const { data: cmsFilterGroups } = filterGroupsQuery;
  const advisorsListLoading = isSanityConfigured() && isCmsQueryLoading(advisorsQuery)
  const [query, setQuery] = useState("");
  const [groupFilters, setGroupFilters] = useState<Record<string, string>>({})
  const location = useLocation();

  const advisors = useMemo<AdvisorDirectoryEntry[]>(() => {
    if (!isSanityConfigured()) return []

    if (Array.isArray(cmsAdvisors) && cmsAdvisors.length > 0)
      return cmsAdvisors as AdvisorDirectoryEntry[];
    return allowCmsSeedFallbacks() ? ADVISOR_DIRECTORY_SEED : [];
  }, [cmsAdvisors]);

  const dynamicGroups = useMemo(() => {
    const groups = Array.isArray(cmsFilterGroups) ? cmsFilterGroups : []
    return filterAdvisorDirectoryGroups(
      groups.filter((g) => g && (g.appliesTo === "advisors" || g.appliesTo === "both")),
    ).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title))
  }, [cmsFilterGroups])

  const expertiseGroup = useMemo(
    () => findExpertiseGroup(dynamicGroups),
    [dynamicGroups],
  )

  const canonicalExpertiseLabels = useMemo(
    () =>
      ADVISOR_FILTER_OPTIONS.filter((f) => f.id !== "all").map((f) => f.label),
    [],
  )

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const country = params.get("country");
    const countryGroup = dynamicGroups.find(
      (g) =>
        g.title.toLowerCase() === "country" ||
        g.id.toLowerCase() === "country",
    );
    if (country && countryGroup?.id) {
      setGroupFilters((prev) => ({ ...prev, [countryGroup.id]: country }));
    }
    const specialty = params.get("specialty") ?? params.get("expertise")
    if (specialty && expertiseGroup?.id) {
      setGroupFilters((prev) => ({ ...prev, [expertiseGroup.id]: specialty }))
    }
  }, [location.search, expertiseGroup?.id, dynamicGroups])

  const dynamicGroupOptions = useMemo(() => {
    const map = getDirectoryGroupOptionLabels(dynamicGroups, advisors as never[])
    const expertise = findExpertiseGroup(dynamicGroups)
    if (!expertise) return map

    const current = map.get(expertise.id) ?? []
    map.set(expertise.id, Array.from(new Set([...canonicalExpertiseLabels, ...current])).sort((a, b) => a.localeCompare(b)))
    return map
  }, [advisors, canonicalExpertiseLabels, dynamicGroups])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return advisors.filter((a) => {
      for (const group of dynamicGroups) {
        const selected = (groupFilters[group.id] ?? "all").trim()
        if (!selected || selected === "all") continue
        if (
          !matchesDirectoryFilterSelection(group, selected, {
            countries: a.countries,
            expertiseTags: a.expertiseTags,
            directoryFilters: a.directoryFilters,
          })
        ) {
          return false
        }
      }
      if (!q) return true
      const blob =
        `${a.name} ${a.organization} ${a.role} ${a.focus ?? ""} ${a.expertiseTags.join(" ")} ${a.bio ?? ""}`.toLowerCase()
      return blob.includes(q)
    })
  }, [advisors, dynamicGroups, groupFilters, query])

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filtered, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, groupFilters])

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
            <h1 className={DIRECTORY_TITLE_CLASS}>{advisorsDirectory.directoryTitle ?? "Explore Advisors"}</h1>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              {advisorsDirectory.directorySubtitle}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
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
                {dynamicGroups.map((g) => {
                  const options = dynamicGroupOptions.get(g.id) ?? []
                  const value = groupFilters[g.id] ?? "all"
                  const normalizedTitle = g.title.toLowerCase()
                  let displayTitle = g.title
                  if (normalizedTitle === "country" || normalizedTitle === "countries") {
                    displayTitle = "Countries"
                  } else if (
                    normalizedTitle === "expertise" ||
                    normalizedTitle === "specialty" ||
                    normalizedTitle === "specialties"
                  ) {
                    displayTitle = "Expertise"
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
              </div>
            </div>

            {!advisorsListLoading ? (
            <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
              <p className="font-urbanist text-sm font-semibold text-black/60">
                Showing {paginated.length} of {filtered.length} results
              </p>
            </div>
            ) : null}

            {advisorsListLoading ? (
              <DirectoryGridSkeleton className="mt-10" count={6} />
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
                      <motion.div key={a.id} variants={item} layout className="h-full">
                        <AdvisorDirectoryCard
                          advisor={a}
                          onOpen={() => navigate(`/advisors/directory/${a.id}`)}
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

            {!advisorsListLoading ? (
              <div className="mt-12 border-t border-black/10 pt-8">
                <Link
                  to="/advisors"
                  className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"
                  aria-label="Back to Advisors"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to Advisors
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        <RelliaCta
          title={advisorsDirectory.directoryCtaTitle ?? "Looking for specialized advice?"}
          body={advisorsDirectory.directoryCtaBody}
          primary={{
            label: advisorsDirectory.directoryCtaPrimaryLabel ?? "Apply for Membership",
            to: advisorsDirectory.directoryCtaPrimaryHref ?? "/apply",
          }}
          secondary={optionalCtaAction(
            advisorsDirectory.directoryCtaSecondaryLabel,
            advisorsDirectory.directoryCtaSecondaryHref,
          )}
        />
      </main>

      <Footer />
    </div>
  );
}
