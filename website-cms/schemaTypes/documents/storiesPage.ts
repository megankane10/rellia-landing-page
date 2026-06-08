import {defineField, defineType} from 'sanity'
import {preparePortableHeadlinePreview} from '../shared/portableTextPreview'
import {
  CONTENT_SEO_FIELDSETS,
  CONTENT_SEO_GROUPS,
  singletonSeoField,
} from '../shared/singletonContentFields'
import {studioListMedia} from '../shared/studioListMedia'

export const storiesPage = defineType({
  name: 'storiesPage',
  title: 'Stories page',
  type: 'document',
  groups: CONTENT_SEO_GROUPS,
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({
      name: 'headlinePortable',
      title: 'Page headline',
      type: 'inlineHeroHeadline',
      description: 'Use Mint or Teal decorators on words/phrases for color (toolbar).',
      group: 'content',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'subheadline', title: 'Subtitle', type: 'text', rows: 2, group: 'content'}),
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
