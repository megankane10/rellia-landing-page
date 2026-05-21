import {defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {singletonLayoutFields} from '../shared/singletonLayoutFields'

export const careersPage = defineType({
  name: 'careersPage',
  title: 'Careers page',
  type: 'document',
  groups: documentGroups,
  fieldsets: [FIELDSET_SEO],
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
      group: 'content',
    }),
    defineField({
      name: 'enableHiringTab',
      title: 'Enable Hiring tab',
      type: 'boolean',
      description:
        'Shows the Hiring tab and section. Hiring content is still pre-coded; this only controls visibility.',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'enableVolunteerTab',
      title: 'Enable Volunteer tab',
      type: 'boolean',
      description:
        'Shows the Volunteer tab and embedded form. Volunteer content is still pre-coded; this only controls visibility.',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'tabsLabelHiring',
      title: 'Hiring tab label',
      type: 'string',
      initialValue: 'Hiring',
      group: 'content',
    }),
    defineField({
      name: 'tabsLabelVolunteer',
      title: 'Volunteer tab label',
      type: 'string',
      initialValue: 'Volunteer',
      group: 'content',
    }),
    ...singletonLayoutFields,
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
})

