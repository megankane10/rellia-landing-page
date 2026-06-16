import {defineArrayMember, defineField, defineType} from 'sanity'

export const programTimelinePoint = defineType({
  name: 'programTimelinePoint',
  title: 'Timeline point',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Bullet point', value: 'bullet'},
          {title: 'Heading', value: 'heading'},
        ],
        layout: 'radio',
      },
      initialValue: 'bullet',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {kind: 'kind', text: 'text'},
    prepare({kind, text}) {
      const label = kind === 'heading' ? 'Heading' : 'Bullet'
      return {title: text?.trim() || 'Timeline point', subtitle: label}
    },
  },
})

export const programTimelineWeek = defineType({
  name: 'programTimelineWeek',
  title: 'Timeline week group',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Week heading',
      type: 'string',
      description: 'Optional divider inside the month accordion (e.g. Week 1–2).',
    }),
    defineField({
      name: 'points',
      title: 'Points',
      type: 'array',
      description:
        'Add bullet points and optional headings between them (headings render without an icon).',
      of: [defineArrayMember({type: 'programTimelinePoint'})],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {heading: 'heading', points: 'points'},
    prepare({heading, points}) {
      const count = Array.isArray(points) ? points.length : 0
      return {
        title: heading?.trim() || 'Bullet group',
        subtitle: count === 1 ? '1 point' : `${count} points`,
      }
    },
  },
})

export const programTimelineStep = defineType({
  name: 'programTimelineStep',
  title: 'Timeline month step',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Month title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stepLabel',
      title: 'Step badge',
      type: 'string',
      description: 'Small label above the accordion title (e.g. Step 1).',
    }),
    defineField({
      name: 'weeks',
      title: 'Week groups',
      type: 'array',
      of: [defineArrayMember({type: 'programTimelineWeek'})],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'title', stepLabel: 'stepLabel'},
    prepare({title, stepLabel}) {
      return {title: title?.trim() || 'Timeline step', subtitle: stepLabel?.trim() || undefined}
    },
  },
})
