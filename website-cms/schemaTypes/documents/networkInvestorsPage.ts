import {defineField, defineType} from 'sanity'

export const networkInvestorsPage = defineType({
  name: 'networkInvestorsPage',
  title: 'Network — Investors page (/investors)',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Investors'}),
    defineField({name: 'seo', type: 'seo'}),
  ],
})

