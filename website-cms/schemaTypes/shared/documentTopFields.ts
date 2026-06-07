import {defineField} from 'sanity'

/** Deprecated — page status lives on custom `page` documents only. */
export const singletonPublishingAtTop: ReturnType<typeof defineField>[] = []

export const programPublishingFields = [
  defineField({
    name: 'status',
    title: 'Program availability',
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
  defineField({
    name: 'sortOrder',
    title: 'Sort order',
    type: 'number',
    initialValue: 0,
    group: 'publishing',
  }),
]

export const eventPublishingFields = [
  defineField({
    name: 'status',
    title: 'Event visibility',
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
    group: 'publishing',
  }),
  defineField({
    name: 'sortOrder',
    title: 'Sort order',
    type: 'number',
    initialValue: 0,
    group: 'publishing',
  }),
]
