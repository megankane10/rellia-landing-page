import {defineField, defineType} from 'sanity'
import {GROUP_SEO} from '../shared/fieldGroups'
import {CONTENT_SEO_FIELDSETS} from '../shared/singletonContentFields'
import {storySeoField} from '../shared/storySeoField'

export const story = defineType({
  name: 'story',
  title: 'Story',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'author', title: 'Author & date'},
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
      description:
        'Public URL: /stories/[slug]. Click Generate from title before publishing. Changing the slug after publish? Add the old slug under Previous slugs so old links keep working.',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'previousSlugs',
      title: 'Previous slugs',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Optional legacy URL slugs that should still resolve to this story (e.g. after renaming).',
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
      group: 'author',
    }),
    defineField({
      name: 'hidePublishDate',
      title: 'Hide publish date',
      type: 'boolean',
      initialValue: false,
      description:
        'Hide the publish date on this story only. Site-wide default is set on Stories page settings.',
      group: 'author',
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      description: 'Leave blank to use the default from Stories page settings (Rellia Health).',
      group: 'author',
    }),
    defineField({
      name: 'authorDescription',
      title: 'Author description',
      type: 'string',
      description: 'Short line under the author name on the story page.',
      group: 'author',
    }),
    defineField({
      name: 'authorImage',
      title: 'Author image',
      type: 'image',
      description: 'Square logo or avatar beside the author name. Defaults to site favicon.',
      group: 'author',
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
          {title: 'Image block', value: 'block'},
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
    storySeoField,
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
