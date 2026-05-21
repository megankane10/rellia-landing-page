import {defineField, defineType} from 'sanity'

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global settings',
  type: 'document',
  groups: [
    {name: 'theme', title: 'Design tokens', default: true},
    {name: 'footer', title: 'Footer'},
    {name: 'announcement', title: 'Announcement banner'},
    {name: 'legal', title: 'Legal'},
  ],
  fields: [
    defineField({
      name: 'themeColors',
      title: 'Theme colors',
      type: 'themeColors',
      description: 'Hex values injected as CSS variables on the marketing site.',
      group: 'theme',
    }),
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
      description: 'Shown in the footer and used for contact links.',
      group: 'footer',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL (legacy)',
      type: 'url',
      hidden: true,
      group: 'footer',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL (legacy)',
      type: 'url',
      hidden: true,
      group: 'footer',
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
      group: 'announcement',
    }),
    defineField({
      name: 'announcementButtonLabel',
      title: 'Announcement button label',
      type: 'string',
      group: 'announcement',
    }),
    defineField({
      name: 'announcementButtonLink',
      title: 'Announcement button link',
      type: 'string',
      description: 'Internal path or URL for the banner CTA.',
      group: 'announcement',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Global settings'}
    },
  },
})
