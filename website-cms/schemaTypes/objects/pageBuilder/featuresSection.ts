import {defineArrayMember, defineField, defineType} from 'sanity'

export const featuresSection = defineType({
  name: 'featuresSection',
  title: 'Features grid',
  type: 'object',
  fields: [
    defineField({name: 'internalLabel', title: 'Internal label', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Section description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: '2 columns', value: '2'},
          {title: '3 columns', value: '3'},
          {title: '4 columns', value: '4'},
        ],
      },
      initialValue: '3',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featureItem',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                layout: 'dropdown',
                list: [
                  {title: 'Sparkles', value: 'sparkles'},
                  {title: 'Users', value: 'users'},
                  {title: 'Shield', value: 'shield'},
                  {title: 'Chart', value: 'chart'},
                  {title: 'Heart', value: 'heart'},
                  {title: 'Zap', value: 'zap'},
                ],
              },
            }),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
          ],
          preview: {
            select: {title: 'title'},
            prepare({title}) {
              return {title: title || 'Feature'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Features', subtitle: 'Features grid'}
    },
  },
})
