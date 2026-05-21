import {defineArrayMember, defineField, defineType} from 'sanity'

export const carouselSection = defineType({
  name: 'carouselSection',
  title: 'Carousel',
  type: 'object',
  fields: [
    defineField({name: 'internalLabel', title: 'Internal label', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'carouselSlide',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'overlayTitle', title: 'Overlay title', type: 'string'}),
            defineField({name: 'overlayText', title: 'Overlay text', type: 'text', rows: 3}),
            defineField({name: 'href', title: 'Link', type: 'string'}),
          ],
          preview: {
            select: {title: 'overlayTitle', media: 'image'},
            prepare({title, media}) {
              return {title: title || 'Slide', media}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Carousel', subtitle: 'Image carousel'}
    },
  },
})
