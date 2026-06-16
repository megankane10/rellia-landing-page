import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPublicCmsEvents, fetchPublicCmsEventBySlug } from "@/lib/cmsPublicFetch";
import { sanityFetch } from "@/lib/sanity";
import { isSanityPresentationIframe } from "@/lib/sanityPresentation";

import {
  mergeAboutPage,
  mergeContactPage,
  mergeFaqPage,
  mergeGlobalSettings,
  mergeHomePage,
  mergeNotFound,
  mergePaymentPage,
  mergeApplyPage,
  mergeConsultingPage,
  mergeDiagnosticLandingPage,
  mergeProgramsLanding,
  mergeQmsProgram,
  DEFAULT_QMS_PROGRAM,
} from "@shared/cms/defaults";
import { mergeCareersPage } from "@shared/cms/careersPageDefaults";
import { mergeCmsPageContent } from "@shared/cms/mergeCmsPageContent";
import type {
  AboutPageContent,
  ContactPageContent,
  CmsPageSection,
  FaqPageContent,
  NavigationContent,
  CmsPageContent,
  CmsSingletonPageContent,
  GlobalSettingsContent,
  HomePageContent,
  NotFoundContent,
  ApplyPageContent,
  ConsultingPageContent,
  CareersPageContent,
  CareersOpenRole,
  DiagnosticLandingPageContent,
  DiagnosticSurveyContent,
  PaymentPageContent,
  ProgramsLandingContent,
  ProgramsLayoutPageContent,
  QmsProgramContent,
  LegalPageContent,
  NetworkAdvisorsPageContent,
  NetworkDirectoryPageContent,
  NetworkFoundersPageContent,
  NetworkInvestorsPageContent,
  NetworkPartnersPageContent,
  SiteSettingsContent,
  SanityPortableText,
  SeoContent,
} from "@shared/cms/types";
import { filterValidOpenRoles } from "@shared/careersOpenRolesVisibility";

// Keep Sanity-published changes feeling “instant” on the live site.
const staleTimeMs = 15 * 1000

