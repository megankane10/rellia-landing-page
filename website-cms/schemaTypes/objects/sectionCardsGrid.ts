import {defineArrayMember, defineField, defineType} from 'sanity'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'
import {sectionTagField, showSectionTagField} from '../shared/sectionAppearanceFields'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'
import {iconKeyField} from '../shared/iconKeyField'

export const sectionCardsGrid = defineType({
  name: 'sectionCardsGrid',
  title: 'Cards grid block',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    showSectionTagField,
    sectionTagField,
    portableHeadlineField({name: 'headlinePortable', title: 'Section heading'}),
    defineField({name: 'subtitle', type: 'text', rows: 2, title: 'Section intro'}),
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
              title: 'Card tag',
              description: 'Optional eyebrow pill above the card title (site pill styling).',
            }),
            defineField({name: 'image', type: 'image', options: {hotspot: true}}),
            defineField({name: 'imageUrl', title: 'Card image URL (fallback)', type: 'string'}),
            defineField({name: 'imageAlt', type: 'string'}),
            defineField({name: 'cta', type: 'navItem'}),
            defineField({
              name: 'tags',
              type: 'array',
              title: 'Card tags',
              of: [defineArrayMember({type: 'string'})],
              description: 'Optional pills shown above the card title (same styling as section eyebrow tags).',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: sectionListPreview({typeLabel: 'Image grid', fallback: 'Image grid'}),
})
