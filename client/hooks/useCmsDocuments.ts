import { useQuery } from "@tanstack/react-query";
import { sanityFetch } from "@/lib/sanity";

import {
  mergeAboutPage,
  mergeContactPage,
  mergeFaqPage,
  mergeGlobalSettings,
  mergeHomePage,
  mergeNotFound,
  mergePaymentPage,
  mergeProgramsLanding,
  mergeQmsProgram,
} from "@shared/cms/defaults";
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
  PaymentPageContent,
  ProgramsLandingContent,
  QmsProgramContent,
  SiteSettingsContent,
  SanityPortableText,
  SeoContent,
} from "@shared/cms/types";

// Keep Sanity-published changes feeling “instant” on Vercel.
const staleTimeMs = 30 * 1000

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

export const useHomePage = () =>
  useQuery({
    queryKey: ["cms", "homePage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<HomePageContent>>("homePage");
      return mergeHomePage(raw ?? undefined);
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
      return raw ?? null
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
  ctaTitle?: string
  ctaBody?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
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

export type CmsProgram = {
  title: string
  slug: string
  description?: string
  deadline?: string
  imageSrc?: string
  href?: string
  buttonText?: string
  waitlistHref?: string
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
      const raw = await sanityFetch<any[]>("events")
      return raw ?? []
    },
    staleTime: staleTimeMs,
  })

export const useEventBySlug = (slug: string) =>
  useQuery({
    queryKey: ["cms", "event", slug],
    queryFn: async () => {
      const trimmed = slug.trim()
      if (!trimmed) return null
      const raw = await sanityFetch<any>("eventBySlug", { slug: trimmed })
      return raw ?? null
    },
    enabled: Boolean(slug.trim()),
    staleTime: staleTimeMs,
  })

type ProgramPageQueryResult = Partial<QmsProgramContent> & {
  sections?: CmsPageSection[]
}

export const useProgramPageBySlug = (slug: string, fallback?: Partial<QmsProgramContent>) =>
  useQuery({
    queryKey: ["cms", "programBySlug", slug],
    queryFn: async () => {
      const raw = await sanityFetch<ProgramPageQueryResult>("programBySlug", { slug })
      const content = mergeQmsProgram({
        ...(fallback ?? {}),
        ...(raw ?? {}),
      })
      return {
        content,
        sections: Array.isArray(raw?.sections) ? raw.sections : [],
      }
    },
    enabled: Boolean(slug.trim()),
    staleTime: staleTimeMs,
  })

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

export const useAdvisorFilters = () =>
  useQuery({
    queryKey: ["cms", "advisorFilters"],
    queryFn: async () => {
      const raw = await sanityFetch<DirectoryTaxonomyOption[]>("advisorFilters")
      return Array.isArray(raw) ? raw : []
    },
    staleTime: staleTimeMs,
  })

export const useFounderLevels = () =>
  useQuery({
    queryKey: ["cms", "founderLevels"],
    queryFn: async () => {
      const raw = await sanityFetch<DirectoryTaxonomyOption[]>("founderLevels")
      return Array.isArray(raw) ? raw : []
    },
    staleTime: staleTimeMs,
  })

export const useFounderSpecialties = () =>
  useQuery({
    queryKey: ["cms", "founderSpecialties"],
    queryFn: async () => {
      const raw = await sanityFetch<DirectoryTaxonomyOption[]>("founderSpecialties")
      return Array.isArray(raw) ? raw : []
    },
    staleTime: staleTimeMs,
  })

export const useNetworkFoundersPage = () =>
  useQuery({
    queryKey: ["cms", "network", "foundersPage"],
    queryFn: async () => {
      const raw = await sanityFetch<CmsSingletonPageContent>("networkFoundersPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useNetworkAdvisorsPage = () =>
  useQuery({
    queryKey: ["cms", "network", "advisorsPage"],
    queryFn: async () => {
      const raw = await sanityFetch<CmsSingletonPageContent>("networkAdvisorsPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useNetworkInvestorsPage = () =>
  useQuery({
    queryKey: ["cms", "network", "investorsPage"],
    queryFn: async () => {
      const raw = await sanityFetch<CmsSingletonPageContent>("networkInvestorsPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useNetworkPartnersPage = () =>
  useQuery({
    queryKey: ["cms", "network", "partnersPage"],
    queryFn: async () => {
      const raw = await sanityFetch<CmsSingletonPageContent>("networkPartnersPage")
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })
