import { defineField, defineType } from 'sanity'
import {
  CONTENT_SEO_FIELDSETS,
  GROUP_MODULAR_SECTIONS,
  modularSectionsField,
  singletonSeoField,
} from '../shared/singletonContentFields'
import { GROUP_SEO } from '../shared/fieldGroups'
import { imageUploadField, imageUrlFallbackField } from '../shared/imageFields'
import { showBadgeField } from '../shared/sectionAppearanceFields'
import { portableHeadlineField } from '../shared/inlineHeroHeadlineField'
import {iconKeyField} from '../shared/iconKeyField'
import {logoMarqueeField} from '../objects/logoMarqueeItem'

const GROUP_HERO = { name: 'hero', title: '1 · Hero', default: true }
const GROUP_PATHS = { name: 'paths', title: '2 · Paths section' }
const GROUP_METRICS = { name: 'metrics', title: '3 · Metrics band' }
const GROUP_WHY = { name: 'why', title: '4 · Feature cards (image panels)' }
const GROUP_HOW = { name: 'howItWorks', title: '5 · Focus areas (teal band)' }
const GROUP_TESTIMONIALS = { name: 'testimonials', title: '6 · Testimonials' }
const GROUP_CTA = { name: 'cta', title: '7 · Bottom CTA' }
const GROUP_MODULAR = { ...GROUP_MODULAR_SECTIONS, title: '8 · Modular sections' }
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
    GROUP_MODULAR,
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
    defineField({ ...showBadgeField, group: 'metrics' }),
    defineField({
      name: 'metricsBadgeLabel',
      title: 'Badge label',
      type: 'string',
      group: 'metrics',
      initialValue: 'Network impact',
      hidden: ({ parent }) => parent?.showBadge === false,
    }),
    portableHeadlineField({
      name: 'metricsHeadingPortable',
      title: 'Metrics title',
      group: 'metrics',
    }),
    imageUploadField('metricsBackgroundImage', 'Background image', { group: 'metrics' }),
    imageUrlFallbackField('metricsBackgroundImageUrl', 'Background image URL (fallback)', 'metrics'),
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

    // —— 4 · Feature cards (WhyRellia image panels) ——
    defineField({
      name: 'whySectionTitle',
      title: 'Section heading',
      type: 'string',
      description: 'Headline above the four expandable image panels.',
      group: 'why',
      initialValue: 'Why Rellia?',
    }),
    defineField({
      name: 'whySectionDescription',
      title: 'Section intro',
      type: 'text',
      rows: 2,
      description: 'Short paragraph under the heading.',
      group: 'why',
    }),
    defineField({
      name: 'whyFeatures',
      title: 'Feature cards (4 image panels)',
      type: 'array',
      description: 'Up to four cards with background image, title, description, and optional button.',
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
              description: 'Optional metadata — not shown on the image panels.',
            }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'buttonLabel', title: 'Optional button label', type: 'string' }),
            defineField({
              name: 'buttonPath',
              title: 'Optional button link',
              type: 'string',
              description: 'Internal path, e.g. /programs',
            }),
            imageUploadField('image', 'Card image'),
            imageUrlFallbackField('imageSrc', 'Card image URL (fallback)'),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description', media: 'image' },
          },
        }),
      ],
    }),

    // —— 5 · Focus areas (teal HowItWorks band) ——
    defineField({
      name: 'howItWorksSectionTitle',
      title: 'Section heading',
      type: 'string',
      group: 'howItWorks',
      initialValue: 'Where we focus',
    }),
    defineField({
      name: 'howItWorksSectionDescription',
      title: 'Section intro',
      type: 'text',
      rows: 2,
      group: 'howItWorks',
      initialValue:
        "Health tech commercialization is complex, and generic start-up advice won't help you. These are the areas where Rellia can help.",
    }),
    defineField({
      name: 'howItWorksSteps',
      title: 'Focus area items',
      type: 'array',
      description: 'Icon + title + description grid inside the teal band.',
      group: 'howItWorks',
      of: [
        defineField({
          name: 'howItWorksStep',
          title: 'Focus area',
          type: 'object',
          fields: [
            iconKeyField({
              description: 'Lucide icon for this focus area card.',
            }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
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
    {...logoMarqueeField, group: 'testimonials'},

    // —— 7 · Bottom CTA ——
    defineField({ name: 'ctaTitle', title: 'CTA headline', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaButtonLabel', title: 'Primary button label', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaButtonPath', title: 'Primary button link', type: 'string', group: 'cta' }),
    defineField({
      name: 'ctaSecondaryButtonLabel',
      title: 'Secondary button label',
      type: 'string',
      group: 'cta',
      description: 'Optional. Secondary button is hidden unless both label and link are filled in.',
    }),
    defineField({
      name: 'ctaSecondaryButtonPath',
      title: 'Secondary button link',
      type: 'string',
      group: 'cta',
    }),
    modularSectionsField({
      group: GROUP_MODULAR.name,
      description:
        'Optional modular blocks rendered on the home page after Featured Stories and before the footer CTA band.',
    }),
    singletonSeoField,
  ],
  preview: {
    prepare() {
      return { title: 'Home page', subtitle: '/' }
    },
  },
})
