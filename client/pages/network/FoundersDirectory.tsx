import { useEffect, useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaCta from "@/components/RelliaCta"
import { SectionsRenderer } from "@/components/cms/PageRenderer"
import { cn } from "@/lib/utils"
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion"
import { Building2, Search, ChevronDown, ArrowLeft } from "lucide-react"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { NETWORK_PATH_ROLE_TAG } from "@/lib/networkPathRoles"
import {
  useAlumniCompanies,
  useDirectoryFilterGroups,
  useNetworkAlumniDirectoryPage,
  type DirectoryFilterGroup,
} from "@/hooks/useCmsDocuments"
import { mergeNetworkAlumniDirectoryPage } from "@shared/cms/directoryPageDefaults"
import { FOUNDER_DIRECTORY, type FounderCompany } from "@/data/founderDirectory"
import { isSanityConfigured } from "@/lib/sanity"
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv"
import { isCmsQueryLoading } from "@/lib/cmsQueryState"
import { DirectoryGridSkeleton } from "@/components/cms/CmsPageLoadingShell"
import FounderDirectoryCard from "@/components/network/FounderDirectoryCard"
import {
  filterFounderDirectoryGroups,
  getDirectoryGroupOptionLabels,
  matchesDirectoryFilterSelection,
} from "@/lib/directoryFilterOptions"
import { resolveSocialOgImageUrl } from "@/config/seo"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { deriveDirectoryPageSeo } from "@/lib/cmsPageSeoDefaults"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"

const DIRECTORY_TITLE_CLASS =
  "font-host-grotesk text-4xl font-extrabold tracking-tight text-black md:text-5xl"

const FALLBACK_FOUNDER_FILTER_GROUPS: DirectoryFilterGroup[] = [
  { id: "country", title: "Country", appliesTo: "both" },
  { id: "specialty", title: "Specialty", appliesTo: "founders" },
  { id: "business-model", title: "Business Model", appliesTo: "founders" },
]

const getFilterGroupLabel = (title: string): string => {
  const normalizedTitle = title.toLowerCase()
  if (normalizedTitle === "country" || normalizedTitle === "countries") return "Countries"
  if (normalizedTitle === "specialty" || normalizedTitle === "specialties") return "Specialties"
  if (normalizedTitle === "business model") return "Business Models"
  return title.endsWith("s") ? title : `${title}s`
}

const mapCmsCompany = (c: Record<string, unknown>): FounderCompany => ({
  id: String(c.id),
  slug: String(c.id),
  logoName: String(c.name),
  logoSrc: typeof c.logoSrc === "string" ? c.logoSrc : "",
  tagline: typeof c.tagline === "string" ? c.tagline : "",
  countries: Array.isArray(c.countries) ? c.countries.filter(Boolean) : [],
  specialtyTags: Array.isArray(c.specialtyTags) ? c.specialtyTags.filter(Boolean) : [],
  businessModels: Array.isArray(c.businessModels) ? c.businessModels.filter(Boolean) : [],
  directoryFilters: Array.isArray(c.directoryFilters) ? c.directoryFilters : [],
  shortDescription: typeof c.shortDescription === "string" ? c.shortDescription : "",
  longDescription: typeof c.longDescription === "string" ? c.longDescription : "",
  traction: typeof c.traction === "string" ? c.traction : "",
  relliaCollaboration: typeof c.relliaCollaboration === "string" ? c.relliaCollaboration : "",
  imageSrc: "",
  yearJoined: typeof c.yearJoined === "number" ? c.yearJoined : 0,
  founders: Array.isArray(c.founders) ? c.founders : [],
  programs: [],
  profileBody: c.profileBody as FounderCompany["profileBody"],
  socialLinks: Array.isArray(c.socialLinks) ? c.socialLinks : [],
  email: typeof c.email === "string" ? c.email : undefined,
})

export default function FoundersDirectory() {
  const { data: alumniDirectoryRaw } = useNetworkAlumniDirectoryPage()
  const alumniDirectory = mergeNetworkAlumniDirectoryPage(alumniDirectoryRaw ?? undefined)
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const companiesQuery = useAlumniCompanies()
  const { data: cmsCompanies } = companiesQuery
  const filterGroupsQuery = useDirectoryFilterGroups()
  const { data: cmsFilterGroups } = filterGroupsQuery
  const companiesListLoading = isSanityConfigured() && isCmsQueryLoading(companiesQuery)
  const [query, setQuery] = useState("")
  const [groupFilters, setGroupFilters] = useState<Record<string, string>>({})

  const dynamicGroups = useMemo(() => {
    const groups = Array.isArray(cmsFilterGroups) ? cmsFilterGroups : []
    return filterFounderDirectoryGroups(
      groups.filter((g) => g && (g.appliesTo === "founders" || g.appliesTo === "both")),
    ).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title))
  }, [cmsFilterGroups])

  const activeFilterGroups =
    dynamicGroups.length > 0 ? dynamicGroups : FALLBACK_FOUNDER_FILTER_GROUPS

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const next: Record<string, string> = {}

    const country = params.get("country")
    const specialty = params.get("specialty")
    const businessModel = params.get("businessModel")

    const countryGroup = activeFilterGroups.find((g) => g.id === "country")
    const specialtyGroup = activeFilterGroups.find((g) => g.id === "specialty")
    const businessModelGroup = activeFilterGroups.find((g) => g.id === "business-model")

    if (country && countryGroup) next[countryGroup.id] = country
    if (specialty && specialtyGroup) next[specialtyGroup.id] = specialty
    if (businessModel && businessModelGroup) next[businessModelGroup.id] = businessModel

    if (Object.keys(next).length > 0) {
      setGroupFilters((prev) => ({ ...prev, ...next }))
    }
  }, [location.search, activeFilterGroups])

  const companies = useMemo<FounderCompany[]>(() => {
    if (!isSanityConfigured()) return []

    if (Array.isArray(cmsCompanies) && cmsCompanies.length > 0) {
      return cmsCompanies
        .filter((c) => c && typeof c.id === "string" && typeof c.name === "string")
        .map((c) => mapCmsCompany(c as Record<string, unknown>))
    }
    return allowCmsSeedFallbacks() ? FOUNDER_DIRECTORY : []
  }, [cmsCompanies])

  const alumniDirectoryOgImage = useMemo(() => {
    const logoSrc = companies[0]?.logoSrc?.trim()
    return logoSrc ? resolveSocialOgImageUrl(logoSrc) : undefined
  }, [companies])

  useApplyCmsSeo(
    alumniDirectory.seo,
    deriveDirectoryPageSeo(alumniDirectory, "/founders/alumni", {
      ogImage: alumniDirectoryOgImage,
    }),
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return companies.filter((c) => {
      for (const group of activeFilterGroups) {
        const selected = (groupFilters[group.id] ?? "all").trim()
        if (!selected || selected === "all") continue
        if (!matchesDirectoryFilterSelection(group, selected, c)) return false
      }

      if (!q) return true
      const blob = [
        c.logoName,
        c.shortDescription,
        c.specialtyTags.join(" "),
        c.countries.join(" "),
        c.businessModels.join(" "),
        c.traction,
      ]
        .join(" ")
        .toLowerCase()
      return blob.includes(q)
    })
  }, [companies, activeFilterGroups, groupFilters, query])

  const dynamicGroupOptions = useMemo(
    () => getDirectoryGroupOptionLabels(activeFilterGroups, companies),
    [companies, activeFilterGroups],
  )

  const [page, setPage] = useState(1)
  const itemsPerPage = 12
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  }, [filtered, page])

  useEffect(() => {
    setPage(1)
  }, [query, groupFilters])

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
            staggerChildren: 0.06,
          },
    },
  }
  const item: Variants = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 14 },
    show: reduceMotion
      ? {}
      : { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  }

  const navigate = useNavigate()
  const tag = NETWORK_PATH_ROLE_TAG["founder"]
  const TagIcon = tag.icon
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar forceSolid />

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-black/10 bg-rellia-greyTeal pt-28 pb-12 md:pt-36 md:pb-16">
          <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
          <div className="md:hidden absolute -left-12 -top-12 h-32 w-32 rounded-full bg-rellia-mint/20 blur-2xl pointer-events-none" />
          <div className="md:hidden absolute -right-8 top-1/4 h-24 w-24 rounded-full bg-rellia-mint/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1300px] px-6 md:px-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-rellia-teal px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/95 ring-1 ring-white/15 mb-4">
              <TagIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Founders
            </div>
            <h1 className={DIRECTORY_TITLE_CLASS}>{alumniDirectory.directoryTitle ?? "Explore Alumni"}</h1>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              {alumniDirectory.directorySubtitle}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
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
                {activeFilterGroups.map((g) => {
                  const options = dynamicGroupOptions.get(g.id) ?? []
                  const value = groupFilters[g.id] ?? "all"
                  return (
                    <div key={g.id} className="relative w-full md:w-auto">
                      <select
                        value={value}
                        onChange={(e) => {
                          const nextValue = e.target.value
                          setGroupFilters((prev) => ({
                            ...prev,
                            [g.id]: nextValue,
                          }))
                        }}
                        className="h-14 w-full appearance-none rounded-2xl border border-black/10 bg-black/[0.02] pl-5 pr-14 md:min-w-[160px] font-urbanist text-base font-semibold text-black/80 outline-none hover:border-black/20 focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:bg-white cursor-pointer"
                        aria-label={`Filter by ${g.title}`}
                      >
                        <option value="all">All {getFilterGroupLabel(g.title)}</option>
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
            </div>

            <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
              <p className="font-urbanist text-sm font-semibold text-black/60">
                Showing {paginated.length} of {filtered.length} results
              </p>
            </div>

            {companiesListLoading ? (
              <DirectoryGridSkeleton className="mt-10" count={6} />
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
                          layout
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
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

        {alumniDirectory.sections?.length ? (
          <SectionsRenderer sections={alumniDirectory.sections} />
        ) : null}

        <RelliaCta
          title={alumniDirectory.directoryCtaTitle ?? "Ready to build your network?"}
          body={alumniDirectory.directoryCtaBody}
          primary={{
            label: alumniDirectory.directoryCtaPrimaryLabel ?? "Apply for Membership",
            to: alumniDirectory.directoryCtaPrimaryHref ?? "/apply",
          }}
        />
      </main>

      <Footer />
    </div>
  )
}
