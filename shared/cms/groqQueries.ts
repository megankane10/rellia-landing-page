/** Maps legacy \`seo\` object and sanity-plugin-seofields \`seoFields\` to frontend SeoContent. */
const seoFragment = `seo{
  "metaTitle": coalesce(metaTitle, title, openGraph.title),
  "metaDescription": coalesce(metaDescription, description, openGraph.description),
  "ogTitle": coalesce(ogTitle, openGraph.title, twitter.title),
  "ogDescription": coalesce(ogDescription, openGraph.description, twitter.description),
  "ogImageUrl": coalesce(
    ogImage.asset->url,
    metaImage.asset->url,
    openGraph.image.asset->url,
    openGraph.imageUrl,
    twitter.image.asset->url,
    twitter.imageUrl
  ),
  "noIndex": coalesce(noIndex, robots.noIndex),
  "noFollow": coalesce(noFollow, robots.noFollow)
}`

const pageVisibilityFragment = `pageVisibility,
  placeholderTitle,
  placeholderMessage,
  placeholderCtaLabel,
  placeholderCtaHref`

const logoMarqueeFragment = `logoMarquee[]{
  name,
  "src": logo.asset->url,
  href
}`

export const globalSettingsQuery = `*[_type == "globalSettings"][0]{
  footerTagline,
  supportEmail,
  linkedinUrl,
  instagramUrl,
  copyrightLine,
  announcementEnabled,
  announcementText,
  announcementButtonLabel,
  announcementButtonLink,
  announcementPillText,
  priorityModalEnabled,
  priorityModalHeading,
  priorityModalBody,
  priorityModalPillText,
  priorityModalButtonLabel,
  priorityModalButtonLink,
  "priorityModalImageUrl": priorityModalImage.asset->url,
  "priorityModalImageAlt": priorityModalImage.alt
}`;

export const navigationQuery = `*[_type == "navigation"][0]{
  primary[]{
    label,
    href,
    description,
    badge,
    children[]{
      label,
      href,
      description,
      badge,
      children[]{
        label,
        href,
        description,
        badge
      }
    }
  },
  footer[]{
    label,
    href,
    description,
    badge,
    children[]{
      label,
      href,
      description,
      badge,
      children[]{
        label,
        href,
        description,
        badge
      }
    }
  }
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  "siteName": coalesce(brandName, siteName),
  "logoUrl": coalesce(logoLight.asset->url, logo.asset->url),
  faviconPath,
  defaultSeo{
    "metaTitle": coalesce(metaTitle, title, openGraph.title),
    "metaDescription": coalesce(metaDescription, description, openGraph.description),
    "ogTitle": coalesce(ogTitle, openGraph.title, twitter.title, title),
    "ogDescription": coalesce(ogDescription, openGraph.description, twitter.description, description),
    "ogImageUrl": coalesce(
      ogImage.asset->url,
      metaImage.asset->url,
      openGraph.image.asset->url,
      openGraph.imageUrl,
      twitter.image.asset->url,
      twitter.imageUrl
    ),
    "noIndex": coalesce(noIndex, robots.noIndex),
    "noFollow": coalesce(noFollow, robots.noFollow)
  }
}`

export const featuredStoriesQuery = `*[_type == "story" && featured == true && !(_id in path("drafts.**"))]
| order(publishedAt desc, _updatedAt desc)[0...6]{
  title,
  "slug": slug.current,
  excerpt,
  "coverImageSrc": headerImage.asset->url,
  "coverImageAlt": headerImageAlt,
  "tag": filters[0]->title,
  publishedAt,
  ${seoFragment},
  body
}`

export const storiesQuery = `*[_type == "story" && !(_id in path("drafts.**"))]
| order(publishedAt desc, _updatedAt desc){
  title,
  "slug": slug.current,
  excerpt,
  "coverImageSrc": headerImage.asset->url,
  "coverImageAlt": headerImageAlt,
  "tag": filters[0]->title,
  publishedAt,
  featured
}`

export const storiesPageQuery = `*[_type == "storiesPage"][0]{
  headlinePortable,
  subheadline,
  ${seoFragment}
}`

export const storyBySlugQuery = `*[_type == "story" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  excerpt,
  "coverImageSrc": headerImage.asset->url,
  "coverImageAlt": headerImageAlt,
  "tag": filters[0]->title,
  publishedAt,
  featured,
  body,
  ${seoFragment}
}`

