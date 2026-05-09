import { createClient } from "@sanity/client"
import dotenv from "dotenv"

dotenv.config()

const client = createClient({
  projectId: process.env.SANITY_API_PROJECT_ID,
  dataset: process.env.SANITY_API_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: "2024-03-01",
})

async function fixHomePage() {
  console.log("Fetching homepage document...")
  const home = await client.fetch('*[_type == "homePage"][0]')

  if (!home) {
    console.error("Homepage document not found.")
    return
  }

  console.log("Current features:", home.whyFeatures?.map((f: any) => f.title))

  const coreTitles = ["The Outcomes", "The Advisors", "The Resources", "The Community"]
  
  // Filter to keep only core features and update description for Advisors
  const updatedFeatures = (home.whyFeatures || [])
    .filter((f: any) => coreTitles.includes(f.title))
    .map((f: any) => {
      if (f.title === "The Advisors") {
        return {
          ...f,
          description: "Access 1:1 guidance from experts with years of experience scaling health tech businesses."
        }
      }
      return f
    })
    // Sort to match requested order
    .sort((a: any, b: any) => coreTitles.indexOf(a.title) - coreTitles.indexOf(b.title))

  console.log("Updating to features:", updatedFeatures.map((f: any) => f.title))

  await client
    .patch(home._id)
    .set({ whyFeatures: updatedFeatures })
    .commit()

  console.log("Homepage data cleaned up successfully.")
}

fixHomePage().catch(console.error)
