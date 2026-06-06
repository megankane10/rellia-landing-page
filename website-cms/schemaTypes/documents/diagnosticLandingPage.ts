import {defineArrayMember, defineField, defineType} from 'sanity'
import {publishingGroup, pageVisibilityFields} from '../shared/pageVisibilityFields'
import {studioListMedia} from '../shared/studioListMedia'

const GROUP_HERO = {name: 'hero', title: 'Hero', default: true}
const GROUP_READINESS = {name: 'readiness', title: 'Readiness map'}
const GROUP_INFOGRAPHIC = {name: 'infographic', title: 'Infographic'}
const GROUP_TIMELINE = {name: 'timeline', title: 'Timeline'}
const GROUP_CTA = {name: 'cta', title: 'Bottom CTA'}

export const diagnosticLandingPage = defineType({
  name: 'diagnosticLandingPage',
  title: 'Startup diagnostic landing (/startup-diagnostic)',
  type: 'document',
  groups: [GROUP_HERO, GROUP_READINESS, GROUP_INFOGRAPHIC, GROUP_TIMELINE, GROUP_CTA, publishingGroup],
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Startup Diagnostic', group: 'hero'}),
    defineField({
      name: 'surveyNote',
      title: 'Survey page note (editors)',
      type: 'text',
      rows: 3,
      readOnly: true,
      initialValue:
        'The interactive survey at /diagnostic-survey is driven by the app (questions & scoring). Edit this landing page for marketing copy; contact engineering to change survey logic.',
      group: 'hero',
    }),
    defineField({
      name: 'heroBadgeLabel',
      title: 'Hero badge',
      type: 'string',
      initialValue: 'LAUNCH READINESS',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero headline (before accent)',
      type: 'string',
      initialValue: 'Pressure-test your startup for',
      group: 'hero',
    }),
    defineField({
      name: 'heroAccentPhrase',
      title: 'Hero accent phrase (mint)',
      type: 'string',
      initialValue: 'healthcare reality.',
      group: 'hero',
    }),
    defineField({name: 'heroSubtitle', title: 'Hero subtitle', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'image', options: {hotspot: true}, group: 'hero'}),
    defineField({name: 'heroImageUrl', title: 'Hero image URL (fallback)', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Primary CTA label',
      type: 'string',
      initialValue: 'Begin Free Assessment',
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCtaHref',
      title: 'Primary CTA link',
      type: 'string',
      initialValue: '/diagnostic-survey',
      group: 'hero',
    }),
    defineField({
      name: 'readinessTitle',
      title: 'Section title',
      type: 'string',
      initialValue: 'A complete readiness map',
      group: 'readiness',
    }),
    defineField({name: 'readinessDescription', title: 'Section description', type: 'text', rows: 3, group: 'readiness'}),
    defineField({
      name: 'readinessFeatures',
      title: 'Feature cards',
      type: 'array',
      group: 'readiness',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'readinessFeature',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
            defineField({name: 'image', type: 'image', options: {hotspot: true}}),
            defineField({name: 'imageSrc', title: 'Image URL (fallback)', type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'infographicTitle',
      title: 'Section title',
      type: 'string',
      initialValue: 'No stone left unturned',
      group: 'infographic',
    }),
    defineField({name: 'infographicBody', title: 'Section body', type: 'text', rows: 4, group: 'infographic'}),
    defineField({
      name: 'infographicTopWeaknessLabel',
      title: 'Top weakness label',
      type: 'string',
      initialValue: 'Regulatory Strategy',
      group: 'infographic',
    }),
    defineField({
      name: 'infographicTopWeaknessScore',
      title: 'Top weakness score (%)',
      type: 'number',
      initialValue: 32,
      validation: (Rule) => Rule.min(0).max(100),
      group: 'infographic',
    }),
    defineField({
      name: 'infographicGapLabel',
      title: 'Gap severity label',
      type: 'string',
      initialValue: 'Critical Gap',
      group: 'infographic',
    }),
    defineField({
      name: 'infographicAdvisorMatchLabel',
      title: 'Advisor match label',
      type: 'string',
      initialValue: 'Vetted Advisor Match',
      group: 'infographic',
    }),
    defineField({
      name: 'infographicAdvisorRole',
      title: 'Advisor role (blurred preview)',
      type: 'string',
      initialValue: 'Regulatory Director',
      group: 'infographic',
    }),
    defineField({
      name: 'infographicAdvisorSubtitle',
      title: 'Advisor subtitle',
      type: 'string',
      initialValue: 'Ex-FDA Reviewer',
      group: 'infographic',
    }),
    defineField({
      name: 'infographicBlobRoadmap',
      title: 'Blob: Personalized roadmap',
      type: 'string',
      initialValue: 'Personalized Roadmap',
      group: 'infographic',
    }),
    defineField({
      name: 'infographicBlobAdvisors',
      title: 'Blob: Matched advisors',
      type: 'string',
      initialValue: 'Matched Advisors',
      group: 'infographic',
    }),
    defineField({
      name: 'infographicBlobBlindSpot',
      title: 'Blob: Blind spot discovery',
      type: 'string',
      initialValue: 'Blind Spot Discovery',
      group: 'infographic',
    }),
    defineField({
      name: 'timelineTitle',
      title: 'Timeline heading',
      type: 'string',
      initialValue: 'Survey to insights in 15 minutes',
      group: 'timeline',
    }),
    defineField({name: 'timelineSubheading', title: 'Timeline subheading', type: 'text', rows: 2, group: 'timeline'}),
    defineField({
      name: 'timelineSteps',
      title: 'Timeline steps',
      type: 'array',
      group: 'timeline',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', type: 'text', rows: 2, validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA headline',
      type: 'string',
      initialValue: 'Benchmark your startup today',
      group: 'cta',
    }),
    defineField({name: 'ctaBody', title: 'CTA body', type: 'text', rows: 2, group: 'cta'}),
    defineField({
      name: 'ctaPrimaryLabel',
      title: 'Primary CTA label',
      type: 'string',
      initialValue: 'Take the Diagnostic',
      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryHref',
      title: 'Primary CTA link',
      type: 'string',
      initialValue: '/diagnostic-survey',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSecondaryLabel',
      title: 'Secondary CTA label',
      type: 'string',
      initialValue: 'Join as Member',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSecondaryHref',
      title: 'Secondary CTA link',
      type: 'string',
      initialValue: '/apply',
      group: 'cta',
    }),
    ...pageVisibilityFields,
  ],
  preview: {
    prepare() {
      return {
        title: 'Startup diagnostic landing',
        subtitle: '/startup-diagnostic',
        media: studioListMedia.document,
      }
    },
  },
})
