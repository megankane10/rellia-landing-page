import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'
import {headingToneField, lucideIconField, showBadgeField} from '../shared/sectionAppearanceFields'

export const sectionEngageBand = defineType({
  name: 'sectionEngageBand',
  title: 'Engage band',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    showBadgeField,
    defineField({name: 'badge', type: 'string'}),
    headingToneField,
    defineField({name: 'title', type: 'portableRichText'}),
    defineField({name: 'subtitle', type: 'portableRichText'}),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'item',
          fields: [
            lucideIconField('Shown above the card title. Leave empty to hide.'),
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'body', type: 'text', rows: 3}),
            defineField({name: 'link', type: 'navItem'}),
          ],
        }),
      ],
    }),
  ],
  preview: sectionListPreview({typeLabel: 'Engage band', fallback: 'Engage band'}),
})
