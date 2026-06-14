import {defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionHero = defineType({
  name: 'sectionHero',
  title: 'Section: Hero',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({
      name: 'tag',
      type: 'string',
      description: 'Optional internal tag for filtering/analytics.',
    }),
    defineField({
      name: 'badge',
      type: 'string',
      title: 'Section tag',
      description: 'Optional eyebrow pill above the headline (matches site hero / “Network impact” styling).',
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
    defineField({name: 'imageUrl', title: 'Background image URL (fallback)', type: 'string'}),
    defineField({name: 'imageAlt', type: 'string'}),
  ],
  preview: sectionListPreview({typeLabel: 'Hero', fallback: 'Hero'}),
})
