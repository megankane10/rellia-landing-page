import {defineField} from 'sanity'

/** Modular page builder array — hero, features, content, carousel, testimonials */
export const pageBuilderField = defineField({
  name: 'pageBuilder',
  title: 'Page builder',
  description:
    'Compose the page from modular sections. Use this for maximum layout freedom, or keep using structured fields above.',
  type: 'pageBuilder',
  group: 'layout',
})
