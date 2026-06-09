import { afterEach, describe, expect, it } from "vitest"
import { isVercelPreviewDeployment, resolveSanityApiConfig } from "./sanityEnv"

const env = process.env

afterEach(() => {
  process.env = { ...env }
})

describe("resolveSanityApiConfig", () => {
  it("uses production dataset on Vercel preview when enforce is enabled", () => {
    process.env.VERCEL = "1"
    process.env.VERCEL_ENV = "preview"
    process.env.SANITY_ENFORCE_VERCEL_DATASET = "true"
    process.env.SANITY_API_PROJECT_ID = "ggbt0o98"
    process.env.SANITY_API_DATASET = "production"
    process.env.VITE_SANITY_DATASET = "production"

    const result = resolveSanityApiConfig()
    expect(result).toEqual({
      status: "ok",
      projectId: "ggbt0o98",
      dataset: "production",
    })
  })

  it("honors SANITY_VERCEL_PREVIEW_DATASET override", () => {
    process.env.VERCEL = "1"
    process.env.VERCEL_ENV = "preview"
    process.env.SANITY_ENFORCE_VERCEL_DATASET = "true"
    process.env.SANITY_API_PROJECT_ID = "ggbt0o98"
    process.env.SANITY_VERCEL_PREVIEW_DATASET = "preview"

    const result = resolveSanityApiConfig()
    expect(result).toEqual({
      status: "ok",
      projectId: "ggbt0o98",
      dataset: "preview",
    })
  })
})

describe("isVercelPreviewDeployment", () => {
  it("is true only for VERCEL_ENV=preview", () => {
    process.env.VERCEL = "1"
    process.env.VERCEL_ENV = "preview"
    expect(isVercelPreviewDeployment()).toBe(true)

    process.env.VERCEL_ENV = "production"
    expect(isVercelPreviewDeployment()).toBe(false)
  })
})
