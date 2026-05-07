import {defineField, defineType} from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'primary',
      title: 'Primary navigation',
      type: 'array',
      of: [{type: 'navItem'}],
    }),
    defineField({
      name: 'footer',
      title: 'Footer navigation',
      type: 'array',
      of: [{type: 'navItem'}],
    }),
  ],
})
