import {defineField, defineType} from 'sanity'
import {CONTENT_SEO_FIELDSETS, singletonSeoField} from '../shared/singletonContentFields'
import {
  NETWORK_PAGE_GROUPS,
  networkCtaFields,
  networkEngageBandFields,
  networkFeatureItemMember,
  networkHeroFields,
  networkWhyRelliaFields,
} from '../shared/networkPageFields'
import {networkDirectoryChromeFields} from '../shared/directoryPageFields'

export const networkAdvisorsPage = defineType({
  name: 'networkAdvisorsPage',
  title: 'Network — Advisors page (/advisors)',
  type: 'document',
  groups: NETWORK_PAGE_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Advisors', group: 'hero'}),
    ...networkHeroFields,
    ...networkEngageBandFields,
    defineField({name: 'scheduleTitle', title: 'Schedule section title', type: 'string', group: 'content'}),
    defineField({
      name: 'scheduleItems',
      title: 'Schedule highlights',
      type: 'array',
      of: [networkFeatureItemMember],
      group: 'content',
    }),
    defineField({name: 'benefitsTitle', title: 'Benefits section title', type: 'string', group: 'content'}),
    defineField({name: 'benefitsDescription', title: 'Benefits section description', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'benefitsBullets',
      title: 'Benefits bullet list',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
    }),
    ...networkWhyRelliaFields,
    ...networkCtaFields,
    ...networkDirectoryChromeFields,
    singletonSeoField,
  ],
})
