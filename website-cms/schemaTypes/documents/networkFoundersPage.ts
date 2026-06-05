import {defineField, defineType} from 'sanity'
import {logoMarqueeField} from '../objects/logoMarqueeItem'
import {publishingGroup, pageVisibilityFields} from '../shared/pageVisibilityFields'

export const networkFoundersPage = defineType({
  name: 'networkFoundersPage',
  title: 'Network — Founders page (/founders)',
  type: 'document',
  groups: [
    {name: 'content', title: 'Page content', default: true},
    publishingGroup,
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Founders',
      group: 'content',
    }),
    {...logoMarqueeField, group: 'content'},
    ...pageVisibilityFields,
  ],
})
