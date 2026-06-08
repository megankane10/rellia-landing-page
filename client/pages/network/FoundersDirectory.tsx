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
import { Building2, Search, ChevronDown, ArrowLeft } from "lucide-react";
import FilteredListEmptyState from "@/components/FilteredListEmptyState";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { NETWORK_PATH_ROLE_TAG } from "@/lib/networkPathRoles";
import {
  useAlumniCompanies,
  useFounderSpecialties,
  useDirectoryFilterGroups,
} from "@/hooks/useCmsDocuments";
import {
  FOUNDER_DIRECTORY,
  ALL_SPECIALTIES,
  type FounderCompany,
  type Specialty,
} from "@/data/founderDirectory";
import { isSanityConfigured } from "@/lib/sanity";
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv";
import { isCmsQueryLoading } from "@/lib/cmsQueryState";
import {
  DirectoryGridSkeleton,
} from "@/components/cms/CmsPageLoadingShell";
import { DirectoryCardTags } from "@/components/network/DirectoryCardTags";
import {
  directoryGroupHasCountry,
  filterFounderDirectoryGroups,
  getCountryFilterOptions,
  getDirectoryGroupOptionLabels,
} from "@/lib/directoryFilterOptions";
import { resolveSocialOgImageUrl } from "@/config/seo";
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo";

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
  const specialtyTags = company.specialties ?? []
  const businessModelTags = Array.isArray(company.businessModel) ? company.businessModel : []
  const cardTags = [...specialtyTags, ...businessModelTags]

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
      <div className="relative flex aspect-video w-full items-center justify-center bg-white border-b border-black/[0.05] shrink-0">
        <img
          src={company.logoSrc}
          alt=""
          className="max-h-[72%] w-auto max-w-[72%] object-contain object-center transition duration-500 ease-out group-hover:scale-[1.02]"
        />
        <DirectoryCardTags tags={cardTags} variant="onLight" />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-host-grotesk text-lg font-bold tracking-tight text-black group-hover:underline decoration-2 underline-offset-4">
          {company.logoName}
        </h3>
        {(company.shortDescription?.trim() || company.tagline?.trim()) && (
          <p className="mt-1 font-urbanist text-sm font-medium text-black/77 leading-relaxed line-clamp-3">
            {company.shortDescription?.trim() || company.tagline}
          </p>
        )}
        {Array.isArray(company.country) && company.country.length > 0 && (
          <p className="mt-2 font-urbanist text-sm text-black/55 leading-relaxed">
            {company.country.join(", ")}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export default function FoundersDirectory() {
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const companiesQuery = useAlumniCompanies();
  const { data: cmsCompanies } = companiesQuery;
  const specialtiesQuery = useFounderSpecialties();
  const { data: cmsSpecialties } = specialtiesQuery;
  const filterGroupsQuery = useDirectoryFilterGroups();
  const { data: cmsFilterGroups } = filterGroupsQuery;
  const companiesListLoading = isSanityConfigured() && isCmsQueryLoading(companiesQuery)
  const [query, setQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [businessModelFilter, setBusinessModelFilter] = useState<string>("all");
  const [groupFilters, setGroupFilters] = useState<Record<string, string>>({});
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const country = params.get("country");
    const specialty = params.get("specialty");
    const businessModel = params.get("businessModel");

    if (country) {
      setCountryFilter(country);
      setGroupFilters((prev) => ({ ...prev, country: country }));
    }
    if (specialty) {
      setSpecialtyFilter(specialty);
      setGroupFilters((prev) => ({ ...prev, specialty: specialty }));
    }
    if (businessModel) {
      setBusinessModelFilter(businessModel);
      setGroupFilters((prev) => ({ ...prev, "business-model": businessModel }));
    }
  }, [location.search]);

  const companies = useMemo<FounderCompany[]>(() => {
    if (!isSanityConfigured()) return []

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
            businessModel: Array.isArray(c.businessModel) ? c.businessModel : [],
            directoryFilters: Array.isArray(c.directoryFilters) ? c.directoryFilters : [],
            shortDescription: c.shortDescription ?? "",
            longDescription: c.longDescription ?? "",
            websiteUrl: c.websiteUrl ?? "",
            traction: c.traction ?? "",
            relliaCollaboration: c.relliaCollaboration ?? "",
            imageSrc: "",
            country: Array.isArray(c.country) ? c.country : (c.country ? [c.country] : []),
            yearJoined: typeof c.yearJoined === "number" ? c.yearJoined : 0,
            founders: Array.isArray(c.founders) ? c.founders : [],
            programs: [],
            profileBody: c.profileBody,
            linkedinUrl: c.linkedinUrl,
          }
        })
    }
    return allowCmsSeedFallbacks() ? FOUNDER_DIRECTORY : [];
  }, [cmsCompanies]);

  const alumniDirectoryOgImage = useMemo(() => {
    const logoSrc = companies[0]?.logoSrc?.trim()
    return logoSrc ? resolveSocialOgImageUrl(logoSrc) : undefined
  }, [companies])

  useApplyCmsSeo(null, {
    ogImage: alumniDirectoryOgImage,
  })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => {
      const dynamicGroups = Array.isArray(cmsFilterGroups)
        ? cmsFilterGroups.filter((g) => g && (g.appliesTo === "founders" || g.appliesTo === "both"))
        : []

      if (dynamicGroups.length > 0) {
        for (const group of dynamicGroups) {
          const selected = (groupFilters[group.id] ?? "all").trim()
          if (!selected || selected === "all") continue

          if (group.id === "country" || group.id.toLowerCase().includes("country")) {
            const hasMatch = c.country.some((ct: string) => ct.trim().toLowerCase() === selected.toLowerCase());
            if (!hasMatch) return false;
            continue;
          }

          const assignments = Array.isArray((c as any)?.directoryFilters) ? (c as any).directoryFilters : []
          const match = assignments.some((as: any) => {
            if ((as?.groupId ?? "").trim() !== group.id) return false
            const values = Array.isArray(as?.values) ? as.values : []
            return values.some((v: any) => typeof v === "string" && v.trim() === selected)
          })
          if (!match) return false
        }
      } else {
        const matchCountry =
          countryFilter === "all" ||
          c.country.includes(countryFilter);
        const matchSpecialty =
          specialtyFilter === "all" ||
          c.specialties.includes(specialtyFilter as Specialty);
        const matchBusinessModel =
          businessModelFilter === "all" ||
          (c.businessModel && c.businessModel.includes(businessModelFilter));
        if (!matchCountry || !matchSpecialty || !matchBusinessModel) return false;
      }

      if (!q) return true;
      const specialtiesStr = c.specialties.join(" ");
      const countriesStr = c.country.join(" ");
      const businessModelsStr = c.businessModel ? c.businessModel.join(" ") : "";
      const blob =
        `${c.logoName} ${c.shortDescription} ${specialtiesStr} ${countriesStr} ${businessModelsStr} ${c.traction}`.toLowerCase();
      return blob.includes(q);
    });
  }, [companies, cmsFilterGroups, groupFilters, query, specialtyFilter, countryFilter, businessModelFilter]);

  const dynamicGroups = useMemo(() => {
    const groups = Array.isArray(cmsFilterGroups) ? cmsFilterGroups : []
    return filterFounderDirectoryGroups(
      groups.filter((g) => g && (g.appliesTo === "founders" || g.appliesTo === "both")),
    ).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title))
  }, [cmsFilterGroups])

  const dynamicGroupOptions = useMemo(
    () => getDirectoryGroupOptionLabels(dynamicGroups, companies as never[]),
    [companies, dynamicGroups],
  )

  const showStandaloneCountryFilter =
    dynamicGroups.length === 0 || !directoryGroupHasCountry(dynamicGroups)

  const countryFilters = useMemo<Array<{ id: string; label: string }>>(
    () => getCountryFilterOptions(dynamicGroups, companies as never[]),
    [companies, dynamicGroups],
  )

  const businessModelFilters = useMemo<Array<{ id: string; label: string }>>(() => {
    const models = new Set<string>();
    for (const c of companies) {
      const bm = c.businessModel;
      if (Array.isArray(bm)) {
        bm.forEach((m) => {
          if (m) models.add(m);
        });
      }
    }
    return [
      { id: "all", label: "All Business Models" },
      ...Array.from(models).sort().map((m) => ({ id: m, label: m })),
    ];
  }, [companies]);

  const specialtyFilters = useMemo<Array<{ id: string; label: string }>>(() => {
    if (Array.isArray(cmsSpecialties) && cmsSpecialties.length > 0) {
      return [
        { id: "all", label: "All Specialties" },
        ...cmsSpecialties.map((s) => ({ id: s.label, label: s.label })),
      ];
    }
    return [
      { id: "all", label: "All Specialties" },
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
  }, [query, specialtyFilter, countryFilter, businessModelFilter, groupFilters]);

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

              {dynamicGroups.length > 0 ? (
                <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-4">
                  {dynamicGroups.map((g) => {
                    const options = dynamicGroupOptions.get(g.id) ?? []
                    const value = groupFilters[g.id] ?? "all"
                    return (
                      <div key={g.id} className="relative w-full md:w-auto">
                        <select
                          value={value}
                          onChange={(e) =>
                            setGroupFilters((prev) => ({
                              ...prev,
                              [g.id]: e.target.value,
                            }))
                          }
                          className="h-14 w-full appearance-none rounded-2xl border border-black/10 bg-black/[0.02] pl-5 pr-14 md:min-w-[160px] font-urbanist text-base font-semibold text-black/80 outline-none hover:border-black/20 focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white cursor-pointer"
                          aria-label={`Filter by ${g.title}`}
                        >
                          <option value="all">
                            All{" "}
                            {g.title.toLowerCase() === "country"
                              ? "Countries"
                              : g.title.toLowerCase() === "specialty"
                              ? "Specialties"
                              : g.title.toLowerCase() === "business model"
                              ? "Business Models"
                              : g.title.endsWith("s")
                              ? g.title
                              : g.title + "s"}
                          </option>
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
                    )
                  })}
                </div>
              ) : (
                <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-4">
                  {showStandaloneCountryFilter ? (
                    <div className="relative w-full md:w-auto">
                      <select
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        className="h-14 w-full appearance-none rounded-2xl border border-black/10 bg-black/[0.02] pl-5 pr-14 md:min-w-[160px] font-urbanist text-base font-semibold text-black/80 outline-none hover:border-black/20 focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white cursor-pointer"
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
                  ) : null}

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

                  {/* Business Model Filter */}
                  <div className="relative w-full md:w-auto">
                    <select
                      value={businessModelFilter}
                      onChange={(e) => setBusinessModelFilter(e.target.value)}
                      className="h-14 w-full appearance-none rounded-2xl border border-black/10 bg-black/[0.02] pl-5 pr-14 md:min-w-[160px] font-urbanist text-base font-semibold text-black/80 outline-none hover:border-black/20 focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white cursor-pointer"
                    >
                      {businessModelFilters.map((bm) => (
                        <option key={bm.id} value={bm.id}>
                          {bm.label}
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

            <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
              <p className="font-urbanist text-sm font-semibold text-black/60">
                Showing {paginated.length} of {filtered.length} results
              </p>
            </div>

            {companiesListLoading ? (
              <DirectoryGridSkeleton count={4} />
            ) : companies.length === 0 ? (
              <FilteredListEmptyState
                className="mt-10"
                icon={Building2}
                title="No alumni found"
                description="There are no alumni listings in the directory yet. Check back as we add more founder companies to the network."
              />
            ) : filtered.length === 0 ? (
              <FilteredListEmptyState
                className="mt-10"
                icon={Search}
                title="No results match your filters"
                description="Try clearing search or filters to see more alumni companies."
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

            {!companiesListLoading ? (
              <div className="mt-12 border-t border-black/10 pt-8">
                <Link
                  to="/founders"
                  className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"
                  aria-label="Back to Founders"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to Founders
                </Link>
              </div>
            ) : null}
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
