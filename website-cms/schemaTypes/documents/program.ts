import {defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {seoField} from '../shared/seoField'
import {pageBuilderField} from '../shared/pageBuilderField'

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  groups: [...documentGroups, {name: 'publishing', title: 'Publishing'}],
  fieldsets: [FIELDSET_SEO],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'scheduleDetails',
      title: 'Schedule details',
      type: 'text',
      rows: 4,
      description: 'Cohort dates, duration, or cadence shown on cards and detail pages.',
      group: 'content',
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration link',
      type: 'string',
      description: 'Apply, waitlist, or external registration URL.',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Program image',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),
    defineField({
      name: 'imageSrc',
      title: 'Program image URL (legacy)',
      type: 'string',
      hidden: true,
      group: 'content',
    }),
    defineField({
      name: 'buttonText',
      type: 'string',
      initialValue: 'Learn more',
      group: 'content',
    }),
    defineField({
      name: 'href',
      title: 'Program link',
      type: 'string',
      description: 'Usually /programs/<slug> for detail pages.',
      group: 'content',
    }),
    defineField({
      name: 'waitlistHref',
      title: 'Waitlist link',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Waitlist', value: 'waitlist'},
          {title: 'Hidden', value: 'hidden'},
        ],
      },
      initialValue: 'available',
      group: 'publishing',
    }),
    defineField({name: 'sortOrder', type: 'number', initialValue: 0, group: 'publishing'}),
    pageBuilderField,
    seoField,
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current', media: 'image'},
    prepare(value) {
      const title = value.title || 'Untitled program'
      const subtitle = value.subtitle ? `/programs/${value.subtitle}` : 'Missing slug'
      return {title, subtitle, media: value.media}
    },
  },
})
