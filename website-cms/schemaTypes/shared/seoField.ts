import {defineField} from 'sanity'

/** Reusable SEO object field — append to any page document */
export const seoField = defineField({
  name: 'seo',
  title: 'SEO & social',
  type: 'seo',
  group: 'seo',
  fieldset: 'seo',
})
