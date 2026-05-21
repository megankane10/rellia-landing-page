import {defineField, defineType} from 'sanity'

export const themeColors = defineType({
  name: 'themeColors',
  title: 'Theme colors',
  type: 'object',
  description: 'Hex values injected as CSS variables on the frontend (--rellia-primary, etc.).',
  options: {columns: 3},
  fields: [
    defineField({
      name: 'primary',
      title: 'Primary',
      type: 'string',
      description: 'Brand teal — e.g. #0D3540',
      validation: (Rule) =>
        Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {name: 'hex'}).warning('Use a hex color like #0D3540'),
    }),
    defineField({
      name: 'secondary',
      title: 'Secondary',
      type: 'string',
      description: 'Supporting surface — e.g. #EEF2F2',
      validation: (Rule) =>
        Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {name: 'hex'}).warning('Use a hex color'),
    }),
    defineField({
      name: 'accent',
      title: 'Accent',
      type: 'string',
      description: 'Mint highlight — e.g. #9DD6D0',
      validation: (Rule) =>
        Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {name: 'hex'}).warning('Use a hex color'),
    }),
  ],
})
