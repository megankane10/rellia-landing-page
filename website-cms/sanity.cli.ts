import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'ggbt0o98',
    dataset: process.env.SANITY_STUDIO_DATASET || 'preview',
  },
  deployment: {
    appId: 'oc1bkovxef8kgmy3rog6arqt',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
