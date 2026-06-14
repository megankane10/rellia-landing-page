import {defineArrayMember, defineField, defineType} from 'sanity'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'
import {showBadgeField} from '../shared/sectionAppearanceFields'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionEligibilityBento = defineType({
  name: 'sectionEligibilityBento',
  title: 'Eligibility bento block',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    showBadgeField,
    defineField({
      name: 'badge',
      title: 'Section tag',
      type: 'string',
      hidden: ({parent}) => parent?.showBadge === false,
    }),
    portableHeadlineField({
      name: 'headlinePortable',
      title: 'Section heading',
      initialValue: undefined,
    }),
    defineField({name: 'description', type: 'text', rows: 3, title: 'Section intro'}),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'item',
          fields: [
            defineField({name: 'text', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'pexelsQuery', type: 'string'}),
            defineField({name: 'image', type: 'image', options: {hotspot: true}}),
            defineField({name: 'imageUrl', title: 'Card image URL (fallback)', type: 'string'}),
          ],
        }),
      ],
    }),
  ],
  preview: sectionListPreview({typeLabel: 'Eligibility bento', fallback: 'Eligibility'}),
})
