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

async function debug() {
  console.log("Current Sanity State:")
  
  const programs = await client.fetch('*[_type == "program"]')
  console.log(`\nFound ${programs.length} documents of type 'program':`)
  programs.forEach((p: any) => {
    console.log(`- ID: ${p._id}, Title: ${p.title}, Slug: ${p.slug?.current}, Image: ${p.imageSrc}`)
  })

  const landing = await client.fetch('*[_type == "programsLandingPage"][0]')
  console.log(`\nFound 'programsLandingPage' document (ID: ${landing?._id})`)
  if (landing?.programs) {
    console.log(`Landing page has ${landing.programs.length} programs in its array:`)
    landing.programs.forEach((p: any, i: number) => {
      console.log(`  [${i}] Title: ${p.title}, Image: ${p.imageSrc}`)
    })
  } else {
    console.log("Landing page has NO programs array.")
  }
}

debug()
