import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'

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
    defineField({name: 'valuesTitle', type: 'string', group: 'content'}),
    defineField({name: 'valuesSubtitle', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'values',
      type: 'array',
      group: 'content',
      of: [
        defineField({
          name: 'value',
          type: 'object',
          fields: [
            {name: 'iconKey', type: 'string'},
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
      type: 'array',
      group: 'content',
      of: [
        defineField({
          name: 'member',
          type: 'object',
          fields: [
            {name: 'name', type: 'string'},
            {name: 'role', type: 'string'},
            {name: 'bio', type: 'text', rows: 3},
            defineField({
              name: 'socialLinks',
              title: 'Social & professional links',
              type: 'array',
              of: [defineArrayMember({type: 'socialLink'})],
            }),
            {name: 'image', type: 'image', options: {hotspot: true, cropAspect: 1, cropAspectPreset: 'square'}},
            {name: 'imageSrc', type: 'string'},
          ],
        }),
      ],
    }),
    defineField({name: 'ctaTitle', type: 'string', group: 'content'}),
    defineField({name: 'ctaBody', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'ctaFounderLabel', type: 'string', group: 'content'}),
    defineField({name: 'ctaTeamLabel', type: 'string', group: 'content'}),
    singletonSeoField,
  ],
})
