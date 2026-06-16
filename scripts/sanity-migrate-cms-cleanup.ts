/**
 * Production-safe CMS cleanup: legacy field migration, orphan removal, and gap seeding.
 * Only fills missing fields — does not overwrite populated CMS content.
 *
 *   pnpm sanity:migrate:cms-cleanup
 *   SANITY_API_DATASET=production pnpm sanity:migrate:cms-cleanup
 */
import { createClient, type SanityClient } from "@sanity/client"
import "./loadEnv"
import { cmsTextToPlain } from "../shared/cms/cmsFieldUtils"
import { DEFAULT_CAREERS_PAGE } from "../shared/cms/careersPageDefaults"
import {
  DEFAULT_APPLY_PAGE,
  DEFAULT_CONSULTING_PAGE,
  DEFAULT_DIAGNOSTIC_LANDING_PAGE,
  DEFAULT_PAYMENT_PAGE,
  DEFAULT_PROGRAMS_LANDING,
  getPaymentPagePanelDescriptionPortable,
} from "../shared/cms/defaults"
import {
  DEFAULT_NETWORK_ADVISORS_PAGE,
  DEFAULT_NETWORK_FOUNDERS_PAGE,
  DEFAULT_NETWORK_INVESTORS_PAGE,
  DEFAULT_NETWORK_PARTNERS_PAGE,
} from "../shared/cms/networkPageDefaults"
import { twoPartHeroHeadline, threePartHeroHeadline } from "../shared/cms/inlineHeroHeadline"
import { normalizeToPortableText } from "../shared/cms/normalizePortableText"
import { resolveHeroTitlePortable } from "../shared/cms/resolveHeroHeadline"
import type { SanityPortableText } from "../shared/cms/types"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

const hasPortable = (value: unknown): value is SanityPortableText =>
  Array.isArray(value) && value.length > 0

const isEmptyString = (value: unknown) => typeof value === "string" && !value.trim()

const isMissing = (value: unknown) =>
  value == null ||
  isEmptyString(value) ||
  (Array.isArray(value) && value.length === 0)

const pickMissing = <T extends Record<string, unknown>>(
  current: T,
  defaults: Partial<T>,
  keys: (keyof T)[],
): Partial<T> => {
  const set: Partial<T> = {}
  for (const key of keys) {
    if (isMissing(current[key]) && defaults[key] != null) {
      set[key] = defaults[key]
    }
  }
  return set
}

const legacyHeroToPortable = (doc: {
  heroTitle?: string | null
  heroAccentPhrase?: string | null
  heroTitleSuffix?: string | null
  heroHeadlinePortable?: SanityPortableText | null
}): SanityPortableText | null => {
  if (hasPortable(doc.heroHeadlinePortable)) return doc.heroHeadlinePortable

  const title = doc.heroTitle?.trim()
  const accent = doc.heroAccentPhrase?.trim()
  const suffix = doc.heroTitleSuffix?.trim()

  if (title && accent && suffix) {
    return threePartHeroHeadline(title, accent, suffix.startsWith(" ") ? suffix : ` ${suffix}`)
  }
  if (title && accent) return twoPartHeroHeadline(title, accent)
  if (title) return normalizeToPortableText(title)

  return null
}

const migrateProgramsLandingTitle = async (client: SanityClient) => {
  const doc = await client.fetch<{ _id: string; programsSectionTitle?: unknown } | null>(
    `*[_id == "programsLandingPage"][0]{ _id, programsSectionTitle }`,
  )
  if (!doc?._id) return

  const current = doc.programsSectionTitle
  if (typeof current === "string" && current.trim()) {
    console.log("programsLandingPage.programsSectionTitle already a string — skip")
    return
  }

  const plain = cmsTextToPlain(current) || DEFAULT_PROGRAMS_LANDING.programsSectionTitle
  await client.patch(doc._id).set({ programsSectionTitle: plain }).commit()
  console.log(`programsLandingPage.programsSectionTitle → "${plain}"`)
}

