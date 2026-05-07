import {defineField, defineType} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startsAt',
      title: 'Start date & time',
      type: 'datetime',
      options: {timeStep: 15},
      description: 'Used to determine upcoming vs past events automatically.',
    }),
    defineField({
      name: 'endsAt',
      title: 'End date & time',
      type: 'datetime',
      options: {timeStep: 15},
    }),
    defineField({
      name: 'dateTime',
      title: 'Display date/time (legacy)',
      type: 'string',
      description:
        'Optional. If provided, this exact text is shown on cards. If empty, we format from “Start date & time”.',
    }),
    defineField({name: 'person', type: 'string'}),
    defineField({
      name: 'image',
      title: 'Event image',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload an image to enable cropping and focal-point positioning.',
    }),
    defineField({
      name: 'imageSrc',
      title: 'Event image URL (legacy)',
      type: 'string',
      description: 'Optional. Prefer “Event image” above so you can crop and reposition.',
    }),
    defineField({name: 'href', type: 'string'}),
    defineField({name: 'comingSoon', type: 'boolean'}),
    defineField({name: 'buttonText', type: 'string'}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'lumaEventId', type: 'string'}),
    defineField({name: 'detailBodyHeading', type: 'string'}),
    defineField({
      name: 'detailBody',
      type: 'array',
      of: [{type: 'block'}, {type: 'bodyCtaBox'}, {type: 'portableImageCarousel'}],
    }),
    defineField({name: 'embedLumaOnDetailPage', type: 'boolean'}),
    defineField({name: 'addToCalendarEnabled', type: 'boolean'}),
    defineField({name: 'calendarStartsAt', type: 'string'}),
    defineField({name: 'calendarEndsAt', type: 'string'}),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Past', value: 'past'},
          {title: 'Hidden', value: 'hidden'},
        ],
      },
      initialValue: 'upcoming',
    }),
    defineField({name: 'sortOrder', type: 'number', initialValue: 0}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
    prepare(value) {
      const title = value.title || 'Untitled event'
      const subtitle = value.subtitle ? `/events/${value.subtitle}` : 'Missing slug'
      return {title, subtitle}
    },
  },
})

