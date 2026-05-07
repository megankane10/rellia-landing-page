import {defineField, defineType} from 'sanity'

export const founderLevel = defineType({
  name: 'founderLevel',
  title: 'Founder level',
  type: 'document',
  description:
    'Stage tags for alumni companies (e.g. Pre-seed, Seed, Series A). Add new options here; companies reference them.',
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
  },
})
