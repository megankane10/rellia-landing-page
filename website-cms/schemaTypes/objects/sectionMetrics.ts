import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'
import {showBadgeField} from '../shared/sectionAppearanceFields'

/** Page-builder metrics — white band with stats and optional side image. */
export const sectionMetrics = defineType({
  name: 'sectionMetrics',
  title: 'Metrics band block',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    showBadgeField,
    defineField({
      name: 'badgeLabel',
      title: 'Badge label',
      type: 'string',
      initialValue: 'Network impact',
      hidden: ({parent}) => parent?.showBadge === false,
    }),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'subheading', title: 'Subheading', type: 'text', rows: 3}),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      validation: (Rule) => Rule.min(1).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metric',
          fields: [
            defineField({name: 'label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'value', type: 'number', validation: (Rule) => Rule.required().min(0)}),
            defineField({name: 'suffix', type: 'string', description: 'Optional suffix after the number (e.g. +).'}),
          ],
          preview: {
            select: {title: 'label', value: 'value', suffix: 'suffix'},
            prepare({title, value, suffix}) {
              return {title: title || 'Metric', subtitle: `${value ?? 0}${suffix ?? ''}`}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Side image',
      type: 'image',
      options: {hotspot: true},
      description: 'Optional image shown in a box on the right.',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Side image URL (fallback)',
      type: 'string',
    }),
    defineField({name: 'imageAlt', title: 'Side image alt text', type: 'string'}),
  ],
  preview: sectionListPreview({typeLabel: 'Metrics band', fallback: 'Metrics'}),
})
