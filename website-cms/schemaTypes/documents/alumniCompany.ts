import {defineArrayMember, defineField, defineType} from 'sanity'

const SPECIALTY_OPTIONS = [
  {title: "Women's Health", value: "Women's Health"},
  {title: 'Neurology', value: 'Neurology'},
  {title: 'Cardiology', value: 'Cardiology'},
  {title: 'Oncology', value: 'Oncology'},
  {title: 'Mental Health', value: 'Mental Health'},
  {title: 'Pediatrics', value: 'Pediatrics'},
]

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
    defineField({name: 'websiteUrl', title: 'Website', type: 'url', group: 'profile'}),
    defineField({name: 'linkedinUrl', title: 'LinkedIn', type: 'url', group: 'profile'}),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      description: 'Optional public contact email for the company profile.',
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
      name: 'specialties',
      title: 'Specialty tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {list: SPECIALTY_OPTIONS},
      description: 'Inline specialty tags for directory cards. Use Directory filters for grouped filter tags.',
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
