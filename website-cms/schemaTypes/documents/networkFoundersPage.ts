import {defineField, defineType} from 'sanity'
import {logoMarqueeField} from '../objects/logoMarqueeItem'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'

export const networkFoundersPage = defineType({
  name: 'networkFoundersPage',
  title: 'Network — Founders page (/founders)',
  type: 'document',
  groups: CONTENT_SEO_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Founders',
      group: 'content',
    }),
    {...logoMarqueeField, group: 'content'},
    singletonSeoField,
  ],
})
