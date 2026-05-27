import {defineField, defineType} from 'sanity'
import {studioListMedia} from '../shared/studioListMedia'

export const founderSpecialty = defineType({
  name: 'founderSpecialty',
  title: 'Founder specialty',
  type: 'document',
  description:
    'Specialty tags for alumni companies (e.g. Women\u2019s Health, Neurology). Add or rename here; companies reference them.',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'label', maxLength: 80},
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
        title: title || 'Founder specialty',
        subtitle,
        media: studioListMedia.tag,
      }
    },
  },
})
