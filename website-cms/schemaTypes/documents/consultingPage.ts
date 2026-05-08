import {defineField, defineType} from 'sanity'

export const consultingPage = defineType({
  name: 'consultingPage',
  title: 'Consulting page (/consulting)',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Consulting', group: 'content'}),
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
})

