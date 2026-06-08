import {defineArrayMember, defineField, defineType} from 'sanity'
import {logoMarqueeField} from '../objects/logoMarqueeItem'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'

export const networkInvestorsPage = defineType({
  name: 'networkInvestorsPage',
  title: 'Network — Investors page (/investors)',
  type: 'document',
  groups: CONTENT_SEO_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Investors',
      group: 'content',
    }),
    {...logoMarqueeField, group: 'content'},
    defineField({
      name: 'foundersCluster',
      title: 'Founders Cluster (Pie Charts)',
      description: 'Define the pie charts showing how founders cluster on the investors page.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'clusterChart',
          title: 'Cluster Chart',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Chart Title',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'segments',
              type: 'array',
              title: 'Segments / Slices',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'chartSegment',
                  title: 'Chart Segment',
                  fields: [
                    defineField({
                      name: 'name',
                      type: 'string',
                      title: 'Segment Name',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'value',
                      type: 'number',
                      title: 'Percentage Share',
                      validation: (Rule) => Rule.required().min(0).max(100),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    singletonSeoField,
  ],
})
