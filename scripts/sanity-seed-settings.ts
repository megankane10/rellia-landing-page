/**
 * Seeds only globalSettings + siteSettings singletons (safe, no page/directory wipes).
 *
 *   pnpm sanity:seed:settings
 *   SANITY_API_DATASET=production pnpm sanity:seed:settings
 *
 * Requires SANITY_API_WRITE_TOKEN and project id env (see scripts/sanity-seed.ts).
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import fs from "node:fs"
import path from "node:path"
import { promises as fsp } from "node:fs"
import {
  DEFAULT_GLOBAL_SETTINGS,
  DEFAULT_THEME_COLORS,
} from "../shared/cms/defaults"
import { ROUTE_SEO } from "../client/config/seo"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

const seoForRoute = (pathname: string) => {
  const cfg = ROUTE_SEO[pathname]
  if (!cfg) return undefined
  const title = cfg.title
  const description = cfg.description
  const noIndex = cfg.indexable === false
  return {
    metaTitle: title,
    metaDescription: description,
    ogTitle: title,
    ogDescription: description,
    noIndex,
    title,
    description,
    openGraph: { title, description },
    robots: { noIndex, noFollow: false },
  }
}

const SANITY_UPLOADABLE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])

const isLocalPublicImagePath = (src: string): boolean => /^\/images\/[^/].+/i.test(src.trim())

const localPublicImageFilePath = (src: string): string =>
  path.join(process.cwd(), "public", src.replace(/^\//, ""))

const resolveImageAssetId = async (
  client: ReturnType<typeof createClient>,
  imageSrc: string | undefined,
): Promise<string | null> => {
  const src = (imageSrc ?? "").trim()
  if (!src) return null
  if (!isLocalPublicImagePath(src)) return null

  const filePath = localPublicImageFilePath(src)
  const ext = path.extname(filePath).toLowerCase()
  if (!SANITY_UPLOADABLE_EXTENSIONS.has(ext)) return null
  try {
    await fsp.stat(filePath)
  } catch {
    return null
  }

  const filename = path.basename(filePath)
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename },
  )
  if (existing) return existing

  const stream = fs.createReadStream(filePath)
  const uploaded = await client.assets.upload("image", stream as any, { filename })
  return uploaded?._id ?? null
}

const toSanityImageFieldValue = (assetId: string | null) =>
  assetId
    ? {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
      }
    : undefined

const resolveDataset = (): string => {
  const cliArg = process.argv.find((arg) => arg.startsWith("--dataset="))?.split("=")[1]?.trim()
  return (
    cliArg ||
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    "preview"
  )
}

async function main() {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const dataset = resolveDataset()
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const logoLightAssetId = await resolveImageAssetId(client, "/images/logo-rellia-footer.webp")
  const logoDarkAssetId = await resolveImageAssetId(client, "/images/logo-rellia-filled.webp")
  const logoLightValue = toSanityImageFieldValue(logoLightAssetId)
  const logoDarkValue = toSanityImageFieldValue(logoDarkAssetId)
  const siteDefaultSeo = seoForRoute("/")

  console.log(`Seeding globalSettings + siteSettings on dataset "${dataset}"…`)

  await client.mutate(
    [
      {
        createOrReplace: {
          _id: "globalSettings",
          _type: "globalSettings",
          ...DEFAULT_GLOBAL_SETTINGS,
          themeColors: DEFAULT_THEME_COLORS,
          priorityModalEnabled: false,
        },
      },
      {
        createOrReplace: {
          _id: "siteSettings",
          _type: "siteSettings",
          brandName: "Rellia Health",
          faviconPath: "/favicon.ico",
          logoLight: logoLightValue,
          logoDark: logoDarkValue,
          socialLinks: [
            {
              _type: "socialLink",
              _key: "linkedin",
              platform: "linkedin",
              label: "Rellia on LinkedIn",
              url: "https://www.linkedin.com/company/relliahealth",
            },
            {
              _type: "socialLink",
              _key: "instagram",
              platform: "instagram",
              label: "Rellia on Instagram",
              url: "https://www.instagram.com/relliahealth/",
            },
          ],
          defaultSeo: siteDefaultSeo
            ? {
                title: siteDefaultSeo.title ?? siteDefaultSeo.metaTitle,
                description: siteDefaultSeo.description ?? siteDefaultSeo.metaDescription,
                noIndex: siteDefaultSeo.noIndex ?? false,
              }
            : undefined,
        },
      },
    ],
    { autoGenerateArrayKeys: true },
  )

  console.log("Settings seed complete.")
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
