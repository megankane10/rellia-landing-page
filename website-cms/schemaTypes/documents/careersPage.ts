import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  sectionDividerFieldset,
  singletonSectionsField,
  singletonSeoField,
} from '../shared/singletonContentFields'

const GROUP_LIFE_AT_RELLIA = {name: 'lifeAtRellia' as const, title: 'Life at Rellia'}

export const careersPage = defineType({
  name: 'careersPage',
  title: 'Careers page',
  type: 'document',
  groups: [GROUP_LIFE_AT_RELLIA, ...CONTENT_SEO_GROUPS],
  fieldsets: [
    sectionDividerFieldset('contentDivider', 'Page content'),
    sectionDividerFieldset('lifeAtRelliaDivider', 'Life at Rellia'),
    ...CONTENT_SEO_FIELDSETS,
  ],
  fields: [
    defineField({
      name: 'careersContentMode',
      title: 'Careers page mode',
      type: 'string',
      description:
        'Controls hero buttons and which sections appear on /careers. Open roles are managed under Collections → Open roles.',
      options: {
        list: [
          {title: 'Show both (Hiring + Volunteer)', value: 'both'},
          {title: 'Hiring only (Work with us + open roles)', value: 'hiring_only'},
          {title: 'Volunteer only (Volunteer button + form)', value: 'volunteer_only'},
        ],
        layout: 'radio',
      },
      initialValue: 'both',
      group: 'content',
      fieldset: 'contentDivider',
    }),
    defineField({
      name: 'showHiringNavBadge',
      title: 'Show HIRING badge in navigation',
      type: 'boolean',
      description: 'Mint “HIRING” pill beside Careers in the header and footer. Off by default.',
      initialValue: false,
      group: 'content',
      fieldset: 'contentDivider',
    }),
    defineField({
      name: 'showVolunteerNavBadge',
      title: 'Show VOLUNTEER badge in navigation',
      type: 'boolean',
      description: 'Mint “VOLUNTEER” pill beside Careers in the header and footer. Off by default.',
      initialValue: false,
      group: 'content',
      fieldset: 'contentDivider',
    }),
    singletonSectionsField,
    defineField({
      name: 'lifeAtRelliaHeading',
      title: 'Life at Rellia — Heading',
      type: 'string',
      initialValue: 'Life at Rellia',
      group: 'lifeAtRellia',
      fieldset: 'lifeAtRelliaDivider',
    }),
    defineField({
      name: 'lifeAtRelliaSubheading',
      title: 'Life at Rellia — Subheading',
      type: 'text',
      rows: 4,
      initialValue:
        'We are building a remote-first, high-standards health-tech company. Our team brings deep clinical, technical, and operational expertise to help founders transform care.',
      group: 'lifeAtRellia',
      fieldset: 'lifeAtRelliaDivider',
    }),
    defineField({
      name: 'lifeAtRelliaImages',
      title: 'Life at Rellia — Slider Images',
      type: 'array',
      group: 'lifeAtRellia',
      fieldset: 'lifeAtRelliaDivider',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
          preview: {
            select: {media: 'asset', alt: 'alt'},
            prepare({media, alt}) {
              return {title: alt?.trim() || 'Slider image', media}
            },
          },
        }),
      ],
      options: {sortable: true},
    }),
    defineField({
      name: 'lifeAtRelliaLinks',
      title: 'Life at Rellia — Social/Proof Links',
      type: 'array',
      group: 'lifeAtRellia',
      fieldset: 'lifeAtRelliaDivider',
      of: [
        defineField({
          type: 'object',
          name: 'lifeAtRelliaLink',
          title: 'Link / Button',
          fields: [
            defineField({
              name: 'platformName',
              title: 'Platform / Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            }),
            defineField({
              name: 'iconKey',
              title: 'Icon Type',
              type: 'string',
              options: {
                list: [
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Twitter / X', value: 'twitter'},
                  {title: 'Video', value: 'video'},
                  {title: 'Article / Document', value: 'article'},
                  {title: 'Website / Link', value: 'link'},
                ],
              },
              initialValue: 'link',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'tooltip',
              title: 'Hover Tooltip text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'platformName', subtitle: 'tooltip'},
          },
        }),
      ],
    }),
    singletonSeoField,
  ],
})
