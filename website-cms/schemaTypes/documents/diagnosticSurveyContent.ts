import {defineArrayMember, defineField, defineType} from 'sanity'
import {studioListMedia} from '../shared/studioListMedia'

export const diagnosticSurveyContent = defineType({
  name: 'diagnosticSurveyContent',
  title: 'Diagnostic survey copy',
  type: 'document',
  description:
    'Editable question and answer text for /diagnostic-survey. Scoring logic stays in the app — do not change option scores unless engineering approves.',
  fields: [
    defineField({
      name: 'introNote',
      type: 'text',
      rows: 2,
      readOnly: true,
      initialValue:
        'Section IDs and question order must match the live survey. Edit labels and descriptions only.',
    }),
    defineField({
      name: 'sections',
      title: 'Survey sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'surveySection',
          fields: [
            defineField({
              name: 'id',
              title: 'Section ID (do not change)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'icon', title: 'Icon', type: 'string'}),
            defineField({name: 'title', title: 'Section title', type: 'string'}),
            defineField({name: 'desc', title: 'Section description', type: 'text', rows: 2}),
            defineField({
              name: 'questions',
              title: 'Questions',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'surveyQuestion',
                  fields: [
                    defineField({name: 'text', title: 'Question', type: 'text', rows: 2}),
                    defineField({
                      name: 'type',
                      title: 'Question type (logic)',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Confidence', value: 'confidence'},
                          {title: 'Progress', value: 'progress'},
                          {title: 'Applicability', value: 'applicability'},
                          {title: 'Knowledge', value: 'knowledge'},
                        ],
                      },
                    }),
                    defineField({
                      name: 'options',
                      title: 'Answer options',
                      type: 'array',
                      of: [
                        defineArrayMember({
                          type: 'object',
                          name: 'surveyOption',
                          fields: [
                            defineField({name: 'label', title: 'Label', type: 'string'}),
                            defineField({name: 'desc', title: 'Description', type: 'string'}),
                            defineField({
                              name: 'score',
                              title: 'Score (0–100)',
                              type: 'number',
                              description: 'Used for scoring — change only with engineering approval.',
                            }),
                          ],
                          preview: {
                            select: {title: 'label', subtitle: 'desc'},
                            prepare: ({title, subtitle}) => ({
                              title: title || 'Option',
                              subtitle,
                              media: studioListMedia.link,
                            }),
                          },
                        }),
                      ],
                    }),
                  ],
                  preview: {
                    select: {title: 'text'},
                    prepare: ({title}) => ({title: title || 'Question', media: studioListMedia.link}),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'title', id: 'id'},
            prepare: ({title, id}) => ({
              title: title || id || 'Section',
              subtitle: id,
              media: studioListMedia.document,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Diagnostic survey copy', media: studioListMedia.document}
    },
  },
})
