import {defineField, defineType} from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Site navigation',
  type: 'document',
  description:
    'Edit the links shown in the top navbar and the footer. Each entry has a label, a link, and an optional submenu.',
  groups: [
    {name: 'header', title: 'Header (top navbar)'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({
      name: 'primary',
      title: 'Header links',
      description:
        'Top-level entries shown in the navbar. Add submenu items with the “Submenu items” array on each entry.',
      type: 'array',
      of: [{type: 'navItem'}],
      group: 'header',
    }),
    defineField({
      name: 'footer',
      title: 'Footer columns',
      description:
        'Each top-level entry becomes a column heading in the footer. Add the column links under “Submenu items”.',
      type: 'array',
      of: [{type: 'navItem'}],
      group: 'footer',
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
        subtitle: `${headerLabel}  ·  ${footerLabel}`,
      }
    },
  },
})
