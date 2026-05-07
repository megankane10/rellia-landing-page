import {defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({name: 'headlinePrefix', type: 'string'}),
    defineField({name: 'subheadline', type: 'string'}),
    defineField({name: 'primaryCtaLabel', type: 'string'}),
    defineField({name: 'primaryCtaPath', type: 'string'}),
    defineField({name: 'secondaryCtaLabel', type: 'string'}),
    defineField({name: 'secondaryCtaPath', type: 'string'}),
    defineField({name: 'metricsHeading', type: 'string'}),
    defineField({name: 'metricsSubheading', type: 'text', rows: 3}),
    defineField({
      name: 'metrics',
      type: 'array',
      of: [
        defineField({
          name: 'metric',
          type: 'object',
          fields: [
            {name: 'label', type: 'string'},
            {name: 'value', type: 'number'},
            {name: 'suffix', type: 'string'},
          ],
        }),
      ],
    }),
    defineField({name: 'howItWorksSectionTitle', type: 'string'}),
    defineField({name: 'testimonialsTitleLead', type: 'string'}),
    defineField({name: 'testimonialsTitleAccent', type: 'string'}),
    defineField({
      name: 'whyFeatures',
      type: 'array',
      of: [
        defineField({
          name: 'feature',
          type: 'object',
          fields: [
            {name: 'iconKey', type: 'string', description: 'e.g. target, userRound, bookOpen'},
            {name: 'title', type: 'string'},
            {name: 'description', type: 'text', rows: 3},
          ],
        }),
      ],
    }),
    defineField({name: 'ctaTitle', type: 'string'}),
    defineField({name: 'ctaButtonLabel', type: 'string'}),
    defineField({name: 'ctaButtonPath', type: 'string'}),
    defineField({
      name: 'ctaImage',
      title: 'CTA image',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload an image to enable cropping. Falls back to “CTA image URL” below.',
    }),
    defineField({
      name: 'ctaImageUrl',
      title: 'CTA image URL (legacy)',
      type: 'url',
      description: 'Optional fallback URL when no image is uploaded above.',
    }),
    defineField({name: 'ctaImageAlt', type: 'string'}),
    defineField({
      name: 'testimonials',
      type: 'array',
      of: [
        defineField({
          name: 'testimonial',
          type: 'object',
          fields: [
            {name: 'name', type: 'string'},
            {name: 'role', type: 'string'},
            {name: 'company', type: 'string'},
            {name: 'quote', type: 'text', rows: 4},
            {name: 'companyInfo', type: 'text', rows: 3},
            {name: 'image', type: 'image', options: {hotspot: true}},
            {name: 'imageSrc', type: 'string', description: 'Fallback URL if no upload'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'pathsTitle',
      type: 'string',
      description: 'Headline for the "Find your place in the community" section.',
    }),
    defineField({
      name: 'pathsCards',
      title: 'Paths section cards',
      type: 'array',
      description:
        'Cards shown in the network paths grid. Tag, title, image, and CTA are editable per card.',
      of: [
        defineField({
          name: 'pathsCard',
          type: 'object',
          fields: [
            defineField({
              name: 'roleId',
              type: 'string',
              options: {
                list: [
                  {title: 'Founder', value: 'founder'},
                  {title: 'Advisor', value: 'advisor'},
                  {title: 'Investor', value: 'investor'},
                  {title: 'Partner', value: 'partner'},
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'tagLabel', type: 'string', description: 'Tag pill (e.g. Founder)'}),
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'subtitle', type: 'text', rows: 2}),
            defineField({name: 'image', type: 'image', options: {hotspot: true}}),
            defineField({name: 'imageSrc', type: 'string', description: 'Fallback image URL'}),
            defineField({name: 'imageAlt', type: 'string'}),
            defineField({name: 'ctaLabel', type: 'string'}),
            defineField({name: 'ctaTo', type: 'string', description: 'Internal path, e.g. /founders'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'roleId'},
          },
        }),
      ],
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
})
