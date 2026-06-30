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
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      description: 'Main headline on the 404 page.',
      group: 'content',
    }),
    defineField({
      name: 'message',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      description: 'Supporting line under the heading.',
      group: 'content',
    }),
    defineField({
      name: 'iconKey',
      title: 'Icon',
      type: 'string',
      description: 'Lucide icon name (e.g. search-alert).',
      initialValue: 'search-alert',
      group: 'content',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Primary button label',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'ctaPath',
      title: 'Primary button link',
      type: 'string',
      description: 'Redirect path (e.g. / or /contact). Defaults to / if left empty.',
      group: 'content',
    }),
    singletonSeoField,
  ],
})
