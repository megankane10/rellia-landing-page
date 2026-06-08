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
    description:
      'Upcoming vs past is derived from Start/End date & time on the site. Use Hidden to remove an event from listings.',
    options: {
      layout: 'radio',
      list: [
        {title: 'Visible', value: 'visible'},
        {title: 'Hidden', value: 'hidden'},
      ],
    },
    initialValue: 'visible',
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
