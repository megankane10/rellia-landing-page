import {defineField} from 'sanity'
import {GROUP_LAYOUT} from './fieldGroups'
import {pageSectionMembers} from './pageSectionMembers'

/** Optional modular page builder on marketing singletons */
export const singletonLayoutFields = [
  defineField({
    name: 'useModularPage',
    title: 'Use Modular Page Builder Layout',
    description: 'Toggle this on to override the static page template and render modular sections instead.',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'sections',
    title: 'Page Sections',
    description: 'Compose the page from modular sections when Modular Page Builder is enabled.',
    type: 'array',
    of: pageSectionMembers,
    hidden: ({document}) => !document?.useModularPage,
  }),
]

export const singletonLayoutGroup = GROUP_LAYOUT
