import {globalSettings} from './documents/globalSettings'
import {siteSettings} from './documents/siteSettings'
import {navigation} from './documents/navigation'
import {homePage} from './documents/homePage'
import {aboutPage} from './documents/aboutPage'
import {careersPage} from './documents/careersPage'
import {faqPage} from './documents/faqPage'
import {programsLandingPage} from './documents/programsLandingPage'
import {eventsLandingPage} from './documents/eventsLandingPage'
import {contactPage} from './documents/contactPage'
import {programPage} from './documents/programPage'
import {notFoundPage} from './documents/notFoundPage'
import {marketingPage} from './documents/marketingPage'
import {paymentPage} from './documents/paymentPage'
import {page} from './documents/page'
import {advisor} from './documents/advisor'
import {founder} from './documents/founder'
import {investor} from './documents/investor'
import {industryPartner} from './documents/industryPartner'
import {alumniCompany} from './documents/alumniCompany'
import {program} from './documents/program'
import {event} from './documents/event'
import {story} from './documents/story'
import {storyFilter} from './documents/storyFilter'
import {storiesPage} from './documents/storiesPage'
import {advisorFilter} from './documents/advisorFilter'
import {founderLevel} from './documents/founderLevel'
import {founderSpecialty} from './documents/founderSpecialty'
import {directoryFilterGroup} from './documents/directoryFilterGroup'
import {networkFoundersPage} from './documents/networkFoundersPage'
import {networkAdvisorsPage} from './documents/networkAdvisorsPage'
import {networkInvestorsPage} from './documents/networkInvestorsPage'
import {networkPartnersPage} from './documents/networkPartnersPage'
import {consultingPage} from './documents/consultingPage'
import {bodyCtaBox} from './objects/bodyCtaBox'
import {portableImageCarousel} from './objects/portableImageCarousel'
import {seo} from './objects/seo'
import {navItem} from './objects/navItem'
import {portableRichText} from './objects/portableRichText'
import {portableText} from './objects/portableText'
import {linkAnnotation} from './objects/linkAnnotation'
import {socialLink} from './objects/socialLink'
import {themeColors} from './objects/themeColors'
import {ctaButton} from './objects/ctaButton'
import {inlineHeroHeadline} from './objects/inlineHeroHeadline'
import {
  pageBuilder,
  heroSection,
  featuresSection,
  contentSection,
  carouselSection,
  testimonialSection,
} from './objects/pageBuilder'
import {sectionHero} from './objects/sectionHero'
import {sectionRichText} from './objects/sectionRichText'
import {sectionCardsGrid} from './objects/sectionCardsGrid'
import {sectionEligibilityBento} from './objects/sectionEligibilityBento'
import {sectionFeatureGrid} from './objects/sectionFeatureGrid'
import {sectionEngageBand} from './objects/sectionEngageBand'
import {sectionJourneyTimeline} from './objects/sectionJourneyTimeline'
import {sectionDiagnosticSurvey} from './objects/sectionDiagnosticSurvey'

export const schemaTypes = [
  // Singletons & globals
  globalSettings,
  siteSettings,
  navigation,
  homePage,
  aboutPage,
  careersPage,
  faqPage,
  programsLandingPage,
  eventsLandingPage,
  contactPage,
  programPage,
  notFoundPage,
  marketingPage,
  paymentPage,
  page,
  networkFoundersPage,
  networkAdvisorsPage,
  networkInvestorsPage,
  networkPartnersPage,
  consultingPage,
  // Collections
  advisor,
  founder,
  investor,
  industryPartner,
  alumniCompany,
  program,
  event,
  story,
  storyFilter,
  storiesPage,
  advisorFilter,
  founderLevel,
  founderSpecialty,
  directoryFilterGroup,
  // Objects & sections
  bodyCtaBox,
  portableImageCarousel,
  seo,
  navItem,
  linkAnnotation,
  socialLink,
  themeColors,
  ctaButton,
  portableText,
  portableRichText,
  inlineHeroHeadline,
  heroSection,
  featuresSection,
  contentSection,
  carouselSection,
  testimonialSection,
  pageBuilder,
  sectionHero,
  sectionRichText,
  sectionCardsGrid,
  sectionEligibilityBento,
  sectionFeatureGrid,
  sectionEngageBand,
  sectionJourneyTimeline,
  sectionDiagnosticSurvey,
]
