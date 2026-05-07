import {defineField, defineType} from 'sanity'

export const program = defineType({
  name: 'program',
  title: 'Program',
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
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({
      name: 'image',
      title: 'Program image',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload an image to enable cropping and focal-point positioning.',
    }),
    defineField({
      name: 'imageSrc',
      title: 'Program image URL (legacy)',
      type: 'string',
      description: 'Optional. Prefer “Program image” above so you can crop and reposition.',
    }),
    defineField({
      name: 'buttonText',
      type: 'string',
      initialValue: 'Learn more',
    }),
    defineField({
      name: 'href',
      title: 'Program link',
      type: 'string',
      description: 'Usually /programs/<slug> for detail pages.',
    }),
    defineField({
      name: 'waitlistHref',
      title: 'Waitlist link',
      type: 'string',
      description: 'If set, program is treated as waitlist-only in the UI.',
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Waitlist', value: 'waitlist'},
          {title: 'Hidden', value: 'hidden'},
        ],
      },
      initialValue: 'available',
    }),
    defineField({name: 'sortOrder', type: 'number', initialValue: 0}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
    prepare(value) {
      const title = value.title || 'Untitled program'
      const subtitle = value.subtitle ? `/programs/${value.subtitle}` : 'Missing slug'
      return {title, subtitle}
    },
  },
})

