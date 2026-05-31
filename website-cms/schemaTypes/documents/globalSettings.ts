import {defineField, defineType} from 'sanity'
import {studioListMedia} from '../shared/studioListMedia'

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global settings',
  type: 'document',
  groups: [
    {name: 'theme', title: 'Design tokens', default: true},
    {name: 'footer', title: 'Footer'},
    {name: 'announcement', title: 'Bottom popup'},
    {name: 'priorityModal', title: 'Priority modal'},
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
      title: 'LinkedIn URL',
      type: 'url',
      group: 'footer',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
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
      title: 'Enable bottom popup',
      type: 'boolean',
      description:
        'When on, the bottom popup shows after ~4 seconds if popup message text is set below. Turn off to hide the popup even when message text exists. Visitors who dismiss it will not see it again until they clear site data / use a new browser session.',
      initialValue: false,
      group: 'announcement',
    }),
    defineField({
      name: 'announcementText',
      title: 'Popup message',
      type: 'text',
      rows: 3,
      description: 'Main message text for the bottom popup.',
      group: 'announcement',
    }),
    defineField({
      name: 'announcementPillText',
      title: 'Status pill',
      type: 'string',
      description: 'Short label above the message (e.g. LIVE, NEW). Defaults to LIVE.',
      initialValue: 'LIVE',
      group: 'announcement',
    }),
    defineField({
      name: 'announcementButtonLabel',
      title: 'Button label',
      type: 'string',
      description: 'Leave empty to hide the button.',
      group: 'announcement',
    }),
    defineField({
      name: 'announcementButtonLink',
      title: 'Button link',
      type: 'string',
      description: 'Internal path (e.g. /programs/…) or full https URL.',
      group: 'announcement',
    }),
    defineField({
      name: 'priorityModalEnabled',
      title: 'Enable priority modal',
      type: 'boolean',
      description:
        'Shows a centered modal for high-importance messages. Takes precedence over the bottom popup until dismissed.',
      initialValue: false,
      group: 'priorityModal',
    }),
    defineField({
      name: 'priorityModalHeading',
      title: 'Heading',
      type: 'string',
      group: 'priorityModal',
    }),
    defineField({
      name: 'priorityModalBody',
      title: 'Body text',
      type: 'text',
      rows: 5,
      group: 'priorityModal',
    }),
    defineField({
      name: 'priorityModalImage',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Optional hero image at the top of the modal.',
      group: 'priorityModal',
    }),
    defineField({
      name: 'priorityModalPillText',
      title: 'Status pill (optional)',
      type: 'string',
      description: 'e.g. IMPORTANT, NEW — leave empty to hide the pill.',
      group: 'priorityModal',
    }),
    defineField({
      name: 'priorityModalButtonLabel',
      title: 'Button label',
      type: 'string',
      description: 'Leave empty to hide the primary button.',
      group: 'priorityModal',
    }),
    defineField({
      name: 'priorityModalButtonLink',
      title: 'Button link',
      type: 'string',
      description: 'Internal path or full https URL.',
      group: 'priorityModal',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global settings',
        subtitle: 'Footer, popups & theme',
        media: studioListMedia.settings,
      }
    },
  },
})
