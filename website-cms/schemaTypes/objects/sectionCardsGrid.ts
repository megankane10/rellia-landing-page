import {defineArrayMember, defineField, defineType} from 'sanity'

export const sectionCardsGrid = defineType({
  name: 'sectionCardsGrid',
  title: 'Section: Cards grid',
  type: 'object',
  fields: [
    defineField({name: 'tag', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'subtitle', type: 'text', rows: 2}),
    defineField({
      name: 'cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'card',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'body', type: 'text', rows: 3}),
            defineField({
              name: 'iconKey',
              title: 'Icon (Lucide name)',
              type: 'string',
              description:
                'Optional Lucide icon key shown beside the title (e.g. Sparkles, ShieldCheck, Users). Leave empty to hide.',
            }),
            defineField({
              name: 'badge',
              type: 'string',
              description: 'Optional pill label above the title; leave empty to hide.',
            }),
            defineField({name: 'image', type: 'image', options: {hotspot: true}}),
            defineField({name: 'imageAlt', type: 'string'}),
            defineField({name: 'cta', type: 'navItem'}),
            defineField({
              name: 'tags',
              type: 'array',
              of: [{type: 'string'}],
              description: 'Simple per-card tags; used for UI chips and filtering.',
            }),
          ],
        }),
      ],
    }),
  ],
})
