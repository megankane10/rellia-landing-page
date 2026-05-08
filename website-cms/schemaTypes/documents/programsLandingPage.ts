import {defineField, defineType} from 'sanity'

export const programsLandingPage = defineType({
  name: 'programsLandingPage',
  title: 'Programs & events landing',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({name: 'heroTitleLine1', type: 'string', group: 'content'}),
    defineField({name: 'heroTitleMint', type: 'string', group: 'content'}),
    defineField({name: 'heroSubtitle', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'heroPrimaryCtaLabel', type: 'string', group: 'content'}),
    defineField({name: 'heroSecondaryCtaLabel', type: 'string', group: 'content'}),
    defineField({name: 'programsSectionTitle', type: 'string', group: 'content'}),
    defineField({name: 'programsSectionSubtitle', type: 'text', rows: 3, group: 'content'}),
    defineField({
      name: 'programs',
      type: 'array',
      group: 'content',
      of: [
        defineField({
          name: 'program',
          type: 'object',
          fields: [
            {name: 'title', type: 'string'},
            {name: 'description', type: 'text', rows: 3},
            {
              name: 'image',
              type: 'image',
              options: {hotspot: true},
              description: 'Upload an image (preferred). Falls back to "Image URL" below.',
            },
            {
              name: 'imageSrc',
              type: 'string',
              title: 'Image URL (fallback)',
              description: 'Optional fallback URL when no upload is provided.',
            },
            {name: 'href', type: 'string'},
            {name: 'buttonText', type: 'string'},
          ],
        }),
      ],
    }),
    defineField({name: 'upcomingEvents', type: 'array', of: [{type: 'eventCard'}], group: 'content'}),
    defineField({name: 'pastEvents', type: 'array', of: [{type: 'eventCard'}], group: 'content'}),
    defineField({name: 'ctaTitle', type: 'string', group: 'content'}),
    defineField({name: 'ctaBody', type: 'text', rows: 2, group: 'content'}),
    defineField({name: 'ctaButtonLabel', type: 'string', group: 'content'}),
    defineField({name: 'ctaButtonHref', type: 'string', group: 'content'}),
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
})
