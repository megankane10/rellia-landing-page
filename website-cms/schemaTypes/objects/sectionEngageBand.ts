import {defineArrayMember, defineField, defineType} from 'sanity'

export const sectionEngageBand = defineType({
  name: 'sectionEngageBand',
  title: 'Network: Engage Band (Teal)',
  type: 'object',
  fields: [
    defineField({name: 'badge', type: 'string'}),
    defineField({name: 'title', type: 'portableRichText'}),
    defineField({name: 'subtitle', type: 'portableRichText'}),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'item',
          fields: [
            defineField({name: 'icon', type: 'string'}),
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'body', type: 'text', rows: 3}),
            defineField({name: 'link', type: 'navItem'}),
          ],
        }),
      ],
    }),
  ],
})
