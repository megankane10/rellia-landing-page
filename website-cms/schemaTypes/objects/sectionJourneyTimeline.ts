import {defineArrayMember, defineField, defineType} from 'sanity'

export const sectionJourneyTimeline = defineType({
  name: 'sectionJourneyTimeline',
  title: 'Network: Journey Timeline',
  type: 'object',
  fields: [
    defineField({name: 'badge', type: 'string'}),
    defineField({name: 'title', type: 'portableRichText'}),
    defineField({name: 'description', type: 'portableRichText'}),
    defineField({
      name: 'leftColumn',
      type: 'object',
      title: 'Left Column (e.g. You Own)',
      fields: [
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'body', type: 'text', rows: 2}),
        defineField({
          name: 'steps',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'id', type: 'string'}),
                defineField({name: 'label', type: 'string'}),
                defineField({name: 'detail', type: 'text', rows: 3}),
                defineField({name: 'icon', type: 'string'}),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'rightColumn',
      type: 'object',
      title: 'Right Column (e.g. We Help With)',
      fields: [
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'body', type: 'text', rows: 2}),
        defineField({
          name: 'steps',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'id', type: 'string'}),
                defineField({name: 'label', type: 'string'}),
                defineField({name: 'detail', type: 'text', rows: 3}),
                defineField({name: 'icon', type: 'string'}),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
