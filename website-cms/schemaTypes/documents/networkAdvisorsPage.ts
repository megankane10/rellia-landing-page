import {defineField, defineType} from 'sanity'

export const networkAdvisorsPage = defineType({
  name: 'networkAdvisorsPage',
  title: 'Network — Advisors page (/advisors)',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Advisors'}),
    defineField({name: 'seo', type: 'seo'}),
  ],
})

