import {defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'metrics', title: 'Metrics'},
    {name: 'highlights', title: 'Highlights'},
    {name: 'testimonials', title: 'Testimonials'},
    {name: 'paths', title: 'Paths section'},
    {name: 'seo', title: 'SEO & metadata'},
  ],
  fieldsets: [{name: 'seo', title: 'SEO & metadata'}],
  fields: [
    defineField({name: 'headlinePrefix', title: 'Headline (line 1)', type: 'string', group: 'hero'}),
    defineField({name: 'subheadline', title: 'Hero subtitle', type: 'string', group: 'hero'}),
    defineField({name: 'primaryCtaLabel', title: 'Primary button label', type: 'string', group: 'hero'}),
    defineField({name: 'primaryCtaPath', title: 'Primary button link', type: 'string', group: 'hero'}),
    defineField({name: 'secondaryCtaLabel', title: 'Secondary button label', type: 'string', group: 'hero'}),
    defineField({name: 'secondaryCtaPath', title: 'Secondary button link', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroBackgroundVideo',
      title: 'Hero background video',
      type: 'file',
      group: 'hero',
      description:
        'Upload MP4 (H.264) or WebM. Plays muted, looping, behind the headline. Prefer short clips and compressed files for mobile.',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'heroBackgroundVideoUrl',
      title: 'Hero background video URL (fallback)',
      type: 'string',
      group: 'hero',
      description:
        'Used when no file is uploaded. Site path (e.g. /videos/homehero.mp4) or full https URL to a video file.',
    }),
    defineField({name: 'metricsHeading', title: 'Metrics title', type: 'string', group: 'metrics'}),
    defineField({name: 'metricsSubheading', title: 'Metrics subtitle', type: 'text', rows: 3, group: 'metrics'}),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      group: 'metrics',
      of: [
        defineField({
          name: 'metric',
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'value', title: 'Value', type: 'number'},
            {name: 'suffix', title: 'Suffix', type: 'string', description: 'Example: %, +, x'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'howItWorksSectionTitle',
      title: 'How it works section title',
      type: 'string',
      group: 'highlights',
    }),
    defineField({
      name: 'testimonialsTitlePortable',
      title: 'Testimonials section title',
      type: 'inlineHeroHeadline',
      description: 'Use the Teal decorator for the highlighted phrase (matches the live site).',
      group: 'testimonials',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'whyFeatures',
      title: 'Why Rellia features',
      type: 'array',
      group: 'highlights',
      of: [
        defineField({
          name: 'feature',
          type: 'object',
          fields: [
            {
              name: 'iconKey',
              title: 'Icon key',
              type: 'string',
              description: 'Example: target, userRound, bookOpen',
            },
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text', rows: 3},
          ],
        }),
      ],
    }),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'string', group: 'highlights'}),
    defineField({name: 'ctaButtonLabel', title: 'CTA button label', type: 'string', group: 'highlights'}),
    defineField({name: 'ctaButtonPath', title: 'CTA button link', type: 'string', group: 'highlights'}),
    defineField({
      name: 'ctaImage',
      title: 'CTA image',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload an image to enable cropping. Falls back to “CTA image URL” below.',
      group: 'highlights',
    }),
    defineField({
      name: 'ctaImageUrl',
      title: 'CTA image URL (legacy)',
      type: 'url',
      description: 'Optional fallback URL when no image is uploaded above.',
      group: 'highlights',
    }),
    defineField({name: 'ctaImageAlt', title: 'CTA image alt text', type: 'string', group: 'highlights'}),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'testimonials',
      of: [
        defineField({
          name: 'testimonial',
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'role', title: 'Role', type: 'string'},
            {name: 'company', title: 'Company', type: 'string'},
            {name: 'quote', title: 'Quote', type: 'text', rows: 4},
            {name: 'companyInfo', title: 'Company info', type: 'text', rows: 3},
            {name: 'image', type: 'image', options: {hotspot: true}},
            {name: 'imageSrc', type: 'string', description: 'Fallback URL if no upload'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'pathsTitle',
      title: 'Paths section title',
      type: 'string',
      description: 'Headline for the "Find your place in the community" section.',
      group: 'paths',
    }),
    defineField({
      name: 'pathsCards',
      title: 'Paths section cards',
      type: 'array',
      description:
        'Cards shown in the network paths grid. Tag, title, image, and CTA are editable per card.',
      group: 'paths',
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
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
})
