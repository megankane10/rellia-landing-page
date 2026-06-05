import {defineArrayMember, defineField, defineType} from 'sanity'


export const alumniCompany = defineType({
  name: 'alumniCompany',
  title: 'Founder company (alumni directory)',
  type: 'document',
  groups: [
    {name: 'founders', title: 'Founders', default: true},
    {name: 'profile', title: 'Company profile'},
    {name: 'directory', title: 'Directory filters'},
    {name: 'links', title: 'Links'},
  ],
  fields: [
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
            defineField({name: 'linkedinUrl', type: 'url', title: 'LinkedIn (legacy)'}),
            defineField({name: 'websiteUrl', type: 'url', title: 'Website (legacy)'}),
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
          ],
          preview: {
            select: {title: 'name', subtitle: 'role', media: 'image'},
          },
        },
      ],
    }),
    defineField({
      name: 'profileBody',
      title: 'Company story (rich text)',
      type: 'portableRichText',
      description:
        'Overview, traction, and collaboration — use headings, images, quote boxes, and CTA boxes.',
      group: 'founders',
    }),
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
    defineField({
      name: 'longDescription',
      title: 'Overview (plain text, legacy)',
      type: 'text',
      rows: 6,
      description: 'Deprecated — prefer Company story (rich text). Still used if rich text is empty.',
      group: 'profile',
    }),
    defineField({
      name: 'specialties',
      title: 'Specialties',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'founderSpecialty'}]}],
      description: 'Pick one or more specialty tags.',
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
        ],
      },
      group: 'directory',
    }),
    defineField({
      name: 'directoryFilters',
      title: 'Directory filters',
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
    defineField({name: 'websiteUrl', title: 'Website', type: 'url', group: 'links'}),
    defineField({name: 'linkedinUrl', title: 'LinkedIn', type: 'url', group: 'links'}),
    defineField({name: 'traction', title: 'Traction', type: 'text', rows: 4, group: 'profile'}),
    defineField({
      name: 'relliaCollaboration',
      title: 'How Rellia helped',
      type: 'text',
      rows: 4,
      group: 'profile',
    }),
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
        ],
      },
      group: 'profile',
    }),
    defineField({name: 'yearJoined', title: 'Year joined', type: 'number', group: 'profile'}),
    defineField({
      name: 'imageSrc',
      title: 'Legacy logo URL',
      type: 'string',
      hidden: true,
      readOnly: true,
      description: 'Deprecated — use Logo upload. Remove this field value to clear warnings.',
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
