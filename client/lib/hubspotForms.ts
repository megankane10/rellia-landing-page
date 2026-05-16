/** HubSpot Forms API (v2) — load once, then call `hbspt.forms.create` for each SPA mount */
export const HUBSPOT_V2_SCRIPT_SRC = "https://js.hsforms.net/forms/v2.js"

export const loadHubspotV2Script = (): Promise<void> => {
  if (typeof window !== "undefined" && typeof window.hbspt?.forms?.create === "function") {
    return Promise.resolve()
  }

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${HUBSPOT_V2_SCRIPT_SRC}"]`)
  if (existing) {
    if (typeof window.hbspt?.forms?.create === "function") return Promise.resolve()
    if (existing.dataset.loaded === "true") return Promise.resolve()
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener("error", () => reject(new Error("Failed to load HubSpot v2 script")), { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = HUBSPOT_V2_SCRIPT_SRC
    script.async = true
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true"
        resolve()
      },
      { once: true },
    )
    script.addEventListener("error", () => reject(new Error("Failed to load HubSpot v2 script")), { once: true })
    document.body.appendChild(script)
  })
}
