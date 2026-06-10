import { createClient } from "@sanity/client"
import fs from "node:fs"
import path from "node:path"
import { promises as fsp } from "node:fs"
import "./loadEnv"
import {
  DEFAULT_PAYMENT_PAGE,
  getPaymentPagePanelDescriptionPortable,
} from "../shared/cms/defaults"
import type { PaymentPageContent } from "../shared/cms/types"

const UPLOADABLE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"])

const patchFields = {
  welcomeSplashEnabled: DEFAULT_PAYMENT_PAGE.welcomeSplashEnabled,
  welcomeSplashHeadingPortable: DEFAULT_PAYMENT_PAGE.welcomeSplashHeadingPortable,
  welcomeSplashSubheading: DEFAULT_PAYMENT_PAGE.welcomeSplashSubheading,
  welcomeSplashLogoSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashLogoSrc,
  welcomeSplashDurationSeconds: DEFAULT_PAYMENT_PAGE.welcomeSplashDurationSeconds,
  benefitsPanelDescription: DEFAULT_PAYMENT_PAGE.benefitsPanelDescription,
  benefitsPanelDescriptionPortable: DEFAULT_PAYMENT_PAGE.benefitsPanelDescriptionPortable,
  benefitsPanelImageEnabled: DEFAULT_PAYMENT_PAGE.benefitsPanelImageEnabled,
  benefitsPanelImageSrc: DEFAULT_PAYMENT_PAGE.benefitsPanelImageSrc,
}

const localPublicFilePath = (src: string): string | null => {
  const trimmed = src.trim()
  if (!trimmed.startsWith("/")) return null
  if (!/^\/(images|svgs)\//i.test(trimmed)) return null
  return path.join(process.cwd(), "public", trimmed.replace(/^\//, ""))
}

const toSanityImageFieldValue = (assetId: string | null) =>
  assetId
    ? {
        _type: "image" as const,
        asset: { _type: "reference" as const, _ref: assetId },
      }
    : undefined

const resolveLocalAssetId = async (
  client: ReturnType<typeof createClient>,
  src: string | undefined,
): Promise<string | null> => {
  const filePath = src ? localPublicFilePath(src) : null
  if (!filePath) return null

  const ext = path.extname(filePath).toLowerCase()
  if (!UPLOADABLE_EXTENSIONS.has(ext)) return null

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
  const uploaded = await client.assets.upload("image", stream as never, { filename })
  return uploaded?._id ?? null
}

const main = async () => {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    "preview"
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim()
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN missing")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const splashBackgroundAssetId = await resolveLocalAssetId(
    client,
    DEFAULT_PAYMENT_PAGE.welcomeSplashBackgroundSrc,
  )
  const panelBackgroundAssetId = await resolveLocalAssetId(
    client,
    DEFAULT_PAYMENT_PAGE.benefitsPanelImageSrc,
  )
  const splashLogoAssetId = await resolveLocalAssetId(
    client,
    DEFAULT_PAYMENT_PAGE.welcomeSplashLogoSrc,
  )

  const imageFields = {
    ...(toSanityImageFieldValue(splashBackgroundAssetId)
      ? { welcomeSplashBackground: toSanityImageFieldValue(splashBackgroundAssetId) }
      : {}),
    ...(toSanityImageFieldValue(panelBackgroundAssetId)
      ? { benefitsPanelImage: toSanityImageFieldValue(panelBackgroundAssetId) }
      : {}),
    ...(toSanityImageFieldValue(splashLogoAssetId)
      ? { welcomeSplashLogo: toSanityImageFieldValue(splashLogoAssetId) }
      : {}),
  }

  const existingDoc = await client.fetch<PaymentPageContent | null>(
    `*[_id == "paymentPage"][0]{
      _id,
      benefitsPanelDescriptionPortable,
      benefitsPanelDescription,
      benefitsPanelBullet1,
      benefitsPanelBullet2,
      benefitsPanelBullet3,
      benefitsPanelBullet4,
      benefits
    }`,
  )

  const resolvedPortable = getPaymentPagePanelDescriptionPortable(
    existingDoc ?? DEFAULT_PAYMENT_PAGE,
  )

  if (!existingDoc?._id) {
    await client.createIfNotExists({
      _id: "paymentPage",
      _type: "paymentPage",
      ...patchFields,
      ...imageFields,
      welcomeSplashBackgroundSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashBackgroundSrc,
      benefitsPanelHeadline: DEFAULT_PAYMENT_PAGE.benefitsPanelHeadline,
      benefitsTitle: DEFAULT_PAYMENT_PAGE.benefitsTitle,
      benefits: DEFAULT_PAYMENT_PAGE.benefits,
      choosePlanHeadline: DEFAULT_PAYMENT_PAGE.choosePlanHeadline,
      pricingMonthlyAmount: DEFAULT_PAYMENT_PAGE.pricingMonthlyAmount,
      pricingAnnualAmount: DEFAULT_PAYMENT_PAGE.pricingAnnualAmount,
    })
    console.log(`Created paymentPage with defaults on dataset: ${dataset}`)
    return
  }

  const patch = client.patch("paymentPage").setIfMissing({
    ...patchFields,
    ...imageFields,
    welcomeSplashBackgroundSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashBackgroundSrc,
  })

  patch.set({
    welcomeSplashDurationSeconds: DEFAULT_PAYMENT_PAGE.welcomeSplashDurationSeconds,
  })

  if (!existingDoc?.benefitsPanelDescriptionPortable?.length) {
    patch.set({ benefitsPanelDescriptionPortable: resolvedPortable })
    console.log("  migrated benefitsPanelDescriptionPortable from legacy/plain text")
  }

  await patch.commit()

  console.log(`Patched paymentPage on dataset: ${dataset}`)
  if (splashBackgroundAssetId) console.log("  welcomeSplashBackground asset ready")
  if (panelBackgroundAssetId) console.log("  benefitsPanelImage asset ready")
  if (splashLogoAssetId) console.log("  welcomeSplashLogo asset ready")
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
