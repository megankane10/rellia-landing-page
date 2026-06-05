import { createClient } from "@sanity/client"
import "../scripts/loadEnv"

const projectId = process.env.SANITY_API_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || "ggbt0o98"
const token = process.env.SANITY_API_WRITE_TOKEN?.trim()

if (!token) {
  console.error("Error: Missing SANITY_API_WRITE_TOKEN in .env or .env.local")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: "preview",
  token,
  useCdn: false,
  apiVersion: "2024-01-01",
})

async function run() {
  console.log(`Attempting to discard draft "drafts.paymentPage" from dataset "preview"...`)
  try {
    const doc = await client.getDocument("drafts.paymentPage")
    if (!doc) {
      console.log(`No draft document with ID "drafts.paymentPage" was found in dataset "preview".`)
      return
    }

    console.log(`Found draft document: "${doc.title || doc._type}". Deleting...`)
    await client.delete("drafts.paymentPage")
    console.log(`Success: Discarded "drafts.paymentPage" successfully.`)
  } catch (err) {
    console.error("Failed to discard draft:", err)
    process.exit(1)
  }
}

run()
