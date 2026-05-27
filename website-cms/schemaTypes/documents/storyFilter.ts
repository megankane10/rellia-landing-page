import {defineField, defineType} from 'sanity'
import {studioListMedia} from '../shared/studioListMedia'

export const storyFilter = defineType({
  name: 'storyFilter',
  title: 'Story filter',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Optional sort order for filter UI (lower shows first).',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
    prepare({title, subtitle}) {
      return {
        title: title || 'Story filter',
        subtitle,
        media: studioListMedia.tag,
      }
    },
  },
})

