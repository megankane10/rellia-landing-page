import { defineField, defineType } from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  singletonSeoField,
} from '../shared/singletonContentFields'
import { GROUP_SEO } from '../shared/fieldGroups'
import { pageSectionMembers } from '../shared/pageSectionMembers'
import { imageUploadField, imageUrlFallbackField } from '../shared/imageFields'

const GROUP_HERO = { name: 'hero', title: '1 · Hero', default: true }
const GROUP_PATHS = { name: 'paths', title: '2 · Paths section' }
const GROUP_METRICS = { name: 'metrics', title: '3 · Metrics band' }
const GROUP_WHY = { name: 'why', title: '4 · Why Rellia' }
const GROUP_HOW = { name: 'howItWorks', title: '5 · How it works' }
const GROUP_TESTIMONIALS = { name: 'testimonials', title: '6 · Testimonials' }
const GROUP_CTA = { name: 'cta', title: '7 · Bottom CTA' }
const GROUP_SECTIONS = { name: 'sections', title: 'Modular sections' }

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    GROUP_HERO,
    GROUP_PATHS,
    GROUP_METRICS,
    GROUP_WHY,
    GROUP_HOW,
    GROUP_TESTIMONIALS,
    GROUP_CTA,
    GROUP_SECTIONS,
    GROUP_SEO,
  ],
  fieldsets: CONTENT_SEO_FIELDSETS,
  fields: [
    // —— 1 · Hero (top of page) ——
    defineField({ name: 'headlinePrefix', title: 'Headline (line 1)', type: 'string', group: 'hero' }),
    defineField({ name: 'subheadline', title: 'Hero subtitle', type: 'string', group: 'hero' }),
    defineField({ name: 'primaryCtaLabel', title: 'Primary button label', type: 'string', group: 'hero' }),
    defineField({ name: 'primaryCtaPath', title: 'Primary button link', type: 'string', group: 'hero' }),
    defineField({ name: 'secondaryCtaLabel', title: 'Secondary button label', type: 'string', group: 'hero' }),
    defineField({ name: 'secondaryCtaPath', title: 'Secondary button link', type: 'string', group: 'hero' }),
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

    // —— 2 · Paths section ——
    defineField({
      name: 'pathsTitle',
      title: 'Paths section title',
      type: 'string',
      description: 'Headline above the four role cards (e.g. “Find your place in the community”).',
      group: 'paths',
      initialValue: 'Find your place in the community',
    }),
    defineField({
      name: 'pathsCards',
      title: 'Paths section cards',
      type: 'array',
      description:
        'Four role cards (Founder, Advisor, Investor, Partner). Each card falls back to site defaults when a field is left empty.',
      group: 'paths',
      of: [
        defineField({
          name: 'pathsCard',
          title: 'Paths card',
          type: 'object',
          fields: [
            defineField({
              name: 'roleId',
              title: 'Role',
              type: 'string',
              options: {
                list: [
                  { title: 'Founder', value: 'founder' },
                  { title: 'Advisor', value: 'advisor' },
                  { title: 'Investor', value: 'investor' },
                  { title: 'Partner', value: 'partner' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'tagLabel', title: 'Tag pill label', type: 'string' }),
            defineField({ name: 'title', title: 'Card headline', type: 'string' }),
            defineField({ name: 'subtitle', title: 'Card subtitle', type: 'text', rows: 2 }),
            imageUploadField('image', 'Card image'),
            imageUrlFallbackField('imageSrc', 'Card image URL (fallback)'),
            defineField({ name: 'imageAlt', title: 'Image alt text', type: 'string' }),
            defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
            defineField({
              name: 'ctaTo',
              title: 'Button link',
              type: 'string',
              description: 'Internal path, e.g. /founders',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'roleId', media: 'image' },
          },
        }),
      ],
    }),

    // —— 3 · Metrics band (below paths grid) ——
    defineField({
      name: 'metricsHeading',
      title: 'Metrics title',
      type: 'string',
      group: 'metrics',
      initialValue: 'The right people make all the difference.',
    }),
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
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'number' },
            { name: 'suffix', title: 'Suffix', type: 'string', description: 'Example: %, , x' },
          ],
        }),
      ],
    }),

    // —— 4 · Why Rellia ——
    defineField({
      name: 'whySectionTitle',
      title: 'Section title',
      type: 'string',
      group: 'why',
      initialValue: 'Why Rellia?',
    }),
    defineField({
      name: 'whySectionDescription',
      title: 'Section description',
      type: 'text',
      rows: 2,
      group: 'why',
    }),
    defineField({
      name: 'whyFeatures',
      title: 'Feature cards',
      type: 'array',
      group: 'why',
      of: [
        defineField({
          name: 'feature',
          title: 'Feature card',
          type: 'object',
          fields: [
            defineField({
              name: 'iconKey',
              title: 'Icon key',
              type: 'string',
              description: 'Example: target, userRound, bookOpen',
            }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
            defineField({ name: 'buttonPath', title: 'Button link', type: 'string' }),
            imageUploadField('image', 'Card image'),
            imageUrlFallbackField('imageSrc', 'Card image URL (fallback)'),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description', media: 'image' },
          },
        }),
      ],
    }),

    // —— 5 · How it works ——
    defineField({
      name: 'howItWorksSectionTitle',
      title: 'Section title',
      type: 'string',
      group: 'howItWorks',
      initialValue: 'How does it work?',
    }),

    // —— 6 · Testimonials ——
    defineField({
      name: 'testimonialsTitlePortable',
      title: 'Section title',
      type: 'inlineHeroHeadline',
      description: 'Use the Teal decorator for the highlighted phrase (matches the live site).',
      group: 'testimonials',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'testimonials',
      of: [
        defineField({
          name: 'testimonial',
          title: 'Testimonial',
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'role', title: 'Role', type: 'string' },
            { name: 'company', title: 'Company', type: 'string' },
            { name: 'quote', title: 'Quote', type: 'text', rows: 4 },
            { name: 'companyInfo', title: 'Company info', type: 'text', rows: 3 },
            imageUploadField('image', 'Photo'),
            imageUrlFallbackField('imageSrc', 'Photo URL (fallback)'),
          ],
          preview: {
            select: { title: 'name', subtitle: 'company', media: 'image' },
          },
        }),
      ],
    }),

    // —— 7 · Bottom CTA ——
    defineField({ name: 'ctaTitle', title: 'CTA headline', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaButtonLabel', title: 'Primary button label', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaButtonPath', title: 'Primary button link', type: 'string', group: 'cta' }),
    defineField({
      name: 'ctaSecondaryButtonLabel',
      title: 'Secondary button label',
      type: 'string',
      group: 'cta',
      description: 'Optional second button in the bottom CTA band.',
    }),
    defineField({
      name: 'ctaSecondaryButtonPath',
      title: 'Secondary button link',
      type: 'string',
      group: 'cta',
    }),
    imageUploadField('ctaImage', 'CTA image', {
      group: 'cta',
      description: 'Upload an image to enable cropping. Falls back to “CTA image URL (fallback)” below.',
    }),
    imageUrlFallbackField('ctaImageUrl', 'CTA image URL (fallback)', 'cta'),
    defineField({ name: 'ctaImageAlt', title: 'CTA image alt text', type: 'string', group: 'cta' }),

    // —— Modular sections + SEO ——
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      of: pageSectionMembers,
      group: 'sections',
    }),
    singletonSeoField,
  ],
  preview: {
    prepare() {
      return { title: 'Home page', subtitle: '/' }
    },
  },
})
