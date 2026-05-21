import {defineArrayMember, defineField, defineType} from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'internalLabel', title: 'Internal label', type: 'string', description: 'Editor-only — not shown on site'}),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'backgroundMedia',
      title: 'Background media',
      type: 'object',
      options: {columns: 2},
      fields: [
        defineField({
          name: 'image',
          title: 'Background image',
          type: 'image',
          options: {hotspot: true},
        }),
        defineField({
          name: 'video',
          title: 'Background video',
          type: 'file',
          options: {accept: 'video/*'},
        }),
        defineField({
          name: 'videoUrl',
          title: 'Video URL (fallback)',
          type: 'string',
          description: 'Site path or https URL when no file is uploaded.',
        }),
      ],
    }),
    defineField({
      name: 'ctas',
      title: 'Call-to-action buttons',
      type: 'array',
      of: [defineArrayMember({type: 'ctaButton'})],
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: {
    select: {title: 'title', media: 'backgroundMedia.image'},
    prepare({title, media}) {
      return {title: title || 'Hero', subtitle: 'Hero section', media}
    },
  },
})
