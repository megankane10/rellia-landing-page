import {defineField} from 'sanity'
import {pageVisibilityFields} from './pageVisibilityFields'

/** Page visibility controls — place first in singleton `fields` arrays. */
export const singletonPublishingAtTop = [...pageVisibilityFields]

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
