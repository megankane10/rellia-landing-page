import {defineField, defineType} from 'sanity'
import {preparePortableHeadlinePreview} from '../shared/portableTextPreview'
import {studioListMedia} from '../shared/studioListMedia'

export const eventsLandingPage = defineType({
  name: 'eventsLandingPage',
  title: 'Events page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'cta', title: 'CTA'},
  ],
  fields: [
    defineField({
      name: 'heroTitlePortable',
      title: 'Hero headline',
      type: 'inlineHeroHeadline',
      description: 'Main headline. Use Mint/Teal decorators for colored phrases.',
      group: 'hero',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'string', group: 'cta'}),
    defineField({name: 'ctaBody', title: 'CTA body', type: 'text', rows: 3, group: 'cta'}),
    defineField({name: 'ctaPrimaryLabel', title: 'Primary button label', type: 'string', group: 'cta'}),
    defineField({name: 'ctaPrimaryHref', title: 'Primary button link', type: 'string', group: 'cta'}),
    defineField({name: 'ctaSecondaryLabel', title: 'Secondary button label', type: 'string', group: 'cta'}),
    defineField({name: 'ctaSecondaryHref', title: 'Secondary button link', type: 'string', group: 'cta'}),
  ],
  preview: {
    select: {heroTitlePortable: 'heroTitlePortable', heroSubtitle: 'heroSubtitle'},
    prepare: ({heroTitlePortable, heroSubtitle}) => ({
      ...preparePortableHeadlinePreview({
        headline: heroTitlePortable,
        fallback: 'Events',
        subtitle: heroSubtitle,
      }),
      media: studioListMedia.document,
    }),
  },
})
