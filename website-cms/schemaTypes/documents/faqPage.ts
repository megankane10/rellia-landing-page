import {defineField, defineType} from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSectionsField,
  singletonSeoField,
} from '../shared/singletonContentFields'

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ page',
  type: 'document',
  groups: CONTENT_SEO_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({name: 'badge', type: 'string', group: 'content'}),
    defineField({name: 'title', type: 'string', group: 'content'}),
    defineField({name: 'subtitle', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'items',
      type: 'array',
      group: 'content',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          fields: [
            {name: 'id', type: 'string'},
            {name: 'question', type: 'string'},
            {name: 'answer', type: 'text', rows: 6},
          ],
        }),
      ],
    }),
    defineField({name: 'sidebarTitle', type: 'string', group: 'content'}),
    defineField({name: 'sidebarBody', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'sidebarCtaLabel', type: 'string', group: 'content'}),
    defineField({name: 'sidebarCtaPath', type: 'string', group: 'content'}),
    defineField({name: 'bottomTitle', type: 'string', group: 'content'}),
    defineField({name: 'bottomBody', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'bottomCtaLabel', type: 'string', group: 'content'}),
    defineField({name: 'bottomCtaPath', type: 'string', group: 'content'}),
    singletonSectionsField,
    singletonSeoField,
  ],
})
