const randomKey = () => Math.random().toString(36).slice(2, 14)

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value)

const shouldAssignKey = (obj: Record<string, unknown>) =>
  !obj._key && Object.keys(obj).some((key) => !key.startsWith("_"))

/**
 * Recursively adds Sanity `_key` to array object items that are missing one.
 * Used when API/seed data creates nested arrays without keys (Studio blocks editing).
 */
export const ensureArrayKeysDeep = <T>(input: T): { value: T; changed: boolean } => {
  let changed = false

  const walk = (node: unknown): unknown => {
    if (!Array.isArray(node)) return node

    return node.map((item) => {
      if (!isPlainObject(item)) return item

      let next: Record<string, unknown> = item
      if (shouldAssignKey(item)) {
        next = { ...item, _key: randomKey() }
        changed = true
      }

      const result: Record<string, unknown> = { ...next }
      for (const [key, value] of Object.entries(next)) {
        if (key === "_key" || key === "_type" || key === "_ref" || key === "_weak") continue
        result[key] = walk(value)
      }
      return result
    })
  }

  return { value: walk(input) as T, changed }
}
