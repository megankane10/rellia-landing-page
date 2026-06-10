import {defineField} from 'sanity'

/** Reusable SEO object field — uses sanity-plugin-seofields (SERP preview, robots, OG). */
export const seoField = defineField({
  name: 'seo',
  title: 'SEO & social',
  type: 'seoFields',
  group: 'seo',
  fieldset: 'seo',
  description:
    'Optional overrides. When title and description are empty, the site derives them from the main content fields (e.g. story title + category, event title + description, program title + hero copy).',
})
