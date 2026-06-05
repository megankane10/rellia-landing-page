import {defineField, defineType} from 'sanity'
import {publishingGroup, pageVisibilityFields} from '../shared/pageVisibilityFields'
import {studioListMedia} from '../shared/studioListMedia'

export const diagnosticLandingPage = defineType({
  name: 'diagnosticLandingPage',
  title: 'Startup diagnostic landing (/startup-diagnostic)',
  type: 'document',
  groups: [
    {name: 'content', title: 'Page content', default: true},
    publishingGroup,
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Startup Diagnostic',
      group: 'content',
    }),
    defineField({
      name: 'surveyNote',
      title: 'Survey page note (editors)',
      type: 'text',
      rows: 3,
      readOnly: true,
      initialValue:
        'The interactive survey at /diagnostic-survey is driven by the app (questions & scoring). Edit this landing page for marketing copy; contact engineering to change survey logic.',
      group: 'content',
    }),
    ...pageVisibilityFields,
  ],
  preview: {
    prepare() {
      return {
        title: 'Startup diagnostic landing',
        subtitle: '/startup-diagnostic',
        media: studioListMedia.document,
      }
    },
  },
})
