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
  console.log("Cleaning up old program documents...")
  try {
    // Delete all documents of type 'program'
    await client.delete({ query: '*[_type == "program"]' })
    console.log("Successfully cleared program documents.")
  } catch (err) {
    console.error("Cleanup failed:", err)
  }
}

cleanup()
