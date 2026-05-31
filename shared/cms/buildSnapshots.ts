import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const snapshotsDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "build-snapshots",
)

const eventsSnapshotPath = resolve(snapshotsDir, "events.json")

export const writeEventsBuildSnapshot = (rows: Record<string, unknown>[]): void => {
  mkdirSync(snapshotsDir, { recursive: true })
  writeFileSync(eventsSnapshotPath, JSON.stringify(rows, null, 0), "utf8")
}

export const readEventsBuildSnapshot = (): Record<string, unknown>[] => {
  if (!existsSync(eventsSnapshotPath)) return []
  try {
    const parsed = JSON.parse(readFileSync(eventsSnapshotPath, "utf8")) as unknown
    return Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : []
  } catch {
    return []
  }
}
