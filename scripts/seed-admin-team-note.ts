/**
 * Seeds the shared admin team quick note (production Supabase).
 * Run: pnpm tsx scripts/seed-admin-team-note.ts
 *
 * WARNING: If scripts/supabase_slack_team_note.sql is installed, this upsert
 * posts to #website-inbox. Skip late-night runs unless you want that alert.
 * Set TEAM_NOTE_SEED_AUTHOR in .env.local to control the published-by label.
 */
import { createClient } from "@supabase/supabase-js"
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const loadEnvFile = (filename: string) => {
  const path = resolve(process.cwd(), filename)
  if (!existsSync(path)) return
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "")
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(".env.local")
loadEnvFile(".env")

const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim()
const serviceRoleKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  ""
).trim()

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const blocks = [
  { type: "sticker", emoji: "☕" },
  { type: "sticker", emoji: "✨" },
  { type: "sticker", emoji: "🎯" },
  {
    type: "text",
    text: `**Midweek check-in**

A light spot for quick updates — reminders, wins, or anything worth sharing with the room.

- Keep it short and easy to skim
- Reactions help everyone see who's caught up

**Here's to a good week ahead.**`,
  },
  {
    type: "image",
    url: "https://www.relliahealth.com/images/cta-home-conference.webp",
    alt: "Health tech founders collaborating at an event",
  },
]

const now = new Date().toISOString()

const authorName = (process.env.TEAM_NOTE_SEED_AUTHOR || "").trim()

const client = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await client
  .from("admin_team_board")
  .upsert(
    {
      id: "default",
      blocks,
      published_by_name: authorName || null,
      published_at: now,
      updated_at: now,
    },
    { onConflict: "id" },
  )
  .select("id, published_at")
  .single()

if (error) {
  console.error("Could not seed team note:", error.message)
  process.exit(1)
}

console.log("Team note seeded:", data)
