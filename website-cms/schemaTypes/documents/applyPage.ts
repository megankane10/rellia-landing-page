import {defineArrayMember, defineField, defineType} from 'sanity'
import {studioListMedia} from '../shared/studioListMedia'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'

export const applyPage = defineType({
  name: 'applyPage',
  title: 'Apply page (/apply)',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'cta', title: 'Bottom CTA'},
    ...CONTENT_SEO_GROUPS.filter((g) => g.name !== 'content'),
  ],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({
      name: 'headingTitle',
      title: 'Page heading',
      type: 'string',
      initialValue: 'Path to Membership',
      group: 'content',
    }),
    defineField({
      name: 'subheading',
      title: 'Intro text',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'steps',
      title: 'Membership steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'applyStep',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
            prepare: ({title, subtitle}) => ({
              title: title || 'Step',
              subtitle: typeof subtitle === 'string' ? subtitle.slice(0, 72) : undefined,
              media: studioListMedia.document,
            }),
          },
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'showRoleLinks',
      title: 'Show role links (Founders, Advisors, …)',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'roleLinks',
      title: 'Role link cards',
      type: 'array',
      description: 'Cards under “Learn more about your role” on /apply.',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'applyRoleLink',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', type: 'text', rows: 2, validation: (Rule) => Rule.required()}),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              description: 'Internal path, e.g. /founders',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        }),
      ],
    }),
    defineField({
      name: 'applyButtonLabel',
      title: 'Primary button label',
      type: 'string',
      initialValue: 'Apply now',
      group: 'content',
    }),
    defineField({
      name: 'bottomCtaTitle',
      title: 'Bottom CTA title',
      type: 'string',
      initialValue: 'Explore the Rellia network',
      group: 'cta',
    }),
    defineField({
      name: 'bottomCtaBody',
      title: 'Bottom CTA body',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'bottomCtaPrimaryLabel',
      type: 'string',
      title: 'Bottom CTA — primary label',
      group: 'cta',
    }),
    defineField({
      name: 'bottomCtaPrimaryHref',
      type: 'string',
      title: 'Bottom CTA — primary link',
      group: 'cta',
    }),
    defineField({
      name: 'bottomCtaSecondaryLabel',
      type: 'string',
      title: 'Bottom CTA — secondary label',
      initialValue: 'Contact us',
      group: 'cta',
    }),
    defineField({
      name: 'bottomCtaSecondaryHref',
      type: 'string',
      title: 'Bottom CTA — secondary link',
      initialValue: '/contact',
      group: 'cta',
    }),
    singletonSeoField,
  ],
  preview: {
    prepare() {
      return {title: 'Apply page', subtitle: '/apply', media: studioListMedia.document}
    },
  },
})
