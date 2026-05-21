import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'brand', title: 'Brand', default: true},
    {name: 'social', title: 'Social links'},
    {name: 'seo', title: 'Default SEO'},
  ],
  fieldsets: [
    {name: 'logos', title: 'Logos', options: {columns: 3}},
    {name: 'seoDefaults', title: 'Global SEO fallback', options: {columns: 1}},
  ],
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand name',
      type: 'string',
      initialValue: 'Rellia Health',
      validation: (Rule) => Rule.required(),
      group: 'brand',
    }),
    defineField({
      name: 'logoLight',
      title: 'Main logo (light backgrounds)',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'logos',
      group: 'brand',
    }),
    defineField({
      name: 'logoDark',
      title: 'Main logo (dark / teal backgrounds)',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'logos',
      group: 'brand',
    }),
    defineField({
      name: 'faviconPath',
      title: 'Favicon path',
      type: 'string',
      initialValue: '/favicon.ico',
      description: 'Static path served from public/ (default: /favicon.ico).',
      fieldset: 'logos',
      group: 'brand',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
      group: 'social',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO fallback',
      type: 'seo',
      fieldset: 'seoDefaults',
      group: 'seo',
      description: 'Used when a page does not define its own SEO fields.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site settings'}
    },
  },
})
