import {defineField, defineType} from 'sanity'

export const alumniCompany = defineType({
  name: 'alumniCompany',
  title: 'Founder company (alumni directory)',
  type: 'document',
  groups: [
    {name: 'profile', title: 'Profile', default: true},
    {name: 'directory', title: 'Directory filters'},
    {name: 'founders', title: 'Founders'},
    {name: 'links', title: 'Links'},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({name: 'name', title: 'Company name', type: 'string', validation: (Rule) => Rule.required(), group: 'profile'}),
    defineField({
      name: 'slug',
      title: 'URL key',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'profile',
    }),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}, group: 'profile'}),
    defineField({name: 'logoSrc', title: 'Logo URL (fallback)', type: 'string', description: 'Fallback URL if no upload', group: 'profile'}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string', group: 'profile'}),
    defineField({
      name: 'specialties',
      title: 'Specialties',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'founderSpecialty'}]}],
      description:
        'Pick one or more specialty tags. Manage the list under "Directory taxonomy".',
      group: 'directory',
    }),
    defineField({
      name: 'businessModel',
      title: 'Business model',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'B2B', value: 'B2B'},
          {title: 'B2C', value: 'B2C'},
          {title: 'B2B2C', value: 'B2B2C'},
          {title: 'SaaS', value: 'SaaS'},
          {title: 'Marketplace', value: 'Marketplace'},
          {title: 'Hardware', value: 'Hardware'},
          {title: 'Services', value: 'Services'},
          {title: 'Subscription', value: 'Subscription'},
        ]
      },
      group: 'directory',
    }),
    defineField({
      name: 'directoryFilters',
      title: 'Directory filters (new)',
      description:
        'Add this company to one or more filter groups. These groups power the dropdown filters on the directory pages.',
      type: 'array',
      group: 'directory',
      of: [
        defineField({
          name: 'directoryFilterAssignment',
          title: 'Filter group assignment',
          type: 'object',
          fields: [
            defineField({
              name: 'group',
              title: 'Group',
              type: 'reference',
              to: [{type: 'directoryFilterGroup'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'values',
              title: 'Selected values',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule) => Rule.min(1),
            }),
          ],
          preview: {
            select: {
              groupTitle: 'group.title',
              values: 'values',
            },
            prepare({groupTitle, values}) {
              const v = Array.isArray(values) ? values.filter(Boolean) : []
              return {
                title: groupTitle || 'Filter group',
                subtitle: v.length ? v.join(', ') : 'No values',
              }
            },
          },
        }),
      ],
    }),
    defineField({name: 'shortDescription', title: 'Short description', type: 'text', rows: 3, group: 'profile'}),
    defineField({name: 'longDescription', title: 'Full description', type: 'text', rows: 6, group: 'profile'}),
    defineField({name: 'websiteUrl', title: 'Website', type: 'url', group: 'links'}),
    defineField({name: 'linkedinUrl', title: 'LinkedIn', type: 'url', group: 'links'}),
    defineField({name: 'traction', title: 'Traction', type: 'text', rows: 4, group: 'profile'}),
    defineField({name: 'relliaCollaboration', title: 'How Rellia helped', type: 'text', rows: 4, group: 'profile'}),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'United States', value: 'United States'},
          {title: 'Canada', value: 'Canada'},
          {title: 'United Kingdom', value: 'United Kingdom'},
          {title: 'Germany', value: 'Germany'},
          {title: 'France', value: 'France'},
          {title: 'Australia', value: 'Australia'},
        ]
      },
      group: 'profile',
    }),
    defineField({name: 'yearJoined', title: 'Year joined', type: 'number', group: 'profile'}),
    defineField({
      name: 'founders',
      type: 'array',
      group: 'founders',
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
      group: 'profile',
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
  preview: {
    select: {
      name: 'name',
      tagline: 'tagline',
      media: 'logo',
    },
    prepare({name, tagline, media}) {
      const title = name?.trim() || 'Untitled company'
      const subtitle = typeof tagline === 'string' && tagline.trim() ? tagline.trim() : undefined
      return {title, subtitle, media}
    },
  },
})
