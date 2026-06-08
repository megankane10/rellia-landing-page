import {defineArrayMember, defineField, defineType} from 'sanity'
import {CONTENT_SEO_FIELDSETS, singletonSeoField} from '../shared/singletonContentFields'
import {GROUP_SEO} from '../shared/fieldGroups'
import {pageSectionMembers} from '../shared/pageSectionMembers'
import {programPublishingFields} from '../shared/documentTopFields'

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  groups: [
    {name: 'publishing', title: 'Publishing', default: true},
    {name: 'card', title: 'Program card'},
    {name: 'detail', title: 'Detail page'},
    GROUP_SEO,
  ],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    ...programPublishingFields,
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'card',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'card',
    }),
    defineField({
      name: 'description',
      title: 'Card description',
      type: 'text',
      rows: 3,
      description: 'Short copy shown on the /programs grid card.',
      group: 'card',
    }),
    defineField({
      name: 'deadline',
      title: 'Application deadline',
      type: 'string',
      description:
        'Shown on program cards (e.g. "May 31"). Leave empty to auto-use the last day of the current month.',
      group: 'card',
    }),
    defineField({
      name: 'image',
      title: 'Card & hero image',
      type: 'image',
      options: {hotspot: true},
      group: 'card',
    }),
    defineField({
      name: 'buttonText',
      type: 'string',
      initialValue: 'Learn more',
      group: 'card',
    }),
    defineField({
      name: 'href',
      title: 'Program route',
      type: 'string',
      description: 'Usually /programs/<slug>.',
      group: 'card',
    }),
    defineField({
      name: 'waitlistHref',
      title: 'Waitlist / registration URL',
      type: 'string',
      group: 'card',
    }),
    defineField({
      name: 'paymentUrl',
      type: 'url',
      title: 'Payment / registration URL',
      description: 'Fillout or Stripe link for the detail page CTA.',
      group: 'detail',
    }),
    defineField({name: 'heroTitle', type: 'string', group: 'detail'}),
    defineField({name: 'heroDescription', type: 'text', rows: 4, group: 'detail'}),
    defineField({name: 'heroCtaLabel', type: 'string', group: 'detail'}),
    defineField({name: 'outcomesTitle', type: 'string', group: 'detail'}),
    defineField({name: 'outcomesIntro', type: 'text', rows: 3, group: 'detail'}),
    defineField({name: 'outcomes', type: 'array', of: [{type: 'string'}], group: 'detail'}),
    defineField({name: 'howItWorksTitle', type: 'string', group: 'detail'}),
    defineField({name: 'howItWorksIntro', type: 'text', rows: 3, group: 'detail'}),
    defineField({
      name: 'howItWorksCards',
      title: 'How it works cards',
      description: 'Three image cards below the how-it-works intro. Icons stay fixed in the site layout.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'description', type: 'text', rows: 3}),
            defineField({name: 'image', title: 'Card image', type: 'image', options: {hotspot: true}}),
          ],
          preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
        }),
      ],
      group: 'detail',
    }),
    defineField({name: 'pillarsTitle', type: 'string', group: 'detail'}),
    defineField({
      name: 'pillars',
      title: 'Program pillar cards',
      description: 'Four pillar cards (title + description). Icons stay fixed in the site layout.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'description', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
      group: 'detail',
    }),
    defineField({name: 'timelineTitle', type: 'string', group: 'detail'}),
    defineField({name: 'timelineSubtitle', type: 'text', rows: 2, group: 'detail'}),
    defineField({
      name: 'timelineSteps',
      title: 'Timeline steps',
      type: 'array',
      group: 'detail',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'programTimelineStep',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', type: 'text', rows: 3}),
            defineField({
              name: 'weekLabel',
              title: 'Week label',
              type: 'string',
              description: 'e.g. Week 1–2',
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'weekLabel'}},
        }),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({type: 'landingTestimonialItem'})],
      group: 'detail',
    }),
    defineField({name: 'pricingBadge', type: 'string', group: 'detail'}),
    defineField({name: 'pricingAmount', type: 'string', group: 'detail', title: 'Price (sale)'}),
    defineField({
      name: 'pricingDiscountEnabled',
      type: 'boolean',
      title: 'Show strikethrough compare price',
      initialValue: false,
      group: 'detail',
    }),
    defineField({
      name: 'pricingCompareAmount',
      type: 'string',
      title: 'Compare price (strikethrough, e.g. $3,000)',
      group: 'detail',
    }),
    defineField({name: 'pricingSubAmount', type: 'string', group: 'detail'}),
    defineField({name: 'pricingDescription', type: 'text', rows: 3, group: 'detail'}),
    defineField({name: 'pricingBullets', type: 'array', of: [{type: 'string'}], group: 'detail'}),
    defineField({name: 'bottomCtaTitle', type: 'string', group: 'detail'}),
    defineField({name: 'bottomCtaBody', type: 'text', rows: 3, group: 'detail'}),
    defineField({name: 'bottomCtaButtonLabel', type: 'string', group: 'detail'}),
    defineField({name: 'bottomContactHref', type: 'string', group: 'detail'}),
    defineField({
      name: 'sections',
      title: 'Extra sections',
      description: 'Modular blocks appended after the default program layout (hero, FAQ-style grids, CTAs, timelines, etc.).',
      type: 'array',
      group: 'detail',
      of: pageSectionMembers,
    }),
    singletonSeoField,
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      description: 'description',
      media: 'image',
    },
    prepare({title, status, description, media}) {
      const displayTitle = title?.trim() || 'Untitled program'
      const statusLabel =
        status === 'waitlist' ? 'Waitlist' : status === 'hidden' ? 'Hidden' : 'Available'
      const blurb =
        typeof description === 'string' && description.trim()
          ? description.trim().slice(0, 72) + (description.length > 72 ? '…' : '')
          : undefined
      const subtitle = [statusLabel, blurb].filter(Boolean).join(' · ')
      return {title: displayTitle, subtitle: subtitle || undefined, media}
    },
  },
})
