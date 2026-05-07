import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({name: 'siteName', type: 'string', initialValue: 'Rellia Health'}),
    defineField({name: 'logo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'brand',
      type: 'object',
      fields: [
        defineField({name: 'primary', type: 'string', description: 'Hex color'}),
        defineField({name: 'accent', type: 'string', description: 'Hex color'}),
        defineField({name: 'background', type: 'string', description: 'Hex color'}),
      ],
    }),
    defineField({name: 'defaultSeo', type: 'seo'}),
  ],
})
