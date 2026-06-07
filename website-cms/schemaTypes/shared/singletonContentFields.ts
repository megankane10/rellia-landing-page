import {defineField} from 'sanity'
import {FIELDSET_SEO, GROUP_CONTENT, GROUP_SEO} from './fieldGroups'
import {pageSectionMembers} from './pageSectionMembers'
import {seoField} from './seoField'

export const CONTENT_SEO_GROUPS = [GROUP_CONTENT, GROUP_SEO]

export const singletonSeoField = seoField

export const singletonSectionsField = defineField({
  name: 'sections',
  title: 'Page sections',
  type: 'array',
  of: pageSectionMembers,
  group: 'content',
})

export const sectionDividerFieldset = (name: string, title: string) => ({
  name,
  title,
  options: {collapsible: false},
})

export const CONTENT_SEO_FIELDSETS = [FIELDSET_SEO]
