import {defineField, defineType} from 'sanity'
import {iconKeyField} from '../shared/iconKeyField'

/** Insert in article-style portable text (events, marketing pages, future story CMS). */
export const bodyCtaBox = defineType({
  name: 'bodyCtaBox',
  title: 'CTA box',
  type: 'object',
  fields: [
    iconKeyField({
      description:
        'Optional Lucide icon name (free text, PascalCase). Any icon from lucide.dev/icons works — e.g. Rocket, TrendingUp, ClipboardCheck.',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'text',
      title: 'Description',
      rows: 4,
      description: 'Optional supporting copy under the title (low-opacity white on the site).',
    }),
    defineField({
      name: 'buttonLabel',
      type: 'string',
      title: 'Primary button label',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonHref',
      type: 'string',
      title: 'Primary button URL',
      description: 'Site path (e.g. /contact) or full https URL',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryButtonLabel',
      type: 'string',
      title: 'Secondary button label',
      description: 'Optional second button (e.g. Programs + Events).',
    }),
    defineField({
      name: 'secondaryButtonHref',
      type: 'string',
      title: 'Secondary button URL',
    }),
  ],
  preview: {
    select: {title: 'title', buttonLabel: 'buttonLabel'},
    prepare({title, buttonLabel}) {
      return {
        title: title?.trim() || 'CTA box',
        subtitle: buttonLabel?.trim() || undefined,
      }
    },
  },
})
