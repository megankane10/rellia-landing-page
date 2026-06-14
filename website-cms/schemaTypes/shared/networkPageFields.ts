import {defineArrayMember, defineField} from 'sanity'
import {GROUP_SEO} from './fieldGroups'
import {imageUploadField, imageUrlFallbackField} from './imageFields'
import {portableHeadlineField} from './inlineHeroHeadlineField'
import {iconKeyField} from './iconKeyField'

import {GROUP_MODULAR_SECTIONS} from './singletonContentFields'

export const NETWORK_PAGE_GROUPS = [
  {name: 'hero', title: 'Hero', default: true},
  {name: 'content', title: 'Page sections'},
  GROUP_MODULAR_SECTIONS,
  GROUP_SEO,
]

export const networkHeroFields = [
  defineField({
    name: 'heroEyebrow',
    title: 'Hero eyebrow',
    type: 'string',
    group: 'hero',
  }),
  portableHeadlineField({group: 'hero'}),
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
    iconKeyField(),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})

export const networkFeatureItemMember = defineArrayMember({
  type: 'object',
  name: 'networkFeatureItem',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    iconKeyField(),
    imageUploadField('image', 'Card image', {
      description: 'Background image for this expandable image panel.',
    }),
    imageUrlFallbackField('imageSrc', 'Card image URL (fallback)'),
    defineField({name: 'buttonLabel', title: 'Optional button label', type: 'string'}),
    defineField({
      name: 'buttonPath',
      title: 'Optional button link',
      type: 'string',
      description: 'Internal path, e.g. /programs',
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'body', media: 'image'}},
})

export const networkEligibilityItemMember = defineArrayMember({
  type: 'object',
  name: 'networkEligibilityItem',
  fields: [
    defineField({name: 'text', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'image',
      title: 'Card image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'imageUrl', title: 'Card image URL (fallback)', type: 'string'}),
  ],
  preview: {select: {title: 'text', media: 'image'}},
})

export const networkExploreCardMember = defineArrayMember({
  type: 'object',
  name: 'networkExploreCard',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'badge', type: 'string'}),
    defineField({
      name: 'image',
      title: 'Card image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'imageUrl', title: 'Image URL (fallback)', type: 'string'}),
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
    iconKeyField({
      description: 'Lucide icon name, e.g. Lightbulb, Rocket, ShieldCheck',
    }),
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
  defineField({
    name: 'whyTitle',
    title: 'Section heading',
    type: 'string',
    description: 'Headline above the four expandable image panels (WhyRellia component).',
    group: 'content',
  }),
  defineField({
    name: 'whyDescription',
    title: 'Section intro',
    type: 'text',
    rows: 2,
    description: 'Short paragraph under the heading.',
    group: 'content',
  }),
  defineField({
    name: 'whyFeatures',
    title: 'Feature cards (4 image panels)',
    type: 'array',
    description: 'Up to four cards with background image, title, description, and optional button.',
    of: [networkFeatureItemMember],
    group: 'content',
  }),
]
