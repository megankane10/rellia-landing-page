import {defineField, defineType} from 'sanity'

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: '404 page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'message', type: 'text', rows: 2}),
    defineField({name: 'ctaLabel', type: 'string'}),
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
})
