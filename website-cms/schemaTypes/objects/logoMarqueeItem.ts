import {defineArrayMember, defineField, defineType} from 'sanity'

/** Logo in a horizontal scroll (investors / founders pages). */
export const logoMarqueeItem = defineType({
  name: 'logoMarqueeItem',
  title: 'Logo',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link (optional)',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'name', media: 'logo'},
  },
})

export const logoMarqueeField = defineField({
  name: 'logoMarquee',
  title: 'Logo scroll',
  type: 'array',
  description: 'Logos in the page marquee. Drag to reorder. Empty list uses site defaults.',
  of: [defineArrayMember({type: 'logoMarqueeItem'})],
  options: {sortable: true},
})
