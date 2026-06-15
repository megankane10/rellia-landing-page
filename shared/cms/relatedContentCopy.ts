export type RelatedContentSectionCopy = {
  relatedSectionEnabled?: boolean
  relatedSectionTitle?: string
  relatedSectionSubheadline?: string
}

export const isRelatedSectionEnabled = (cms?: RelatedContentSectionCopy | null): boolean =>
  cms?.relatedSectionEnabled !== false

export const DEFAULT_STORIES_RELATED_COPY: Required<RelatedContentSectionCopy> = {
  relatedSectionEnabled: true,
  relatedSectionTitle: "More stories",
  relatedSectionSubheadline: "Read more on the latest updates and news from our network.",
}

export const DEFAULT_ALUMNI_RELATED_COPY: Required<RelatedContentSectionCopy> = {
  relatedSectionEnabled: true,
  relatedSectionTitle: "More alumni companies",
  relatedSectionSubheadline: "Discover other founders building in the Rellia network.",
}

export const DEFAULT_ADVISORS_RELATED_COPY: Required<RelatedContentSectionCopy> = {
  relatedSectionEnabled: true,
  relatedSectionTitle: "More advisors",
  relatedSectionSubheadline: "Explore mentors who support health tech founders across the Rellia network.",
}

export const DEFAULT_EVENTS_RELATED_COPY: Required<RelatedContentSectionCopy> = {
  relatedSectionEnabled: true,
  relatedSectionTitle: "More events",
  relatedSectionSubheadline: "See what is coming up and revisit recent sessions from the Rellia community.",
}

export const DEFAULT_PROGRAMS_RELATED_COPY: Required<RelatedContentSectionCopy> = {
  relatedSectionEnabled: true,
  relatedSectionTitle: "More available programs",
  relatedSectionSubheadline: "Explore other programs currently accepting applications.",
}

export const mergeRelatedContentCopy = (
  cms: RelatedContentSectionCopy | null | undefined,
  defaults: Required<RelatedContentSectionCopy>,
): Required<RelatedContentSectionCopy> => ({
  relatedSectionEnabled: cms?.relatedSectionEnabled !== false,
  relatedSectionTitle: cms?.relatedSectionTitle?.trim() || defaults.relatedSectionTitle,
  relatedSectionSubheadline: cms?.relatedSectionSubheadline?.trim() || defaults.relatedSectionSubheadline,
})
