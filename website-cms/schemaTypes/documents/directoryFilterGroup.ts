import {defineField, defineType} from 'sanity'

export const directoryFilterGroup = defineType({
  name: 'directoryFilterGroup',
  title: 'Directory filter group',
  type: 'document',
  description:
    'Create filter groups for directory pages (e.g. Specialty, Level, Expertise). Any group you add can appear on the directories.',
  groups: [
    {name: 'setup', title: 'Setup', default: true},
    {name: 'options', title: 'Options'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Group name',
      type: 'string',
      description: 'Shown above the dropdown on the directory page (e.g. Specialty).',
      validation: (Rule) => Rule.required(),
      group: 'setup',
    }),
    defineField({
      name: 'slug',
      title: 'Key (auto)',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description: 'Internal key. You usually don’t need to touch this.',
      validation: (Rule) => Rule.required(),
      group: 'setup',
    }),
    defineField({
      name: 'appliesTo',
      title: 'Show on',
      type: 'string',
      options: {
        list: [
          {title: 'Advisors directory', value: 'advisors'},
          {title: 'Founders directory', value: 'founders'},
          {title: 'Both directories', value: 'both'},
        ],
        layout: 'radio',
      },
      initialValue: 'both',
      validation: (Rule) => Rule.required(),
      group: 'setup',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      group: 'setup',
    }),
    defineField({
      name: 'options',
      title: 'Suggested options',
      type: 'array',
      description:
        'Optional: pre-fill the dropdown options. If you leave this empty, options will still appear based on what you assign on each advisor/company.',
      of: [
        defineField({
          name: 'option',
          title: 'Option',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
          ],
          preview: {
            select: {title: 'label'},
          },
        }),
      ],
      group: 'options',
    }),
  ],
  preview: {
    select: {title: 'title', appliesTo: 'appliesTo', order: 'sortOrder'},
    prepare({title, appliesTo, order}) {
      const where =
        appliesTo === 'advisors'
          ? 'Advisors'
          : appliesTo === 'founders'
            ? 'Founders'
            : 'Both'
      return {
        title: title || 'Untitled group',
        subtitle: `${where}${typeof order === 'number' ? ` · order ${order}` : ''}`,
      }
    },
  },
})

