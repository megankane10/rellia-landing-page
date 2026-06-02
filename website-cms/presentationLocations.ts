import {defineDocuments, defineLocations} from 'sanity/presentation'

const singletonDoc = (type: string) => `_type == "${type}" && _id == "${type}"`

/** Resolve iframe URLs → primary editable CMS documents (Presentation navigator). */
export const presentationMainDocuments = defineDocuments([
  {route: '/', filter: singletonDoc('homePage')},
  {route: '/about', filter: singletonDoc('aboutPage')},
  {route: '/faq', filter: singletonDoc('faqPage')},
  {route: '/careers', filter: singletonDoc('careersPage')},
  {route: '/programs', filter: singletonDoc('programsLandingPage')},
  {route: '/events', filter: singletonDoc('eventsLandingPage')},
  {route: '/contact', filter: singletonDoc('contactPage')},
  {route: '/apply', filter: singletonDoc('applyPage')},
  {route: '/membership', filter: singletonDoc('paymentPage')},
  {route: '/consulting', filter: singletonDoc('consultingPage')},
  {route: '/startup-diagnostic', filter: singletonDoc('diagnosticLandingPage')},
  {route: '/terms', filter: singletonDoc('termsPage')},
  {route: '/privacy', filter: singletonDoc('privacyPage')},
  {route: '/stories', filter: singletonDoc('storiesPage')},
  {route: '/founders', filter: singletonDoc('networkFoundersPage')},
  {route: '/advisors', filter: singletonDoc('networkAdvisorsPage')},
  {route: '/investors', filter: singletonDoc('networkInvestorsPage')},
  {route: '/industry-partners', filter: singletonDoc('networkPartnersPage')},
  {
    route: '/stories/:slug',
    filter: (ctx) =>
      `_type == "story" && slug.current == "${ctx.params.slug ?? ''}"`,
  },
  {
    route: '/events/:slug',
    filter: (ctx) =>
      `_type == "event" && slug.current == "${ctx.params.slug ?? ''}"`,
  },
  {
    route: '/programs/:slug',
    filter: (ctx) =>
      `_type == "program" && slug.current == "${ctx.params.slug ?? ''}"`,
  },
])

/** Studio → “Open preview” targets for each document type (click-to-preview + edit overlay). */
export const presentationLocations = {
  homePage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Home', href: '/'}],
    }),
  }),
  aboutPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'About', href: '/about'}],
    }),
  }),
  faqPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'FAQ', href: '/faq'}],
    }),
  }),
  careersPage: defineLocations({
    select: {defaultTab: 'defaultTab'},
    resolve: () => ({
      locations: [{title: 'Careers', href: '/careers'}],
    }),
  }),
  programsLandingPage: defineLocations({
    select: {heroTitlePortable: 'heroTitlePortable'},
    resolve: () => ({
      locations: [{title: 'Programs', href: '/programs'}],
    }),
  }),
  eventsLandingPage: defineLocations({
    select: {heroTitlePortable: 'heroTitlePortable'},
    resolve: () => ({
      locations: [{title: 'Events', href: '/events'}],
    }),
  }),
  contactPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Contact', href: '/contact'}],
    }),
  }),
  applyPage: defineLocations({
    select: {headingTitle: 'headingTitle'},
    resolve: (doc) => ({
      locations: [{title: doc?.headingTitle || 'Apply', href: '/apply'}],
    }),
  }),
  paymentPage: defineLocations({
    select: {headline: 'headline'},
    resolve: (doc) => ({
      locations: [{title: doc?.headline || 'Membership', href: '/membership'}],
    }),
  }),
  diagnosticSurveyContent: defineLocations({
    select: {},
    resolve: () => ({
      locations: [{title: 'Diagnostic survey', href: '/diagnostic-survey'}],
    }),
  }),
  consultingPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Consulting', href: '/consulting'}],
    }),
  }),
  notFoundPage: defineLocations({
    select: {title: 'title'},
    resolve: () => ({
      locations: [{title: 'Not found page', href: '/missing-page-preview'}],
    }),
  }),
  storiesPage: defineLocations({
    select: {headlinePortable: 'headlinePortable'},
    resolve: () => ({
      locations: [{title: 'Stories', href: '/stories'}],
    }),
  }),
  story: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug.trim() : ''
      if (!slug) return {message: 'Add a slug to preview this story.', tone: 'caution'}
      return {
        locations: [{title: doc?.title || 'Story', href: `/stories/${slug}`}],
      }
    },
  }),
  event: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug.trim() : ''
      if (!slug) return {message: 'Add a slug to preview this event.', tone: 'caution'}
      return {
        locations: [{title: doc?.title || 'Event', href: `/events/${slug}`}],
      }
    },
  }),
  program: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug.trim() : ''
      if (!slug) return {message: 'Add a slug to preview this program.', tone: 'caution'}
      return {
        locations: [{title: doc?.title || 'Program', href: `/programs/${slug}`}],
      }
    },
  }),
  networkFoundersPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Founders', href: '/founders'}],
    }),
  }),
  networkAdvisorsPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Advisors', href: '/advisors'}],
    }),
  }),
  networkInvestorsPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Investors', href: '/investors'}],
    }),
  }),
  networkPartnersPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Partners', href: '/industry-partners'}],
    }),
  }),
  diagnosticLandingPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Startup diagnostic', href: '/startup-diagnostic'}],
    }),
  }),
  termsPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Terms of use', href: '/terms'}],
    }),
  }),
  privacyPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Privacy policy', href: '/privacy'}],
    }),
  }),
}
