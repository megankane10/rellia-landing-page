import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  sectionDividerFieldset,
  singletonSeoField,
} from '../shared/singletonContentFields'
import {GROUP_SEO} from '../shared/fieldGroups'
import {
  networkCtaFields,
  networkFeatureItemMember,
  networkHeroFields,
  networkWhyRelliaFields,
} from '../shared/networkPageFields'

const GROUP_HERO = {name: 'hero' as const, title: 'Hero', default: true}
const GROUP_LIFE_AT_RELLIA = {name: 'lifeAtRellia' as const, title: 'Life at Rellia'}

const careersPerkItemMember = defineArrayMember({
  type: 'object',
  name: 'careersPerkItem',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'body', type: 'text', rows: 3}),
    defineField({
      name: 'iconKey',
      title: 'Icon',
      type: 'string',
      description: 'Lucide icon name, e.g. Users, Building2, Laptop, MapPin',
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})

export const careersPage = defineType({
  name: 'careersPage',
  title: 'Careers page',
  type: 'document',
  groups: [
    GROUP_HERO,
    GROUP_LIFE_AT_RELLIA,
    {name: 'content', title: 'Content'},
    GROUP_SEO,
  ],
  fieldsets: [
    sectionDividerFieldset('heroDivider', 'Hero'),
    sectionDividerFieldset('contentDivider', 'Page content'),
    sectionDividerFieldset('whyRelliaDivider', 'Feature cards (image panels)'),
    sectionDividerFieldset('howWeWorkDivider', 'How we work grid'),
    sectionDividerFieldset('lifeAtRelliaDivider', 'Life at Rellia'),
    ...CONTENT_SEO_FIELDSETS,
  ],
  fields: [
    ...networkHeroFields.map((field) => ({
      ...field,
      group: 'hero' as const,
      fieldset: 'heroDivider' as const,
    })),
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
    defineField({
      name: 'whyTitle',
      title: 'Section heading',
      type: 'string',
      description: 'Headline above the four expandable image panels.',
      initialValue: 'Building What Matters Most',
      group: 'content',
      fieldset: 'whyRelliaDivider',
    }),
    defineField({
      name: 'whyDescription',
      title: 'Section intro',
      type: 'text',
      rows: 2,
      description: 'Short paragraph under the heading.',
      group: 'content',
      fieldset: 'whyRelliaDivider',
    }),
    defineField({
      name: 'whyFeatures',
      title: 'Feature cards (4 image panels)',
      type: 'array',
      description: 'Up to four cards with background image, title, description, and optional button.',
      of: [networkFeatureItemMember],
      group: 'content',
      fieldset: 'whyRelliaDivider',
    }),
    defineField({
      name: 'perksTitle',
      title: 'How we work — section title',
      type: 'string',
      initialValue: 'How we work',
      group: 'content',
      fieldset: 'howWeWorkDivider',
    }),
    defineField({
      name: 'perksDescription',
      title: 'How we work — section description',
      type: 'text',
      rows: 2,
      group: 'content',
      fieldset: 'howWeWorkDivider',
    }),
    defineField({
      name: 'perksItems',
      title: 'How we work — perk items',
      type: 'array',
      of: [careersPerkItemMember],
      group: 'content',
      fieldset: 'howWeWorkDivider',
    }),
    defineField({
      name: 'openRolesTitle',
      title: 'Open roles section title',
      type: 'string',
      initialValue: 'Open Roles',
      group: 'content',
      fieldset: 'contentDivider',
    }),
    ...networkCtaFields.map((field) => ({
      ...field,
      fieldset: 'contentDivider' as const,
    })),
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
