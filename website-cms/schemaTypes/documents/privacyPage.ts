import {defineField, defineType} from 'sanity'
import {seoField} from '../shared/seoField'

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy policy',
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
      initialValue: 'Privacy policy',
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
      return {title: 'Privacy policy'}
    },
  },
})
