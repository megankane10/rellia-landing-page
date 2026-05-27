import {defineField, defineType} from 'sanity'
import {seoField} from '../shared/seoField'

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy policy',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Privacy policy',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'intro',
      title: 'Header subtitle',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective date',
      type: 'string',
      initialValue: 'March 18, 2026',
      group: 'content',
    }),
    defineField({
      name: 'legalNotice',
      title: 'Legal notice (below effective date)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Page content',
      type: 'portableRichText',
      description: 'Use headings (H2/H3), paragraphs, and bullet lists for each section.',
      group: 'content',
    }),
    seoField,
  ],
  preview: {
    prepare() {
      return {title: 'Privacy policy'}
    },
  },
})
