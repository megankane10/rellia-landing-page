import {defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {singletonLayoutFields} from '../shared/singletonLayoutFields'

export const consultingPage = defineType({
  name: 'consultingPage',
  title: 'Consulting page (/consulting)',
  type: 'document',
  groups: documentGroups,
  fieldsets: [FIELDSET_SEO],
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Consulting', group: 'content'}),
    ...singletonLayoutFields,
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
})

