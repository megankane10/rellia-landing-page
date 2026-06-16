import {defineArrayMember, defineField, defineType} from 'sanity'
import {CONTENT_SEO_FIELDSETS, GROUP_MODULAR_SECTIONS, modularSectionsField, singletonSeoField} from '../shared/singletonContentFields'
import {GROUP_SEO} from '../shared/fieldGroups'
import {studioListMedia} from '../shared/studioListMedia'
import {networkHeroFields} from '../shared/networkPageFields'
import {iconKeyField} from '../shared/iconKeyField'

const GROUP_HERO = {name: 'hero', title: 'Hero', default: true}
const GROUP_FIT = {name: 'fit', title: 'Fit section'}
const GROUP_SERVICES = {name: 'services', title: 'Services'}
const GROUP_TESTIMONIALS = {name: 'testimonials', title: 'Testimonials'}
const GROUP_MEMBERSHIP = {name: 'membership', title: 'Membership value'}
const GROUP_CTA = {name: 'cta', title: 'Bottom CTA'}

export const consultingPage = defineType({
  name: 'consultingPage',
  title: 'Consulting page (/consulting)',
  type: 'document',
  groups: [GROUP_HERO, GROUP_FIT, GROUP_SERVICES, GROUP_TESTIMONIALS, GROUP_MEMBERSHIP, GROUP_CTA, GROUP_MODULAR_SECTIONS, GROUP_SEO],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Consulting', group: 'hero'}),
    ...networkHeroFields.map((field) =>
      field.name === 'heroEyebrow'
        ? {...field, initialValue: 'Consulting'}
        : field,
    ),
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
            iconKeyField({
              description: 'Lucide icon for this service card, e.g. ShieldCheck, Stethoscope, Megaphone',
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
    defineField({
      name: 'ctaSecondaryLabel',
      title: 'Secondary CTA label',
      type: 'string',
      description: 'Optional. Secondary button is hidden unless both label and link are filled in.',
      group: 'cta',
    }),
    defineField({name: 'ctaSecondaryHref', title: 'Secondary CTA link', type: 'string', group: 'cta'}),
    modularSectionsField({
      description:
        'Optional modular blocks rendered on /consulting after the membership section and before the footer CTA band.',
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
