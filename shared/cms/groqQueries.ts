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

const networkHeroFragment = `heroEyebrow,
  "heroTitlePortable": coalesce(heroTitlePortable, heroHeadlinePortable),
  heroSubtitle,
  "heroImageSrc": coalesce(heroImage.asset->url, heroImageUrl),
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  heroSecondaryCtaLabel,
  heroSecondaryCtaHref`

const networkEngageFragment = `engageTitle,
  engageSubtitle,
  engageItems[]{ title, body, href, linkLabel, iconKey }`

const networkWhyFragment = `whyTitle,
  whyDescription,
  whyFeatures[]{ title, body, iconKey, buttonLabel, buttonPath, "imageSrc": coalesce(image.asset->url, imageSrc) }`

const networkCtaFragment = `ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref`

export const globalSettingsQuery = `*[_id == "globalSettings"][0]{
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
  priorityModalSecondaryButtonLabel,
  priorityModalSecondaryButtonLink,
  "priorityModalImageUrl": priorityModalImage.asset->url,
  "priorityModalImageAlt": priorityModalImage.alt,
  priorityModalFormEnabled,
  priorityModalFormButtonLabel,
  priorityModalFormPlaceholderName,
  priorityModalFormPlaceholderEmail
}`;

export const navigationQuery = `*[_id == "navigation"][0]{
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

export const siteSettingsQuery = `*[_id == "siteSettings"][0]{
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

export const storiesPageQuery = `*[_id == "storiesPage"][0]{
  headlinePortable,
  subheadline,
  ${seoFragment}
}`

const portableRichTextBlocksFragment = `[]{
  ...,
  _type == "image" => {
    ...,
    "url": asset->url,
    displayMode
  },
  _type == "eventDetailInlineImage" => {
    ...,
    displayMode
  },
  _type == "portableImageCarousel" => {
    ...,
    slides[]{
      alt,
      caption,
      displayMode,
      "imageSrc": coalesce(image.asset->url, imageSrc)
    }
  }
}`

const portableRichTextBodyFragment = `body${portableRichTextBlocksFragment}`

/** Lightweight story rows for Vite prerender build snapshots (no body). */
export const storiesPrerenderSnapshotQuery = `*[_type == "story" && !(_id in path("drafts.**"))]{
  title,
  "slug": slug.current,
  excerpt,
  "coverImageSrc": headerImage.asset->url,
  "coverImageAlt": headerImageAlt,
  "tag": filters[0]->title,
  publishedAt,
  featured,
  headerLayout,
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
  headerLayout,
  body${portableRichTextBlocksFragment},
  ${seoFragment}
}`

const pageSectionFieldsFragment = `...,
  "imageUrl": coalesce(image.asset->url, imageUrl),
  "panelImageUrl": coalesce(panelImage.asset->url, panelImageUrl),
  primaryCta{ label, href, description, badge, openInNewTab },
  secondaryCta{ label, href, description, badge, openInNewTab },
  cta{ label, actionType, href, filloutFormUrl },
  metrics[]{ label, value, suffix },
  steps[]{ title, description },
  roleLinks[]{ title, description, href },
  cards[]{
    ...,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    cta{ label, href, description, badge }
  },
  items[]{
    ...,
    question,
    answer,
    link{ label, href, description, badge },
    "imageUrl": coalesce(image.asset->url, imageUrl)
  },
  ${portableRichTextBodyFragment},
  leftColumn{
    title,
    body,
    steps[]{ id, label, detail, icon }
  },
  rightColumn{
    title,
    body,
    steps[]{ id, label, detail, icon }
  },
  testimonials[]{
    quote,
    name,
    role,
    company,
    "image": coalesce(image.asset->url, imageSrc)
  }`

export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug && slug.current != "terms" && slug.current != "privacy" && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  ${seoFragment},
  sections[]{ ${pageSectionFieldsFragment} },
  pageBuilder[]{ ${pageSectionFieldsFragment} }
}`

const pageSectionsFragment = `sections[]{ ${pageSectionFieldsFragment} }`

export const networkFoundersPageQuery = `*[_id == "networkFoundersPage"][0]{
  title,
  ${networkHeroFragment},
  eligibilityTitle,
  eligibilityDescription,
  eligibilityItems[]{ text, "imageUrl": coalesce(image.asset->url, imageUrl) },
  ${networkEngageFragment},
  ${networkWhyFragment},
  journeyTitle,
  journeySubtitle,
  journeySteps[]{ id, label, zone, detail },
  exploreTitle,
  exploreSubtitle,
  exploreCards[]{ title, badge, "imageUrl": coalesce(image.asset->url, imageUrl), ctaLabel, ctaHref },
  deeperHelpTitle,
  deeperHelpSubtitle,
  deeperHelpFeatures[]{ title, body, iconKey },
  deeperHelpCtaLabel,
  deeperHelpCtaHref,
  ${networkCtaFragment},
  ${logoMarqueeFragment},
  ${seoFragment}
}`

export const networkAlumniDirectoryPageQuery = `*[_id == "networkAlumniDirectoryPage"][0]{
  directoryTitle,
  directorySubtitle,
  directoryCtaTitle,
  directoryCtaBody,
  directoryCtaPrimaryLabel,
  directoryCtaPrimaryHref,
  ${seoFragment}
}`

export const networkAdvisorsDirectoryPageQuery = `*[_id == "networkAdvisorsDirectoryPage"][0]{
  directoryTitle,
  directorySubtitle,
  directoryCtaTitle,
  directoryCtaBody,
  directoryCtaPrimaryLabel,
  directoryCtaPrimaryHref,
  ${seoFragment}
}`

export const networkInvestorsPageQuery = `*[_id == "networkInvestorsPage"][0]{
  title,
  ${networkHeroFragment},
  ${networkEngageFragment},
  scheduleTitle,
  scheduleItems[]{ title, body, iconKey },
  benefitsTitle,
  benefitsDescription,
  benefitsBullets,
  ${networkWhyFragment},
  ${networkCtaFragment},
  ${seoFragment}
}`

export const networkAdvisorsPageQuery = `*[_id == "networkAdvisorsPage"][0]{
  title,
  ${networkHeroFragment},
  ${networkWhyFragment},
  pitchTitle,
  pitchSubtitle,
  pitchCards[]{ title, body, imageUrl },
  ${networkCtaFragment},
  ${logoMarqueeFragment},
  ${seoFragment},
  foundersCluster[]{
    title,
    segments[]{
      name,
      value
    }
  }
}`

export const networkPartnersPageQuery = `*[_id == "networkPartnersPage"][0]{
  title,
  ${networkHeroFragment},
  ${networkEngageFragment},
  benefitsTitle,
  benefitsDescription,
  benefitsBullets,
  directoryTitle,
  directoryDescription,
  directoryBullets,
  ${networkWhyFragment},
  ${networkCtaFragment},
  ${seoFragment}
}`

const landingTestimonialsFragment = `testimonials[]{
  quote,
  name,
  role,
  company,
  "image": coalesce(image.asset->url, imageSrc)
}`

export const diagnosticLandingPageQuery = `*[_id == "diagnosticLandingPage"][0]{
  title,
  heroBadgeLabel,
  "heroTitlePortable": coalesce(heroTitlePortable, heroHeadlinePortable),
  heroSubtitle,
  "heroImageSrc": coalesce(heroImage.asset->url, heroImageUrl),
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  readinessTitle,
  readinessDescription,
  readinessFeatures[]{
    title,
    description,
    buttonLabel,
    buttonPath,
    "imageSrc": coalesce(image.asset->url, imageSrc)
  },
  infographicTitle,
  infographicBody,
  infographicTopWeaknessLabel,
  infographicTopWeaknessScore,
  infographicGapLabel,
  infographicAdvisorMatchLabel,
  infographicAdvisorRole,
  infographicAdvisorSubtitle,
  infographicBlobRoadmap,
  infographicBlobAdvisors,
  infographicBlobBlindSpot,
  timelineTitle,
  timelineSubheading,
  timelineSteps[]{ title, description, weekLabel },
  ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  ${seoFragment}
}`

export const consultingPageQuery = `*[_id == "consultingPage"][0]{
  title,
  heroEyebrow,
  "heroTitlePortable": coalesce(heroTitlePortable, heroHeadlinePortable),
  heroSubtitle,
  "heroImageSrc": coalesce(heroImage.asset->url, heroImageUrl),
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  heroSecondaryCtaLabel,
  heroSecondaryCtaHref,
  fitTitle,
  fitDescription,
  fitBullets,
  "fitImageSrc": coalesce(fitImageUrl, fitImage.asset->url),
  servicesTitle,
  servicesSubtitle,
  services[]{ title, body, ctaLabel, iconKey },
  testimonialsTitle,
  ${landingTestimonialsFragment},
  membershipTitle,
  membershipDescription,
  membershipStats[]{ label, value },
  membershipSavingsTitle,
  membershipSavingsBody,
  membershipPrimaryCtaLabel,
  membershipPrimaryCtaHref,
  membershipSecondaryCtaLabel,
  membershipSecondaryCtaHref,
  ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  ${seoFragment}
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

export const homePageQuery = `*[_id == "homePage"][0]{
  headlinePrefix,
  subheadline,
  primaryCtaLabel,
  primaryCtaPath,
  secondaryCtaLabel,
  secondaryCtaPath,
  "heroBackgroundVideoUrl": coalesce(heroBackgroundVideo.asset->url, heroBackgroundVideoUrl),
  showBadge,
  metricsBadgeLabel,
  metricsHeadingPortable,
  "metricsBackgroundImageUrl": coalesce(metricsBackgroundImage.asset->url, metricsBackgroundImageUrl),
  metrics[]{ label, value, suffix },
  howItWorksSectionTitle,
  howItWorksSectionDescription,
  howItWorksSteps[]{ iconKey, title, description },
  whySectionTitle,
  whySectionDescription,
  testimonialsTitlePortable,
  whyFeatures[]{ 
    iconKey, 
    title, 
    description, 
    buttonLabel, 
    buttonPath,
    "imageSrc": coalesce(image.asset->url, imageSrc)
  },
  ctaTitle,
  ctaButtonLabel,
  ctaButtonPath,
  ctaSecondaryButtonLabel,
  ctaSecondaryButtonPath,
  testimonials[]{
    name,
    role,
    company,
    quote,
    companyInfo,
    "imageSrc": coalesce(image.asset->url, imageSrc)
  },
  pathsTitle,
  pathsCards[]{
    roleId,
    tagLabel,
    title,
    subtitle,
    "imageSrc": coalesce(image.asset->url, imageSrc),
    imageAlt,
    ctaLabel,
    ctaTo
  },
  ${seoFragment}
}`;

export const aboutPageQuery = `*[_id == "aboutPage"][0]{
  "heroTitlePortable": coalesce(heroTitlePortable, heroHeadlinePortable),
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
    socialLinks[]{ platform, label, url },
    "imageSrc": coalesce(image.asset->url, imageSrc)
  },
  ctaTitle,
  ctaBody,
  ctaFounderLabel,
  ctaTeamLabel,
  ${seoFragment}
}`;

export const faqPageQuery = `*[_id == "faqPage"][0]{
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

export const programsLandingQuery = `*[_id == "programsLandingPage"][0]{
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

export const programsLayoutPageQuery = `*[_id == "programsLayoutPage"][0]{
  title,
  ${seoFragment},
  ${pageSectionsFragment}
}`;

export const eventsLandingQuery = `*[_id == "eventsLandingPage"][0]{
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
  howItWorksCards[]{
    title,
    description,
    "imageSrc": image.asset->url
  },
  pillarsTitle,
  pillars[]{ title, description },
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
  timelineSteps[]{ title, description, weekLabel },
  ${landingTestimonialsFragment},
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
  "hostImageSrc": hostImage.asset->url,
  href,
  buttonText,
  location,
  lumaEventId,
  ticketingUrl,
  customLinkButton{ buttonText, url },
  eventDescription,
  "detailBody": coalesce(eventDescription, detailBody)${portableRichTextBlocksFragment},
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
  "hostImageSrc": hostImage.asset->url,
  href,
  buttonText,
  location,
  lumaEventId,
  ticketingUrl,
  customLinkButton{ buttonText, url },
  eventDescription,
  "detailBody": coalesce(eventDescription, detailBody)${portableRichTextBlocksFragment},
  detailBodyHeading,
  embedLumaOnDetailPage,
  addToCalendarEnabled,
  status,
  sortOrder,
  ${seoFragment}
}`

export const contactPageQuery = `*[_id == "contactPage"][0]{
  "sideImageSrc": coalesce(sideImage.asset->url, sideImageSrc),
  sideImageAlt,
  "leftLogoImageSrc": coalesce(leftLogoImage.asset->url, leftLogoImageSrc),
  quoteText,
  "quotePersonImageSrc": coalesce(quotePersonImage.asset->url, quotePersonImageSrc),
  quoteAttributionName,
  quoteAttributionRole,
  footerEmail,
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

export const notFoundQuery = `*[_id == "notFoundPage"][0]{
  title,
  message,
  ctaLabel,
  ${seoFragment}
}`;

export const applyPageQuery = `*[_id == "applyPage"][0]{
  headingTitle,
  subheading,
  steps[]{ title, description },
  showRoleLinks,
  roleLinks[]{ title, description, href },
  applyButtonLabel,
  bottomCtaTitle,
  bottomCtaBody,
  bottomCtaPrimaryLabel,
  bottomCtaPrimaryHref,
  bottomCtaSecondaryLabel,
  bottomCtaSecondaryHref,
  ${seoFragment}
}`

export const diagnosticSurveyContentQuery = `*[_id == "diagnosticSurveyContent"][0]{
  introTitle,
  introSubtitle,
  stages,
  introJourneyTitle,
  introJourneySteps[]{
    title,
    description,
    icon
  },
  introWhatYouGetTitle,
  introWhatYouGetBullets,
  introStartupDetailsTitle,
  introStartButtonLabel,
  submitTitle,
  submitSubtitle,
  submitProfileTitle,
  submitGeneratingTitle,
  submitGeneratingBody,
  submitGeneratingBullets,
  submitDetailsTitle,
  submitConfirmButtonLabel,
  processingTitle,
  processingSubtitle,
  processingSteps,
  reportHeaderThankYou,
  reportStrengthsTitle,
  reportGapsTitle,
  reportRoadmapTitle,
  reportFullBreakdownTitle,
  reportProgramsTitle,
  reportAdvisorsTitle,
  reportMembershipCtaTitle,
  reportMembershipCtaBody,
  reportMembershipCtaButton,
  "reportMembershipCtaImageSrc": reportMembershipCtaImage.asset->url,
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

export const paymentPageQuery = `*[_id == "paymentPage"][0]{
  ${pageVisibilityFragment},
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
  "heroTitlePortable": coalesce(heroTitlePortable, heroHeadlinePortable),
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
  promoMessage,
  pricingPerSuffix,
  popularLabel,
  monthlyProceedLabel,
  annualProceedLabel,
  questionsTitle,
  questionsBody,
  questionsFaqLabel,
  questionsFaqPath,
  questionsContactLabel,
  questionsContactPath,
  welcomeSplashEnabled,
  welcomeSplashHeading,
  welcomeSplashSubheading,
  welcomeSplashBackgroundSrc,
  welcomeSplashLogoSrc,
  welcomeSplashDurationSeconds,
  ${seoFragment}
}`;

export const openRolesQuery = `*[_type == "openRole" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  "id": roleId.current,
  title,
  location,
  employmentType,
  description,
  responsibilities,
  linkedInApplyUrl
}`

export const careersPageQuery = `*[_id == "careersPage"][0]{
  careersContentMode,
  showHiringNavBadge,
  showVolunteerNavBadge,
  ${networkHeroFragment},
  heroTitleSuffix,
  ${networkWhyFragment},
  perksTitle,
  perksDescription,
  perksItems[]{ title, body, iconKey },
  openRolesTitle,
  ${networkCtaFragment},
  lifeAtRelliaHeading,
  lifeAtRelliaSubheading,
  lifeAtRelliaImages[]{
    "src": asset->url,
    alt
  },
  lifeAtRelliaLinks[]{
    platformName,
    url,
    iconKey,
    tooltip
  },
  ${seoFragment}
}`

export const advisorsQuery = `*[_type == "advisor" && !(_id in path("drafts.**"))]{
  "id": slug.current,
  name,
  organization,
  role,
  yearJoined,
  industries,
  snapshot,
  directoryFilters[]{
    "groupId": group->slug.current,
    "groupTitle": group->title,
    "groupAppliesTo": group->appliesTo,
    "groupSortOrder": group->sortOrder,
    values
  },
  "countries": coalesce(
    directoryFilters[
      group->slug.current in ["country", "countries"] ||
      group->title match "Countr*"
    ][0].values,
    country,
    []
  ),
  "expertiseTags": coalesce(
    directoryFilters[
      group->slug.current match "expertise" ||
      group->title match "Expertise" ||
      group->title match "Specialt*"
    ][0].values,
    select(defined(primaryExpertise) => [primaryExpertise], []),
    select(defined(filter) => [filter], []),
    []
  ),
  "photoSrc": coalesce(photo.asset->url, photoSrc),
  email,
  socialLinks[]{ platform, label, url },
  bio${portableRichTextBlocksFragment}
}`;

export const alumniCompaniesQuery = `*[_type == "alumniCompany" && !(_id in path("drafts.**"))]{
  "id": slug.current,
  name,
  slug,
  tagline,
  directoryFilters[]{
    "groupId": group->slug.current,
    "groupTitle": group->title,
    "groupAppliesTo": group->appliesTo,
    "groupSortOrder": group->sortOrder,
    values
  },
  "countries": coalesce(
    directoryFilters[
      group->slug.current in ["country", "countries"] ||
      group->title match "Countr*"
    ][0].values,
    country,
    []
  ),
  "specialtyTags": coalesce(
    directoryFilters[
      group->slug.current in ["specialty", "specialties"] ||
      group->title match "Specialt*"
    ][0].values,
    specialties,
    []
  ),
  "businessModels": coalesce(
    directoryFilters[
      group->slug.current match "business-model" ||
      group->title match "Business Model*"
    ][0].values,
    businessModel,
    []
  ),
  shortDescription,
  profileBody${portableRichTextBlocksFragment},
  socialLinks[]{ platform, label, url },
  email,
  yearJoined,
  "logoSrc": coalesce(logo.asset->url, logoSrc),
  founders[]{
    name,
    role,
    bio,
    email,
    socialLinks[]{ platform, label, url },
    "imageSrc": coalesce(image.asset->url, imageSrc)
  }
}`;

export const directoryFilterGroupsQuery = `*[_type == "directoryFilterGroup" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
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
