import {defineField, type FieldDefinition} from 'sanity'
import {FIELDSET_SEO, GROUP_CONTENT, GROUP_SEO} from './fieldGroups'
import {pageSectionMembers} from './pageSectionMembers'
import {seoField} from './seoField'

export const CONTENT_SEO_GROUPS = [GROUP_CONTENT, GROUP_SEO]

export const GROUP_MODULAR_SECTIONS = {name: 'modularSections', title: 'Modular sections'} as const

export const singletonSeoField = seoField

export const singletonSectionsField = defineField({
  name: 'sections',
  title: 'Page sections',
  type: 'array',
  of: pageSectionMembers,
  group: 'content',
})

type ModularSectionsFieldOptions = {
  group?: string
  description?: string
}

export const modularSectionsField = (options?: ModularSectionsFieldOptions): FieldDefinition =>
  defineField({
    name: 'sections',
    title: 'Page sections',
    type: 'array',
    of: pageSectionMembers,
    group: options?.group ?? GROUP_MODULAR_SECTIONS.name,
    description:
      options?.description ??
      'Optional modular blocks rendered above the footer CTA band. Drag to reorder.',
  })

export const sectionDividerFieldset = (name: string, title: string) => ({
  name,
  title,
  options: {collapsible: false},
})

export const CONTENT_SEO_FIELDSETS = [FIELDSET_SEO]
