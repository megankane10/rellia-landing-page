import {defineField, defineType} from 'sanity'

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button label',
      type: 'string',
      validation: (Rule) => Rule.required().max(48),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Internal path (/apply) or full URL.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Primary (teal)', value: 'primary'},
          {title: 'Secondary (outline)', value: 'secondary'},
          {title: 'Text link', value: 'text'},
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {label: 'label', href: 'href'},
    prepare({label, href}) {
      return {title: label || 'CTA', subtitle: href}
    },
  },
})
