import {defineArrayMember, defineField, defineType} from 'sanity'
import {studioListMedia} from '../shared/studioListMedia'
import {lucideIconField} from '../shared/iconKeyField'

export const diagnosticSurveyContent = defineType({
  name: 'diagnosticSurveyContent',
  title: 'Diagnostic Survey Page',
  type: 'document',
  description:
    'Editable question, answer, and report content for the interactive startup diagnostic survey at /diagnostic-survey.',
  groups: [
    {name: 'intro', title: 'Introduction & Form', default: true},
    {name: 'questions', title: 'Survey Questions'},
    {name: 'submit', title: 'Submit & Loading Screen'},
    {name: 'report', title: 'Report Content'},
  ],
  fields: [
    defineField({
      name: 'sections',
      title: 'Survey sections',
      type: 'array',
      group: 'questions',
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
            lucideIconField('Lucide icon for this survey section carousel slide.'),
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
                            select: {label: 'label', desc: 'desc'},
                            prepare: ({label, desc}) => ({
                              title: label || 'Option',
                              subtitle: desc,
                              media: studioListMedia.link,
                            }),
                          },
                        }),
                      ],
                    }),
                  ],
                  preview: {
                    select: {text: 'text'},
                    prepare: ({text}) => ({title: text || 'Question', media: studioListMedia.link}),
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
    defineField({
      name: 'introTitle',
      title: 'Introduction Title',
      type: 'string',
      group: 'intro',
      initialValue: 'How ready is your startup, really?',
    }),
    defineField({
      name: 'introSubtitle',
      title: 'Introduction Subtitle',
      type: 'text',
      rows: 3,
      group: 'intro',
      initialValue:
        'Our diagnostic tool assesses your health tech startup across 12 critical domains. Get an automated report, personalized advisory board matches, and a program roadmap tailored to your gaps.',
    }),
    defineField({
      name: 'stages',
      title: 'Startup stages (Dropdown options)',
      type: 'array',
      group: 'intro',
      description: 'Stages options shown in the dropdown on the introduction step of the diagnostic survey.',
      of: [defineArrayMember({ type: 'string' })],
      initialValue: [
        "Idea / Discovery",
        "Prototype / MVP",
        "Pilot / Seed",
        "Early Growth (Series A+)",
        "Scale-up",
      ],
    }),
    defineField({
      name: 'introJourneyTitle',
      title: 'Journey Section Title',
      type: 'string',
      group: 'intro',
      initialValue: 'Your Diagnostic Journey',
    }),
    defineField({
      name: 'introJourneySteps',
      title: 'Journey Section Steps',
      type: 'array',
      group: 'intro',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'journeyStep',
          fields: [
            defineField({ name: 'title', title: 'Step Title', type: 'string' }),
            defineField({ name: 'description', title: 'Step Description', type: 'text', rows: 2 }),
            lucideIconField('Lucide icon for this journey step.'),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
            prepare: ({title, subtitle}) => ({
              title: title || 'Step',
              subtitle,
              media: studioListMedia.link,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'introWhatYouGetTitle',
      title: 'What You Get Title',
      type: 'string',
      group: 'intro',
      initialValue: 'What you’ll get',
    }),
    defineField({
      name: 'introWhatYouGetBullets',
      title: 'What You Get Bullets',
      type: 'array',
      group: 'intro',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'introStartupDetailsTitle',
      title: 'Startup Details Block Title',
      type: 'string',
      group: 'intro',
      initialValue: 'Tell us about your startup',
    }),
    defineField({
      name: 'introStartButtonLabel',
      title: 'Start Button Label',
      type: 'string',
      group: 'intro',
      initialValue: 'Start Assessment',
    }),
    defineField({
      name: 'submitTitle',
      title: 'Submit Screen Title',
      type: 'string',
      group: 'submit',
      initialValue: 'Review, then generate your roadmap',
    }),
    defineField({
      name: 'submitSubtitle',
      title: 'Submit Screen Subtitle',
      type: 'text',
      rows: 2,
      group: 'submit',
      initialValue:
        'You’re about to submit your responses. After confirmation, we’ll generate your personalized readiness report.',
    }),
    defineField({
      name: 'submitProfileTitle',
      title: 'Submit Profile Card Title',
      type: 'string',
      group: 'submit',
      initialValue: 'Your Assessment Profile',
    }),
    defineField({
      name: 'submitGeneratingTitle',
      title: 'Submit Generating Card Title',
      type: 'string',
      group: 'submit',
      initialValue: 'Generating Your Report',
    }),
    defineField({
      name: 'submitGeneratingBody',
      title: 'Submit Generating Card Body',
      type: 'text',
      rows: 2,
      group: 'submit',
      initialValue:
        "We're assessing your results in order to assign you your personalized advisory board and recommended Rellia programs.",
    }),
    defineField({
      name: 'submitGeneratingBullets',
      title: 'Submit Generating Card Bullets',
      type: 'array',
      group: 'submit',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'submitDetailsTitle',
      title: 'Submit Details Card Title',
      type: 'string',
      group: 'submit',
      initialValue: 'Submission details',
    }),
    defineField({
      name: 'submitConfirmButtonLabel',
      title: 'Submit Confirm Button Label',
      type: 'string',
      group: 'submit',
      initialValue: 'Confirm & Generate Report',
    }),
    defineField({
      name: 'processingTitle',
      title: 'Processing Title',
      type: 'string',
      group: 'submit',
      initialValue: 'Personalizing your report',
    }),
    defineField({
      name: 'processingSubtitle',
      title: 'Processing Subtitle',
      type: 'text',
      rows: 2,
      group: 'submit',
      initialValue:
        "We're assessing your results in order to assign you your personalized advisory board and program roadmap.",
    }),
    defineField({
      name: 'processingSteps',
      title: 'Processing Steps list',
      type: 'array',
      group: 'submit',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'reportHeaderThankYou',
      title: 'Report Header Thank-you',
      type: 'text',
      rows: 3,
      group: 'report',
      initialValue:
        "Thanks - we've saved your diagnostic submission for {company}. Your next step is to focus on the lowest-scoring domains first, then reinforce what's already working so you can move faster with less risk.",
    }),
    defineField({
      name: 'reportStrengthsTitle',
      title: 'Report Strengths Title',
      type: 'string',
      group: 'report',
      initialValue: 'Top Strengths',
    }),
    defineField({
      name: 'reportGapsTitle',
      title: 'Report Gaps Title',
      type: 'string',
      group: 'report',
      initialValue: 'Priority Gaps',
    }),
    defineField({
      name: 'reportRoadmapTitle',
      title: 'Report Roadmap Title',
      type: 'string',
      group: 'report',
      initialValue: 'Recommended Roadmap',
    }),
    defineField({
      name: 'reportFullBreakdownTitle',
      title: 'Report Full Breakdown Title',
      type: 'string',
      group: 'report',
      initialValue: 'Full Readiness Breakdown',
    }),
    defineField({
      name: 'reportProgramsTitle',
      title: 'Report Programs Title',
      type: 'string',
      group: 'report',
      initialValue: 'Program Matches',
    }),
    defineField({
      name: 'reportAdvisorsTitle',
      title: 'Report Advisors Title',
      type: 'string',
      group: 'report',
      initialValue: 'Custom Advisory Board',
    }),
    defineField({
      name: 'reportMembershipCtaTitle',
      title: 'Membership CTA Title',
      type: 'string',
      group: 'report',
      initialValue: 'Detailed report access is restricted',
    }),
    defineField({
      name: 'reportMembershipCtaBody',
      title: 'Membership CTA Body',
      type: 'text',
      rows: 3,
      group: 'report',
      initialValue:
        'Join Rellia Health to unlock your custom advisory board, full gap analysis, and personalized actions - and accelerate your journey.',
    }),
    defineField({
      name: 'reportMembershipCtaButton',
      title: 'Membership CTA Button Label',
      type: 'string',
      group: 'report',
      initialValue: 'Apply for Membership',
    }),
    defineField({
      name: 'reportMembershipCtaImage',
      title: 'Membership CTA Background Image',
      type: 'image',
      group: 'report',
      description:
        'Crop to a square for the on-site report card. Choose “Use full image” in the upload dialog to show the full photo in PDF (wide) or beside the copy (square).',
      options: {
        hotspot: true,
        cropAllowFullImage: true,
        cropAspect: 1,
        cropAspectPreset: 'square',
      },
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Diagnostic Survey Page', media: studioListMedia.document}
    },
  },
})
