import {defineField, defineType} from 'sanity'

export const advisor = defineType({
  name: 'advisor',
  title: 'Advisor',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'organization', type: 'string'}),
    defineField({name: 'role', type: 'string'}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'country', type: 'string'}),
    defineField({name: 'yearJoined', type: 'string', description: 'e.g. 2024'}),
    defineField({
      name: 'industries',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'focus', type: 'string', description: 'Short card summary'}),
    defineField({
      name: 'filter',
      type: 'string',
      description: 'Directory filter label (e.g. Clinical, Regulatory)',
    }),
    defineField({name: 'photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'photoSrc', type: 'string', description: 'Fallback URL if no upload'}),
    defineField({name: 'linkedInUrl', type: 'url'}),
    defineField({name: 'websiteUrl', type: 'url'}),
    defineField({name: 'bio', type: 'text', rows: 6}),
    defineField({name: 'mentoringStyle', type: 'text', rows: 4}),
    defineField({
      name: 'highlights',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
})
