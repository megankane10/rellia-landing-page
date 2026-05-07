import {defineField, defineType} from 'sanity'

export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation item',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'href',
      type: 'string',
      description: 'Site path (e.g. /about) or full https URL',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'description', type: 'string'}),
    defineField({
      name: 'badge',
      type: 'string',
      description: 'Optional small label (e.g. New, Waitlist).',
    }),
    defineField({
      name: 'children',
      type: 'array',
      of: [{type: 'navItem'}],
      description: 'Optional nested menu items.',
    }),
  ],
})
