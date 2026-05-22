/** Parse a same-origin API response; rejects HTML SPA fallbacks and non-JSON bodies. */
export const parseApiJson = async <T>(
  res: Response,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> => {
  const contentType = res.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      error: "API unavailable. Redeploy or check server configuration.",
    }
  }

  let data: T
  try {
    data = (await res.json()) as T
  } catch {
    return { ok: false, error: "Invalid API response." }
  }

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error?: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Request failed (${res.status})`
    return { ok: false, error: message }
  }

  return { ok: true, data }
}
