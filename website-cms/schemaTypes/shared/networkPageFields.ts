import {defineArrayMember, defineField} from 'sanity'
import {GROUP_SEO} from './fieldGroups'

export const NETWORK_PAGE_GROUPS = [
  {name: 'hero', title: 'Hero', default: true},
  {name: 'content', title: 'Page sections'},
  GROUP_SEO,
]

export const networkHeroFields = [
  defineField({
    name: 'heroEyebrow',
    title: 'Hero eyebrow',
    type: 'string',
    group: 'hero',
  }),
  defineField({
    name: 'heroTitle',
    title: 'Hero headline (before accent)',
    type: 'string',
    group: 'hero',
  }),
  defineField({
    name: 'heroAccentPhrase',
    title: 'Hero accent phrase (mint)',
    type: 'string',
    group: 'hero',
  }),
  defineField({name: 'heroSubtitle', title: 'Hero subtitle', type: 'text', rows: 3, group: 'hero'}),
  defineField({name: 'heroImage', title: 'Hero image', type: 'image', options: {hotspot: true}, group: 'hero'}),
  defineField({name: 'heroImageUrl', title: 'Hero image URL (fallback)', type: 'string', group: 'hero'}),
  defineField({name: 'heroPrimaryCtaLabel', title: 'Primary CTA label', type: 'string', group: 'hero'}),
  defineField({name: 'heroPrimaryCtaHref', title: 'Primary CTA link', type: 'string', group: 'hero'}),
  defineField({name: 'heroSecondaryCtaLabel', title: 'Secondary CTA label', type: 'string', group: 'hero'}),
  defineField({name: 'heroSecondaryCtaHref', title: 'Secondary CTA link', type: 'string', group: 'hero'}),
]

export const networkEngageCardMember = defineArrayMember({
  type: 'object',
  name: 'networkEngageCard',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'body', type: 'text', rows: 2}),
    defineField({name: 'href', title: 'Link', type: 'string'}),
    defineField({name: 'linkLabel', title: 'Link label', type: 'string', initialValue: 'Continue'}),
    defineField({
      name: 'iconKey',
      title: 'Icon',
      type: 'string',
      description: 'Lucide icon name, e.g. UserPlus, BookOpen, Network',
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})

export const networkFeatureItemMember = defineArrayMember({
  type: 'object',
  name: 'networkFeatureItem',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'body', type: 'text', rows: 3}),
    defineField({name: 'iconKey', title: 'Icon', type: 'string'}),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})

export const networkEligibilityItemMember = defineArrayMember({
  type: 'object',
  name: 'networkEligibilityItem',
  fields: [
    defineField({name: 'text', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'imageUrl', title: 'Card image URL', type: 'string'}),
  ],
  preview: {select: {title: 'text'}},
})

export const networkExploreCardMember = defineArrayMember({
  type: 'object',
  name: 'networkExploreCard',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'badge', type: 'string'}),
    defineField({name: 'imageUrl', title: 'Image URL', type: 'string'}),
    defineField({name: 'ctaLabel', title: 'Button label', type: 'string'}),
    defineField({name: 'ctaHref', title: 'Button link', type: 'string'}),
  ],
  preview: {select: {title: 'title', subtitle: 'badge'}},
})

export const networkJourneyStepMember = defineArrayMember({
  type: 'object',
  name: 'networkJourneyStep',
  fields: [
    defineField({name: 'id', title: 'Step id', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'zone',
      type: 'string',
      options: {list: [{title: 'Outside Rellia', value: 'outside'}, {title: 'Rellia', value: 'rellia'}]},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'detail', type: 'text', rows: 2}),
  ],
  preview: {select: {title: 'label', subtitle: 'zone'}},
})

export const networkCtaFields = [
  defineField({name: 'ctaTitle', title: 'CTA headline', type: 'string', group: 'content'}),
  defineField({name: 'ctaBody', title: 'CTA body', type: 'text', rows: 2, group: 'content'}),
  defineField({name: 'ctaPrimaryLabel', title: 'Primary button label', type: 'string', group: 'content'}),
  defineField({name: 'ctaPrimaryHref', title: 'Primary button link', type: 'string', group: 'content'}),
  defineField({name: 'ctaSecondaryLabel', title: 'Secondary button label', type: 'string', group: 'content'}),
  defineField({name: 'ctaSecondaryHref', title: 'Secondary button link', type: 'string', group: 'content'}),
]

export const networkEngageBandFields = [
  defineField({name: 'engageTitle', title: 'Engage band title', type: 'string', group: 'content'}),
  defineField({name: 'engageSubtitle', title: 'Engage band subtitle', type: 'text', rows: 2, group: 'content'}),
  defineField({
    name: 'engageItems',
    title: 'Engage cards',
    type: 'array',
    of: [networkEngageCardMember],
    group: 'content',
  }),
]

export const networkWhyRelliaFields = [
  defineField({name: 'whyTitle', title: 'Why Rellia section title', type: 'string', group: 'content'}),
  defineField({name: 'whyDescription', title: 'Why Rellia section description', type: 'text', rows: 2, group: 'content'}),
  defineField({
    name: 'whyFeatures',
    title: 'Why Rellia features',
    type: 'array',
    of: [networkFeatureItemMember],
    group: 'content',
  }),
]
