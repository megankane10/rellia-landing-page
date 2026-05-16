import {defineField, defineType} from 'sanity'

export const diagnosticSubmission = defineType({
  name: 'diagnosticSubmission',
  title: 'Diagnostic submission',
  type: 'document',
  fields: [
    defineField({name: 'submittedAt', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'email', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'company', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'stage', type: 'string'}),
    defineField({name: 'description', type: 'text', rows: 4}),
    defineField({name: 'scoresMarkdown', type: 'text', rows: 6}),
    defineField({
      name: 'answersJson',
      title: 'Raw answers (JSON)',
      type: 'text',
      description: 'Raw survey answers captured by the client, stored as JSON.',
    }),
    defineField({
      name: 'report',
      type: 'object',
      fields: [
        defineField({name: 'summary', type: 'text', rows: 4}),
        defineField({
          name: 'strengths',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'strength',
              fields: [
                defineField({name: 'category', type: 'string'}),
                defineField({name: 'score', type: 'number'}),
                defineField({name: 'note', type: 'text', rows: 2}),
              ],
            },
          ],
        }),
        defineField({
          name: 'weaknesses',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'weakness',
              fields: [
                defineField({name: 'category', type: 'string'}),
                defineField({name: 'score', type: 'number'}),
                defineField({name: 'priority', type: 'string'}),
                defineField({name: 'note', type: 'text', rows: 2}),
              ],
            },
          ],
        }),
        defineField({name: 'recommendations', type: 'array', of: [{type: 'string'}]}),
        defineField({name: 'mentorAreas', type: 'array', of: [{type: 'string'}]}),
      ],
    }),
  ],
})
