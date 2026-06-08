import {defineField, defineType} from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'

export const networkPartnersPage = defineType({
  name: 'networkPartnersPage',
  title: 'Network — Industry Partners page (/industry-partners)',
  type: 'document',
  groups: CONTENT_SEO_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Industry Partners',
      group: 'content',
    }),
    singletonSeoField,
  ],
})
