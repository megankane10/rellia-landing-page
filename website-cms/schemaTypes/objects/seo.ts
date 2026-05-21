import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO & social',
  type: 'object',
  options: {columns: 1},
  fieldsets: [
    {name: 'meta', title: 'Search metadata', options: {columns: 1}},
    {name: 'social', title: 'Open Graph', options: {columns: 2}},
    {name: 'indexing', title: 'Indexing', options: {columns: 2}},
  ],
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      fieldset: 'meta',
      description: 'Max 60 characters recommended for Google results.',
      validation: (Rule) =>
        Rule.max(60).warning('Keep meta titles at 60 characters or fewer for best display in search results'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 4,
      fieldset: 'meta',
      description: 'Max 160 characters recommended.',
      validation: (Rule) =>
        Rule.max(160).warning('Keep meta descriptions at 160 characters or fewer'),
    }),
    defineField({
      name: 'focusKeywords',
      title: 'Focus keywords',
      type: 'array',
      of: [{type: 'string'}],
      fieldset: 'meta',
      options: {layout: 'tags'},
      description: 'Editorial keywords for internal reference (not rendered as a meta keywords tag).',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'social',
      description: '1200×630 recommended. Falls back to site default when empty.',
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph title',
      type: 'string',
      fieldset: 'social',
      description: 'Optional override. Defaults to meta title.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph description',
      type: 'text',
      rows: 3,
      fieldset: 'social',
      description: 'Optional override. Defaults to meta description.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      fieldset: 'meta',
      description: 'Optional absolute canonical URL. Leave blank to use the current page URL.',
    }),
    defineField({
      name: 'noIndex',
      title: 'No index',
      type: 'boolean',
      initialValue: false,
      fieldset: 'indexing',
    }),
    defineField({
      name: 'noFollow',
      title: 'No follow',
      type: 'boolean',
      initialValue: false,
      fieldset: 'indexing',
    }),
  ],
})
