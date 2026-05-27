import type {SeoFieldsPluginConfig} from 'sanity-plugin-seofields'

/** Shared seoFields plugin options — simpler tabs, no paid health dashboard. */
export const seoPluginConfig: SeoFieldsPluginConfig = {
  seoPreview: true,
  healthDashboard: false,
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
}
