import {defineArrayMember, defineField, defineType} from 'sanity'

export const networkFoundersPage = defineType({
  name: 'networkFoundersPage',
  title: 'Network — Founders page (/founders)',
  type: 'document',
  groups: [
    {name: 'content', title: 'Page content', default: true},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Founders',
      group: 'content',
    }),
    defineField({
      name: 'useModularPage',
      title: 'Use modular CMS layout',
      type: 'boolean',
      initialValue: false,
      description:
        'When enabled, the site renders the modular section stack below. When off (default), visitors see the full designed Founders marketing page. SEO below still applies in both modes.',
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Modular sections',
      description:
        'Drag blocks to change order. Each block is a page section. Empty this list or turn off “Use modular CMS layout” to use the full marketing page.',
      type: 'array',
      group: 'content',
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
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
})
