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
      description: 'Used in /careers/roles/role-id — lowercase letters, numbers, hyphens only.',
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
    defineField({
      name: 'description',
      title: 'Role description',
      type: 'openRoleDescription',
      description:
        'Rich text shown in the open role accordion on /careers. Use paragraph breaks, bold, and bullet lists — formatting appears on the live site.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'responsibilities',
      title: 'Role highlights',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Optional short bullets under “Role highlights”. Leave empty to hide that section.',
    }),
    defineField({
      name: 'applyButtonLabel',
      title: 'Apply button label',
      type: 'string',
      description:
        'Optional. The apply button is hidden unless both this label and Apply button URL are filled in.',
    }),
    defineField({
      name: 'applyButtonUrl',
      title: 'Apply button URL',
      type: 'url',
      description:
        'Optional. LinkedIn job post, careers page, or mailto link. The apply button is hidden unless both this URL and Apply button label are filled in.',
      validation: (Rule) => Rule.uri({allowRelative: false, scheme: ['http', 'https', 'mailto']}),
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
