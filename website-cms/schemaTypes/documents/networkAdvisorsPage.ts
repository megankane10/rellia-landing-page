import {defineField, defineType} from 'sanity'
import {publishingGroup, pageVisibilityFields} from '../shared/pageVisibilityFields'

export const networkAdvisorsPage = defineType({
  name: 'networkAdvisorsPage',
  title: 'Network — Advisors page (/advisors)',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    publishingGroup,
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Advisors',
      group: 'content',
    }),
    ...pageVisibilityFields,
  ],
})
