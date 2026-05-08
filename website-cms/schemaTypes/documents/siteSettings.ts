import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'settings', title: 'Settings', default: true},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fields: [
    defineField({name: 'siteName', type: 'string', initialValue: 'Rellia Health', group: 'settings'}),
    defineField({name: 'logo', type: 'image', options: {hotspot: true}, group: 'settings'}),
    defineField({
      name: 'brand',
      type: 'object',
      group: 'settings',
      fields: [
        defineField({name: 'primary', type: 'string', description: 'Hex color'}),
        defineField({name: 'accent', type: 'string', description: 'Hex color'}),
        defineField({name: 'background', type: 'string', description: 'Hex color'}),
      ],
    }),
    defineField({name: 'defaultSeo', type: 'seo', group: 'seo'}),
  ],
})
