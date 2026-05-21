import {defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {seoField} from '../shared/seoField'

export const story = defineType({
  name: 'story',
  title: 'Story',
  type: 'document',
  groups: [...documentGroups, {name: 'metrics', title: 'Reading metrics'}],
  fieldsets: [FIELDSET_SEO],
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
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'advisor'}, {type: 'founder'}],
      group: 'content',
    }),
    defineField({
      name: 'authorName',
      title: 'Author name (override)',
      type: 'string',
      description: 'Used when no author reference is set.',
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
      validation: (Rule) => Rule.min(1).max(120),
      group: 'metrics',
    }),
    defineField({
      name: 'viewCount',
      title: 'View count (editorial)',
      type: 'number',
      description: 'Optional metric for editorial sorting — not live analytics.',
      group: 'metrics',
    }),
    seoField,
  ],
  preview: {
    select: {
      title: 'title',
      media: 'headerImage',
      publishedAt: 'publishedAt',
    },
    prepare({title, media, publishedAt}) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Unpublished'
      return {title, subtitle: date, media}
    },
  },
})
