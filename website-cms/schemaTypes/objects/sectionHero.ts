import {defineField, defineType} from 'sanity'

export const sectionHero = defineType({
  name: 'sectionHero',
  title: 'Section: Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'tag',
      type: 'string',
      description: 'Optional internal tag for filtering/analytics.',
    }),
    defineField({
      name: 'badge',
      type: 'string',
      description: 'Optional pill/badge above the headline.',
    }),
    defineField({name: 'headline', type: 'portableRichText', validation: (Rule) => Rule.required()}),
    defineField({name: 'subheadline', type: 'portableRichText'}),
    defineField({
      name: 'primaryCta',
      type: 'navItem',
      title: 'Primary CTA',
    }),
    defineField({
      name: 'secondaryCta',
      type: 'navItem',
      title: 'Secondary CTA',
    }),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imageAlt', type: 'string'}),
  ],
})
