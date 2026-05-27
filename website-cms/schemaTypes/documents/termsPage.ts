import {defineField, defineType} from 'sanity'
import {seoField} from '../shared/seoField'

export const termsPage = defineType({
  name: 'termsPage',
  title: 'Terms of use',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Terms of use',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Page content',
      type: 'portableRichText',
      description: 'Headings, paragraphs, lists, images, quotes, and CTA boxes.',
      group: 'content',
    }),
    seoField,
  ],
  preview: {
    prepare() {
      return {title: 'Terms of use'}
    },
  },
})
