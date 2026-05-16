import {defineField, defineType} from 'sanity'

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'publishing', title: 'Publishing'},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
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
    defineField({name: 'description', type: 'text', rows: 3, group: 'content'}),
    defineField({
      name: 'image',
      title: 'Program image',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload an image to enable cropping and focal-point positioning.',
      group: 'content',
    }),
    defineField({
      name: 'imageSrc',
      title: 'Program image URL (legacy)',
      type: 'string',
      description: 'Optional. Prefer “Program image” above so you can crop and reposition.',
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
      description: 'If set, program is treated as waitlist-only in the UI.',
      group: 'content',
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
      group: 'publishing',
    }),
    defineField({name: 'sortOrder', type: 'number', initialValue: 0, group: 'publishing'}),
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
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

