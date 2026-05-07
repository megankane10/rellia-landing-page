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
    defineField({name: 'dateTime', type: 'string'}),
    defineField({name: 'person', type: 'string'}),
    defineField({name: 'imageSrc', type: 'string'}),
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

