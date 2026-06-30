import {defineArrayMember, defineField, defineType} from 'sanity'

export const portableTable = defineType({
  name: 'portableTable',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional label shown below the table.',
    }),
    defineField({
      name: 'hasHeaderRow',
      title: 'First row is a header',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'highlightedColumn',
      title: 'Highlighted column',
      type: 'number',
      description:
        'Optional. Number columns from the left starting at 1 to emphasize an entire column (e.g. your product column in a comparison table).',
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: 'highlightedRow',
      title: 'Highlighted row',
      type: 'number',
      description:
        'Optional. Number rows from the top starting at 1 (includes the header row when “First row is a header” is on).',
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tableRow',
          title: 'Row',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule) => Rule.min(1).required(),
            }),
          ],
          preview: {
            select: {cells: 'cells'},
            prepare({cells}) {
              const preview = Array.isArray(cells)
                ? cells
                    .filter((cell) => typeof cell === 'string' && cell.trim())
                    .slice(0, 3)
                    .join(' · ')
                : ''
              return {
                title: preview || 'Table row',
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).required(),
    }),
  ],
  preview: {
    select: {caption: 'caption', rows: 'rows'},
    prepare({caption, rows}) {
      const count = Array.isArray(rows) ? rows.length : 0
      return {
        title: caption?.trim() || 'Table',
        subtitle: count ? `${count} row${count === 1 ? '' : 's'}` : 'No rows',
      }
    },
  },
})
