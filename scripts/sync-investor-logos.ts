import { createClient } from "@sanity/client"
import "./loadEnv"
import fs from "node:fs"
import path from "node:path"
import { promises as fsp } from "node:fs"
import { INVESTOR_LOGO_MARKS } from "../client/data/portfolioLogos"

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const requireEnv = (key: string): string => {
  const value = process.env[key]?.trim()
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value
}

const localPublicImageFilePath = (src: string): string =>
  path.join(process.cwd(), "public", src.replace(/^\//, ""))

const resolveImageAssetId = async (
  client: ReturnType<typeof createClient>,
  imageSrc: string,
): Promise<string | null> => {
  const filePath = localPublicImageFilePath(imageSrc)
  try {
    await fsp.stat(filePath)
  } catch {
    console.warn(`Missing image file: ${filePath}`)
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
        _type: "image" as const,
        asset: { _type: "reference" as const, _ref: assetId },
      }
    : undefined

const buildLogoMarqueeItems = async (client: ReturnType<typeof createClient>) => {
  const items: Array<{
    _type: "logoMarqueeItem"
    _key: string
    name: string
    logo?: ReturnType<typeof toSanityImageFieldValue>
  }> = []

  for (const mark of INVESTOR_LOGO_MARKS) {
    const assetId = await resolveImageAssetId(client, mark.src)
    const logo = toSanityImageFieldValue(assetId)
    if (!logo) continue
    items.push({
      _type: "logoMarqueeItem",
      _key: `logo-${slugify(mark.name)}`,
      name: mark.name,
      logo,
    })
  }

  return items
}

const syncDataset = async (dataset: string) => {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const logoMarquee = await buildLogoMarqueeItems(client)
  if (logoMarquee.length === 0) {
    throw new Error(`No investor logos uploaded for dataset "${dataset}"`)
  }

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "networkInvestorsPage"][0]{ _id }`,
  )

  if (!existing?._id) {
    throw new Error(`networkInvestorsPage not found in dataset "${dataset}"`)
  }

  await client
    .patch(existing._id)
    .set({ logoMarquee })
    .commit({ autoGenerateArrayKeys: true })

  console.log(`Synced ${logoMarquee.length} investor logos to ${dataset} (${existing._id})`)
}

const main = async () => {
  const args = process.argv.slice(2)
  const datasetArg = args.find((arg) => arg.startsWith("--dataset="))?.split("=")[1]?.trim()
  const datasets = datasetArg
    ? [datasetArg]
    : ["preview", "production"]

  for (const dataset of datasets) {
    await syncDataset(dataset)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
