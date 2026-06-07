import {defineArrayMember} from 'sanity'

/** Modular page sections — prefer site-matched blocks; legacy types kept for existing content. */
export const pageSectionMembers = [
  defineArrayMember({type: 'sectionMarketingHero'}),
  defineArrayMember({type: 'sectionMetrics'}),
  defineArrayMember({type: 'sectionFaq'}),
  defineArrayMember({type: 'sectionFormEmbed'}),
  defineArrayMember({type: 'sectionRichText'}),
  defineArrayMember({type: 'sectionCardsGrid'}),
  defineArrayMember({type: 'sectionFeatureGrid'}),
  defineArrayMember({type: 'sectionEngageBand'}),
  defineArrayMember({type: 'sectionEligibilityBento'}),
  defineArrayMember({type: 'sectionJourneyTimeline'}),
  defineArrayMember({type: 'sectionDiagnosticSurvey'}),
  defineArrayMember({type: 'sectionRelliaCta'}),
  defineArrayMember({type: 'sectionTestimonials'}),
]
