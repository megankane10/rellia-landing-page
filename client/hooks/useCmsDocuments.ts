import { useQuery } from "@tanstack/react-query";
import { sanityFetch } from "@/lib/sanity";
import {
  aboutPageQuery,
  contactPageQuery,
  faqPageQuery,
  globalSettingsQuery,
  homePageQuery,
  navigationQuery,
  pageBySlugQuery,
  programPageBySlugQuery,
  marketingPageBySlugQuery,
  notFoundQuery,
  paymentPageQuery,
  programsLandingQuery,
  programsQuery,
  eventsQuery,
  eventBySlugQuery,
  advisorsQuery,
  alumniCompaniesQuery,
} from "@/lib/cmsQueries";

import {
  mergeAboutPage,
  mergeContactPage,
  mergeFaqPage,
  mergeGlobalSettings,
  mergeHomePage,
  mergeMarketingPage,
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
  GlobalSettingsContent,
  HomePageContent,
  MarketingPageContent,
  NotFoundContent,
  PaymentPageContent,
  ProgramsLandingContent,
  QmsProgramContent,
} from "@shared/cms/types";

const staleTimeMs = 5 * 60 * 1000;

export const useGlobalSettings = () =>
  useQuery({
    queryKey: ["cms", "globalSettings"],
    queryFn: async () => {
      const raw =
        await sanityFetch<Partial<GlobalSettingsContent>>(globalSettingsQuery);
      return mergeGlobalSettings(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useNavigation = () =>
  useQuery({
    queryKey: ["cms", "navigation"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<NavigationContent>>(navigationQuery)
      return {
        primary: Array.isArray(raw?.primary) ? (raw?.primary as NavigationContent["primary"]) : [],
        footer: Array.isArray(raw?.footer) ? (raw?.footer as NavigationContent["footer"]) : [],
      } satisfies NavigationContent
    },
    staleTime: staleTimeMs,
  })

export const useHomePage = () =>
  useQuery({
    queryKey: ["cms", "homePage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<HomePageContent>>(homePageQuery);
      return mergeHomePage(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useCmsPageBySlug = (slug: string) =>
  useQuery({
    queryKey: ["cms", "page", slug],
    queryFn: async () => {
      const trimmed = slug.trim()
      if (!trimmed) return null
      const raw = await sanityFetch<CmsPageContent>(pageBySlugQuery, { slug: trimmed })
      return raw ?? null
    },
    staleTime: staleTimeMs,
  })

export const useAboutPage = () =>
  useQuery({
    queryKey: ["cms", "aboutPage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<AboutPageContent>>(aboutPageQuery);
      return mergeAboutPage(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useFaqPage = () =>
  useQuery({
    queryKey: ["cms", "faqPage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<FaqPageContent>>(faqPageQuery);
      return mergeFaqPage(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useProgramsLandingPage = () =>
  useQuery({
    queryKey: ["cms", "programsLandingPage"],
    queryFn: async () => {
      const raw =
        await sanityFetch<Partial<ProgramsLandingContent>>(
          programsLandingQuery,
        );
      return mergeProgramsLanding(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const usePrograms = () =>
  useQuery({
    queryKey: ["cms", "programs"],
    queryFn: async () => {
      const raw = await sanityFetch<any[]>(programsQuery)
      return raw ?? []
    },
    staleTime: staleTimeMs,
  })

export const useEvents = () =>
  useQuery({
    queryKey: ["cms", "events"],
    queryFn: async () => {
      const raw = await sanityFetch<any[]>(eventsQuery)
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
      const raw = await sanityFetch<any>(eventBySlugQuery, { slug: trimmed })
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
    queryKey: ["cms", "programPageBySlug", slug],
    queryFn: async () => {
      const raw = await sanityFetch<ProgramPageQueryResult>(programPageBySlugQuery, { slug })
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
        await sanityFetch<Partial<ContactPageContent>>(contactPageQuery);
      return mergeContactPage(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useNotFoundPage = () =>
  useQuery({
    queryKey: ["cms", "notFoundPage"],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<NotFoundContent>>(notFoundQuery);
      return mergeNotFound(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const usePaymentPage = () =>
  useQuery({
    queryKey: ["cms", "paymentPage"],
    queryFn: async () => {
      const raw =
        await sanityFetch<Partial<PaymentPageContent>>(paymentPageQuery);
      return mergePaymentPage(raw ?? undefined);
    },
    staleTime: staleTimeMs,
  });

export const useMarketingPage = (
  slug: string,
  fallback?: Partial<Pick<MarketingPageContent, "title" | "subtitle">>,
) =>
  useQuery({
    queryKey: [
      "cms",
      "marketingPage",
      slug,
      fallback?.title,
      fallback?.subtitle,
    ],
    queryFn: async () => {
      const raw = await sanityFetch<Partial<MarketingPageContent>>(
        marketingPageBySlugQuery,
        { slug },
      );
      return mergeMarketingPage(raw ?? undefined, fallback);
    },
    staleTime: staleTimeMs,
  });

export const useAdvisors = () =>
  useQuery({
    queryKey: ["cms", "advisors"],
    queryFn: async () => {
      const raw = await sanityFetch<any[]>(advisorsQuery);
      return raw ?? [];
    },
    staleTime: staleTimeMs,
  });

export const useAlumniCompanies = () =>
  useQuery({
    queryKey: ["cms", "alumniCompanies"],
    queryFn: async () => {
      const raw = await sanityFetch<any[]>(alumniCompaniesQuery);
      return raw ?? [];
    },
    staleTime: staleTimeMs,
  });
