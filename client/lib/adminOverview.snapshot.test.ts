import { describe, expect, it } from "vitest"
import {
  buildTodaySnapshotSegments,
  formatTodaySnapshotMessage,
} from "./adminOverview"

describe("formatTodaySnapshotMessage", () => {
  it("returns empty state copy", () => {
    expect(formatTodaySnapshotMessage({ contacts: 0, diagnostics: 0, total: 0 })).toBe(
      "No new submissions",
    )
  })

  it("names a single web form", () => {
    expect(formatTodaySnapshotMessage({ contacts: 1, diagnostics: 0, total: 1 })).toBe(
      "1 new web form today",
    )
  })

  it("names multiple web forms", () => {
    expect(formatTodaySnapshotMessage({ contacts: 2, diagnostics: 0, total: 2 })).toBe(
      "2 new web forms today",
    )
  })

  it("names a single survey", () => {
    expect(formatTodaySnapshotMessage({ contacts: 0, diagnostics: 1, total: 1 })).toBe(
      "1 new survey today",
    )
  })

  it("summarizes mixed inbox activity", () => {
    expect(formatTodaySnapshotMessage({ contacts: 2, diagnostics: 1, total: 3 })).toBe(
      "3 new submissions today",
    )
  })
})

describe("buildTodaySnapshotSegments", () => {
  it("returns only active submission types", () => {
    expect(buildTodaySnapshotSegments({ contacts: 2, diagnostics: 1, total: 3 })).toEqual([
      { key: "contacts", count: 2, label: "web forms" },
      { key: "diagnostics", count: 1, label: "survey" },
    ])
  })
})
