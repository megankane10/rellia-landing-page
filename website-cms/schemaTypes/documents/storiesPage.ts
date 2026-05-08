import {defineField, defineType} from 'sanity'

export const storiesPage = defineType({
  name: 'storiesPage',
  title: 'Stories page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({name: 'headline', type: 'string'}),
    defineField({name: 'subheadline', type: 'text', rows: 2}),
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
})

