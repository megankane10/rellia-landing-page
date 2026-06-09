import {defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'

/** Matches site marketing heroes (Consulting, network pages) — full-bleed teal + eyebrow. */
export const sectionMarketingHero = defineType({
  name: 'sectionMarketingHero',
  title: 'Marketing hero block',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({
      name: 'eyebrowLabel',
      title: 'Eyebrow label',
      type: 'string',
      description: 'Small pill above the headline (e.g. Consulting).',
    }),
    portableHeadlineField({name: 'headlinePortable', title: 'Headline', required: true}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3}),
    defineField({name: 'image', title: 'Background image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imageUrl', title: 'Background image URL (fallback)', type: 'string'}),
    defineField({name: 'imageAlt', type: 'string'}),
    defineField({name: 'primaryCta', title: 'Primary CTA', type: 'navItem'}),
    defineField({name: 'secondaryCta', title: 'Secondary CTA', type: 'navItem'}),
  ],
  preview: sectionListPreview({typeLabel: 'Hero with image', fallback: 'Hero'}),
})
