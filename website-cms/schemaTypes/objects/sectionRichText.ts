import {defineField, defineType} from 'sanity'

export const sectionRichText = defineType({
  name: 'sectionRichText',
  title: 'Section: Rich text',
  type: 'object',
  fields: [
    defineField({name: 'tag', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'body', type: 'portableRichText'}),
  ],
})
