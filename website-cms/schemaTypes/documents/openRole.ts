import {defineArrayMember, defineField, defineType} from 'sanity'

export const openRole = defineType({
  name: 'openRole',
  title: 'Open role',
  type: 'document',
  fields: [
    defineField({
      name: 'roleId',
      title: 'URL anchor ID',
      type: 'slug',
      description: 'Used in /careers#role-id — lowercase letters, numbers, hyphens only.',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'title', title: 'Job title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'location', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'description', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
    defineField({
      name: 'responsibilities',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'linkedInApplyUrl',
      title: 'Apply URL (LinkedIn or other)',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrderAsc', by: [{field: 'sortOrder', direction: 'asc'}]},
    {title: 'Title', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'location'},
  },
})
