/**
 * Sets or updates the inline image on the primary open role (cropped, smaller hero).
 *
 *   pnpm sanity:seed:open-role-image
 *   SANITY_API_DATASET=production pnpm sanity:seed:open-role-image
 */
import { createClient } from "@sanity/client"
import "./loadEnv"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

type OpenRoleDoc = {
  _id: string
  title?: string
  description?: Array<{ _type?: string; _key?: string }>
}

const ROLE_INLINE_IMAGE = {
  _type: "eventDetailInlineImage",
  _key: "role-team-photo",
  imageSrc:
    "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900",
  alt: "Healthcare professionals collaborating at Rellia",
  displayMode: "cropped",
}

async function main() {
  const projectId = requireEnv("SANITY_API_PROJECT_ID")
  const dataset = process.env.SANITY_API_DATASET?.trim() || "preview"
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const role = await client.fetch<OpenRoleDoc | null>(
    `*[_type == "openRole" && !(title match "[DUMMY]*")][0]{ _id, title, description }`,
  )

  if (!role?._id) {
    console.log("No non-dummy open role found.")
    return
  }

  const description = Array.isArray(role.description) ? [...role.description] : []
  const imageIndex = description.findIndex(
    (block) => block?._type === "image" || block?._type === "eventDetailInlineImage",
  )

  let nextDescription: typeof description
  if (imageIndex >= 0) {
    nextDescription = description.map((block, index) =>
      index === imageIndex ? { ...ROLE_INLINE_IMAGE, _key: block._key ?? ROLE_INLINE_IMAGE._key } : block,
    )
    console.log(`Updating inline image on "${role.title}".`)
  } else {
    const insertAt = Math.min(2, description.length)
    nextDescription = [
      ...description.slice(0, insertAt),
      ROLE_INLINE_IMAGE,
      ...description.slice(insertAt),
    ]
    console.log(`Adding inline image to "${role.title}".`)
  }

  await client.patch(role._id).set({ description: nextDescription }).commit()
  console.log(`Done (${role._id}).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
