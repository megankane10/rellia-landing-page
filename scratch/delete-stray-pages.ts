import { createClient } from "@sanity/client"
import "../scripts/loadEnv"

const projectId = process.env.SANITY_API_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || "ggbt0o98"
const token = process.env.SANITY_API_WRITE_TOKEN?.trim()

if (!token) {
  console.error("Error: Missing SANITY_API_WRITE_TOKEN")
  process.exit(1)
}

async function deleteStrayPagesForDataset(dataset: string) {
  const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: "2024-01-01",
  })
  
  const ids = ["page.terms", "page.privacy", "drafts.page.terms", "drafts.page.privacy"]
  console.log(`\nDeleting stray pages in dataset: ${dataset}...`)
  
  for (const id of ids) {
    try {
      const doc = await client.getDocument(id)
      if (doc) {
        console.log(`Found stray page ${id} (${doc.title || doc._type}). Deleting...`)
        await client.delete(id)
        console.log(`Deleted ${id} successfully.`)
      } else {
        console.log(`Stray page ${id} not found in ${dataset}.`)
      }
    } catch (err) {
      console.error(`Failed to check/delete ${id} in ${dataset}:`, err)
    }
  }
}

async function run() {
  await deleteStrayPagesForDataset("production")
  await deleteStrayPagesForDataset("preview")
  console.log("\nObsolete page deletion completed.")
}

run()
