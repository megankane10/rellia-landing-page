import {defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {seoField} from '../shared/seoField'
import {pageBuilderField} from '../shared/pageBuilderField'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [...documentGroups, {name: 'ticketing', title: 'Ticketing & calendar'}],
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
      name: 'startsAt',
      title: 'Start date & time',
      type: 'datetime',
      options: {timeStep: 15},
      description: 'Used for cards, upcoming vs past, and Add to Calendar.',
      group: 'content',
    }),
    defineField({
      name: 'endsAt',
      title: 'End date & time',
      type: 'datetime',
      options: {timeStep: 15},
      group: 'content',
    }),
    defineField({
      name: 'person',
      title: 'Host',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Physical venue or "Virtual".',
      group: 'content',
    }),
    defineField({
      name: 'virtualLink',
      title: 'Virtual event link',
      type: 'url',
      description: 'Zoom, Luma, or meeting URL for online events.',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Event image',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),
    defineField({name: 'href', type: 'string', group: 'content'}),
    defineField({name: 'comingSoon', type: 'boolean', group: 'content'}),
    defineField({name: 'buttonText', title: 'CTA label', type: 'string', group: 'ticketing'}),
    defineField({name: 'lumaEventId', title: 'Luma event ID', type: 'string', group: 'ticketing'}),
    defineField({
      name: 'ticketingUrl',
      title: 'Ticketing / registration URL',
      type: 'url',
      group: 'ticketing',
    }),
    defineField({
      name: 'eventDescription',
      title: 'Event description',
      type: 'portableText',
      description: 'Rich description for the event detail page.',
      group: 'content',
    }),
    defineField({
      name: 'detailBodyHeading',
      title: 'Description section heading',
      type: 'string',
      initialValue: 'About this event',
      group: 'content',
    }),
    defineField({name: 'embedLumaOnDetailPage', type: 'boolean', group: 'ticketing'}),
    defineField({name: 'addToCalendarEnabled', type: 'boolean', group: 'ticketing'}),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Past', value: 'past'},
          {title: 'Hidden', value: 'hidden'},
        ],
      },
      initialValue: 'upcoming',
      group: 'content',
    }),
    defineField({name: 'sortOrder', type: 'number', initialValue: 0, group: 'content'}),
    pageBuilderField,
    seoField,
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current', media: 'image'},
    prepare(value) {
      const title = value.title || 'Untitled event'
      const subtitle = value.subtitle ? `/events/${value.subtitle}` : 'Missing slug'
      return {title, subtitle, media: value.media}
    },
  },
})
