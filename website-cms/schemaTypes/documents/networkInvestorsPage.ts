import {defineArrayMember, defineField, defineType} from 'sanity'

export const networkInvestorsPage = defineType({
  name: 'networkInvestorsPage',
  title: 'Network — Investors page (/investors)',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Investors'}),
    defineField({name: 'seo', type: 'seo'}),
    defineField({
      name: 'sections',
      type: 'array',
      of: [
        defineArrayMember({type: 'sectionHero'}),
        defineArrayMember({type: 'sectionRichText'}),
        defineArrayMember({type: 'sectionCardsGrid'}),
        defineArrayMember({type: 'sectionEligibilityBento'}),
        defineArrayMember({type: 'sectionFeatureGrid'}),
        defineArrayMember({type: 'sectionEngageBand'}),
        defineArrayMember({type: 'sectionJourneyTimeline'}),
        defineArrayMember({type: 'sectionDiagnosticSurvey'}),
      ],
    }),
  ],
})

