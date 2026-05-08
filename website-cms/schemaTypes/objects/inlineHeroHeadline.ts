import {defineArrayMember, defineType} from 'sanity'

/**
 * Short headings with optional colored spans (decorators), same model as rich text marks.
 * Prefer this over separate “accent” string fields.
 */
export const inlineHeroHeadline = defineType({
  name: 'inlineHeroHeadline',
  title: 'Heading text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Mint', value: 'mint'},
          {title: 'Teal', value: 'teal'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule: any) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
            ],
          },
        ],
      },
    }),
  ],
})
