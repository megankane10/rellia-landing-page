import {defineField, defineType} from 'sanity'
import {imageUploadField} from '../shared/imageFields'

/** Branded pull-quote block — insert from rich text (+) alongside CTA box and carousel. */
export const portableQuoteBox = defineType({
  name: 'portableQuoteBox',
  title: 'Quote box',
  type: 'object',
  fields: [
    imageUploadField('image', 'Side image', {
      description: 'Optional rectangular image shown left of the quote on desktop.',
      cropAspect: 4 / 3,
      cropAspectPreset: 'landscape',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt text',
      type: 'string',
      description: 'Required when a side image is set.',
      hidden: ({parent}) => !parent?.image?.asset && !parent?.imageSrc,
    }),
    defineField({
      name: 'imageSrc',
      title: 'Side image URL (fallback)',
      type: 'string',
      description: 'Site path (e.g. /images/…) or full https URL. Used when no image is uploaded above.',
      hidden: ({parent}) => Boolean(parent?.image?.asset),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Optional — speaker name, role, or source (shown below the quote).',
    }),
  ],
  preview: {
    select: {quote: 'quote', attribution: 'attribution'},
    prepare({quote, attribution}) {
      const text = typeof quote === 'string' ? quote.trim() : ''
      return {
        title: text
          ? `"${text.slice(0, 72)}${text.length > 72 ? '…' : ''}"`
          : 'Quote box',
        subtitle: typeof attribution === 'string' && attribution.trim() ? attribution.trim() : undefined,
      }
    },
  },
})
