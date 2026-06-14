import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'
import {iconKeyField} from '../shared/iconKeyField'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  groups: CONTENT_SEO_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    portableHeadlineField({group: 'content', required: true}),
    defineField({name: 'heroIntro', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'missionTitle', type: 'string', group: 'content'}),
    defineField({name: 'missionParagraphs', type: 'array', of: [{type: 'text', rows: 4}], group: 'content'}),
    defineField({name: 'missionImage', type: 'image', options: {hotspot: true}, group: 'content'}),
    defineField({name: 'missionImageSrc', type: 'string', group: 'content'}),
    defineField({name: 'missionImageAlt', type: 'string', group: 'content'}),
    defineField({
      name: 'valuesTag',
      title: 'Values eyebrow tag',
      type: 'string',
      initialValue: 'OUR VALUES',
      group: 'content',
      hidden: ({document}) => document?.showValuesTag === false,
    }),
    defineField({
      name: 'showValuesTag',
      title: 'Show values eyebrow tag',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    }),
    portableHeadlineField({
      name: 'valuesHeadlinePortable',
      title: 'Values headline',
      group: 'content',
      required: true,
    }),
    defineField({
      name: 'values',
      type: 'array',
      group: 'content',
      of: [
        defineField({
          name: 'value',
          type: 'object',
          fields: [
            iconKeyField(),
            {name: 'title', type: 'string'},
            {name: 'description', type: 'text', rows: 3},
          ],
        }),
      ],
    }),
    defineField({name: 'teamTitle', type: 'string', group: 'content'}),
    defineField({name: 'teamSubtitle', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'team',
      title: 'Team members',
      type: 'array',
      group: 'content',
      description: 'Add, remove, or reorder team cards shown on the About page.',
      of: [defineArrayMember({type: 'aboutTeamMember'})],
    }),
    defineField({name: 'ctaTitle', type: 'string', group: 'content'}),
    defineField({name: 'ctaBody', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'ctaFounderLabel', type: 'string', group: 'content'}),
    defineField({
      name: 'ctaFounderHref',
      title: 'Founder CTA link',
      type: 'string',
      initialValue: '/apply',
      group: 'content',
    }),
    defineField({name: 'ctaTeamLabel', type: 'string', group: 'content'}),
    defineField({
      name: 'ctaTeamHref',
      title: 'Team CTA link',
      type: 'string',
      initialValue: '/careers',
      group: 'content',
    }),
    singletonSeoField,
  ],
})
