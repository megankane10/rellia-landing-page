import {defineConfig, buildLegacyTheme} from 'sanity'
import {RelliaStudioIcon} from './studioIcon'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import seofields from 'sanity-plugin-seofields'
import {seoPluginConfig} from './shared/seoPluginConfig'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './deskStructure'
import {presentationLocations, presentationMainDocuments} from './presentationLocations'
import {imageCropInputPlugin} from './plugins/imageCropInput'
import {collectionSlugPublishPlugin} from './plugins/collectionSlugPublish'


const theme = buildLegacyTheme({
  '--black': '#0B0F12',
  '--white': '#FFFFFF',

  '--brand-primary': '#0D3540', // rellia.teal

  '--main-navigation-color': '#0D3540',
  '--main-navigation-color--inverted': '#FFFFFF',
  '--main-navigation-color--muted': 'rgba(255,255,255,0.72)',

  '--focus-color': '#9DD6D0',
  '--default-button-primary-color': '#0D3540',
  '--default-button-primary-color--hover': '#1A5C56', // rellia.mintDark
  '--default-button-primary-color--active': '#1A5C56',
} as Record<string, string>)

const configuredPreviewUrl = process.env.SANITY_STUDIO_PREVIEW_URL?.replace(/\/$/, '')
const isLocalPreviewUrl = (url: string | undefined) =>
  Boolean(url && /localhost|127\.0\.0\.1/.test(url))

/** When running `sanity dev`, default to the local Vite app unless preview URL is already local. */
const previewOrigin = (() => {
  if (configuredPreviewUrl && (process.env.NODE_ENV === 'production' || isLocalPreviewUrl(configuredPreviewUrl))) {
    return configuredPreviewUrl
  }
  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:5173'
  }
  return configuredPreviewUrl || 'https://www.relliahealth.com'
})()

export default defineConfig({
  name: 'default',
  title: 'Rellia Web Studio',
  subtitle: 'Publish updates www — Presentation previews drafts on www only in Studio',
  icon: RelliaStudioIcon,

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'ggbt0o98',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  theme,



  plugins: [
    imageCropInputPlugin(),
    collectionSlugPublishPlugin(),
    seofields(seoPluginConfig),
    structureTool({
      structure: deskStructure,
    }),
    presentationTool({
      previewUrl: {
        // Local `sanity dev` defaults preview to http://127.0.0.1:5173 (see previewOrigin above).
        // Override with SANITY_STUDIO_PREVIEW_URL only when targeting a deployed site.
        origin: previewOrigin,
        initial: previewOrigin,
        previewMode: {
          enable: `${previewOrigin}/api/draft-mode/enable`,
          disable: `${previewOrigin}/api/draft-mode/disable`,
        },
      },
      allowOrigins: [
        'http://localhost:*',
        'http://127.0.0.1:*',
        'https://*.vercel.app',
        'https://relliahealth.com',
        'https://www.relliahealth.com',
        'https://relliahealth.sanity.studio',
        'https://*.sanity.studio',
      ],
      resolve: {
        mainDocuments: presentationMainDocuments,
        locations: presentationLocations,
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