export const useGlobalSettings = () =>
  useQuery({
    queryKey: ["cms", "globalSettings"],
    queryFn: async () => {
      const raw =
        await sanityFetch<Partial<GlobalSettingsContent>>("globalSettings");
      return mergeGlobalSettings(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useNavigation = () =>
  useQuery({
    queryKey: ["cms", "navigation"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<NavigationContent>>("navigation")
      return {
        primary: Array.isArray(raw?.primary) ? (raw?.primary as NavigationContent["primary"]) : [],
        footer: Array.isArray(raw?.footer) ? (raw?.footer as NavigationContent["footer"]) : [],
      } satisfies NavigationContent
    },
    staleTime: staleTimeMs,
  })

export const useSiteSettings = () =>
  useQuery({
    queryKey: ["cms", "siteSettings"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<SiteSettingsContent>>("siteSettings")
      return {
        siteName: typeof raw?.siteName === "string" ? raw.siteName : undefined,
        logoUrl: typeof raw?.logoUrl === "string" ? raw.logoUrl : undefined,
        defaultSeo: raw?.defaultSeo ?? undefined,
      } satisfies SiteSettingsContent
    },
    staleTime: staleTimeMs,
  })

export type HomePageQueryData = {
  raw: Partial<HomePageContent> | null
  merged: HomePageContent
}

export const useHomePage = () =>
  useQuery({
    queryKey: ["cms", "homePage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<HomePageContent>>("homePage")
      return {
        raw: raw ?? null,
        merged: mergeHomePage(raw ?? undefined),
      } satisfies HomePageQueryData
    },
    staleTime: staleTimeMs,
  });

export type CmsStoryListItem = {
  slug: string
  title: string
  excerpt?: string
  coverImageSrc?: string
  coverImageAlt?: string
  tag?: string
  publishedAt?: string
  featured?: boolean
}

export type CmsStory = CmsStoryListItem & {
  body?: SanityPortableText | null
  seo?: SeoContent
  headerLayout?: "background" | "block"
}

export const useFeaturedStories = () =>
  useQuery({
    queryKey: ["cms", "featuredStories"],
    queryFn: async () => {
      const raw = await sanityFetch<CmsStory[]>("featuredStories")
      return Array.isArray(raw) ? raw : []
    },
    staleTime: staleTimeMs,
  })

export const useStories = () =>
  useQuery({
    queryKey: ["cms", "stories"],
    queryFn: async () => {
      const raw = await sanityFetch<CmsStoryListItem[]>("stories")
      return Array.isArray(raw) ? raw : []
    },
    staleTime: staleTimeMs,
  })

export type StoriesLandingContent = {
  headlinePortable?: SanityPortableText | null
  subheadline?: string | null
  relatedSectionEnabled?: boolean | null
  relatedSectionTitle?: string | null
  relatedSectionSubheadline?: string | null
  seo?: SeoContent
}

export const useStoriesPage = () =>
  useQuery({
    queryKey: ["cms", "storiesPage"],
    queryFn: async () => {
      const raw = await sanityFetch<StoriesLandingContent>("storiesPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useStoryBySlug = (slug: string) =>
  useQuery({
    queryKey: ["cms", "story", slug],
    queryFn: async () => {
      const trimmed = slug.trim()
      if (!trimmed) return null
      const raw = await sanityFetch<CmsStory>("storyBySlug", { slug: trimmed })
      return raw ?? null
    },
    enabled: Boolean(slug.trim()),
    staleTime: staleTimeMs,
  })

export const useCmsPageBySlug = (slug: string) =>
  useQuery({
    queryKey: ["cms", "page", slug],
    queryFn: async () => {
      const trimmed = slug.trim()
      if (!trimmed) return null
      const raw = await sanityFetch<CmsPageContent>("pageBySlug", { slug: trimmed })
      return mergeCmsPageContent(raw)
    },
    staleTime: staleTimeMs,
  })

export const useAboutPage = () =>
  useQuery({
    queryKey: ["cms", "aboutPage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<AboutPageContent>>("aboutPage");
      return mergeAboutPage(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useFaqPage = () =>
  useQuery({
    queryKey: ["cms", "faqPage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<FaqPageContent>>("faqPage");
      return mergeFaqPage(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useProgramsLandingPage = () =>
  useQuery({
    queryKey: ["cms", "programsLandingPage"],
    queryFn: async () => {
      const raw =
        await sanityFetch<Partial<ProgramsLandingContent>>("programsLanding");
      return mergeProgramsLanding(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export type EventsLandingContent = {
  heroTitlePortable?: SanityPortableText | null
  heroSubtitle?: string
  relatedSectionEnabled?: boolean
  relatedSectionTitle?: string
  relatedSectionSubheadline?: string
  ctaTitle?: string
  ctaBody?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
  sections?: CmsPageSection[]
  seo?: SeoContent
}

export const useEventsLandingPage = () =>
  useQuery({
    queryKey: ["cms", "eventsLandingPage"],
    queryFn: async () => {
      const raw = await sanityFetch<EventsLandingContent>("eventsLanding")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const usePrograms = () =>
  useQuery({
    queryKey: ["cms", "programs"],
    queryFn: async () => {
      const raw = await sanityFetch<any[]>("programs")
      return raw ?? []
    },
    staleTime: staleTimeMs,
  })

export const useProgramsLayoutPage = () =>
  useQuery({
    queryKey: ["cms", "programsLayoutPage"],
    queryFn: async () => {
      const raw = await sanityFetch<ProgramsLayoutPageContent | null>("programsLayoutPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export type CmsProgram = {
  title: string
  slug: string
  description?: string
  deadline?: string
  imageSrc?: string
  href?: string
  buttonText?: string
  status?: "available" | "waitlist" | "hidden" | string
  sortOrder?: number
  seo?: SeoContent
}

export const useProgramBySlug = (slug: string) =>
  useQuery({
    queryKey: ["cms", "program", slug],
    queryFn: async () => {
      const trimmed = slug.trim()
      if (!trimmed) return null
      const raw = await sanityFetch<CmsProgram>("programBySlug", { slug: trimmed })
      return raw ?? null
    },
    enabled: Boolean(slug.trim()),
    staleTime: staleTimeMs,
  })

export const useEvents = () =>
  useQuery({
    queryKey: ["cms", "events"],
    queryFn: async () => {
      // Presentation needs /api/sanity/query (drafts + stega). Public GET has neither.
      if (isSanityPresentationIframe()) {
        const raw = await sanityFetch<any[]>("events")
        return raw ?? []
      }
      const fromPublic = await fetchPublicCmsEvents<any>()
      if (fromPublic.length > 0) return fromPublic
      const raw = await sanityFetch<any[]>("events")
      return raw ?? []
    },
    staleTime: staleTimeMs,
    refetchOnMount: "always",
  })

export const useEventBySlug = (slug: string) => {
  const queryClient = useQueryClient()
  const trimmed = slug.trim()
  return useQuery({
    queryKey: ["cms", "event", trimmed],
    queryFn: async () => {
      if (!trimmed) return null
      if (isSanityPresentationIframe()) {
        const raw = await sanityFetch<any>("eventBySlug", { slug: trimmed })
        return raw ?? null
      }
      const fromPublic = await fetchPublicCmsEventBySlug<any>(trimmed)
      if (fromPublic) return fromPublic
      const raw = await sanityFetch<any>("eventBySlug", { slug: trimmed })
      if (raw) return raw
      const cachedList = queryClient.getQueryData<any[]>(["cms", "events"])
      const fromCache = cachedList?.find((event) => event?.slug === trimmed)
      if (fromCache) return fromCache
      const fromList = await fetchPublicCmsEvents<any>()
      return fromList.find((event) => event?.slug === trimmed) ?? null
    },
    enabled: Boolean(trimmed),
    staleTime: staleTimeMs,
    refetchOnMount: "always",
    placeholderData: () => {
      const cachedList = queryClient.getQueryData<any[]>(["cms", "events"])
      return cachedList?.find((event) => event?.slug === trimmed) ?? undefined
    },
  })
}

type ProgramPageQueryResult = Partial<QmsProgramContent> & {
  sections?: CmsPageSection[]
}

export const useProgramPageBySlug = (slug: string, fallback?: Partial<QmsProgramContent>) => {
  const queryClient = useQueryClient()
  const trimmed = slug.trim()
  return useQuery({
    queryKey: ["cms", "programBySlug", trimmed],
    queryFn: async () => {
      const raw = await sanityFetch<ProgramPageQueryResult>("programBySlug", { slug: trimmed })
      const content = mergeQmsProgram(raw ?? undefined, {
        ...DEFAULT_QMS_PROGRAM,
        ...(fallback ?? {}),
      })
      return {
        content,
        sections: Array.isArray(raw?.sections) ? raw.sections : [],
      }
    },
    enabled: Boolean(trimmed),
    staleTime: staleTimeMs,
    placeholderData: () => {
      const cached = queryClient.getQueryData<CmsProgram>(["cms", "program", trimmed])
      if (!cached) return undefined
      const content = mergeQmsProgram(cached, {
        ...DEFAULT_QMS_PROGRAM,
        ...(fallback ?? {}),
      })
      return {
        content,
        sections: Array.isArray((cached as ProgramPageQueryResult).sections)
          ? (cached as ProgramPageQueryResult).sections
          : [],
      }
    },
  })
}

export const useContactPage = () =>
  useQuery({
    queryKey: ["cms", "contactPage"],
    queryFn: async () => {
      const raw =
        await sanityFetch<Partial<ContactPageContent>>("contactPage");
      return mergeContactPage(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useNotFoundPage = () =>
  useQuery({
    queryKey: ["cms", "notFoundPage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<NotFoundContent>>("notFound");
      return mergeNotFound(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const usePaymentPage = () =>
  useQuery({
    queryKey: ["cms", "paymentPage"],
    queryFn: async () => {
      const raw =
        await sanityFetch<Partial<PaymentPageContent>>("paymentPage");
      return mergePaymentPage(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useApplyPage = () =>
  useQuery({
    queryKey: ["cms", "applyPage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<ApplyPageContent>>("applyPage");
      return mergeApplyPage(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useCareersPage = () =>
  useQuery({
    queryKey: ["cms", "careersPage"],
    queryFn: async () => {
      const [raw, rolesRaw] = await Promise.all([
        sanityFetch<Partial<CareersPageContent>>("careersPage"),
        sanityFetch<Array<Partial<CareersOpenRole> & { roleId?: string }>>("openRoles"),
      ])
      if (raw === null && rolesRaw === null) {
        throw new Error("Sanity CMS did not respond for careers content.")
      }
      const openRoles = filterValidOpenRoles(
        rolesRaw?.length ? rolesRaw : raw?.openRoles,
      )
      const merged = mergeCareersPage(raw ?? undefined)
      return { ...merged, openRoles }
    },
    staleTime: staleTimeMs,
    retry: 3,
  });

export const useDiagnosticSurveyContent = () =>
  useQuery({
    queryKey: ["cms", "diagnosticSurveyContent"],
    queryFn: async () => {
      const raw =
        await sanityFetch<DiagnosticSurveyContent>("diagnosticSurveyContent");
      return raw ?? null;
    },
    staleTime: staleTimeMs,
  });

export const useAdvisors = () =>
  useQuery({
    queryKey: ["cms", "advisors"],
    queryFn: async () => {
      const raw = await sanityFetch<any[]>("advisors");
      return raw ?? [];
    },
    staleTime: staleTimeMs,
  });

export const useAlumniCompanies = () =>
  useQuery({
    queryKey: ["cms", "alumniCompanies"],
    queryFn: async () => {
      const raw = await sanityFetch<any[]>("alumniCompanies");
      return raw ?? [];
    },
    staleTime: staleTimeMs,
  });

export type DirectoryTaxonomyOption = {
  id: string
  label: string
  sortOrder?: number
}

export type DirectoryFilterGroup = {
  id: string
  title: string
  appliesTo: "advisors" | "founders" | "both"
  sortOrder?: number
  options?: Array<{ label: string }>
}

export const useDirectoryFilterGroups = () =>
  useQuery({
    queryKey: ["cms", "directoryFilterGroups"],
    queryFn: async () => {
      const raw = await sanityFetch<DirectoryFilterGroup[]>("directoryFilterGroups")
      return Array.isArray(raw) ? raw : []
    },
    staleTime: staleTimeMs,
  })

export const useDiagnosticLandingPage = () =>
  useQuery({
    queryKey: ["cms", "diagnosticLandingPage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<DiagnosticLandingPageContent>>("diagnosticLandingPage")
      return mergeDiagnosticLandingPage(raw ?? undefined)
    },
    staleTime: staleTimeMs,
  })

export const useConsultingPage = () =>
  useQuery({
    queryKey: ["cms", "consultingPage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<ConsultingPageContent>>("consultingPage")
      return mergeConsultingPage(raw ?? undefined)
    },
    staleTime: staleTimeMs,
  })

export const useTermsPage = () =>
  useQuery({
    queryKey: ["cms", "termsPage"],
    queryFn: async () => {
      const raw = await sanityFetch<LegalPageContent>("termsPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const usePrivacyPage = () =>
  useQuery({
    queryKey: ["cms", "privacyPage"],
    queryFn: async () => {
      const raw = await sanityFetch<LegalPageContent>("privacyPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useNetworkFoundersPage = () =>
  useQuery({
    queryKey: ["cms", "network", "foundersPage"],
    queryFn: async () => {
      const raw = await sanityFetch<NetworkFoundersPageContent>("networkFoundersPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useNetworkAdvisorsPage = () =>
  useQuery({
    queryKey: ["cms", "network", "advisorsPage"],
    queryFn: async () => {
      const raw = await sanityFetch<NetworkAdvisorsPageContent>("networkAdvisorsPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useNetworkAlumniDirectoryPage = () =>
  useQuery({
    queryKey: ["cms", "network", "alumniDirectoryPage"],
    queryFn: async () => {
      const raw = await sanityFetch<NetworkDirectoryPageContent>("networkAlumniDirectoryPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useNetworkAdvisorsDirectoryPage = () =>
  useQuery({
    queryKey: ["cms", "network", "advisorsDirectoryPage"],
    queryFn: async () => {
      const raw = await sanityFetch<NetworkDirectoryPageContent>("networkAdvisorsDirectoryPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useNetworkInvestorsPage = () =>
  useQuery({
    queryKey: ["cms", "network", "investorsPage"],
    queryFn: async () => {
      const raw = await sanityFetch<NetworkInvestorsPageContent>("networkInvestorsPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useNetworkPartnersPage = () =>
  useQuery({
    queryKey: ["cms", "network", "partnersPage"],
    queryFn: async () => {
      const raw = await sanityFetch<NetworkPartnersPageContent>("networkPartnersPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })
