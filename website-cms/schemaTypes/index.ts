import {globalSettings} from './documents/globalSettings'
import {siteSettings} from './documents/siteSettings'
import {navigation} from './documents/navigation'
import {homePage} from './documents/homePage'
import {aboutPage} from './documents/aboutPage'
import {careersPage} from './documents/careersPage'
import {openRole} from './documents/openRole'
import {faqPage} from './documents/faqPage'
import {programsLandingPage} from './documents/programsLandingPage'
import {programsLayoutPage} from './documents/programsLayoutPage'
import {eventsLandingPage} from './documents/eventsLandingPage'
import {contactPage} from './documents/contactPage'
import {notFoundPage} from './documents/notFoundPage'
import {paymentPage} from './documents/paymentPage'
import {applyPage} from './documents/applyPage'
import {diagnosticSurveyContent} from './documents/diagnosticSurveyContent'
import {page} from './documents/page'
import {advisor} from './documents/advisor'
import {alumniCompany} from './documents/alumniCompany'
import {program} from './documents/program'
import {event} from './documents/event'
import {story} from './documents/story'
import {storyFilter} from './documents/storyFilter'
import {storiesPage} from './documents/storiesPage'
import {directoryFilterGroup} from './documents/directoryFilterGroup'
import {networkFoundersPage} from './documents/networkFoundersPage'
import {networkAdvisorsPage} from './documents/networkAdvisorsPage'
import {networkInvestorsPage} from './documents/networkInvestorsPage'
import {networkPartnersPage} from './documents/networkPartnersPage'
import {
  networkAlumniDirectoryPage,
  networkAdvisorsDirectoryPage,
} from './documents/networkDirectoryPages'
import {consultingPage} from './documents/consultingPage'
import {diagnosticLandingPage} from './documents/diagnosticLandingPage'
import {termsPage} from './documents/termsPage'
import {privacyPage} from './documents/privacyPage'
import {bodyCtaBox} from './objects/bodyCtaBox'
import {portableQuoteBox} from './objects/portableQuoteBox'
import {portableImageCarousel} from './objects/portableImageCarousel'
import {logoMarqueeItem} from './objects/logoMarqueeItem'
import {siteDefaultSeo} from './objects/siteDefaultSeo'
import {studioGuide} from './documents/studioGuide'
import {navItem} from './objects/navItem'
import {portableRichText} from './objects/portableRichText'
import {portableText} from './objects/portableText'
import {linkAnnotation} from './objects/linkAnnotation'
import {socialLink} from './objects/socialLink'
import {themeColors} from './objects/themeColors'
import {ctaButton} from './objects/ctaButton'
import {builderCtaAction} from './objects/builderCtaAction'
import {customLinkButton} from './objects/customLinkButton'
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
import {sectionFaq} from './objects/sectionFaq'
import {sectionMarketingHero} from './objects/sectionMarketingHero'
import {sectionMetrics} from './objects/sectionMetrics'
import {sectionFormEmbed} from './objects/sectionFormEmbed'
import {sectionRelliaCta} from './objects/sectionRelliaCta'
import {sectionTestimonials} from './objects/sectionTestimonials'
import {landingTestimonialItem} from './objects/landingTestimonialItem'
import {aboutTeamMember} from './objects/aboutTeamMember'
import {programTimelineStep, programTimelineWeek} from './objects/programTimelineStep'

export const schemaTypes = [
  // Singletons & globals
  globalSettings,
  siteSettings,
  navigation,
  homePage,
  aboutPage,
  careersPage,
  openRole,
  faqPage,
  programsLandingPage,
  programsLayoutPage,
  eventsLandingPage,
  contactPage,
  notFoundPage,
  paymentPage,
  applyPage,
  diagnosticSurveyContent,
  page,
  networkFoundersPage,
  networkAdvisorsPage,
  networkInvestorsPage,
  networkPartnersPage,
  networkAlumniDirectoryPage,
  networkAdvisorsDirectoryPage,
  consultingPage,
  diagnosticLandingPage,
  termsPage,
  privacyPage,
  studioGuide,
  // Collections
  advisor,
  alumniCompany,
  program,
  event,
  story,
  storyFilter,
  storiesPage,
  directoryFilterGroup,
  // Objects & sections
  bodyCtaBox,
  portableQuoteBox,
  portableImageCarousel,
  logoMarqueeItem,
  siteDefaultSeo,
  navItem,
  linkAnnotation,
  socialLink,
  themeColors,
  ctaButton,
  builderCtaAction,
  customLinkButton,
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
  sectionFaq,
  sectionMarketingHero,
  sectionMetrics,
  sectionFormEmbed,
  sectionRelliaCta,
  sectionTestimonials,
  landingTestimonialItem,
  aboutTeamMember,
  programTimelineWeek,
  programTimelineStep,
]
