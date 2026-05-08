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
      name: 'headline',
      title: 'Headline (first part)',
      type: 'string',
      description: 'e.g. “Rellia” — shown before the accent phrase.',
      group: 'content',
    }),
    defineField({
      name: 'headlineAccent',
      title: 'Accent phrase (mint)',
      type: 'string',
      description: 'e.g. “Stories” — shown in mint after the headline.',
      group: 'content',
    }),
    defineField({name: 'subheadline', title: 'Subtitle', type: 'text', rows: 2, group: 'content'}),
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
})

