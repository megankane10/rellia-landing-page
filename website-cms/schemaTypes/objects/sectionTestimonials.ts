import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionTestimonials = defineType({
  name: 'sectionTestimonials',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'Already trusted by Rellia members',
    }),
    defineField({
      name: 'testimonials',
      title: 'Quotes',
      type: 'array',
      of: [defineArrayMember({type: 'landingTestimonialItem'})],
    }),
  ],
  preview: sectionListPreview({typeLabel: 'Testimonials', fallback: 'Testimonials carousel'}),
})
