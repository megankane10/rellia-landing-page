import {defineDocuments, defineLocations} from 'sanity/presentation'

/** Resolve iframe URLs → primary editable CMS documents (Presentation navigator). */
export const presentationMainDocuments = defineDocuments([
  {route: '/', type: 'homePage'},
  {route: '/about', type: 'aboutPage'},
  {route: '/faq', type: 'faqPage'},
  {route: '/careers', type: 'careersPage'},
  {route: '/programs', type: 'programsLandingPage'},
  {route: '/events', type: 'eventsLandingPage'},
  {route: '/contact', type: 'contactPage'},
  {route: '/membership', type: 'paymentPage'},
  {route: '/consulting', type: 'consultingPage'},
  {route: '/stories', type: 'storiesPage'},
  {route: '/founders', type: 'networkFoundersPage'},
  {route: '/advisors', type: 'networkAdvisorsPage'},
  {route: '/investors', type: 'networkInvestorsPage'},
  {route: '/industry-partners', type: 'networkPartnersPage'},
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
      `_type == "programPage" && slug.current == "${ctx.params.slug ?? ''}"`,
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
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Programs', href: '/programs'}],
    }),
  }),
  eventsLandingPage: defineLocations({
    select: {heroTitle: 'heroTitle', heroTitleAccent: 'heroTitleAccent'},
    resolve: (doc) => {
      const lead = typeof doc?.heroTitle === 'string' ? doc.heroTitle.trim() : ''
      const accent = typeof doc?.heroTitleAccent === 'string' ? doc.heroTitleAccent.trim() : ''
      const label = [lead, accent].filter(Boolean).join(' ') || 'Events'
      return {
        locations: [{title: label, href: '/events'}],
      }
    },
  }),
  contactPage: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Contact', href: '/contact'}],
    }),
  }),
  paymentPage: defineLocations({
    select: {headline: 'headline'},
    resolve: (doc) => ({
      locations: [{title: doc?.headline || 'Membership', href: '/membership'}],
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
    select: {headline: 'headline', headlineAccent: 'headlineAccent'},
    resolve: (doc) => {
      const lead = typeof doc?.headline === 'string' ? doc.headline.trim() : ''
      const accent = typeof doc?.headlineAccent === 'string' ? doc.headlineAccent.trim() : ''
      const label = [lead, accent].filter(Boolean).join(' ') || 'Stories'
      return {
        locations: [{title: label, href: '/stories'}],
      }
    },
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
  programPage: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug.trim() : ''
      if (!slug) return {message: 'Add a slug to preview this program page.', tone: 'caution'}
      return {
        locations: [{title: doc?.title || 'Program', href: `/programs/${slug}`}],
      }
    },
  }),
  page: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug.trim() : ''
      if (!slug) return {message: 'Add a slug for this modular page.', tone: 'caution'}
      return {
        locations: [{title: doc?.title || 'Page', href: `/${slug}`}],
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
}
