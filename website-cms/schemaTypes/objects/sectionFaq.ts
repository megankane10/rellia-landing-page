import {defineArrayMember, defineField, defineType} from 'sanity'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionFaq = defineType({
  name: 'sectionFaq',
  title: 'FAQ accordion block',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    portableHeadlineField({
      name: 'headlinePortable',
      title: 'Section heading',
      initialValue: undefined,
    }),
    defineField({
      name: 'subtitle',
      title: 'Section subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({name: 'question', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'answer', type: 'text', rows: 5, validation: (Rule) => Rule.required()}),
          ],
          preview: {
            select: {title: 'question'},
            prepare({title}) {
              return {title: title || 'FAQ item'}
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: sectionListPreview({typeLabel: 'FAQ', fallback: 'FAQ section'}),
})
