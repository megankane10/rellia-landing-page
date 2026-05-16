import {defineArrayMember, defineField, defineType} from 'sanity'

export const programPage = defineType({
  name: 'programPage',
  title: 'Program page',
  type: 'document',
  description:
    'Shared schema for all program detail pages. The frontend keeps the same default layout for every program and uses this document for editable copy and optional extra sections.',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Internal title',
      description: 'Used in Studio lists only (e.g. Build Your QMS).',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description:
        'Route segment only. Example: `/programs/build-your-qms` => `build-your-qms`.',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'paymentUrl',
      type: 'url',
      title: 'Payment / waitlist link',
      description:
        'Fillout URL or Stripe payment URL opened from the program CTA.',
      group: 'content',
    }),
    defineField({name: 'heroTitle', type: 'string', group: 'content'}),
    defineField({name: 'heroDescription', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'heroCtaLabel', type: 'string', group: 'content'}),
    defineField({name: 'outcomesTitle', type: 'string', group: 'content'}),
    defineField({name: 'outcomesIntro', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'outcomes', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'howItWorksTitle', type: 'string', group: 'content'}),
    defineField({name: 'howItWorksIntro', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'pillarsTitle', type: 'string', group: 'content'}),
    defineField({name: 'timelineTitle', type: 'string', group: 'content'}),
    defineField({name: 'timelineSubtitle', type: 'text', rows: 2, group: 'content'}),
    defineField({name: 'pricingBadge', type: 'string', group: 'content'}),
    defineField({name: 'pricingAmount', type: 'string', group: 'content'}),
    defineField({name: 'pricingSubAmount', type: 'string', group: 'content'}),
    defineField({name: 'pricingDescription', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'pricingBullets', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'bottomCtaTitle', type: 'string', group: 'content'}),
    defineField({name: 'bottomCtaBody', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'bottomCtaButtonLabel', type: 'string', group: 'content'}),
    defineField({name: 'bottomContactHref', type: 'string', group: 'content'}),
    defineField({
      name: 'sections',
      title: 'Optional extra sections',
      description:
        'Adds extra modular sections after the default program layout. Leave empty to use only the default layout.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'sectionHero'}),
        defineArrayMember({type: 'sectionRichText'}),
        defineArrayMember({type: 'sectionCardsGrid'}),
      ],
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
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

