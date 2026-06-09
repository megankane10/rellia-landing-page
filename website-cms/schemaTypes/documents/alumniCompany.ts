import {defineArrayMember, defineField, defineType} from 'sanity'

export const alumniCompany = defineType({
  name: 'alumniCompany',
  title: 'Alumni company',
  type: 'document',
  groups: [
    {name: 'profile', title: 'Company profile', default: true},
    {name: 'founders', title: 'Founders'},
    {name: 'directory', title: 'Directory filters'},
    {name: 'links', title: 'Links'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Company name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'profile',
    }),
    defineField({
      name: 'slug',
      title: 'URL key',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'profile',
    }),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}, group: 'profile'}),
    defineField({
      name: 'logoSrc',
      title: 'Logo URL (fallback)',
      type: 'string',
      description: 'Fallback URL if no upload',
      group: 'profile',
    }),
    defineField({name: 'tagline', title: 'Tagline', type: 'string', group: 'profile'}),
    defineField({
      name: 'shortDescription',
      title: 'Card & sidebar blurb',
      type: 'text',
      rows: 3,
      description: 'Shown on directory cards and under the company name on the profile page.',
      group: 'profile',
    }),
    defineField({name: 'yearJoined', title: 'Year joined', type: 'number', group: 'profile'}),
    defineField({
      name: 'socialLinks',
      title: 'Social & professional links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
      description: 'LinkedIn, website, and other links shown on the company profile.',
      group: 'profile',
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      description: 'Optional public contact email shown in social icons.',
      group: 'profile',
    }),
    defineField({
      name: 'founders',
      title: 'Founders',
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
            defineField({
              name: 'socialLinks',
              title: 'Social & professional links',
              type: 'array',
              of: [defineArrayMember({type: 'socialLink'})],
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'imageSrc',
              title: 'Photo URL (fallback)',
              type: 'string',
              description: 'Fallback URL if no upload (e.g. /images/deenasammak-team.png).',
            }),
            defineField({
              name: 'email',
              title: 'Email',
              type: 'string',
              description: 'Optional contact email shown in social icons.',
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'role', media: 'image'},
          },
        },
      ],
    }),
    defineField({
      name: 'profileBody',
      title: 'About the company',
      type: 'portableRichText',
      description:
        'Company overview — use headings, images, quote boxes, and CTA boxes.',
      group: 'founders',
    }),
    defineField({
      name: 'directoryFilters',
      title: 'Directory filters',
      description:
        'Assign Country, Specialty, and Business Model values. These power directory filters and the tags shown on cards and profiles.',
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
            select: {groupTitle: 'group.title', values: 'values'},
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
  ],
  preview: {
    select: {
      name: 'name',
      tagline: 'tagline',
      logo: 'logo',
    },
    prepare({name, tagline, logo}) {
      const title = name?.trim() || 'Untitled company'
      const subtitle = typeof tagline === 'string' && tagline.trim() ? tagline.trim() : undefined
      return {title, subtitle, media: logo}
    },
  },
})
