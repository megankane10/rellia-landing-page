import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

/** Fillout embed — standalone form or split layout with supporting copy (like membership). */
export const sectionFormEmbed = defineType({
  name: 'sectionFormEmbed',
  title: 'Section: Form embed',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Standalone form', value: 'standalone'},
          {title: 'Split (info + form)', value: 'split'},
        ],
        layout: 'radio',
      },
      initialValue: 'standalone',
    }),
    defineField({
      name: 'filloutFormUrl',
      title: 'Fillout form URL',
      type: 'url',
      description: 'Full https://forms.fillout.com/t/… URL.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'panelHeadline',
      title: 'Side panel headline',
      type: 'string',
      hidden: ({parent}) => parent?.layout !== 'split',
    }),
    defineField({
      name: 'panelBody',
      title: 'Side panel body',
      type: 'text',
      rows: 4,
      hidden: ({parent}) => parent?.layout !== 'split',
    }),
    defineField({
      name: 'benefits',
      title: 'Side panel bullet list',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      hidden: ({parent}) => parent?.layout !== 'split',
    }),
    defineField({
      name: 'panelImage',
      title: 'Side panel background image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.layout !== 'split',
    }),
    defineField({
      name: 'panelImageUrl',
      title: 'Side panel image URL (fallback)',
      type: 'string',
      hidden: ({parent}) => parent?.layout !== 'split',
    }),
  ],
  preview: sectionListPreview({typeLabel: 'Form embed', fallback: 'Form embed'}),
})
