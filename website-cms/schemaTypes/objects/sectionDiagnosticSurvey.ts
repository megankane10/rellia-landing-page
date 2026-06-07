import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionDiagnosticSurvey = defineType({
  name: 'sectionDiagnosticSurvey',
  title: 'Diagnostic split',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Text + category list', value: 'categories'},
          {title: 'Text + full-height image', value: 'imageSplit'},
        ],
      },
      initialValue: 'categories',
    }),
    defineField({name: 'badge', type: 'string'}),
    defineField({name: 'title', type: 'portableRichText'}),
    defineField({name: 'subtitle', type: 'portableRichText'}),
    defineField({
      name: 'cta',
      title: 'Primary button',
      type: 'builderCtaAction',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categoriesTitle',
      title: 'Categories heading',
      type: 'string',
      hidden: ({parent}) => parent?.layout === 'imageSplit',
    }),
    defineField({
      name: 'categories',
      title: 'Category labels',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      hidden: ({parent}) => parent?.layout === 'imageSplit',
    }),
    defineField({
      name: 'categoryIcon',
      title: 'Category list icon',
      type: 'string',
      description: 'Lucide icon for each category row. Defaults to CalendarDays.',
      hidden: ({parent}) => parent?.layout === 'imageSplit',
    }),
    defineField({
      name: 'image',
      title: 'Right-side image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.layout !== 'imageSplit',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Right-side image URL (fallback)',
      type: 'string',
      hidden: ({parent}) => parent?.layout !== 'imageSplit',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt text',
      type: 'string',
      hidden: ({parent}) => parent?.layout !== 'imageSplit',
    }),
  ],
  preview: sectionListPreview({typeLabel: 'Diagnostic split', fallback: 'Diagnostic'}),
})
