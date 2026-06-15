import {defineArrayMember} from 'sanity'

/**
 * Canonical modular section library — shared by custom `page` documents and every
 * pre-built page’s “Modular sections” / “Page sections” field (home, consulting,
 * events, programs, network pages, startup diagnostic, etc.).
 */
export const MODULAR_PAGE_SECTIONS_DESCRIPTION =
  'Stack modular blocks in any order. Same section library as pre-built pages (Home → Modular sections, Consulting, Events, Network, Startup diagnostic, and program extra sections).'

/** Modular page sections — prefer site-matched blocks; legacy types kept for existing content. */
export const pageSectionMembers = [
  defineArrayMember({type: 'sectionHero'}),
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
