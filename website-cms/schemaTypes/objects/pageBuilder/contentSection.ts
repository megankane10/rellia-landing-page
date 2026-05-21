import {defineField, defineType} from 'sanity'

export const contentSection = defineType({
  name: 'contentSection',
  title: 'Content',
  type: 'object',
  fields: [
    defineField({name: 'internalLabel', title: 'Internal label', type: 'string'}),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Full width', value: 'full'},
          {title: 'Two columns', value: 'twoColumn'},
        ],
      },
      initialValue: 'full',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
    }),
    defineField({
      name: 'secondaryBody',
      title: 'Secondary column body',
      type: 'portableText',
      description: 'Used when layout is two columns.',
      hidden: ({parent}) => parent?.layout !== 'twoColumn',
    }),
    defineField({
      name: 'image',
      title: 'Supporting image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.layout !== 'twoColumn',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt text',
      type: 'string',
      hidden: ({parent}) => parent?.layout !== 'twoColumn',
    }),
  ],
  preview: {
    select: {heading: 'heading', layout: 'layout'},
    prepare({heading, layout}) {
      return {title: heading || 'Content', subtitle: layout === 'twoColumn' ? 'Two columns' : 'Full width'}
    },
  },
})
