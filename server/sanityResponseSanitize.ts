const STRIP_KEYS = new Set(["_id", "_rev", "_ref", "allReferences"])

/**
 * Recursively remove fields that aid bulk schema mapping / document inventory.
 * Keeps `_type` / `_key` for portable text and component keys.
 */
export const stripSanityMetadata = (value: unknown): unknown => {
  if (value == null) return value
  if (Array.isArray(value)) return value.map(stripSanityMetadata)
  if (typeof value === "object") {
    const o = value as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(o)) {
      if (STRIP_KEYS.has(k)) continue
      out[k] = stripSanityMetadata(v)
    }
    return out
  }
  return value
}
