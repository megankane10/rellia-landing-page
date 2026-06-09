import {defineField, defineType} from 'sanity'
import {CONTENT_SEO_FIELDSETS, singletonSeoField} from '../shared/singletonContentFields'
import {GROUP_SEO} from '../shared/fieldGroups'
import {networkDirectoryChromeFields} from '../shared/directoryPageFields'

const GROUP_CONTENT = {name: 'content', title: 'Directory page', default: true}

export const networkAlumniDirectoryPage = defineType({
  name: 'networkAlumniDirectoryPage',
  title: 'Explore Alumni directory (/founders/alumni)',
  type: 'document',
  groups: [GROUP_CONTENT, GROUP_SEO],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [...networkDirectoryChromeFields, singletonSeoField],
  preview: {
    prepare() {
      return {title: 'Explore Alumni directory', subtitle: '/founders/alumni'}
    },
  },
})

export const networkAdvisorsDirectoryPage = defineType({
  name: 'networkAdvisorsDirectoryPage',
  title: 'Explore Advisors directory (/advisors/directory)',
  type: 'document',
  groups: [GROUP_CONTENT, GROUP_SEO],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [...networkDirectoryChromeFields, singletonSeoField],
  preview: {
    prepare() {
      return {title: 'Explore Advisors directory', subtitle: '/advisors/directory'}
    },
  },
})
