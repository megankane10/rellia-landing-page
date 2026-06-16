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
      name: 'excerpt',
      title: 'Card summary',
      type: 'text',
      rows: 3,
      description:
        'Short preview under the job title on /careers and on the role detail page. If empty, the site uses the start of the role description.',
      validation: (Rule) => Rule.max(280),
    }),
    defineField({
      name: 'description',
      title: 'Role description',
      type: 'openRoleDescription',
      description:
        'Full role copy on the role detail page. Use paragraph breaks, bold, and bullet lists — images are not shown on the site.',
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
    defineField({
      name: 'roleCtaTitle',
      title: 'Bottom CTA headline',
      type: 'string',
      description:
        'Optional grey-teal CTA band at the bottom of this role page. Hidden unless headline, primary label, and primary link are all filled in.',
    }),
    defineField({
      name: 'roleCtaBody',
      title: 'Bottom CTA body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'roleCtaPrimaryLabel',
      title: 'Bottom CTA primary label',
      type: 'string',
    }),
    defineField({
      name: 'roleCtaPrimaryHref',
      title: 'Bottom CTA primary link',
      type: 'string',
      description: 'Site path (e.g. /apply) or full URL.',
    }),
    defineField({
      name: 'roleCtaSecondaryLabel',
      title: 'Bottom CTA secondary label',
      type: 'string',
      description: 'Optional. Secondary button is hidden unless both label and link are filled in.',
    }),
    defineField({
      name: 'roleCtaSecondaryHref',
      title: 'Bottom CTA secondary link',
      type: 'string',
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
