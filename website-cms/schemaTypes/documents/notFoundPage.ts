import {defineField, defineType} from 'sanity'
import {singletonLayoutFields} from '../shared/singletonLayoutFields'

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: '404 page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'content'}),
    defineField({name: 'message', type: 'text', rows: 2, group: 'content'}),
    defineField({name: 'ctaLabel', type: 'string', group: 'content'}),
    ...singletonLayoutFields,
  ],
})
