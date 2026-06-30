/** In-memory cache for Airtable directory queue — reduces API calls on Airtable Free (1k/month). */

const CACHE_TTL_MS = 10 * 60 * 1000

type CacheEntry<T> = {
  value: T
  expiresAt: number
}

let queueCache: CacheEntry<unknown> | null = null
let queueCacheKey = ""

export const getAirtableQueueCacheKey = (baseId: string, dataset: string) =>
  `${baseId}:${dataset}`

export const getCachedAirtableQueue = async <T>(
  cacheKey: string,
  loader: () => Promise<T>,
  bypass = false,
): Promise<T> => {
  const now = Date.now()
  if (
    !bypass &&
    queueCache &&
    queueCacheKey === cacheKey &&
    queueCache.expiresAt > now
  ) {
    return queueCache.value as T
  }

  const value = await loader()
  queueCache = { value, expiresAt: now + CACHE_TTL_MS }
  queueCacheKey = cacheKey
  return value
}

export const invalidateAirtableQueueCache = () => {
  queueCache = null
  queueCacheKey = ""
}
