import {defineField, defineType} from 'sanity'

export const programsLandingPage = defineType({
  name: 'programsLandingPage',
  title: 'Programs & events landing',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'programs', title: 'Programs'},
    {name: 'cta', title: 'CTA'},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({
      name: 'heroTitlePortable',
      title: 'Hero headline',
      type: 'inlineHeroHeadline',
      description: 'Use Mint/Teal decorators for highlighted phrases.',
      group: 'hero',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'heroSubtitle', title: 'Hero subtitle', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroPrimaryCtaLabel', title: 'Primary button label', type: 'string', group: 'hero'}),
    defineField({name: 'heroSecondaryCtaLabel', title: 'Secondary button label', type: 'string', group: 'hero'}),
    defineField({
      name: 'programsSectionTitle',
      title: 'Programs section title',
      type: 'inlineHeroHeadline',
      description: 'Use Mint/Teal decorators for highlighted phrases.',
      group: 'programs',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'programsSectionSubtitle',
      title: 'Programs section subtitle',
      type: 'text',
      rows: 3,
      group: 'programs',
    }),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'string', group: 'cta'}),
    defineField({name: 'ctaBody', title: 'CTA body', type: 'text', rows: 2, group: 'cta'}),
    defineField({name: 'ctaButtonLabel', title: 'CTA button label', type: 'string', group: 'cta'}),
    defineField({name: 'ctaButtonHref', title: 'CTA button link', type: 'string', group: 'cta'}),
    defineField({name: 'seo', type: 'seoFields', group: 'seo', fieldset: 'seo'}),
  ],
})