const migrateNetworkHeroes = async (
  client: SanityClient,
  type: string,
  defaults: { heroTitlePortable?: SanityPortableText },
) => {
  const doc = await client.fetch<{
    _id: string
    heroTitle?: string | null
    heroAccentPhrase?: string | null
    heroTitleSuffix?: string | null
    heroTitlePortable?: SanityPortableText | null
    heroHeadlinePortable?: SanityPortableText | null
  } | null>(`*[_id == "${type}"][0]{
    _id,
    heroTitle,
    heroAccentPhrase,
    heroTitleSuffix,
    heroTitlePortable,
    heroHeadlinePortable
  }`)

  if (!doc?._id) return

  const patch = client.patch(doc._id)
  const unset: string[] = []
  let changed = false

  if (!hasPortable(doc.heroTitlePortable)) {
    const fromLegacy = legacyHeroToPortable(doc)
    const portable =
      fromLegacy ??
      (defaults.heroTitlePortable && hasPortable(defaults.heroTitlePortable)
        ? defaults.heroTitlePortable
        : null)

    if (portable) {
      patch.set({ heroTitlePortable: portable })
      changed = true
      console.log(`  ${type}: set heroTitlePortable`)
    }
  }

  if (doc.heroTitle) unset.push("heroTitle")
  if (doc.heroAccentPhrase) unset.push("heroAccentPhrase")
  if (doc.heroTitleSuffix) unset.push("heroTitleSuffix")
  if (doc.heroHeadlinePortable) unset.push("heroHeadlinePortable")

  if (unset.length > 0) {
    patch.unset(unset)
    changed = true
    console.log(`  ${type}: unset ${unset.join(", ")}`)
  }

  if (changed) await patch.commit()
}

const seedCareersPage = async (client: SanityClient) => {
  const doc = await client.fetch<Record<string, unknown> | null>(`*[_id == "careersPage"][0]`)
  if (!doc?._id) return

  const unset = ["perksTitle", "openRolesTitle", "lifeAtRelliaHeading"].filter(
    (key) => doc[key] != null,
  )

  const set = pickMissing(doc, DEFAULT_CAREERS_PAGE as Record<string, unknown>, [
    "heroEyebrow",
    "heroSubtitle",
    "heroImageSrc",
    "whyTitle",
    "whyDescription",
    "whyFeatures",
    "perksDescription",
    "perksItems",
    "openRolesSubtitle",
    "ctaTitle",
    "ctaBody",
    "ctaPrimaryLabel",
    "ctaPrimaryHref",
    "lifeAtRelliaSubheading",
  ])

  if (!hasPortable(doc.heroTitlePortable)) {
    set.heroTitlePortable = resolveHeroTitlePortable(
      doc,
      DEFAULT_CAREERS_PAGE.heroTitlePortable!,
    )
  }
  if (!hasPortable(doc.perksTitlePortable)) {
    set.perksTitlePortable = DEFAULT_CAREERS_PAGE.perksTitlePortable
  }
  if (!hasPortable(doc.openRolesTitlePortable)) {
    set.openRolesTitlePortable = DEFAULT_CAREERS_PAGE.openRolesTitlePortable
  }
  if (!hasPortable(doc.lifeAtRelliaHeadingPortable)) {
    set.lifeAtRelliaHeadingPortable = DEFAULT_CAREERS_PAGE.lifeAtRelliaHeadingPortable
  }

  const patch = client.patch(doc._id as string)
  if (Object.keys(set).length > 0) patch.set(set)
  if (unset.length > 0) patch.unset(unset)
  if (Object.keys(set).length > 0 || unset.length > 0) {
    await patch.commit()
    console.log(`careersPage: set ${Object.keys(set).length} fields, unset ${unset.length} legacy fields`)
  }
}

