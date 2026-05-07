import {defineField, defineType} from 'sanity'

export const networkFoundersPage = defineType({
  name: 'networkFoundersPage',
  title: 'Network — Founders page (/founders)',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Founders'}),
    defineField({name: 'seo', type: 'seo'}),
  ],
})

