import {defineField, defineType} from 'sanity'

export const storiesPage = defineType({
  name: 'storiesPage',
  title: 'Stories page',
  type: 'document',
  fields: [
    defineField({name: 'headline', type: 'string'}),
    defineField({name: 'subheadline', type: 'text', rows: 2}),
    defineField({name: 'seo', type: 'seo'}),
  ],
})

