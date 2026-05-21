import {defineField} from 'sanity'
import {GROUP_LAYOUT} from './fieldGroups'
import {pageBuilderField} from './pageBuilderField'

/** Optional modular page builder on marketing singletons */
export const singletonLayoutFields = [
  defineField({
    ...pageBuilderField,
    description:
      'Optional modular sections rendered when the frontend supports page builder output. Structured fields above remain the primary source for most pages.',
  }),
]

export const singletonLayoutGroup = GROUP_LAYOUT
