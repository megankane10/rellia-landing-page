import {defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

/** Matches site marketing heroes (Consulting, network pages) — full-bleed teal + eyebrow. */
export const sectionMarketingHero = defineType({
  name: 'sectionMarketingHero',
  title: 'Hero with image',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({
      name: 'eyebrowLabel',
      title: 'Eyebrow label',
      type: 'string',
      description: 'Small pill above the headline (e.g. Consulting).',
    }),
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'accentPhrase',
      title: 'Accent phrase (mint)',
      type: 'string',
      description: 'Optional phrase rendered in mint inside the headline.',
    }),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3}),
    defineField({name: 'image', title: 'Background image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imageUrl', title: 'Background image URL (fallback)', type: 'string'}),
    defineField({name: 'imageAlt', type: 'string'}),
    defineField({name: 'primaryCta', title: 'Primary CTA', type: 'navItem'}),
    defineField({name: 'secondaryCta', title: 'Secondary CTA', type: 'navItem'}),
  ],
  preview: sectionListPreview({typeLabel: 'Hero with image', fallback: 'Hero'}),
})
