import {defineField, defineType} from 'sanity'

/** Flat default SEO for Site settings — avoids nested seoFields tabs on globals. */
export const siteDefaultSeo = defineType({
  name: 'siteDefaultSeo',
  title: 'Default SEO',
  type: 'object',
  options: {columns: 1},
  fields: [
    defineField({
      name: 'title',
      title: 'Default meta title',
      type: 'string',
      description: 'Used when a page has no SEO title. Aim for 50–60 characters.',
    }),
    defineField({
      name: 'description',
      title: 'Default meta description',
      type: 'text',
      rows: 3,
      description: 'Used when a page has no meta description. Aim for 150–160 characters.',
    }),
    defineField({
      name: 'metaImage',
      title: 'Default share image',
      type: 'image',
      options: {hotspot: true},
      description: 'Open Graph / social preview when a page has no image. 1200×630 recommended.',
    }),
    defineField({
      name: 'noIndex',
      title: 'No index (site-wide default)',
      type: 'boolean',
      initialValue: false,
      description: 'Only applies as a fallback when a page leaves robots blank.',
    }),
  ],
})
