import {defineField, defineType} from 'sanity'
import {CONTENT_SEO_FIELDSETS, singletonSeoField} from '../shared/singletonContentFields'
import {GROUP_SEO} from '../shared/fieldGroups'

export const story = defineType({
  name: 'story',
  title: 'Story',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'metrics', title: 'Reading metrics'},
    GROUP_SEO,
  ],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'When enabled, this story can appear in the Featured Stories carousel.',
      group: 'content',
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'filters',
      title: 'Categories',
      description: 'Story category tags for filtering on /stories.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'storyFilter'}]}],
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published at',
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 4,
      description: 'Short summary for the Stories listing page.',
      group: 'content',
    }),
    defineField({
      name: 'headerImage',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),
    defineField({
      name: 'headerImageAlt',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'headerLayout',
      title: 'Header layout',
      type: 'string',
      options: {
        list: [
          {title: 'Background image', value: 'background'},
          {title: 'Image block (side-by-side)', value: 'block'},
        ],
        layout: 'radio',
      },
      initialValue: 'block',
      description:
        'Background image fills the hero behind the headline (transparent nav). Image block shows the cover below the subheading.',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Story content',
      type: 'portableRichText',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'readingTimeMinutes',
      title: 'Reading time (minutes)',
      type: 'number',
      description: 'Estimated reading time shown on the story card and detail page.',
      validation: (Rule) => Rule.min(1).max(120),
      group: 'metrics',
    }),
    defineField({
      name: 'viewCount',
      title: 'View count (editorial)',
      type: 'number',
      description: 'Optional editorial metric for sorting or social proof — not live analytics.',
      group: 'metrics',
    }),
    singletonSeoField,
  ],
  preview: {
    select: {
      title: 'title',
      excerpt: 'excerpt',
      media: 'headerImage',
      publishedAt: 'publishedAt',
      featured: 'featured',
    },
    prepare({title, excerpt, media, publishedAt, featured}) {
      const displayTitle = title?.trim() || 'Untitled story'
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Draft'
      const blurb =
        typeof excerpt === 'string' && excerpt.trim()
          ? excerpt.trim().slice(0, 60) + (excerpt.length > 60 ? '…' : '')
          : undefined
      const subtitle = [featured ? 'Featured' : null, date, blurb].filter(Boolean).join(' · ')
      return {title: displayTitle, subtitle, media}
    },
  },
})
