import { describe, expect, it } from "vitest"
import { resolveSocialPlatform } from "./socialLinks"

describe("resolveSocialPlatform", () => {
  it("keeps an explicit linkedin platform", () => {
    expect(
      resolveSocialPlatform("linkedin", "https://www.linkedin.com/in/example/"),
    ).toBe("linkedin")
  })

  it("infers linkedin when platform is missing", () => {
    expect(resolveSocialPlatform(undefined, "https://www.linkedin.com/in/example/")).toBe(
      "linkedin",
    )
  })

  it("infers linkedin when platform is website but URL is LinkedIn", () => {
    expect(
      resolveSocialPlatform("website", "https://www.linkedin.com/in/example/", "Profile"),
    ).toBe("linkedin")
  })

  it("infers linkedin from label when platform is other", () => {
    expect(
      resolveSocialPlatform("other", "https://www.linkedin.com/in/example/", "LinkedIn"),
    ).toBe("linkedin")
  })

  it("keeps website for non-social URLs", () => {
    expect(resolveSocialPlatform("website", "https://powerofplayinc.com")).toBe("website")
  })
})
