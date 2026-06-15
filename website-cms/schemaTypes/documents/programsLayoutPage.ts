import {defineArrayMember, defineField, defineType} from 'sanity'
import {iconKeyField} from '../shared/iconKeyField'
import {CONTENT_SEO_FIELDSETS, singletonSeoField} from '../shared/singletonContentFields'
import {GROUP_SEO} from '../shared/fieldGroups'
import {relatedContentSectionFields} from '../shared/relatedContentSectionFields'
import {studioListMedia} from '../shared/studioListMedia'

const GROUP_HOW_IT_WORKS = {name: 'howItWorks', title: 'How it works', default: true}
const GROUP_PILLARS = {name: 'pillars', title: 'Pillars'}
const GROUP_TIMELINE = {name: 'timeline', title: 'Timeline defaults'}
const GROUP_RELATED = {name: 'related', title: 'Related programs'}

export const programsLayoutPage = defineType({
  name: 'programsLayoutPage',
  title: 'Programs layout (shared copy)',
  type: 'document',
  groups: [GROUP_HOW_IT_WORKS, GROUP_PILLARS, GROUP_TIMELINE, GROUP_RELATED, GROUP_SEO],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({
      name: 'howItWorksTitle',
      title: 'How it works — title',
      type: 'string',
      initialValue: 'How it works',
      group: 'howItWorks',
    }),
    defineField({
      name: 'howItWorksIntro',
      title: 'How it works — intro',
      type: 'text',
      rows: 3,
      group: 'howItWorks',
    }),
    defineField({
      name: 'pillarsTitle',
      title: 'Pillars — section title',
      type: 'string',
      initialValue: 'Program pillars',
      group: 'pillars',
    }),
    defineField({
      name: 'pillars',
      title: 'Default pillar cards',
      description: 'Shared pillar copy used when a program does not override pillars in the CMS.',
      type: 'array',
      group: 'pillars',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'programPillar',
          fields: [
            iconKeyField(),
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({
      name: 'timelineTitle',
      title: 'Timeline — section title',
      type: 'string',
      initialValue: 'Program timeline',
      group: 'timeline',
    }),
    defineField({
      name: 'timelineSubtitle',
      title: 'Timeline — section subtitle',
      type: 'text',
      rows: 2,
      group: 'timeline',
    }),
    defineField({
      name: 'timelineWeekLabelPrefix',
      title: 'Timeline week label prefix',
      type: 'string',
      description: 'Default prefix for week labels (e.g. "Week" renders as "Week 1–2").',
      initialValue: 'Week',
      group: 'timeline',
    }),
    ...relatedContentSectionFields.map((field) => ({
      ...field,
      group: 'related',
      description:
        field.name === 'relatedSectionTitle'
          ? 'Shown at the bottom of program detail pages when other available programs appear (e.g. “More available programs”).'
          : field.description,
    })),
    singletonSeoField,
  ],
  preview: {
    prepare() {
      return {
        title: 'Programs layout',
        subtitle: 'Shared copy for program detail pages',
        media: studioListMedia.document,
      }
    },
  },
})
