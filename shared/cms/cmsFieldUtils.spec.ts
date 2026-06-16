import { describe, expect, it } from "vitest"
import { cmsTextToPlain, hasCmsString } from "./cmsFieldUtils"
import { mergeProgramsLanding } from "./defaults"

describe("cmsTextToPlain", () => {
  it("strips stega from strings", () => {
    expect(hasCmsString("  Hello  ")).toBe(true)
    expect(cmsTextToPlain("  Hello  ")).toBe("Hello")
  })

  it("coerces legacy portable text blocks to plain text", () => {
    const legacy = [
      {
        _key: "programsSectionTitle",
        _type: "block",
        children: [{ _key: "t1", _type: "span", marks: [], text: "Explore programs" }],
        markDefs: [],
        style: "normal",
      },
    ]
    expect(cmsTextToPlain(legacy)).toBe("Explore programs")
    expect(hasCmsString(legacy)).toBe(true)
  })
})

describe("mergeProgramsLanding", () => {
  it("normalizes legacy portable-text programsSectionTitle without throwing", () => {
    const legacy = [
      {
        _key: "programsSectionTitle",
        _type: "block",
        children: [{ _key: "t1", _type: "span", marks: [], text: "Explore programs" }],
        markDefs: [],
        style: "normal",
      },
    ]

    const merged = mergeProgramsLanding({ programsSectionTitle: legacy as unknown as string })
    expect(merged.programsSectionTitle).toBe("Explore programs")
  })
})
