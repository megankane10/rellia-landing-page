export type CmsHeadingTone = "auto" | "light" | "dark"
export type CmsSectionBackground = "white" | "teal" | "cream"

export const resolveHeadingTone = (
  headingTone: CmsHeadingTone | undefined,
  defaultForBackground: "light" | "dark",
): "light" | "dark" => {
  if (headingTone === "light") return "light"
  if (headingTone === "dark") return "dark"
  return defaultForBackground
}

export const sectionBackgroundClass = (background?: CmsSectionBackground): string => {
  switch (background) {
    case "teal":
      return "bg-rellia-teal"
    case "cream":
      return "bg-rellia-cream/20"
    default:
      return "bg-white"
  }
}

export const defaultHeadingToneForBackground = (background?: CmsSectionBackground): "light" | "dark" =>
  background === "teal" ? "light" : "dark"
