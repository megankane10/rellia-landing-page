import { createClient } from "@sanity/client"
import "./loadEnv"
import { DEFAULT_PAYMENT_PAGE } from "../shared/cms/defaults"

const patchFields = {
  welcomeSplashEnabled: DEFAULT_PAYMENT_PAGE.welcomeSplashEnabled,
  welcomeSplashHeading: DEFAULT_PAYMENT_PAGE.welcomeSplashHeading,
  welcomeSplashSubheading: DEFAULT_PAYMENT_PAGE.welcomeSplashSubheading,
  welcomeSplashLogoSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashLogoSrc,
  welcomeSplashDurationSeconds: DEFAULT_PAYMENT_PAGE.welcomeSplashDurationSeconds,
  benefitsPanelBullet1: DEFAULT_PAYMENT_PAGE.benefitsPanelBullet1,
  benefitsPanelBullet2: DEFAULT_PAYMENT_PAGE.benefitsPanelBullet2,
  benefitsPanelBullet3: DEFAULT_PAYMENT_PAGE.benefitsPanelBullet3,
  benefitsPanelBullet4: DEFAULT_PAYMENT_PAGE.benefitsPanelBullet4,
  benefitsPanelImageEnabled: DEFAULT_PAYMENT_PAGE.benefitsPanelImageEnabled,
  benefitsPanelImageSrc: DEFAULT_PAYMENT_PAGE.benefitsPanelImageSrc,
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

  const exists = await client.fetch<string | null>(
    '*[_id == "paymentPage"][0]._id',
  )

  if (!exists) {
    await client.createIfNotExists({
      _id: "paymentPage",
      _type: "paymentPage",
      ...patchFields,
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

  await client
    .patch("paymentPage")
    .setIfMissing({
      ...patchFields,
      welcomeSplashBackgroundSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashBackgroundSrc,
    })
    .commit()

  console.log(`Patched paymentPage fields (setIfMissing only) on dataset: ${dataset}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
