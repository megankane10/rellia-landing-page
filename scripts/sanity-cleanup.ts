/**
 * Removes obsolete Sanity documents and reports duplicate singletons / slugs.
 *
 * Run (preview dataset — Additions / Vercel preview):
 *   SANITY_API_DATASET=preview pnpm sanity:cleanup
 *
 * Run (production — after promoting content):
 *   SANITY_API_DATASET=production pnpm sanity:cleanup -- --apply-production
 *
 * Requires SANITY_API_WRITE_TOKEN and SANITY_API_PROJECT_ID (or VITE_SANITY_PROJECT_ID).
 */
import {createClient} from '@sanity/client'
import './loadEnv'

const SINGLETON_TYPES = [
  'siteSettings',
  'globalSettings',
  'navigation',
  'homePage',
  'aboutPage',
  'careersPage',
  'faqPage',
  'contactPage',
  'paymentPage',
  'consultingPage',
  'notFoundPage',
  'programsLandingPage',
  'eventsLandingPage',
  'storiesPage',
  'networkFoundersPage',
  'networkAdvisorsPage',
  'networkInvestorsPage',
  'networkPartnersPage',
  'programPage',
] as const

const SLUGGED_TYPES = ['program', 'event', 'story', 'advisor', 'alumniCompany', 'founder', 'investor', 'industryPartner', 'page', 'marketingPage'] as const

const requireEnv = (key: string): string => {
  const v = process.env[key]?.trim()
  if (!v) throw new Error(`Missing ${key}`)
  return v
}

const main = async () => {
  const applyProduction = process.argv.includes('--apply-production')
  const dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    'preview'

  if (dataset === 'production' && !applyProduction) {
    console.error(
      'Refusing to mutate production without --apply-production. Use preview for Additions workflow.',
    )
    process.exit(1)
  }

  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    requireEnv('SANITY_API_PROJECT_ID')
  const token = requireEnv('SANITY_API_WRITE_TOKEN')

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  })

  console.log(`\nSanity cleanup — project ${projectId}, dataset "${dataset}"\n`)

  // 1. Remove obsolete diagnosticSubmission documents (schema removed)
  const diagnosticDocs = await client.fetch<Array<{_id: string}>>(
    `*[_type == "diagnosticSubmission"]{ _id }`,
  )
  if (diagnosticDocs.length) {
    console.log(`Deleting ${diagnosticDocs.length} diagnosticSubmission document(s)...`)
    const tx = client.transaction()
    for (const doc of diagnosticDocs) {
      tx.delete(doc._id)
    }
    await tx.commit()
    console.log('  Done.')
  } else {
    console.log('No diagnosticSubmission documents found.')
  }

  // 2. Singleton duplicates (keep canonical id === _type when present)
  for (const type of SINGLETON_TYPES) {
    const docs = await client.fetch<Array<{_id: string; _updatedAt?: string}>>(
      `*[_type == $type]{ _id, _updatedAt } | order(_updatedAt desc)`,
      {type},
    )
    if (docs.length <= 1) continue

    const canonical = docs.find((d) => d._id === type || d._id === `drafts.${type}`)
    const toDelete = docs.filter((d) => d._id !== canonical?._id)
    if (!toDelete.length) {
      console.log(`\n[${type}] ${docs.length} docs — manual review:`)
      docs.forEach((d) => console.log(`  - ${d._id}`))
      continue
    }

    console.log(`\n[${type}] Removing ${toDelete.length} duplicate(s), keeping ${canonical?._id ?? docs[0]._id}`)
    const tx = client.transaction()
    for (const doc of toDelete) tx.delete(doc._id)
    await tx.commit()
  }

  // 3. Slug duplicates within slugged types (keep most recently updated)
  for (const type of SLUGGED_TYPES) {
    const docs = await client.fetch<Array<{_id: string; slug: string; _updatedAt: string}>>(
      `*[_type == $type && defined(slug.current)]{ _id, "slug": slug.current, _updatedAt } | order(_updatedAt desc)`,
      {type},
    )
    const bySlug = new Map<string, Array<{_id: string; _updatedAt: string}>>()
    for (const doc of docs) {
      if (!doc.slug) continue
      const list = bySlug.get(doc.slug) ?? []
      list.push({_id: doc._id, _updatedAt: doc._updatedAt})
      bySlug.set(doc.slug, list)
    }

    for (const [slug, list] of bySlug) {
      if (list.length <= 1) continue
      const [keep, ...remove] = list
      console.log(`\n[${type}] slug "${slug}" — keep ${keep._id}, delete ${remove.length}`)
      const tx = client.transaction()
      for (const doc of remove) tx.delete(doc._id)
      await tx.commit()
    }
  }

  console.log('\nCleanup complete.\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
