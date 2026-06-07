import {defineField, defineType} from 'sanity'

export const landingTestimonialItem = defineType({
  name: 'landingTestimonialItem',
  title: 'Testimonial',
  type: 'object',
  fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'role', title: 'Role / title', type: 'string'}),
    defineField({name: 'company', title: 'Company', type: 'string'}),
    defineField({name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'imageSrc',
      title: 'Photo URL (fallback)',
      type: 'string',
      description: 'Used when no image is uploaded.',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'company', media: 'image'},
  },
})
