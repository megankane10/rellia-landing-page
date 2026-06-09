import {defineArrayMember, defineField, defineType} from 'sanity'

export const advisor = defineType({
  name: 'advisor',
  title: 'Advisor',
  type: 'document',
  groups: [
    {name: 'profile', title: 'Profile', default: true},
    {name: 'directory', title: 'Directory filters'},
    {name: 'links', title: 'Links'},
  ],
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
      name: 'photo',
      title: 'Avatar',
      type: 'image',
      options: {hotspot: true, cropAspect: 3 / 4, cropAspectPreset: 'portrait'},
      group: 'profile',
    }),
    defineField({
      name: 'photoSrc',
      title: 'Photo URL (fallback)',
      type: 'string',
      description: 'Fallback URL if no upload',
      group: 'profile',
    }),
    defineField({
      name: 'snapshot',
      title: 'Snapshot',
      type: 'string',
      description:
        'One sentence for the directory card and the Snapshot box on the profile page.',
      group: 'profile',
      validation: (Rule) => Rule.max(280),
    }),
    defineField({name: 'yearJoined', title: 'Year joined', type: 'string', description: 'e.g. 2024', group: 'profile'}),
    defineField({
      name: 'industries',
      title: 'Industry tags',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Optional secondary tags shown on directory cards and profiles. Not used for directory filtering.',
      group: 'profile',
    }),
    defineField({
      name: 'bio',
      title: 'About the advisor',
      type: 'advisorPortableText',
      description: 'Paragraphs and bullet lists only. This is the last profile section on the page.',
      group: 'profile',
    }),
    defineField({
      name: 'directoryFilters',
      title: 'Directory filters',
      description:
        'Assign Country and Expertise values. These power directory filters and the primary expertise tag on cards and profiles.',
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
              description: 'Country names or expertise areas.',
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
    defineField({
      name: 'socialLinks',
      title: 'Social & professional links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
      description: 'LinkedIn, website, email, and other links shown on the profile sidebar.',
      group: 'links',
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      description: 'Optional public contact email (also addable as an Email social link above).',
      group: 'links',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      role: 'role',
      organization: 'organization',
      snapshot: 'snapshot',
      media: 'photo',
    },
    prepare({name, role, organization, snapshot, media}) {
      const title = name?.trim() || 'Untitled advisor'
      const subtitleParts = [role, organization, snapshot]
        .filter((part): part is string => typeof part === 'string' && Boolean(part.trim()))
      return {
        title,
        subtitle: subtitleParts.length ? subtitleParts.join(' · ') : undefined,
        media,
      }
    },
  },
})
