import {defineField, defineType} from 'sanity'

export const alumniCompany = defineType({
  name: 'alumniCompany',
  title: 'Alumni company',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'logo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'logoSrc', type: 'string', description: 'Fallback URL if no upload'}),
    defineField({name: 'tagline', type: 'string'}),
    defineField({
      name: 'specialties',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'level', type: 'string'}),
    defineField({name: 'shortDescription', type: 'text', rows: 3}),
    defineField({name: 'longDescription', type: 'text', rows: 6}),
    defineField({name: 'websiteUrl', type: 'url'}),
    defineField({name: 'linkedinUrl', type: 'url'}),
    defineField({name: 'traction', type: 'text', rows: 4}),
    defineField({name: 'relliaCollaboration', type: 'text', rows: 4}),
    defineField({name: 'country', type: 'string'}),
    defineField({name: 'yearJoined', type: 'number'}),
    defineField({
      name: 'founders',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'founderPerson',
          fields: [
            defineField({name: 'name', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'role', type: 'string'}),
            defineField({name: 'bio', type: 'text', rows: 3}),
            defineField({name: 'linkedinUrl', type: 'url'}),
            defineField({name: 'image', type: 'image', options: {hotspot: true}}),
            defineField({name: 'imageSrc', type: 'string'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'programs',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
})
