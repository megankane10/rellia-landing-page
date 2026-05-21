import {defineArrayMember, defineField, defineType} from 'sanity'

export const testimonialSection = defineType({
  name: 'testimonialSection',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField({name: 'internalLabel', title: 'Internal label', type: 'string'}),
    defineField({name: 'heading', title: 'Section heading', type: 'string'}),
    defineField({
      name: 'testimonials',
      title: 'Quotes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'testimonialQuote',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'authorName', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'authorRole', title: 'Role / title', type: 'string'}),
            defineField({name: 'company', title: 'Company', type: 'string'}),
            defineField({
              name: 'avatar',
              title: 'Avatar',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
          preview: {
            select: {title: 'authorName', subtitle: 'company'},
            prepare({title, subtitle}) {
              return {title: title || 'Quote', subtitle}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Testimonials', subtitle: 'Testimonial section'}
    },
  },
})
