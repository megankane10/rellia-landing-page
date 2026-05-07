import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './deskStructure'

export default defineConfig({
  name: 'default',
  title: 'Website CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'ggbt0o98',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    presentationTool({
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:5173',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      allowOrigins: [
        'http://localhost:*',
        'https://*.vercel.app',
        'https://relliahealth.com',
        'https://www.relliahealth.com',
      ],
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
