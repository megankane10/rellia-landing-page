import {defineField, defineType} from 'sanity'

export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation item',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Visible',
      type: 'boolean',
      description: 'Toggle visibility in navbar/footer without deleting the item.',
      initialValue: true,
    }),
    defineField({
      name: 'label',
      title: 'Label (what visitors see)',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Site path (e.g. /about) or full https URL',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description (optional submenu copy)',
      type: 'string',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Optional small label shown next to the link (e.g. New, Waitlist).',
    }),
    defineField({
      name: 'children',
      title: 'Submenu items',
      type: 'array',
      of: [{type: 'navItem'}],
      description: 'Optional nested menu items. Leave empty for a single-link entry.',
    }),
  ],
  preview: {
    select: {
      label: 'label',
      href: 'href',
      badge: 'badge',
      enabled: 'enabled',
      childCount: 'children.length',
    },
    prepare({label, href, badge, enabled, childCount}) {
      const title = label?.trim() || 'Untitled item'
      const subtitleParts: string[] = []
      if (typeof href === 'string' && href.trim()) subtitleParts.push(href.trim())
      if (typeof childCount === 'number' && childCount > 0) {
        subtitleParts.push(`${childCount} sub-item${childCount === 1 ? '' : 's'}`)
      }
      if (badge) subtitleParts.push(`badge: ${badge}`)
      if (enabled === false) subtitleParts.push('hidden')
      return {
        title: enabled === false ? `${title}  (hidden)` : title,
        subtitle: subtitleParts.join('  ·  ') || undefined,
      }
    },
  },
})
