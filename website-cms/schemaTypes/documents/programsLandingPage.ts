import {defineField, defineType} from 'sanity'
import {preparePortableHeadlinePreview} from '../shared/portableTextPreview'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  GROUP_MODULAR_SECTIONS,
  modularSectionsField,
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
    GROUP_MODULAR_SECTIONS,
    ...CONTENT_SEO_GROUPS.filter((g) => g.name !== 'content'),
  ],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    portableHeadlineField({group: 'hero', required: true}),
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
    modularSectionsField({
      description:
        'Optional modular blocks rendered on /programs after the programs grid and before the footer CTA band.',
    }),
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
