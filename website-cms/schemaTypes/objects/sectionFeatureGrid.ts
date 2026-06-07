import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'
import {
  headingToneField,
  sectionBackgroundField,
  showBadgeField,
} from '../shared/sectionAppearanceFields'

export const sectionFeatureGrid = defineType({
  name: 'sectionFeatureGrid',
  title: 'Feature grid block',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    showBadgeField,
    defineField({name: 'badge', type: 'string'}),
    headingToneField,
    sectionBackgroundField,
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
            defineField({name: 'icon', type: 'string', description: 'Lucide icon name (e.g. Users, Rocket, ShieldCheck)'}),
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'body', type: 'text', rows: 3}),
          ],
        }),
      ],
    }),
  ],
  preview: sectionListPreview({typeLabel: 'Text and icon grid', fallback: 'Features'}),
})