const seedSingletonFromDefaults = async (
  client: SanityClient,
  docId: string,
  docType: string,
  defaults: Record<string, unknown>,
) => {
  const doc = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, { id: docId })
  if (!doc?._id) {
    await client.createIfNotExists({
      _id: docId,
      _type: docType,
      ...defaults,
    })
    console.log(`${docId}: created with defaults`)
    return
  }

  const keys = Object.keys(defaults).filter((key) => key !== "seo")
  const set = pickMissing(doc, defaults, keys)

  if (!hasPortable(doc.heroTitlePortable) && hasPortable(defaults.heroTitlePortable)) {
    set.heroTitlePortable = resolveHeroTitlePortable(doc, defaults.heroTitlePortable as SanityPortableText)
  }

  const legacyUnset = ["heroTitle", "heroAccentPhrase", "heroTitleSuffix", "heroHeadlinePortable"].filter(
    (key) => doc[key] != null,
  )

  const patch = client.patch(doc._id as string)
  if (Object.keys(set).length > 0) patch.set(set)
  if (legacyUnset.length > 0) patch.unset(legacyUnset)

  if (Object.keys(set).length > 0 || legacyUnset.length > 0) {
    await patch.commit()
    console.log(
      `${docId}: seeded ${Object.keys(set).length} fields, unset ${legacyUnset.length} legacy fields`,
    )
  }
}

const migrateAboutOrphans = async (client: SanityClient) => {
  const doc = await client.fetch<{ _id: string; valuesTitle?: unknown; valuesSubtitle?: unknown; valuesTag?: string } | null>(
    `*[_id == "aboutPage"][0]{ _id, valuesTitle, valuesSubtitle, valuesTag }`,
  )
  if (!doc?._id) return

  const patch = client.patch(doc._id)
  const unset: string[] = []
  if (doc.valuesTitle != null) unset.push("valuesTitle")
  if (doc.valuesSubtitle != null) unset.push("valuesSubtitle")
  if (isMissing(doc.valuesTag)) patch.set({ valuesTag: "OUR VALUES", showValuesTag: true })

  if (unset.length > 0) patch.unset(unset)
  if (unset.length > 0 || isMissing(doc.valuesTag)) {
    await patch.commit()
    console.log(`aboutPage: cleaned orphans (${unset.join(", ") || "none"})`)
  }
}

