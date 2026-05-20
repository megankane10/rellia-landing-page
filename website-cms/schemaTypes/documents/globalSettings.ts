import {defineField, defineType} from 'sanity'

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global settings',
  type: 'document',
  groups: [
    {name: 'footer', title: 'Footer', default: true},
    {name: 'social', title: 'Social links'},
    {name: 'legal', title: 'Legal'},
    {name: 'announcement', title: 'Announcement banner'},
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
    defineField({
      name: 'announcementEnabled',
      title: 'Announcement enabled',
      type: 'boolean',
      description: 'Show or hide the announcement banner at the top of the page.',
      group: 'announcement',
    }),
    defineField({
      name: 'announcementText',
      title: 'Announcement text',
      type: 'string',
      description: 'The text message shown in the banner.',
      group: 'announcement',
    }),
    defineField({
      name: 'announcementButtonLabel',
      title: 'Announcement button label',
      type: 'string',
      description: 'Label for the CTA button in the banner.',
      group: 'announcement',
    }),
    defineField({
      name: 'announcementButtonLink',
      title: 'Announcement button link',
      type: 'string',
      description: 'URL target path for the CTA button in the banner.',
      group: 'announcement',
    }),
  ],
})
