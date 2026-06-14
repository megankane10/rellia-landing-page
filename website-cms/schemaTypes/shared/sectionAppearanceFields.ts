import {defineField} from 'sanity'

export const showBadgeField = defineField({
  name: 'showBadge',
  title: 'Show tag / badge',
  type: 'boolean',
  initialValue: true,
})

export const showSectionTagField = defineField({
  name: 'showTag',
  title: 'Show section tag',
  type: 'boolean',
  initialValue: true,
})

export const sectionTagField = defineField({
  name: 'tag',
  title: 'Section tag',
  type: 'string',
  description: 'Eyebrow pill above the section heading (matches Network impact styling on the site).',
  hidden: ({parent}) => parent?.showTag === false,
})

export const headingToneField = defineField({
  name: 'headingTone',
  title: 'Heading & subheading color',
  type: 'string',
  options: {
    list: [
      {title: 'Auto (match background)', value: 'auto'},
      {title: 'Light (white text)', value: 'light'},
      {title: 'Dark (black text)', value: 'dark'},
    ],
    layout: 'radio',
  },
  initialValue: 'auto',
})

export const sectionBackgroundField = defineField({
  name: 'background',
  title: 'Section background',
  type: 'string',
  options: {
    list: [
      {title: 'White', value: 'white'},
      {title: 'Teal', value: 'teal'},
      {title: 'Cream', value: 'cream'},
    ],
    layout: 'radio',
  },
  initialValue: 'white',
})

export {lucideIconField} from './iconKeyField'
