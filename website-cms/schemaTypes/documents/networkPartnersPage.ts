import {defineField, defineType} from 'sanity'
import {CONTENT_SEO_FIELDSETS, modularSectionsField, singletonSeoField} from '../shared/singletonContentFields'
import {
  NETWORK_PAGE_GROUPS,
  networkCtaFields,
  networkEngageBandFields,
  networkHeroFields,
  networkWhyRelliaFields,
} from '../shared/networkPageFields'

export const networkPartnersPage = defineType({
  name: 'networkPartnersPage',
  title: 'Network — Industry Partners page (/industry-partners)',
  type: 'document',
  groups: NETWORK_PAGE_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Industry Partners', group: 'hero'}),
    ...networkHeroFields,
    ...networkEngageBandFields,
    defineField({name: 'benefitsTitle', title: 'Benefits section title', type: 'string', group: 'content'}),
    defineField({name: 'benefitsDescription', title: 'Benefits section description', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'benefitsBullets',
      title: 'Benefits bullet list',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
    }),
    defineField({name: 'directoryTitle', title: 'Directory section title', type: 'string', group: 'content'}),
    defineField({name: 'directoryDescription', title: 'Directory section description', type: 'text', rows: 3, group: 'content'}),
    defineField({
      name: 'directoryBullets',
      title: 'Directory bullet list',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
    }),
    ...networkWhyRelliaFields,
    ...networkCtaFields,
    modularSectionsField({
      description:
        'Optional modular blocks rendered on /industry-partners after the main page sections and before the footer CTA band.',
    }),
    singletonSeoField,
  ],
})
