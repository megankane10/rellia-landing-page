import {defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {seoField} from '../shared/seoField'
import {pageBuilderField} from '../shared/pageBuilderField'
import {eventPublishingFields} from '../shared/documentTopFields'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    {name: 'publishing', title: 'Publishing', default: true},
    ...documentGroups.filter((g) => g.name !== 'publishing'),
    {name: 'ticketing', title: 'Ticketing & calendar'},
  ],
  fieldsets: [FIELDSET_SEO],
  fields: [
    ...eventPublishingFields,
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
      name: 'dateTime',
      title: 'Date & time label (legacy)',
      type: 'string',
      hidden: true,
      readOnly: true,
      description: 'Deprecated — use Start/End date & time. Kept for older documents.',
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
    defineField({name: 'href', title: 'Registration URL (Luma / external)', type: 'string', group: 'content'}),
    defineField({name: 'comingSoon', type: 'boolean', group: 'content'}),
    defineField({
      name: 'eventDescription',
      title: 'Event description',
      type: 'portableText',
      description: 'Rich description for the event detail page.',
      group: 'content',
    }),
    defineField({
      name: 'detailBody',
      title: 'Detail body (legacy)',
      type: 'portableText',
      hidden: true,
      readOnly: true,
      description: 'Deprecated — use Event description. Kept for older documents.',
      group: 'content',
    }),
    defineField({
      name: 'detailBodyHeading',
      title: 'Description section heading',
      type: 'string',
      initialValue: 'About this event',
      group: 'content',
    }),
    defineField({name: 'buttonText', title: 'CTA label', type: 'string', group: 'ticketing'}),
    defineField({name: 'lumaEventId', title: 'Luma event ID', type: 'string', group: 'ticketing'}),
    defineField({
      name: 'ticketingUrl',
      title: 'Ticketing / registration URL',
      type: 'url',
      group: 'ticketing',
    }),
    defineField({
      name: 'customLinkButton',
      title: 'Custom link button',
      type: 'customLinkButton',
      description: 'Optional extra button on the event page (e.g. sponsor site, resources).',
      group: 'ticketing',
    }),
    defineField({name: 'embedLumaOnDetailPage', type: 'boolean', group: 'ticketing'}),
    defineField({name: 'addToCalendarEnabled', type: 'boolean', group: 'ticketing'}),
    pageBuilderField,
    seoField,
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      startsAt: 'startsAt',
      location: 'location',
      media: 'image',
    },
    prepare({title, status, startsAt, location, media}) {
      const displayTitle = title?.trim() || 'Untitled event'
      const statusLabel =
        status === 'past' ? 'Past' : status === 'hidden' ? 'Hidden' : 'Upcoming'
      const dateLabel = startsAt
        ? new Date(startsAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : undefined
      const subtitle = [statusLabel, dateLabel, location?.trim()]
        .filter(Boolean)
        .join(' · ')
      return {title: displayTitle, subtitle: subtitle || undefined, media}
    },
  },
})
