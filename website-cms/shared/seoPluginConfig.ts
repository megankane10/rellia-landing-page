import type {SeoFieldsPluginConfig} from 'sanity-plugin-seofields'
import {
  MARKETING_PAGE_ROUTE_PREFIX,
  MARKETING_PAGE_SEO_TYPES,
} from './marketingPageSeo'

const previewBaseUrl =
  (typeof process !== 'undefined' && process.env.SANITY_STUDIO_PREVIEW_URL?.replace(/\/$/, '')) ||
  'https://www.relliahealth.com'

const allSeoFields = [
  'title',
  'description',
  'metaImage',
  'canonicalUrl',
  'robots',
  'openGraph',
  'twitter',
  'keywords',
  'metaAttributes',
  'openGraphSiteName',
  'twitterSite',
  'preview',
]

/** Shared seoFields plugin options — simpler tabs, marketing-page SEO dashboard. */
export const seoPluginConfig: SeoFieldsPluginConfig = {
  healthDashboard: false,
  seoPreview: {
    prefix: (doc) => {
      const type = typeof doc?._type === 'string' ? doc._type : ''
      const segment = MARKETING_PAGE_ROUTE_PREFIX[type as keyof typeof MARKETING_PAGE_ROUTE_PREFIX]
      return segment ? `/${segment}` : '/'
    },
    titleSuffix: 'Rellia Health',
  },
  baseUrl: previewBaseUrl,
  apiVersion: '2024-01-01',
  defaultHiddenFields: ['keywords', 'metaAttributes', 'openGraphSiteName', 'twitterSite'],
  fieldGroups: [
    {
      name: 'search',
      title: 'Search',
      default: true,
      fields: ['title', 'description', 'metaImage', 'canonicalUrl', 'robots', 'preview'],
    },
    {
      name: 'social',
      title: 'Social sharing',
      fields: ['openGraph', 'twitter'],
    },
  ],
  fieldVisibility: MARKETING_PAGE_SEO_TYPES.reduce((acc, type) => {
    acc[type] = {hiddenFields: allSeoFields}
    return acc
  }, {} as Record<string, {hiddenFields: string[]}>),
}
