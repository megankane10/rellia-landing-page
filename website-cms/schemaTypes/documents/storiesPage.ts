import {defineField, defineType} from 'sanity'
import {CONTENT_SEO_FIELDSETS, CONTENT_SEO_GROUPS, singletonSeoField} from '../shared/singletonContentFields'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'
import {relatedContentSectionFields} from '../shared/relatedContentSectionFields'
import {preparePortableHeadlinePreview} from '../shared/portableTextPreview'
import {studioListMedia} from '../shared/studioListMedia'

export const storiesPage = defineType({
  name: 'storiesPage',
  title: 'Stories page',
  type: 'document',
  groups: [
    ...CONTENT_SEO_GROUPS,
    {name: 'authorDefaults', title: 'Story author defaults'},
  ],
  fieldsets: [
    ...CONTENT_SEO_FIELDSETS,
    {
      name: 'authorDefaults',
      title: 'Default author & date display',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    portableHeadlineField({name: 'headlinePortable', title: 'Page headline', group: 'content', required: true}),
    defineField({name: 'subheadline', title: 'Subtitle', type: 'text', rows: 2, group: 'content'}),
    ...relatedContentSectionFields,
    defineField({
      name: 'hideStoryPublishDates',
      title: 'Hide publish dates on all stories',
      type: 'boolean',
      initialValue: false,
      description: 'When enabled, publish dates are hidden on every story unless a story overrides this.',
      group: 'authorDefaults',
      fieldset: 'authorDefaults',
    }),
    defineField({
      name: 'defaultAuthorName',
      title: 'Default author name',
      type: 'string',
      initialValue: 'Rellia Health',
      group: 'authorDefaults',
      fieldset: 'authorDefaults',
    }),
    defineField({
      name: 'defaultAuthorDescription',
      title: 'Default author description',
      type: 'string',
      initialValue: 'Insights and updates from the Rellia Health team.',
      group: 'authorDefaults',
      fieldset: 'authorDefaults',
    }),
    defineField({
      name: 'defaultAuthorImage',
      title: 'Default author image',
      type: 'image',
      description: 'Square logo shown beside the author name. Falls back to the site favicon when empty.',
      group: 'authorDefaults',
      fieldset: 'authorDefaults',
    }),
    singletonSeoField,
  ],
  preview: {
    select: {headlinePortable: 'headlinePortable', subheadline: 'subheadline'},
    prepare: ({headlinePortable, subheadline}) => ({
      ...preparePortableHeadlinePreview({
        headline: headlinePortable,
        fallback: 'Stories',
        subtitle: subheadline,
      }),
      media: studioListMedia.document,
    }),
  },
})
