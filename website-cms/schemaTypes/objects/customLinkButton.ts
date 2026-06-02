import {defineField, defineType} from 'sanity'

/** Optional third CTA on event detail pages (besides Luma and Add to Calendar). */
export const customLinkButton = defineType({
  name: 'customLinkButton',
  title: 'Custom link button',
  type: 'object',
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Button label',
      type: 'string',
      validation: (Rule) => Rule.required().max(48),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {buttonText: 'buttonText', url: 'url'},
    prepare({buttonText, url}) {
      return {title: buttonText || 'Custom link', subtitle: url}
    },
  },
})
