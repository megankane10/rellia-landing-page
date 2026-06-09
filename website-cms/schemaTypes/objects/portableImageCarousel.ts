import {defineArrayMember, defineField, defineType} from 'sanity'
import {richTextImageCropOptions, richTextImageDisplayModeField} from '../shared/richTextImageFields'

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
          title: 'Carousel slide',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: richTextImageCropOptions,
            }),
            richTextImageDisplayModeField,
            defineField({
              name: 'imageSrc',
              type: 'string',
              title: 'Image URL (fallback)',
              description: 'Use only if the image is not uploaded above.',
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
          preview: {
            select: {title: 'alt', subtitle: 'caption', media: 'image'},
            prepare({title, subtitle, media}) {
              return {
                title: title?.trim() || 'Carousel slide',
                subtitle: subtitle?.trim() || undefined,
                media,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', slides: 'slides'},
    prepare({title, slides}) {
      const count = Array.isArray(slides) ? slides.length : 0
      return {
        title: title?.trim() || 'Image carousel',
        subtitle: count ? `${count} slide${count === 1 ? '' : 's'}` : 'No slides',
      }
    },
  },
})
