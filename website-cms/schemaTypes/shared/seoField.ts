import {defineField} from 'sanity'

/** Reusable SEO object field — uses sanity-plugin-seofields (SERP preview, robots, OG). */
export const seoField = defineField({
  name: 'seo',
  title: 'SEO & social',
  type: 'seoFields',
  group: 'seo',
  fieldset: 'seo',
})
