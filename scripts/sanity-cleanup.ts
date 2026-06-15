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
  'applyPage',
  'diagnosticSurveyContent',
  'consultingPage',
  'notFoundPage',
  'programsLandingPage',
  'eventsLandingPage',
  'storiesPage',
  'networkFoundersPage',
  'networkAlumniDirectoryPage',
  'networkAdvisorsPage',
  'networkAdvisorsDirectoryPage',
  'networkInvestorsPage',
  'networkPartnersPage',
] as const

const SLUGGED_TYPES = ['program', 'event', 'story', 'advisor', 'alumniCompany', 'page'] as const

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

  const stripMarkers = (value: unknown) =>
    typeof value === 'string' ? value.replace(/\*\*/g, '') : value

  // 4. Strip legacy ** emphasis markers from CTA title fields
  const ctaDocs = await client.fetch<
    Array<{_id: string; bottomCtaTitle?: string; ctaTitle?: string; bottomTitle?: string}>
  >(
    `*[_type in ["applyPage","homePage","faqPage","programsLandingPage","eventsLandingPage","paymentPage","careersPage","consultingPage","diagnosticLandingPage"] && (
      defined(bottomCtaTitle) || defined(ctaTitle) || defined(bottomTitle)
    )]{ _id, bottomCtaTitle, ctaTitle, bottomTitle }`,
  )
  let ctaPatches = 0
  for (const doc of ctaDocs) {
    const patch: Record<string, string> = {}
    if (typeof doc.bottomCtaTitle === 'string' && doc.bottomCtaTitle.includes('**')) {
      patch.bottomCtaTitle = stripMarkers(doc.bottomCtaTitle) as string
    }
    if (typeof doc.ctaTitle === 'string' && doc.ctaTitle.includes('**')) {
      patch.ctaTitle = stripMarkers(doc.ctaTitle) as string
    }
    if (typeof doc.bottomTitle === 'string' && doc.bottomTitle.includes('**')) {
      patch.bottomTitle = stripMarkers(doc.bottomTitle) as string
    }
    if (Object.keys(patch).length === 0) continue
    await client.patch(doc._id).set(patch).commit()
    ctaPatches += 1
  }
  console.log(`Stripped ** markers from ${ctaPatches} singleton CTA field(s).`)

  const sectionDocs = await client.fetch<Array<{_id: string; sections?: Array<Record<string, unknown>>}>>(
    `*[_type in ["page","program"] && defined(sections)]{ _id, sections }`,
  )
  let sectionCtaPatches = 0
  for (const doc of sectionDocs) {
    if (!Array.isArray(doc.sections)) continue
    let changed = false
    const sections = doc.sections.map((section) => {
      if (typeof section?.title === 'string' && section.title.includes('**')) {
        changed = true
        return {...section, title: stripMarkers(section.title)}
      }
      return section
    })
    if (!changed) continue
    await client.patch(doc._id).set({sections}).commit()
    sectionCtaPatches += 1
  }
  if (sectionCtaPatches) {
    console.log(`Stripped ** markers from sections on ${sectionCtaPatches} page/program doc(s).`)
  }

  // 4b. Migrate embedded careers open roles → openRole collection documents
  const careersWithEmbeddedRoles = await client.fetch<
    Array<{
      _id: string
      openRoles?: Array<{
        roleId?: string
        id?: string
        title?: string
        location?: string
        employmentType?: string
        description?: string
        responsibilities?: string[]
        linkedInApplyUrl?: string
        applyButtonLabel?: string
        applyButtonUrl?: string
      }>
    }>
  >(`*[_type == "careersPage" && count(openRoles) > 0]{ _id, openRoles }`)

  let migratedRoles = 0
  for (const doc of careersWithEmbeddedRoles) {
    const roles = doc.openRoles ?? []
    for (const [index, role] of roles.entries()) {
      const rawRoleId = role.roleId
      const anchor = (() => {
        if (typeof rawRoleId === 'string') return rawRoleId.trim()
        if (
          rawRoleId &&
          typeof rawRoleId === 'object' &&
          typeof (rawRoleId as {current?: string}).current === 'string'
        ) {
          return (rawRoleId as {current: string}).current.trim()
        }
        if (typeof role.id === 'string') return role.id.trim()
        return ''
      })()
      if (!anchor || !role.title?.trim()) continue
      const docId = `openRole.${anchor}`
      await client.createOrReplace({
        _id: docId,
        _type: 'openRole',
        roleId: {_type: 'slug', current: anchor},
        title: role.title,
        location: role.location ?? '',
        employmentType: role.employmentType ?? '',
        description: role.description ?? '',
        responsibilities: role.responsibilities ?? [],
        applyButtonLabel: role.applyButtonLabel?.trim() || 'Apply',
        applyButtonUrl: role.applyButtonUrl?.trim() || role.linkedInApplyUrl?.trim() || '',
        sortOrder: index,
      })
      migratedRoles += 1
    }
    await client
      .patch(doc._id)
      .unset([
        'openRoles',
        'defaultTab',
        'enableHiringTab',
        'enableVolunteerTab',
        'tabsLabelHiring',
        'tabsLabelVolunteer',
      ])
      .commit()
  }
  if (migratedRoles) {
    console.log(`Migrated ${migratedRoles} embedded open role(s) to openRole documents.`)
  }

  const careersLegacyTabOnly = await client.fetch<Array<{_id: string}>>(
    `*[_type == "careersPage" && (defined(defaultTab) || defined(enableHiringTab) || defined(enableVolunteerTab) || defined(tabsLabelHiring) || defined(tabsLabelVolunteer))]{ _id }`,
  )
  if (careersLegacyTabOnly.length) {
    const tx = client.transaction()
    for (const doc of careersLegacyTabOnly) {
      tx.patch(doc._id, {
        unset: [
          'defaultTab',
          'enableHiringTab',
          'enableVolunteerTab',
          'tabsLabelHiring',
          'tabsLabelVolunteer',
        ],
      })
    }
    await tx.commit()
    console.log(`Removed legacy careers tab fields on ${careersLegacyTabOnly.length} doc(s).`)
  }

  const openRolesWithStringDescription = await client.fetch<
    Array<{_id: string; description?: unknown}>
  >(`*[_type == "openRole" && defined(description)]{ _id, description }`)

  const openRolesNeedingMigration = openRolesWithStringDescription.filter(
    (doc) => typeof doc.description === 'string',
  )

  if (openRolesNeedingMigration.length) {
    const {plainStringToPortableTextBlocks} = await import(
      '../shared/cms/normalizePortableText'
    )
    for (const doc of openRolesNeedingMigration) {
      if (typeof doc.description !== 'string') continue
      const blocks = plainStringToPortableTextBlocks(doc.description)
      if (blocks.length === 0) continue
      await client.patch(doc._id).set({description: blocks}).commit()
    }
    console.log(
      `Migrated ${openRolesNeedingMigration.length} openRole description(s) from string to portable text.`,
    )
  }

  const openRolesWithLegacyApplyUrl = await client.fetch<Array<{_id: string}>>(
    `*[_type == "openRole" && defined(linkedInApplyUrl)]{ _id }`,
  )
  if (openRolesWithLegacyApplyUrl.length) {
    const tx = client.transaction()
    for (const doc of openRolesWithLegacyApplyUrl) {
      tx.patch(doc._id, {unset: ['linkedInApplyUrl']})
    }
    await tx.commit()
    console.log(`Unset linkedInApplyUrl on ${openRolesWithLegacyApplyUrl.length} openRole doc(s).`)
  }

  // 5. Remove orphaned careers team marquee images (feature removed from site)
  const careersWithMarquee = await client.fetch<Array<{_id: string}>>(
    `*[_type == "careersPage" && defined(teamMarqueeImages)]{ _id }`,
  )
  if (careersWithMarquee.length) {
    const tx = client.transaction()
    for (const doc of careersWithMarquee) {
      tx.patch(doc._id, {unset: ['teamMarqueeImages']})
    }
    await tx.commit()
    console.log(`Unset teamMarqueeImages on ${careersWithMarquee.length} careersPage doc(s).`)
  }

  console.log('\nCleanup complete.\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
