import {defineField, defineType} from 'sanity'

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global settings',
  type: 'document',
  groups: [
    {name: 'footer', title: 'Footer', default: true},
    {name: 'social', title: 'Social links'},
    {name: 'legal', title: 'Legal'},
  ],
  fields: [
    defineField({
      name: 'footerTagline',
      title: 'Footer tagline',
      type: 'text',
      rows: 3,
      description: 'Short supporting line shown above the footer links.',
      group: 'footer',
    }),
    defineField({
      name: 'supportEmail',
      title: 'Support email',
      type: 'string',
      description: 'Shown in the footer and used for “Contact” type links.',
      group: 'footer',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'copyrightLine',
      title: 'Copyright line',
      type: 'string',
      description: 'Example: © 2026 Rellia Health. All rights reserved.',
      group: 'legal',
    }),
  ],
})
