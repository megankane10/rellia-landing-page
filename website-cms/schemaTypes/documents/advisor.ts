import {defineArrayMember, defineField, defineType} from 'sanity'

export const advisor = defineType({
  name: 'advisor',
  title: 'Advisor',
  type: 'document',
  groups: [
    {name: 'profile', title: 'Profile', default: true},
    {name: 'directory', title: 'Directory filters'},
    {name: 'links', title: 'Links'},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required(), group: 'profile'}),
    defineField({
      name: 'slug',
      title: 'URL key',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'profile',
    }),
    defineField({name: 'organization', title: 'Organization', type: 'string', group: 'profile'}),
    defineField({name: 'role', title: 'Role / title', type: 'string', group: 'profile'}),
    defineField({
      name: 'roleTitle',
      title: 'Role / title (alias)',
      type: 'string',
      hidden: true,
      group: 'profile',
    }),
    defineField({name: 'location', title: 'Location', type: 'string', group: 'profile'}),
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
    defineField({name: 'yearJoined', title: 'Year joined', type: 'string', description: 'e.g. 2024', group: 'profile'}),
    defineField({
      name: 'industries',
      title: 'Industry tags',
      type: 'array',
      of: [{type: 'string'}],
      group: 'directory',
    }),
    defineField({
      name: 'focus',
      title: 'Card summary',
      type: 'string',
      description: 'One sentence shown on the directory card.',
      group: 'profile',
    }),
    defineField({
      name: 'filter',
      title: 'Primary directory tag (legacy)',
      type: 'reference',
      to: [{type: 'advisorFilter'}],
      description:
        'Older field used by the directory. Prefer “Directory filters” below for flexible filter groups.',
      group: 'directory',
    }),
    defineField({
      name: 'directoryFilters',
      title: 'Directory filters (new)',
      description:
        'Add this advisor to one or more filter groups. These groups power the dropdown filters on the directory pages.',
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
              description: 'Example: Clinical, Regulatory, Seed, Women’s Health, etc.',
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
    defineField({name: 'photo', title: 'Avatar', type: 'image', options: {hotspot: true}, group: 'profile'}),
    defineField({
      name: 'avatar',
      title: 'Avatar (alias)',
      type: 'image',
      hidden: true,
      group: 'profile',
    }),
    defineField({name: 'photoSrc', title: 'Photo URL (fallback)', type: 'string', description: 'Fallback URL if no upload', group: 'profile'}),
    defineField({name: 'linkedInUrl', title: 'LinkedIn', type: 'url', group: 'links'}),
    defineField({name: 'websiteUrl', title: 'Website', type: 'url', group: 'links'}),
    defineField({name: 'bio', title: 'Bio (short)', type: 'text', rows: 6, group: 'profile'}),
    defineField({
      name: 'bioRich',
      title: 'Bio (rich text)',
      type: 'portableText',
      group: 'profile',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social & professional links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
      group: 'links',
    }),
    defineField({name: 'mentoringStyle', title: 'Mentoring style', type: 'text', rows: 4, group: 'profile'}),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'string'}],
      group: 'profile',
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
  preview: {
    select: {
      name: 'name',
      role: 'role',
      organization: 'organization',
      media: 'photo',
    },
    prepare({name, role, organization, media}) {
      const title = name?.trim() || 'Untitled advisor'
      const subtitleParts = [role, organization].filter(
        (part): part is string => typeof part === 'string' && Boolean(part.trim()),
      )
      return {
        title,
        subtitle: subtitleParts.length ? subtitleParts.join(' · ') : undefined,
        media,
      }
    },
  },
})
