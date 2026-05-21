import {defineArrayMember, defineField, defineType} from 'sanity'

export const eventCard = defineType({
  name: 'eventCard',
  title: 'Event',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'slug', type: 'string'}),
    defineField({name: 'dateTime', type: 'string'}),
    defineField({
      name: 'person',
      title: 'Host',
      type: 'string',
      description: 'Host name and organization (e.g. The AI Collective • Toronto Tech Week).',
    }),
    defineField({name: 'imageSrc', type: 'string'}),
    defineField({name: 'href', type: 'string'}),
    defineField({name: 'comingSoon', type: 'boolean'}),
    defineField({name: 'buttonText', type: 'string'}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'lumaEventId', type: 'string'}),
    defineField({
      name: 'detailBodyHeading',
      title: 'Detail section heading',
      type: 'string',
      description: 'Optional title shown above the detail body (e.g. About this session).',
    }),
    defineField({
      name: 'detailBody',
      title: 'Detail page body',
      type: 'array',
      description: 'Rich text below the hero on the event detail page. Optional.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'eventDetailDivider',
          title: 'Section divider',
          fields: [
            defineField({
              name: 'tone',
              title: 'Tone',
              type: 'string',
              options: {
                list: [
                  {title: 'Default', value: 'default'},
                  {title: 'Subtle', value: 'subtle'},
                ],
              },
              initialValue: 'default',
            }),
          ],
        }),
        defineArrayMember({
          type: 'object',
          name: 'eventDetailInlineImage',
          title: 'Image',
          fields: [
            defineField({
              name: 'imageSrc',
              title: 'Image URL',
              type: 'string',
              description: 'Relative site path (e.g. /images/…) or absolute URL.',
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional line shown under the image.',
            }),
          ],
        }),
        defineArrayMember({type: 'bodyCtaBox'}),
        defineArrayMember({type: 'portableImageCarousel'}),
      ],
    }),
    defineField({
      name: 'embedLumaOnDetailPage',
      type: 'boolean',
      title: 'Embed Luma on event page',
      description:
        'Turn off to hide the inline Luma iframe and show registration only via the hero button (requires Event URL).',
    }),
    defineField({
      name: 'addToCalendarEnabled',
      type: 'boolean',
      title: 'Add to Calendar (instead of Register)',
      description:
        'When on, the hero button says “Add to Calendar” and downloads an .ics file. When off, the normal Register / Luma flow is used.',
      initialValue: false,
    }),
    defineField({
      name: 'calendarStartsAt',
      type: 'string',
      title: 'Calendar start (ISO 8601)',
      description:
        'e.g. 2026-06-24T21:30:00-04:00 — used for Add to Calendar. Optional if you only use the display date string.',
    }),
    defineField({
      name: 'calendarEndsAt',
      type: 'string',
      title: 'Calendar end (ISO 8601)',
      description: 'Optional; if empty with a start time, end defaults to 90 minutes after start.',
    }),
  ],
})