const seedPaymentPage = async (client: SanityClient) => {
  const existing = await client.fetch<Record<string, unknown> | null>(
    `*[_id == "paymentPage"][0]`,
  )

  const paymentDefaults: Record<string, unknown> = {
    welcomeSplashEnabled: DEFAULT_PAYMENT_PAGE.welcomeSplashEnabled,
    welcomeSplashHeadingPortable: DEFAULT_PAYMENT_PAGE.welcomeSplashHeadingPortable,
    welcomeSplashSubheading: DEFAULT_PAYMENT_PAGE.welcomeSplashSubheading,
    welcomeSplashBackgroundSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashBackgroundSrc,
    welcomeSplashLogoSrc: DEFAULT_PAYMENT_PAGE.welcomeSplashLogoSrc,
    welcomeSplashDurationSeconds: DEFAULT_PAYMENT_PAGE.welcomeSplashDurationSeconds,
    benefitsPanelHeadline: DEFAULT_PAYMENT_PAGE.benefitsPanelHeadline,
    benefitsTitle: DEFAULT_PAYMENT_PAGE.benefitsTitle,
    benefitsPanelDescriptionPortable: DEFAULT_PAYMENT_PAGE.benefitsPanelDescriptionPortable,
    benefitsPanelImageEnabled: DEFAULT_PAYMENT_PAGE.benefitsPanelImageEnabled,
    benefitsPanelImageSrc: DEFAULT_PAYMENT_PAGE.benefitsPanelImageSrc,
    choosePlanHeadline: DEFAULT_PAYMENT_PAGE.choosePlanHeadline,
    pricingMonthlyAmount: DEFAULT_PAYMENT_PAGE.pricingMonthlyAmount,
    pricingAnnualAmount: DEFAULT_PAYMENT_PAGE.pricingAnnualAmount,
    pricingMonthlyDiscountEnabled: DEFAULT_PAYMENT_PAGE.pricingMonthlyDiscountEnabled,
    pricingMonthlyCompareAmount: DEFAULT_PAYMENT_PAGE.pricingMonthlyCompareAmount,
    pricingAnnualDiscountEnabled: DEFAULT_PAYMENT_PAGE.pricingAnnualDiscountEnabled,
    pricingAnnualCompareAmount: DEFAULT_PAYMENT_PAGE.pricingAnnualCompareAmount,
    monthlyProceedLabel: DEFAULT_PAYMENT_PAGE.monthlyProceedLabel,
    annualProceedLabel: DEFAULT_PAYMENT_PAGE.annualProceedLabel,
    discountBannerEnabled: DEFAULT_PAYMENT_PAGE.discountBannerEnabled,
    discountBannerBadge: DEFAULT_PAYMENT_PAGE.discountBannerBadge,
    discountBannerSubtitle: DEFAULT_PAYMENT_PAGE.discountBannerSubtitle || "RELLIA50",
    promoMessage: DEFAULT_PAYMENT_PAGE.promoMessage,
    questionsTitle: DEFAULT_PAYMENT_PAGE.questionsTitle,
    questionsBody: DEFAULT_PAYMENT_PAGE.questionsBody,
    questionsFaqLabel: DEFAULT_PAYMENT_PAGE.questionsFaqLabel,
    questionsFaqPath: DEFAULT_PAYMENT_PAGE.questionsFaqPath,
    questionsContactLabel: DEFAULT_PAYMENT_PAGE.questionsContactLabel,
    questionsContactPath: DEFAULT_PAYMENT_PAGE.questionsContactPath,
  }

  if (!existing?._id) {
    await client.create({
      _id: "paymentPage",
      _type: "paymentPage",
      ...paymentDefaults,
    })
    console.log("paymentPage: created with full defaults")
    return
  }

  const set = pickMissing(existing, paymentDefaults, Object.keys(paymentDefaults))

  if (!hasPortable(existing.benefitsPanelDescriptionPortable)) {
    set.benefitsPanelDescriptionPortable = getPaymentPagePanelDescriptionPortable(
      existing as Parameters<typeof getPaymentPagePanelDescriptionPortable>[0],
    )
  }

  const legacyUnset = [
    "benefitsPanelDescription",
    "benefitsPanelBullet1",
    "benefitsPanelBullet2",
    "benefitsPanelBullet3",
    "benefitsPanelBullet4",
    "headline",
    "introCheckout",
    "introFallback",
    "badge",
    "heroTitlePortable",
    "heroHeadlinePortable",
  ].filter((key) => existing[key] != null)

  const patch = client.patch("paymentPage")
  if (Object.keys(set).length > 0) patch.set(set)
  if (legacyUnset.length > 0) patch.unset(legacyUnset)

  if (Object.keys(set).length > 0 || legacyUnset.length > 0) {
    await patch.commit()
    console.log(
      `paymentPage: set ${Object.keys(set).length} fields, unset ${legacyUnset.length} legacy fields`,
    )
  }
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
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  console.log(`\nCMS cleanup on dataset "${dataset}"...\n`)

  await migrateProgramsLandingTitle(client)

  await migrateNetworkHeroes(client, "networkFoundersPage", DEFAULT_NETWORK_FOUNDERS_PAGE)
  await migrateNetworkHeroes(client, "networkAdvisorsPage", DEFAULT_NETWORK_ADVISORS_PAGE)
  await migrateNetworkHeroes(client, "networkInvestorsPage", DEFAULT_NETWORK_INVESTORS_PAGE)
  await migrateNetworkHeroes(client, "networkPartnersPage", DEFAULT_NETWORK_PARTNERS_PAGE)

  await seedCareersPage(client)
  await seedSingletonFromDefaults(client, "consultingPage", "consultingPage", DEFAULT_CONSULTING_PAGE as Record<string, unknown>)
  await seedSingletonFromDefaults(client, "diagnosticLandingPage", "diagnosticLandingPage", DEFAULT_DIAGNOSTIC_LANDING_PAGE as Record<string, unknown>)
  await seedSingletonFromDefaults(client, "applyPage", "applyPage", DEFAULT_APPLY_PAGE as Record<string, unknown>)
  await seedPaymentPage(client)
  await migrateAboutOrphans(client)

  console.log("\nDone.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
