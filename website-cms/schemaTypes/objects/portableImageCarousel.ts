import {defineArrayMember, defineField, defineType} from 'sanity'

export const portableImageCarousel = defineType({
  name: 'portableImageCarousel',
  title: 'Image carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Optional heading',
      description: 'Shown above the carousel.',
    }),
    defineField({
      name: 'slides',
      type: 'array',
      title: 'Slides',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'portableImageCarouselSlide',
          fields: [
            defineField({
              name: 'imageSrc',
              type: 'string',
              title: 'Image URL',
              description: 'Site path or https URL.',
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional; shown under that slide.',
            }),
          ],
        }),
      ],
    }),
  ],
})
