import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionDiagnosticSurvey = defineType({
  name: 'sectionDiagnosticSurvey',
  title: 'Diagnostic survey promo block',
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
          {title: 'Text + list', value: 'categories'},
          {title: 'Text + full-height image', value: 'imageSplit'},
        ],
      },
      initialValue: 'categories',
    }),
    defineField({name: 'badge', type: 'string'}),
    defineField({name: 'title', type: 'portableRichText'}),
    defineField({name: 'subtitle', type: 'portableRichText'}),
    defineField({name: 'primaryCta', title: 'Primary button', type: 'navItem'}),
    defineField({name: 'secondaryCta', title: 'Secondary button (optional)', type: 'navItem'}),
    defineField({
      name: 'categoriesTitle',
      title: 'List heading',
      type: 'string',
      hidden: ({parent}) => parent?.layout === 'imageSplit',
    }),
    defineField({
      name: 'categories',
      title: 'List items',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      hidden: ({parent}) => parent?.layout === 'imageSplit',
    }),
    defineField({
      name: 'categoryIcon',
      title: 'List item icon',
      type: 'string',
      description: 'Lucide icon for each list row. Defaults to CalendarDays.',
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
  preview: sectionListPreview({typeLabel: 'Diagnostic survey promo block', fallback: 'Diagnostic survey promo'}),
})
