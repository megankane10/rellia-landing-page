import {defineField} from 'sanity'

export const showBadgeField = defineField({
  name: 'showBadge',
  title: 'Show tag / badge',
  type: 'boolean',
  initialValue: true,
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

export const lucideIconField = (description?: string) =>
  defineField({
    name: 'icon',
    title: 'Icon',
    type: 'string',
    description: description ?? 'Lucide icon name (e.g. Users, Rocket, ShieldCheck). Leave empty to hide.',
    options: {
      layout: 'dropdown',
      list: [
        {title: 'Sparkles', value: 'Sparkles'},
        {title: 'Users', value: 'Users'},
        {title: 'ShieldCheck', value: 'ShieldCheck'},
        {title: 'Target', value: 'Target'},
        {title: 'Layers', value: 'Layers'},
        {title: 'Heart', value: 'Heart'},
        {title: 'Rocket', value: 'Rocket'},
        {title: 'Zap', value: 'Zap'},
        {title: 'Compass', value: 'Compass'},
        {title: 'Stethoscope', value: 'Stethoscope'},
        {title: 'ClipboardCheck', value: 'ClipboardCheck'},
        {title: 'ArrowRight', value: 'ArrowRight'},
      ],
    },
  })
