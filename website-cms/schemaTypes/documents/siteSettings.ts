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
      description: 'Used on white and cream sections. Upload a wide logo with transparent background.',
      group: 'brand',
    }),
    defineField({
      name: 'logoDark',
      title: 'Main logo (dark / teal backgrounds)',
      type: 'image',
      options: {hotspot: true},
      description: 'Used on teal heroes and dark bands. Often a light-colored variant.',
      group: 'brand',
    }),
    defineField({
      name: 'faviconPath',
      title: 'Favicon path',
      type: 'string',
      initialValue: '/favicon.ico',
      description: 'Static path on the marketing site (from public/). Default: /favicon.ico',
      group: 'brand',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
      options: {layout: 'list'},
      group: 'social',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO fallback',
      type: 'siteDefaultSeo',
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
