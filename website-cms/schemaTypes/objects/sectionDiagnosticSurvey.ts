import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionDiagnosticSurvey = defineType({
  name: 'sectionDiagnosticSurvey',
  title: 'Network: Diagnostic Survey',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    defineField({name: 'badge', type: 'string'}),
    defineField({name: 'title', type: 'portableRichText'}),
    defineField({name: 'subtitle', type: 'portableRichText'}),
    defineField({name: 'ctaLabel', type: 'string'}),
    defineField({name: 'ctaHref', type: 'string'}),
    defineField({name: 'categoriesTitle', type: 'string'}),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
  preview: sectionListPreview({typeLabel: 'Diagnostic survey', fallback: 'Survey'}),
})
