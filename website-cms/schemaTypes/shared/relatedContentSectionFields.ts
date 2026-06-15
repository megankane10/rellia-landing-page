import {defineField} from 'sanity'

/** Heading + subheading for related-item rails on detail/profile pages (copy lives on each landing singleton). */
export const relatedContentSectionFields = [
  defineField({
    name: 'relatedSectionEnabled',
    title: 'Show related items section',
    type: 'boolean',
    initialValue: true,
    group: 'content',
    description:
      'When off, detail pages show only the back link at the bottom — no related stories, profiles, or events grid.',
  }),
  defineField({
    name: 'relatedSectionTitle',
    title: 'Related items heading',
    type: 'string',
    group: 'content',
    description:
      'Shown at the bottom of detail pages when related stories, profiles, or events appear (e.g. “More stories”).',
  }),
  defineField({
    name: 'relatedSectionSubheadline',
    title: 'Related items subheading',
    type: 'text',
    rows: 2,
    group: 'content',
    description: 'Supporting line under the related items heading on detail pages.',
  }),
]
