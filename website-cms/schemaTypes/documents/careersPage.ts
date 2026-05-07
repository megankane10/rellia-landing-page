import {defineField, defineType} from 'sanity'

export const careersPage = defineType({
  name: 'careersPage',
  title: 'Careers page',
  type: 'document',
  fields: [
    defineField({
      name: 'defaultTab',
      title: 'Default tab',
      type: 'string',
      options: {
        list: [
          {title: 'Hiring', value: 'hiring'},
          {title: 'Volunteer', value: 'volunteer'},
        ],
        layout: 'radio',
      },
      initialValue: 'hiring',
    }),
    defineField({
      name: 'enableHiringTab',
      title: 'Enable Hiring tab',
      type: 'boolean',
      description:
        'Shows the Hiring tab and section. Hiring content is still pre-coded; this only controls visibility.',
      initialValue: true,
    }),
    defineField({
      name: 'enableVolunteerTab',
      title: 'Enable Volunteer tab',
      type: 'boolean',
      description:
        'Shows the Volunteer tab and embedded form. Volunteer content is still pre-coded; this only controls visibility.',
      initialValue: true,
    }),
    defineField({
      name: 'tabsLabelHiring',
      title: 'Hiring tab label',
      type: 'string',
      initialValue: 'Hiring',
    }),
    defineField({
      name: 'tabsLabelVolunteer',
      title: 'Volunteer tab label',
      type: 'string',
      initialValue: 'Volunteer',
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
})

