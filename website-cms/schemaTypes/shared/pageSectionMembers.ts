import {defineArrayMember} from 'sanity'

/** Modular page sections available on custom pages and program detail pages. */
export const pageSectionMembers = [
  defineArrayMember({type: 'sectionHero'}),
  defineArrayMember({type: 'sectionRichText'}),
  defineArrayMember({type: 'sectionCardsGrid'}),
  defineArrayMember({type: 'sectionFeatureGrid'}),
  defineArrayMember({type: 'sectionEngageBand'}),
  defineArrayMember({type: 'sectionEligibilityBento'}),
  defineArrayMember({type: 'sectionJourneyTimeline'}),
  defineArrayMember({type: 'sectionDiagnosticSurvey'}),
]
