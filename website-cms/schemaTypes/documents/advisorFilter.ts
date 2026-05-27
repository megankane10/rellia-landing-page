import {defineField, defineType} from 'sanity'
import {studioListMedia} from '../shared/studioListMedia'

export const advisorFilter = defineType({
  name: 'advisorFilter',
  title: 'Advisor filter (tag)',
  type: 'document',
  description:
    'Tags shown as filter chips on the Advisors directory (e.g. Clinical, Regulatory). Add new ones here; advisors reference them.',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'label', maxLength: 50},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first in the filter dropdown.',
    }),
  ],
  orderings: [
    {
      title: 'Sort order',
      name: 'sortOrderAsc',
      by: [
        {field: 'sortOrder', direction: 'asc'},
        {field: 'label', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'label', subtitle: 'slug.current'},
    prepare({title, subtitle}) {
      return {
        title: title || 'Advisor filter',
        subtitle,
        media: studioListMedia.tag,
      }
    },
  },
})
