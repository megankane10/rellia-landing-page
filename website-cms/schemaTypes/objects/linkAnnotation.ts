import {defineField, defineType} from 'sanity'

/** Internal / external link annotation for portable text */
export const linkAnnotation = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description: 'Relative path (/programs) or absolute https:// URL.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value || typeof value !== 'string') return 'URL is required'
          if (value.startsWith('/')) return true
          try {
            const u = new URL(value)
            return ['http:', 'https:', 'mailto:', 'tel:'].includes(u.protocol) ? true : 'Invalid protocol'
          } catch {
            return 'Enter a valid URL or path starting with /'
          }
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'nofollow',
      title: 'nofollow',
      type: 'boolean',
      description: 'Adds rel="nofollow" for SEO when linking externally.',
      initialValue: false,
    }),
  ],
})
