import {defineField, defineType} from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSectionsField,
  singletonSeoField,
} from '../shared/singletonContentFields'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  groups: CONTENT_SEO_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({
      name: 'heroHeadlinePortable',
      title: 'Hero headline',
      type: 'inlineHeroHeadline',
      description:
        'One headline field. Select text and use Mint or Teal for accent colour, Strong for weight.',
      group: 'content',
      validation: (Rule) => Rule.required().min(1),
    }),
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
            {name: 'linkedinUrl', type: 'url'},
            {name: 'websiteUrl', type: 'url'},
            {name: 'image', type: 'image', options: {hotspot: true}},
            {name: 'imageSrc', type: 'string'},
          ],
        }),
      ],
    }),
    defineField({name: 'ctaTitle', type: 'string', group: 'content'}),
    defineField({name: 'ctaBody', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'ctaFounderLabel', type: 'string', group: 'content'}),
    defineField({name: 'ctaTeamLabel', type: 'string', group: 'content'}),
    singletonSectionsField,
    singletonSeoField,
  ],
})
