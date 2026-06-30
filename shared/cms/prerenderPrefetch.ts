import type { QueryClient } from "@tanstack/react-query"
import {
  mergeAboutPage,
  mergeGlobalSettings,
  mergeHomePage,
  mergeProgramsLanding,
  mergeQmsProgram,
  DEFAULT_QMS_PROGRAM,
  mergeFaqPage,
} from "./defaults"
import {
  fetchAboutPageForPrerender,
  fetchFeaturedStoriesForPrerender,
  fetchGlobalSettingsForPrerender,
  fetchHomePageForPrerender,
  fetchNavigationForPrerender,
  fetchNetworkAdvisorsPageForPrerender,
  fetchNetworkFoundersPageForPrerender,
  fetchNetworkInvestorsPageForPrerender,
  fetchNetworkPartnersPageForPrerender,
  fetchSiteSettingsForPrerender,
  fetchStoriesForPrerender,
  fetchStoriesPageForPrerender,
  fetchEventsLandingPageForPrerender,
  fetchAdvisorsForPrerender,
  fetchAlumniCompaniesForPrerender,
  fetchFaqPageForPrerender,
  fetchDirectoryFilterGroupsForPrerender,
  fetchNetworkAlumniDirectoryPageForPrerender,
  fetchNetworkAdvisorsDirectoryPageForPrerender,
  fetchEventBySlugForPrerender,
  fetchEventsForPrerender,
  fetchProgramBySlugForPrerender,
  fetchStoryBySlugForPrerender,
  prefetchCareersPageContent,
  fetchPaymentPageForPrerender,
  fetchProgramsLandingForPrerender,
  fetchProgramsForPrerender,
} from "./prerenderSanity"
import { parseCareersRoleIdFromPathname } from "./careersRoleShare"

const prefetchShell = async (queryClient: QueryClient): Promise<void> => {
  const [globalRaw, navigationRaw, siteRaw] = await Promise.all([
    fetchGlobalSettingsForPrerender(),
    fetchNavigationForPrerender(),
    fetchSiteSettingsForPrerender(),
  ])

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["cms", "globalSettings"],
      queryFn: async () => mergeGlobalSettings(globalRaw ?? undefined),
    }),
    queryClient.prefetchQuery({
      queryKey: ["cms", "navigation"],
      queryFn: async () => ({
        primary: Array.isArray(navigationRaw?.primary) ? navigationRaw.primary : [],
        footer: Array.isArray(navigationRaw?.footer) ? navigationRaw.footer : [],
      }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["cms", "siteSettings"],
      queryFn: async () => ({
        siteName: typeof siteRaw?.siteName === "string" ? siteRaw.siteName : undefined,
        logoUrl: typeof siteRaw?.logoUrl === "string" ? siteRaw.logoUrl : undefined,
        defaultSeo: siteRaw?.defaultSeo ?? undefined,
      }),
    }),
  ])
}

