import {defineField} from 'sanity'

/** Story SEO overrides — robots/noindex hidden; published stories are always indexed on the site. */
export const storySeoField = defineField({
  name: 'seo',
  title: 'SEO & social',
  type: 'seoFields',
  group: 'seo',
  fieldset: 'seo',
  description:
    'Optional overrides for search and social previews. Title and description default from the story title, category, and excerpt. Published stories are always indexed publicly.',
})
