import {defineField, defineType} from 'sanity'
import {MODULAR_PAGE_SECTIONS_DESCRIPTION, pageSectionMembers} from '../shared/pageSectionMembers'
import {pageVisibilityFields, publishingGroup} from '../shared/pageVisibilityFields'

const RESERVED_PAGE_SLUGS = [
  'about',
  'faq',
  'careers',
  'programs',
  'events',
  'contact',
  'apply',
  'membership',
  'consulting',
  'stories',
  'founders',
  'advisors',
  'investors',
  'industry-partners',
  'partners',
  'terms',
  'privacy',
  'policy',
  'admin',
  'studio',
  'network',
  'startup-diagnostic',
  'diagnostic-survey',
  'survey',
  'diagnostics',
]

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & metadata'},
    publishingGroup,
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata', options: {collapsible: true, collapsed: true}}],
  fields: [
    ...pageVisibilityFields,
    defineField({
      name: 'title',
      type: 'string',
      description: 'Page name shown in Studio and used for SEO if not overridden',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'URL path (e.g. partner-program becomes /partner-program)',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          const current = typeof slug?.current === 'string' ? slug.current.trim().toLowerCase() : ''
          if (!current) return 'Slug is required'
          if (RESERVED_PAGE_SLUGS.includes(current)) {
            return `"/${current}" is a fixed site route. Edit the dedicated page under Pages instead of creating a modular page.`
          }
          return true
        }),
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      of: pageSectionMembers,
      description: MODULAR_PAGE_SECTIONS_DESCRIPTION,
      group: 'content',
    }),
    defineField({
      name: 'seo',
      title: 'SEO & metadata',
      type: 'seoFields',
      fieldset: 'seo',
      group: 'seo',
    }),
  ],
})
