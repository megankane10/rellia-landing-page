import {defineField, defineType} from 'sanity'
import {pageSectionMembers} from '../shared/pageSectionMembers'
import {preparePortableHeadlinePreview} from '../shared/portableTextPreview'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'
import {relatedContentSectionFields} from '../shared/relatedContentSectionFields'
import {studioListMedia} from '../shared/studioListMedia'

export const eventsLandingPage = defineType({
  name: 'eventsLandingPage',
  title: 'Events page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'cta', title: 'CTA'},
    {name: 'sections', title: 'Modular sections'},
    ...CONTENT_SEO_GROUPS.filter((g) => g.name !== 'content'),
  ],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    portableHeadlineField({group: 'hero', required: true}),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    ...relatedContentSectionFields.map((field) => ({
      ...field,
      group: 'hero',
    })),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'string', group: 'cta'}),
    defineField({name: 'ctaBody', title: 'CTA body', type: 'text', rows: 3, group: 'cta'}),
    defineField({name: 'ctaPrimaryLabel', title: 'Primary button label', type: 'string', group: 'cta'}),
    defineField({name: 'ctaPrimaryHref', title: 'Primary button link', type: 'string', group: 'cta'}),
    defineField({name: 'ctaSecondaryLabel', title: 'Secondary button label', type: 'string', group: 'cta'}),
    defineField({name: 'ctaSecondaryHref', title: 'Secondary button link', type: 'string', group: 'cta'}),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      of: pageSectionMembers,
      group: 'sections',
      description:
        'Optional modular blocks rendered on /events after the event list and before the footer CTA band.',
    }),
    singletonSeoField,
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
