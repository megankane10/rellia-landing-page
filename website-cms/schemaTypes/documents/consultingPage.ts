import {defineField, defineType} from 'sanity'

export const consultingPage = defineType({
  name: 'consultingPage',
  title: 'Consulting page (/consulting)',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Consulting'}),
    defineField({name: 'seo', type: 'seo'}),
  ],
})

