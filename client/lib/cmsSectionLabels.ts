/** Studio block titles — shown on the public site so editors can map sections to Sanity. */
export const CMS_SECTION_STUDIO_TITLES: Record<string, string> = {
  sectionMarketingHero: "Section: Marketing hero",
  sectionMetrics: "Section: Metrics",
  sectionFaq: "FAQ accordion",
  sectionFormEmbed: "Section: Form embed",
  sectionRichText: "Section: Rich text",
  sectionHero: "Section: Hero",
  sectionCardsGrid: "Section: Cards grid",
  sectionFeatureGrid: "Network: Feature Grid",
  sectionEngageBand: "Network: Engage Band (Teal)",
  sectionEligibilityBento: "Network: Eligibility Bento",
  sectionJourneyTimeline: "Network: Journey Timeline",
  sectionDiagnosticSurvey: "Network: Diagnostic Survey",
  sectionRelliaCta: "CTA band (grey-teal)",
  sectionTestimonials: "Section: Testimonials carousel",
}

export const cmsSectionStudioTitle = (sectionType: string) =>
  CMS_SECTION_STUDIO_TITLES[sectionType] ?? sectionType
