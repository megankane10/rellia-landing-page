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
    defineField({
      name: 'headlinePortable',
      title: 'Page headline',
      type: 'inlineHeroHeadline',
      description: 'Use Mint or Teal decorators on words/phrases for color (toolbar).',
      group: 'content',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'subheadline', title: 'Subtitle', type: 'text', rows: 2, group: 'content'}),
    defineField({name: 'seo', type: 'seoFields', group: 'seo', fieldset: 'seo'}),
  ],
})

