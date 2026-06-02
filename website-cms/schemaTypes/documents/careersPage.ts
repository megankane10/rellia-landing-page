import {defineArrayMember, defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {singletonLayoutFields} from '../shared/singletonLayoutFields'
import {singletonPublishingAtTop} from '../shared/documentTopFields'
import {publishingGroup} from '../shared/pageVisibilityFields'

const GROUP_OPEN_ROLES = {name: 'openRoles' as const, title: 'Open roles'}
const GROUP_JOIN_TEAM = {name: 'joinTeam' as const, title: 'Join team marquee'}

export const careersPage = defineType({
  name: 'careersPage',
  title: 'Careers page',
  type: 'document',
  groups: [publishingGroup, GROUP_JOIN_TEAM, GROUP_OPEN_ROLES, ...documentGroups.filter((g) => g.name !== 'publishing')],
  fieldsets: [FIELDSET_SEO],
  fields: [
    ...singletonPublishingAtTop,
    defineField({
      name: 'teamMarqueeImages',
      title: 'Join team — image scroll',
      type: 'array',
      description:
        'Photos in the horizontal scroll on the careers “Join the team” band. Upload at least 4–6 images; order controls scroll sequence.',
      group: 'joinTeam',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Leave empty for decorative photos.',
            }),
          ],
          preview: {
            select: {media: 'asset', alt: 'alt'},
            prepare({media, alt}) {
              return {title: alt?.trim() || 'Marquee image', media}
            },
          },
        }),
      ],
      options: {sortable: true},
    }),
    defineField({
      name: 'defaultTab',
      title: 'Default tab',
      type: 'string',
      options: {
        list: [
          {title: 'Hiring', value: 'hiring'},
          {title: 'Volunteer', value: 'volunteer'},
        ],
        layout: 'radio',
      },
      initialValue: 'hiring',
      group: 'content',
    }),
    defineField({
      name: 'enableHiringTab',
      title: 'Enable Hiring tab',
      type: 'boolean',
      description:
        'Shows the Hiring tab and section. Hiring content is still pre-coded; this only controls visibility.',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'enableVolunteerTab',
      title: 'Enable Volunteer tab',
      type: 'boolean',
      description:
        'Shows the Volunteer tab and embedded form. Volunteer content is still pre-coded; this only controls visibility.',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'tabsLabelHiring',
      title: 'Hiring tab label',
      type: 'string',
      initialValue: 'Hiring',
      group: 'content',
    }),
    defineField({
      name: 'tabsLabelVolunteer',
      title: 'Volunteer tab label',
      type: 'string',
      initialValue: 'Volunteer',
      group: 'content',
    }),
    defineField({
      name: 'publishOpenRolesOnProduction',
      title: 'Show open roles on production (www)',
      type: 'boolean',
      description:
        'When off, /careers on relliahealth.com hides job listings (preview/Vercel still shows roles for editing). Turn on when real roles are ready for the public site.',
      initialValue: false,
      group: 'openRoles',
    }),
    defineField({
      name: 'showHiringNavBadge',
      title: 'Show HIRING badge in navigation',
      type: 'boolean',
      description: 'Mint “HIRING” pill beside Careers in the header and footer. Off by default.',
      initialValue: false,
      group: 'content',
    }),
    defineField({
      name: 'showVolunteerNavBadge',
      title: 'Show VOLUNTEER badge in navigation',
      type: 'boolean',
      description: 'Mint “VOLUNTEER” pill beside Careers in the header and footer. Off by default.',
      initialValue: false,
      group: 'content',
    }),
    defineField({
      name: 'openRoles',
      title: 'Open roles',
      type: 'array',
      description: 'Job listings on /careers#open-roles. Drag to reorder.',
      group: 'openRoles',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'openRole',
          fields: [
            defineField({
              name: 'roleId',
              title: 'URL anchor ID',
              type: 'string',
              description: 'Used in /careers#role-id — lowercase letters, numbers, hyphens only.',
              validation: (Rule) =>
                Rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
                  name: 'slug',
                  invert: false,
                }),
            }),
            defineField({name: 'title', title: 'Job title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'location', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'employmentType', title: 'Employment type', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
            defineField({
              name: 'responsibilities',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule) => Rule.min(1),
            }),
            defineField({
              name: 'linkedInApplyUrl',
              title: 'Apply URL (LinkedIn or other)',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'location'},
          },
        }),
      ],
      options: {sortable: true},
    }),
    ...singletonLayoutFields,
    defineField({name: 'seo', type: 'seoFields', group: 'seo', fieldset: 'seo'}),
  ],
})

