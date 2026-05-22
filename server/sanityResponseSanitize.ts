const STRIP_KEYS = new Set(["_id", "_rev", "_ref", "allReferences"])

/** Admin draft list needs document ids for Studio deep links. */
const PRESERVE_ID_QUERIES = new Set(["sanityDrafts", "sanityRecentEdits"])

/**
 * Recursively remove fields that aid bulk schema mapping / document inventory.
 * Keeps `_type` / `_key` for portable text and component keys.
 */
export const stripSanityMetadata = (
  value: unknown,
  queryId?: string,
): unknown => {
  const stripKeys = queryId && PRESERVE_ID_QUERIES.has(queryId)
    ? new Set(["_rev", "_ref", "allReferences"])
    : STRIP_KEYS

  if (value == null) return value
  if (Array.isArray(value)) {
    return value.map((item) => stripSanityMetadata(item, queryId))
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(o)) {
      if (stripKeys.has(k)) continue
      out[k] = stripSanityMetadata(v, queryId)
    }
    return out
  }
  return value
}
