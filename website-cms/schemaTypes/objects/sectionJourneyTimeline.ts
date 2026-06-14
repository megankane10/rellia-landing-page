import {defineArrayMember, defineField, defineType} from 'sanity'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'
import {showBadgeField} from '../shared/sectionAppearanceFields'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

/** Membership-style numbered timeline — same component as /apply. */
export const sectionJourneyTimeline = defineType({
  name: 'sectionJourneyTimeline',
  title: 'Journey timeline block',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    showBadgeField,
    defineField({
      name: 'badge',
      title: 'Section tag',
      type: 'string',
      hidden: ({parent}) => parent?.showBadge === false,
    }),
    portableHeadlineField({
      name: 'headlinePortable',
      title: 'Section heading',
      required: true,
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'steps',
      title: 'Timeline steps',
      type: 'array',
      validation: (Rule) => Rule.min(1).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'timelineStep',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        }),
      ],
    }),
    defineField({
      name: 'showRoleLinks',
      title: 'Show role link cards',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'roleLinks',
      title: 'Role link cards',
      type: 'array',
      hidden: ({parent}) => parent?.showRoleLinks === false,
      of: [
        defineArrayMember({
          type: 'object',
          name: 'roleLink',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', type: 'text', rows: 2, validation: (Rule) => Rule.required()}),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Primary button (optional)',
      type: 'builderCtaAction',
      description: 'Shown below the timeline steps. Link or inline Fillout embed.',
    }),
  ],
  preview: sectionListPreview({typeLabel: 'Timeline', fallback: 'Timeline'}),
})
