import {defineField, defineType} from 'sanity'
import {studioListMedia} from '../shared/studioListMedia'

export const navigation = defineType({
  name: 'navigation',
  title: 'Site navigation',
  type: 'document',
  description: 'Header navigation and footer column links.',
  groups: [
    {name: 'header', title: 'Header', default: true},
    {name: 'footer', title: 'Footer columns'},
  ],
  fields: [
    defineField({
      name: 'primary',
      title: 'Header links',
      description: 'Top-level navbar entries. Add submenu links under each item’s “Submenu items” array.',
      type: 'array',
      of: [{type: 'navItem'}],
      group: 'header',
      options: {sortable: true},
    }),
    defineField({
      name: 'footer',
      title: 'Footer columns',
      description: 'Each entry becomes a column heading. Add links under “Submenu items”.',
      type: 'array',
      of: [{type: 'navItem'}],
      group: 'footer',
      options: {sortable: true},
    }),
  ],
  preview: {
    select: {
      primaryCount: 'primary.length',
      footerCount: 'footer.length',
    },
    prepare({primaryCount, footerCount}) {
      const headerLabel = `${primaryCount ?? 0} header link${primaryCount === 1 ? '' : 's'}`
      const footerLabel = `${footerCount ?? 0} footer column${footerCount === 1 ? '' : 's'}`
      return {
        title: 'Site navigation',
        subtitle: `${headerLabel} · ${footerLabel}`,
        media: studioListMedia.navigation,
      }
    },
  },
})
