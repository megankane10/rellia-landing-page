import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'
import {iconKeyField} from '../shared/iconKeyField'

export const sectionCardsGrid = defineType({
  name: 'sectionCardsGrid',
  title: 'Cards grid block',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({name: 'tag', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'subtitle', type: 'text', rows: 2}),
    defineField({
      name: 'cards',
      type: 'array',
      description:
        'Add as many cards as needed — the grid wraps responsively (1, 2, or 3 columns). Image, icon, badge, tags, and CTA are all optional per card.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'card',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'body', type: 'text', rows: 3}),
            iconKeyField({
              title: 'Icon (Lucide name)',
              description: 'Optional icon beside the title. Leave empty to hide.',
            }),
            defineField({
              name: 'badge',
              type: 'string',
              description: 'Optional pill label above the title; leave empty to hide.',
            }),
            defineField({name: 'image', type: 'image', options: {hotspot: true}}),
            defineField({name: 'imageUrl', title: 'Card image URL (fallback)', type: 'string'}),
            defineField({name: 'imageAlt', type: 'string'}),
            defineField({name: 'cta', type: 'navItem'}),
            defineField({
              name: 'tags',
              type: 'array',
              of: [{type: 'string'}],
              description: 'Simple per-card tags; used for UI chips and filtering.',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: sectionListPreview({typeLabel: 'Image grid', fallback: 'Image grid'}),
})
