import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionEligibilityBento = defineType({
  name: 'sectionEligibilityBento',
  title: 'Network: Eligibility Bento',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({name: 'badge', type: 'string'}),
    defineField({name: 'title', type: 'string', initialValue: 'Built for serious health tech teams'}),
    defineField({name: 'description', type: 'text', rows: 3}),
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
