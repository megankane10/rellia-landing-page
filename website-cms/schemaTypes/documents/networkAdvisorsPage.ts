import {defineField, defineType} from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'

export const networkAdvisorsPage = defineType({
  name: 'networkAdvisorsPage',
  title: 'Network — Advisors page (/advisors)',
  type: 'document',
  groups: CONTENT_SEO_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Advisors',
      group: 'content',
    }),
    singletonSeoField,
  ],
})
