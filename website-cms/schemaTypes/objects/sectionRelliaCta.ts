import {defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionRelliaCta = defineType({
  name: 'sectionRelliaCta',
  title: 'CTA band (grey-teal)',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      description: 'Plain headline text — all CTA titles use the same font weight.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Supporting text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary button',
      type: 'ctaButton',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary button (optional)',
      type: 'ctaButton',
    }),
    defineField({
      name: 'size',
      title: 'Headline size',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Compact', value: 'compact'},
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'primaryStyle',
      title: 'Primary action style',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Button', value: 'button'},
          {title: 'Text link', value: 'text'},
        ],
      },
      initialValue: 'button',
    }),
    defineField({
      name: 'aboveSectionTone',
      title: 'Gap above (match section above)',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'None', value: 'none'},
          {title: 'White section above', value: 'white'},
          {title: 'Grey-teal section above', value: 'grey'},
        ],
      },
      initialValue: 'white',
    }),
  ],
  preview: sectionListPreview({typeLabel: 'CTA band', fallback: 'Call to action'}),
})
