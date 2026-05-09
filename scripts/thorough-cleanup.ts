import { createClient } from "@sanity/client"
import dotenv from "dotenv"

dotenv.config()

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
  apiVersion: "2024-03-01",
})

async function cleanup() {
  console.log("Starting thorough cleanup of program data...")
  try {
    // 1. Delete all individual program documents (both published and drafts)
    console.log("- Fetching and deleting all documents of type 'program'...")
    const programs = await client.fetch('*[_type == "program"]')
    for (const p of programs) {
      console.log(`  Deleting program: ${p.title} (${p._id})`)
      await client.delete(p._id)
    }

    // 2. Delete all programPage documents (detail page content)
    console.log("- Fetching and deleting all documents of type 'programPage'...")
    const pages = await client.fetch('*[_type == "programPage"]')
    for (const pg of pages) {
      console.log(`  Deleting programPage: ${pg.slug?.current || pg._id}`)
      await client.delete(pg._id)
    }

    // 3. Delete the programsLandingPage singleton
    console.log("- Deleting the programsLandingPage singleton...")
    await client.delete("programsLandingPage")
    await client.delete("drafts.programsLandingPage")

    console.log("\nCleanup successful! Your program data is now completely wiped.")
    console.log("Please run 'pnpm run sanity:seed' now to recreate the fresh, standardized versions.")
  } catch (err) {
    console.error("Cleanup failed:", err)
  }
}

cleanup()
