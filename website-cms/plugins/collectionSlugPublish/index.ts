import {definePlugin} from 'sanity'
import {slugifyCmsTitle} from '../../../shared/cms/slugify'

const COLLECTION_TYPES = new Set(['story', 'event', 'program'])

type SlugValue = {current?: string}

const readSlug = (value: unknown): string =>
  value && typeof value === 'object' && typeof (value as SlugValue).current === 'string'
    ? (value as SlugValue).current?.trim() ?? ''
    : ''

/** Auto-generates a slug from title when publishing collection docs with an empty slug. */
export const collectionSlugPublishPlugin = definePlugin({
  name: 'collection-slug-publish',
  document: {
    actions: (prev, context) => {
      const {schemaType} = context
      if (!COLLECTION_TYPES.has(schemaType)) return prev

      return prev.map((originalAction) => {
        if (originalAction.action !== 'publish') return originalAction

        return {
          ...originalAction,
          onHandle: async () => {
            const doc = context.draft || context.published
            const title = typeof doc?.title === 'string' ? doc.title.trim() : ''
            const slugCurrent = readSlug(doc?.slug)

            if (doc && title && !slugCurrent) {
              const client = context.getClient({apiVersion: '2024-01-01'})
              const documentId = context.documentId.replace(/^drafts\./, '')
              const nextSlug = slugifyCmsTitle(title)
              await client
                .patch(documentId)
                .set({slug: {_type: 'slug', current: nextSlug}})
                .commit({autoGenerateArrayKeys: true})
            }

            if (typeof originalAction.onHandle === 'function') {
              await originalAction.onHandle()
            }
          },
        }
      })
    },
  },
})
