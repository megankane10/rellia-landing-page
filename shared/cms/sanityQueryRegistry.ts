import { z } from "zod"
import * as G from "./groqQueries"

const empty = z.object({}).strict()

const slugParams = z
  .object({
    slug: z.string().trim().min(1).max(200),
  })
  .strict()

/**
 * Whitelisted Sanity reads: server only executes these GROQ strings.
 * Client sends `queryId` + validated params — never raw GROQ.
 */
export const SANITY_QUERY_WHITELIST = {
  globalSettings: { query: G.globalSettingsQuery, params: empty },
  navigation: { query: G.navigationQuery, params: empty },
  siteSettings: { query: G.siteSettingsQuery, params: empty },
  featuredStories: { query: G.featuredStoriesQuery, params: empty },
  stories: { query: G.storiesQuery, params: empty },
  storiesPage: { query: G.storiesPageQuery, params: empty },
  storyBySlug: { query: G.storyBySlugQuery, params: slugParams },
  pageBySlug: { query: G.pageBySlugQuery, params: slugParams },
  networkFoundersPage: { query: G.networkFoundersPageQuery, params: empty },
  networkAdvisorsPage: { query: G.networkAdvisorsPageQuery, params: empty },
  networkInvestorsPage: { query: G.networkInvestorsPageQuery, params: empty },
  networkPartnersPage: { query: G.networkPartnersPageQuery, params: empty },
  homePage: { query: G.homePageQuery, params: empty },
  aboutPage: { query: G.aboutPageQuery, params: empty },
  faqPage: { query: G.faqPageQuery, params: empty },
  programsLanding: { query: G.programsLandingQuery, params: empty },
  eventsLanding: { query: G.eventsLandingQuery, params: empty },
  programs: { query: G.programsQuery, params: empty },
  programBySlug: { query: G.programBySlugQuery, params: slugParams },
  events: { query: G.eventsQuery, params: empty },
  eventBySlug: { query: G.eventBySlugQuery, params: slugParams },
  programPageBySlug: { query: G.programPageBySlugQuery, params: slugParams },
  contactPage: { query: G.contactPageQuery, params: empty },
  notFound: { query: G.notFoundQuery, params: empty },
  paymentPage: { query: G.paymentPageQuery, params: empty },
  careersPage: { query: G.careersPageQuery, params: empty },
  marketingPageBySlug: { query: G.marketingPageBySlugQuery, params: slugParams },
  advisors: { query: G.advisorsQuery, params: empty },
  alumniCompanies: { query: G.alumniCompaniesQuery, params: empty },
  advisorFilters: { query: G.advisorFiltersQuery, params: empty },
  founderLevels: { query: G.founderLevelsQuery, params: empty },
  founderSpecialties: { query: G.founderSpecialtiesQuery, params: empty },
  directoryFilterGroups: { query: G.directoryFilterGroupsQuery, params: empty },
} as const

export type SanityQueryId = keyof typeof SANITY_QUERY_WHITELIST

export const isSanityQueryId = (value: string): value is SanityQueryId =>
  Object.prototype.hasOwnProperty.call(SANITY_QUERY_WHITELIST, value)
