import {
  DEFAULT_ALUMNI_RELATED_COPY,
  DEFAULT_ADVISORS_RELATED_COPY,
  mergeRelatedContentCopy,
} from "./relatedContentCopy"

import type { NetworkDirectoryPageContent } from "./types"

export const DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE: NetworkDirectoryPageContent = {
  directoryTitle: "Explore Alumni",
  directorySubtitle:
    "Representative companies from the Rellia portfolio network—specialty tags and summaries help you see who is building alongside you.",
  ...DEFAULT_ALUMNI_RELATED_COPY,
  directoryCtaTitle: "Ready to build your network?",
  directoryCtaBody:
    "Apply for membership to access exclusive events, diagnostic tools, and directly connect with operators in our directory.",
  directoryCtaPrimaryLabel: "Apply for Membership",
  directoryCtaPrimaryHref: "/apply",
}

export const DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE: NetworkDirectoryPageContent = {
  directoryTitle: "Explore Advisors",
  directorySubtitle:
    "Browse advisors by expertise and industry—each profile links to a full bio and ways to connect.",
  ...DEFAULT_ADVISORS_RELATED_COPY,
  directoryCtaTitle: "Ready to advise health tech founders?",
  directoryCtaBody: "Apply to join the advisor network and mentor founders through structured, respectful engagements.",
  directoryCtaPrimaryLabel: "Apply to join",
  directoryCtaPrimaryHref: "/apply",
}

export const mergeNetworkDirectoryPage = (
  cms: Partial<NetworkDirectoryPageContent> | null | undefined,
  defaults: NetworkDirectoryPageContent,
): NetworkDirectoryPageContent => ({
  ...defaults,
  ...cms,
  ...mergeRelatedContentCopy(cms, {
    relatedSectionEnabled: defaults.relatedSectionEnabled ?? true,
    relatedSectionTitle: defaults.relatedSectionTitle ?? "",
    relatedSectionSubheadline: defaults.relatedSectionSubheadline ?? "",
  }),
  directoryTitle: cms?.directoryTitle?.trim() || defaults.directoryTitle,
  directorySubtitle: cms?.directorySubtitle?.trim() || defaults.directorySubtitle,
  directoryCtaTitle: cms?.directoryCtaTitle?.trim() || defaults.directoryCtaTitle,
  directoryCtaBody: cms?.directoryCtaBody?.trim() || defaults.directoryCtaBody,
  directoryCtaPrimaryLabel: cms?.directoryCtaPrimaryLabel?.trim() || defaults.directoryCtaPrimaryLabel,
  directoryCtaPrimaryHref: cms?.directoryCtaPrimaryHref?.trim() || defaults.directoryCtaPrimaryHref,
})

export const mergeNetworkAlumniDirectoryPage = (
  cms?: Partial<NetworkDirectoryPageContent> | null,
) => mergeNetworkDirectoryPage(cms, DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE)

export const mergeNetworkAdvisorsDirectoryPage = (
  cms?: Partial<NetworkDirectoryPageContent> | null,
) => mergeNetworkDirectoryPage(cms, DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE)
