import {defineArrayMember, defineField, defineType} from 'sanity'

/** Editable in Studio under Support — editor onboarding & how-to copy. */
export const studioGuide = defineType({
  name: 'studioGuide',
  title: 'CMS guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'How to use this CMS',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      description: 'Short welcome line at the top of the Support page.',
    }),
    defineField({
      name: 'sections',
      title: 'Guide sections',
      type: 'array',
      description: 'Each block is a heading plus body on the Support page. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'guideSection',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'heading', subtitle: 'body'},
            prepare({title, subtitle}) {
              const blurb =
                typeof subtitle === 'string' && subtitle.trim()
                  ? subtitle.trim().slice(0, 72) + (subtitle.length > 72 ? '…' : '')
                  : ''
              return {title: title || 'Section', subtitle: blurb}
            },
          },
        }),
      ],
      options: {sortable: true, layout: 'list'},
    }),
  ],
  preview: {
    prepare() {
      return {title: 'CMS guide (Support page)'}
    },
  },
})
