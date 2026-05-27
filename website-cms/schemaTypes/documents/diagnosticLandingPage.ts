import {defineArrayMember, defineField, defineType} from 'sanity'
import {seoField} from '../shared/seoField'
import {publishingGroup, pageVisibilityFields} from '../shared/pageVisibilityFields'
import {pageSectionMembers} from '../shared/pageSectionMembers'
import {studioListMedia} from '../shared/studioListMedia'

export const diagnosticLandingPage = defineType({
  name: 'diagnosticLandingPage',
  title: 'Startup diagnostic landing (/startup-diagnostic)',
  type: 'document',
  groups: [
    {name: 'content', title: 'Page content', default: true},
    publishingGroup,
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Startup Diagnostic',
      group: 'content',
    }),
    defineField({
      name: 'useModularPage',
      title: 'Use modular CMS layout',
      type: 'boolean',
      initialValue: false,
      description:
        'When off (default), visitors see the full designed diagnostic landing page. When on, only the section stack below is rendered.',
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Modular sections',
      type: 'array',
      group: 'content',
      of: pageSectionMembers,
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
    seoField,
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
