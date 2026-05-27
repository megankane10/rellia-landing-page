import {defineArrayMember, defineField, defineType} from 'sanity'
import {seoField} from '../shared/seoField'
import {publishingGroup, pageVisibilityFields} from '../shared/pageVisibilityFields'
import {pageSectionMembers} from '../shared/pageSectionMembers'
import {studioListMedia} from '../shared/studioListMedia'

export const consultingPage = defineType({
  name: 'consultingPage',
  title: 'Consulting page (/consulting)',
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
      initialValue: 'Consulting',
      group: 'content',
    }),
    defineField({
      name: 'useModularPage',
      title: 'Use modular CMS layout',
      type: 'boolean',
      initialValue: false,
      description:
        'When off (default), visitors see the full designed consulting page. When on, only the modular section stack below is rendered.',
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Modular sections',
      type: 'array',
      group: 'content',
      of: pageSectionMembers,
    }),
    ...pageVisibilityFields,
    seoField,
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
