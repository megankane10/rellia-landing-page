/**
 * Converts openRole `description` from legacy plain strings to openRoleDescription portable text.
 *
 *   pnpm sanity:migrate:open-role-descriptions
 *   SANITY_API_DATASET=production pnpm sanity:migrate:open-role-descriptions
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { plainStringToPortableTextBlocks } from "../shared/cms/normalizePortableText"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

type OpenRoleRow = {
  _id: string
  title?: string
  description?: unknown
}

const main = async () => {
  const projectId = requireEnv("SANITY_API_PROJECT_ID")
  const dataset = process.env.SANITY_API_DATASET?.trim() || "preview"
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  })

  const roles = await client.fetch<OpenRoleRow[]>(
    `*[_type == "openRole"]{ _id, title, description }`,
  )

  let migrated = 0
  for (const role of roles) {
    if (typeof role.description !== "string") continue
    const blocks = plainStringToPortableTextBlocks(role.description)
    if (blocks.length === 0) continue

    await client.patch(role._id).set({ description: blocks }).commit()
    console.log(`Migrated description for ${role.title ?? role._id} (${role._id})`)
    migrated += 1
  }

  if (migrated === 0) {
    console.log("No string descriptions found on openRole documents.")
    return
  }

  console.log(`\nDone. Migrated ${migrated} open role description(s) in dataset "${dataset}".`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
