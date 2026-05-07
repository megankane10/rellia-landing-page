import {defineField, defineType} from 'sanity'

export const story = defineType({
  name: 'story',
  title: 'Story',
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
      name: 'filters',
      title: 'Filters',
      description: 'Pick one or more pre-set filters for this story.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'storyFilter'}]}],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published at',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary used on the Stories listing page.',
    }),
    defineField({
      name: 'headerImage',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'headerImageAlt',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Story content',
      description:
        'Rich content under the header. Supports headings, bullets, images, and carousels.',
      type: 'portableRichText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'headerImage',
      publishedAt: 'publishedAt',
    },
    prepare({title, media, publishedAt}) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Unpublished'
      return {title, subtitle: date, media}
    },
  },
})

