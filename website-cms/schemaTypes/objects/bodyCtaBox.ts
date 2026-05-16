import {defineField, defineType} from 'sanity'

/** Insert in article-style portable text (events, marketing pages, future story CMS). */
export const bodyCtaBox = defineType({
  name: 'bodyCtaBox',
  title: 'CTA box',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'text',
      title: 'Body',
      rows: 4,
    }),
    defineField({
      name: 'buttonLabel',
      type: 'string',
      title: 'Button label',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonHref',
      type: 'string',
      title: 'Button URL',
      description: 'Site path (e.g. /contact) or full https URL',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
