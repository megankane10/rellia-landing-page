import {defineField, defineType} from 'sanity'
import {publishingGroup, pageVisibilityFields} from '../shared/pageVisibilityFields'

export const networkPartnersPage = defineType({
  name: 'networkPartnersPage',
  title: 'Network — Industry Partners page (/industry-partners)',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    publishingGroup,
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Industry Partners',
      group: 'content',
    }),
    ...pageVisibilityFields,
  ],
})
