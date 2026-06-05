import {defineField, defineType} from 'sanity'
import {publishingGroup, pageVisibilityFields} from '../shared/pageVisibilityFields'
import {studioListMedia} from '../shared/studioListMedia'

export const consultingPage = defineType({
  name: 'consultingPage',
  title: 'Consulting page (/consulting)',
  type: 'document',
  groups: [
    {name: 'content', title: 'Page content', default: true},
    publishingGroup,
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Consulting',
      group: 'content',
    }),
    ...pageVisibilityFields,
  ],
  preview: {
    prepare() {
      return {
        title: 'Consulting page',
        subtitle: '/consulting',
        media: studioListMedia.document,
      }
    },
  },
})
