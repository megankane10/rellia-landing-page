import {defineField, defineType} from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: '404 page',
  type: 'document',
  groups: CONTENT_SEO_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({name: 'title', type: 'string', group: 'content'}),
    defineField({name: 'message', type: 'text', rows: 2, group: 'content'}),
    defineField({name: 'ctaLabel', type: 'string', group: 'content'}),
    singletonSeoField,
  ],
})
