import {defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionRichText = defineType({
  name: 'sectionRichText',
  title: 'Rich text',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({name: 'tag', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'body', type: 'portableRichText'}),
  ],
  preview: sectionListPreview({typeLabel: 'Rich text', fallback: 'Rich text'}),
})
