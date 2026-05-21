import {defineArrayMember, defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {seoField} from '../shared/seoField'

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  groups: [
    {name: 'card', title: 'Program card', default: true},
    {name: 'detail', title: 'Detail page'},
    {name: 'publishing', title: 'Publishing'},
  ],
  fieldsets: [FIELDSET_SEO],
  fields: [
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
      name: 'status',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Waitlist', value: 'waitlist'},
          {title: 'Hidden', value: 'hidden'},
        ],
      },
      initialValue: 'available',
      group: 'publishing',
    }),
    defineField({name: 'sortOrder', type: 'number', initialValue: 0, group: 'publishing'}),
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
    defineField({name: 'pillarsTitle', type: 'string', group: 'detail'}),
    defineField({name: 'timelineTitle', type: 'string', group: 'detail'}),
    defineField({name: 'timelineSubtitle', type: 'text', rows: 2, group: 'detail'}),
    defineField({name: 'pricingBadge', type: 'string', group: 'detail'}),
    defineField({name: 'pricingAmount', type: 'string', group: 'detail'}),
    defineField({name: 'pricingSubAmount', type: 'string', group: 'detail'}),
    defineField({name: 'pricingDescription', type: 'text', rows: 3, group: 'detail'}),
    defineField({name: 'pricingBullets', type: 'array', of: [{type: 'string'}], group: 'detail'}),
    defineField({name: 'bottomCtaTitle', type: 'string', group: 'detail'}),
    defineField({name: 'bottomCtaBody', type: 'text', rows: 3, group: 'detail'}),
    defineField({name: 'bottomCtaButtonLabel', type: 'string', group: 'detail'}),
    defineField({name: 'bottomContactHref', type: 'string', group: 'detail'}),
    defineField({
      name: 'sections',
      title: 'Optional extra sections',
      description: 'Modular blocks appended after the default program layout.',
      type: 'array',
      group: 'detail',
      of: [
        defineArrayMember({type: 'sectionHero'}),
        defineArrayMember({type: 'sectionRichText'}),
        defineArrayMember({type: 'sectionCardsGrid'}),
      ],
    }),
    seoField,
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current', media: 'image'},
    prepare(value) {
      const title = value.title || 'Untitled program'
      const subtitle = value.subtitle ? `/programs/${value.subtitle}` : 'Missing slug'
      return {title, subtitle, media: value.media}
    },
  },
})