export const prefetchCmsQueriesForPathname = async (
  queryClient: QueryClient,
  pathname: string,
): Promise<{
  careersPageHeroImageSrc?: string | null
  careersRole?: Record<string, unknown> | null
}> => {
  await prefetchShell(queryClient)

  const prefetched: {
    careersPageHeroImageSrc?: string | null
    careersRole?: Record<string, unknown> | null
  } = {}

  if (pathname === "/") {
    const [homeRaw, featured] = await Promise.all([
      fetchHomePageForPrerender(),
      fetchFeaturedStoriesForPrerender(),
    ])
    await queryClient.prefetchQuery({
      queryKey: ["cms", "homePage"],
      queryFn: async () => ({
        raw: homeRaw,
        merged: mergeHomePage(homeRaw ?? undefined),
      }),
    })
    await queryClient.prefetchQuery({
      queryKey: ["cms", "featuredStories"],
      queryFn: async () => featured,
    })
  }

  if (pathname === "/stories") {
    const [stories, featured, storiesPage] = await Promise.all([
      fetchStoriesForPrerender(),
      fetchFeaturedStoriesForPrerender(),
      fetchStoriesPageForPrerender(),
    ])
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["cms", "stories"],
        queryFn: async () => stories,
      }),
      queryClient.prefetchQuery({
        queryKey: ["cms", "featuredStories"],
        queryFn: async () => featured,
      }),
      queryClient.prefetchQuery({
        queryKey: ["cms", "storiesPage"],
        queryFn: async () => storiesPage,
      }),
    ])
  }

  if (pathname === "/about") {
    const aboutRaw = await fetchAboutPageForPrerender()
    await queryClient.prefetchQuery({
      queryKey: ["cms", "aboutPage"],
      queryFn: async () => mergeAboutPage(aboutRaw ?? undefined),
    })
  }

  if (pathname === "/faq") {
    const faqRaw = await fetchFaqPageForPrerender()
    await queryClient.prefetchQuery({
      queryKey: ["cms", "faqPage"],
      queryFn: async () => mergeFaqPage(faqRaw ?? undefined),
    })
  }

  if (pathname === "/founders") {
    const page = await fetchNetworkFoundersPageForPrerender()
    await queryClient.prefetchQuery({
      queryKey: ["cms", "network", "foundersPage"],
      queryFn: async () => page,
    })
  }

  if (pathname === "/advisors") {
    const page = await fetchNetworkAdvisorsPageForPrerender()
    await queryClient.prefetchQuery({
      queryKey: ["cms", "network", "advisorsPage"],
      queryFn: async () => page,
    })
  }

  if (pathname === "/investors") {
    const page = await fetchNetworkInvestorsPageForPrerender()
    await queryClient.prefetchQuery({
      queryKey: ["cms", "network", "investorsPage"],
      queryFn: async () => page,
    })
  }

  if (pathname === "/industry-partners" || pathname === "/partners") {
    const page = await fetchNetworkPartnersPageForPrerender()
    await queryClient.prefetchQuery({
      queryKey: ["cms", "network", "partnersPage"],
      queryFn: async () => page,
    })
  }

  if (pathname === "/events") {
    const [events, landing] = await Promise.all([
      fetchEventsForPrerender(),
      fetchEventsLandingPageForPrerender(),
    ])
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["cms", "events"],
        queryFn: async () => events,
      }),
      queryClient.prefetchQuery({
        queryKey: ["cms", "eventsLandingPage"],
        queryFn: async () => landing,
      }),
    ])
  }

  if (pathname === "/careers" || pathname.startsWith("/careers/roles/")) {
    const careersPage = await prefetchCareersPageContent()
    prefetched.careersPageHeroImageSrc =
      typeof careersPage.heroImageSrc === "string" ? careersPage.heroImageSrc : null
    await queryClient.prefetchQuery({
      queryKey: ["cms", "careersPage"],
      queryFn: async () => careersPage,
    })

    if (pathname.startsWith("/careers/roles/")) {
      const roleId = parseCareersRoleIdFromPathname(pathname)
      if (roleId) {
        prefetched.careersRole =
          careersPage.openRoles?.find((row) => row.id.trim() === roleId) ?? null
      }
    }
  }

  if (pathname.startsWith("/events/") && pathname !== "/events") {
    const slug = pathname.slice("/events/".length)
    const event = await fetchEventBySlugForPrerender(slug)
    if (event) {
      await queryClient.prefetchQuery({
        queryKey: ["cms", "event", slug],
        queryFn: async () => event,
      })
    }
  }

  if (pathname.startsWith("/programs/") && pathname !== "/programs") {
    const slug = pathname.slice("/programs/".length)
    const program = await fetchProgramBySlugForPrerender(slug)
    if (program) {
      await queryClient.prefetchQuery({
        queryKey: ["cms", "program", slug],
        queryFn: async () => program,
      })
      await queryClient.prefetchQuery({
        queryKey: ["cms", "programBySlug", slug],
        queryFn: async () => ({
          content: mergeQmsProgram(program ?? undefined, DEFAULT_QMS_PROGRAM),
          sections: Array.isArray(program.sections) ? program.sections : [],
        }),
      })
    }
  }

  if (pathname.startsWith("/stories/") && pathname !== "/stories") {
    const slug = pathname.slice("/stories/".length)
    const story = await fetchStoryBySlugForPrerender(slug)
    if (story) {
      await queryClient.prefetchQuery({
        queryKey: ["cms", "story", slug],
        queryFn: async () => story,
      })
    }
  }

  if (pathname.startsWith("/advisors/directory/") && pathname !== "/advisors/directory") {
    const advisors = await fetchAdvisorsForPrerender()
    await queryClient.prefetchQuery({
      queryKey: ["cms", "advisors"],
      queryFn: async () => advisors,
    })
  }

  if (pathname.startsWith("/founders/alumni/") && pathname !== "/founders/alumni") {
    const companies = await fetchAlumniCompaniesForPrerender()
    await queryClient.prefetchQuery({
      queryKey: ["cms", "alumniCompanies"],
      queryFn: async () => companies,
    })
  }

  if (pathname === "/founders/alumni") {
    const [companies, filterGroups, alumniDirectoryPage] = await Promise.all([
      fetchAlumniCompaniesForPrerender(),
      fetchDirectoryFilterGroupsForPrerender(),
      fetchNetworkAlumniDirectoryPageForPrerender(),
    ])
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["cms", "alumniCompanies"],
        queryFn: async () => companies,
      }),
      queryClient.prefetchQuery({
        queryKey: ["cms", "directoryFilterGroups"],
        queryFn: async () => filterGroups,
      }),
      queryClient.prefetchQuery({
        queryKey: ["cms", "network", "alumniDirectoryPage"],
        queryFn: async () => alumniDirectoryPage,
      }),
    ])
  }

  if (pathname === "/advisors/directory") {
    const [advisors, filterGroups, advisorsDirectoryPage] = await Promise.all([
      fetchAdvisorsForPrerender(),
      fetchDirectoryFilterGroupsForPrerender(),
      fetchNetworkAdvisorsDirectoryPageForPrerender(),
    ])
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["cms", "advisors"],
        queryFn: async () => advisors,
      }),
      queryClient.prefetchQuery({
        queryKey: ["cms", "directoryFilterGroups"],
        queryFn: async () => filterGroups,
      }),
      queryClient.prefetchQuery({
        queryKey: ["cms", "network", "advisorsDirectoryPage"],
        queryFn: async () => advisorsDirectoryPage,
      }),
    ])
  }

  if (pathname === "/membership") {
    const paymentPage = await fetchPaymentPageForPrerender()
    await queryClient.prefetchQuery({
      queryKey: ["cms", "paymentPage"],
      queryFn: async () => paymentPage,
    })
  }

  if (pathname === "/programs") {
    const [landing, list] = await Promise.all([
      fetchProgramsLandingForPrerender(),
      fetchProgramsForPrerender(),
    ])
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["cms", "programsLandingPage"],
        queryFn: async () => mergeProgramsLanding(landing ?? undefined),
      }),
      queryClient.prefetchQuery({
        queryKey: ["cms", "programs"],
        queryFn: async () => list,
      }),
    ])
  }

  return prefetched
}
