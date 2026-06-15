import {defineField} from 'sanity'

/** Reusable SEO object field — uses sanity-plugin-seofields (SERP preview, robots, OG). */
export const seoField = defineField({
  name: 'seo',
  title: 'SEO & social',
  type: 'seoFields',
  group: 'seo',
  fieldset: 'seo',
  description:
    'Optional title and description overrides. Link preview images always use the document’s main image field (story header, event image, program image)—not a separate SEO upload.',
})
