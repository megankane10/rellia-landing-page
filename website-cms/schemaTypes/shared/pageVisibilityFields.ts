import {defineField} from 'sanity'

export const PAGE_VISIBILITY_OPTIONS = [
  {title: 'Live — show full page', value: 'live'},
  {title: 'Hidden — return 404', value: 'hidden'},
  {title: 'Placeholder — coming soon message', value: 'placeholder'},
] as const

export type PageVisibilityValue = (typeof PAGE_VISIBILITY_OPTIONS)[number]['value']

/** Publishing controls for marketing page singletons. */
export const pageVisibilityFields = [
  defineField({
    name: 'pageVisibility',
    title: 'Page status',
    type: 'string',
    options: {list: [...PAGE_VISIBILITY_OPTIONS], layout: 'radio'},
    initialValue: 'live',
    group: 'publishing',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'placeholderTitle',
    title: 'Placeholder headline',
    type: 'string',
    description: 'Shown when status is Placeholder. Keep under 80 characters.',
    group: 'publishing',
    hidden: ({document}) => document?.pageVisibility !== 'placeholder',
    validation: (Rule) =>
      Rule.custom((value, context) => {
        const doc = context.document as {pageVisibility?: string}
        if (doc?.pageVisibility !== 'placeholder') return true
        return typeof value === 'string' && value.trim() ? true : 'Add a headline for the placeholder page'
      }),
  }),
  defineField({
    name: 'placeholderMessage',
    title: 'Placeholder message',
    type: 'text',
    rows: 3,
    description: 'Short message under the headline. About 1–2 sentences.',
    group: 'publishing',
    hidden: ({document}) => document?.pageVisibility !== 'placeholder',
  }),
  defineField({
    name: 'placeholderCtaLabel',
    title: 'Placeholder button label',
    type: 'string',
    group: 'publishing',
    hidden: ({document}) => document?.pageVisibility !== 'placeholder',
  }),
  defineField({
    name: 'placeholderCtaHref',
    title: 'Placeholder button link',
    type: 'string',
    description: 'Site path (e.g. /contact) or full URL.',
    group: 'publishing',
    hidden: ({document}) => document?.pageVisibility !== 'placeholder',
  }),
]

export const publishingGroup = {name: 'publishing', title: 'Publishing', default: false}
