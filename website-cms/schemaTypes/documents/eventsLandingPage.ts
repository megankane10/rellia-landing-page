import {defineField, defineType} from 'sanity'

export const eventsLandingPage = defineType({
  name: 'eventsLandingPage',
  title: 'Events page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'cta', title: 'CTA'},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Headline',
      type: 'string',
      description: 'Main headline for the Events page.',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroTitleAccent',
      title: 'Accent word/phrase',
      type: 'string',
      description: 'Optional highlighted phrase shown in mint.',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'string', group: 'cta'}),
    defineField({name: 'ctaBody', title: 'CTA body', type: 'text', rows: 3, group: 'cta'}),
    defineField({name: 'ctaPrimaryLabel', title: 'Primary button label', type: 'string', group: 'cta'}),
    defineField({name: 'ctaPrimaryHref', title: 'Primary button link', type: 'string', group: 'cta'}),
    defineField({name: 'ctaSecondaryLabel', title: 'Secondary button label', type: 'string', group: 'cta'}),
    defineField({name: 'ctaSecondaryHref', title: 'Secondary button link', type: 'string', group: 'cta'}),
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
})