export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  ${seoFragment},
  sections[]{
    ...,
    "imageUrl": image.asset->url,
    primaryCta{ label, href, description, badge },
    secondaryCta{ label, href, description, badge },
    cards[]{
      ...,
      "imageUrl": image.asset->url,
      cta{ label, href, description, badge }
    }
  }
}`

const pageSectionsFragment = `sections[]{
  ...,
  "imageUrl": image.asset->url,
  primaryCta{ label, href, description, badge },
  secondaryCta{ label, href, description, badge },
  cards[]{
    ...,
    "imageUrl": image.asset->url,
    cta{ label, href, description, badge }
  }
}`

export const networkFoundersPageQuery = `*[_type == "networkFoundersPage"][0]{
  title,
  useModularPage,
  ${pageVisibilityFragment},
  ${logoMarqueeFragment},
  ${seoFragment},
  ${pageSectionsFragment}
}`

export const networkAdvisorsPageQuery = `*[_type == "networkAdvisorsPage"][0]{
  title,
  useModularPage,
  ${pageVisibilityFragment},
  ${seoFragment},
  ${pageSectionsFragment}
}`

export const networkInvestorsPageQuery = `*[_type == "networkInvestorsPage"][0]{
  title,
  useModularPage,
  ${pageVisibilityFragment},
  ${logoMarqueeFragment},
  ${seoFragment},
  ${pageSectionsFragment}
}`

export const diagnosticLandingPageQuery = `*[_id == "diagnosticLandingPage"][0]{
  title,
  useModularPage,
  ${pageVisibilityFragment},
  ${seoFragment},
  ${pageSectionsFragment}
}`

export const consultingPageQuery = `*[_id == "consultingPage"][0]{
  title,
  useModularPage,
  ${pageVisibilityFragment},
  ${seoFragment},
  ${pageSectionsFragment}
}`

export const termsPageQuery = `*[_id == "termsPage"][0]{
  title,
  intro,
  effectiveDate,
  body,
  ${seoFragment}
}`

export const privacyPageQuery = `*[_id == "privacyPage"][0]{
  title,
  intro,
  effectiveDate,
  legalNotice,
  body,
  ${seoFragment}
}`

export const networkPartnersPageQuery = `*[_type == "networkPartnersPage"][0]{
  title,
  useModularPage,
  ${pageVisibilityFragment},
  ${seoFragment},
  ${pageSectionsFragment}
}`

export const homePageQuery = `*[_type == "homePage"][0]{
  headlinePrefix,
  subheadline,
  primaryCtaLabel,
  primaryCtaPath,
  secondaryCtaLabel,
  secondaryCtaPath,
  "heroBackgroundVideoUrl": coalesce(heroBackgroundVideo.asset->url, heroBackgroundVideoUrl),
  metricsHeading,
  metricsSubheading,
  metrics[]{ label, value, suffix },
  howItWorksSectionTitle,
  testimonialsTitlePortable,
  whyFeatures[]{ 
    iconKey, 
    title, 
    description, 
    buttonLabel, 
    buttonPath,
    "imageSrc": coalesce(imageSrc, image.asset->url)
  },
  ctaTitle,
  ctaButtonLabel,
  ctaButtonPath,
  "ctaImageUrl": coalesce(ctaImage.asset->url, ctaImageUrl),
  ctaImageAlt,
  testimonials[]{
    name,
    role,
    company,
    quote,
    companyInfo,
    "imageSrc": coalesce(imageSrc, image.asset->url)
  },
  pathsTitle,
  pathsCards[]{
    roleId,
    tagLabel,
    title,
    subtitle,
    "imageSrc": coalesce(imageSrc, image.asset->url),
    imageAlt,
    ctaLabel,
    ctaTo
  },
  ${seoFragment}
}`;

export const aboutPageQuery = `*[_type == "aboutPage"][0]{
  heroHeadlinePortable,
  heroIntro,
  missionTitle,
  missionParagraphs,
  "missionImageSrc": coalesce(missionImage.asset->url, missionImageSrc),
  missionImageAlt,
  valuesTitle,
  valuesSubtitle,
  values[]{ iconKey, title, description },
  teamTitle,
  teamSubtitle,
  team[]{
    name,
    role,
    bio,
    linkedinUrl,
    websiteUrl,
    "imageSrc": coalesce(imageSrc, image.asset->url)
  },
  ctaTitle,
  ctaBody,
  ctaFounderLabel,
  ctaTeamLabel,
  ${seoFragment}
}`;

export const faqPageQuery = `*[_type == "faqPage" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{
  badge,
  title,
  subtitle,
  items[]{ id, question, answer },
  sidebarTitle,
  sidebarBody,
  sidebarCtaLabel,
  sidebarCtaPath,
  bottomTitle,
  bottomBody,
  bottomCtaLabel,
  bottomCtaPath,
  ${seoFragment}
}`;

export const programsLandingQuery = `*[_type == "programsLandingPage"][0]{
  heroTitlePortable,
  heroSubtitle,
  heroPrimaryCtaLabel,
  heroSecondaryCtaLabel,
  programsSectionTitle,
  programsSectionSubtitle,
  ctaTitle,
  ctaBody,
  ctaButtonLabel,
  ctaButtonHref,
  ${seoFragment}
}`;

export const eventsLandingQuery = `*[_type == "eventsLandingPage"][0]{
  heroTitlePortable,
  heroSubtitle,
  ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  ${seoFragment}
}`

const programDetailFields = `
  paymentUrl,
  heroTitle,
  heroDescription,
  heroCtaLabel,
  outcomesTitle,
  outcomesIntro,
  outcomes,
  howItWorksTitle,
  howItWorksIntro,
  pillarsTitle,
  timelineTitle,
  timelineSubtitle,
  pricingBadge,
  pricingAmount,
  pricingDiscountEnabled,
  pricingCompareAmount,
  pricingSubAmount,
  pricingDescription,
  pricingBullets,
  bottomCtaTitle,
  bottomCtaBody,
  bottomCtaButtonLabel,
  bottomContactHref,
  sections[]{
    ...,
    "imageUrl": image.asset->url,
    primaryCta{ label, href, description, badge },
    secondaryCta{ label, href, description, badge },
    cards[]{
      ...,
      "imageUrl": image.asset->url,
      cta{ label, href, description, badge }
    }
  }
`

export const programsQuery = `*[_type == "program" && status != "hidden" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  title,
  "slug": slug.current,
  description,
  deadline,
  "imageSrc": image.asset->url,
  href,
  buttonText,
  waitlistHref,
  status,
  sortOrder,
  ${seoFragment}
}`

export const programBySlugQuery = `*[_type == "program" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  description,
  deadline,
  "imageSrc": image.asset->url,
  href,
  buttonText,
  waitlistHref,
  status,
  sortOrder,
  ${programDetailFields},
  ${seoFragment}
}`

export const eventsQuery = `*[_type == "event" && status != "hidden" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  title,
  "slug": slug.current,
  startsAt,
  endsAt,
  dateTime,
  person,
  "imageSrc": image.asset->url,
  href,
  comingSoon,
  buttonText,
  location,
  lumaEventId,
  eventDescription,
  "detailBody": coalesce(eventDescription, detailBody),
  detailBodyHeading,
  embedLumaOnDetailPage,
  addToCalendarEnabled,
  status,
  sortOrder
}`

export const eventBySlugQuery = `*[_type == "event" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  startsAt,
  endsAt,
  dateTime,
  person,
  "imageSrc": image.asset->url,
  href,
  comingSoon,
  buttonText,
  location,
  lumaEventId,
  eventDescription,
  "detailBody": coalesce(eventDescription, detailBody),
  detailBodyHeading,
  embedLumaOnDetailPage,
  addToCalendarEnabled,
  status,
  sortOrder,
  ${seoFragment}
}`

export const contactPageQuery = `*[_type == "contactPage"][0]{
  heroBadge,
  pageTitle,
  intro,
  "sideImageSrc": coalesce(sideImage.asset->url, sideImageSrc),
  sideImageAlt,
  quoteText,
  quoteAttributionName,
  quoteAttributionRole,
  successTitle,
  successBody,
  labels,
  placeholders,
  subjectPlaceholder,
  companySizePlaceholder,
  subjectOptions[]{ value, label },
  companySizeOptions[]{ value, label },
  submitLabel,
  sendingLabel,
  ${seoFragment}
}`;

export const notFoundQuery = `*[_type == "notFoundPage"][0]{
  title,
  message,
  ctaLabel,
  ${seoFragment}
}`;

export const applyPageQuery = `*[_type == "applyPage"][0]{
  headingTitle,
  subheading,
  steps[]{ title, description },
  showRoleLinks,
  applyButtonLabel,
  bottomCtaTitle,
  bottomCtaBody,
  bottomCtaPrimaryLabel,
  bottomCtaPrimaryHref,
  bottomCtaSecondaryLabel,
  bottomCtaSecondaryHref,
  ${seoFragment}
}`

export const diagnosticSurveyContentQuery = `*[_type == "diagnosticSurveyContent"][0]{
  sections[]{
    id,
    icon,
    title,
    desc,
    questions[]{
      text,
      type,
      options[]{ label, desc, score }
    }
  }
}`

export const paymentPageQuery = `*[_type == "paymentPage"][0]{
  badge,
  headline,
  introCheckout,
  introFallback,
  introFallbackError,
  benefitsTitle,
  benefits,
  successTitle,
  successBody,
  discountBannerEnabled,
  discountBannerBadge,
  discountBannerTitle,
  discountBannerSubtitle,
  discountBannerApplyLabel,
  discountBannerApplyHref,
  heroHeadlinePortable,
  heroSubheadline,
  imageCardBadge,
  imageCardHeadlinePortable,
  "imageCardSrc": coalesce(imageCardImage.asset->url, imageCardSrc),
  imageCardAlt,
  highlightBenefits,
  pricingMonthlyBadge,
  pricingAnnualBadge,
  pricingMonthlyAmount,
  pricingAnnualAmount,
  pricingMonthlyDiscountEnabled,
  pricingMonthlyCompareAmount,
  pricingAnnualDiscountEnabled,
  pricingAnnualCompareAmount,
  benefitsPanelHeadline,
  choosePlanHeadline,
  promoPillEnabled,
  promoMessage,
  pricingPerSuffix,
  popularLabel,
  monthlyProceedLabel,
  annualProceedLabel,
  questionsTitle,
  questionsFaqLabel,
  questionsFaqPath,
  questionsContactLabel,
  questionsContactPath,
  ${seoFragment}
}`;

export const careersPageQuery = `*[_type == "careersPage"][0]{
  defaultTab,
  enableHiringTab,
  enableVolunteerTab,
  tabsLabelHiring,
  tabsLabelVolunteer,
  publishOpenRolesOnProduction,
  showHiringNavBadge,
  showVolunteerNavBadge,
  openRoles[]{
    "id": roleId,
    title,
    location,
    employmentType,
    description,
    responsibilities,
    linkedInApplyUrl
  },
  ${seoFragment}
}`

export const advisorsQuery = `*[_type == "advisor" && !(_id in path("drafts.**"))]{
  "id": slug.current,
  name,
  organization,
  role,
  location,
  country,
  yearJoined,
  industries,
  focus,
  "filter": filter->label,
  directoryFilters[]{
    "groupId": group->slug.current,
    "groupTitle": group->title,
    "groupAppliesTo": group->appliesTo,
    "groupSortOrder": group->sortOrder,
    values
  },
  "photoSrc": coalesce(photo.asset->url, photoSrc),
  linkedInUrl,
  websiteUrl,
  bio,
  mentoringStyle,
  highlights
}`;

export const alumniCompaniesQuery = `*[_type == "alumniCompany" && !(_id in path("drafts.**"))]{
  "id": slug.current,
  name,
  slug,
  tagline,
  "specialties": specialties[]->label,
  businessModel,
  directoryFilters[]{
    "groupId": group->slug.current,
    "groupTitle": group->title,
    "groupAppliesTo": group->appliesTo,
    "groupSortOrder": group->sortOrder,
    values
  },
  shortDescription,
  longDescription,
  profileBody,
  websiteUrl,
  linkedinUrl,
  traction,
  relliaCollaboration,
  country,
  yearJoined,
  "logoSrc": coalesce(logo.asset->url, logoSrc),
  founders[]{
    name,
    role,
    bio,
    linkedinUrl,
    "imageSrc": image.asset->url
  }
}`;

export const advisorFiltersQuery = `*[_type == "advisorFilter"] | order(sortOrder asc, label asc){
  "id": slug.current,
  label,
  sortOrder
}`

export const founderLevelsQuery = `*[_type == "founderLevel"] | order(sortOrder asc, label asc){
  "id": slug.current,
  label,
  sortOrder
}`

export const founderSpecialtiesQuery = `*[_type == "founderSpecialty"] | order(sortOrder asc, label asc){
  "id": slug.current,
  label,
  sortOrder
}`

export const directoryFilterGroupsQuery = `*[_type == "directoryFilterGroup"] | order(sortOrder asc, title asc){
  "id": slug.current,
  title,
  appliesTo,
  sortOrder,
  options[]{ label }
}`

export const sanityDraftsQuery = `*[
  _id in path("drafts.**")
  && !(_type match "sanity.*")
  && _type != "system.schema"
] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, name, headline, slug.current, _type),
  _updatedAt
}[0...24]`

/** Published documents recently edited in this dataset (preview-only pages show here after publish). */
export const sanityRecentEditsQuery = `*[
  !(_id in path("drafts.**"))
  && !(_type match "sanity.*")
  && _type != "system.schema"
] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, name, headline, slug.current, _type),
  _updatedAt
}[0...16]`
