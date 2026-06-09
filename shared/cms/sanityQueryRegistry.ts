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
  diagnosticLandingPage: { query: G.diagnosticLandingPageQuery, params: empty },
  consultingPage: { query: G.consultingPageQuery, params: empty },
  termsPage: { query: G.termsPageQuery, params: empty },
  privacyPage: { query: G.privacyPageQuery, params: empty },
  homePage: { query: G.homePageQuery, params: empty },
  aboutPage: { query: G.aboutPageQuery, params: empty },
  faqPage: { query: G.faqPageQuery, params: empty },
  programsLanding: { query: G.programsLandingQuery, params: empty },
  programsLayoutPage: { query: G.programsLayoutPageQuery, params: empty },
  eventsLanding: { query: G.eventsLandingQuery, params: empty },
  programs: { query: G.programsQuery, params: empty },
  programBySlug: { query: G.programBySlugQuery, params: slugParams },
  events: { query: G.eventsQuery, params: empty },
  eventBySlug: { query: G.eventBySlugQuery, params: slugParams },
  contactPage: { query: G.contactPageQuery, params: empty },
  notFound: { query: G.notFoundQuery, params: empty },
  paymentPage: { query: G.paymentPageQuery, params: empty },
  applyPage: { query: G.applyPageQuery, params: empty },
  diagnosticSurveyContent: { query: G.diagnosticSurveyContentQuery, params: empty },
  careersPage: { query: G.careersPageQuery, params: empty },
  openRoles: { query: G.openRolesQuery, params: empty },
  advisors: { query: G.advisorsQuery, params: empty },
  alumniCompanies: { query: G.alumniCompaniesQuery, params: empty },
  directoryFilterGroups: { query: G.directoryFilterGroupsQuery, params: empty },
  sanityDrafts: { query: G.sanityDraftsQuery, params: empty },
  sanityRecentEdits: { query: G.sanityRecentEditsQuery, params: empty },
} as const

export type SanityQueryId = keyof typeof SANITY_QUERY_WHITELIST

export const isSanityQueryId = (value: string): value is SanityQueryId =>
  Object.prototype.hasOwnProperty.call(SANITY_QUERY_WHITELIST, value)
