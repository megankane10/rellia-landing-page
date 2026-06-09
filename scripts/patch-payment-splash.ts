import { createClient } from "@sanity/client"
import "./loadEnv"
import { DEFAULT_PAYMENT_PAGE } from "../shared/cms/defaults"

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

  const splashFields = {
    welcomeSplashEnabled: DEFAULT_PAYMENT_PAGE.welcomeSplashEnabled,
    welcomeSplashHeading: DEFAULT_PAYMENT_PAGE.welcomeSplashHeading,
    welcomeSplashSubheading: DEFAULT_PAYMENT_PAGE.welcomeSplashSubheading,
    welcomeSplashBackgroundSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashBackgroundSrc,
    welcomeSplashLogoSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashLogoSrc,
    welcomeSplashDurationSeconds: DEFAULT_PAYMENT_PAGE.welcomeSplashDurationSeconds,
  }

  const exists = await client.fetch<string | null>(
    '*[_id == "paymentPage"][0]._id',
  )

  if (!exists) {
    await client.createIfNotExists({
      _id: "paymentPage",
      _type: "paymentPage",
      ...splashFields,
      benefitsPanelHeadline: DEFAULT_PAYMENT_PAGE.benefitsPanelHeadline,
      benefitsTitle: DEFAULT_PAYMENT_PAGE.benefitsTitle,
      benefits: DEFAULT_PAYMENT_PAGE.benefits,
      choosePlanHeadline: DEFAULT_PAYMENT_PAGE.choosePlanHeadline,
      pricingMonthlyAmount: DEFAULT_PAYMENT_PAGE.pricingMonthlyAmount,
      pricingAnnualAmount: DEFAULT_PAYMENT_PAGE.pricingAnnualAmount,
    })
    console.log(`Created paymentPage with splash defaults on dataset: ${dataset}`)
    return
  }

  await client.patch("paymentPage").setIfMissing(splashFields).commit()
  console.log(`Patched paymentPage splash fields on dataset: ${dataset}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
