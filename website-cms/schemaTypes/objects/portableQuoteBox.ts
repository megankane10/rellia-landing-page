import {defineField, defineType} from 'sanity'

/** Branded pull-quote block — insert from rich text (+) alongside CTA box and carousel. */
export const portableQuoteBox = defineType({
  name: 'portableQuoteBox',
  title: 'Quote box',
  type: 'object',
  fields: [
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
