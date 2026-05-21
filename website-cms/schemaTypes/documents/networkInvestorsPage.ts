import {defineArrayMember, defineField, defineType} from 'sanity'

export const networkInvestorsPage = defineType({
  name: 'networkInvestorsPage',
  title: 'Network — Investors page (/investors)',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Investors',
      group: 'content',
    }),
    defineField({
      name: 'logoMarquee',
      title: 'Logo scroll',
      type: 'array',
      description: 'Logos shown in the investor page marquee. Falls back to built-in placeholders when empty.',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'investorLogo',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'href', title: 'Link (optional)', type: 'url'}),
          ],
          preview: {
            select: {title: 'name', media: 'logo'},
          },
        }),
      ],
    }),
    defineField({
      name: 'useModularPage',
      title: 'Use modular CMS layout',
      type: 'boolean',
      initialValue: false,
      description:
        'When enabled, the site renders the modular section stack below. When off (default), visitors see the full designed Investors marketing page.',
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Modular sections',
      description:
        'Drag blocks to reorder. Empty or disable modular layout to use the full marketing page.',
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
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
      fieldset: 'seo',
    }),
  ],
})
