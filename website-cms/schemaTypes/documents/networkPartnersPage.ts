import {defineArrayMember, defineField, defineType} from 'sanity'

export const networkPartnersPage = defineType({
  name: 'networkPartnersPage',
  title: 'Network — Industry Partners page (/industry-partners)',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Industry Partners'}),
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

