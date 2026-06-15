import {defineField} from 'sanity'

/** Story SEO overrides — robots/noindex hidden; published stories are always indexed on the site. */
export const storySeoField = defineField({
  name: 'seo',
  title: 'SEO & social',
  type: 'seoFields',
  group: 'seo',
  fieldset: 'seo',
  description:
    'Optional overrides for search and social previews. Title and description default from the story title, category, and excerpt. Link preview images always use the header image above—not a separate SEO upload.',
})
