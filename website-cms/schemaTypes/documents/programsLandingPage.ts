import {defineField, defineType} from 'sanity'
import {preparePortableHeadlinePreview} from '../shared/portableTextPreview'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'
import {studioListMedia} from '../shared/studioListMedia'

export const programsLandingPage = defineType({
  name: 'programsLandingPage',
  title: 'Programs & events landing',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'programs', title: 'Programs'},
    {name: 'cta', title: 'CTA'},
    ...CONTENT_SEO_GROUPS.filter((g) => g.name !== 'content'),
  ],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({
      name: 'heroTitlePortable',
      title: 'Hero headline',
      type: 'inlineHeroHeadline',
      description: 'Use Mint/Teal decorators for highlighted phrases.',
      group: 'hero',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'heroSubtitle', title: 'Hero subtitle', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroPrimaryCtaLabel', title: 'Primary button label', type: 'string', group: 'hero'}),
    defineField({name: 'heroSecondaryCtaLabel', title: 'Secondary button label', type: 'string', group: 'hero'}),
    defineField({
      name: 'programsSectionTitle',
      title: 'Programs grid heading',
      type: 'string',
      initialValue: 'Explore programs',
      group: 'programs',
    }),
    defineField({
      name: 'programsSectionSubtitle',
      title: 'Programs grid intro',
      type: 'text',
      rows: 2,
      group: 'programs',
    }),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'string', group: 'cta'}),
    defineField({name: 'ctaBody', title: 'CTA body', type: 'text', rows: 2, group: 'cta'}),
    defineField({name: 'ctaButtonLabel', title: 'CTA button label', type: 'string', group: 'cta'}),
    defineField({name: 'ctaButtonHref', title: 'CTA button link', type: 'string', group: 'cta'}),
    singletonSeoField,
  ],
  preview: {
    select: {heroTitlePortable: 'heroTitlePortable', heroSubtitle: 'heroSubtitle'},
    prepare: ({heroTitlePortable, heroSubtitle}) => ({
      ...preparePortableHeadlinePreview({
        headline: heroTitlePortable,
        fallback: 'Programs',
        subtitle: heroSubtitle,
      }),
      media: studioListMedia.document,
    }),
  },
})
