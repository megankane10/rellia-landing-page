import { createClient } from "@sanity/client"
import "../scripts/loadEnv"

const projectId = process.env.SANITY_API_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || "ggbt0o98"
const token = process.env.SANITY_API_WRITE_TOKEN?.trim()

if (!token) {
  console.error("Error: Missing SANITY_API_WRITE_TOKEN")
  process.exit(1)
}

async function check(dataset: string) {
  const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: "2024-01-01",
  })
  
  try {
    const pages = await client.fetch(`*[_type == "page"]{_id, _type, title, "slug": slug.current}`)
    console.log(`\n--- Dataset: ${dataset} ---`)
    if (pages.length === 0) {
      console.log("No pages of type 'page' found.")
    } else {
      console.log(JSON.stringify(pages, null, 2))
    }
  } catch (err) {
    console.error(`Error querying dataset ${dataset}:`, err)
  }
}

async function run() {
  await check("production")
  await check("preview")
}

run()
