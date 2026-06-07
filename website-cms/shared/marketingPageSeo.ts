/** Marketing singleton routes for SEO Health dashboard + SERP preview prefixes. */
export const MARKETING_PAGE_SEO_TYPES = [
  'homePage',
  'aboutPage',
  'faqPage',
  'careersPage',
  'contactPage',
  'applyPage',
  'paymentPage',
  'programsLandingPage',
  'eventsLandingPage',
  'storiesPage',
  'networkFoundersPage',
  'networkAdvisorsPage',
  'networkInvestorsPage',
  'networkPartnersPage',
  'consultingPage',
  'diagnosticLandingPage',
] as const

export type MarketingPageSeoType = (typeof MARKETING_PAGE_SEO_TYPES)[number]

export const MARKETING_PAGE_ROUTE_PREFIX: Record<MarketingPageSeoType, string> = {
  homePage: '',
  aboutPage: 'about',
  faqPage: 'faq',
  careersPage: 'careers',
  contactPage: 'contact',
  applyPage: 'apply',
  paymentPage: 'membership',
  programsLandingPage: 'programs',
  eventsLandingPage: 'events',
  storiesPage: 'stories',
  networkFoundersPage: 'founders',
  networkAdvisorsPage: 'advisors',
  networkInvestorsPage: 'investors',
  networkPartnersPage: 'industry-partners',
  consultingPage: 'consulting',
  diagnosticLandingPage: 'startup-diagnostic',
}

export const MARKETING_PAGE_DISPLAY_LABEL: Record<MarketingPageSeoType, string> = {
  homePage: 'Home',
  aboutPage: 'About',
  faqPage: 'FAQ',
  careersPage: 'Careers',
  contactPage: 'Contact',
  applyPage: 'Apply',
  paymentPage: 'Membership',
  programsLandingPage: 'Programs',
  eventsLandingPage: 'Events',
  storiesPage: 'Stories',
  networkFoundersPage: 'Founders',
  networkAdvisorsPage: 'Advisors',
  networkInvestorsPage: 'Investors',
  networkPartnersPage: 'Industry Partners',
  consultingPage: 'Consulting',
  diagnosticLandingPage: 'Startup diagnostic',
}

const marketingPageSeoTypesList = MARKETING_PAGE_SEO_TYPES.map((t) => `"${t}"`).join(', ')

export const marketingPageSeoGroq = `*[_type in [${marketingPageSeoTypesList}] && !(_id in path("drafts.**"))]{
  _id,
  _type,
  "title": coalesce(
    headlinePrefix,
    coalesce(heroHeadline, pageTitle),
    title,
    headingTitle,
    headline,
    pt::text(heroTitlePortable),
    pt::text(headlinePortable),
    "Marketing page"
  ),
  seo,
  _updatedAt,
  "sortKey": select(
    _type == "homePage" => 0,
    _type == "programsLandingPage" => 1,
    _type == "applyPage" => 2,
    _type == "networkFoundersPage" => 3,
    _type == "networkAdvisorsPage" => 4,
    _type == "networkInvestorsPage" => 5,
    _type == "networkPartnersPage" => 6,
    _type == "contactPage" => 7,
    99
  )
} | order(sortKey asc)`
