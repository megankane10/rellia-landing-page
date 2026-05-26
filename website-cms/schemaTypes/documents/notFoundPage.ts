import {defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {singletonLayoutFields} from '../shared/singletonLayoutFields'

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: '404 page',
  type: 'document',
  groups: documentGroups,
  fieldsets: [FIELDSET_SEO],
  fields: [
    defineField({name: 'title', type: 'string', group: 'content'}),
    defineField({name: 'message', type: 'text', rows: 2, group: 'content'}),
    defineField({name: 'ctaLabel', type: 'string', group: 'content'}),
    ...singletonLayoutFields,
    defineField({name: 'seo', type: 'seoFields', group: 'seo', fieldset: 'seo'}),
  ],
})
