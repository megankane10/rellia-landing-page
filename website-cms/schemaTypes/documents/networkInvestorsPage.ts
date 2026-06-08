import {defineArrayMember, defineField, defineType} from 'sanity'
import {logoMarqueeField} from '../objects/logoMarqueeItem'
import {CONTENT_SEO_FIELDSETS, singletonSeoField} from '../shared/singletonContentFields'
import {
  NETWORK_PAGE_GROUPS,
  networkCtaFields,
  networkFeatureItemMember,
  networkHeroFields,
  networkWhyRelliaFields,
} from '../shared/networkPageFields'

export const networkInvestorsPage = defineType({
  name: 'networkInvestorsPage',
  title: 'Network — Investors page (/investors)',
  type: 'document',
  groups: NETWORK_PAGE_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Investors', group: 'hero'}),
    ...networkHeroFields,
    ...networkWhyRelliaFields,
    defineField({name: 'pitchTitle', title: 'Pitch events section title', type: 'string', group: 'content'}),
    defineField({name: 'pitchSubtitle', title: 'Pitch events section subtitle', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'pitchCards',
      title: 'Pitch event cards',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'networkPitchCard',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'body', type: 'text', rows: 3}),
            defineField({name: 'imageUrl', title: 'Image URL', type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        }),
      ],
    }),
    ...networkCtaFields,
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
