import {defineArrayMember, defineField, defineType} from 'sanity'
import {pageSectionMembers} from '../shared/pageSectionMembers'
import {CONTENT_SEO_FIELDSETS, singletonSeoField} from '../shared/singletonContentFields'
import {GROUP_SEO} from '../shared/fieldGroups'
import {studioListMedia} from '../shared/studioListMedia'

const GROUP_HERO = {name: 'hero', title: 'Hero', default: true}
const GROUP_FIT = {name: 'fit', title: 'Fit section'}
const GROUP_SERVICES = {name: 'services', title: 'Services'}
const GROUP_TESTIMONIALS = {name: 'testimonials', title: 'Testimonials'}
const GROUP_MEMBERSHIP = {name: 'membership', title: 'Membership value'}
const GROUP_CTA = {name: 'cta', title: 'Bottom CTA'}
const GROUP_SECTIONS = {name: 'sections', title: 'Modular sections'}

export const consultingPage = defineType({
  name: 'consultingPage',
  title: 'Consulting page (/consulting)',
  type: 'document',
  groups: [GROUP_HERO, GROUP_FIT, GROUP_SERVICES, GROUP_TESTIMONIALS, GROUP_MEMBERSHIP, GROUP_CTA, GROUP_SECTIONS, GROUP_SEO],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Consulting', group: 'hero'}),
    defineField({name: 'heroEyebrow', title: 'Hero eyebrow', type: 'string', initialValue: 'Consulting', group: 'hero'}),
    defineField({
      name: 'heroTitle',
      title: 'Hero headline',
      type: 'string',
      initialValue: 'Founder consulting',
      group: 'hero',
    }),
    defineField({
      name: 'heroAccentPhrase',
      title: 'Hero accent phrase (mint)',
      type: 'string',
      initialValue: 'built for healthcare reality',
      group: 'hero',
    }),
    defineField({name: 'heroSubtitle', title: 'Hero subtitle', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'image', options: {hotspot: true}, group: 'hero'}),
    defineField({name: 'heroImageUrl', title: 'Hero image URL (fallback)', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Primary CTA label',
      type: 'string',
      initialValue: 'Start a conversation',
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCtaHref',
      title: 'Primary CTA link',
      type: 'string',
      initialValue: '/contact',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Secondary CTA label',
      type: 'string',
      initialValue: 'Apply for membership',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaHref',
      title: 'Secondary CTA link',
      type: 'string',
      initialValue: '/apply',
      group: 'hero',
    }),
    defineField({
      name: 'fitTitle',
      title: 'Section title',
      type: 'string',
      initialValue: 'When consulting makes sense',
      group: 'fit',
    }),
    defineField({name: 'fitDescription', title: 'Section description', type: 'text', rows: 3, group: 'fit'}),
    defineField({
      name: 'fitBullets',
      title: 'Bullet points',
      type: 'array',
      of: [{type: 'string'}],
      group: 'fit',
    }),
    defineField({name: 'fitImage', title: 'Side image', type: 'image', options: {hotspot: true}, group: 'fit'}),
    defineField({name: 'fitImageUrl', title: 'Side image URL (fallback)', type: 'string', group: 'fit'}),
    defineField({
      name: 'servicesTitle',
      title: 'Section title',
      type: 'string',
      initialValue: 'Common consulting sprints',
      group: 'services',
    }),
    defineField({name: 'servicesSubtitle', title: 'Section subtitle', type: 'text', rows: 2, group: 'services'}),
    defineField({
      name: 'services',
      title: 'Service cards',
      type: 'array',
      group: 'services',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'consultingService',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'body', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
            defineField({name: 'ctaLabel', title: 'Card link label', type: 'string'}),
            defineField({
              name: 'iconKey',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Shield', value: 'ShieldCheck'},
                  {title: 'Stethoscope', value: 'Stethoscope'},
                  {title: 'Megaphone', value: 'Megaphone'},
                  {title: 'Palette', value: 'Palette'},
                ],
              },
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        }),
      ],
    }),
    defineField({
      name: 'testimonialsTitle',
      title: 'Section title',
      type: 'string',
      initialValue: 'Already trusted by Rellia members',
      group: 'testimonials',
    }),
    defineField({
      name: 'testimonials',
      title: 'Quotes',
      type: 'array',
      of: [defineArrayMember({type: 'landingTestimonialItem'})],
      group: 'testimonials',
    }),
    defineField({
      name: 'membershipTitle',
      title: 'Section title',
      type: 'string',
      initialValue: 'Membership makes consulting even more valuable',
      group: 'membership',
    }),
    defineField({name: 'membershipDescription', title: 'Section description', type: 'text', rows: 3, group: 'membership'}),
    defineField({
      name: 'membershipStats',
      title: 'Stat rows',
      type: 'array',
      group: 'membership',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string'}),
            defineField({name: 'value', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({name: 'membershipSavingsTitle', title: 'Savings card title', type: 'string', group: 'membership'}),
    defineField({name: 'membershipSavingsBody', title: 'Savings card body', type: 'text', rows: 2, group: 'membership'}),
    defineField({
      name: 'membershipPrimaryCtaLabel',
      title: 'Primary button label',
      type: 'string',
      initialValue: 'Apply for membership',
      group: 'membership',
    }),
    defineField({
      name: 'membershipPrimaryCtaHref',
      title: 'Primary button link',
      type: 'string',
      initialValue: '/apply',
      group: 'membership',
    }),
    defineField({
      name: 'membershipSecondaryCtaLabel',
      title: 'Secondary button label',
      type: 'string',
      initialValue: 'Ask about consulting',
      group: 'membership',
    }),
    defineField({
      name: 'membershipSecondaryCtaHref',
      title: 'Secondary button link',
      type: 'string',
      initialValue: '/contact',
      group: 'membership',
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA headline',
      type: 'string',
      initialValue: 'Not sure which path fits?',
      group: 'cta',
    }),
    defineField({name: 'ctaBody', title: 'CTA body', type: 'text', rows: 2, group: 'cta'}),
    defineField({
      name: 'ctaPrimaryLabel',
      title: 'Primary CTA label',
      type: 'string',
      initialValue: 'Talk to us',
      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryHref',
      title: 'Primary CTA link',
      type: 'string',
      initialValue: '/contact',
      group: 'cta',
    }),
    defineField({name: 'ctaSecondaryLabel', title: 'Secondary CTA label', type: 'string', group: 'cta'}),
    defineField({name: 'ctaSecondaryHref', title: 'Secondary CTA link', type: 'string', group: 'cta'}),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      of: pageSectionMembers,
      group: 'sections',
    }),
    singletonSeoField,
  ],
  preview: {
    prepare() {
      return {
        title: 'Consulting page',
        subtitle: '/consulting',
        media: studioListMedia.document,
      }
    },
  },
})
