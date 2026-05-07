import {defineArrayMember, defineField, defineType} from 'sanity'

export const programPage = defineType({
  name: 'programPage',
  title: 'Program page',
  type: 'document',
  description:
    'Shared schema for all program detail pages. The frontend keeps the same default layout for every program and uses this document for editable copy and optional extra sections.',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Internal title',
      description: 'Used in Studio lists only (e.g. Build Your QMS).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description:
        'Route segment only. Example: `/programs/build-your-qms` => `build-your-qms`.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentUrl',
      type: 'url',
      title: 'Payment / waitlist link',
      description:
        'Fillout URL or Stripe payment URL opened from the program CTA.',
    }),
    defineField({name: 'heroTitle', type: 'string'}),
    defineField({name: 'heroDescription', type: 'text', rows: 4}),
    defineField({name: 'heroCtaLabel', type: 'string'}),
    defineField({name: 'outcomesTitle', type: 'string'}),
    defineField({name: 'outcomesIntro', type: 'text', rows: 3}),
    defineField({name: 'outcomes', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'howItWorksTitle', type: 'string'}),
    defineField({name: 'howItWorksIntro', type: 'text', rows: 3}),
    defineField({name: 'pillarsTitle', type: 'string'}),
    defineField({name: 'timelineTitle', type: 'string'}),
    defineField({name: 'timelineSubtitle', type: 'text', rows: 2}),
    defineField({name: 'pricingBadge', type: 'string'}),
    defineField({name: 'pricingAmount', type: 'string'}),
    defineField({name: 'pricingSubAmount', type: 'string'}),
    defineField({name: 'pricingDescription', type: 'text', rows: 3}),
    defineField({name: 'pricingBullets', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'bottomCtaTitle', type: 'string'}),
    defineField({name: 'bottomCtaBody', type: 'text', rows: 3}),
    defineField({name: 'bottomCtaButtonLabel', type: 'string'}),
    defineField({name: 'bottomContactHref', type: 'string'}),
    defineField({
      name: 'sections',
      title: 'Optional extra sections',
      description:
        'Adds extra modular sections after the default program layout. Leave empty to use only the default layout.',
      type: 'array',
      of: [
        defineArrayMember({type: 'sectionHero'}),
        defineArrayMember({type: 'sectionRichText'}),
        defineArrayMember({type: 'sectionCardsGrid'}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
    prepare(value) {
      const title = value.title || 'Untitled program page'
      const subtitle = value.subtitle ? `/programs/${value.subtitle}` : 'Missing slug'
      return {title, subtitle}
    },
  },
})

