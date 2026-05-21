import {defineConfig, buildLegacyTheme} from 'sanity'
import {RelliaStudioIcon} from './studioIcon'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './deskStructure'
import {presentationLocations, presentationMainDocuments} from './presentationLocations'

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

const previewOrigin = (
  process.env.SANITY_STUDIO_PREVIEW_URL || 'https://relliahealth.vercel.app'
).replace(/\/$/, '')

export default defineConfig({
  name: 'default',
  title: 'Rellia Website CMS',
  icon: RelliaStudioIcon,

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'ggbt0o98',
  dataset: process.env.SANITY_STUDIO_DATASET || 'preview',

  theme,

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    presentationTool({
      previewUrl: {
        // If Studio is deployed (https) and previewUrl is http://localhost, the iframe will be blocked as mixed content.
        // For local Studio dev, set SANITY_STUDIO_PREVIEW_URL=http://localhost:5173
        initial: previewOrigin,
        previewMode: {
          enable: `${previewOrigin}/api/draft-mode/enable`,
          disable: `${previewOrigin}/api/draft-mode/disable`,
        },
      },
      allowOrigins: [
        'http://localhost:*',
        'https://*.vercel.app',
        'https://relliahealth.com',
        'https://www.relliahealth.com',
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
