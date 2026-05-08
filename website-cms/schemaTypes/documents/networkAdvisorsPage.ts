import {defineArrayMember, defineField, defineType} from 'sanity'

export const networkAdvisorsPage = defineType({
  name: 'networkAdvisorsPage',
  title: 'Network — Advisors page (/advisors)',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Advisors'}),
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

