var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/cms/groqQueries.ts
var seoFragment, pageVisibilityFragment, logoMarqueeFragment, networkHeroFragment, networkEngageFragment, networkWhyFragment, networkCtaFragment, globalSettingsQuery, navigationQuery, siteSettingsQuery, featuredStoriesQuery, storiesQuery, storiesPageQuery, portableRichTextBlocksFragment, portableRichTextBodyFragment, storiesPrerenderSnapshotQuery, storyBySlugQuery, pageSectionFieldsFragment, pageBySlugQuery, pagesPrerenderSnapshotQuery, pageSectionsFragment, networkFoundersPageQuery, networkAlumniDirectoryPageQuery, networkAdvisorsDirectoryPageQuery, networkInvestorsPageQuery, networkAdvisorsPageQuery, networkPartnersPageQuery, landingTestimonialsFragment, diagnosticLandingPageQuery, consultingPageQuery, termsPageQuery, privacyPageQuery, homePageQuery, aboutPageQuery, faqPageQuery, programsLandingQuery, programsLayoutPageQuery, eventsLandingQuery, programDetailFields, programsQuery, programBySlugQuery, eventsQuery, eventBySlugQuery, contactPageQuery, notFoundQuery, applyPageQuery, diagnosticSurveyContentQuery, paymentPageQuery, openRolesQuery, careersPageQuery, advisorsQuery, alumniCompaniesQuery, directoryFilterGroupsQuery, sanityDraftsQuery, sanityRecentEditsQuery;
var init_groqQueries = __esm({
  "shared/cms/groqQueries.ts"() {
    seoFragment = `seo{
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
}`;
    pageVisibilityFragment = `pageVisibility,
  placeholderTitle,
  placeholderMessage,
  placeholderCtaLabel,
  placeholderCtaHref`;
    logoMarqueeFragment = `logoMarquee[]{ _key,
  name,
  "src": logo.asset->url,
  href
}`;
    networkHeroFragment = `heroEyebrow,
  "heroTitlePortable": coalesce(heroTitlePortable, heroHeadlinePortable),
  heroSubtitle,
  "heroImageSrc": coalesce(heroImage.asset->url, heroImageUrl),
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  heroSecondaryCtaLabel,
  heroSecondaryCtaHref`;
    networkEngageFragment = `engageTitle,
  engageSubtitle,
  engageItems[]{ _key, title, body, href, linkLabel, iconKey }`;
    networkWhyFragment = `whyTitle,
  whyDescription,
  whyFeatures[]{ _key, title, body, iconKey, buttonLabel, buttonPath, "imageSrc": coalesce(image.asset->url, imageSrc) }`;
    networkCtaFragment = `ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref`;
    globalSettingsQuery = `*[_id == "globalSettings"][0]{
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
    navigationQuery = `*[_id == "navigation"][0]{
  primary[]{ _key,
    label,
    href,
    description,
    badge,
    children[]{ _key,
      label,
      href,
      description,
      badge,
      children[]{ _key,
        label,
        href,
        description,
        badge
      }
    }
  },
  footer[]{ _key,
    label,
    href,
    description,
    badge,
    children[]{ _key,
      label,
      href,
      description,
      badge,
      children[]{ _key,
        label,
        href,
        description,
        badge
      }
    }
  }
}`;
    siteSettingsQuery = `*[_id == "siteSettings"][0]{
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
}`;
    featuredStoriesQuery = `*[_type == "story" && featured == true && !(_id in path("drafts.**"))]
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
}`;
    storiesQuery = `*[_type == "story" && !(_id in path("drafts.**"))]
| order(publishedAt desc, _updatedAt desc){
  title,
  "slug": slug.current,
  excerpt,
  "coverImageSrc": headerImage.asset->url,
  "coverImageAlt": headerImageAlt,
  "tag": filters[0]->title,
  publishedAt,
  featured,
  ${seoFragment}
}`;
    storiesPageQuery = `*[_id == "storiesPage"][0]{
  headlinePortable,
  subheadline,
  hideStoryPublishDates,
  defaultAuthorName,
  defaultAuthorDescription,
  "defaultAuthorImageSrc": defaultAuthorImage.asset->url,
  relatedSectionTitle,
  relatedSectionSubheadline,
  relatedSectionEnabled,
  ${seoFragment}
}`;
    portableRichTextBlocksFragment = `[]{
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
    slides[]{ _key,
      alt,
      caption,
      displayMode,
      "imageSrc": coalesce(image.asset->url, imageSrc)
    }
  },
  _type == "portableQuoteBox" => {
    ...,
    "imageSrc": coalesce(image.asset->url, imageSrc)
  },
  _type == "portableTable" => {
    ...,
    rows[]{ _key, cells[] }
  }
}`;
    portableRichTextBodyFragment = `body${portableRichTextBlocksFragment}`;
    storiesPrerenderSnapshotQuery = `*[_type == "story" && !(_id in path("drafts.**"))]{
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
}`;
    storyBySlugQuery = `*[_type == "story" && (slug.current == $slug || $slug in coalesce(previousSlugs, [])) && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  excerpt,
  "coverImageSrc": headerImage.asset->url,
  "coverImageAlt": headerImageAlt,
  "tag": filters[0]->title,
  publishedAt,
  hidePublishDate,
  authorName,
  authorDescription,
  "authorImageSrc": authorImage.asset->url,
  featured,
  headerLayout,
  body${portableRichTextBlocksFragment},
  ${seoFragment}
}`;
    pageSectionFieldsFragment = `...,
  "imageUrl": coalesce(image.asset->url, imageUrl),
  "panelImageUrl": coalesce(panelImage.asset->url, panelImageUrl),
  primaryCta{ label, href, description, badge, openInNewTab },
  secondaryCta{ label, href, description, badge, openInNewTab },
  cta{ label, actionType, href, filloutFormUrl },
  metrics[]{ _key, label, "value": string(value), suffix, iconKey },
  steps[]{ _key, title, description },
  roleLinks[]{ _key, title, description, href },
  cards[]{ _key,
    ...,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    cta{ label, href, description, badge }
  },
  items[]{ _key,
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
    steps[]{ _key, id, label, detail, icon }
  },
  rightColumn{
    title,
    body,
    steps[]{ _key, id, label, detail, icon }
  },
  testimonials[]{ _key,
    quote,
    name,
    role,
    company,
    "image": coalesce(image.asset->url, imageSrc)
  }`;
    pageBySlugQuery = `*[_type == "page" && slug.current == $slug && slug.current != "terms" && slug.current != "privacy" && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  ${seoFragment},
  sections[]{ _key, ${pageSectionFieldsFragment} }
}`;
    pagesPrerenderSnapshotQuery = `*[_type == "page" && defined(slug.current) && slug.current != "terms" && slug.current != "privacy" && !(_id in path("drafts.**"))]{
  title,
  "slug": slug.current,
  ${pageVisibilityFragment},
  ${seoFragment},
  sections[]{ _key, ${pageSectionFieldsFragment} }
}`;
    pageSectionsFragment = `sections[]{ _key, ${pageSectionFieldsFragment} }`;
    networkFoundersPageQuery = `*[_id == "networkFoundersPage"][0]{
  title,
  ${networkHeroFragment},
  eligibilityTitle,
  eligibilityDescription,
  eligibilityItems[]{ _key, text, "imageUrl": coalesce(image.asset->url, imageUrl) },
  ${networkEngageFragment},
  ${networkWhyFragment},
  showJourneySection,
  journeyTitle,
  journeyHelpBadge,
  journeyHelpHeading,
  journeySteps[]{ _key, id, label, zone, detail, iconKey },
  exploreTitle,
  exploreSubtitle,
  exploreCards[]{ _key, title, badge, "imageUrl": coalesce(image.asset->url, imageUrl), ctaLabel, ctaHref },
  deeperHelpTitle,
  deeperHelpSubtitle,
  deeperHelpFeatures[]{ _key, title, body, iconKey },
  deeperHelpCtaLabel,
  deeperHelpCtaHref,
  membershipPathTitle,
  membershipPathSubtitle,
  membershipPathSteps[]{ _key, title, description },
  "deeperHelpBackgroundImageSrc": coalesce(deeperHelpBackgroundImage.asset->url, deeperHelpBackgroundImageUrl),
  ${networkCtaFragment},
  ${logoMarqueeFragment},
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    networkAlumniDirectoryPageQuery = `*[_id == "networkAlumniDirectoryPage"][0]{
  directoryTitle,
  directorySubtitle,
  relatedSectionTitle,
  relatedSectionSubheadline,
  relatedSectionEnabled,
  directoryCtaTitle,
  directoryCtaBody,
  directoryCtaPrimaryLabel,
  directoryCtaPrimaryHref,
  directoryCtaSecondaryLabel,
  directoryCtaSecondaryHref,
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    networkAdvisorsDirectoryPageQuery = `*[_id == "networkAdvisorsDirectoryPage"][0]{
  directoryTitle,
  directorySubtitle,
  relatedSectionTitle,
  relatedSectionSubheadline,
  relatedSectionEnabled,
  directoryCtaTitle,
  directoryCtaBody,
  directoryCtaPrimaryLabel,
  directoryCtaPrimaryHref,
  directoryCtaSecondaryLabel,
  directoryCtaSecondaryHref,
  ${seoFragment}
}`;
    networkInvestorsPageQuery = `*[_id == "networkInvestorsPage"][0]{
  title,
  ${networkHeroFragment},
  ${networkEngageFragment},
  scheduleTitle,
  scheduleItems[]{ _key, title, body, iconKey },
  benefitsTitle,
  benefitsDescription,
  benefitsBullets,
  ${networkWhyFragment},
  pitchTitle,
  pitchSubtitle,
  pitchCards[]{ _key, title, body, imageUrl },
  foundersClusterTitle,
  foundersClusterSubtitle,
  foundersClusterDisclaimer,
  foundersCluster[]{ _key,
    title,
    segments[]{ _key,
      name,
      value
    }
  },
  ${networkCtaFragment},
  ${logoMarqueeFragment},
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    networkAdvisorsPageQuery = `*[_id == "networkAdvisorsPage"][0]{
  title,
  ${networkHeroFragment},
  ${networkWhyFragment},
  pitchTitle,
  pitchSubtitle,
  pitchCards[]{ _key, title, body, imageUrl },
  ${networkCtaFragment},
  ${logoMarqueeFragment},
  ${pageSectionsFragment},
  ${seoFragment},
  foundersCluster[]{ _key,
    title,
    segments[]{ _key,
      name,
      value
    }
  }
}`;
    networkPartnersPageQuery = `*[_id == "networkPartnersPage"][0]{
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
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    landingTestimonialsFragment = `testimonials[]{ _key,
  quote,
  name,
  role,
  company,
  "image": coalesce(image.asset->url, imageSrc)
}`;
    diagnosticLandingPageQuery = `*[_id == "diagnosticLandingPage"][0]{
  title,
  heroBadgeLabel,
  "heroTitlePortable": coalesce(heroTitlePortable, heroHeadlinePortable),
  heroSubtitle,
  "heroImageSrc": coalesce(heroImage.asset->url, heroImageUrl),
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  readinessTitle,
  readinessDescription,
  readinessFeatures[]{ _key,
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
  timelineSteps[]{ _key, title, description, weekLabel },
  ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    consultingPageQuery = `*[_id == "consultingPage"][0]{
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
  services[]{ _key, title, body, ctaLabel, iconKey },
  testimonialsTitle,
  ${landingTestimonialsFragment},
  membershipTitle,
  membershipDescription,
  membershipStats[]{ _key, label, value },
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
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    termsPageQuery = `*[_id == "termsPage"][0]{
  title,
  intro,
  effectiveDate,
  body,
  ${seoFragment}
}`;
    privacyPageQuery = `*[_id == "privacyPage"][0]{
  title,
  intro,
  effectiveDate,
  legalNotice,
  body,
  ${seoFragment}
}`;
    homePageQuery = `*[_id == "homePage"][0]{
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
  metrics[]{ _key, label, "value": string(value), suffix, iconKey },
  howItWorksSectionTitle,
  howItWorksSectionDescription,
  howItWorksSteps[]{ _key, iconKey, title, description },
  whySectionTitle,
  whySectionDescription,
  testimonialsTitlePortable,
  whyFeatures[]{ _key, 
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
  testimonials[]{ _key,
    name,
    role,
    company,
    quote,
    companyInfo,
    "imageSrc": coalesce(image.asset->url, imageSrc)
  },
  ${logoMarqueeFragment},
  pathsTitle,
  pathsCards[]{ _key,
    roleId,
    tagLabel,
    showBadge,
    title,
    subtitle,
    "imageSrc": coalesce(image.asset->url, imageSrc),
    imageAlt,
    ctaLabel,
    ctaTo
  },
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    aboutPageQuery = `*[_id == "aboutPage"][0]{
  heroTitlePortable,
  heroIntro,
  missionTitle,
  missionParagraphs,
  "missionImageSrc": coalesce(missionImage.asset->url, missionImageSrc),
  missionImageAlt,
  showValuesTag,
  valuesTag,
  valuesHeadlinePortable,
  values[]{ _key, iconKey, title, description },
  teamTitle,
  teamSubtitle,
  team[]{ _key,
    name,
    role,
    bio,
    socialLinks[]{ _key, platform, label, url },
    "imageSrc": coalesce(image.asset->url, imageSrc)
  },
  ctaTitle,
  ctaBody,
  ctaFounderLabel,
  ctaFounderHref,
  ctaTeamLabel,
  ctaTeamHref,
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    faqPageQuery = `*[_id == "faqPage"][0]{
  title,
  subtitle,
  items[]{ _key, id, question, answer },
  sidebarTitle,
  sidebarBody,
  sidebarCtaLabel,
  sidebarCtaPath,
  bottomTitle,
  bottomBody,
  bottomCtaLabel,
  bottomCtaPath,
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    programsLandingQuery = `*[_id == "programsLandingPage"][0]{
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
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    programsLayoutPageQuery = `*[_id == "programsLayoutPage"][0]{
  howItWorksTitle,
  howItWorksIntro,
  pillarsTitle,
  pillars[]{ _key, title, description, iconKey },
  timelineTitle,
  timelineSubtitle,
  timelineWeekLabelPrefix,
  relatedSectionTitle,
  relatedSectionSubheadline,
  relatedSectionEnabled,
  ${seoFragment}
}`;
    eventsLandingQuery = `*[_id == "eventsLandingPage"][0]{
  heroTitlePortable,
  heroSubtitle,
  relatedSectionTitle,
  relatedSectionSubheadline,
  relatedSectionEnabled,
  ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    programDetailFields = `
  paymentUrl,
  heroTitle,
  heroDescription,
  heroCtaLabel,
  outcomesTitle,
  outcomesIntro,
  outcomes,
  howItWorksTitle,
  howItWorksIntro,
  howItWorksCards[]{ _key,
    title,
    description,
    "imageSrc": image.asset->url
  },
  pillarsTitle,
  pillars[]{ _key, title, description, iconKey },
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
  timelineSteps[]{ _key, title, stepLabel, weekLabel, description, weeks[]{ _key, heading, points } },
  ${landingTestimonialsFragment},
  sections[]{ _key,
    ...,
    "imageUrl": image.asset->url,
    primaryCta{ label, href, description, badge },
    secondaryCta{ label, href, description, badge },
    cards[]{ _key,
      ...,
      "imageUrl": image.asset->url,
      cta{ label, href, description, badge }
    }
  }
`;
    programsQuery = `*[_type == "program" && status != "hidden" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  title,
  "slug": slug.current,
  description,
  deadline,
  "imageSrc": image.asset->url,
  href,
  buttonText,
  status,
  sortOrder,
  ${seoFragment}
}`;
    programBySlugQuery = `*[_type == "program" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  description,
  deadline,
  "imageSrc": image.asset->url,
  href,
  buttonText,
  status,
  sortOrder,
  ${programDetailFields},
  ${seoFragment}
}`;
    eventsQuery = `*[_type == "event" && status != "hidden" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  title,
  "slug": slug.current,
  startsAt,
  endsAt,
  dateTime,
  person,
  "imageSrc": image.asset->url,
  "hostImageSrc": select(defined(hostImage.asset) => hostImage.asset->url, null),
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
}`;
    eventBySlugQuery = `*[_type == "event" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  startsAt,
  endsAt,
  dateTime,
  person,
  "imageSrc": image.asset->url,
  "hostImageSrc": select(defined(hostImage.asset) => hostImage.asset->url, null),
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
}`;
    contactPageQuery = `*[_id == "contactPage"][0]{
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
  subjectOptions[]{ _key, value, label },
  companySizeOptions[]{ _key, value, label },
  submitLabel,
  sendingLabel,
  ${seoFragment}
}`;
    notFoundQuery = `*[_id == "notFoundPage"][0]{
  title,
  message,
  ctaLabel,
  ctaPath,
  iconKey,
  ${seoFragment}
}`;
    applyPageQuery = `*[_id == "applyPage"][0]{
  headingTitle,
  subheading,
  steps[]{ _key, title, description },
  showRoleLinks,
  roleLinks[]{ _key, title, description, href },
  applyButtonLabel,
  bottomCtaTitle,
  bottomCtaBody,
  bottomCtaPrimaryLabel,
  bottomCtaPrimaryHref,
  bottomCtaSecondaryLabel,
  bottomCtaSecondaryHref,
  ${seoFragment}
}`;
    diagnosticSurveyContentQuery = `*[_id == "diagnosticSurveyContent"][0]{
  introTitle,
  introSubtitle,
  stages,
  introJourneyTitle,
  introJourneySteps[]{ _key,
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
  "reportMembershipCtaImageDisplayMode": reportMembershipCtaImage.displayMode,
  "reportMembershipCtaImageWidth": reportMembershipCtaImage.asset->metadata.dimensions.width,
  "reportMembershipCtaImageHeight": reportMembershipCtaImage.asset->metadata.dimensions.height,
  "reportMembershipCtaImageHotspot": reportMembershipCtaImage.hotspot,
  sections[]{ _key,
    id,
    icon,
    title,
    desc,
    questions[]{ _key,
      text,
      type,
      options[]{ _key, label, desc, score }
    }
  }
}`;
    paymentPageQuery = `*[_id == "paymentPage"][0]{
  welcomeSplashEnabled,
  welcomeSplashHeadingPortable,
  welcomeSplashSubheading,
  "welcomeSplashBackgroundSrc": coalesce(welcomeSplashBackground.asset->url, welcomeSplashBackgroundSrc),
  "welcomeSplashLogoSrc": coalesce(welcomeSplashLogo.asset->url, welcomeSplashLogoSrc),
  welcomeSplashDurationSeconds,
  benefitsPanelHeadline,
  benefitsTitle,
  benefitsPanelDescriptionPortable,
  benefitsPanelImageEnabled,
  "benefitsPanelImageSrc": coalesce(benefitsPanelImage.asset->url, benefitsPanelImageSrc),
  choosePlanHeadline,
  pricingMonthlyAmount,
  pricingAnnualAmount,
  pricingMonthlyDiscountEnabled,
  pricingMonthlyCompareAmount,
  pricingAnnualDiscountEnabled,
  pricingAnnualCompareAmount,
  monthlyProceedLabel,
  annualProceedLabel,
  discountBannerEnabled,
  discountBannerBadge,
  discountBannerSubtitle,
  promoMessage,
  questionsTitle,
  questionsBody,
  questionsContactLabel,
  questionsContactPath,
  questionsFaqLabel,
  questionsFaqPath,
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    openRolesQuery = `*[_type == "openRole" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  "id": roleId.current,
  title,
  location,
  employmentType,
  excerpt,
  description${portableRichTextBlocksFragment},
  responsibilities,
  applyButtonLabel,
  applyButtonUrl,
  roleCtaTitle,
  roleCtaBody,
  roleCtaPrimaryLabel,
  roleCtaPrimaryHref,
  roleCtaSecondaryLabel,
  roleCtaSecondaryHref,
  "linkedInApplyUrl": coalesce(applyButtonUrl, linkedInApplyUrl)
}`;
    careersPageQuery = `*[_id == "careersPage"][0]{
  careersContentMode,
  showHiringNavBadge,
  showVolunteerNavBadge,
  ${networkHeroFragment},
  heroTitleSuffix,
  ${networkWhyFragment},
  perksTitlePortable,
  perksDescription,
  perksItems[]{ _key, title, body, iconKey },
  openRolesTitlePortable,
  openRolesSubtitle,
  ${networkCtaFragment},
  lifeAtRelliaHeadingPortable,
  lifeAtRelliaSubheading,
  lifeAtRelliaImages[]{ _key,
    "src": asset->url,
    alt
  },
  lifeAtRelliaLinks[]{ _key,
    platformName,
    url,
    iconKey,
    tooltip
  },
  ${pageSectionsFragment},
  ${seoFragment}
}`;
    advisorsQuery = `*[_type == "advisor" && !(_id in path("drafts.**"))]{
  "id": slug.current,
  name,
  organization,
  role,
  yearJoined,
  industries,
  snapshot,
  directoryFilters[]{ _key,
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
  socialLinks[]{ _key, platform, label, url },
  bio${portableRichTextBlocksFragment},
  ${seoFragment}
}`;
    alumniCompaniesQuery = `*[_type == "alumniCompany" && !(_id in path("drafts.**"))]{
  "id": slug.current,
  name,
  slug,
  tagline,
  directoryFilters[]{ _key,
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
  socialLinks[]{ _key, platform, label, url },
  email,
  yearJoined,
  "logoSrc": coalesce(logo.asset->url, logoSrc),
  ${seoFragment},
  founders[]{ _key,
    name,
    role,
    bio,
    email,
    socialLinks[]{ _key, platform, label, url },
    "imageSrc": coalesce(image.asset->url, imageSrc)
  }
}`;
    directoryFilterGroupsQuery = `*[_type == "directoryFilterGroup" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  "id": slug.current,
  title,
  appliesTo,
  sortOrder,
  options[]{ _key, label }
}`;
    sanityDraftsQuery = `*[
  _id in path("drafts.**")
  && !(_type match "sanity.*")
  && _type != "system.schema"
] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, name, headline, slug.current, _type),
  "slug": slug.current,
  "roleId": roleId.current,
  _updatedAt
}[0...24]`;
    sanityRecentEditsQuery = `*[
  !(_id in path("drafts.**"))
  && !(_type match "sanity.*")
  && _type != "system.schema"
] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, name, headline, slug.current, _type),
  "slug": slug.current,
  "roleId": roleId.current,
  _updatedAt
}[0...16]`;
  }
});

// shared/cms/sanityEnv.ts
var parseList, resolveSanityApiConfig, isVercelPreviewDeployment, trySanityApiConfig, resolveAdminSanityDataset;
var init_sanityEnv = __esm({
  "shared/cms/sanityEnv.ts"() {
    parseList = (raw) => (raw ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    resolveSanityApiConfig = () => {
      const deployed = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
      const projectId = process.env.SANITY_API_PROJECT_ID?.trim() || process.env.VITE_SANITY_PROJECT_ID?.trim();
      let dataset = process.env.SANITY_API_DATASET?.trim() || process.env.VITE_SANITY_DATASET?.trim() || (deployed ? "production" : "preview");
      const enforceVercel = process.env.SANITY_ENFORCE_VERCEL_DATASET === "true" || process.env.SANITY_ENFORCE_VERCEL_DATASET === "1";
      if (enforceVercel && process.env.VERCEL) {
        const ve = process.env.VERCEL_ENV?.trim();
        if (ve === "production") dataset = "production";
        if (ve === "preview") {
          dataset = process.env.SANITY_VERCEL_PREVIEW_DATASET?.trim() || process.env.SANITY_API_DATASET?.trim() || process.env.VITE_SANITY_DATASET?.trim() || "production";
        }
      }
      const explicitAllowed = parseList(process.env.SANITY_ALLOWED_DATASETS);
      if (explicitAllowed.length > 0 && !explicitAllowed.includes(dataset)) {
        return {
          status: "dataset_not_allowed",
          attemptedDataset: dataset
        };
      }
      if (projectId) {
        return { status: "ok", projectId, dataset };
      }
      if (!deployed) {
        return { status: "ok", projectId: "ggbt0o98", dataset };
      }
      return { status: "missing_project" };
    };
    isVercelPreviewDeployment = () => Boolean(process.env.VERCEL) && process.env.VERCEL_ENV?.trim() === "preview";
    trySanityApiConfig = () => {
      const r = resolveSanityApiConfig();
      if (r.status !== "ok") return null;
      return { projectId: r.projectId, dataset: r.dataset };
    };
    resolveAdminSanityDataset = (requested) => {
      const normalized = (requested?.trim() || "production").toLowerCase();
      if (normalized !== "production" && normalized !== "preview") return null;
      const allowed = parseList(process.env.SANITY_ALLOWED_DATASETS);
      if (allowed.length > 0 && !allowed.includes(normalized)) return null;
      return normalized;
    };
  }
});

// shared/cms/normalizePortableText.ts
var makeTextBlock, plainStringToPortableTextBlocks, normalizeToPortableText;
var init_normalizePortableText = __esm({
  "shared/cms/normalizePortableText.ts"() {
    makeTextBlock = (key, text, options) => ({
      _type: "block",
      _key: key,
      style: options?.style ?? "normal",
      ...options?.listItem ? { listItem: options.listItem, level: 1 } : {},
      markDefs: [],
      children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }]
    });
    plainStringToPortableTextBlocks = (value) => {
      const trimmed = value.trim();
      if (!trimmed) return [];
      const paragraphs = trimmed.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
      const blocks = [];
      paragraphs.forEach((paragraph, paragraphIndex) => {
        const lines = paragraph.split("\n").map((line) => line.trim()).filter(Boolean);
        if (lines.length === 0) return;
        const bulletLines = lines.filter((line) => /^[-•*]\s+/.test(line));
        const isBulletList = bulletLines.length === lines.length;
        if (isBulletList) {
          bulletLines.forEach((line, lineIndex) => {
            blocks.push(
              makeTextBlock(`legacy-b-${paragraphIndex}-${lineIndex}`, line.replace(/^[-•*]\s+/, ""), {
                listItem: "bullet"
              })
            );
          });
          return;
        }
        blocks.push(makeTextBlock(`legacy-p-${paragraphIndex}`, lines.join(" ")));
      });
      return blocks;
    };
    normalizeToPortableText = (value) => {
      if (value == null) return null;
      if (Array.isArray(value) && value.length > 0) return value;
      if (typeof value === "string") {
        const t = value.trim();
        if (!t) return null;
        if (t.includes("\n")) return plainStringToPortableTextBlocks(t);
        return [makeTextBlock("legacy-string", t)];
      }
      return null;
    };
  }
});

// shared/cms/portableTextPlain.ts
var portableTextToPlainText;
var init_portableTextPlain = __esm({
  "shared/cms/portableTextPlain.ts"() {
    portableTextToPlainText = (blocks) => {
      if (!blocks) return "";
      if (typeof blocks === "string") return blocks.trim();
      if (!Array.isArray(blocks)) return "";
      return blocks.map((block) => {
        if (!block || typeof block !== "object") return "";
        const children = block.children;
        if (!Array.isArray(children)) return "";
        return children.map((child) => {
          if (!child || typeof child !== "object") return "";
          const text = child.text;
          return typeof text === "string" ? text : "";
        }).join("");
      }).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    };
  }
});

// shared/cms/stripPortableTextImages.ts
var stripPortableTextImages;
var init_stripPortableTextImages = __esm({
  "shared/cms/stripPortableTextImages.ts"() {
    stripPortableTextImages = (blocks) => {
      if (!Array.isArray(blocks)) return blocks;
      return blocks.filter((block) => {
        if (!block || typeof block !== "object") return false;
        const type = block._type;
        return type !== "image" && type !== "eventDetailInlineImage";
      });
    };
  }
});

// shared/mailto.ts
var init_mailto = __esm({
  "shared/mailto.ts"() {
  }
});

// shared/careersOpenRolesVisibility.ts
var PLACEHOLDER_OPEN_ROLE_IDS, normalizeOpenRole, hasOpenRoleDescription, filterValidOpenRoles;
var init_careersOpenRolesVisibility = __esm({
  "shared/careersOpenRolesVisibility.ts"() {
    init_normalizePortableText();
    init_portableTextPlain();
    init_stripPortableTextImages();
    init_mailto();
    PLACEHOLDER_OPEN_ROLE_IDS = /* @__PURE__ */ new Set([
      "program-operations-manager",
      "community-events-coordinator",
      "dummy-placeholder-role",
      "dummy-community-lead",
      "dummy-operations-coordinator"
    ]);
    normalizeOpenRole = (role) => {
      const id = (typeof role.id === "string" ? role.id : typeof role.roleId === "string" ? role.roleId : "").trim();
      const label = typeof role.applyButtonLabel === "string" ? role.applyButtonLabel.trim() : "";
      const url = typeof role.applyButtonUrl === "string" ? role.applyButtonUrl.trim() : "";
      const excerpt = typeof role.excerpt === "string" ? role.excerpt.trim() : "";
      return {
        id,
        title: typeof role.title === "string" ? role.title.trim() : "",
        location: typeof role.location === "string" ? role.location.trim() : "",
        employmentType: typeof role.employmentType === "string" ? role.employmentType.trim() : "",
        excerpt: excerpt || void 0,
        description: normalizeToPortableText(stripPortableTextImages(role.description)),
        responsibilities: Array.isArray(role.responsibilities) ? role.responsibilities.filter((r) => typeof r === "string" && r.trim() !== "") : [],
        applyButtonLabel: label || void 0,
        applyButtonUrl: url || void 0,
        roleCtaTitle: typeof role.roleCtaTitle === "string" ? role.roleCtaTitle.trim() || void 0 : void 0,
        roleCtaBody: typeof role.roleCtaBody === "string" ? role.roleCtaBody.trim() || void 0 : void 0,
        roleCtaPrimaryLabel: typeof role.roleCtaPrimaryLabel === "string" ? role.roleCtaPrimaryLabel.trim() || void 0 : void 0,
        roleCtaPrimaryHref: typeof role.roleCtaPrimaryHref === "string" ? role.roleCtaPrimaryHref.trim() || void 0 : void 0,
        roleCtaSecondaryLabel: typeof role.roleCtaSecondaryLabel === "string" ? role.roleCtaSecondaryLabel.trim() || void 0 : void 0,
        roleCtaSecondaryHref: typeof role.roleCtaSecondaryHref === "string" ? role.roleCtaSecondaryHref.trim() || void 0 : void 0
      };
    };
    hasOpenRoleDescription = (description) => Boolean(portableTextToPlainText(description));
    filterValidOpenRoles = (roles) => (roles ?? []).map(normalizeOpenRole).filter(
      (role) => role.id && role.title && role.location && role.employmentType && hasOpenRoleDescription(role.description) && !PLACEHOLDER_OPEN_ROLE_IDS.has(role.id)
    );
  }
});

// shared/cms/inlineHeroHeadline.ts
var inlineHeroBlock, twoPartHeroHeadline, fullMintLineHeroHeadline, threePartHeroHeadline, DEFAULT_STORIES_PAGE_HEADLINE_PORTABLE, DEFAULT_EVENTS_LANDING_HERO_PORTABLE, DEFAULT_PROGRAMS_LANDING_HERO_PORTABLE, DEFAULT_HOME_TESTIMONIALS_TITLE_PORTABLE, DEFAULT_HOME_METRICS_HEADLINE_PORTABLE, DEFAULT_ABOUT_HERO_LINE2_PORTABLE, DEFAULT_MEMBERSHIP_SPLASH_HEADING_PORTABLE;
var init_inlineHeroHeadline = __esm({
  "shared/cms/inlineHeroHeadline.ts"() {
    inlineHeroBlock = (parts, key) => ({
      _type: "block",
      _key: key,
      style: "normal",
      markDefs: [],
      children: parts.map((p, i) => ({
        _type: "span",
        _key: `${key}-s${i}`,
        text: p.text,
        marks: p.marks ?? []
      }))
    });
    twoPartHeroHeadline = (lead, accent, accentMark = "mint") => {
      const accentTrim = accent.trim();
      const parts = [{ text: lead }];
      if (accentTrim) {
        parts.push({ text: accentTrim.startsWith(" ") ? accentTrim : ` ${accentTrim}`, marks: [accentMark] });
      }
      return [inlineHeroBlock(parts, "two-part")];
    };
    fullMintLineHeroHeadline = (line) => [
      inlineHeroBlock([{ text: line, marks: ["mint"] }], "mint-line")
    ];
    threePartHeroHeadline = (prefix, accent, suffix) => {
      const a = accent.trim();
      const parts = [{ text: prefix }];
      if (a) parts.push({ text: ` ${a}`, marks: ["mint"] });
      parts.push({ text: suffix });
      return [inlineHeroBlock(parts, "three-part")];
    };
    DEFAULT_STORIES_PAGE_HEADLINE_PORTABLE = twoPartHeroHeadline(
      "Rellia",
      "Stories",
      "mint"
    );
    DEFAULT_EVENTS_LANDING_HERO_PORTABLE = twoPartHeroHeadline(
      "Connect &",
      "Learn",
      "mint"
    );
    DEFAULT_PROGRAMS_LANDING_HERO_PORTABLE = twoPartHeroHeadline(
      "Less theory.",
      "More progress.",
      "mint"
    );
    DEFAULT_HOME_TESTIMONIALS_TITLE_PORTABLE = twoPartHeroHeadline(
      "Trusted by the next generation of",
      "healthcare leaders",
      "teal"
    );
    DEFAULT_HOME_METRICS_HEADLINE_PORTABLE = threePartHeroHeadline(
      "The right people make",
      "all the difference",
      "."
    );
    DEFAULT_ABOUT_HERO_LINE2_PORTABLE = fullMintLineHeroHeadline("next generation");
    DEFAULT_MEMBERSHIP_SPLASH_HEADING_PORTABLE = [
      inlineHeroBlock(
        [
          { text: "Congratulations!", marks: ["mint"] },
          { text: " Your application is approved." }
        ],
        "splash-heading"
      )
    ];
  }
});

// shared/cms/cmsFieldUtils.ts
import { stegaClean } from "@sanity/client/stega";
var cmsTextToPlain, hasCmsString, pickCmsString;
var init_cmsFieldUtils = __esm({
  "shared/cms/cmsFieldUtils.ts"() {
    init_portableTextPlain();
    cmsTextToPlain = (value) => {
      if (value == null) return "";
      if (typeof value === "string") {
        const cleaned = stegaClean(value);
        return typeof cleaned === "string" ? cleaned.trim() : "";
      }
      if (Array.isArray(value)) return portableTextToPlainText(value);
      return "";
    };
    hasCmsString = (value) => Boolean(cmsTextToPlain(value));
    pickCmsString = (cmsValue, fallback) => hasCmsString(cmsValue) ? cmsValue : fallback;
  }
});

// shared/cms/resolveHeroHeadline.ts
var resolveHeroTitlePortable;
var init_resolveHeroHeadline = __esm({
  "shared/cms/resolveHeroHeadline.ts"() {
    init_inlineHeroHeadline();
    init_normalizePortableText();
    init_cmsFieldUtils();
    resolveHeroTitlePortable = (cms, fallback) => {
      if (Array.isArray(cms?.heroTitlePortable) && cms.heroTitlePortable.length > 0) {
        return cms.heroTitlePortable;
      }
      if (Array.isArray(cms?.heroHeadlinePortable) && cms.heroHeadlinePortable.length > 0) {
        return cms.heroHeadlinePortable;
      }
      const title = cms?.heroTitle;
      const accent = cms?.heroAccentPhrase;
      const suffix = cms?.heroTitleSuffix;
      if (hasCmsString(title) && hasCmsString(accent) && hasCmsString(suffix)) {
        const cleanTitle = title;
        const cleanAccent = accent;
        const cleanSuffix = suffix;
        return threePartHeroHeadline(cleanTitle, cleanAccent, cleanSuffix.startsWith(" ") ? cleanSuffix : ` ${cleanSuffix}`);
      }
      if (hasCmsString(title) && hasCmsString(accent)) {
        return twoPartHeroHeadline(title, accent);
      }
      if (hasCmsString(title)) {
        const normalized = normalizeToPortableText(title);
        if (normalized?.length) return normalized;
      }
      return fallback;
    };
  }
});

// shared/cms/networkPageDefaults.ts
var pexelsCardImage, DEFAULT_NETWORK_ENGAGE_FOUNDERS, DEFAULT_NETWORK_FOUNDERS_PAGE, DEFAULT_NETWORK_ADVISORS_PAGE, DEFAULT_NETWORK_INVESTORS_PAGE, DEFAULT_NETWORK_PARTNERS_PAGE, mergeNetworkWhyFeatures;
var init_networkPageDefaults = __esm({
  "shared/cms/networkPageDefaults.ts"() {
    init_inlineHeroHeadline();
    init_resolveHeroHeadline();
    init_cmsFieldUtils();
    pexelsCardImage = (photoId) => `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
    DEFAULT_NETWORK_ENGAGE_FOUNDERS = [
      {
        title: "Apply for membership",
        body: "Single application\u2014we route you to the right onboarding.",
        href: "/apply",
        linkLabel: "Continue",
        iconKey: "UserPlus"
      },
      {
        title: "Browse programs",
        body: "Structured tracks from QMS foundations to cohort programs.",
        href: "/programs",
        linkLabel: "Continue",
        iconKey: "BookOpen"
      },
      {
        title: "Virtual events",
        body: "Learn from operators and meet peers in health tech.",
        href: "/events",
        linkLabel: "Continue",
        iconKey: "Video"
      },
      {
        title: "Contact us",
        body: "We'll point you to the fastest next step.",
        href: "/contact",
        linkLabel: "Continue",
        iconKey: "Mail"
      }
    ];
    DEFAULT_NETWORK_FOUNDERS_PAGE = {
      title: "Founders",
      heroEyebrow: "Founders",
      heroTitlePortable: twoPartHeroHeadline("Are you building in", "health tech?"),
      heroTitle: "Are you building in",
      heroAccentPhrase: "health tech?",
      heroSubtitle: "You're building something that can change healthcare. We bring the experts, programs, and connections to help you get there.",
      heroImageSrc: "/images/founders.jpg",
      heroPrimaryCtaLabel: "Apply to join",
      heroPrimaryCtaHref: "/apply",
      heroSecondaryCtaLabel: "Explore Alumni",
      heroSecondaryCtaHref: "/founders/alumni",
      eligibilityTitle: "Built for serious health tech teams",
      eligibilityDescription: "Rellia works with companies where healthcare complexity is core to the product\u2014evidence, regulation, workflow, and traction at once.",
      eligibilityItems: [
        {
          text: "Digital health & care delivery software",
          imageUrl: "https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=1200"
        },
        {
          text: "Software as a medical device (SaMD) and connected devices",
          imageUrl: "/images/samd.jpg"
        },
        {
          text: "Diagnostics, lab, and decision-support platforms",
          imageUrl: "https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=1200"
        },
        {
          text: "Medtech and DTx with a credible path to evidence and regulation",
          imageUrl: "https://images.pexels.com/photos/7089017/pexels-photo-7089017.jpeg?auto=compress&cs=tinysrgb&w=1200"
        },
        {
          text: "Founding teams from idea through Series A",
          imageUrl: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200"
        },
        {
          text: "AI and machine learning in clinical workflows",
          imageUrl: "https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=1200"
        },
        {
          text: "Payer and value-based care infrastructure",
          imageUrl: "https://images.pexels.com/photos/7089012/pexels-photo-7089012.jpeg?auto=compress&cs=tinysrgb&w=1200"
        },
        {
          text: "Direct-to-consumer healthcare and wellness",
          imageUrl: "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=1200"
        }
      ],
      engageTitle: "How to plug in this week",
      engageSubtitle: "Every path reconnects to the same high-trust network\u2014pick what fits your sprint.",
      engageItems: DEFAULT_NETWORK_ENGAGE_FOUNDERS,
      whyTitle: "What makes Rellia membership different",
      whyDescription: "Operator-led support in a community where quality is defended by application review\u2014not open signup churn.",
      whyFeatures: [
        {
          title: "Warm, qualified intros",
          body: "Introductions to investors, partners, and clinicians who understand your stage\u2014not spray-and-pray blasts.",
          iconKey: "UserPlus",
          imageSrc: pexelsCardImage("5668858")
        },
        {
          title: "Slack community with signal",
          body: "A vetted network where people answer with operator context because application review keeps quality high.",
          iconKey: "MessagesSquare",
          imageSrc: pexelsCardImage("3184296")
        },
        {
          title: "Programs for healthcare reality",
          body: "Workshops and tracks built for regulatory, clinical, and commercial work\u2014not generic startup content.",
          iconKey: "GraduationCap",
          imageSrc: pexelsCardImage("3845126")
        },
        {
          title: "Equity-friendly access",
          body: "Depth from experienced advisors and operators without giving up ownership to join.",
          iconKey: "Percent",
          imageSrc: pexelsCardImage("3184465")
        }
      ],
      journeyTitle: "Where Rellia meets your trajectory",
      showJourneySection: true,
      journeyHelpBadge: "We help with",
      journeyHelpHeading: "Programs, operators, and warm intros aligned to milestones that survive clinical, regulatory, and buyer scrutiny.",
      journeySteps: [
        {
          id: "idea",
          label: "Product idea",
          zone: "outside",
          iconKey: "Lightbulb",
          detail: "Exploring problems and narratives on your own or with peers\u2014the groundwork before scoped execution. Not where Rellia substitutes for your discovery process."
        },
        {
          id: "edu",
          label: "Industry education",
          zone: "outside",
          iconKey: "GraduationCap",
          detail: "Learning reimbursement, stakeholder maps, and regulatory vocabulary broadly available through courses and content\u2014foundational, not a substitute for operator feedback."
        },
        {
          id: "problem",
          label: "Problem statement",
          zone: "outside",
          iconKey: "MessagesSquare",
          detail: "Clarifying who benefits and what would count as success in a care or buyer workflow. Rellia does not write your strategy doc for you\u2014but we help pressure-test it once you're building."
        },
        {
          id: "mvp",
          label: "MVP development",
          zone: "rellia",
          iconKey: "Hammer",
          detail: "Ship a scope operators can review: safety basics, interoperability touchpoints, and a validation plan that won't be thrown away in the next phase."
        },
        {
          id: "feedback",
          label: "User feedback",
          zone: "rellia",
          iconKey: "MessagesSquare",
          detail: "Structured feedback from clinicians, patients, and buyers so you learn what to fix before you scale sales or studies."
        },
        {
          id: "funding",
          label: "Funding",
          zone: "rellia",
          iconKey: "Percent",
          detail: "A de-risked story: milestones, clinical or economic logic, and a use-of-funds plan that matches healthcare diligence."
        },
        {
          id: "reg",
          label: "Regulatory",
          zone: "rellia",
          iconKey: "ShieldCheck",
          detail: "Map QMS, labeling, and risk early so evidence and software releases stay aligned to submission pathways."
        },
        {
          id: "clinical",
          label: "Clinical evidence",
          zone: "rellia",
          iconKey: "Stethoscope",
          detail: "Pilots and studies that produce decision-grade signal: workflow fit, outcomes, and endpoints buyers actually care about."
        },
        {
          id: "commercial",
          label: "Commercialization",
          zone: "rellia",
          iconKey: "Target",
          detail: "Repeatable revenue: pricing, procurement, channel partners, and delivery that holds up at scale."
        },
        {
          id: "launch",
          label: "Launch & scale",
          zone: "rellia",
          iconKey: "Rocket",
          detail: "Grow into health systems and markets with the intros, playbooks, and peer network to sustain momentum after first revenue."
        }
      ],
      exploreTitle: "Explore the network",
      exploreSubtitle: "Browse alumni and advisors\u2014then apply when you want curated intros and the right programming for your stage.",
      exploreCards: [
        {
          title: "See our alumni portfolio",
          badge: "Alumni",
          imageUrl: "/images/founders-header.jpg",
          ctaLabel: "Explore Alumni",
          ctaHref: "/founders/alumni"
        },
        {
          title: "Find the operators you want",
          badge: "Advisors",
          imageUrl: "/images/paths-advisor-pexels.jpg",
          ctaLabel: "Explore Advisors",
          ctaHref: "/advisors/directory"
        }
      ],
      deeperHelpTitle: "Need deeper help?",
      deeperHelpSubtitle: "Scoped working sessions beyond community rhythm\u2014clear deliverables for the milestone you're staring down.",
      deeperHelpFeatures: [
        {
          title: "Regulatory + evidence planning",
          body: "QMS foundations, pathway mapping, and study planning you can take to diligence and buyers.",
          iconKey: "CheckCircle2"
        },
        {
          title: "Narrative + diligence preparation",
          body: "Positioning, milestones, and materials built for healthcare scrutiny\u2014not pitch-deck theater.",
          iconKey: "BookOpen"
        },
        {
          title: "Commercial + buyer workflow",
          body: "Procurement reality checks, pricing logic, and adoption constraints that show up in pilots.",
          iconKey: "Users"
        },
        {
          title: "Warm intros (when you're ready)",
          body: "Introductions matched to your roadmap so you talk to the right operators, partners, and investors.",
          iconKey: "UserPlus"
        }
      ],
      deeperHelpCtaLabel: "Explore consulting",
      deeperHelpCtaHref: "/consulting",
      membershipPathTitle: "From application to your first warm intro",
      membershipPathSubtitle: "Apply, get approved, choose your membership, join Slack, then reach out when you want introductions matched to your roadmap.",
      membershipPathSteps: [
        {
          title: "Submit Application",
          description: "Complete the application. Our team reviews every submission to keep the network valuable for every member."
        },
        {
          title: "Review & Approval",
          description: "We'll review your background and goals. You'll hear from us by email within a few business days."
        },
        {
          title: "Secure Your Spot",
          description: "Once approved, you'll get a link to choose your membership and complete payment."
        },
        {
          title: "Join the Network",
          description: "Get immediate access to the community, resources, and network benefits."
        }
      ],
      ctaTitle: "Ready to join?",
      ctaBody: "Apply once\u2014we'll follow up with fit, onboarding, and the fastest path into programs and intros.",
      ctaPrimaryLabel: "Apply to join",
      ctaPrimaryHref: "/apply",
      ctaSecondaryLabel: "View programs",
      ctaSecondaryHref: "/programs"
    };
    DEFAULT_NETWORK_ADVISORS_PAGE = {
      title: "Advisors",
      heroEyebrow: "Advisors",
      heroTitlePortable: twoPartHeroHeadline("Some people are just wired to help", "others succeed."),
      heroTitle: "Some people are just wired to help",
      heroAccentPhrase: "others succeed.",
      heroSubtitle: "Mentor serious health tech founders through structured, respectful engagements\u2014stay sharp on innovation while keeping flexibility for your career.",
      heroImageSrc: "/images/advisors.jpg",
      heroPrimaryCtaLabel: "Apply to join",
      heroPrimaryCtaHref: "/apply",
      heroSecondaryCtaLabel: "Explore Advisors",
      heroSecondaryCtaHref: "/advisors/directory",
      engageTitle: "Three ways to work with Rellia",
      engageSubtitle: "Community presence, formal advisory work, or program leadership\u2014pick surfaces that fit your cadence.",
      engageItems: [
        {
          title: "Community & network",
          body: "Engage on your terms inside Slack and curated introductions\u2014meet founders and fellow advisors without rigid mandates.",
          href: "/founders/alumni",
          linkLabel: "Explore Alumni Directory",
          iconKey: "Network"
        },
        {
          title: "Advisory board roles",
          body: "Serve as a formal advisor when there is mutual fit\u2014typically lightweight charters scoped to milestone cadence.",
          href: "/advisors/directory",
          linkLabel: "Meet Our Advisors",
          iconKey: "Award"
        },
        {
          title: "Program advisor",
          body: "Shape cohort sessions and office hours inside Rellia programs\u2014see our curriculum on the programs page.",
          href: "/programs",
          linkLabel: "Browse Programs",
          iconKey: "BookOpen"
        }
      ],
      scheduleTitle: "Built for busy schedules",
      scheduleItems: [
        {
          title: "1\u20133 hours, on your terms",
          body: "Advisory roles are designed for short, high-leverage blocks\u2014adjustable as your capacity changes. Depth when you opt in, never a second job by default.",
          iconKey: "Clock"
        },
        {
          title: "Volunteer role",
          body: "Advisors serve on a volunteer basis, focused on impact and ecosystem development. We protect your boundaries while ensuring founders get high-signal feedback.",
          iconKey: "HeartHandshake"
        }
      ],
      benefitsTitle: "Mentorship that compounds",
      benefitsDescription: "Stay close to innovation without ambient noise\u2014sharp conversations with founders who execute.",
      benefitsBullets: [
        "Stay up to date on the latest innovations happening in your industry",
        "Sharpen your own career skills",
        "Build your network",
        "Be highlighted as an expert in your field",
        "Help bring healthcare improvements to patients"
      ],
      whyTitle: "What we look for",
      whyDescription: "Effective advisors combine depth, specificity, and respect for founder momentum.",
      whyFeatures: [
        {
          title: "Senior judgment",
          body: "You have led, practiced, or scaled inside healthcare\u2014not only consulted from the sidelines.",
          iconKey: "Scale",
          imageSrc: pexelsCardImage("3184311")
        },
        {
          title: "Specific edge",
          body: "A narrow expertise beats a general resume\u2014matching works best when your strengths are obvious.",
          iconKey: "Crosshair",
          imageSrc: pexelsCardImage("3184287")
        },
        {
          title: "Boundaries with generosity",
          body: "You protect scope and safety while still leaving founders with a crisp next step.",
          iconKey: "ShieldCheck",
          imageSrc: pexelsCardImage("3184306")
        },
        {
          title: "Momentum-aware advice",
          body: "Guidance is timed to milestones founders must hit\u2014not theoretical debates detached from evidence plans.",
          iconKey: "Gauge",
          imageSrc: pexelsCardImage("3184317")
        }
      ],
      ctaTitle: "Apply as an advisor",
      ctaBody: "Share your background\u2014we'll follow up with fit, expectations, and onboarding paths.",
      ctaPrimaryLabel: "Apply to join",
      ctaPrimaryHref: "/apply",
      ctaSecondaryLabel: "Contact",
      ctaSecondaryHref: "/contact"
    };
    DEFAULT_NETWORK_INVESTORS_PAGE = {
      title: "Investors",
      heroEyebrow: "Investors",
      heroTitlePortable: twoPartHeroHeadline("Stop sorting through", "cold pitch decks."),
      heroTitle: "Stop sorting through",
      heroAccentPhrase: "cold pitch decks.",
      heroSubtitle: "Meet Rellia-backed teams with sharper milestones\u2014clinical, regulatory, and commercial\u2014before the usual diligence scramble.",
      heroImageSrc: "/images/investors.jpg",
      heroPrimaryCtaLabel: "Get notified",
      whyTitle: "Benefits of investing alongside Rellia",
      whyDescription: "We shorten the distance between credible narrative and reality checks from people who have scaled in healthcare.",
      whyFeatures: [
        {
          title: "Diligence-ready narratives",
          body: "Teams arrive with clearer milestones across clinical, regulatory, and commercial tracks\u2014less scramble in your inbox.",
          iconKey: "ShieldCheck",
          imageSrc: pexelsCardImage("3184291")
        },
        {
          title: "Operator-backed signal",
          body: "Founders are coached by advisors who have shipped in healthcare\u2014not generic mentors recycling buzzwords.",
          iconKey: "Sparkles",
          imageSrc: pexelsCardImage("3182811")
        },
        {
          title: "Curated intros",
          body: "Sessions are thesis-aware and hosted virtually\u2014focused conversations instead of crowded demo days.",
          iconKey: "Users",
          imageSrc: pexelsCardImage("5668858")
        },
        {
          title: "Pattern visibility",
          body: "See how companies cluster by stage, modality, and buyer so you can tune allocation faster.",
          iconKey: "BarChart3",
          imageSrc: pexelsCardImage("3183158")
        }
      ],
      pitchTitle: "Exclusive connections and pitch events",
      pitchSubtitle: "Host a focused virtual session aligned to your mandate\u2014or join a larger showcase to compare teams alongside fellow investors.",
      foundersClusterTitle: "How founders cluster",
      foundersClusterSubtitle: "Illustrative distributions based on active introductions\u2014useful for thesis alignment.",
      foundersClusterDisclaimer: "Illustrative mix for thesis fit\u2014not a fund mandate.",
      pitchCards: [
        {
          title: "Individual pitch session",
          body: "A virtual session scoped to your thesis\u2014dig into workflow, reimbursement, or regulatory edge cases without competing noise.",
          imageUrl: "/images/whyrellia-founders.jpg"
        },
        {
          title: "Group pitch event",
          body: "Compare multiple teams in one session\u2014see how founders cluster by stage, modality, and buyer before you follow up one-on-one.",
          imageUrl: "/images/whyrellia-network-2.jpg"
        }
      ],
      ctaTitle: "Get notified about investor sessions",
      ctaBody: "Share your thesis and we'll reach out when a session matches your mandate.",
      ctaPrimaryLabel: "Get notified"
    };
    DEFAULT_NETWORK_PARTNERS_PAGE = {
      title: "Industry Partners",
      heroEyebrow: "Industry partners",
      heroTitlePortable: twoPartHeroHeadline("Reach the health tech founders", "who need you."),
      heroTitle: "Reach the health tech founders",
      heroAccentPhrase: "who need you.",
      heroSubtitle: "Pilot design, integration support, and enterprise credibility\u2014so promising products don't die in procurement limbo.",
      heroImageSrc: "/images/industrypartners.jpg",
      heroPrimaryCtaLabel: "Apply to join",
      heroPrimaryCtaHref: "/apply",
      engageTitle: "Three ways to work with Rellia",
      engageSubtitle: "Large cards, clear intent\u2014pick the path that matches how your team likes to start.",
      engageItems: [
        {
          title: "Partner directory",
          body: "Centralize your offers and verified references inside our exclusive marketplace for health tech execution.",
          href: "https://getproven.co/vendors/grid",
          linkLabel: "Explore Industry Partners",
          iconKey: "LayoutGrid"
        },
        {
          title: "Sponsor",
          body: "Put your brand behind programs and events where execution-quality teams spend their time.",
          href: "/contact",
          linkLabel: "Talk sponsorship",
          iconKey: "Megaphone"
        },
        {
          title: "Become a partner",
          body: "Co-design pilots, APIs, and enterprise handoffs with a community that treats adoption as the product.",
          href: "/contact",
          linkLabel: "Start a conversation",
          iconKey: "Handshake"
        }
      ],
      benefitsTitle: "Why partners stay",
      benefitsDescription: "What partners tell us they value most once programs are underway.",
      benefitsBullets: [
        "Pilot-ready founders with clearer scope and success metrics",
        "Structured introductions to technical and clinical leaders",
        "Shared language on security, compliance, and deployment",
        "Credibility inside a network built for health system reality",
        "Long-term relationships\u2014not one-off vendor fairs"
      ],
      directoryTitle: "An exclusive directory for health tech execution",
      directoryDescription: "We maintain a curated directory of service providers and vendors with exclusive offers for Rellia members. Unlike generic marketplaces, our members trust these recommendations because they are grounded in peer usage and verified health tech experience.",
      directoryBullets: [
        "Independent vendor marketplace focused on health tech needs",
        "Exclusive deals with pre-negotiated terms for Rellia portcos",
        "Pre-vetted service providers with verified healthcare references",
        "Peer-to-peer insights on implementation and support quality"
      ],
      whyTitle: "Why industry leaders partner with Rellia",
      whyDescription: "We align commercial innovators, healthcare systems, and clinical networks around active pilots and structured technology adoption.",
      whyFeatures: [
        {
          title: "Vetted healthcare scale",
          body: "Skip cold emails and pre-screened meetings\u2014connect directly with startups whose product, funding, and clinical roadmap are validated.",
          iconKey: "ShieldCheck",
          imageSrc: pexelsCardImage("3184319")
        },
        {
          title: "Active pilot sequencing",
          body: "Work with founders who know exactly what success metrics and integration boundaries they need to hit in system deployments.",
          iconKey: "Target",
          imageSrc: pexelsCardImage("3184296")
        },
        {
          title: "Secure compliance",
          body: "Ensure technical standards and compliance logic align with hospital requirements right from first touch.",
          iconKey: "ShieldCheck",
          imageSrc: pexelsCardImage("3184465")
        },
        {
          title: "Direct GTM engagement",
          body: "Co-design channels, APIs, and commercial handoffs within a community structured around real healthcare adoption.",
          iconKey: "Megaphone",
          imageSrc: pexelsCardImage("3184311")
        }
      ],
      ctaTitle: "Partner with Rellia",
      ctaBody: "Tell us about your organization, integration surface area, and the founder profiles you want to see more of. We'll route you to the right partner lead.",
      ctaPrimaryLabel: "Apply",
      ctaPrimaryHref: "/apply"
    };
    mergeNetworkWhyFeatures = (cms, defaults) => defaults.map((defaultFeature, index) => {
      const cmsFeature = cms?.[index];
      if (!cmsFeature) return defaultFeature;
      return {
        ...defaultFeature,
        ...cmsFeature,
        title: pickCmsString(cmsFeature.title, defaultFeature.title),
        body: pickCmsString(cmsFeature.body, defaultFeature.body),
        iconKey: pickCmsString(cmsFeature.iconKey, defaultFeature.iconKey),
        imageSrc: pickCmsString(cmsFeature.imageSrc, defaultFeature.imageSrc),
        buttonLabel: pickCmsString(cmsFeature.buttonLabel, defaultFeature.buttonLabel),
        buttonPath: pickCmsString(cmsFeature.buttonPath, defaultFeature.buttonPath)
      };
    });
  }
});

// shared/cms/resolveSectionHeadline.ts
var resolveSectionHeadlinePortable;
var init_resolveSectionHeadline = __esm({
  "shared/cms/resolveSectionHeadline.ts"() {
    init_cmsFieldUtils();
    init_normalizePortableText();
    resolveSectionHeadlinePortable = (cms, fallback) => {
      if (Array.isArray(cms?.headlinePortable) && cms.headlinePortable.length > 0) {
        return cms.headlinePortable;
      }
      const legacyPlain = (typeof cms?.title === "string" ? cms.title : void 0) ?? cms?.headingTitle ?? cms?.heading;
      if (hasCmsString(legacyPlain)) {
        const normalized = normalizeToPortableText(legacyPlain);
        if (normalized?.length) return normalized;
      }
      if (Array.isArray(fallback) && fallback.length > 0) return fallback;
      return null;
    };
  }
});

// shared/cms/careersPageDefaults.ts
var DEFAULT_CAREERS_WHY_FEATURES, DEFAULT_CAREERS_PERKS, DEFAULT_CAREERS_PAGE, mergePerksItems, mergeCareersPage;
var init_careersPageDefaults = __esm({
  "shared/cms/careersPageDefaults.ts"() {
    init_networkPageDefaults();
    init_inlineHeroHeadline();
    init_normalizePortableText();
    init_resolveHeroHeadline();
    init_resolveSectionHeadline();
    DEFAULT_CAREERS_WHY_FEATURES = [
      {
        iconKey: "users",
        title: "Mission you can feel",
        body: "Every week you will see founders ship, learn, and reset with support from people who have been in the room when healthcare products actually get adopted.",
        imageSrc: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
      },
      {
        iconKey: "target",
        title: "Craft, not chaos",
        body: "We run tight programs with clear owners, thoughtful rituals, and space to improve how we work\u2014so energy goes to members and outcomes, not noise.",
        imageSrc: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200"
      },
      {
        iconKey: "bookOpen",
        title: "Learn beside experts",
        body: "You will sit alongside clinicians, operators, and investors who care about getting the details right\u2014from diligence to deployment.",
        imageSrc: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200"
      },
      {
        iconKey: "userRound",
        title: "Humans first",
        body: "Kindness is not a slogan here. We expect high standards and direct feedback, and we build trust by showing up for each other and the community.",
        imageSrc: "https://images.pexels.com/photos/3184369/pexels-photo-3184369.jpeg?auto=compress&cs=tinysrgb&w=1200"
      }
    ];
    DEFAULT_CAREERS_PERKS = [
      {
        iconKey: "users",
        title: "In the room with the industry",
        body: "Clinicians, founders, and operators show up in our programs\u2014you hear what actually moves care and procurement, not polished slide stories."
      },
      {
        iconKey: "building2",
        title: "Office when it helps",
        body: "Remote-first with intentional in-person weeks: cohort sessions, workshops, and shared space when you want to work beside the team."
      },
      {
        iconKey: "laptop",
        title: "Small team, real ownership",
        body: "Startup reality: clear priorities, Direct feedback, and permission to fix how we work\u2014without layers of process for its own sake."
      },
      {
        iconKey: "mapPin",
        title: "Out with the community",
        body: "Member events, partner conversations, and field context on how buying decisions get made\u2014so you are not guessing from a distance."
      }
    ];
    DEFAULT_CAREERS_PAGE = {
      heroEyebrow: "Join the team",
      heroTitlePortable: threePartHeroHeadline("Build the", "future of health", " at Rellia"),
      heroTitle: "Build the",
      heroAccentPhrase: "future of health",
      heroTitleSuffix: "at Rellia",
      heroSubtitle: "We connect founders, clinicians, and capital so the right ideas reach patients. If you thrive in fast-moving, mission-driven environments, we would love to meet you.",
      heroImageSrc: "/images/careers-img.jpg",
      whyTitle: "Building What Matters Most",
      whyDescription: "What it feels like to build here: pace without panic, depth without gatekeeping, and a team that sweats the small stuff so members do not have to.",
      whyFeatures: DEFAULT_CAREERS_WHY_FEATURES,
      perksTitle: "How we work",
      perksTitlePortable: normalizeToPortableText("How we work"),
      perksDescription: "A lean health-tech team: industry proximity, intentional office time, and the pace of a startup\u2014not a corporate perks sheet.",
      perksItems: DEFAULT_CAREERS_PERKS,
      openRolesTitle: "Open Roles",
      openRolesTitlePortable: twoPartHeroHeadline("Open", "Roles", "teal"),
      openRolesSubtitle: "Join a remote-first team building what matters in healthtech.",
      ctaTitle: "Questions before you apply?",
      ctaBody: "Tell us what you are looking for\u2014we are happy to point you to the right conversation.",
      ctaPrimaryLabel: "Get in touch",
      ctaPrimaryHref: "/contact",
      lifeAtRelliaHeading: "Built by healthtech insiders, for builders",
      lifeAtRelliaHeadingPortable: twoPartHeroHeadline(
        "Built by healthtech insiders,",
        "for builders",
        "teal"
      ),
      lifeAtRelliaSubheading: "We are a remote-first, high-standards team of builders, clinicians, and operators dedicated to supporting healthtech founders. We cultivate an environment of high autonomy, rapid iteration, and deep clinical empathy to build the future of care."
    };
    mergePerksItems = (cms, defaults) => defaults.map((defaultItem, index) => {
      const cmsItem = cms?.[index];
      if (!cmsItem) return defaultItem;
      return {
        ...defaultItem,
        ...cmsItem,
        title: cmsItem.title?.trim() || defaultItem.title,
        body: cmsItem.body?.trim() || defaultItem.body,
        iconKey: cmsItem.iconKey?.trim() || defaultItem.iconKey
      };
    });
    mergeCareersPage = (cms) => ({
      ...DEFAULT_CAREERS_PAGE,
      ...cms,
      heroEyebrow: cms?.heroEyebrow?.trim() || DEFAULT_CAREERS_PAGE.heroEyebrow,
      heroTitlePortable: resolveHeroTitlePortable(cms, DEFAULT_CAREERS_PAGE.heroTitlePortable),
      heroTitle: cms?.heroTitle?.trim() || DEFAULT_CAREERS_PAGE.heroTitle,
      heroAccentPhrase: cms?.heroAccentPhrase?.trim() || DEFAULT_CAREERS_PAGE.heroAccentPhrase,
      heroTitleSuffix: cms?.heroTitleSuffix?.trim() || DEFAULT_CAREERS_PAGE.heroTitleSuffix,
      heroSubtitle: cms?.heroSubtitle?.trim() || DEFAULT_CAREERS_PAGE.heroSubtitle,
      heroImageSrc: cms?.heroImageSrc?.trim() || DEFAULT_CAREERS_PAGE.heroImageSrc,
      whyTitle: cms?.whyTitle?.trim() || DEFAULT_CAREERS_PAGE.whyTitle,
      whyDescription: cms?.whyDescription?.trim() || DEFAULT_CAREERS_PAGE.whyDescription,
      whyFeatures: mergeNetworkWhyFeatures(cms?.whyFeatures, DEFAULT_CAREERS_WHY_FEATURES),
      perksTitle: cms?.perksTitle?.trim() || DEFAULT_CAREERS_PAGE.perksTitle,
      perksTitlePortable: resolveSectionHeadlinePortable(
        { headlinePortable: cms?.perksTitlePortable },
        DEFAULT_CAREERS_PAGE.perksTitlePortable
      ),
      perksDescription: cms?.perksDescription?.trim() || DEFAULT_CAREERS_PAGE.perksDescription,
      perksItems: mergePerksItems(cms?.perksItems, DEFAULT_CAREERS_PERKS),
      openRolesTitle: cms?.openRolesTitle?.trim() || DEFAULT_CAREERS_PAGE.openRolesTitle,
      openRolesTitlePortable: resolveSectionHeadlinePortable(
        { headlinePortable: cms?.openRolesTitlePortable },
        DEFAULT_CAREERS_PAGE.openRolesTitlePortable
      ),
      openRolesSubtitle: cms?.openRolesSubtitle?.trim() || DEFAULT_CAREERS_PAGE.openRolesSubtitle,
      ctaTitle: cms?.ctaTitle?.trim() || DEFAULT_CAREERS_PAGE.ctaTitle,
      ctaBody: cms?.ctaBody?.trim() || DEFAULT_CAREERS_PAGE.ctaBody,
      ctaPrimaryLabel: cms?.ctaPrimaryLabel?.trim() || DEFAULT_CAREERS_PAGE.ctaPrimaryLabel,
      ctaPrimaryHref: cms?.ctaPrimaryHref?.trim() || DEFAULT_CAREERS_PAGE.ctaPrimaryHref,
      lifeAtRelliaHeading: cms?.lifeAtRelliaHeading?.trim() || DEFAULT_CAREERS_PAGE.lifeAtRelliaHeading,
      lifeAtRelliaHeadingPortable: resolveSectionHeadlinePortable(
        { headlinePortable: cms?.lifeAtRelliaHeadingPortable },
        DEFAULT_CAREERS_PAGE.lifeAtRelliaHeadingPortable
      ),
      lifeAtRelliaSubheading: cms?.lifeAtRelliaSubheading?.trim() || DEFAULT_CAREERS_PAGE.lifeAtRelliaSubheading
    });
  }
});

// shared/cms/eventHostImage.ts
var init_eventHostImage = __esm({
  "shared/cms/eventHostImage.ts"() {
  }
});

// shared/cms/programsEventDisplay.ts
var CARD_DATE_TIME_SPLIT, stripDayOrdinals, WEEKDAY_LEADING_EXPAND, MONTH_EXPAND, normalizeProgramsEventCalendarDate, normalizeProgramsEventTime, splitProgramsEventDateTimeRaw, parseProgramsEventDateTimeParts, formatEasternTimeFromIso, formatProgramsEventDateTimeFromInstants, getProgramsEventDisplayDateTime, shortenProgramsEventDateTime;
var init_programsEventDisplay = __esm({
  "shared/cms/programsEventDisplay.ts"() {
    init_eventHostImage();
    CARD_DATE_TIME_SPLIT = "\uE000";
    stripDayOrdinals = (s) => s.replace(/\b(\d{1,2})(?:st|nd|rd|th)\b/gi, "$1");
    WEEKDAY_LEADING_EXPAND = [
      [/^Monday,?\s*/i, "Monday, "],
      [/^Tuesday,?\s*/i, "Tuesday, "],
      [/^Wednesday,?\s*/i, "Wednesday, "],
      [/^Thursday,?\s*/i, "Thursday, "],
      [/^Friday,?\s*/i, "Friday, "],
      [/^Saturday,?\s*/i, "Saturday, "],
      [/^Sunday,?\s*/i, "Sunday, "],
      [/^Mon\.?,?\s+/i, "Monday, "],
      [/^Tue\.?,?\s+/i, "Tuesday, "],
      [/^Wed\.?,?\s+/i, "Wednesday, "],
      [/^Thu\.?,?\s+/i, "Thursday, "],
      [/^Thur\.?,?\s+/i, "Thursday, "],
      [/^Thurs\.?,?\s+/i, "Thursday, "],
      [/^Fri\.?,?\s+/i, "Friday, "],
      [/^Sat\.?,?\s+/i, "Saturday, "],
      [/^Sun\.?,?\s+/i, "Sunday, "]
    ];
    MONTH_EXPAND = [
      [/\bSept\b/gi, "September"],
      [/\bJan\b/gi, "January"],
      [/\bFeb\b/gi, "February"],
      [/\bMar\b/gi, "March"],
      [/\bApr\b/gi, "April"],
      [/\bJun\b/gi, "June"],
      [/\bJul\b/gi, "July"],
      [/\bAug\b/gi, "August"],
      [/\bOct\b/gi, "October"],
      [/\bNov\b/gi, "November"],
      [/\bDec\b/gi, "December"]
    ];
    normalizeProgramsEventCalendarDate = (datePart) => {
      let s = stripDayOrdinals(datePart.trim());
      if (!s) return "";
      for (const [re, rep] of WEEKDAY_LEADING_EXPAND) {
        if (re.test(s)) {
          s = s.replace(re, rep);
          break;
        }
      }
      for (const [re, rep] of MONTH_EXPAND) {
        s = s.replace(re, rep);
      }
      return s.replace(/\s+/g, " ").replace(/,\s*,/g, ",").trim();
    };
    normalizeProgramsEventTime = (timePart) => {
      let t = timePart.trim().replace(/\s+/g, " ");
      if (!t) return "";
      t = t.replace(/\b(Eastern|EST|ET)\b/gi, "").replace(/\s+/g, " ").trim();
      t = t.replace(/\b(EDT|PST|PDT|CST|CDT|PT|MT|MST|MDT)\b/gi, "").replace(/\s+/g, " ").trim();
      t = t.replace(/(\d)([AP]M)\b/gi, "$1 $2");
      const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*([AP]M)\b/i);
      if (!m) return `${t} EDT`.replace(/\s+/g, " ").trim();
      const hour = m[1] ?? "0";
      const minRaw = m[2];
      const ap = `${m[3] ?? ""}`.toUpperCase();
      const mm = minRaw !== void 0 ? minRaw.padStart(2, "0") : "00";
      const h = parseInt(hour, 10);
      if (Number.isNaN(h)) return `${t} EDT`.trim();
      return `${h}:${mm} ${ap} EDT`;
    };
    splitProgramsEventDateTimeRaw = (raw) => {
      const trimmed = raw.trim();
      if (!trimmed) return { datePart: "", timePart: "" };
      const normalized = trimmed.replace(/\s*[—–]\s*/g, CARD_DATE_TIME_SPLIT).replace(/\s+at\s+/gi, CARD_DATE_TIME_SPLIT);
      const chunks = normalized.split(CARD_DATE_TIME_SPLIT).map((c) => c.trim()).filter(Boolean);
      let datePart;
      let timePart;
      if (chunks.length >= 2) {
        datePart = chunks[0] ?? "";
        timePart = chunks.slice(1).join(" ");
      } else {
        const one = chunks[0] ?? normalized;
        const withClock = one.match(
          /^(.+?)\s+(\d{1,2}:\d{2}\s*(?:[AP]M)(?:\s+[A-Z]{2,5})?)$/i
        );
        if (withClock) {
          datePart = withClock[1]?.trim() ?? "";
          timePart = withClock[2]?.trim() ?? "";
        } else {
          const ampmOnly = one.match(/^(.+?)\s+(\d{1,2}\s*[AP]M(?:\s+[A-Z]{2,5})?)$/i);
          if (ampmOnly) {
            datePart = ampmOnly[1]?.trim() ?? "";
            timePart = ampmOnly[2]?.trim() ?? "";
          } else {
            datePart = stripDayOrdinals(one.trim());
            timePart = "";
          }
        }
      }
      return { datePart, timePart };
    };
    parseProgramsEventDateTimeParts = (raw) => {
      const { datePart, timePart } = splitProgramsEventDateTimeRaw(raw);
      const date = datePart ? normalizeProgramsEventCalendarDate(datePart) : "";
      const time = timePart ? normalizeProgramsEventTime(timePart) : "";
      return { date, time };
    };
    formatEasternTimeFromIso = (iso) => {
      const t = Date.parse(iso);
      if (!Number.isFinite(t)) return "";
      const d = new Date(t);
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York"
      });
    };
    formatProgramsEventDateTimeFromInstants = (startsAt, endsAt) => {
      const startRaw = startsAt?.trim();
      if (!startRaw) return "";
      const startMs = Date.parse(startRaw);
      if (!Number.isFinite(startMs)) return "";
      const d = new Date(startMs);
      const weekday = d.toLocaleDateString("en-US", { weekday: "long", timeZone: "America/New_York" });
      const month = d.toLocaleDateString("en-US", { month: "long", timeZone: "America/New_York" });
      const day = d.toLocaleDateString("en-US", { day: "numeric", timeZone: "America/New_York" });
      const year = d.toLocaleDateString("en-US", { year: "numeric", timeZone: "America/New_York" });
      const startTime = formatEasternTimeFromIso(startRaw);
      const endRaw = endsAt?.trim();
      const endTime = endRaw ? formatEasternTimeFromIso(endRaw) : "";
      const timeSegment = endTime && endTime !== startTime ? `${startTime} - ${endTime} EDT` : `${startTime} EDT`;
      return `${weekday}, ${month} ${day}, ${year} \u2014 ${timeSegment}`;
    };
    getProgramsEventDisplayDateTime = (event) => {
      const explicit = event.dateTime?.trim();
      if (explicit && !/^upcoming\s*[—–-]/i.test(explicit)) return explicit;
      const fromInstants = formatProgramsEventDateTimeFromInstants(event.startsAt, event.endsAt);
      if (fromInstants) return fromInstants;
      return explicit ?? "";
    };
    shortenProgramsEventDateTime = (raw) => {
      const { date, time } = parseProgramsEventDateTimeParts(raw);
      if (!date && !time) return "";
      if (!time) return date;
      if (!date) return time;
      return `${date} \xB7 ${time}`;
    };
  }
});

// shared/cms/collectionSeo.ts
var buildDefaultStorySeoTitle, buildDefaultEventSeoTitle, buildDefaultProgramSeoTitle, pickSeoTitle, pickSeoDescription, resolveStoryCollectionSeo, resolveEventCollectionSeo, resolveProgramCollectionSeo, buildDefaultCareersRoleSeoTitle, careersRoleDescriptionSnippet, resolveCareersRoleSeo;
var init_collectionSeo = __esm({
  "shared/cms/collectionSeo.ts"() {
    init_portableTextPlain();
    init_programsEventDisplay();
    buildDefaultStorySeoTitle = (storyTitle, tag) => {
      const title = storyTitle.trim();
      const category = tag?.trim();
      if (!title) return category || "Rellia Health";
      if (!category) return title;
      return `${title} \u2014 ${category}`;
    };
    buildDefaultEventSeoTitle = (eventTitle) => {
      const title = eventTitle.trim();
      if (!title) return "Events \u2014 Rellia Health";
      return `${title} - Events`;
    };
    buildDefaultProgramSeoTitle = (programName) => `${programName.trim() || "Program"} \u2014 Rellia Health`;
    pickSeoTitle = (seo) => seo?.metaTitle?.trim() || seo?.ogTitle?.trim() || void 0;
    pickSeoDescription = (seo) => seo?.metaDescription?.trim() || seo?.ogDescription?.trim() || void 0;
    resolveStoryCollectionSeo = (input) => {
      const title = pickSeoTitle(input.seo) || buildDefaultStorySeoTitle(input.title, input.tag);
      const description = pickSeoDescription(input.seo) || input.excerpt?.trim() || input.fallbackDescription?.trim() || "Stories and insights from Rellia Health.";
      const ogImageUrl = input.coverImageSrc?.trim() || void 0;
      return { title, description, ogImageUrl };
    };
    resolveEventCollectionSeo = (input) => {
      const computedDateTime = getProgramsEventDisplayDateTime(input);
      const shortDateTime = shortenProgramsEventDateTime(computedDateTime);
      const descText = (() => {
        const fromEventDescription = portableTextToPlainText(input.eventDescription);
        if (fromEventDescription) return fromEventDescription;
        return portableTextToPlainText(input.detailBody);
      })();
      const eventDate = shortDateTime || computedDateTime;
      const defaultDescription = descText ? eventDate ? `${eventDate} \xB7 ${descText}` : descText : eventDate || "Upcoming events from Rellia Health.";
      const title = pickSeoTitle(input.seo) || buildDefaultEventSeoTitle(input.title);
      const description = pickSeoDescription(input.seo) || defaultDescription;
      const ogImageUrl = input.imageSrc?.trim() || void 0;
      return { title, description, ogImageUrl };
    };
    resolveProgramCollectionSeo = (input) => {
      const programName = (input.title?.trim() || input.heroTitle?.trim() || "Program").trim();
      const defaultDescription = input.heroDescription?.trim() || input.description?.trim() || input.fallbackDescription?.trim() || "Explore this Rellia Health program for healthcare founders and operators.";
      const title = pickSeoTitle(input.seo) || buildDefaultProgramSeoTitle(programName);
      const description = pickSeoDescription(input.seo) || defaultDescription;
      const ogImageUrl = input.imageSrc?.trim() || void 0;
      return { title, description, ogImageUrl };
    };
    buildDefaultCareersRoleSeoTitle = (roleTitle) => {
      const title = roleTitle.trim();
      if (!title) return "Careers";
      return `${title} \u2014 Careers`;
    };
    careersRoleDescriptionSnippet = (description) => {
      const compact = portableTextToPlainText(description).replace(/\s+/g, " ").trim();
      if (!compact) return "";
      const sentenceEnd = compact.search(/[.!?](\s|$)/);
      if (sentenceEnd > 40 && sentenceEnd < 180) {
        return compact.slice(0, sentenceEnd + 1).trim();
      }
      return compact.length > 160 ? `${compact.slice(0, 157).trim()}\u2026` : compact;
    };
    resolveCareersRoleSeo = (input) => {
      const roleTitle = input.title.trim() || "Open role";
      const location = input.location?.trim();
      const employmentType = input.employmentType?.trim();
      const roleContext = [employmentType, location].filter(Boolean).join(" \xB7 ");
      const excerpt = input.excerpt?.trim();
      let description;
      if (roleContext) {
        description = excerpt ? `${roleContext}

${excerpt}` : roleContext;
      } else {
        const snippet = careersRoleDescriptionSnippet(input.description);
        description = excerpt || snippet || `Join Rellia Health as ${roleTitle}. View responsibilities and apply on our careers page.`;
      }
      return {
        title: buildDefaultCareersRoleSeoTitle(roleTitle),
        description
      };
    };
  }
});

// shared/cms/portableTextImages.ts
var extractFirstPortableTextImageUrl;
var init_portableTextImages = __esm({
  "shared/cms/portableTextImages.ts"() {
    extractFirstPortableTextImageUrl = (description) => {
      if (!Array.isArray(description)) return void 0;
      for (const block of description) {
        if (!block || typeof block !== "object") continue;
        const typed = block;
        if (typed._type === "image") {
          const url = (typeof typed.url === "string" ? typed.url : typed.asset?.url)?.trim();
          if (url) return url;
        }
        if (typed._type === "eventDetailInlineImage") {
          const src = typed.imageSrc?.trim();
          if (src) return src;
        }
      }
      return void 0;
    };
  }
});

// shared/cms/careersRoleShare.ts
var careersRolePathPrefix, parseCareersRoleIdFromPathname, buildCareersRoleShareMeta;
var init_careersRoleShare = __esm({
  "shared/cms/careersRoleShare.ts"() {
    init_collectionSeo();
    init_portableTextImages();
    careersRolePathPrefix = "/careers/roles/";
    parseCareersRoleIdFromPathname = (pathname) => {
      const path2 = pathname.trim().replace(/\/+$/, "") || "/";
      if (!path2.startsWith(careersRolePathPrefix)) return void 0;
      const raw = path2.slice(careersRolePathPrefix.length).trim();
      if (!raw) return void 0;
      try {
        return decodeURIComponent(raw).trim() || void 0;
      } catch {
        return raw || void 0;
      }
    };
    buildCareersRoleShareMeta = (role) => {
      const ogImageUrl = extractFirstPortableTextImageUrl(role.description)?.trim() || void 0;
      return {
        ...resolveCareersRoleSeo({
          title: role.title,
          location: role.location,
          employmentType: role.employmentType,
          excerpt: role.excerpt,
          description: role.description,
          responsibilities: role.responsibilities
        }),
        ogImageUrl
      };
    };
  }
});

// shared/cms/build-snapshots/events.json
var events_default;
var init_events = __esm({
  "shared/cms/build-snapshots/events.json"() {
    events_default = [{ addToCalendarEnabled: null, buttonText: null, customLinkButton: null, dateTime: null, detailBody: [{ _key: "ahc-p1", _type: "block", children: [{ _key: "ahc-p1s", _type: "span", marks: [], text: "The Human Layer: the missing layer above the tech stack - trust, coordination, and shared understanding - so humanity and technology can advance in harmony." }], markDefs: [], style: "normal" }, { _key: "ahc-img-desc", _type: "eventDetailInlineImage", alt: "The Human Layer \u2014 trust, coordination, and shared understanding in healthcare AI", displayMode: null, imageSrc: "/images/complianceevent-desc.jpeg" }, { _key: "ahc-p3", _type: "block", children: [{ _key: "ahc-p3s", _type: "span", marks: [], text: "As AI becomes embedded in healthcare products, the compliance stakes have never been higher. This event brings together compliance leaders, startup operators, and senior executives on one stage to cut through the noise \u2014 offering honest, experience-backed perspectives on what it actually takes to build in this regulated space." }], markDefs: [], style: "normal" }, { _key: "ahc-p4", _type: "block", children: [{ _key: "ahc-p4s", _type: "span", marks: [], text: "Expect candid panel discussions, real-world examples, and a strong emphasis on AI governance and data security \u2014 the areas where healthtech teams most often underestimate their exposure." }], markDefs: [], style: "normal" }, { _key: "ahc-p5", _type: "block", children: [{ _key: "ahc-p5s", _type: "span", marks: [], text: "What you'll gain" }], markDefs: [], style: "h3" }, { _key: "ahc-p6", _type: "block", children: [{ _key: "ahc-p6s", _type: "span", marks: [], text: "Live panel discussions: Real conversations on compliance strategy, AI risk, and security obligations in healthtech" }], markDefs: [], style: "normal" }, { _key: "ahc-p7", _type: "block", children: [{ _key: "ahc-p7s", _type: "span", marks: [], text: "Practical guidelines & tips: Actionable frameworks you can apply immediately \u2014 not theory, but ground-level advice" }], markDefs: [], style: "normal" }, { _key: "ahc-p8", _type: "block", children: [{ _key: "ahc-p8s", _type: "span", marks: [], text: "Exclusive Google Drive resource pack: Curated compliance guidelines and templates shared post-event \u2014 a lasting reference for your team" }], markDefs: [], style: "normal" }, { _key: "ahc-p9", _type: "block", children: [{ _key: "ahc-p9s", _type: "span", marks: [], text: "Deep dive: AI & security: A dedicated focus on AI-specific compliance risks and how to build secure, trustworthy health products" }], markDefs: [], style: "normal" }, { _key: "ahc-p10", _type: "block", children: [{ _key: "ahc-p10s", _type: "span", marks: [], text: "----" }], markDefs: [], style: "normal" }, { _key: "ahc-p11", _type: "block", children: [{ _key: "ahc-p11s", _type: "span", marks: [], text: "Our Expert Panelists:" }], markDefs: [], style: "h3" }, { _key: "ahc-p12", _type: "block", children: [{ _key: "ahc-p12s", _type: "span", marks: [], text: "Our discussion features leaders who are actively shaping the future of healthtech security:" }], markDefs: [], style: "normal" }, { _key: "ahc-p13", _type: "block", children: [{ _key: "ahc-p13s", _type: "span", marks: ["strong"], text: "Panelists:" }], markDefs: [], style: "normal" }, { _key: "ahc-p14", _type: "block", children: [{ _key: "ahc-p14s", _type: "span", marks: [], text: "Megan Kane \u2013 Executive Director of Rellia, specializing in AI-enabled SaMD, diagnostics, and global regulatory strategy for FDA, Health Canada, EU MDR, and APAC compliance." }], markDefs: [], style: "normal" }, { _key: "ahc-p15", _type: "block", children: [{ _key: "ahc-p15s", _type: "span", marks: [], text: "Andre Padure \u2013 Head of Regulatory Affairs and Quality Assurance at RetiSpec, leading global regulatory strategy and quality systems for the company\u2019s AI-powered retinal imaging platform for early Alzheimer\u2019s disease detection." }], markDefs: [], style: "normal" }, { _key: "ahc-p16", _type: "block", children: [{ _key: "ahc-p16s", _type: "span", marks: [], text: "Roy Kirshon \u2013 COO & Co-Founder of RetiSpec, leading company strategy, financing, and operations to support the development and commercialization of healthcare technologies." }], markDefs: [], style: "normal" }, { _key: "ahc-p17", _type: "block", children: [{ _key: "ahc-p17s", _type: "span", marks: ["strong"], text: "Moderator:" }], markDefs: [], style: "normal" }, { _key: "ahc-p18", _type: "block", children: [{ _key: "ahc-p18s", _type: "span", marks: [], text: "Katie Duyen Nguyen - Regional Director of BD @ CyStack" }], markDefs: [], style: "normal" }, { _key: "ahc-p19", _type: "block", children: [{ _key: "ahc-p19s", _type: "span", marks: [], text: "Brought to you by:" }], markDefs: [], style: "h3" }, { _key: "ahc-p20", _type: "block", children: [{ _key: "ahc-p20s", _type: "span", marks: [], text: "RetiSpec - A Toronto-based medical AI company using advanced imaging technology to detect signs of neurodegenerative disease - including Alzheimer's - through a simple, non-invasive retinal scan. RetiSpec's clinically validated AI analyzes retinal images captured by standard eye clinic cameras to identify disease biomarkers before symptoms appear, putting powerful early detection tools directly at the point of care." }], markDefs: [], style: "normal" }, { _key: "ahc-p21", _type: "block", children: [{ _key: "ahc-p21s", _type: "span", marks: [], text: "Rellia Health - A community that connects promising digital health founders with industry experts, healthcare practitioners, and engaged investors. Rellia is a network of people who deeply understand the healthcare industry and will go out of their way to help you succeed. We connect early-stage digital health, medical device, wellness, and diagnostic companies with the personalized solutions that match their unique needs." }], markDefs: [], style: "normal" }, { _key: "ahc-p22", _type: "block", children: [{ _key: "ahc-p22s", _type: "span", marks: [], text: "CyStack - Blends deep offensive security knowledge with proprietary tooling to help organizations protect their products, data, and operations. Their suite covers penetration testing, automated vulnerability scanning (VulnScan), crowdsourced bug bounty (WhiteHub), secrets management (Locker), and 24/7 security monitoring \u2014 giving healthtech startups everything they need to build secure from day one." }], markDefs: [], style: "normal" }, { _key: "ahc-p23", _type: "block", children: [{ _key: "ahc-p23s", _type: "span", marks: [], text: "\u201CToronto Tech Week is a citywide celebration of the people building what\u2019s next. From May 26\u201329, 2026, founders, investors, and builders come together for hundreds of community-led events across Toronto, connecting tens of thousands of people around Canadian tech.\u201D\nTorontotechweek.com" }], markDefs: [], style: "blockquote" }, { _key: "ahc-p24-title", _type: "block", children: [{ _key: "ahc-p24s-title", _type: "span", marks: [], text: "Please be advised" }], markDefs: [], style: "h3" }, { _key: "ahc-p24-body", _type: "block", children: [{ _key: "ahc-p24s-body", _type: "span", marks: [], text: "Unfortunately, space is very limited at these community events and we can not always accept everyone we would like to. If you are not accepted to this event, please keep applying! We appreciate your application tremendously and we are looking forward to seeing you at a future event very soon!" }], markDefs: [], style: "normal" }], detailBodyHeading: "About this event", embedLumaOnDetailPage: true, endsAt: "2026-05-27T20:30:00-04:00", eventDescription: [{ _key: "ahc-p1", _type: "block", children: [{ _key: "ahc-p1s", _type: "span", marks: [], text: "The Human Layer: the missing layer above the tech stack - trust, coordination, and shared understanding - so humanity and technology can advance in harmony." }], markDefs: [], style: "normal" }, { _key: "ahc-img-desc", _type: "eventDetailInlineImage", alt: "The Human Layer \u2014 trust, coordination, and shared understanding in healthcare AI", imageSrc: "/images/complianceevent-desc.jpeg" }, { _key: "ahc-p3", _type: "block", children: [{ _key: "ahc-p3s", _type: "span", marks: [], text: "As AI becomes embedded in healthcare products, the compliance stakes have never been higher. This event brings together compliance leaders, startup operators, and senior executives on one stage to cut through the noise \u2014 offering honest, experience-backed perspectives on what it actually takes to build in this regulated space." }], markDefs: [], style: "normal" }, { _key: "ahc-p4", _type: "block", children: [{ _key: "ahc-p4s", _type: "span", marks: [], text: "Expect candid panel discussions, real-world examples, and a strong emphasis on AI governance and data security \u2014 the areas where healthtech teams most often underestimate their exposure." }], markDefs: [], style: "normal" }, { _key: "ahc-p5", _type: "block", children: [{ _key: "ahc-p5s", _type: "span", marks: [], text: "What you'll gain" }], markDefs: [], style: "h3" }, { _key: "ahc-p6", _type: "block", children: [{ _key: "ahc-p6s", _type: "span", marks: [], text: "Live panel discussions: Real conversations on compliance strategy, AI risk, and security obligations in healthtech" }], markDefs: [], style: "normal" }, { _key: "ahc-p7", _type: "block", children: [{ _key: "ahc-p7s", _type: "span", marks: [], text: "Practical guidelines & tips: Actionable frameworks you can apply immediately \u2014 not theory, but ground-level advice" }], markDefs: [], style: "normal" }, { _key: "ahc-p8", _type: "block", children: [{ _key: "ahc-p8s", _type: "span", marks: [], text: "Exclusive Google Drive resource pack: Curated compliance guidelines and templates shared post-event \u2014 a lasting reference for your team" }], markDefs: [], style: "normal" }, { _key: "ahc-p9", _type: "block", children: [{ _key: "ahc-p9s", _type: "span", marks: [], text: "Deep dive: AI & security: A dedicated focus on AI-specific compliance risks and how to build secure, trustworthy health products" }], markDefs: [], style: "normal" }, { _key: "ahc-p10", _type: "block", children: [{ _key: "ahc-p10s", _type: "span", marks: [], text: "----" }], markDefs: [], style: "normal" }, { _key: "ahc-p11", _type: "block", children: [{ _key: "ahc-p11s", _type: "span", marks: [], text: "Our Expert Panelists:" }], markDefs: [], style: "h3" }, { _key: "ahc-p12", _type: "block", children: [{ _key: "ahc-p12s", _type: "span", marks: [], text: "Our discussion features leaders who are actively shaping the future of healthtech security:" }], markDefs: [], style: "normal" }, { _key: "ahc-p13", _type: "block", children: [{ _key: "ahc-p13s", _type: "span", marks: ["strong"], text: "Panelists:" }], markDefs: [], style: "normal" }, { _key: "ahc-p14", _type: "block", children: [{ _key: "ahc-p14s", _type: "span", marks: [], text: "Megan Kane \u2013 Executive Director of Rellia, specializing in AI-enabled SaMD, diagnostics, and global regulatory strategy for FDA, Health Canada, EU MDR, and APAC compliance." }], markDefs: [], style: "normal" }, { _key: "ahc-p15", _type: "block", children: [{ _key: "ahc-p15s", _type: "span", marks: [], text: "Andre Padure \u2013 Head of Regulatory Affairs and Quality Assurance at RetiSpec, leading global regulatory strategy and quality systems for the company\u2019s AI-powered retinal imaging platform for early Alzheimer\u2019s disease detection." }], markDefs: [], style: "normal" }, { _key: "ahc-p16", _type: "block", children: [{ _key: "ahc-p16s", _type: "span", marks: [], text: "Roy Kirshon \u2013 COO & Co-Founder of RetiSpec, leading company strategy, financing, and operations to support the development and commercialization of healthcare technologies." }], markDefs: [], style: "normal" }, { _key: "ahc-p17", _type: "block", children: [{ _key: "ahc-p17s", _type: "span", marks: ["strong"], text: "Moderator:" }], markDefs: [], style: "normal" }, { _key: "ahc-p18", _type: "block", children: [{ _key: "ahc-p18s", _type: "span", marks: [], text: "Katie Duyen Nguyen - Regional Director of BD @ CyStack" }], markDefs: [], style: "normal" }, { _key: "ahc-p19", _type: "block", children: [{ _key: "ahc-p19s", _type: "span", marks: [], text: "Brought to you by:" }], markDefs: [], style: "h3" }, { _key: "ahc-p20", _type: "block", children: [{ _key: "ahc-p20s", _type: "span", marks: [], text: "RetiSpec - A Toronto-based medical AI company using advanced imaging technology to detect signs of neurodegenerative disease - including Alzheimer's - through a simple, non-invasive retinal scan. RetiSpec's clinically validated AI analyzes retinal images captured by standard eye clinic cameras to identify disease biomarkers before symptoms appear, putting powerful early detection tools directly at the point of care." }], markDefs: [], style: "normal" }, { _key: "ahc-p21", _type: "block", children: [{ _key: "ahc-p21s", _type: "span", marks: [], text: "Rellia Health - A community that connects promising digital health founders with industry experts, healthcare practitioners, and engaged investors. Rellia is a network of people who deeply understand the healthcare industry and will go out of their way to help you succeed. We connect early-stage digital health, medical device, wellness, and diagnostic companies with the personalized solutions that match their unique needs." }], markDefs: [], style: "normal" }, { _key: "ahc-p22", _type: "block", children: [{ _key: "ahc-p22s", _type: "span", marks: [], text: "CyStack - Blends deep offensive security knowledge with proprietary tooling to help organizations protect their products, data, and operations. Their suite covers penetration testing, automated vulnerability scanning (VulnScan), crowdsourced bug bounty (WhiteHub), secrets management (Locker), and 24/7 security monitoring \u2014 giving healthtech startups everything they need to build secure from day one." }], markDefs: [], style: "normal" }, { _key: "ahc-p23", _type: "block", children: [{ _key: "ahc-p23s", _type: "span", marks: [], text: "\u201CToronto Tech Week is a citywide celebration of the people building what\u2019s next. From May 26\u201329, 2026, founders, investors, and builders come together for hundreds of community-led events across Toronto, connecting tens of thousands of people around Canadian tech.\u201D\nTorontotechweek.com" }], markDefs: [], style: "blockquote" }, { _key: "ahc-p24-title", _type: "block", children: [{ _key: "ahc-p24s-title", _type: "span", marks: [], text: "Please be advised" }], markDefs: [], style: "h3" }, { _key: "ahc-p24-body", _type: "block", children: [{ _key: "ahc-p24s-body", _type: "span", marks: [], text: "Unfortunately, space is very limited at these community events and we can not always accept everyone we would like to. If you are not accepted to this event, please keep applying! We appreciate your application tremendously and we are looking forward to seeing you at a future event very soon!" }], markDefs: [], style: "normal" }], hostImageSrc: null, href: null, imageSrc: null, location: "RetiSpec, 170 Bedford Rd, Toronto", lumaEventId: "evt-0wKks8RxsxxgmFh", person: "The AI Collective \u2022 Toronto Tech Week", seo: null, slug: "ai-healthcare-compliance", sortOrder: 0, startsAt: "2026-05-27T18:00:00-04:00", status: "visible", ticketingUrl: null, title: "AI Healthcare Compliance (w/ The AI Collective)" }, { addToCalendarEnabled: null, buttonText: null, customLinkButton: null, dateTime: null, detailBody: [{ _key: "leadership-p1", _type: "block", children: [{ _key: "leadership-p1span", _type: "span", marks: [], text: "Founders and Investors often operate under intense responsibility and visibility." }], markDefs: [], style: "normal" }, { _key: "leadership-p2", _type: "block", children: [{ _key: "leadership-p2span", _type: "span", marks: [], text: "Join Dr Sabina Nagpal for this interactive, neuroscience-informed session which focuses on maintaining judgment, clarity, and presence when navigating complex decisions, competing priorities and high-pressure situations." }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: true, endsAt: "2026-05-06T18:30:00.000Z", eventDescription: [{ _key: "leadership-p1", _type: "block", children: [{ _key: "leadership-p1span", _type: "span", marks: [], text: "Founders and Investors often operate under intense responsibility and visibility." }], markDefs: [], style: "normal" }, { _key: "leadership-p2", _type: "block", children: [{ _key: "leadership-p2span", _type: "span", marks: [], text: "Join Dr Sabina Nagpal for this interactive, neuroscience-informed session which focuses on maintaining judgment, clarity, and presence when navigating complex decisions, competing priorities and high-pressure situations." }], markDefs: [], style: "normal" }], hostImageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/024ee288b3671fbaf2f750d59c57ebd1e0092d15-1948x1948.png", href: "https://luma.com/bgvqn7ia", imageSrc: null, location: "Virtual", lumaEventId: "evt-h1FZAFHZ8gzGjJn", person: "Dr. Sabina Nagpal \u2022 Radiate Mind", seo: null, slug: "leadership-under-pressure", sortOrder: 0, startsAt: "2026-05-06T17:00:00.000Z", status: "visible", ticketingUrl: null, title: "Leadership Under Pressure" }, { addToCalendarEnabled: null, buttonText: null, customLinkButton: null, dateTime: null, detailBody: [{ _key: "2f735fbab375", _type: "block", children: [{ _key: "af5ecc6b6b06", _type: "span", marks: ["strong"], text: "Final Pitch Showcase: Investment Readiness Program Cohort" }], markDefs: [], style: "h3" }, { _key: "73b1dda7f8d0", _type: "block", children: [{ _key: "a44d54dd9417", _type: "span", marks: [], text: "\u200BPlease join us for the Final Pitch Showcase of companies graduating from Rellia Health\u2019s " }, { _key: "5693d7c6caa9", _type: "span", marks: ["strong"], text: "Elevate Healthcare Capital Program" }, { _key: "75a77d763ed4", _type: "span", marks: [], text: ". This event brings together a curated group of early-stage founders and investors for an afternoon of pitches, insights, and networking. The companies presenting have spent the past 5 weeks elevating their pitches in preparation for fundraising. This event marks the culmination of their work." }], markDefs: [], style: "normal" }, { _key: "bb708a241783", _type: "block", children: [{ _key: "124f65750982", _type: "span", marks: [], text: "\u200B" }, { _key: "c26b1d77ce48", _type: "span", marks: ["strong"], text: "Agenda" }], markDefs: [], style: "normal" }, { _key: "3d1e4fd1f69a", _type: "block", children: [{ _key: "3a3ccfec32c2", _type: "span", marks: [], text: "\u200BEach of the four founders will have 5 minutes to pitch their health tech venture with 15 minutes for Q&A with investors. The final networking session will provide an opportunity for further connection and follow up." }], markDefs: [], style: "normal" }, { _key: "564ec184d45b", _type: "block", children: [{ _key: "2878aa7d7e76", _type: "span", marks: [], text: "\u200B" }, { _key: "8c1af3383be4", _type: "span", marks: ["strong"], text: "What to Expect" }], markDefs: [], style: "normal" }, { _key: "0f41d6638f53", _type: "block", children: [{ _key: "e477ea51f681", _type: "span", marks: [], text: "\u200B" }, { _key: "d11984083971", _type: "span", marks: ["strong"], text: "Live Founder Pitches" }, { _key: "34a052aa31f9", _type: "span", marks: [], text: "\nYou\u2019ll hear concise, high-quality pitches from a cohort of startups that have completed our incubator program. Each company will present their vision, traction, and growth plans." }], markDefs: [], style: "normal" }, { _key: "82214b6ac8d9", _type: "block", children: [{ _key: "1e4ebdf5aeb2", _type: "span", marks: [], text: "\u200B" }, { _key: "d2302a1f8ccd", _type: "span", marks: ["strong"], text: "Pre-Read for Registered Attendees" }, { _key: "feb2c7f0f2d7", _type: "span", marks: [], text: "\nTo make the most of everyone\u2019s time, detailed company bios will be shared in a pre-read with all registered attendees ahead of the event. This will include deeper dives into each company beyond what\u2019s covered on stage." }], markDefs: [], style: "normal" }, { _key: "749368514d89", _type: "block", children: [{ _key: "a2d767babb6e", _type: "span", marks: [], text: "\u200B" }, { _key: "ac5cdb84c8ee", _type: "span", marks: ["strong"], text: "Networking Session" }, { _key: "86359792d201", _type: "span", marks: [], text: "\nFollowing the pitches, we\u2019ll host a networking session designed to facilitate meaningful conversations between founders and investors. This is an opportunity to ask follow-up questions, explore potential fit, and begin relationships beyond the room." }], markDefs: [], style: "normal" }, { _key: "5404332e97e4", _type: "block", children: [{ _key: "fcff1d2bf1d1", _type: "span", marks: [], text: "\u200B" }, { _key: "13994ea701fa", _type: "span", marks: ["strong"], text: "Snapshot of the Cohort" }], markDefs: [], style: "normal" }, { _key: "466174047485", _type: "block", children: [{ _key: "4470b5da383c", _type: "span", marks: [], text: "\u200B" }, { _key: "672f25401fef", _type: "span", marks: ["strong"], text: "Stage:" }, { _key: "3dd937ee0cbf", _type: "span", marks: [], text: " Pre-seed\xA0" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "d9e11273c72d", _type: "block", children: [{ _key: "efefd8bf6b95", _type: "span", marks: [], text: "\u200B" }, { _key: "ad8d20ec4998", _type: "span", marks: ["strong"], text: "Industry:" }, { _key: "2fa20a2c7182", _type: "span", marks: [], text: " HealthTech (Digital health, MedTech)\xA0" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "ea3bc9c454e2", _type: "block", children: [{ _key: "561d40f4e82a", _type: "span", marks: [], text: "\u200B" }, { _key: "9bb18164112f", _type: "span", marks: ["strong"], text: "Business Models:" }, { _key: "6accb824a85c", _type: "span", marks: [], text: " B2B & B2C" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "f5dc9b5b8b2c", _type: "block", children: [{ _key: "f6fcd5c2889f", _type: "span", marks: [], text: "\u200B" }, { _key: "969bba1eb602", _type: "span", marks: ["strong"], text: "Fundraising Status:" }, { _key: "b40c56bd228c", _type: "span", marks: [], text: " Actively preparing for or beginning fundraising" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "199766f0c623", _type: "block", children: [{ _key: "9d05109bf6c8", _type: "span", marks: [], text: "\u200BWe look forward to having you join us on February 20th for the culmination of Rellia\u2019s Elevate Program!" }], markDefs: [], style: "normal" }], detailBodyHeading: "About this event", embedLumaOnDetailPage: null, endsAt: "2026-02-20T21:00:00.000Z", eventDescription: [{ _key: "2f735fbab375", _type: "block", children: [{ _key: "af5ecc6b6b06", _type: "span", marks: ["strong"], text: "Final Pitch Showcase: Investment Readiness Program Cohort" }], markDefs: [], style: "h3" }, { _key: "73b1dda7f8d0", _type: "block", children: [{ _key: "a44d54dd9417", _type: "span", marks: [], text: "\u200BPlease join us for the Final Pitch Showcase of companies graduating from Rellia Health\u2019s " }, { _key: "5693d7c6caa9", _type: "span", marks: ["strong"], text: "Elevate Healthcare Capital Program" }, { _key: "75a77d763ed4", _type: "span", marks: [], text: ". This event brings together a curated group of early-stage founders and investors for an afternoon of pitches, insights, and networking. The companies presenting have spent the past 5 weeks elevating their pitches in preparation for fundraising. This event marks the culmination of their work." }], markDefs: [], style: "normal" }, { _key: "bb708a241783", _type: "block", children: [{ _key: "124f65750982", _type: "span", marks: [], text: "\u200B" }, { _key: "c26b1d77ce48", _type: "span", marks: ["strong"], text: "Agenda" }], markDefs: [], style: "normal" }, { _key: "3d1e4fd1f69a", _type: "block", children: [{ _key: "3a3ccfec32c2", _type: "span", marks: [], text: "\u200BEach of the four founders will have 5 minutes to pitch their health tech venture with 15 minutes for Q&A with investors. The final networking session will provide an opportunity for further connection and follow up." }], markDefs: [], style: "normal" }, { _key: "564ec184d45b", _type: "block", children: [{ _key: "2878aa7d7e76", _type: "span", marks: [], text: "\u200B" }, { _key: "8c1af3383be4", _type: "span", marks: ["strong"], text: "What to Expect" }], markDefs: [], style: "normal" }, { _key: "0f41d6638f53", _type: "block", children: [{ _key: "e477ea51f681", _type: "span", marks: [], text: "\u200B" }, { _key: "d11984083971", _type: "span", marks: ["strong"], text: "Live Founder Pitches" }, { _key: "34a052aa31f9", _type: "span", marks: [], text: "\nYou\u2019ll hear concise, high-quality pitches from a cohort of startups that have completed our incubator program. Each company will present their vision, traction, and growth plans." }], markDefs: [], style: "normal" }, { _key: "82214b6ac8d9", _type: "block", children: [{ _key: "1e4ebdf5aeb2", _type: "span", marks: [], text: "\u200B" }, { _key: "d2302a1f8ccd", _type: "span", marks: ["strong"], text: "Pre-Read for Registered Attendees" }, { _key: "feb2c7f0f2d7", _type: "span", marks: [], text: "\nTo make the most of everyone\u2019s time, detailed company bios will be shared in a pre-read with all registered attendees ahead of the event. This will include deeper dives into each company beyond what\u2019s covered on stage." }], markDefs: [], style: "normal" }, { _key: "749368514d89", _type: "block", children: [{ _key: "a2d767babb6e", _type: "span", marks: [], text: "\u200B" }, { _key: "ac5cdb84c8ee", _type: "span", marks: ["strong"], text: "Networking Session" }, { _key: "86359792d201", _type: "span", marks: [], text: "\nFollowing the pitches, we\u2019ll host a networking session designed to facilitate meaningful conversations between founders and investors. This is an opportunity to ask follow-up questions, explore potential fit, and begin relationships beyond the room." }], markDefs: [], style: "normal" }, { _key: "5404332e97e4", _type: "block", children: [{ _key: "fcff1d2bf1d1", _type: "span", marks: [], text: "\u200B" }, { _key: "13994ea701fa", _type: "span", marks: ["strong"], text: "Snapshot of the Cohort" }], markDefs: [], style: "normal" }, { _key: "466174047485", _type: "block", children: [{ _key: "4470b5da383c", _type: "span", marks: [], text: "\u200B" }, { _key: "672f25401fef", _type: "span", marks: ["strong"], text: "Stage:" }, { _key: "3dd937ee0cbf", _type: "span", marks: [], text: " Pre-seed\xA0" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "d9e11273c72d", _type: "block", children: [{ _key: "efefd8bf6b95", _type: "span", marks: [], text: "\u200B" }, { _key: "ad8d20ec4998", _type: "span", marks: ["strong"], text: "Industry:" }, { _key: "2fa20a2c7182", _type: "span", marks: [], text: " HealthTech (Digital health, MedTech)\xA0" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "ea3bc9c454e2", _type: "block", children: [{ _key: "561d40f4e82a", _type: "span", marks: [], text: "\u200B" }, { _key: "9bb18164112f", _type: "span", marks: ["strong"], text: "Business Models:" }, { _key: "6accb824a85c", _type: "span", marks: [], text: " B2B & B2C" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "f5dc9b5b8b2c", _type: "block", children: [{ _key: "f6fcd5c2889f", _type: "span", marks: [], text: "\u200B" }, { _key: "969bba1eb602", _type: "span", marks: ["strong"], text: "Fundraising Status:" }, { _key: "b40c56bd228c", _type: "span", marks: [], text: " Actively preparing for or beginning fundraising" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "199766f0c623", _type: "block", children: [{ _key: "9d05109bf6c8", _type: "span", marks: [], text: "\u200BWe look forward to having you join us on February 20th for the culmination of Rellia\u2019s Elevate Program!" }], markDefs: [], style: "normal" }], hostImageSrc: null, href: null, imageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/b581059f3140c6bccc7a59a5da7df12f3c4a5c5e-1200x1200.jpg", location: "Virtual", lumaEventId: null, person: "Rellia Health & Venture Capital Partners", seo: { metaDescription: null, metaTitle: null, noFollow: false, noIndex: false, ogDescription: null, ogImageUrl: null, ogTitle: null }, slug: "rellia-pitch-event", sortOrder: 0, startsAt: "2026-02-20T19:00:00.000Z", status: "visible", ticketingUrl: null, title: "Rellia Pitch Event" }, { addToCalendarEnabled: true, buttonText: null, customLinkButton: null, dateTime: null, detailBody: [{ _key: "9346edb4726e", _type: "block", children: [{ _key: "5a859cd20f93", _type: "span", marks: [], text: "This event is for clinicians and founders to meet and share ideas to make healthcare technology better.\n\nFor " }, { _key: "c769170f2134", _type: "span", marks: ["strong"], text: "healthcare professionals" }, { _key: "64b43dcb264d", _type: "span", marks: [], text: ", this is a chance to share your expertise on what works and what doesn't. We know you're tired of being told to adopt technology that doesn't function the way it should. Your feedback can make a major impact for founders, while also opening potential avenues for advisory or leadership opportunities in the tech industry.\n\nFor " }, { _key: "cd7a3371a3d8", _type: "span", marks: ["strong"], text: "founders" }, { _key: "fbbe7f16ce28", _type: "span", marks: [], text: ", this is a unique opportunity to gain 1:1 feedback directly from interested clinicians. Understanding how your technology will fit into real workflows will help strengthen your product\u2019s design and adoption.\n\nThese sessions can open doors to:" }], markDefs: [], style: "normal" }, { _key: "afae989d1608", _type: "block", children: [{ _key: "262e22a15dc1", _type: "span", marks: [], text: "\u200BCo-developing solutions based on real unmet needs" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "333f000c97da", _type: "block", children: [{ _key: "39773351c100", _type: "span", marks: [], text: "\u200BFilling advisory board member, co-founder, or chief medical officer roles" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "289c1c0a6396", _type: "block", children: [{ _key: "683b071c0bbe", _type: "span", marks: [], text: "\u200BDiscussing feedback to help make innovations more practical and effective in clinical settings" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "590a59dd1a6b", _type: "block", children: [{ _key: "137edf30caf8", _type: "span", marks: [], text: "\u200BExploring pilot programs, validation studies, or new business opportunities" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "dd18729b0021", _type: "block", children: [{ _key: "bbd4b0de2688", _type: "span", marks: [], text: "\u200BLike everything we do at Rellia, this event is about genuine connection. There are no obligations to commit to anything, but you may find someone here who changes the course of your career for the better." }], markDefs: [], style: "normal" }, { _key: "5b0144074e33", _type: "block", children: [{ _key: "a229db3f4343", _type: "span", marks: [], text: "" }], markDefs: [], style: "normal" }, { _key: "623b4d832ee3", _type: "block", children: [{ _key: "58d7b9d777cf", _type: "span", marks: [], text: "Clinician Connect events are open to all clinicians and to Rellia member startups. If you are interested in joining this event, please contact us directly at hello@relliahealth.com" }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: false, endsAt: "2026-08-06T19:00:00.000Z", eventDescription: [{ _key: "9346edb4726e", _type: "block", children: [{ _key: "5a859cd20f93", _type: "span", marks: [], text: "This event is for clinicians and founders to meet and share ideas to make healthcare technology better.\n\nFor " }, { _key: "c769170f2134", _type: "span", marks: ["strong"], text: "healthcare professionals" }, { _key: "64b43dcb264d", _type: "span", marks: [], text: ", this is a chance to share your expertise on what works and what doesn't. We know you're tired of being told to adopt technology that doesn't function the way it should. Your feedback can make a major impact for founders, while also opening potential avenues for advisory or leadership opportunities in the tech industry.\n\nFor " }, { _key: "cd7a3371a3d8", _type: "span", marks: ["strong"], text: "founders" }, { _key: "fbbe7f16ce28", _type: "span", marks: [], text: ", this is a unique opportunity to gain 1:1 feedback directly from interested clinicians. Understanding how your technology will fit into real workflows will help strengthen your product\u2019s design and adoption.\n\nThese sessions can open doors to:" }], markDefs: [], style: "normal" }, { _key: "afae989d1608", _type: "block", children: [{ _key: "262e22a15dc1", _type: "span", marks: [], text: "\u200BCo-developing solutions based on real unmet needs" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "333f000c97da", _type: "block", children: [{ _key: "39773351c100", _type: "span", marks: [], text: "\u200BFilling advisory board member, co-founder, or chief medical officer roles" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "289c1c0a6396", _type: "block", children: [{ _key: "683b071c0bbe", _type: "span", marks: [], text: "\u200BDiscussing feedback to help make innovations more practical and effective in clinical settings" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "590a59dd1a6b", _type: "block", children: [{ _key: "137edf30caf8", _type: "span", marks: [], text: "\u200BExploring pilot programs, validation studies, or new business opportunities" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "dd18729b0021", _type: "block", children: [{ _key: "bbd4b0de2688", _type: "span", marks: [], text: "\u200BLike everything we do at Rellia, this event is about genuine connection. There are no obligations to commit to anything, but you may find someone here who changes the course of your career for the better." }], markDefs: [], style: "normal" }, { _key: "5b0144074e33", _type: "block", children: [{ _key: "a229db3f4343", _type: "span", marks: [], text: "" }], markDefs: [], style: "normal" }, { _key: "623b4d832ee3", _type: "block", children: [{ _key: "58d7b9d777cf", _type: "span", marks: [], text: "Clinician Connect events are open to all clinicians and to Rellia member startups. If you are interested in joining this event, please contact us directly at hello@relliahealth.com" }], markDefs: [], style: "normal" }], hostImageSrc: "https://cdn.sanity.io/images/ggbt0o98/preview/f35c2d83ff181594247872ddb16b44aa6cd1a0fb-192x192.png", href: null, imageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/a878f621db93d4ef3955229066f7b5b72761fa52-1080x1080.jpg", location: "Virtual", lumaEventId: null, person: "Rellia Health", seo: null, slug: "clinician-connect-primary-care", sortOrder: 1, startsAt: "2026-08-06T18:00:00.000Z", status: "visible", ticketingUrl: null, title: "Clinician Connect: Primary Care" }, { addToCalendarEnabled: null, buttonText: null, customLinkButton: null, dateTime: null, detailBody: [{ _key: "ir-p1", _type: "block", children: [{ _key: "ir-p1s", _type: "span", marks: [], text: "Eric Haywood has been on both sides of the investment table. As a four-time founder and investor at InterSystems Ventures, he has built companies, raised capital, and evaluated startups for investment. In this session, he will share what makes a company fundable and how to show up more prepared." }], markDefs: [], style: "normal" }, { _key: "ir-h3", _type: "block", children: [{ _key: "ir-h3s", _type: "span", marks: [], text: "What you will walk away with:" }], markDefs: [], style: "h4" }, { _key: "ir-b1", _type: "block", children: [{ _key: "ir-b1s", _type: "span", marks: [], text: "What VCs look for in early-stage health tech companies" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "ir-b2", _type: "block", children: [{ _key: "ir-b2s", _type: "span", marks: [], text: "What signals separate successful companies from the rest" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "ir-b3", _type: "block", children: [{ _key: "ir-b3s", _type: "span", marks: [], text: "How to tell your story in a way that resonates with investors" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "ir-b4", _type: "block", children: [{ _key: "ir-b4s", _type: "span", marks: [], text: "Common mistakes founders make in the fundraising process and how to avoid them" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "ir-p2", _type: "block", children: [{ _key: "ir-p2s", _type: "span", marks: [], text: "This is a practical, no-fluff session for founders who are serious about fundraising and want an honest look at how the process works." }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: true, endsAt: "2026-06-17T13:00:00-04:00", eventDescription: [{ _key: "ir-p1", _type: "block", children: [{ _key: "ir-p1s", _type: "span", marks: [], text: "Eric Haywood has been on both sides of the investment table. As a four-time founder and investor at InterSystems Ventures, he has built companies, raised capital, and evaluated startups for investment. In this session, he will share what makes a company fundable and how to show up more prepared." }], markDefs: [], style: "normal" }, { _key: "ir-h3", _type: "block", children: [{ _key: "ir-h3s", _type: "span", marks: [], text: "What you will walk away with:" }], markDefs: [], style: "h4" }, { _key: "ir-b1", _type: "block", children: [{ _key: "ir-b1s", _type: "span", marks: [], text: "What VCs look for in early-stage health tech companies" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "ir-b2", _type: "block", children: [{ _key: "ir-b2s", _type: "span", marks: [], text: "What signals separate successful companies from the rest" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "ir-b3", _type: "block", children: [{ _key: "ir-b3s", _type: "span", marks: [], text: "How to tell your story in a way that resonates with investors" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "ir-b4", _type: "block", children: [{ _key: "ir-b4s", _type: "span", marks: [], text: "Common mistakes founders make in the fundraising process and how to avoid them" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "ir-p2", _type: "block", children: [{ _key: "ir-p2s", _type: "span", marks: [], text: "This is a practical, no-fluff session for founders who are serious about fundraising and want an honest look at how the process works." }], markDefs: [], style: "normal" }], hostImageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/e779d3b9ac85cfd35093b6809f9cfdc2bb88607c-1254x1254.png", href: null, imageSrc: "https://cdn.sanity.io/images/ggbt0o98/preview/4eb6c345632ca03e5aa3502431204571641e1331-1200x1200.jpg", location: "Virtual", lumaEventId: "evt-5ONXRkPwM81lwuM", person: "Eric Haywood \u2022 InterSystems Ventures", seo: null, slug: "investor-readiness-how-vcs-evaluate-startups", sortOrder: 2, startsAt: "2026-06-17T12:00:00-04:00", status: "visible", ticketingUrl: null, title: "Investor Readiness: How VCs Evaluate Startups" }, { addToCalendarEnabled: null, buttonText: "View Event", customLinkButton: null, dateTime: null, detailBody: [{ _key: "chai-noai-p1", _type: "block", children: [{ _key: "chai-noai-p1s", _type: "span", marks: [], text: "You've built something that works. So why are you struggling to make the sale?" }], markDefs: [], style: "normal" }, { _key: "chai-noai-p2", _type: "block", children: [{ _key: "chai-noai-p2s", _type: "span", marks: [], text: 'The problem is that healthcare buyers have a different definition of "ready to purchase" than most founders expect.' }], markDefs: [], style: "normal" }, { _key: "chai-noai-p3", _type: "block", children: [{ _key: "chai-noai-p3s", _type: "span", marks: [], text: "This webinar will help you get in the door." }], markDefs: [], style: "normal" }, { _key: "chai-noai-h3", _type: "block", children: [{ _key: "chai-noai-h3s", _type: "span", marks: [], text: "What you'll walk away with:" }], markDefs: [], style: "h4" }, { _key: "chai-noai-li1", _type: "block", children: [{ _key: "chai-noai-li1s", _type: "span", marks: [], text: "How to revise your pitch for what healthcare buyers actually care about" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "chai-noai-li2", _type: "block", children: [{ _key: "chai-noai-li2s", _type: "span", marks: [], text: "How to turn your model card into your most persuasive sales asset" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "chai-noai-li3", _type: "block", children: [{ _key: "chai-noai-li3s", _type: "span", marks: [], text: "What AI regulations actually mean for your product and timeline" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "chai-noai-li4", _type: "block", children: [{ _key: "chai-noai-li4s", _type: "span", marks: [], text: "How to align your positioning with health system priorities instead of only selling your features" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "chai-noai-p4", _type: "block", children: [{ _key: "chai-noai-p4label", _type: "span", marks: ["strong"], text: "Your speaker:" }, { _key: "chai-noai-p4body", _type: "span", marks: [], text: " Brenton Hill, Head of Operations and General Counsel at the Coalition for Health AI (CHAI). Before CHAI, Brenton spent years at Mayo Clinic Platform doing exactly what health system buyers do: evaluating AI vendors, assessing regulatory risk, and deciding what gets purchased." }], markDefs: [], style: "normal" }, { _key: "chai-noai-p5", _type: "block", children: [{ _key: "chai-noai-p5label", _type: "span", marks: ["strong"], text: "About CHAI:" }, { _key: "chai-noai-p5body", _type: "span", marks: [], text: " The nonprofit setting the gold standard for responsible AI in healthcare, representing 3,000+ organizations across health systems, academia, and industry. Their frameworks are increasingly what buyers reference when evaluating AI vendors." }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: null, endsAt: "2026-03-12T18:30:00.000Z", eventDescription: [{ _key: "chai-noai-p1", _type: "block", children: [{ _key: "chai-noai-p1s", _type: "span", marks: [], text: "You've built something that works. So why are you struggling to make the sale?" }], markDefs: [], style: "normal" }, { _key: "chai-noai-p2", _type: "block", children: [{ _key: "chai-noai-p2s", _type: "span", marks: [], text: 'The problem is that healthcare buyers have a different definition of "ready to purchase" than most founders expect.' }], markDefs: [], style: "normal" }, { _key: "chai-noai-p3", _type: "block", children: [{ _key: "chai-noai-p3s", _type: "span", marks: [], text: "This webinar will help you get in the door." }], markDefs: [], style: "normal" }, { _key: "chai-noai-h3", _type: "block", children: [{ _key: "chai-noai-h3s", _type: "span", marks: [], text: "What you'll walk away with:" }], markDefs: [], style: "h4" }, { _key: "chai-noai-li1", _type: "block", children: [{ _key: "chai-noai-li1s", _type: "span", marks: [], text: "How to revise your pitch for what healthcare buyers actually care about" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "chai-noai-li2", _type: "block", children: [{ _key: "chai-noai-li2s", _type: "span", marks: [], text: "How to turn your model card into your most persuasive sales asset" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "chai-noai-li3", _type: "block", children: [{ _key: "chai-noai-li3s", _type: "span", marks: [], text: "What AI regulations actually mean for your product and timeline" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "chai-noai-li4", _type: "block", children: [{ _key: "chai-noai-li4s", _type: "span", marks: [], text: "How to align your positioning with health system priorities instead of only selling your features" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "chai-noai-p4", _type: "block", children: [{ _key: "chai-noai-p4label", _type: "span", marks: ["strong"], text: "Your speaker:" }, { _key: "chai-noai-p4body", _type: "span", marks: [], text: " Brenton Hill, Head of Operations and General Counsel at the Coalition for Health AI (CHAI). Before CHAI, Brenton spent years at Mayo Clinic Platform doing exactly what health system buyers do: evaluating AI vendors, assessing regulatory risk, and deciding what gets purchased." }], markDefs: [], style: "normal" }, { _key: "chai-noai-p5", _type: "block", children: [{ _key: "chai-noai-p5label", _type: "span", marks: ["strong"], text: "About CHAI:" }, { _key: "chai-noai-p5body", _type: "span", marks: [], text: " The nonprofit setting the gold standard for responsible AI in healthcare, representing 3,000+ organizations across health systems, academia, and industry. Their frameworks are increasingly what buyers reference when evaluating AI vendors." }], markDefs: [], style: "normal" }], hostImageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/e5e53133a9232d8d7bc0da6946cf6840beb7e67c-415x415.jpg", href: "https://luma.com/1vx5stu2", imageSrc: null, location: "Virtual", lumaEventId: null, person: "Brenton Hill \u2022 CHAI", seo: null, slug: "why-healthcare-says-no-to-your-ai", sortOrder: 2, startsAt: "2026-03-12T17:00:00.000Z", status: "visible", ticketingUrl: null, title: "Why Healthcare Keeps Saying No to Your AI (And How to Fix It)" }, { addToCalendarEnabled: null, buttonText: "View Event", customLinkButton: null, dateTime: null, detailBody: [{ _key: "qms-p1", _type: "block", children: [{ _key: "qms-p1s", _type: "span", marks: [], text: "Whether you are building a quality management system for the first time or trying to improve the QMS you already have, this session is designed to help you answer your questions." }], markDefs: [], style: "normal" }, { _key: "qms-p2", _type: "block", children: [{ _key: "qms-p2s", _type: "span", marks: [], text: "Join this live 1:1 session with quality experts who have supported medical device teams through writing SOPs, passing certification audits, and securing regulatory approvals." }], markDefs: [], style: "normal" }, { _key: "qms-p3", _type: "block", children: [{ _key: "qms-p3s", _type: "span", marks: [], text: "This is a safe space to ask questions and get guidance on how to build the right-sized QMS processes for your company." }], markDefs: [], style: "normal" }, { _key: "qms-h3", _type: "block", children: [{ _key: "qms-h3s", _type: "span", marks: [], text: "The quality reviewers bring knowledge and experience in:" }], markDefs: [], style: "h4" }, { _key: "qms-b1", _type: "block", children: [{ _key: "qms-b1s", _type: "span", marks: [], text: "ISO 13485" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b2", _type: "block", children: [{ _key: "qms-b2s", _type: "span", marks: [], text: "ISO 14971" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b3", _type: "block", children: [{ _key: "qms-b3s", _type: "span", marks: [], text: "IEC 62304" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b4", _type: "block", children: [{ _key: "qms-b4s", _type: "span", marks: [], text: "ISO 27001" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b5", _type: "block", children: [{ _key: "qms-b5s", _type: "span", marks: [], text: "21 CFR Part 820" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b6", _type: "block", children: [{ _key: "qms-b6s", _type: "span", marks: [], text: "MDSAP" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b7", _type: "block", children: [{ _key: "qms-b7s", _type: "span", marks: [], text: "MDR/IVDR and more" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-p4", _type: "block", children: [{ _key: "qms-p4s", _type: "span", marks: [], text: "Building or updating your QMS does not have to feel overwhelming. Our experts are excited to help you." }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: null, endsAt: "2026-02-19T18:30:00.000Z", eventDescription: [{ _key: "qms-p1", _type: "block", children: [{ _key: "qms-p1s", _type: "span", marks: [], text: "Whether you are building a quality management system for the first time or trying to improve the QMS you already have, this session is designed to help you answer your questions." }], markDefs: [], style: "normal" }, { _key: "qms-p2", _type: "block", children: [{ _key: "qms-p2s", _type: "span", marks: [], text: "Join this live 1:1 session with quality experts who have supported medical device teams through writing SOPs, passing certification audits, and securing regulatory approvals." }], markDefs: [], style: "normal" }, { _key: "qms-p3", _type: "block", children: [{ _key: "qms-p3s", _type: "span", marks: [], text: "This is a safe space to ask questions and get guidance on how to build the right-sized QMS processes for your company." }], markDefs: [], style: "normal" }, { _key: "qms-h3", _type: "block", children: [{ _key: "qms-h3s", _type: "span", marks: [], text: "The quality reviewers bring knowledge and experience in:" }], markDefs: [], style: "h4" }, { _key: "qms-b1", _type: "block", children: [{ _key: "qms-b1s", _type: "span", marks: [], text: "ISO 13485" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b2", _type: "block", children: [{ _key: "qms-b2s", _type: "span", marks: [], text: "ISO 14971" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b3", _type: "block", children: [{ _key: "qms-b3s", _type: "span", marks: [], text: "IEC 62304" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b4", _type: "block", children: [{ _key: "qms-b4s", _type: "span", marks: [], text: "ISO 27001" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b5", _type: "block", children: [{ _key: "qms-b5s", _type: "span", marks: [], text: "21 CFR Part 820" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b6", _type: "block", children: [{ _key: "qms-b6s", _type: "span", marks: [], text: "MDSAP" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-b7", _type: "block", children: [{ _key: "qms-b7s", _type: "span", marks: [], text: "MDR/IVDR and more" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "qms-p4", _type: "block", children: [{ _key: "qms-p4s", _type: "span", marks: [], text: "Building or updating your QMS does not have to feel overwhelming. Our experts are excited to help you." }], markDefs: [], style: "normal" }], hostImageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/e8bfd9a17a132647e49c7c9432ebfbfa59674c5a-1024x1024.jpg", href: "https://luma.com/w61qj0g5", imageSrc: null, location: "Virtual", lumaEventId: null, person: "QMS Expert Panel \u2022 Rellia Health", seo: null, slug: "ask-a-qms-expert", sortOrder: 3, startsAt: "2026-02-19T17:00:00.000Z", status: "visible", ticketingUrl: null, title: "Ask a QMS Expert" }, { addToCalendarEnabled: null, buttonText: "View Event", customLinkButton: null, dateTime: null, detailBody: [{ _key: "sys-p1", _type: "block", children: [{ _key: "sys-p1s", _type: "span", marks: [], text: "Learn about how small adjustments to your physicality and storytelling create a big stage presence, with public speaking coach, Alexis Orchard." }], markDefs: [], style: "normal" }, { _key: "sys-p2", _type: "block", children: [{ _key: "sys-p2s", _type: "span", marks: [], text: "We will share quick, practical adjustments you can start using right away so you can deliver your health tech pitch with more ease and authority." }], markDefs: [], style: "normal" }, { _key: "sys-p3", _type: "block", children: [{ _key: "sys-p3s", _type: "span", marks: [], text: "This session will focus on how you show up: body language, vocal tone, and the way you tell your story so people actually remember it." }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: null, endsAt: "2025-12-04T18:30:00.000Z", eventDescription: [{ _key: "sys-p1", _type: "block", children: [{ _key: "sys-p1s", _type: "span", marks: [], text: "Learn about how small adjustments to your physicality and storytelling create a big stage presence, with public speaking coach, Alexis Orchard." }], markDefs: [], style: "normal" }, { _key: "sys-p2", _type: "block", children: [{ _key: "sys-p2s", _type: "span", marks: [], text: "We will share quick, practical adjustments you can start using right away so you can deliver your health tech pitch with more ease and authority." }], markDefs: [], style: "normal" }, { _key: "sys-p3", _type: "block", children: [{ _key: "sys-p3s", _type: "span", marks: [], text: "This session will focus on how you show up: body language, vocal tone, and the way you tell your story so people actually remember it." }], markDefs: [], style: "normal" }], hostImageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/53263ebddea4e0e7369e5e8d602de19193450b37-1024x1024.jpg", href: "https://luma.com/5s736thc", imageSrc: null, location: "Virtual", lumaEventId: null, person: "Alexis Orchard \u2022 Orchard Presents", seo: null, slug: "set-your-stage", sortOrder: 4, startsAt: "2025-12-04T12:00:00-05:00", status: "visible", ticketingUrl: null, title: "Set Your Stage" }, { addToCalendarEnabled: null, buttonText: "View Event", customLinkButton: null, dateTime: null, detailBody: [{ _key: "cc-p1", _type: "block", children: [{ _key: "cc-p1s", _type: "span", marks: [], text: "This event is for clinicians and founders to meet and share ideas to make healthcare technology better." }], markDefs: [], style: "normal" }, { _key: "cc-p2", _type: "block", children: [{ _key: "cc-p2s", _type: "span", marks: [], text: "For healthcare professionals, this is a chance to share your expertise on what works and what doesn't. We know you're tired of being told to adopt technology that doesn't function the way it should. Your feedback can make a major impact for founders, while also opening potential avenues for advisory or leadership opportunities in the tech industry." }], markDefs: [], style: "normal" }, { _key: "cc-p3", _type: "block", children: [{ _key: "cc-p3s", _type: "span", marks: [], text: "For founders, this is a unique opportunity to gain 1:1 feedback directly from interested clinicians. Understanding how your technology will fit into real workflows will help strengthen your product's design and adoption." }], markDefs: [], style: "normal" }, { _key: "cc-h3", _type: "block", children: [{ _key: "cc-h3s", _type: "span", marks: [], text: "These sessions can open doors to:" }], markDefs: [], style: "h3" }, { _key: "cc-b1", _type: "block", children: [{ _key: "cc-b1s", _type: "span", marks: [], text: "Co-developing solutions based on real unmet needs" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "cc-b2", _type: "block", children: [{ _key: "cc-b2s", _type: "span", marks: [], text: "Filling advisory board member, co-founder, or chief medical officer roles" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "cc-b3", _type: "block", children: [{ _key: "cc-b3s", _type: "span", marks: [], text: "Discussing feedback to help make innovations more practical and effective in clinical settings" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "cc-b4", _type: "block", children: [{ _key: "cc-b4s", _type: "span", marks: [], text: "Exploring pilot programs, validation studies, or new business opportunities" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "cc-p4", _type: "block", children: [{ _key: "cc-p4s", _type: "span", marks: [], text: "Like everything we do at Rellia and Thrive MD Connect, this event is about genuine connection. There are no obligations to commit to anything, but you may find someone here who changes the course of your career for the better." }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: null, endsAt: "2025-11-20T18:30:00.000Z", eventDescription: [{ _key: "cc-p1", _type: "block", children: [{ _key: "cc-p1s", _type: "span", marks: [], text: "This event is for clinicians and founders to meet and share ideas to make healthcare technology better." }], markDefs: [], style: "normal" }, { _key: "cc-p2", _type: "block", children: [{ _key: "cc-p2s", _type: "span", marks: [], text: "For healthcare professionals, this is a chance to share your expertise on what works and what doesn't. We know you're tired of being told to adopt technology that doesn't function the way it should. Your feedback can make a major impact for founders, while also opening potential avenues for advisory or leadership opportunities in the tech industry." }], markDefs: [], style: "normal" }, { _key: "cc-p3", _type: "block", children: [{ _key: "cc-p3s", _type: "span", marks: [], text: "For founders, this is a unique opportunity to gain 1:1 feedback directly from interested clinicians. Understanding how your technology will fit into real workflows will help strengthen your product's design and adoption." }], markDefs: [], style: "normal" }, { _key: "cc-h3", _type: "block", children: [{ _key: "cc-h3s", _type: "span", marks: [], text: "These sessions can open doors to:" }], markDefs: [], style: "h3" }, { _key: "cc-b1", _type: "block", children: [{ _key: "cc-b1s", _type: "span", marks: [], text: "Co-developing solutions based on real unmet needs" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "cc-b2", _type: "block", children: [{ _key: "cc-b2s", _type: "span", marks: [], text: "Filling advisory board member, co-founder, or chief medical officer roles" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "cc-b3", _type: "block", children: [{ _key: "cc-b3s", _type: "span", marks: [], text: "Discussing feedback to help make innovations more practical and effective in clinical settings" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "cc-b4", _type: "block", children: [{ _key: "cc-b4s", _type: "span", marks: [], text: "Exploring pilot programs, validation studies, or new business opportunities" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "cc-p4", _type: "block", children: [{ _key: "cc-p4s", _type: "span", marks: [], text: "Like everything we do at Rellia and Thrive MD Connect, this event is about genuine connection. There are no obligations to commit to anything, but you may find someone here who changes the course of your career for the better." }], markDefs: [], style: "normal" }], hostImageSrc: null, href: "https://luma.com/k6fbogr8", imageSrc: null, location: "Virtual", lumaEventId: null, person: "Rellia Health \u2022 Maman Biomedical", seo: null, slug: "clinician-connect-womens-health", sortOrder: 5, startsAt: "2025-11-20T12:00:00-05:00", status: "visible", ticketingUrl: null, title: "Clinician Connect: Women's Health" }, { addToCalendarEnabled: null, buttonText: "View Event", customLinkButton: null, dateTime: null, detailBody: [{ _key: "swp-p1", _type: "block", children: [{ _key: "swp-p1s", _type: "span", marks: [], text: "This session explores the commercialization journey for health startups, focusing on how to move beyond the prototype stage and build a purposeful business strategy that connects your idea to your customer's needs." }], markDefs: [], style: "normal" }, { _key: "swp-p2", _type: "block", children: [{ _key: "swp-p2s", _type: "span", marks: [], text: "Drawing on real-world expertise, we'll cover the critical elements of funding and business strategy from prototype to scale, and why understanding the foundations of your business creates the path for success." }], markDefs: [], style: "normal" }, { _key: "swp-p3", _type: "block", children: [{ _key: "swp-p3s", _type: "span", marks: [], text: "Attendees will leave with actionable insights on how to avoid common pitfalls, position their product for adoption, and scale with intention in the competitive health innovation landscape." }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: null, endsAt: "2025-11-13T18:30:00.000Z", eventDescription: [{ _key: "swp-p1", _type: "block", children: [{ _key: "swp-p1s", _type: "span", marks: [], text: "This session explores the commercialization journey for health startups, focusing on how to move beyond the prototype stage and build a purposeful business strategy that connects your idea to your customer's needs." }], markDefs: [], style: "normal" }, { _key: "swp-p2", _type: "block", children: [{ _key: "swp-p2s", _type: "span", marks: [], text: "Drawing on real-world expertise, we'll cover the critical elements of funding and business strategy from prototype to scale, and why understanding the foundations of your business creates the path for success." }], markDefs: [], style: "normal" }, { _key: "swp-p3", _type: "block", children: [{ _key: "swp-p3s", _type: "span", marks: [], text: "Attendees will leave with actionable insights on how to avoid common pitfalls, position their product for adoption, and scale with intention in the competitive health innovation landscape." }], markDefs: [], style: "normal" }], hostImageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/d16304eb5eb290d15fbc636e377447b27d7dc3a9-2400x2400.jpg", href: null, imageSrc: null, location: "Virtual", lumaEventId: null, person: "Lisa Marceau \u2022 Alpha Millennial Health", seo: null, slug: "scaling-with-purpose-from-prototype-to-customer-in-health-startups", sortOrder: 6, startsAt: "2025-11-13T12:00:00-05:00", status: "visible", ticketingUrl: null, title: "Scaling with Purpose: From Prototype to Customer in Health Startups" }, { addToCalendarEnabled: null, buttonText: "View Event", customLinkButton: null, dateTime: null, detailBody: [{ _key: "btp-p1", _type: "block", children: [{ _key: "btp-p1s", _type: "span", marks: [], text: "Most digital health founders lead with technology, but growth starts with trust. Beyond the Product helps you turn complex science into a clear, credible brand that connects with the people who matter most\u2014investors, partners, and patients." }], markDefs: [], style: "normal" }, { _key: "btp-p2", _type: "block", children: [{ _key: "btp-p2s", _type: "span", marks: [], text: "Rellia has partnered with Brave Tale to bring you a workshop for translating your technical product features into a compelling brand story." }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: null, endsAt: "2025-10-23T17:30:00.000Z", eventDescription: [{ _key: "btp-p1", _type: "block", children: [{ _key: "btp-p1s", _type: "span", marks: [], text: "Most digital health founders lead with technology, but growth starts with trust. Beyond the Product helps you turn complex science into a clear, credible brand that connects with the people who matter most\u2014investors, partners, and patients." }], markDefs: [], style: "normal" }, { _key: "btp-p2", _type: "block", children: [{ _key: "btp-p2s", _type: "span", marks: [], text: "Rellia has partnered with Brave Tale to bring you a workshop for translating your technical product features into a compelling brand story." }], markDefs: [], style: "normal" }], hostImageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/8b62d26b8e10549f4828c41036c34a17e6ab2d05-2000x2000.jpg", href: null, imageSrc: null, location: "Virtual", lumaEventId: null, person: "Kelly MacDonald & Michele Fog \u2022 Bravetale", seo: null, slug: "beyond-the-product-how-digital-health-brands-earn-trust-and-drive-growth", sortOrder: 7, startsAt: "2025-10-23T12:00:00-04:00", status: "visible", ticketingUrl: null, title: "Beyond the Product: How digital health brands earn trust and drive growth" }, { addToCalendarEnabled: null, buttonText: "View Event", customLinkButton: null, dateTime: null, detailBody: [{ _key: "pv-p1", _type: "block", children: [{ _key: "pv-p1s", _type: "span", marks: [], text: "Rellia members get exclusive access to 1:1 pitch opportunities with Forum Ventures, a leading early-stage fund for B2B SaaS founders." }], markDefs: [], style: "normal" }, { _key: "pv-p2", _type: "block", children: [{ _key: "pv-p2s", _type: "span", marks: [], text: "No crowded competitions or flashy events\u2014just direct conversations about what you're building with people who want to help you grow." }], markDefs: [], style: "normal" }, { _key: "pv-p3", _type: "block", children: [{ _key: "pv-p3s", _type: "span", marks: [], text: "Forum has backed 500+ companies who went on to raise over $1B in follow-on funding. Now they're looking at healthcare startups innovating in:" }], markDefs: [], style: "normal" }, { _key: "pv-b1", _type: "block", children: [{ _key: "pv-b1s", _type: "span", marks: [], text: "Staff management: tackling shortages and burnout with tools that improve retention, create flexible staffing, or offload manual work." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "pv-b2", _type: "block", children: [{ _key: "pv-b2s", _type: "span", marks: [], text: "Operational efficiency: reducing patient length of stay, preventing denials, and streamlining communication through AI and automation." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "pv-b3", _type: "block", children: [{ _key: "pv-b3s", _type: "span", marks: [], text: "Access to care: hybrid and virtual models that expand reach, improve patient engagement, and tie directly to outcomes in risk-based contracts." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "pv-p4", _type: "block", children: [{ _key: "pv-p4s", _type: "span", marks: [], text: "This is your chance to connect with investors who are actively writing checks and genuinely excited about healthcare innovation." }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: null, endsAt: "2025-10-16T18:00:00.000Z", eventDescription: [{ _key: "pv-p1", _type: "block", children: [{ _key: "pv-p1s", _type: "span", marks: [], text: "Rellia members get exclusive access to 1:1 pitch opportunities with Forum Ventures, a leading early-stage fund for B2B SaaS founders." }], markDefs: [], style: "normal" }, { _key: "pv-p2", _type: "block", children: [{ _key: "pv-p2s", _type: "span", marks: [], text: "No crowded competitions or flashy events\u2014just direct conversations about what you're building with people who want to help you grow." }], markDefs: [], style: "normal" }, { _key: "pv-p3", _type: "block", children: [{ _key: "pv-p3s", _type: "span", marks: [], text: "Forum has backed 500+ companies who went on to raise over $1B in follow-on funding. Now they're looking at healthcare startups innovating in:" }], markDefs: [], style: "normal" }, { _key: "pv-b1", _type: "block", children: [{ _key: "pv-b1s", _type: "span", marks: [], text: "Staff management: tackling shortages and burnout with tools that improve retention, create flexible staffing, or offload manual work." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "pv-b2", _type: "block", children: [{ _key: "pv-b2s", _type: "span", marks: [], text: "Operational efficiency: reducing patient length of stay, preventing denials, and streamlining communication through AI and automation." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "pv-b3", _type: "block", children: [{ _key: "pv-b3s", _type: "span", marks: [], text: "Access to care: hybrid and virtual models that expand reach, improve patient engagement, and tie directly to outcomes in risk-based contracts." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "pv-p4", _type: "block", children: [{ _key: "pv-p4s", _type: "span", marks: [], text: "This is your chance to connect with investors who are actively writing checks and genuinely excited about healthcare innovation." }], markDefs: [], style: "normal" }], hostImageSrc: null, href: null, imageSrc: null, location: "Virtual", lumaEventId: null, person: "Rellia Health \u2022 Company event", seo: null, slug: "rellia-pitch-event-forum-ventures", sortOrder: 8, startsAt: "2025-10-16T12:30:00-04:00", status: "visible", ticketingUrl: null, title: "Rellia Pitch Event: Forum Ventures" }, { addToCalendarEnabled: null, buttonText: "View Event", customLinkButton: null, dateTime: null, detailBody: [{ _key: "eth-ai-p1", _type: "block", children: [{ _key: "eth-ai-p1s", _type: "span", marks: [], text: "AI ethics is often framed as a technical checklist\u2014fairness, transparency, accountability. But the truth is, the biggest risks in AI don't come from the machines. They come from us. From the assumptions we code in, the decisions we greenlight, and the people we leave out of the room." }], markDefs: [], style: "normal" }, { _key: "eth-ai-p2", _type: "block", children: [{ _key: "eth-ai-p2s", _type: "span", marks: [], text: "Join Argentina Beltran, founder of InclusifAI and author of What We Teach the Machines, for a provocative and honest talk on the human side of AI ethics. Through real-world case studies and personal storytelling, she'll challenge us to see ethics not as an abstract framework, but as a mirror\u2014asking what we're teaching the machines, and whether we're willing to learn from ourselves." }], markDefs: [], style: "normal" }, { _key: "eth-ai-p3", _type: "block", children: [{ _key: "eth-ai-p3s", _type: "span", marks: [], text: "Hosted by Rellia Health and StartUp Lab, this session is for builders, funders, and anyone shaping AI systems who wants to move beyond buzzwords toward responsibility with depth, courage, and humanity." }], markDefs: [], style: "normal" }, { _key: "eth-ai-p4", _type: "block", children: [{ _key: "eth-ai-p4s", _type: "span", marks: [], text: "We are official event hosts with Waterloo Tech Week 2025, a celebration of what's been built here, and what's still to come. We're building something great together. September 8-11, 2025. waterlootechweek.ca" }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: null, endsAt: "2025-09-11T19:30:00.000Z", eventDescription: [{ _key: "eth-ai-p1", _type: "block", children: [{ _key: "eth-ai-p1s", _type: "span", marks: [], text: "AI ethics is often framed as a technical checklist\u2014fairness, transparency, accountability. But the truth is, the biggest risks in AI don't come from the machines. They come from us. From the assumptions we code in, the decisions we greenlight, and the people we leave out of the room." }], markDefs: [], style: "normal" }, { _key: "eth-ai-p2", _type: "block", children: [{ _key: "eth-ai-p2s", _type: "span", marks: [], text: "Join Argentina Beltran, founder of InclusifAI and author of What We Teach the Machines, for a provocative and honest talk on the human side of AI ethics. Through real-world case studies and personal storytelling, she'll challenge us to see ethics not as an abstract framework, but as a mirror\u2014asking what we're teaching the machines, and whether we're willing to learn from ourselves." }], markDefs: [], style: "normal" }, { _key: "eth-ai-p3", _type: "block", children: [{ _key: "eth-ai-p3s", _type: "span", marks: [], text: "Hosted by Rellia Health and StartUp Lab, this session is for builders, funders, and anyone shaping AI systems who wants to move beyond buzzwords toward responsibility with depth, courage, and humanity." }], markDefs: [], style: "normal" }, { _key: "eth-ai-p4", _type: "block", children: [{ _key: "eth-ai-p4s", _type: "span", marks: [], text: "We are official event hosts with Waterloo Tech Week 2025, a celebration of what's been built here, and what's still to come. We're building something great together. September 8-11, 2025. waterlootechweek.ca" }], markDefs: [], style: "normal" }], hostImageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/b0efdda2133bf3021a5718c1bb7d5d4b45eb6501-800x800.png", href: null, imageSrc: null, location: "Virtual", lumaEventId: null, person: "Argentina Beltran \u2022 InclusifAI, Waterloo Tech Week, StartUp Lab Laurier", seo: null, slug: "ethics-in-ai-less-about-tech-more-about-humans", sortOrder: 9, startsAt: "2025-09-11T14:00:00-04:00", status: "visible", ticketingUrl: null, title: "Ethics in AI: Less About Tech, More About Humans" }, { addToCalendarEnabled: null, buttonText: "View Event", customLinkButton: null, dateTime: null, detailBody: [{ _key: "so-p1", _type: "block", children: [{ _key: "so-p1s", _type: "span", marks: [], text: "You're building healthcare products that need to work for real patients and providers, but how do you know if you're on the right track?" }], markDefs: [], style: "normal" }, { _key: "so-p2", _type: "block", children: [{ _key: "so-p2s", _type: "span", marks: [], text: "Join a seasoned UX researcher with 20 years of experience in health tech to see how user research actually works in practice." }], markDefs: [], style: "normal" }, { _key: "so-p3", _type: "block", children: [{ _key: "so-p3s", _type: "span", marks: [], text: "We'll start with a real case study from a healthcare startup that used research to dramatically improve their onboarding\u2014and the impressive numbers that followed. Then we'll break down the decisions behind the research: how they chose the right methods, found the right participants, and turned insights into action." }], markDefs: [], style: "normal" }, { _key: "so-p4", _type: "block", children: [{ _key: "so-p4s", _type: "span", marks: [], text: "Walk away understanding when research makes sense for your startup and when it's time to bring in expert help." }], markDefs: [], style: "normal" }], detailBodyHeading: "About this session", embedLumaOnDetailPage: null, endsAt: "2025-08-14T18:30:00.000Z", eventDescription: [{ _key: "so-p1", _type: "block", children: [{ _key: "so-p1s", _type: "span", marks: [], text: "You're building healthcare products that need to work for real patients and providers, but how do you know if you're on the right track?" }], markDefs: [], style: "normal" }, { _key: "so-p2", _type: "block", children: [{ _key: "so-p2s", _type: "span", marks: [], text: "Join a seasoned UX researcher with 20 years of experience in health tech to see how user research actually works in practice." }], markDefs: [], style: "normal" }, { _key: "so-p3", _type: "block", children: [{ _key: "so-p3s", _type: "span", marks: [], text: "We'll start with a real case study from a healthcare startup that used research to dramatically improve their onboarding\u2014and the impressive numbers that followed. Then we'll break down the decisions behind the research: how they chose the right methods, found the right participants, and turned insights into action." }], markDefs: [], style: "normal" }, { _key: "so-p4", _type: "block", children: [{ _key: "so-p4s", _type: "span", marks: [], text: "Walk away understanding when research makes sense for your startup and when it's time to bring in expert help." }], markDefs: [], style: "normal" }], hostImageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/3541b531e951975a0b64b4dfdefc31d473e880fd-1024x1024.jpg", href: null, imageSrc: null, location: "Virtual", lumaEventId: null, person: "Janna Kimel \u2022 Third Brain Studio", seo: null, slug: "second-opinion-when-healthcare-startups-need-user-research", sortOrder: 10, startsAt: "2025-08-14T13:00:00-04:00", status: "visible", ticketingUrl: null, title: "Second Opinion: When Healthcare Startups Need User Research" }];
  }
});

// shared/cms/build-snapshots/openRoles.json
var openRoles_default;
var init_openRoles = __esm({
  "shared/cms/build-snapshots/openRoles.json"() {
    openRoles_default = [{ applyButtonLabel: "Apply", applyButtonUrl: "mailto:megan.kane@relliahealth.com", description: [{ _key: "legacy-p-0", _type: "block", children: [{ _key: "legacy-p-0-span", _type: "span", marks: ["strong"], text: "Company Description" }], markDefs: [], style: "normal" }, { _key: "legacy-p-1", _type: "block", children: [{ _key: "legacy-p-1-span", _type: "span", marks: [], text: "Rellia Health offers regulatory and quality consulting for early-stage startups. We work with medical device and SaMD companies at pivotal moments: their first 510(k), their first QMS, their first Health Canada licensing decision, the question of whether their software is a device at all. The clients who come to us are often navigating these questions for the first time, and they're trusting us to guide them through it.\n" }], markDefs: [], style: "normal" }, { _key: "role-team-photo", _type: "eventDetailInlineImage", alt: "Healthcare professionals collaborating at Rellia", displayMode: "cropped", imageSrc: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900" }, { _key: "legacy-p-2", _type: "block", children: [{ _key: "legacy-p-2-span", _type: "span", marks: ["strong"], text: "Role Description" }], markDefs: [], style: "normal" }, { _key: "legacy-p-3", _type: "block", children: [{ _key: "legacy-p-3-span", _type: "span", marks: [], text: "This is virtual, project-based, independent contractor work. There is no minimum hourly commitment and you'll have complete flexibility in your working hours and hourly rate. In this position, you will guide clients on regulatory compliance and quality management systems specific to Software as a Medical Device (SaMD). Duties include developing quality management systems, conducting mock audits, analyzing regulatory requirements, advising strategies for compliance, and ensuring product documentation meets industry standards.\n" }], markDefs: [], style: "normal" }, { _key: "legacy-p-4", _type: "block", children: [{ _key: "legacy-p-4-span", _type: "span", marks: [], text: "We're looking for a consultant to grow alongside us and who wants to be part of building something worthwhile.\n" }], markDefs: [], style: "normal" }, { _key: "legacy-p-5", _type: "block", children: [{ _key: "legacy-p-5-span", _type: "span", marks: ["strong"], text: "Qualifications" }], markDefs: [], style: "normal" }, { _key: "legacy-b-6-0", _type: "block", children: [{ _key: "legacy-b-6-0-span", _type: "span", marks: [], text: "ISO 13485 or MDSAP Quality Management Systems, especially those built for lean startups" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-b-6-1", _type: "block", children: [{ _key: "legacy-b-6-1-span", _type: "span", marks: [], text: "IEC 62304 Software Development Lifecycle practices" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-b-6-2", _type: "block", children: [{ _key: "legacy-b-6-2-span", _type: "span", marks: [], text: "FDA SaMD guidance documents or equivalent" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-b-6-3", _type: "block", children: [{ _key: "legacy-b-6-3-span", _type: "span", marks: [], text: "510(k), De Novo, or PMA submissions or equivalent" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-b-6-4", _type: "block", children: [{ _key: "legacy-b-6-4-span", _type: "span", marks: [], text: "Cybersecurity and privacy regulations" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-b-6-5", _type: "block", children: [{ _key: "legacy-b-6-5-span", _type: "span", marks: [], text: "You understand what makes a QMS functional versus performative" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-b-6-6", _type: "block", children: [{ _key: "legacy-b-6-6-span", _type: "span", marks: [], text: "You can translate standards into practical systems that small teams can - actually maintain" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-b-6-7", _type: "block", children: [{ _key: "legacy-b-6-7-span", _type: "span", marks: [], text: "You are comfortable presenting directly to customers and regulators" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-b-6-8", _type: "block", children: [{ _key: "legacy-b-6-8-span", _type: "span", marks: [], text: "Experience working in the health tech or medical device industry" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-b-6-9", _type: "block", children: [{ _key: "legacy-b-6-9-span", _type: "span", marks: [], text: "No previous consulting experience is necessary\n" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-p-7", _type: "block", children: [{ _key: "legacy-p-7-span", _type: "span", marks: ["strong"], text: "Who You Are" }], markDefs: [], style: "normal" }, { _key: "legacy-p-8", _type: "block", children: [{ _key: "legacy-p-8-span", _type: "span", marks: [], text: "Credentials and technical knowledge matter here, but the people we work best with tend to share a few less obvious traits." }], markDefs: [], style: "normal" }, { _key: "legacy-p-9", _type: "block", children: [{ _key: "legacy-p-9-span", _type: "span", marks: [], text: "You Make Work Fun - A lot of clients are afraid that regulatory is painful and confusing. We keep the experience light, help founders gain confidence in their understanding of compliance, and try to have a good time while we do it." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-p-10", _type: "block", children: [{ _key: "legacy-p-10-span", _type: "span", marks: [], text: "You Know When To Be Flexible - Compliance does not have to be rigid. We are open to creative approaches that fit startups and new ways of meeting requirements. We use automations and tech tools to keep things as easy as possible for everyone." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-p-11", _type: "block", children: [{ _key: "legacy-p-11-span", _type: "span", marks: [], text: "You Work Efficiently - If we\u2019re working with a startup with a tight budget, we do our best to keep our work as efficient as we can for them." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-p-12", _type: "block", children: [{ _key: "legacy-p-12-span", _type: "span", marks: [], text: "You Provide Credibility - Our clients our using our suggestions and opinions to guide major strategic decisions, so they have to trust that we\u2019re right. If we\u2019re not sure about something, we rely on each other to get a second opinion." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-p-13", _type: "block", children: [{ _key: "legacy-p-13-span", _type: "span", marks: [], text: "You Have Integrity - We\u2019re are on the same team as our clients, not an adversary. We don\u2019t work with jerks. Don\u2019t be a jerk either." }], level: 1, listItem: "bullet", markDefs: [], style: "normal" }, { _key: "legacy-p-14", _type: "block", children: [{ _key: "legacy-p-14-span", _type: "span", marks: [], text: `If you've read this and thought "yes, that's me" - we'd love to meet you. Email your resume to megan.kane@relliahealth.com.` }], markDefs: [], style: "normal" }], employmentType: "Part-Time", excerpt: null, id: "qaraconsultant", linkedInApplyUrl: "mailto:megan.kane@relliahealth.com", location: "Remote", responsibilities: ["Develop quality management systems for Software as a Medical Device (SaMD) clients", "Conduct mock audits and analyze regulatory requirements", "Advise on FDA SaMD guidance, 510(k), De Novo, or PMA submissions and equivalents", "Apply ISO 13485 / MDSAP and IEC 62304 practices for lean startup teams", "Guide cybersecurity, privacy, and product documentation to meet industry standards", "Present directly to customers and regulators with practical, maintainable compliance systems"], roleCtaBody: null, roleCtaPrimaryHref: null, roleCtaPrimaryLabel: null, roleCtaSecondaryHref: null, roleCtaSecondaryLabel: null, roleCtaTitle: null, title: "Regulatory & Quality Consultant - SaMD" }];
  }
});

// shared/cms/build-snapshots/stories.json
var stories_default;
var init_stories = __esm({
  "shared/cms/build-snapshots/stories.json"() {
    stories_default = [{ coverImageAlt: null, coverImageSrc: null, excerpt: "Choosing between a generic startup accelerator and a healthcare-focused incubator shapes your regulatory path, mentor access, and warm introductions. Here is how Rellia compares for digital health, SaMD, and medtech founders.", featured: true, headerLayout: "block", publishedAt: "2026-06-29T12:00:00.000Z", seo: { metaDescription: "Compare generic accelerators, traditional incubators, and Rellia Health for SaMD and medtech founders\u2014regulatory depth, mentor network, peer community, and evidence-first support.", metaTitle: "Digital Health Incubator vs Accelerator | Rellia Health", noFollow: null, noIndex: null, ogDescription: null, ogImageUrl: null, ogTitle: null }, slug: "digital-health-incubator-vs-accelerator-rellia", tag: "Industry Insight", title: "Digital Health Incubator vs Accelerator: How Rellia Compares for SaMD and Medtech Founders" }, { coverImageAlt: "Website launch header graphic", coverImageSrc: "https://cdn.sanity.io/images/ggbt0o98/production/122eff707d8b0d93ad65d3f2f19a1509f1648231-1920x1080.png", excerpt: "Welcome to Rellia. We have redesigned our digital home to help you benchmark readiness, access specialized programs, and explore our healthcare network\u2014all in one place.", featured: true, headerLayout: "block", publishedAt: "2026-06-01T00:00:00.000Z", seo: null, slug: "a-clearer-path-for-digital-health-founders", tag: "Program Update", title: "A clearer path for digital health founders." }];
  }
});

// shared/cms/build-snapshots/careersPage.json
var careersPage_default;
var init_careersPage = __esm({
  "shared/cms/build-snapshots/careersPage.json"() {
    careersPage_default = { careersContentMode: "both", ctaBody: "Tell us what you are looking for\u2014we are happy to point you to the right conversation.", ctaPrimaryHref: "/contact", ctaPrimaryLabel: "Get in touch", ctaSecondaryHref: null, ctaSecondaryLabel: null, ctaTitle: "Questions before you apply?", heroEyebrow: "Join the team", heroImageSrc: null, heroPrimaryCtaHref: null, heroPrimaryCtaLabel: null, heroSecondaryCtaHref: null, heroSecondaryCtaLabel: null, heroSubtitle: "We connect founders, clinicians, and capital so the right ideas reach patients. If you thrive in fast-moving, mission-driven environments, we would love to meet you.", heroTitlePortable: [{ _key: "three-part", _type: "block", children: [{ _key: "three-part-s0", _type: "span", marks: [], text: "Build the" }, { _key: "three-part-s1", _type: "span", marks: ["mint"], text: " future of health" }, { _key: "three-part-s2", _type: "span", marks: [], text: " at Rellia" }], markDefs: [], style: "normal" }], heroTitleSuffix: null, lifeAtRelliaHeadingPortable: [{ _key: "legacy-string", _type: "block", children: [{ _key: "legacy-string-span", _type: "span", marks: [], text: "Built by healthtech insiders, for builders" }], markDefs: [], style: "normal" }], lifeAtRelliaImages: [{ _key: "careers-life-at-rellia-0", alt: "", src: "https://cdn.sanity.io/images/ggbt0o98/preview/e5933f42c82c5bf993b445c466f64944db0ea521-800x534.jpg" }, { _key: "careers-life-at-rellia-1", alt: "", src: "https://cdn.sanity.io/images/ggbt0o98/preview/62650ea086c344d5c48daf0f06cb2767d63de5db-800x534.jpg" }, { _key: "careers-life-at-rellia-2", alt: "", src: "https://cdn.sanity.io/images/ggbt0o98/preview/0bed8c18742d5f4f672cafec75eee05e276ac4a7-800x450.jpg" }], lifeAtRelliaLinks: [{ _key: "linkedin", iconKey: "linkedin", platformName: "LinkedIn", tooltip: "Follow us on LinkedIn", url: "https://www.linkedin.com/company/rellia-health" }, { _key: "instagram", iconKey: "instagram", platformName: "Instagram", tooltip: "Follow us on Instagram", url: "https://www.instagram.com/relliahealth" }], lifeAtRelliaSubheading: "We are a remote-first, high-standards team of builders, clinicians, and operators dedicated to supporting healthtech founders. We cultivate an environment of high autonomy, rapid iteration, and deep clinical empathy to build the future of care.", openRolesSubtitle: "Join a remote-first team building what matters in healthtech.", openRolesTitlePortable: [{ _key: "two-part", _type: "block", children: [{ _key: "two-part-s0", _type: "span", marks: [], text: "Open" }, { _key: "two-part-s1", _type: "span", marks: ["teal"], text: " Roles" }], markDefs: [], style: "normal" }], perksDescription: "A lean health-tech team: industry proximity, intentional office time, and the pace of a startup\u2014not a corporate perks sheet.", perksItems: [{ _key: null, body: "Clinicians, founders, and operators show up in our programs\u2014you hear what actually moves care and procurement, not polished slide stories.", iconKey: "users", title: "In the room with the industry" }, { _key: null, body: "Remote-first with intentional in-person weeks: cohort sessions, workshops, and shared space when you want to work beside the team.", iconKey: "building2", title: "Office when it helps" }, { _key: null, body: "Startup reality: clear priorities, Direct feedback, and permission to fix how we work\u2014without layers of process for its own sake.", iconKey: "laptop", title: "Small team, real ownership" }, { _key: null, body: "Member events, partner conversations, and field context on how buying decisions get made\u2014so you are not guessing from a distance.", iconKey: "mapPin", title: "Out with the community" }], perksTitlePortable: [{ _key: "legacy-string", _type: "block", children: [{ _key: "legacy-string-span", _type: "span", marks: [], text: "How we work" }], markDefs: [], style: "normal" }], sections: null, seo: { metaDescription: "Explore open roles at Rellia Health. Join a mission-driven team connecting health tech founders with clinicians, advisors, and investors.", metaTitle: "Careers \u2014 Rellia Health", noFollow: false, noIndex: false, ogDescription: "Explore open roles at Rellia Health. Join a mission-driven team connecting health tech founders with clinicians, advisors, and investors.", ogImageUrl: null, ogTitle: "Careers \u2014 Rellia Health" }, showHiringNavBadge: false, showVolunteerNavBadge: false, whyDescription: "What it feels like to build here: pace without panic, depth without gatekeeping, and a team that sweats the small stuff so members do not have to.", whyFeatures: [{ _key: null, body: "Every week you will see founders ship, learn, and reset with support from people who have been in the room when healthcare products actually get adopted.", buttonLabel: null, buttonPath: null, iconKey: "users", imageSrc: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Mission you can feel" }, { _key: null, body: "We run tight programs with clear owners, thoughtful rituals, and space to improve how we work\u2014so energy goes to members and outcomes, not noise.", buttonLabel: null, buttonPath: null, iconKey: "target", imageSrc: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Craft, not chaos" }, { _key: null, body: "You will sit alongside clinicians, operators, and investors who care about getting the details right\u2014from diligence to deployment.", buttonLabel: null, buttonPath: null, iconKey: "bookOpen", imageSrc: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Learn beside experts" }, { _key: null, body: "Kindness is not a slogan here. We expect high standards and direct feedback, and we build trust by showing up for each other and the community.", buttonLabel: null, buttonPath: null, iconKey: "userRound", imageSrc: "https://images.pexels.com/photos/3184369/pexels-photo-3184369.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Humans first" }], whyTitle: "Building What Matters Most" };
  }
});

// shared/cms/build-snapshots/programsLandingPage.json
var programsLandingPage_default;
var init_programsLandingPage = __esm({
  "shared/cms/build-snapshots/programsLandingPage.json"() {
    programsLandingPage_default = { ctaBody: "Rellia members get access to all event recordings, program discounts, and individual mentorship.", ctaButtonHref: "/apply", ctaButtonLabel: "Apply to join", ctaTitle: "Want the full experience?", heroPrimaryCtaLabel: "View Programs", heroSecondaryCtaLabel: "View Events", heroSubtitle: "Targeted programs and live events designed to help you accomplish your next milestone, not just learn about it.", heroTitlePortable: [{ _key: "two-part", _type: "block", children: [{ _key: "two-part-s0", _type: "span", marks: [], text: "Less theory." }, { _key: "two-part-s1", _type: "span", marks: ["mint"], text: " More progress." }], markDefs: [], style: "normal" }], programsSectionSubtitle: "", programsSectionTitle: "Explore programs", sections: null, seo: { metaDescription: "Explore Rellia Health programs designed to help healthcare builders learn, connect, and grow with the right stakeholders.", metaTitle: "Programs \u2014 Rellia Health", noFollow: false, noIndex: false, ogDescription: "Explore Rellia Health programs designed to help healthcare builders learn, connect, and grow with the right stakeholders.", ogImageUrl: null, ogTitle: "Programs \u2014 Rellia Health" } };
  }
});

// shared/cms/membershipPanelDescriptionPortable.ts
var makeSpan, makeParagraphBlock, makeBulletBlock, membershipPanelDescriptionStringToPortable;
var init_membershipPanelDescriptionPortable = __esm({
  "shared/cms/membershipPanelDescriptionPortable.ts"() {
    makeSpan = (text, key) => ({
      _type: "span",
      _key: `${key}s`,
      text,
      marks: []
    });
    makeParagraphBlock = (text, key) => ({
      _type: "block",
      _key: key,
      style: "normal",
      markDefs: [],
      children: [makeSpan(text, key)]
    });
    makeBulletBlock = (text, key) => ({
      _type: "block",
      _key: key,
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [makeSpan(text, key)]
    });
    membershipPanelDescriptionStringToPortable = (raw) => {
      const trimmed = raw?.trim() ?? "";
      if (!trimmed) return [];
      const lines = trimmed.split("\n").map((line) => line.trim());
      const blocks = [];
      let paragraphBuffer = [];
      let blockIndex = 0;
      const flushParagraph = () => {
        if (paragraphBuffer.length === 0) return;
        const key = `mp-p-${blockIndex++}`;
        blocks.push(makeParagraphBlock(paragraphBuffer.join(" "), key));
        paragraphBuffer = [];
      };
      for (const line of lines) {
        if (!line) {
          flushParagraph();
          continue;
        }
        const bulletMatch = line.match(/^[-•*]\s+(.+)$/);
        if (bulletMatch) {
          flushParagraph();
          const key = `mp-li-${blockIndex++}`;
          blocks.push(makeBulletBlock(bulletMatch[1].trim(), key));
          continue;
        }
        paragraphBuffer.push(line);
      }
      flushParagraph();
      return blocks;
    };
  }
});

// shared/cms/defaults.ts
var LEADERSHIP_UNDER_PRESSURE_DETAIL_BODY, WHY_HEALTHCARE_SAYS_NO_DETAIL_BODY, ASK_QMS_EXPERT_DETAIL_BODY, SET_YOUR_STAGE_DETAIL_BODY, CLINICIAN_CONNECT_WOMENS_HEALTH_DETAIL_BODY, SCALING_WITH_PURPOSE_DETAIL_BODY, BEYOND_THE_PRODUCT_DETAIL_BODY, RELLIA_PITCH_EVENT_FORUM_DETAIL_BODY, ETHICS_IN_AI_DETAIL_BODY, SECOND_OPINION_USER_RESEARCH_DETAIL_BODY, AI_HEALTHCARE_COMPLIANCE_DETAIL_BODY, DEFAULT_ABOUT_PAGE, INVESTOR_READINESS_DETAIL_BODY, DEFAULT_PROGRAMS_EVENT_IMAGE_SRC, DEFAULT_PROGRAMS_LANDING, DEFAULT_PAYMENT_PAGE, DEFAULT_CONSULTING_TESTIMONIALS, DEFAULT_CONSULTING_PAGE, DEFAULT_DIAGNOSTIC_LANDING_PAGE;
var init_defaults = __esm({
  "shared/cms/defaults.ts"() {
    init_inlineHeroHeadline();
    init_resolveHeroHeadline();
    init_resolveSectionHeadline();
    init_cmsFieldUtils();
    init_membershipPanelDescriptionPortable();
    LEADERSHIP_UNDER_PRESSURE_DETAIL_BODY = [
      {
        _type: "block",
        _key: "leadership-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "leadership-p1span",
            text: "Founders and Investors often operate under intense responsibility and visibility.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "leadership-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "leadership-p2span",
            text: "Join Dr Sabina Nagpal for this interactive, neuroscience-informed session which focuses on maintaining judgment, clarity, and presence when navigating complex decisions, competing priorities and high-pressure situations.",
            marks: []
          }
        ]
      }
    ];
    WHY_HEALTHCARE_SAYS_NO_DETAIL_BODY = [
      {
        _type: "block",
        _key: "chai-noai-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "chai-noai-p1s",
            text: "You've built something that works. So why are you struggling to make the sale?",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "chai-noai-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "chai-noai-p2s",
            text: 'The problem is that healthcare buyers have a different definition of "ready to purchase" than most founders expect.',
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "chai-noai-p3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "chai-noai-p3s",
            text: "This webinar will help you get in the door.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "chai-noai-h3",
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "chai-noai-h3s",
            text: "What you'll walk away with:",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "chai-noai-li1",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "chai-noai-li1s",
            text: "How to revise your pitch for what healthcare buyers actually care about",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "chai-noai-li2",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "chai-noai-li2s",
            text: "How to turn your model card into your most persuasive sales asset",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "chai-noai-li3",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "chai-noai-li3s",
            text: "What AI regulations actually mean for your product and timeline",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "chai-noai-li4",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "chai-noai-li4s",
            text: "How to align your positioning with health system priorities instead of only selling your features",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "chai-noai-p4",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "chai-noai-p4label",
            text: "Your speaker:",
            marks: ["strong"]
          },
          {
            _type: "span",
            _key: "chai-noai-p4body",
            text: " Brenton Hill, Head of Operations and General Counsel at the Coalition for Health AI (CHAI). Before CHAI, Brenton spent years at Mayo Clinic Platform doing exactly what health system buyers do: evaluating AI vendors, assessing regulatory risk, and deciding what gets purchased.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "chai-noai-p5",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "chai-noai-p5label",
            text: "About CHAI:",
            marks: ["strong"]
          },
          {
            _type: "span",
            _key: "chai-noai-p5body",
            text: " The nonprofit setting the gold standard for responsible AI in healthcare, representing 3,000+ organizations across health systems, academia, and industry. Their frameworks are increasingly what buyers reference when evaluating AI vendors.",
            marks: []
          }
        ]
      }
    ];
    ASK_QMS_EXPERT_DETAIL_BODY = [
      {
        _type: "block",
        _key: "qms-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "qms-p1s",
            text: "Whether you are building a quality management system for the first time or trying to improve the QMS you already have, this session is designed to help you answer your questions.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "qms-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "qms-p2s",
            text: "Join this live 1:1 session with quality experts who have supported medical device teams through writing SOPs, passing certification audits, and securing regulatory approvals.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "qms-p3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "qms-p3s",
            text: "This is a safe space to ask questions and get guidance on how to build the right-sized QMS processes for your company.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "qms-h3",
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "qms-h3s",
            text: "The quality reviewers bring knowledge and experience in:",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "qms-b1",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: "qms-b1s", text: "ISO 13485", marks: [] }]
      },
      {
        _type: "block",
        _key: "qms-b2",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: "qms-b2s", text: "ISO 14971", marks: [] }]
      },
      {
        _type: "block",
        _key: "qms-b3",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: "qms-b3s", text: "IEC 62304", marks: [] }]
      },
      {
        _type: "block",
        _key: "qms-b4",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: "qms-b4s", text: "ISO 27001", marks: [] }]
      },
      {
        _type: "block",
        _key: "qms-b5",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: "qms-b5s", text: "21 CFR Part 820", marks: [] }]
      },
      {
        _type: "block",
        _key: "qms-b6",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: "qms-b6s", text: "MDSAP", marks: [] }]
      },
      {
        _type: "block",
        _key: "qms-b7",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: "qms-b7s", text: "MDR/IVDR and more", marks: [] }]
      },
      {
        _type: "block",
        _key: "qms-p4",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "qms-p4s",
            text: "Building or updating your QMS does not have to feel overwhelming. Our experts are excited to help you.",
            marks: []
          }
        ]
      }
    ];
    SET_YOUR_STAGE_DETAIL_BODY = [
      {
        _type: "block",
        _key: "sys-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "sys-p1s",
            text: "Learn about how small adjustments to your physicality and storytelling create a big stage presence, with public speaking coach, Alexis Orchard.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "sys-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "sys-p2s",
            text: "We will share quick, practical adjustments you can start using right away so you can deliver your health tech pitch with more ease and authority.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "sys-p3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "sys-p3s",
            text: "This session will focus on how you show up: body language, vocal tone, and the way you tell your story so people actually remember it.",
            marks: []
          }
        ]
      }
    ];
    CLINICIAN_CONNECT_WOMENS_HEALTH_DETAIL_BODY = [
      {
        _type: "block",
        _key: "cc-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "cc-p1s",
            text: "This event is for clinicians and founders to meet and share ideas to make healthcare technology better.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "cc-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "cc-p2s",
            text: "For healthcare professionals, this is a chance to share your expertise on what works and what doesn't. We know you're tired of being told to adopt technology that doesn't function the way it should. Your feedback can make a major impact for founders, while also opening potential avenues for advisory or leadership opportunities in the tech industry.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "cc-p3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "cc-p3s",
            text: "For founders, this is a unique opportunity to gain 1:1 feedback directly from interested clinicians. Understanding how your technology will fit into real workflows will help strengthen your product's design and adoption.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "cc-h3",
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "cc-h3s",
            text: "These sessions can open doors to:",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "cc-b1",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "cc-b1s",
            text: "Co-developing solutions based on real unmet needs",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "cc-b2",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "cc-b2s",
            text: "Filling advisory board member, co-founder, or chief medical officer roles",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "cc-b3",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "cc-b3s",
            text: "Discussing feedback to help make innovations more practical and effective in clinical settings",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "cc-b4",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "cc-b4s",
            text: "Exploring pilot programs, validation studies, or new business opportunities",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "cc-p4",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "cc-p4s",
            text: "Like everything we do at Rellia and Thrive MD Connect, this event is about genuine connection. There are no obligations to commit to anything, but you may find someone here who changes the course of your career for the better.",
            marks: []
          }
        ]
      }
    ];
    SCALING_WITH_PURPOSE_DETAIL_BODY = [
      {
        _type: "block",
        _key: "swp-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "swp-p1s",
            text: "This session explores the commercialization journey for health startups, focusing on how to move beyond the prototype stage and build a purposeful business strategy that connects your idea to your customer's needs.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "swp-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "swp-p2s",
            text: "Drawing on real-world expertise, we'll cover the critical elements of funding and business strategy from prototype to scale, and why understanding the foundations of your business creates the path for success.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "swp-p3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "swp-p3s",
            text: "Attendees will leave with actionable insights on how to avoid common pitfalls, position their product for adoption, and scale with intention in the competitive health innovation landscape.",
            marks: []
          }
        ]
      }
    ];
    BEYOND_THE_PRODUCT_DETAIL_BODY = [
      {
        _type: "block",
        _key: "btp-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "btp-p1s",
            text: "Most digital health founders lead with technology, but growth starts with trust. Beyond the Product helps you turn complex science into a clear, credible brand that connects with the people who matter most\u2014investors, partners, and patients.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "btp-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "btp-p2s",
            text: "Rellia has partnered with Brave Tale to bring you a workshop for translating your technical product features into a compelling brand story.",
            marks: []
          }
        ]
      }
    ];
    RELLIA_PITCH_EVENT_FORUM_DETAIL_BODY = [
      {
        _type: "block",
        _key: "pv-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "pv-p1s",
            text: "Rellia members get exclusive access to 1:1 pitch opportunities with Forum Ventures, a leading early-stage fund for B2B SaaS founders.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "pv-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "pv-p2s",
            text: "No crowded competitions or flashy events\u2014just direct conversations about what you're building with people who want to help you grow.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "pv-p3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "pv-p3s",
            text: "Forum has backed 500+ companies who went on to raise over $1B in follow-on funding. Now they're looking at healthcare startups innovating in:",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "pv-b1",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "pv-b1s",
            text: "Staff management: tackling shortages and burnout with tools that improve retention, create flexible staffing, or offload manual work.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "pv-b2",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "pv-b2s",
            text: "Operational efficiency: reducing patient length of stay, preventing denials, and streamlining communication through AI and automation.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "pv-b3",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "pv-b3s",
            text: "Access to care: hybrid and virtual models that expand reach, improve patient engagement, and tie directly to outcomes in risk-based contracts.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "pv-p4",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "pv-p4s",
            text: "This is your chance to connect with investors who are actively writing checks and genuinely excited about healthcare innovation.",
            marks: []
          }
        ]
      }
    ];
    ETHICS_IN_AI_DETAIL_BODY = [
      {
        _type: "block",
        _key: "eth-ai-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "eth-ai-p1s",
            text: "AI ethics is often framed as a technical checklist\u2014fairness, transparency, accountability. But the truth is, the biggest risks in AI don't come from the machines. They come from us. From the assumptions we code in, the decisions we greenlight, and the people we leave out of the room.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "eth-ai-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "eth-ai-p2s",
            text: "Join Argentina Beltran, founder of InclusifAI and author of What We Teach the Machines, for a provocative and honest talk on the human side of AI ethics. Through real-world case studies and personal storytelling, she'll challenge us to see ethics not as an abstract framework, but as a mirror\u2014asking what we're teaching the machines, and whether we're willing to learn from ourselves.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "eth-ai-p3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "eth-ai-p3s",
            text: "Hosted by Rellia Health and StartUp Lab, this session is for builders, funders, and anyone shaping AI systems who wants to move beyond buzzwords toward responsibility with depth, courage, and humanity.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "eth-ai-p4",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "eth-ai-p4s",
            text: "We are official event hosts with Waterloo Tech Week 2025, a celebration of what's been built here, and what's still to come. We're building something great together. September 8-11, 2025. waterlootechweek.ca",
            marks: []
          }
        ]
      }
    ];
    SECOND_OPINION_USER_RESEARCH_DETAIL_BODY = [
      {
        _type: "block",
        _key: "so-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "so-p1s",
            text: "You're building healthcare products that need to work for real patients and providers, but how do you know if you're on the right track?",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "so-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "so-p2s",
            text: "Join a seasoned UX researcher with 20 years of experience in health tech to see how user research actually works in practice.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "so-p3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "so-p3s",
            text: "We'll start with a real case study from a healthcare startup that used research to dramatically improve their onboarding\u2014and the impressive numbers that followed. Then we'll break down the decisions behind the research: how they chose the right methods, found the right participants, and turned insights into action.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "so-p4",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "so-p4s",
            text: "Walk away understanding when research makes sense for your startup and when it's time to bring in expert help.",
            marks: []
          }
        ]
      }
    ];
    AI_HEALTHCARE_COMPLIANCE_DETAIL_BODY = [
      {
        _type: "block",
        _key: "ahc-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p1s",
            text: "The Human Layer: the missing layer above the tech stack - trust, coordination, and shared understanding - so humanity and technology can advance in harmony.",
            marks: []
          }
        ]
      },
      {
        _type: "eventDetailInlineImage",
        _key: "ahc-img-desc",
        imageSrc: "/images/complianceevent-desc.jpeg",
        alt: "The Human Layer \u2014 trust, coordination, and shared understanding in healthcare AI"
      },
      {
        _type: "block",
        _key: "ahc-p3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p3s",
            text: "As AI becomes embedded in healthcare products, the compliance stakes have never been higher. This event brings together compliance leaders, startup operators, and senior executives on one stage to cut through the noise \u2014 offering honest, experience-backed perspectives on what it actually takes to build in this regulated space.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p4",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p4s",
            text: "Expect candid panel discussions, real-world examples, and a strong emphasis on AI governance and data security \u2014 the areas where healthtech teams most often underestimate their exposure.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p5",
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p5s",
            text: "What you'll gain",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p6",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p6s",
            text: "Live panel discussions: Real conversations on compliance strategy, AI risk, and security obligations in healthtech",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p7",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p7s",
            text: "Practical guidelines & tips: Actionable frameworks you can apply immediately \u2014 not theory, but ground-level advice",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p8",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p8s",
            text: "Exclusive Google Drive resource pack: Curated compliance guidelines and templates shared post-event \u2014 a lasting reference for your team",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p9",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p9s",
            text: "Deep dive: AI & security: A dedicated focus on AI-specific compliance risks and how to build secure, trustworthy health products",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p10",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p10s",
            text: "----",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p11",
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p11s",
            text: "Our Expert Panelists:",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p12",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p12s",
            text: "Our discussion features leaders who are actively shaping the future of healthtech security:",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p13",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p13s",
            text: "Panelists:",
            marks: ["strong"]
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p14",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p14s",
            text: "Megan Kane \u2013 Executive Director of Rellia, specializing in AI-enabled SaMD, diagnostics, and global regulatory strategy for FDA, Health Canada, EU MDR, and APAC compliance.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p15",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p15s",
            text: "Andre Padure \u2013 Head of Regulatory Affairs and Quality Assurance at RetiSpec, leading global regulatory strategy and quality systems for the company\u2019s AI-powered retinal imaging platform for early Alzheimer\u2019s disease detection.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p16",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p16s",
            text: "Roy Kirshon \u2013 COO & Co-Founder of RetiSpec, leading company strategy, financing, and operations to support the development and commercialization of healthcare technologies.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p17",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p17s",
            text: "Moderator:",
            marks: ["strong"]
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p18",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p18s",
            text: "Katie Duyen Nguyen - Regional Director of BD @ CyStack",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p19",
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p19s",
            text: "Brought to you by:",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p20",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p20s",
            text: "RetiSpec - A Toronto-based medical AI company using advanced imaging technology to detect signs of neurodegenerative disease - including Alzheimer's - through a simple, non-invasive retinal scan. RetiSpec's clinically validated AI analyzes retinal images captured by standard eye clinic cameras to identify disease biomarkers before symptoms appear, putting powerful early detection tools directly at the point of care.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p21",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p21s",
            text: "Rellia Health - A community that connects promising digital health founders with industry experts, healthcare practitioners, and engaged investors. Rellia is a network of people who deeply understand the healthcare industry and will go out of their way to help you succeed. We connect early-stage digital health, medical device, wellness, and diagnostic companies with the personalized solutions that match their unique needs.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p22",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p22s",
            text: "CyStack - Blends deep offensive security knowledge with proprietary tooling to help organizations protect their products, data, and operations. Their suite covers penetration testing, automated vulnerability scanning (VulnScan), crowdsourced bug bounty (WhiteHub), secrets management (Locker), and 24/7 security monitoring \u2014 giving healthtech startups everything they need to build secure from day one.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p23",
        style: "blockquote",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p23s",
            text: "\u201CToronto Tech Week is a citywide celebration of the people building what\u2019s next. From May 26\u201329, 2026, founders, investors, and builders come together for hundreds of community-led events across Toronto, connecting tens of thousands of people around Canadian tech.\u201D\nTorontotechweek.com",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p24-title",
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p24s-title",
            text: "Please be advised",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ahc-p24-body",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ahc-p24s-body",
            text: "Unfortunately, space is very limited at these community events and we can not always accept everyone we would like to. If you are not accepted to this event, please keep applying! We appreciate your application tremendously and we are looking forward to seeing you at a future event very soon!",
            marks: []
          }
        ]
      }
    ];
    DEFAULT_ABOUT_PAGE = {
      heroTitlePortable: threePartHeroHeadline("Empowering the", "next generation", " of health tech."),
      heroIntro: "Rellia Health is a virtual incubator dedicated to accelerating the commercialization of digital health solutions that matter.",
      missionTitle: "Our Mission",
      missionParagraphs: [
        "The healthcare industry is notoriously difficult to navigate. Brilliant founders often struggle not because their ideas lack merit, but because they are trying to figure it out without the right people around them.",
        "At Rellia, we meet health tech founders where they are, surrounding them with deep industry expertise and individualized support so that the complexities of healthcare innovation feel less overwhelming. Because when founders have the right people in their corner, meaningful innovation actually reaches the patients who need it."
      ],
      missionImageSrc: "https://images.pexels.com/photos/8460371/pexels-photo-8460371.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200",
      missionImageAlt: "Healthcare professionals meeting and collaborating together",
      valuesTag: "OUR VALUES",
      showValuesTag: true,
      valuesHeadlinePortable: threePartHeroHeadline(
        "These principles guide",
        "every decision",
        " we make."
      ),
      values: [
        {
          iconKey: "heart",
          title: "Generous",
          description: "Building in health tech is hard enough. Everyone here genuinely wants to see you succeed, and that makes all the difference."
        },
        {
          iconKey: "stethoscope",
          title: "Healthcare-Specific",
          description: "Generic startup guidance does not work in healthcare. Everything we offer is built around the specific realities of health tech commercialization."
        },
        {
          iconKey: "globe",
          title: "Globally Connected",
          description: "Great ideas and great mentors are not concentrated in one city. Rellia is a virtual community, and that breadth makes it stronger."
        },
        {
          iconKey: "zap",
          title: "Radically Practical",
          description: "You don't need more learning, you need more things accomplished. We focus on helping you achieve the outcomes that actually move your business forward."
        }
      ],
      teamTitle: "Meet The Team",
      teamSubtitle: "Health tech insiders who saw a better way, so they built it. Just like you did.",
      team: [
        {
          name: "Megan Kane",
          role: "Executive Director, Co-Founder",
          bio: "Regulatory and Quality Management executive specializing in global market entry strategy and FDA/Health Canada submissions for SaMD and digital health companies.",
          imageSrc: "https://www.relliahealth.com/images/team-megankane.jpg",
          socialLinks: [
            { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/megankane1/" },
            { platform: "website", label: "Website", url: "https://megankaneportfolio.carrd.co/" }
          ]
        },
        {
          name: "Deena Al-Sammak",
          role: "Program Manager, Co-Founder",
          bio: "Deena brings startup experience in the health tech space and leverages her experience to lead our program development and management",
          imageSrc: "https://www.relliahealth.com/images/team-deenasammak.png",
          socialLinks: [
            { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/deena-al-sammak/" }
          ]
        },
        {
          name: "Khali Abdi",
          role: "User Experience, Community Strategy Manager",
          bio: "A Chemical Engineer & digital health founder, Khali blends her technical background with a deep commitment to human-centred design to ensure Rellia\u2019s ecosystem is as intuitive as it is impactful.",
          imageSrc: "https://www.relliahealth.com/images/team-abdi.JPG",
          socialLinks: [
            { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/khali-abdi/" }
          ]
        },
        {
          name: "Priyanka Ramjagsingh",
          role: "Operations Director",
          bio: "With a decade of experience embedded in early-stage health companies, Priyanka converts her deep regulatory and quality expertise into operational momentum, turning complexity into the strategic edge that moves teams forward.",
          imageSrc: "https://www.relliahealth.com/images/team-priyankaR.jpeg",
          socialLinks: [
            { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/shyama-ramjagsingh/" }
          ]
        },
        {
          name: "Kelly Hu",
          role: "Social Media Manager",
          bio: "A digital health founder herself, Kelly plans and executes content creation to boost engagement and showcase Rellia's growing network.",
          imageSrc: "https://www.relliahealth.com/images/team-KellyH.jpeg",
          socialLinks: [
            { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/kellyjiayihu/" }
          ]
        }
      ],
      ctaTitle: "You're in the right place.",
      ctaBody: "If you're a founder who wants to do this right, we have the network and expertise to make it happen.",
      ctaFounderLabel: "Apply to join as a founder",
      ctaFounderHref: "/apply",
      ctaTeamLabel: "Join the Rellia team",
      ctaTeamHref: "/careers"
    };
    INVESTOR_READINESS_DETAIL_BODY = [
      {
        _type: "block",
        _key: "ir-p1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ir-p1s",
            text: "Eric Haywood has been on both sides of the investment table. As a four-time founder and investor at InterSystems Ventures, he has built companies, raised capital, and evaluated startups for investment. In this session, he will share what makes a company fundable and how to show up more prepared.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ir-h3",
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ir-h3s",
            text: "What you will walk away with:",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ir-b1",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ir-b1s",
            text: "What VCs look for in early-stage health tech companies",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ir-b2",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ir-b2s",
            text: "What signals separate successful companies from the rest",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ir-b3",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ir-b3s",
            text: "How to tell your story in a way that resonates with investors",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ir-b4",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ir-b4s",
            text: "Common mistakes founders make in the fundraising process and how to avoid them",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ir-p2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ir-p2s",
            text: "This is a practical, no-fluff session for founders who are serious about fundraising and want an honest look at how the process works.",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ir-h3b",
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ir-h3bs",
            text: "About Us:",
            marks: []
          }
        ]
      },
      {
        _type: "block",
        _key: "ir-p3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ir-p3s",
            text: "Rellia is a virtual incubator connecting digital health founders with investors, clinicians, and advisors to launch healthcare solutions. https://www.relliahealth.com/",
            marks: []
          }
        ]
      }
    ];
    DEFAULT_PROGRAMS_EVENT_IMAGE_SRC = "/images/event-leadershipUnderPressure.avif";
    DEFAULT_PROGRAMS_LANDING = {
      heroTitlePortable: DEFAULT_PROGRAMS_LANDING_HERO_PORTABLE,
      heroSubtitle: "Targeted programs and live events designed to help you accomplish your next milestone, not just learn about it.",
      heroPrimaryCtaLabel: "View Programs",
      heroSecondaryCtaLabel: "View Events",
      programsSectionTitle: "Explore programs",
      programsSectionSubtitle: "",
      programs: [
        {
          title: "Build Your Quality Management System",
          description: "Build a lean, scalable QMS to comply with ISO 13485, MDSAP, FDA, and MDR requirements, with personalized guidance from quality experts every step of the way",
          imageSrc: "/images/programs-buildYourQMS.png",
          href: "/programs/build-your-quality-management-system",
          buttonText: "Learn more",
          status: "available"
        },
        {
          title: "Ignite: Pitch Foundations",
          description: "Master the essentials of fundraising by crafting your first pitch deck and presentation. Perfect for early-stage founders looking for a structured starting point to build investor confidence.",
          imageSrc: "/images/programs-IgnitepItch.png",
          href: "/programs/ignite-pitch-foundations",
          buttonText: "Learn more",
          status: "waitlist"
        },
        {
          title: "Advance: Data Room Deep Dive",
          description: "Move beyond the basics into the mechanics of due diligence and data room management. Gain the practical tools and execution tips needed to navigate the complexities of the raising process.",
          imageSrc: "/images/programs-DataRoom.png",
          href: "/programs/advance-data-room-deep-dive",
          buttonText: "Learn more",
          status: "waitlist"
        },
        {
          title: "Elevate: Healthcare Capital",
          description: "Refine your existing fundraising strategy for the specialized world of health tech. Upgrade your pitch to meet the specific technical and clinical expectations of healthcare investors.",
          imageSrc: "/images/programs-HealthcareCapital.png",
          href: "/programs/elevate-healthcare-capital",
          buttonText: "Learn more",
          status: "waitlist"
        },
        {
          title: "First 50 Users: A Clinical Feedback Intensive",
          description: `Validate your product through facilitated usability testing and "assumption audits" with Rellia's clinician network. Gain the IRB guidance and professional feedback needed to bridge the gap between prototype and clinical use.`,
          imageSrc: "/images/programs-first50Users.png",
          href: "/programs/first-50-users-clinical-feedback-intensive",
          buttonText: "Learn more",
          status: "waitlist"
        },
        {
          title: "A Low-Fidelity Prototype Lab",
          description: "Transform your vision into a functional low-fidelity prototype and a vendor-ready requirements document. Finish the program by connecting with vetted development firms and testing experts to build your proof of concept.",
          imageSrc: "/images/programs-PrototypeLab.png",
          href: "/programs/low-fidelity-prototype-lab",
          buttonText: "Learn more",
          status: "waitlist"
        },
        {
          title: "Advisory Board Match",
          description: "Identify and recruit the ideal experts for your startup using Rellia's vetted advisor network. We provide the matchmaking, equity benchmarking, and legal frameworks to ensure your advisory relationships are productive from day one.",
          imageSrc: "/images/programs-AdvisoryBoard.png",
          href: "/programs/advisory-board-match",
          buttonText: "Learn more",
          status: "waitlist"
        },
        {
          title: "Design Your Brand Strategy",
          description: "Develop a professionally positioned brand identity that earns trust from both clinicians and investors. This intensive includes specialized sprints for your website copy, UI design, and sales collateral to ensure a cohesive market presence.",
          imageSrc: "/images/programs-brandStrategy.png",
          href: "/programs/design-your-brand-strategy",
          buttonText: "Learn more",
          status: "waitlist"
        },
        {
          title: "Regulatory Strategy Sprint",
          description: "Confirm your medical device classification and global market entry pathway. Leave with a documented regulatory strategy and intended use statements to support your investor due diligence.",
          imageSrc: "/images/programs-regulatoryRoadmap.png",
          href: "/programs/regulatory-strategy-sprint",
          buttonText: "Learn more",
          status: "available"
        }
      ],
      upcomingEvents: [
        {
          slug: "ai-healthcare-compliance",
          title: "AI Healthcare Compliance (w/ The AI Collective)",
          dateTime: "Wednesday, May 27, 2026 \u2014 6:00 PM - 8:30 PM EDT",
          person: "The AI Collective \u2022 Toronto Tech Week",
          imageSrc: "/images/aiHealthcareCompliance.avif",
          location: "RetiSpec, 170 Bedford Rd, Toronto",
          startsAt: "2026-05-27T18:00:00-04:00",
          endsAt: "2026-05-27T20:30:00-04:00",
          lumaEventId: "evt-0wKks8RxsxxgmFh",
          embedLumaOnDetailPage: true,
          detailBodyHeading: "About this event",
          detailBody: AI_HEALTHCARE_COMPLIANCE_DETAIL_BODY
        },
        {
          slug: "clinician-connect-primary-care",
          title: "Clinician Connect: Primary Care",
          dateTime: "Thursday, July 9, 2026 \u2014 2:00 PM EDT",
          person: "Rellia Health \u2022 Company event",
          imageSrc: "/images/events-clinicianConnectPrimaryCare.jpg",
          location: "Virtual",
          addToCalendarEnabled: true,
          startsAt: "2026-07-09T14:00:00-04:00",
          endsAt: "2026-07-09T15:00:00-04:00",
          embedLumaOnDetailPage: false,
          detailBodyHeading: "About this session",
          detailBody: [
            {
              _type: "block",
              _key: "cc-primary-p1",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "cc-primary-p1s",
                  text: "A practical session for clinicians and founders focused on primary care workflows, adoption signals, and what actually gets used.",
                  marks: []
                }
              ]
            },
            {
              _type: "block",
              _key: "cc-primary-p2",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "cc-primary-p2s",
                  text: "Bring your questions. We\u2019ll cover common blockers, simple pilot design, and how to turn frontline feedback into product decisions.",
                  marks: []
                }
              ]
            }
          ]
        },
        {
          slug: "investor-readiness-how-vcs-evaluate-startups",
          title: "Investor Readiness: How VCs Evaluate Startups",
          dateTime: "Wednesday, June 17, 2026 \u2014 12:00 PM - 1:00 PM EDT",
          person: "Eric Haywood \u2022 InterSystems Ventures",
          imageSrc: "/images/event-investorReadiness.jpg",
          location: "Virtual",
          startsAt: "2026-06-17T12:00:00-04:00",
          endsAt: "2026-06-17T13:00:00-04:00",
          lumaEventId: "evt-5ONXRkPwM81lwuM",
          embedLumaOnDetailPage: true,
          detailBodyHeading: "About this session",
          detailBody: INVESTOR_READINESS_DETAIL_BODY
        }
      ],
      pastEvents: [
        {
          slug: "leadership-under-pressure",
          title: "Leadership Under Pressure",
          dateTime: "Wednesday, May 6, 2025 \u2014 12:00 PM EST",
          person: "Dr. Sabina Nagpal \u2022 Radiate Mind",
          imageSrc: DEFAULT_PROGRAMS_EVENT_IMAGE_SRC,
          href: "https://luma.com/bgvqn7ia",
          location: "Virtual",
          lumaEventId: "evt-h1FZAFHZ8gzGjJn",
          embedLumaOnDetailPage: true,
          detailBodyHeading: "About this session",
          detailBody: LEADERSHIP_UNDER_PRESSURE_DETAIL_BODY
        },
        {
          slug: "health-system-adoption-for-startups",
          title: "Health System Adoption for Startups",
          dateTime: "Thursday, April 9, 2025 \u2014 2:00 PM EDT",
          person: "Rellia Health \u2022 Company event",
          imageSrc: "/images/events-healthsystem.avif",
          href: "https://luma.com/ao1g8a7h",
          buttonText: "View Event",
          location: "Virtual"
        },
        {
          slug: "why-healthcare-says-no-to-your-ai",
          title: "Why Healthcare Keeps Saying No to Your AI (And How to Fix It)",
          dateTime: "Thursday, March 12, 2025 \u2014 1:00 PM EDT",
          person: "Brenton Hill \u2022 CHAI",
          imageSrc: "/images/events-whyHealthcareKeeps.avif",
          href: "https://luma.com/1vx5stu2",
          buttonText: "View Event",
          location: "Virtual",
          detailBodyHeading: "About this session",
          detailBody: WHY_HEALTHCARE_SAYS_NO_DETAIL_BODY
        },
        {
          slug: "ask-a-qms-expert",
          title: "Ask a QMS Expert",
          dateTime: "Thursday, February 19, 2025 \u2014 12:00 PM EST",
          person: "QMS Expert Panel \u2022 Company event",
          imageSrc: "/images/events-askQMS.avif",
          href: "https://luma.com/w61qj0g5",
          buttonText: "View Event",
          location: "Virtual",
          detailBodyHeading: "About this session",
          detailBody: ASK_QMS_EXPERT_DETAIL_BODY
        },
        {
          slug: "set-your-stage",
          title: "Set Your Stage",
          dateTime: "Thursday, December 4, 2025 \u2014 12:00 PM EST",
          person: "Alexis Orchard \u2022 Orchard Presents",
          imageSrc: "/images/events-setYourStage.avif",
          href: "https://luma.com/5s736thc",
          buttonText: "View Event",
          location: "Virtual",
          detailBodyHeading: "About this session",
          detailBody: SET_YOUR_STAGE_DETAIL_BODY
        },
        {
          slug: "clinician-connect-womens-health",
          title: "Clinician Connect: Women's Health",
          dateTime: "Thursday, November 20, 2025 \u2014 12:00 PM EST",
          person: "Rellia Health \u2022 Company event",
          imageSrc: "/images/events-clinicianConnect.avif",
          href: "https://luma.com/k6fbogr8",
          buttonText: "View Event",
          location: "Virtual",
          detailBodyHeading: "About this session",
          detailBody: CLINICIAN_CONNECT_WOMENS_HEALTH_DETAIL_BODY
        },
        {
          slug: "scaling-with-purpose-from-prototype-to-customer-in-health-startups",
          title: "Scaling with Purpose: From Prototype to Customer in Health Startups",
          dateTime: "Thursday, November 13, 2025 \u2014 12:00 PM EST",
          person: "Rellia Health \u2022 Company event",
          imageSrc: "/images/events-scalingPurpose.avif",
          buttonText: "View Event",
          location: "Virtual",
          detailBodyHeading: "About this session",
          detailBody: SCALING_WITH_PURPOSE_DETAIL_BODY
        },
        {
          slug: "beyond-the-product-how-digital-health-brands-earn-trust-and-drive-growth",
          title: "Beyond the Product: How digital health brands earn trust and drive growth",
          dateTime: "Thursday, October 23, 2025 \u2014 12:00 PM EDT",
          person: "Rellia Health \u2022 Company event",
          imageSrc: "/images/events-beyondProduct.avif",
          buttonText: "View Event",
          location: "Virtual",
          detailBodyHeading: "About this session",
          detailBody: BEYOND_THE_PRODUCT_DETAIL_BODY
        },
        {
          slug: "rellia-pitch-event-forum-ventures",
          title: "Rellia Pitch Event: Forum Ventures",
          dateTime: "Thursday, October 16, 2025 \u2014 12:30 PM EDT",
          person: "Rellia Health \u2022 Company event",
          imageSrc: "/images/Relliapitchevent.avif",
          buttonText: "View Event",
          location: "Virtual",
          detailBodyHeading: "About this session",
          detailBody: RELLIA_PITCH_EVENT_FORUM_DETAIL_BODY
        },
        {
          slug: "ethics-in-ai-less-about-tech-more-about-humans",
          title: "Ethics in AI: Less About Tech, More About Humans",
          dateTime: "Thursday, September 11, 2025 \u2014 2:00 PM EDT",
          person: "Rellia Health \u2022 Waterloo Tech Week",
          imageSrc: "/images/events-ethicsinAi.avif",
          buttonText: "View Event",
          location: "Virtual",
          detailBodyHeading: "About this session",
          detailBody: ETHICS_IN_AI_DETAIL_BODY
        },
        {
          slug: "second-opinion-when-healthcare-startups-need-user-research",
          title: "Second Opinion: When Healthcare Startups Need User Research",
          dateTime: "Thursday, August 14, 2025 \u2014 1:00 PM EDT",
          person: "Rellia Health \u2022 Company event",
          imageSrc: "/images/events-secondOpinion.avif",
          buttonText: "View Event",
          location: "Virtual",
          detailBodyHeading: "About this session",
          detailBody: SECOND_OPINION_USER_RESEARCH_DETAIL_BODY
        }
      ],
      ctaTitle: "Want the full experience?",
      ctaBody: "Rellia members get access to all event recordings, program discounts, and individual mentorship.",
      ctaButtonLabel: "Apply to join",
      ctaButtonHref: "/apply"
    };
    DEFAULT_PAYMENT_PAGE = {
      badge: "",
      headline: "",
      introCheckout: "",
      introFallback: "",
      introFallbackError: "",
      benefitsTitle: "Join the Rellia Health Network",
      benefits: [
        "Personalized warm introductions to the right investors, partners, and clinicians",
        "Healthcare industry templates and resources ready to use in your business",
        "Exclusive workshops, webinars, and networking events with industry leaders",
        "Access to advisory consulting that would cost >$300/hr anywhere else",
        "Cancel any time \u2014 no long-term commitment required"
      ],
      successTitle: "",
      successBody: "",
      discountBannerEnabled: true,
      discountBannerBadge: "LIMITED OFFER",
      discountBannerTitle: "Founding members get 50% off your first purchase \u2014 use code RELLIA50",
      discountBannerSubtitle: "",
      discountBannerApplyLabel: "Apply code",
      discountBannerApplyHref: "",
      pricingMonthlyBadge: "",
      pricingAnnualBadge: "",
      pricingMonthlyAmount: "$30",
      pricingAnnualAmount: "$25",
      pricingMonthlyDiscountEnabled: false,
      pricingMonthlyCompareAmount: "$50",
      pricingAnnualDiscountEnabled: false,
      pricingAnnualCompareAmount: "$40",
      benefitsPanelHeadline: "Join the network today",
      benefitsPanelDescription: `Unlock founder benefits built for health tech operators moving from approval to active membership.

- Personalized warm introductions to the right investors, partners, and clinicians
- Healthcare industry templates and resources ready to use in your business
- Exclusive workshops, webinars, and networking events with industry leaders
- Access to advisory consulting that would cost >$300/hr anywhere else`,
      benefitsPanelDescriptionPortable: membershipPanelDescriptionStringToPortable(
        `Unlock founder benefits built for health tech operators moving from approval to active membership.

- Personalized warm introductions to the right investors, partners, and clinicians
- Healthcare industry templates and resources ready to use in your business
- Exclusive workshops, webinars, and networking events with industry leaders
- Access to advisory consulting that would cost >$300/hr anywhere else`
      ),
      benefitsPanelImageEnabled: true,
      benefitsPanelImageSrc: "/images/membership-splash.jpg",
      choosePlanHeadline: "Choose your plan",
      promoMessage: "Founding members get 50% off first purchase using code {code}",
      pricingPerSuffix: "",
      popularLabel: "",
      monthlyProceedLabel: "Proceed to payment",
      annualProceedLabel: "Proceed to payment",
      questionsTitle: "Questions about membership?",
      questionsBody: "Have questions about the membership, billing, or benefits? We're here to help you get the most out of the Rellia network.",
      questionsFaqLabel: "View FAQ",
      questionsFaqPath: "/faq",
      questionsContactLabel: "Contact us",
      questionsContactPath: "/contact",
      welcomeSplashEnabled: true,
      welcomeSplashHeadingPortable: DEFAULT_MEMBERSHIP_SPLASH_HEADING_PORTABLE,
      welcomeSplashSubheading: "Secure your spot in the Rellia network to finalize your membership and unlock your exclusive founder benefits.",
      welcomeSplashBackgroundSrc: "/images/membership-splash.jpg",
      welcomeSplashLogoSrc: "/svgs/rellia-secondary-logo-circle-health-white-rgb.svg",
      welcomeSplashDurationSeconds: 1.9
    };
    DEFAULT_CONSULTING_TESTIMONIALS = [
      {
        name: "Dr Stevie Foglia",
        role: "Founder & CEO",
        company: "Neuro-Mod",
        image: "/images/drstrevie.png",
        quote: "The QMS fits seamlessly within our workflows and is directly personalized to our company and product. Rellia has been excellent to work with - they are true experts in their field."
      },
      {
        name: "Ibukun Elebute",
        role: "Founder & COO",
        company: "Cellect",
        image: "/images/ibukun.jpg",
        quote: "The Rellia QMS program was practical and startup-friendly, the process was easy to follow, and the support helped us understand not just what needed to be done, but how to do it properly."
      },
      {
        name: "Rooaa Shanshal",
        role: "Co-Founder",
        company: "Power of Play",
        image: "/images/testimonials-rooaaS.jpeg",
        quote: "Being part of Rellia has been so incredibly valuable. Since joining, we've made real progress on building our QMS which is something that previously felt overwhelming."
      }
    ];
    DEFAULT_CONSULTING_PAGE = {
      title: "Consulting",
      heroEyebrow: "Consulting",
      heroTitlePortable: twoPartHeroHeadline("Founder consulting", "built for healthcare reality"),
      heroSubtitle: "One-to-one and small-team working sessions when you need depth beyond community rhythm\u2014regulatory, clinical, commercial, and narrative\u2014with specialists who have shipped in health tech.",
      heroImageSrc: "https://images.pexels.com/photos/7088483/pexels-photo-7088483.jpeg?auto=compress&cs=tinysrgb&w=1200",
      heroPrimaryCtaLabel: "Start a conversation",
      heroPrimaryCtaHref: "/contact",
      heroSecondaryCtaLabel: "Apply for membership",
      heroSecondaryCtaHref: "/apply",
      fitTitle: "When consulting makes sense",
      fitDescription: "Membership gives ongoing access to community, programs, and broad intros. Consulting is for concentrated blocks of work where you need explicit outputs and senior judgment on the critical path.",
      fitBullets: [
        "You need scoped deep dives\u2014FDA strategy, clinical evidence design, enterprise sales narrative\u2014in focused sessions",
        "Your team wants documentation or diligence artifacts reviewed before a board or investor cycle",
        "You are navigating a pivot that touches regulatory labeling, pilot contracts, or interoperability commitments"
      ],
      fitImageSrc: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200",
      servicesTitle: "Common consulting sprints",
      servicesSubtitle: "Four areas founders most often need concentrated working time\u2014scoped to outputs you can reuse in diligence and execution.",
      services: [
        {
          title: "Regulatory Consulting",
          body: "Secure ISO 13485 QMS compliance and structure your FDA 510(k) or Health Canada classification label.",
          ctaLabel: "Explore regulatory",
          iconKey: "ShieldCheck"
        },
        {
          title: "Clinical Trials",
          body: "Design pre-market feasibility studies, validate investigator protocols, and organize real-world evidence.",
          ctaLabel: "Explore clinical",
          iconKey: "Stethoscope"
        },
        {
          title: "Marketing Strategy",
          body: "Refine B2B health system positioning, sharpen value proposition models, and build pilot trust.",
          ctaLabel: "Explore strategy",
          iconKey: "Megaphone"
        },
        {
          title: "Branding",
          body: "Craft a premium clinical brand identity, consistent design systems, and highly-polished GTM materials.",
          ctaLabel: "Explore branding",
          iconKey: "Palette"
        }
      ],
      testimonialsTitle: "Already trusted by Rellia members",
      testimonials: DEFAULT_CONSULTING_TESTIMONIALS,
      membershipTitle: "Membership makes consulting even more valuable",
      membershipDescription: "Rellia members get access to discounts and our full directory of vetted consultants\u2014so you can move faster when a milestone becomes urgent.",
      membershipStats: [
        { label: "Member discount", value: "Up to 25% off" },
        { label: "Vetted consultants", value: "Regulatory \xB7 Clinical \xB7 GTM" },
        { label: "Fast matching", value: "Book within days" }
      ],
      membershipSavingsTitle: "Example savings",
      membershipSavingsBody: "A 6-hour sprint can save hundreds while keeping the same senior operator support.",
      membershipPrimaryCtaLabel: "Apply for membership",
      membershipPrimaryCtaHref: "/apply",
      membershipSecondaryCtaLabel: "Ask about consulting",
      membershipSecondaryCtaHref: "/contact",
      ctaTitle: "Not sure which path fits?",
      ctaBody: "Tell us your milestone\u2014we'll recommend membership, consulting, or a blended rhythm.",
      ctaPrimaryLabel: "Talk to us",
      ctaPrimaryHref: "/contact"
    };
    DEFAULT_DIAGNOSTIC_LANDING_PAGE = {
      title: "Startup Diagnostic",
      heroBadgeLabel: "Startup Diagnostic",
      heroTitlePortable: twoPartHeroHeadline("Pressure-test your startup for", "healthcare reality."),
      heroSubtitle: "Get an instant readiness score, surface hidden blockers across 12 domains, and unlock advisor matching when you join Rellia.",
      heroImageSrc: "https://images.pexels.com/photos/3825368/pexels-photo-3825368.jpeg?auto=compress&cs=tinysrgb&w=1600",
      heroPrimaryCtaLabel: "Begin Free Assessment",
      heroPrimaryCtaHref: "/diagnostic-survey",
      readinessTitle: "A complete readiness map",
      readinessDescription: "Most founders have a few strong domains and several hidden gaps. This diagnostic exposes the full picture so you can build with confidence.",
      readinessFeatures: [
        {
          title: "12 Scored Domains",
          description: "Every critical health tech domain is assessed, from clinical evidence to quality management and unit economics.",
          imageSrc: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200"
        },
        {
          title: "Instant Gap Analysis",
          description: "Identify your top 3 strengths and priority gaps instantly. Detailed reports and gap analyses are exclusive to Rellia members.",
          imageSrc: "https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=1200"
        },
        {
          title: "Advisor Matching",
          description: "Members are automatically matched and introduced to pre-vetted advisors based on their startup's gap profile.",
          imageSrc: "https://images.pexels.com/photos/3182761/pexels-photo-3182761.jpeg?auto=compress&cs=tinysrgb&w=1200"
        },
        {
          title: "Founding Membership",
          description: "Get early access to exclusive networking sessions, peer mentorship, and dedicated resources from day one.",
          imageSrc: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1200"
        }
      ],
      infographicTitle: "No stone left unturned",
      infographicBody: "We've distilled years of digital health experience into a comprehensive assessment framework that covers the entire startup lifecycle. Rellia's custom platform maps every critical domain, ensuring regulatory alignment, clinical proof, and bulletproof operational scaling.",
      infographicTopWeaknessLabel: "Regulatory Strategy",
      infographicTopWeaknessScore: 32,
      infographicGapLabel: "Critical Gap",
      infographicAdvisorMatchLabel: "Vetted Advisor Match",
      infographicAdvisorRole: "Regulatory Director",
      infographicAdvisorSubtitle: "Ex-FDA Reviewer",
      infographicBlobRoadmap: "Personalized Roadmap",
      infographicBlobAdvisors: "Matched Advisors",
      infographicBlobBlindSpot: "Blind Spot Discovery",
      timelineTitle: "Survey to insights in 15 minutes",
      timelineSubheading: "Four focused steps from startup context to a personalized gap profile you can act on.",
      timelineSteps: [
        {
          title: "Startup Context",
          description: "Provide high-level details about your product mission, stage, and targets."
        },
        {
          title: "Deep Assessment",
          description: "Evaluate your status across 12 sections with zero-BS honest reflections."
        },
        {
          title: "Score Analysis",
          description: "Our custom assessment framework evaluates your strengths, priority gaps, and blockers."
        },
        {
          title: "Report Access",
          description: "Rellia members immediately unlock their custom diagnostic report and advisor matching."
        }
      ],
      ctaTitle: "Benchmark your startup today",
      ctaBody: "Identify your blind spots, secure regulatory clarity, and discover what gets health systems to say yes.",
      ctaPrimaryLabel: "Take the Diagnostic",
      ctaPrimaryHref: "/diagnostic-survey",
      ctaSecondaryLabel: "Join as Member",
      ctaSecondaryHref: "/apply"
    };
  }
});

// shared/cms/eventSlug.ts
var slugifySegment, getProgramsEventSlug, findProgramsEventBySlug;
var init_eventSlug = __esm({
  "shared/cms/eventSlug.ts"() {
    slugifySegment = (value) => value.trim().toLowerCase().replace(/['']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    getProgramsEventSlug = (event) => {
      const explicit = event.slug?.trim();
      if (explicit) {
        const s2 = slugifySegment(explicit);
        if (s2) return s2;
      }
      const combined = `${event.title} ${event.dateTime}`;
      let s = slugifySegment(combined);
      if (!s) s = "event";
      if (s.length > 96) s = s.slice(0, 96).replace(/-$/, "");
      return s;
    };
    findProgramsEventBySlug = (slug, landing) => {
      const decoded = decodeURIComponent(slug).trim().toLowerCase();
      if (!decoded) return null;
      const matchIn = (list, variant) => {
        for (const event of list) {
          if (getProgramsEventSlug(event).toLowerCase() === decoded) {
            return { ...event, _variant: variant };
          }
        }
        return null;
      };
      return matchIn(landing.upcomingEvents, "upcoming") ?? matchIn(landing.pastEvents, "past") ?? null;
    };
  }
});

// shared/cms/itemCardImage.ts
var DESCRIPTION_ONLY_IMAGE_MARKERS, isEventDescriptionOnlyImage, resolveEventCardImageSrc, findDefaultProgramBySlug, defaultProgramRecordForSlug;
var init_itemCardImage = __esm({
  "shared/cms/itemCardImage.ts"() {
    init_defaults();
    init_eventSlug();
    DESCRIPTION_ONLY_IMAGE_MARKERS = ["complianceevent-desc"];
    isEventDescriptionOnlyImage = (src) => {
      const normalized = (src ?? "").trim().toLowerCase();
      if (!normalized) return false;
      return DESCRIPTION_ONLY_IMAGE_MARKERS.some((marker) => normalized.includes(marker));
    };
    resolveEventCardImageSrc = (slug, cmsImageSrc) => {
      const trimmedSlug = slug.trim();
      const fallback = trimmedSlug ? findProgramsEventBySlug(trimmedSlug, DEFAULT_PROGRAMS_LANDING) : null;
      const fallbackSrc = fallback?.imageSrc?.trim();
      if (fallbackSrc) return fallbackSrc;
      const cmsSrc = cmsImageSrc?.trim();
      if (!cmsSrc || isEventDescriptionOnlyImage(cmsSrc)) return void 0;
      return cmsSrc;
    };
    findDefaultProgramBySlug = (slug) => {
      const key = slug.trim().toLowerCase();
      if (!key) return void 0;
      return DEFAULT_PROGRAMS_LANDING.programs.find((program) => {
        const href = (program.href ?? "").trim();
        if (!href.startsWith("/programs/")) return false;
        return href.slice("/programs/".length).toLowerCase() === key;
      });
    };
    defaultProgramRecordForSlug = (slug) => {
      const program = findDefaultProgramBySlug(slug);
      if (!program) return null;
      return {
        title: program.title,
        description: program.description,
        imageSrc: program.imageSrc,
        href: program.href
      };
    };
  }
});

// shared/cms/sitemapIndexability.ts
var init_sitemapIndexability = __esm({
  "shared/cms/sitemapIndexability.ts"() {
  }
});

// shared/cms/prerenderSanity.ts
import { createClient as createClient5 } from "@sanity/client";
var snapshotEvents, snapshotStories, snapshotOpenRoles, snapshotSingleton, prerenderClient, getPrerenderSanityClient, fetchBySlug, fetchStoryBySlugForPrerender, fetchEventsForPrerender, fetchAdvisorsForPrerender, fetchAlumniCompaniesForPrerender, fetchCareersPageForPrerender, fetchOpenRolesForPrerender, fetchProgramsLandingForPrerender;
var init_prerenderSanity = __esm({
  "shared/cms/prerenderSanity.ts"() {
    init_groqQueries();
    init_careersOpenRolesVisibility();
    init_careersPageDefaults();
    init_careersRoleShare();
    init_events();
    init_openRoles();
    init_stories();
    init_careersPage();
    init_programsLandingPage();
    init_itemCardImage();
    init_sanityEnv();
    init_sitemapIndexability();
    snapshotEvents = () => Array.isArray(events_default) ? events_default : [];
    snapshotStories = () => Array.isArray(stories_default) ? stories_default : [];
    snapshotOpenRoles = () => Array.isArray(openRoles_default) ? openRoles_default : [];
    snapshotSingleton = (value) => {
      if (!value || typeof value !== "object") return null;
      if (Array.isArray(value)) return null;
      return value;
    };
    prerenderClient = null;
    getPrerenderSanityClient = () => {
      if (prerenderClient) return prerenderClient;
      const config = trySanityApiConfig();
      if (!config) return null;
      const token = process.env.SANITY_API_READ_TOKEN?.trim();
      prerenderClient = createClient5({
        projectId: config.projectId,
        dataset: config.dataset,
        apiVersion: "2024-01-01",
        useCdn: false,
        perspective: "published",
        ...token ? { token } : {}
      });
      return prerenderClient;
    };
    fetchBySlug = async (query, slug) => {
      const trimmed = slug.trim();
      if (!trimmed) return null;
      const client = getPrerenderSanityClient();
      if (!client) return null;
      try {
        const doc = await client.fetch(query, { slug: trimmed });
        return doc ?? null;
      } catch {
        return null;
      }
    };
    fetchStoryBySlugForPrerender = async (slug) => {
      const fromSanity = await fetchBySlug(storyBySlugQuery, slug);
      if (fromSanity) return fromSanity;
      const trimmed = slug.trim();
      if (!trimmed) return null;
      return snapshotStories().find(
        (row) => typeof row.slug === "string" && row.slug.trim() === trimmed
      ) ?? null;
    };
    fetchEventsForPrerender = async () => {
      const client = getPrerenderSanityClient();
      if (client) {
        try {
          const rows = await client.fetch(eventsQuery);
          if (Array.isArray(rows) && rows.length > 0) return rows;
        } catch {
        }
      }
      return snapshotEvents();
    };
    fetchAdvisorsForPrerender = async () => {
      const client = getPrerenderSanityClient();
      if (!client) return [];
      try {
        const rows = await client.fetch(advisorsQuery);
        return Array.isArray(rows) ? rows : [];
      } catch {
        return [];
      }
    };
    fetchAlumniCompaniesForPrerender = async () => {
      const client = getPrerenderSanityClient();
      if (!client) return [];
      try {
        const rows = await client.fetch(alumniCompaniesQuery);
        return Array.isArray(rows) ? rows : [];
      } catch {
        return [];
      }
    };
    fetchCareersPageForPrerender = async () => {
      const client = getPrerenderSanityClient();
      if (!client) {
        return snapshotSingleton(careersPage_default);
      }
      try {
        const row = await client.fetch(careersPageQuery);
        return row ?? snapshotSingleton(careersPage_default);
      } catch {
        return snapshotSingleton(careersPage_default);
      }
    };
    fetchOpenRolesForPrerender = async () => {
      const client = getPrerenderSanityClient();
      if (client) {
        try {
          const rows = await client.fetch(openRolesQuery);
          if (Array.isArray(rows) && rows.length > 0) return rows;
        } catch {
        }
      }
      return snapshotOpenRoles();
    };
    fetchProgramsLandingForPrerender = async () => {
      const client = getPrerenderSanityClient();
      if (!client) return snapshotSingleton(programsLandingPage_default);
      try {
        const doc = await client.fetch(programsLandingQuery);
        return doc ?? snapshotSingleton(programsLandingPage_default);
      } catch {
        return snapshotSingleton(programsLandingPage_default);
      }
    };
  }
});

// shared/cms/itemDetailSeo.ts
var clampMetaTitle, clampMetaDescription, pickSeoTitle2, pickSeoDescription2, buildAdvisorProfileSeoTitle, buildAlumniProfileSeoTitle, resolveAlumniProfileSeo, resolveAdvisorProfileSeo, buildEventItemSeo, buildProgramItemSeo, buildCareersRoleItemSeo, buildStoryItemSeo, resolveItemDetailSeoForPath, findProgramsEventRecord;
var init_itemDetailSeo = __esm({
  "shared/cms/itemDetailSeo.ts"() {
    init_careersRoleShare();
    init_collectionSeo();
    init_eventSlug();
    init_itemCardImage();
    init_portableTextPlain();
    clampMetaTitle = (title, max = 70) => {
      const trimmed = title.trim();
      if (trimmed.length <= max) return trimmed;
      return `${trimmed.slice(0, max - 1).trim()}\u2026`;
    };
    clampMetaDescription = (description, max = 160) => {
      const trimmed = description.trim();
      if (trimmed.length <= max) return trimmed;
      return `${trimmed.slice(0, max - 1).trim()}\u2026`;
    };
    pickSeoTitle2 = (seo) => seo?.metaTitle?.trim() || seo?.ogTitle?.trim() || void 0;
    pickSeoDescription2 = (seo) => seo?.metaDescription?.trim() || seo?.ogDescription?.trim() || void 0;
    buildAdvisorProfileSeoTitle = (name) => clampMetaTitle(`${name.trim()} \u2014 Advisors`);
    buildAlumniProfileSeoTitle = (name) => clampMetaTitle(`${name.trim()} \u2014 Founders`);
    resolveAlumniProfileSeo = (input) => {
      const name = input.name.trim() || "Alumni company";
      const title = pickSeoTitle2(input.seo) || buildAlumniProfileSeoTitle(name);
      const description = pickSeoDescription2(input.seo) || input.shortDescription?.trim() || input.tagline?.trim() || "Alumni company profile in the Rellia Health founder network.";
      return {
        title,
        description: clampMetaDescription(description),
        ogImageSrc: input.logoSrc?.trim() || void 0,
        ogImageLandscape: true,
        ogImageContain: true
      };
    };
    resolveAdvisorProfileSeo = (input) => {
      const name = input.name.trim() || "Advisor";
      const bioText = typeof input.snapshot === "string" && input.snapshot.trim() || typeof input.focus === "string" && input.focus.trim() || portableTextToPlainText(input.bio) || "Advisor profile in the Rellia Health mentor directory.";
      const title = pickSeoTitle2(input.seo) || buildAdvisorProfileSeoTitle(name);
      const description = pickSeoDescription2(input.seo) || bioText;
      return {
        title,
        description: clampMetaDescription(description),
        ogImageSrc: input.photoSrc?.trim() || void 0,
        ogImageLandscape: true
      };
    };
    buildEventItemSeo = (event, slug) => {
      const cmsImageSrc = typeof event.imageSrc === "string" ? event.imageSrc : void 0;
      const imageSrc = resolveEventCardImageSrc(slug, cmsImageSrc);
      const resolved = resolveEventCollectionSeo({
        title: typeof event.title === "string" ? event.title : "Event",
        eventDescription: event.eventDescription,
        detailBody: event.detailBody,
        startsAt: typeof event.startsAt === "string" ? event.startsAt : void 0,
        endsAt: typeof event.endsAt === "string" ? event.endsAt : void 0,
        dateTime: typeof event.dateTime === "string" ? event.dateTime : void 0,
        seo: event.seo ?? null,
        imageSrc
      });
      return {
        title: clampMetaTitle(resolved.title),
        description: clampMetaDescription(resolved.description),
        ogImageSrc: imageSrc?.trim() || void 0,
        ogImageLandscape: true
      };
    };
    buildProgramItemSeo = (program, slug, routeTitle) => {
      const resolved = resolveProgramCollectionSeo({
        title: typeof program.title === "string" ? program.title : routeTitle || void 0,
        heroTitle: typeof program.heroTitle === "string" ? program.heroTitle : void 0,
        description: typeof program.description === "string" ? program.description : void 0,
        heroDescription: typeof program.heroDescription === "string" ? program.heroDescription : void 0,
        seo: program.seo ?? null,
        imageSrc: typeof program.imageSrc === "string" ? program.imageSrc : void 0
      });
      const ogSrc = resolved.ogImageUrl?.trim() || (typeof program.imageSrc === "string" ? program.imageSrc.trim() : void 0);
      return {
        title: clampMetaTitle(resolved.title),
        description: clampMetaDescription(resolved.description),
        ogImageSrc: ogSrc || void 0,
        ogImageLandscape: true
      };
    };
    buildCareersRoleItemSeo = (role) => {
      const shareRole = {
        id: "",
        title: typeof role.title === "string" ? role.title : "Open role",
        location: typeof role.location === "string" ? role.location : "",
        employmentType: typeof role.employmentType === "string" ? role.employmentType : "",
        description: Array.isArray(role.description) ? role.description : null,
        responsibilities: Array.isArray(role.responsibilities) ? role.responsibilities.filter((line) => typeof line === "string") : []
      };
      const resolved = buildCareersRoleShareMeta(shareRole);
      return {
        title: clampMetaTitle(resolved.title),
        description: clampMetaDescription(resolved.description),
        ogImageSrc: resolved.ogImageUrl?.trim() || void 0,
        ogImageLandscape: true
      };
    };
    buildStoryItemSeo = (story) => {
      const resolved = resolveStoryCollectionSeo({
        title: story.title,
        tag: story.tag,
        excerpt: story.excerpt,
        seo: story.seo,
        coverImageSrc: story.coverImageSrc
      });
      return {
        title: clampMetaTitle(resolved.title),
        description: clampMetaDescription(resolved.description),
        ogImageSrc: story.coverImageSrc?.trim() || void 0,
        ogImageLandscape: true,
        ogType: "article"
      };
    };
    resolveItemDetailSeoForPath = (pathname, prefetched, options) => {
      const key = pathname.replace(/\/+$/, "") || "/";
      if (key.startsWith("/careers/roles/")) {
        const roleId = parseCareersRoleIdFromPathname(key);
        if (!roleId) return null;
        const role = prefetched.careersRole;
        if (!role || typeof role.title !== "string") return null;
        return buildCareersRoleItemSeo(role);
      }
      if (key.startsWith("/events/") && key !== "/events") {
        const slug = key.slice("/events/".length);
        const event = prefetched.event;
        if (!event) return null;
        return buildEventItemSeo(event, slug);
      }
      if (key.startsWith("/programs/") && key !== "/programs") {
        const slug = key.slice("/programs/".length);
        const program = prefetched.program ?? defaultProgramRecordForSlug(slug);
        if (!program) return null;
        return buildProgramItemSeo(program, slug, options?.programRouteTitle);
      }
      if (key.startsWith("/stories/") && key !== "/stories") {
        const cms = prefetched.story;
        if (!cms || typeof cms.title !== "string") return null;
        return buildStoryItemSeo({
          title: cms.title,
          tag: typeof cms.tag === "string" ? cms.tag : void 0,
          excerpt: typeof cms.excerpt === "string" ? cms.excerpt : void 0,
          coverImageSrc: typeof cms.coverImageSrc === "string" ? cms.coverImageSrc : void 0,
          seo: cms.seo
        });
      }
      if (key.startsWith("/advisors/directory/") && key !== "/advisors/directory") {
        const advisor = prefetched.advisor;
        if (!advisor) return null;
        const name = typeof advisor.name === "string" ? advisor.name : "Advisor";
        return resolveAdvisorProfileSeo({
          name,
          snapshot: typeof advisor.snapshot === "string" ? advisor.snapshot : void 0,
          focus: typeof advisor.focus === "string" ? advisor.focus : void 0,
          bio: advisor.bio,
          photoSrc: typeof advisor.photoSrc === "string" ? advisor.photoSrc : void 0,
          seo: advisor.seo
        });
      }
      if (key.startsWith("/founders/alumni/") && key !== "/founders/alumni") {
        const company = prefetched.alumni;
        if (!company) return null;
        const name = (typeof company.name === "string" ? company.name : "") || (typeof company.logoName === "string" ? company.logoName : "") || "Alumni company";
        return resolveAlumniProfileSeo({
          name,
          shortDescription: typeof company.shortDescription === "string" ? company.shortDescription : void 0,
          tagline: typeof company.tagline === "string" ? company.tagline : void 0,
          logoSrc: typeof company.logoSrc === "string" ? company.logoSrc : void 0,
          seo: company.seo
        });
      }
      return null;
    };
    findProgramsEventRecord = (slug, programsLanding) => {
      const match = findProgramsEventBySlug(slug, programsLanding);
      if (!match) return null;
      const { _variant: _ignored, ...rest } = match;
      return rest;
    };
  }
});

// shared/cms/injectSocialMetaHtml.ts
var escapeMetaAttr, buildSocialMetaTagsHtml, injectSocialMetaIntoHtml, itemDetailSeoToSocialMeta;
var init_injectSocialMetaHtml = __esm({
  "shared/cms/injectSocialMetaHtml.ts"() {
    escapeMetaAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    buildSocialMetaTagsHtml = (meta) => {
      const lines = [
        `<title>${escapeMetaAttr(meta.title)}</title>`,
        `<meta name="description" content="${escapeMetaAttr(meta.description)}" />`,
        `<link rel="canonical" href="${escapeMetaAttr(meta.canonical)}" />`,
        `<meta name="robots" content="index, follow" />`,
        `<meta property="og:type" content="${meta.ogType ?? "website"}" />`,
        `<meta property="og:locale" content="en_US" />`,
        `<meta property="og:site_name" content="Rellia Health" />`,
        `<meta property="og:url" content="${escapeMetaAttr(meta.canonical)}" />`,
        `<meta property="og:title" content="${escapeMetaAttr(meta.title)}" />`,
        `<meta property="og:description" content="${escapeMetaAttr(meta.description)}" />`,
        `<meta name="twitter:title" content="${escapeMetaAttr(meta.title)}" />`,
        `<meta name="twitter:description" content="${escapeMetaAttr(meta.description)}" />`
      ];
      if (meta.themeColor) {
        lines.push(`<meta name="theme-color" content="${escapeMetaAttr(meta.themeColor)}" />`);
      }
      if (meta.ogImage?.trim()) {
        lines.push(`<meta property="og:image" content="${escapeMetaAttr(meta.ogImage)}" />`);
        if (typeof meta.ogImageWidth === "number" && typeof meta.ogImageHeight === "number") {
          lines.push(`<meta property="og:image:width" content="${String(meta.ogImageWidth)}" />`);
          lines.push(`<meta property="og:image:height" content="${String(meta.ogImageHeight)}" />`);
        }
        lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
        lines.push(`<meta name="twitter:image" content="${escapeMetaAttr(meta.ogImage)}" />`);
      } else {
        lines.push(`<meta name="twitter:card" content="summary" />`);
      }
      return lines.join("\n");
    };
    injectSocialMetaIntoHtml = (html, meta) => {
      const tags = buildSocialMetaTagsHtml(meta);
      const headClose = html.indexOf("</head>");
      if (headClose === -1) return html;
      let cleaned = html.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "").replace(/<meta\s+name="description"[^>]*>/gi, "").replace(/<link\s+rel="canonical"[^>]*>/gi, "").replace(/<meta\s+name="robots"[^>]*>/gi, "").replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, "").replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, "").replace(/<meta\s+name="theme-color"[^>]*>/gi, "");
      const cleanedHeadClose = cleaned.indexOf("</head>");
      if (cleanedHeadClose === -1) return html;
      return `${cleaned.slice(0, cleanedHeadClose)}${tags}
${cleaned.slice(cleanedHeadClose)}`;
    };
    itemDetailSeoToSocialMeta = (seo, canonical, ogImage) => ({
      title: seo.title,
      description: seo.description,
      canonical,
      ogImage: ogImage?.url,
      ogImageWidth: ogImage?.width,
      ogImageHeight: ogImage?.height,
      ogType: seo.ogType,
      themeColor: "#0D3540"
    });
  }
});

// server/socialHtmlHandler.ts
var socialHtmlHandler_exports = {};
__export(socialHtmlHandler_exports, {
  isSocialCrawlerUserAgent: () => isSocialCrawlerUserAgent,
  renderSocialHtmlForPath: () => renderSocialHtmlForPath,
  shouldServeSocialHtml: () => shouldServeSocialHtml
});
var SOCIAL_BOT_PATTERN, isSocialCrawlerUserAgent, normalizePath, getSiteOrigin, resolveOgImageAbsolute, buildPrefetchForPath, cachedIndexHtml, loadIndexHtmlTemplate, renderSocialHtmlForPath, shouldServeSocialHtml;
var init_socialHtmlHandler = __esm({
  "server/socialHtmlHandler.ts"() {
    init_prerenderSanity();
    init_eventSlug();
    init_careersRoleShare();
    init_careersOpenRolesVisibility();
    init_careersPageDefaults();
    init_defaults();
    init_itemDetailSeo();
    init_injectSocialMetaHtml();
    SOCIAL_BOT_PATTERN = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|WhatsApp|Discordbot|Pinterest|TelegramBot|Googlebot|bingbot/i;
    isSocialCrawlerUserAgent = (userAgent) => Boolean(userAgent && SOCIAL_BOT_PATTERN.test(userAgent));
    normalizePath = (pathname) => {
      const trimmed = pathname.trim();
      if (!trimmed || trimmed === "/") return "/";
      return trimmed.replace(/\/+$/, "") || "/";
    };
    getSiteOrigin = () => {
      const explicit = process.env.VITE_SITE_URL?.trim() || process.env.SITE_URL?.trim();
      if (explicit) return explicit.replace(/\/$/, "");
      if (process.env.VERCEL_ENV === "production") return "https://www.relliahealth.com";
      const vercelUrl = process.env.VERCEL_URL?.trim();
      if (vercelUrl) return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
      return "https://www.relliahealth.com";
    };
    resolveOgImageAbsolute = (seo, siteOrigin) => {
      const src = seo.ogImageSrc?.trim();
      if (!src) return void 0;
      const absolute = /^https?:\/\//i.test(src) ? src : `${siteOrigin}${src.startsWith("/") ? src : `/${src}`}`;
      return {
        url: absolute,
        width: 1200,
        height: 630
      };
    };
    buildPrefetchForPath = async (pathname) => {
      const prefetched = {};
      if (pathname.startsWith("/stories/") && pathname !== "/stories") {
        const slug = pathname.slice("/stories/".length);
        prefetched.story = await fetchStoryBySlugForPrerender(slug) ?? null;
        return prefetched;
      }
      if (pathname.startsWith("/founders/alumni/") && pathname !== "/founders/alumni") {
        const id = pathname.slice("/founders/alumni/".length);
        const companies = await fetchAlumniCompaniesForPrerender();
        prefetched.alumni = companies.find((entry) => String(entry.id ?? "") === id) ?? null;
        return prefetched;
      }
      if (pathname.startsWith("/advisors/directory/") && pathname !== "/advisors/directory") {
        const id = pathname.slice("/advisors/directory/".length);
        const advisors = await fetchAdvisorsForPrerender();
        prefetched.advisor = advisors.find((entry) => String(entry.id ?? "") === id) ?? null;
        return prefetched;
      }
      if (pathname.startsWith("/careers/roles/")) {
        const roleId = parseCareersRoleIdFromPathname(pathname);
        const [careersPage, roles] = await Promise.all([
          fetchCareersPageForPrerender(),
          fetchOpenRolesForPrerender()
        ]);
        const openRoles = filterValidOpenRoles(roles?.length ? roles : careersPage?.openRoles);
        prefetched.careersRole = openRoles.find((role) => role.id === roleId) ?? mergeCareersPage(careersPage ?? void 0).openRoles.find((role) => role.id === roleId) ?? null;
        return prefetched;
      }
      if (pathname.startsWith("/events/") && pathname !== "/events") {
        const slug = pathname.slice("/events/".length);
        const events = await fetchEventsForPrerender();
        prefetched.event = events.find((event) => getProgramsEventSlug(event) === slug) ?? findProgramsEventRecord(slug, DEFAULT_PROGRAMS_LANDING);
        return prefetched;
      }
      if (pathname.startsWith("/programs/") && pathname !== "/programs") {
        const slug = pathname.slice("/programs/".length);
        const landing = await fetchProgramsLandingForPrerender();
        const programs = [
          ...Array.isArray(landing?.programs) ? landing.programs : [],
          ...Array.isArray(DEFAULT_PROGRAMS_LANDING.programs) ? DEFAULT_PROGRAMS_LANDING.programs : []
        ];
        prefetched.program = programs.find((program) => String(program.slug ?? "") === slug) ?? null;
        return prefetched;
      }
      return prefetched;
    };
    cachedIndexHtml = null;
    loadIndexHtmlTemplate = async (siteOrigin) => {
      if (cachedIndexHtml) return cachedIndexHtml;
      const response = await fetch(`${siteOrigin}/index.html`, {
        headers: { "User-Agent": "rellia-social-html/1.0" }
      });
      if (!response.ok) {
        throw new Error(`Could not load index.html from ${siteOrigin}`);
      }
      cachedIndexHtml = await response.text();
      return cachedIndexHtml;
    };
    renderSocialHtmlForPath = async (pathname) => {
      const normalizedPath = normalizePath(pathname);
      const prefetched = await buildPrefetchForPath(normalizedPath);
      const itemSeo = resolveItemDetailSeoForPath(normalizedPath, prefetched);
      if (!itemSeo) return null;
      const siteOrigin = getSiteOrigin();
      const canonical = `${siteOrigin}${normalizedPath === "/" ? "" : normalizedPath}`;
      const ogImage = resolveOgImageAbsolute(itemSeo, siteOrigin);
      const socialMeta = itemDetailSeoToSocialMeta(itemSeo, canonical, ogImage);
      const template = await loadIndexHtmlTemplate(siteOrigin);
      const html = injectSocialMetaIntoHtml(template, socialMeta);
      return { html, title: itemSeo.title };
    };
    shouldServeSocialHtml = (pathname, userAgent) => {
      const normalizedPath = normalizePath(pathname);
      if (!isSocialCrawlerUserAgent(userAgent)) return false;
      return normalizedPath.startsWith("/stories/") || normalizedPath.startsWith("/founders/alumni/") || normalizedPath.startsWith("/advisors/directory/") || normalizedPath.startsWith("/careers/roles/") || normalizedPath.startsWith("/events/") || normalizedPath.startsWith("/programs/");
    };
  }
});

// server/loadEnv.ts
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
if (process.env.VERCEL !== "1") {
  const require2 = createRequire(import.meta.url);
  const dotenv = require2("dotenv");
  const serverDir = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(serverDir, "..");
  dotenv.config({ path: path.join(root, ".env") });
  dotenv.config({ path: path.join(root, ".env.local"), override: true });
}

// server/index.ts
import cors from "cors";
import express from "express";
import helmet from "helmet";

// shared/csp.ts
var MARKETING_FRAME_ANCESTORS_CSP = "frame-ancestors 'self' https://*.sanity.studio https://*.sanity.io";

// server/index.ts
import { z as z2 } from "zod";
import { createClient as createClient6 } from "@sanity/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { withoutSecretSearchParams } from "@sanity/preview-url-secret/without-secret-search-params";
import { perspectiveCookieName as perspectiveCookieName2 } from "@sanity/preview-url-secret/constants";

// shared/cms/sanityQueryRegistry.ts
init_groqQueries();
import { z } from "zod";
var empty = z.object({}).strict();
var slugParams = z.object({
  slug: z.string().trim().min(1).max(200)
}).strict();
var SANITY_QUERY_WHITELIST = {
  globalSettings: { query: globalSettingsQuery, params: empty },
  navigation: { query: navigationQuery, params: empty },
  siteSettings: { query: siteSettingsQuery, params: empty },
  featuredStories: { query: featuredStoriesQuery, params: empty },
  stories: { query: storiesQuery, params: empty },
  storiesPage: { query: storiesPageQuery, params: empty },
  storyBySlug: { query: storyBySlugQuery, params: slugParams },
  pageBySlug: { query: pageBySlugQuery, params: slugParams },
  networkFoundersPage: { query: networkFoundersPageQuery, params: empty },
  networkAdvisorsPage: { query: networkAdvisorsPageQuery, params: empty },
  networkAlumniDirectoryPage: { query: networkAlumniDirectoryPageQuery, params: empty },
  networkAdvisorsDirectoryPage: { query: networkAdvisorsDirectoryPageQuery, params: empty },
  networkInvestorsPage: { query: networkInvestorsPageQuery, params: empty },
  networkPartnersPage: { query: networkPartnersPageQuery, params: empty },
  diagnosticLandingPage: { query: diagnosticLandingPageQuery, params: empty },
  consultingPage: { query: consultingPageQuery, params: empty },
  termsPage: { query: termsPageQuery, params: empty },
  privacyPage: { query: privacyPageQuery, params: empty },
  homePage: { query: homePageQuery, params: empty },
  aboutPage: { query: aboutPageQuery, params: empty },
  faqPage: { query: faqPageQuery, params: empty },
  programsLanding: { query: programsLandingQuery, params: empty },
  programsLayoutPage: { query: programsLayoutPageQuery, params: empty },
  eventsLanding: { query: eventsLandingQuery, params: empty },
  programs: { query: programsQuery, params: empty },
  programBySlug: { query: programBySlugQuery, params: slugParams },
  events: { query: eventsQuery, params: empty },
  eventBySlug: { query: eventBySlugQuery, params: slugParams },
  contactPage: { query: contactPageQuery, params: empty },
  notFound: { query: notFoundQuery, params: empty },
  paymentPage: { query: paymentPageQuery, params: empty },
  applyPage: { query: applyPageQuery, params: empty },
  diagnosticSurveyContent: { query: diagnosticSurveyContentQuery, params: empty },
  careersPage: { query: careersPageQuery, params: empty },
  openRoles: { query: openRolesQuery, params: empty },
  advisors: { query: advisorsQuery, params: empty },
  alumniCompanies: { query: alumniCompaniesQuery, params: empty },
  directoryFilterGroups: { query: directoryFilterGroupsQuery, params: empty },
  sanityDrafts: { query: sanityDraftsQuery, params: empty },
  sanityRecentEdits: { query: sanityRecentEditsQuery, params: empty }
};
var isSanityQueryId = (value) => Object.prototype.hasOwnProperty.call(SANITY_QUERY_WHITELIST, value);

// server/sanityResponseSanitize.ts
var STRIP_KEYS = /* @__PURE__ */ new Set(["_id", "_rev", "_ref", "allReferences"]);
var PRESERVE_ID_QUERIES = /* @__PURE__ */ new Set(["sanityDrafts", "sanityRecentEdits"]);
var stripSanityMetadata = (value, queryId) => {
  const stripKeys = queryId && PRESERVE_ID_QUERIES.has(queryId) ? /* @__PURE__ */ new Set(["_rev", "_ref", "allReferences"]) : STRIP_KEYS;
  if (value == null) return value;
  if (Array.isArray(value)) {
    return value.map((item) => stripSanityMetadata(item, queryId));
  }
  if (typeof value === "object") {
    const o = value;
    const out = {};
    for (const [k, v] of Object.entries(o)) {
      if (stripKeys.has(k)) continue;
      out[k] = stripSanityMetadata(v, queryId);
    }
    return out;
  }
  return value;
};

// server/sanityPreview.ts
init_sanityEnv();
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";
var SANITY_STUDIO_FALLBACK_URL = "https://relliahealth.sanity.studio";
var LOCAL_STUDIO_URL = "http://localhost:3333";
var resolveSanityStudioUrl = () => {
  if (process.env.NODE_ENV !== "production") return LOCAL_STUDIO_URL;
  return process.env.SANITY_STUDIO_URL?.trim() || SANITY_STUDIO_FALLBACK_URL;
};
var isSanityStudioReferer = (req) => {
  const referer = (req.get("referer") || "").toLowerCase();
  if (referer.includes(".sanity.studio") || referer.includes(".sanity.io")) return true;
  return referer.includes("localhost:3333") || referer.includes("127.0.0.1:3333");
};
var hasSanityPreviewPerspectiveCookie = (cookieHeader) => cookieHeader.includes(`${perspectiveCookieName}=`);
var SANITY_PRESENTATION_HEADER = "x-sanity-presentation";
var isPresentationPreviewRequest = (req, cookieHeader, siteOriginsAllowed) => {
  if (hasSanityPreviewPerspectiveCookie(cookieHeader)) return true;
  if (!siteOriginsAllowed) return false;
  return (req.get(SANITY_PRESENTATION_HEADER) || "").trim() === "1";
};
var shouldUseSanityDraftsPerspective = (req, isPreviewSession) => {
  if (isVercelPreviewDeployment()) return true;
  const hasPresentationHeader = (req.get(SANITY_PRESENTATION_HEADER) || "").trim() === "1";
  if (process.env.VERCEL_ENV === "production") {
    return hasPresentationHeader;
  }
  return isPreviewSession;
};

// server/sanityEnv.ts
init_sanityEnv();

// server/csrf.ts
import { randomBytes } from "node:crypto";
var CSRF_COOKIE_NAME = "rellia_csrf";
var CSRF_MAX_AGE_S = 7200;
var parseCookieHeader = (raw) => {
  const out = {};
  if (!raw) return out;
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
};
var buildCsrfSetCookie = (token, isDev) => {
  const parts = [
    `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${CSRF_MAX_AGE_S}`,
    // Presentation embeds the preview site in a cross-site iframe; Lax cookies are not sent on POST.
    isDev ? "SameSite=Lax" : "SameSite=None"
  ];
  if (!isDev) parts.push("Secure");
  return parts.join("; ");
};
var issueCsrfToken = () => randomBytes(32).toString("base64url");
var requireApiCsrf = (isDev) => (req, res, next) => {
  if (process.env.REQUIRE_API_CSRF === "false") {
    next();
    return;
  }
  const cookies = parseCookieHeader(req.headers.cookie);
  const header = (req.get("x-csrf-token") || "").trim();
  const cookie = cookies[CSRF_COOKIE_NAME];
  if (!header || !cookie || header !== cookie || header.length < 20) {
    res.status(403).json({
      error: "Invalid or missing CSRF token. Reload the page and try again.",
      code: "CSRF"
    });
    return;
  }
  next();
};

// server/adminSignupEnv.ts
var isAdminSignupEnabled = () => {
  const raw = (process.env.ADMIN_SIGNUP_ENABLED ?? "").trim().toLowerCase();
  if (!raw) return false;
  const normalized = raw.replace(/^["']|["']$/g, "");
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
};

// server/siteOrigins.ts
var safeOriginFromUrl = (input) => {
  const value = (input ?? "").trim();
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};
var buildSiteOrigins = () => {
  const origins = /* @__PURE__ */ new Set();
  const add = (value) => {
    const origin = safeOriginFromUrl(value);
    if (origin) origins.add(origin);
  };
  add(process.env.VITE_SITE_URL);
  add(process.env.SITE_URL);
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    add(vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`);
  }
  for (const entry of (process.env.ALLOWED_ORIGINS || "").split(",")) {
    add(entry.trim());
  }
  origins.add("https://www.relliahealth.com");
  origins.add("https://relliahealth.com");
  return origins;
};
var isAllowedBrowserOrigin = (req, baseOrigins, isDev) => {
  if (isDev) return true;
  const allowed = new Set(baseOrigins);
  const host = (req.get("host") || "").trim();
  const forwardedProto = (req.get("x-forwarded-proto") || req.protocol || "https").split(",")[0]?.trim();
  const proto = forwardedProto || "https";
  if (host) {
    allowed.add(`${proto}://${host}`);
    if (host.startsWith("www.")) {
      allowed.add(`${proto}://${host.slice(4)}`);
    }
  }
  const originHeader = (req.get("origin") || "").trim();
  if (originHeader && allowed.has(originHeader)) return true;
  if (originHeader && (originHeader.endsWith(".sanity.studio") || originHeader.endsWith(".sanity.io") || originHeader.includes("localhost:3333") || originHeader.includes("127.0.0.1:3333"))) {
    return true;
  }
  const refererHeader = (req.get("referer") || "").trim();
  const refererOrigin = safeOriginFromUrl(refererHeader);
  if (refererOrigin && allowed.has(refererOrigin)) return true;
  if (refererOrigin && (refererOrigin.endsWith(".sanity.studio") || refererOrigin.endsWith(".sanity.io") || refererOrigin.includes("localhost:3333") || refererOrigin.includes("127.0.0.1:3333"))) {
    return true;
  }
  if (!originHeader && host && allowed.has(`${proto}://${host}`)) return true;
  return false;
};

// shared/admin/notifyLinks.ts
var trimTrailingSlash = (url) => url.replace(/\/$/, "");
var resolveSiteOrigin = () => {
  const fromVite = typeof import.meta !== "undefined" && import.meta.env && typeof import.meta.env.VITE_SITE_URL === "string" ? import.meta.env.VITE_SITE_URL.trim() : "";
  const fromNode = typeof process !== "undefined" ? process.env.VITE_SITE_URL?.trim() || process.env.SITE_URL?.trim() || "" : "";
  return trimTrailingSlash(fromVite || fromNode || "https://www.relliahealth.com");
};
var adminContentUrl = () => `${resolveSiteOrigin()}/admin/content`;
var resolveSanityStudioOrigin = () => {
  const fromVite = typeof import.meta !== "undefined" && import.meta.env && typeof import.meta.env.VITE_SANITY_STUDIO_URL === "string" ? import.meta.env.VITE_SANITY_STUDIO_URL.trim() : "";
  const fromNode = typeof process !== "undefined" ? process.env.SANITY_STUDIO_URL?.trim() || process.env.VITE_SANITY_STUDIO_URL?.trim() || "" : "";
  return trimTrailingSlash(fromVite || fromNode || "https://relliahealth.sanity.studio");
};
var encodeIntentParams = (params) => Object.entries(params).filter(([, value]) => value.length > 0).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join(";");
var resolveStudioDocumentId = (documentId, editDraft) => {
  const trimmed = typeof documentId === "string" ? documentId.trim() : "";
  if (!trimmed) return "";
  if (editDraft) return trimmed.startsWith("drafts.") ? trimmed : `drafts.${trimmed}`;
  return trimmed.replace(/^drafts\./, "");
};
var studioDeskUrl = (documentType, documentId, options) => {
  const studioBase = resolveSanityStudioOrigin();
  const editDraft = options?.editDraft ?? documentId.trim().startsWith("drafts.");
  const docId = resolveStudioDocumentId(documentId, editDraft);
  const docType = typeof documentType === "string" ? documentType.trim() : "";
  if (!docId || !docType) return studioBase;
  const params = encodeIntentParams({ id: docId, type: docType });
  return `${studioBase}/intent/edit/${params}`;
};

// server/slackNotify.ts
var slackWebhookUrl = () => process.env.SLACK_WEBHOOK_URL?.trim() || "";
var buildSlackBlocks = (heading, bodyLines, buttons) => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: [heading, ...bodyLines].filter(Boolean).join("\n")
      }
    }
  ];
  if (buttons.length > 0) {
    blocks.push({
      type: "actions",
      elements: buttons.map((button) => ({
        type: "button",
        text: { type: "plain_text", text: button.text, emoji: true },
        url: button.url,
        action_id: button.actionId
      }))
    });
  }
  return { blocks };
};
var postSlackBlocks = async (payload) => {
  const url = slackWebhookUrl();
  if (!url) {
    console.warn("postSlackBlocks: SLACK_WEBHOOK_URL is not set");
    return false;
  }
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.error("Slack webhook failed", response.status, errText.slice(0, 400));
    return false;
  }
  return true;
};
var isDraftId = (id) => id.startsWith("drafts.");
var isSkippableSanityType = (type) => type.startsWith("sanity.") || type === "system.schema";
var notifySanityDraftToSlack = async (doc) => {
  if (!isDraftId(doc._id) || isSkippableSanityType(doc._type)) return false;
  const title = doc.title?.trim() || doc._type;
  const studioUrl = studioDeskUrl(doc._type, doc._id);
  const dashboardUrl = adminContentUrl();
  const payload = buildSlackBlocks(
    ":pencil2: *New Sanity draft*",
    [
      `\u2022 Type: ${doc._type}`,
      `\u2022 Title: ${title}`,
      `\u2022 Document: \`${doc._id}\``
    ],
    [
      { text: "View in Studio", url: studioUrl, actionId: "open_studio" },
      { text: "View in dashboard", url: dashboardUrl, actionId: "open_content_queue" }
    ]
  );
  return postSlackBlocks(payload);
};
var extractSanityDraftDocs = (body) => {
  if (!body || typeof body !== "object") return [];
  const record = body;
  const results = [];
  const pushIfDraft = (candidate) => {
    if (!candidate || typeof candidate !== "object") return;
    const row = candidate;
    const id = typeof row._id === "string" ? row._id : "";
    const type = typeof row._type === "string" ? row._type : "";
    if (!id || !type || !isDraftId(id) || isSkippableSanityType(type)) return;
    const title = typeof row.title === "string" ? row.title : typeof row.name === "string" ? row.name : typeof row.headline === "string" ? row.headline : void 0;
    results.push({ _id: id, _type: type, title });
  };
  pushIfDraft(body);
  if (Array.isArray(record.documents)) {
    for (const doc of record.documents) pushIfDraft(doc);
  }
  if (Array.isArray(record.results)) {
    for (const doc of record.results) pushIfDraft(doc);
  }
  const seen = /* @__PURE__ */ new Set();
  return results.filter((row) => {
    if (seen.has(row._id)) return false;
    seen.add(row._id);
    return true;
  });
};

// server/sanityPublishSync.ts
import { createClient } from "@sanity/client";
var isPublishedId = (id) => Boolean(id) && !id.startsWith("drafts.");
var isSyncableType = (type) => Boolean(type) && !type.startsWith("system.") && !type.startsWith("sanity.");
var extractPublishedMutationIds = (body) => {
  if (!body || typeof body !== "object") {
    return { upsertIds: [], deleteIds: [] };
  }
  const record = body;
  const upsert = /* @__PURE__ */ new Set();
  const deleted = /* @__PURE__ */ new Set();
  const ids = record.ids;
  if (ids && typeof ids === "object") {
    const bucket = ids;
    for (const key of ["created", "updated"]) {
      const list = bucket[key];
      if (!Array.isArray(list)) continue;
      for (const id of list) {
        if (typeof id === "string" && isPublishedId(id)) upsert.add(id);
      }
    }
    const removed = bucket.deleted;
    if (Array.isArray(removed)) {
      for (const id of removed) {
        if (typeof id === "string" && isPublishedId(id)) deleted.add(id);
      }
    }
  }
  if (Array.isArray(record.documents)) {
    for (const doc of record.documents) {
      if (!doc || typeof doc !== "object") continue;
      const row = doc;
      const id = typeof row._id === "string" ? row._id : "";
      if (isPublishedId(id)) upsert.add(id);
    }
  }
  return {
    upsertIds: [...upsert],
    deleteIds: [...deleted]
  };
};
var stripForReplace = (doc) => {
  const { _rev, ...rest } = doc;
  return rest;
};
var syncPublishedDocsToProduction = async (options) => {
  const { projectId, writeToken, upsertIds, deleteIds } = options;
  if (upsertIds.length === 0 && deleteIds.length === 0) {
    return { synced: 0, deleted: 0, skipped: 0 };
  }
  const preview = createClient({
    projectId,
    dataset: "preview",
    token: writeToken,
    apiVersion: "2024-01-01",
    useCdn: false
  });
  const production = createClient({
    projectId,
    dataset: "production",
    token: writeToken,
    apiVersion: "2024-01-01",
    useCdn: false
  });
  let synced = 0;
  let skipped = 0;
  for (const id of upsertIds) {
    const doc = await preview.fetch(`*[_id == $id][0]{...}`, { id });
    if (!doc || typeof doc._type !== "string" || !isSyncableType(doc._type)) {
      skipped += 1;
      continue;
    }
    if (doc._type === "sanity.imageAsset" || doc._type === "sanity.fileAsset" || id.startsWith("image-") || id.startsWith("file-")) {
      await production.createOrReplace(stripForReplace(doc));
      synced += 1;
      continue;
    }
    await production.createOrReplace(stripForReplace(doc));
    synced += 1;
  }
  let deleted = 0;
  if (deleteIds.length > 0) {
    const tx = production.transaction();
    for (const id of deleteIds) {
      tx.delete(id);
    }
    await tx.commit();
    deleted = deleteIds.length;
  }
  return { synced, deleted, skipped };
};

// server/cmsHealth.ts
import { createClient as createClient2 } from "@sanity/client";
var envFlag = (name) => Boolean(process.env[name]?.trim());
var resolveExpectedDataset = () => {
  if (!process.env.VERCEL) return null;
  const ve = process.env.VERCEL_ENV?.trim();
  if (ve === "production") return "production";
  if (ve === "preview") {
    return process.env.SANITY_VERCEL_PREVIEW_DATASET?.trim() || process.env.SANITY_API_DATASET?.trim() || process.env.VITE_SANITY_DATASET?.trim() || "production";
  }
  return null;
};
var cmsHealthHandler = async (_req, res) => {
  const apiResolved = resolveSanityApiConfig();
  const readTokenConfigured = envFlag("SANITY_API_READ_TOKEN");
  const writeTokenConfigured = envFlag("SANITY_API_WRITE_TOKEN");
  const publishWebhookSecretConfigured = envFlag("SANITY_PUBLISH_WEBHOOK_SECRET");
  const expectedDataset = resolveExpectedDataset();
  const publishWebhookReady = publishWebhookSecretConfigured && writeTokenConfigured && apiResolved.status === "ok";
  let previewHomeTitle = null;
  let productionHomeTitle = null;
  let datasetProbeError = null;
  if (writeTokenConfigured && apiResolved.status === "ok") {
    try {
      const token = process.env.SANITY_API_WRITE_TOKEN.trim();
      const { projectId } = apiResolved;
      const previewClient = createClient2({
        projectId,
        dataset: "preview",
        token,
        apiVersion: "2024-01-01",
        useCdn: false
      });
      const productionClient = createClient2({
        projectId,
        dataset: "production",
        token,
        apiVersion: "2024-01-01",
        useCdn: false
      });
      const titleQuery = `*[_id == "homePage"][0].pathsTitle`;
      const [previewTitle, productionTitle] = await Promise.all([
        previewClient.fetch(titleQuery),
        productionClient.fetch(titleQuery)
      ]);
      previewHomeTitle = typeof previewTitle === "string" ? previewTitle : null;
      productionHomeTitle = typeof productionTitle === "string" ? productionTitle : null;
    } catch (err) {
      datasetProbeError = err instanceof Error ? err.message : "Could not compare preview vs production datasets";
    }
  }
  const datasetsInSync = previewHomeTitle !== null && productionHomeTitle !== null && previewHomeTitle === productionHomeTitle;
  const issues = [];
  if (apiResolved.status === "missing_project") {
    issues.push("Set SANITY_API_PROJECT_ID or VITE_SANITY_PROJECT_ID on this deployment.");
  }
  if (apiResolved.status === "dataset_not_allowed") {
    issues.push(
      `Dataset "${apiResolved.attemptedDataset}" is not in SANITY_ALLOWED_DATASETS for this deployment.`
    );
  }
  if (!readTokenConfigured) {
    issues.push("SANITY_API_READ_TOKEN is missing \u2014 /api/sanity/query will fail.");
  }
  if (process.env.VERCEL_ENV === "production" && !publishWebhookSecretConfigured) {
    issues.push(
      "SANITY_PUBLISH_WEBHOOK_SECRET is missing \u2014 Studio publish will not sync preview \u2192 production."
    );
  }
  if (process.env.VERCEL_ENV === "production" && !writeTokenConfigured) {
    issues.push("SANITY_API_WRITE_TOKEN is missing \u2014 publish webhook cannot copy to production.");
  }
  if (expectedDataset && apiResolved.status === "ok" && apiResolved.dataset !== expectedDataset) {
    issues.push(
      `This deployment should read dataset "${expectedDataset}" but is configured for "${apiResolved.dataset}".`
    );
  }
  if (writeTokenConfigured && previewHomeTitle !== null && productionHomeTitle !== null && !datasetsInSync) {
    issues.push(
      "preview and production datasets differ (sample: homePage.pathsTitle). Publish webhook may not have run, or run pnpm sanity:sync-to-production -- --apply."
    );
  }
  if (datasetProbeError) {
    issues.push(datasetProbeError);
  }
  const ok = issues.length === 0;
  res.status(ok ? 200 : 503).json({
    ok,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    cms: {
      projectId: apiResolved.status === "ok" ? apiResolved.projectId : null,
      activeDataset: apiResolved.status === "ok" ? apiResolved.dataset : null,
      expectedDataset,
      clientDataset: process.env.VITE_SANITY_DATASET?.trim() || null,
      enforceVercelDataset: envFlag("SANITY_ENFORCE_VERCEL_DATASET"),
      allowedDatasets: process.env.SANITY_ALLOWED_DATASETS?.split(",").map((s) => s.trim()).filter(Boolean) ?? []
    },
    tokens: {
      readTokenConfigured,
      writeTokenConfigured,
      publishWebhookSecretConfigured,
      publishWebhookReady
    },
    sync: {
      previewHomePathsTitle: previewHomeTitle,
      productionHomePathsTitle: productionHomeTitle,
      datasetsInSync
    },
    issues,
    hints: {
      publishWebhookUrl: "POST https://www.relliahealth.com/api/webhooks/sanity-publish?secret=<SANITY_PUBLISH_WEBHOOK_SECRET>",
      publishWebhookNote: "Replace <SANITY_PUBLISH_WEBHOOK_SECRET> with the real value from Vercel Production env \u2014 not the literal text YOUR_SECRET.",
      manualSync: "pnpm sanity:sync-to-production -- --apply"
    }
  });
};

// server/airtableDirectoryQueue.ts
import { createClient as createClient3 } from "@sanity/client";

// shared/admin/airtableDirectoryMeta.ts
var AIRTABLE_BASE_ID = "appH95p8u6zW5L0RJ";
var AIRTABLE_TABLE_IDS = {
  founders: "tblDEwv5xP22nRXRo",
  advisors: "tblzFdeh8HsvIgqsr",
  networkMembers: "tblmnSpZ9b4z1BnSl"
};
var WEBSITE_STATUS_FIELD = "Website status";
var AIRTABLE_FOUNDER_FIELD_REGISTRY = [
  { airtableField: "Company Name", airtableType: "singleLineText", sanityTarget: "alumniCompany.name", syncStatus: "mapped" },
  { airtableField: "Company 1-Liner", airtableType: "singleLineText", sanityTarget: "alumniCompany.tagline + shortDescription", syncStatus: "mapped" },
  { airtableField: "Company Bio", airtableType: "multilineText", sanityTarget: "alumniCompany.profileBody (block)", syncStatus: "mapped" },
  { airtableField: "CTA", airtableType: "singleLineText", sanityTarget: "profileBody.bodyCtaBox.title", syncStatus: "mapped" },
  { airtableField: "CTA Link", airtableType: "url", sanityTarget: "profileBody.bodyCtaBox.buttonHref", syncStatus: "mapped" },
  { airtableField: "Website", airtableType: "url", sanityTarget: "socialLinks (website)", syncStatus: "mapped" },
  { airtableField: "Company LinkedIn", airtableType: "url", sanityTarget: "socialLinks (linkedin)", syncStatus: "mapped" },
  { airtableField: "Company Email", airtableType: "email", sanityTarget: "alumniCompany.email", syncStatus: "mapped" },
  { airtableField: "Company Logo", airtableType: "multipleAttachments", sanityTarget: "alumniCompany.logo", syncStatus: "mapped" },
  { airtableField: "Founder(s)", airtableType: "singleLineText", sanityTarget: "founders[].name", syncStatus: "mapped" },
  { airtableField: "Job Title", airtableType: "singleLineText", sanityTarget: "founders[].role", syncStatus: "mapped" },
  { airtableField: "Founder Headshots", airtableType: "multipleAttachments", sanityTarget: "founders[].image", syncStatus: "mapped" },
  { airtableField: "Founder description", airtableType: "multilineText", sanityTarget: "founders[].bio", syncStatus: "mapped", notes: "Leave blank on site when empty." },
  { airtableField: "Expertise", airtableType: "multilineText", sanityTarget: "directoryFilters (expertise) \u2014 tag parse only", syncStatus: "mapped", notes: "Comma-separated topics; not used as founder bio." },
  { airtableField: "Business Model", airtableType: "multipleSelects", sanityTarget: "directoryFilters (business-model) + card tags", syncStatus: "mapped" },
  { airtableField: "Clinical Specialty", airtableType: "multipleSelects", sanityTarget: "directoryFilters (specialty) + primary card tag", syncStatus: "mapped" },
  { airtableField: "Tech Category", airtableType: "multipleSelects", syncStatus: "unmapped", notes: "No Sanity filter group yet \u2014 pending client decision (card tag vs new filter group)." },
  { airtableField: "Country", airtableType: "multipleSelects", sanityTarget: "directoryFilters (country)", syncStatus: "mapped" },
  { airtableField: "City", airtableType: "singleLineText", sanityTarget: "\u2014", syncStatus: "unmapped", notes: "Optional sidebar metadata later." },
  { airtableField: "Date Joined", airtableType: "date", sanityTarget: "alumniCompany.yearJoined", syncStatus: "mapped" },
  {
    airtableField: WEBSITE_STATUS_FIELD,
    airtableType: "singleSelect",
    sanityTarget: "sync gate (draft only)",
    syncStatus: "mapped",
    notes: "Not requested \u2192 Ready for review \u2192 Published on site."
  },
  {
    airtableField: "Sanity document ID",
    airtableType: "singleLineText",
    sanityTarget: "stable link back to CMS",
    syncStatus: "mapped",
    notes: "Written by sync worker after first import."
  }
];
var AIRTABLE_ADVISOR_FIELD_REGISTRY = [
  { airtableField: "Name", airtableType: "singleLineText", sanityTarget: "advisor.name + slug", syncStatus: "mapped" },
  { airtableField: "Job Title", airtableType: "singleLineText", sanityTarget: "advisor.role", syncStatus: "mapped" },
  { airtableField: "Company", airtableType: "singleLineText", sanityTarget: "advisor.organization", syncStatus: "mapped" },
  { airtableField: "Short Bio", airtableType: "multilineText", sanityTarget: "advisor.snapshot", syncStatus: "mapped" },
  { airtableField: "Long Bio", airtableType: "multilineText", sanityTarget: "advisor.bio (portable text)", syncStatus: "mapped" },
  { airtableField: "Headshot", airtableType: "multipleAttachments", sanityTarget: "advisor.photo", syncStatus: "mapped" },
  { airtableField: "Industry Tags", airtableType: "multipleSelects", sanityTarget: "advisor.industries + secondary card tags", syncStatus: "mapped" },
  { airtableField: "Expertise Tags", airtableType: "multipleSelects", sanityTarget: "directoryFilters (expertise) + primary card tag", syncStatus: "mapped" },
  { airtableField: "Country", airtableType: "multipleSelects", sanityTarget: "directoryFilters (country)", syncStatus: "mapped" },
  { airtableField: "City", airtableType: "singleLineText", sanityTarget: "\u2014", syncStatus: "unmapped" },
  { airtableField: "Email", airtableType: "singleLineText", sanityTarget: "advisor.email + socialLinks", syncStatus: "mapped" },
  { airtableField: "LinkedIn", airtableType: "url", sanityTarget: "socialLinks (linkedin)", syncStatus: "mapped" },
  { airtableField: "Company URL", airtableType: "url", sanityTarget: "socialLinks (website)", syncStatus: "mapped" },
  { airtableField: "Calendly Link", airtableType: "url", sanityTarget: "socialLinks (custom)", syncStatus: "mapped" },
  {
    airtableField: WEBSITE_STATUS_FIELD,
    airtableType: "singleSelect",
    sanityTarget: "sync gate (draft only)",
    syncStatus: "mapped",
    notes: "Same workflow as founders table."
  },
  {
    airtableField: "Sanity document ID",
    airtableType: "singleLineText",
    sanityTarget: "stable CMS link",
    syncStatus: "mapped"
  }
];
var slugifyDirectoryName = (input) => input.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) || "profile";

// shared/admin/airtableConfig.ts
var resolveAirtableBaseId = () => (typeof process !== "undefined" ? process.env.AIRTABLE_BASE_ID?.trim() : "") || AIRTABLE_BASE_ID;
var resolveAirtableTableId = (kind) => {
  if (kind === "founders") {
    return (typeof process !== "undefined" ? process.env.AIRTABLE_FOUNDERS_TABLE_ID?.trim() : "") || AIRTABLE_TABLE_IDS.founders;
  }
  return (typeof process !== "undefined" ? process.env.AIRTABLE_ADVISORS_TABLE_ID?.trim() : "") || AIRTABLE_TABLE_IDS.advisors;
};
var airtableRecordUrl = (recordId, kind, baseId = resolveAirtableBaseId()) => {
  const tableId = resolveAirtableTableId(kind);
  return `https://airtable.com/${baseId}/${tableId}/${recordId}`;
};
var publicAlumniProfilePath = (slug) => `/founders/alumni/${slug}`;
var publicAdvisorProfilePath = (slug) => `/advisors/directory/${slug}`;
var WEBSITE_STATUS_VALUES = {
  notRequested: "Not requested",
  readyForReview: "Ready for review",
  publishedOnSite: "Published on site",
  needsUpdate: "Needs update"
};

// server/airtableDirectoryQueue.ts
var COUNTRY_ALIASES = {
  usa: "US",
  "united states": "US",
  uk: "United Kingdom",
  ca: "Canada"
};
var normalizeCountry = (value) => {
  const trimmed = value.trim();
  const key = trimmed.toLowerCase();
  return COUNTRY_ALIASES[key] ?? trimmed;
};
var isFilled = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return Boolean(value.trim());
  if (Array.isArray(value)) return value.length > 0;
  return true;
};
var firstAttachmentUrl = (value) => {
  if (!Array.isArray(value) || value.length === 0) return null;
  const first = value[0];
  return typeof first?.url === "string" && first.url.trim() ? first.url.trim() : null;
};
var fetchAirtableTable = async (tableId, apiKey) => {
  const baseId = resolveAirtableBaseId();
  const records = [];
  let offset;
  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Airtable fetch failed (${response.status}): ${body.slice(0, 200)}`);
    }
    const data = await response.json();
    records.push(...data.records ?? []);
    offset = data.offset;
  } while (offset);
  return records;
};
var buildFieldCoverage = (registry, fields, siteStatus) => registry.map((def) => {
  const filled = def.syncStatus === "pending_field" ? false : isFilled(fields[def.airtableField]);
  const liveOnSite = siteStatus === "published" && def.syncStatus === "mapped" && filled && def.airtableField !== "Website status" && def.airtableField !== "Sanity document ID";
  return {
    airtableField: def.airtableField,
    filled: def.syncStatus === "pending_field" ? false : filled,
    mappedToSanity: def.sanityTarget,
    syncStatus: def.syncStatus,
    liveOnSite
  };
});
var missingForPublish = (coverage, kind) => {
  const required = kind === "founder" ? ["Company Name", "Company 1-Liner", "Company Bio", "Founder(s)", "Company Logo"] : ["Name", "Short Bio", "Headshot", "Expertise Tags", "Country"];
  return required.filter((field) => {
    const row = coverage.find((c) => c.airtableField === field);
    return !row?.filled;
  });
};
var resolveSiteStatus = (slug, index) => {
  const hit = index.bySlug.get(slug);
  if (!hit) return { status: "not_on_site" };
  return {
    status: hit.status === "published" ? "published" : "draft",
    sanityDocumentId: hit.id
  };
};
var buildSanityProfileIndex = async (options) => {
  const client = createClient3({
    projectId: options.projectId,
    dataset: options.dataset,
    token: options.token,
    apiVersion: "2024-01-01",
    useCdn: false
  });
  const rows = await client.fetch(`{
    "alumni": *[_type == "alumniCompany"]{ _id, "slug": slug.current, airtableRecordId },
    "advisors": *[_type == "advisor"]{ _id, "slug": slug.current, airtableRecordId }
  }`);
  const bySlug = /* @__PURE__ */ new Map();
  const byAirtableId = /* @__PURE__ */ new Map();
  const ingest = (doc) => {
    const status = doc._id.startsWith("drafts.") ? "draft" : "published";
    const publishedId = doc._id.replace(/^drafts\./, "");
    const entry = { id: doc._id, status };
    if (doc.slug) bySlug.set(doc.slug, entry);
    if (status === "draft" && doc.slug) {
      bySlug.set(doc.slug, entry);
    }
    if (doc.airtableRecordId) byAirtableId.set(doc.airtableRecordId, entry);
    if (status === "published" && doc.slug) {
      bySlug.set(doc.slug, { id: publishedId, status: "published" });
    }
  };
  for (const doc of [...rows.alumni ?? [], ...rows.advisors ?? []]) {
    ingest(doc);
  }
  return { bySlug, byAirtableId };
};
var fetchAirtableDirectoryQueue = async (options) => {
  const [founderRecords, advisorRecords, sanityIndex] = await Promise.all([
    fetchAirtableTable(resolveAirtableTableId("founders"), options.airtableApiKey),
    fetchAirtableTable(resolveAirtableTableId("advisors"), options.airtableApiKey),
    buildSanityProfileIndex({
      projectId: options.sanityProjectId,
      dataset: options.sanityDataset,
      token: options.sanityReadToken
    })
  ]);
  const studioOrigin = (options.studioBaseUrl ?? "https://rellia.sanity.studio").replace(/\/$/, "");
  const siteOrigin = (options.publicSiteOrigin ?? "https://www.relliahealth.com").replace(/\/$/, "");
  const mapFounder = (record) => {
    const fields = record.fields;
    const companyName = String(fields["Company Name"] ?? "").trim() || "Untitled company";
    const slug = slugifyDirectoryName(companyName);
    const { status, sanityDocumentId } = resolveSiteStatus(slug, sanityIndex);
    const coverage = buildFieldCoverage(AIRTABLE_FOUNDER_FIELD_REGISTRY, fields, status);
    const tableKind = "founders";
    return {
      airtableRecordId: record.id,
      kind: "founder",
      displayName: companyName,
      organization: companyName,
      slugCandidate: slug,
      imageUrl: firstAttachmentUrl(fields["Company Logo"]) ?? firstAttachmentUrl(fields["Founder Headshots"]) ?? null,
      siteStatus: status,
      sanityDocumentId,
      sanityStudioUrl: sanityDocumentId ? `${studioOrigin}/structure/alumniCompany;${encodeURIComponent(sanityDocumentId.startsWith("drafts.") ? sanityDocumentId : `drafts.${sanityDocumentId}`)}` : void 0,
      publicUrl: status === "published" ? `${siteOrigin}${publicAlumniProfilePath(slug)}` : void 0,
      airtableRecordUrl: airtableRecordUrl(record.id, tableKind),
      fieldCoverage: coverage,
      missingForPublish: missingForPublish(coverage, "founder"),
      updatedAt: record.createdTime
    };
  };
  const mapAdvisor = (record) => {
    const fields = record.fields;
    const name = String(fields.Name ?? "").trim() || "Untitled advisor";
    const slug = slugifyDirectoryName(name);
    const { status, sanityDocumentId } = resolveSiteStatus(slug, sanityIndex);
    const coverage = buildFieldCoverage(AIRTABLE_ADVISOR_FIELD_REGISTRY, fields, status);
    const tableKind = "advisors";
    return {
      airtableRecordId: record.id,
      kind: "advisor",
      displayName: name,
      organization: typeof fields.Company === "string" ? fields.Company : void 0,
      slugCandidate: slug,
      imageUrl: firstAttachmentUrl(fields.Headshot),
      siteStatus: status,
      sanityDocumentId,
      sanityStudioUrl: sanityDocumentId ? `${studioOrigin}/structure/advisor;${encodeURIComponent(sanityDocumentId.startsWith("drafts.") ? sanityDocumentId : `drafts.${sanityDocumentId}`)}` : void 0,
      publicUrl: status === "published" ? `${siteOrigin}${publicAdvisorProfilePath(slug)}` : void 0,
      airtableRecordUrl: airtableRecordUrl(record.id, tableKind),
      fieldCoverage: coverage,
      missingForPublish: missingForPublish(coverage, "advisor"),
      updatedAt: record.createdTime
    };
  };
  return {
    founders: founderRecords.map(mapFounder).sort((a, b) => a.displayName.localeCompare(b.displayName)),
    advisors: advisorRecords.map(mapAdvisor).sort((a, b) => a.displayName.localeCompare(b.displayName)),
    fieldRegistries: {
      founders: AIRTABLE_FOUNDER_FIELD_REGISTRY,
      advisors: AIRTABLE_ADVISOR_FIELD_REGISTRY
    }
  };
};
var stringField = (fields, key) => {
  const value = fields[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
};
var stringListField = (fields, key) => {
  const value = fields[key];
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && Boolean(item.trim()));
};
var buildFounderPreviewSections = (fields) => {
  const logo = firstAttachmentUrl(fields["Company Logo"]);
  const headshot = firstAttachmentUrl(fields["Founder Headshots"]);
  const tagline = stringField(fields, "Company 1-Liner");
  const bio = stringField(fields, "Company Bio");
  const founderName = stringField(fields, "Founder(s)");
  const founderBio = stringField(fields, "Founder description");
  const cta = stringField(fields, "CTA");
  return [
    {
      id: "logo",
      title: "Company logo",
      complete: Boolean(logo),
      message: logo ? "Logo available in Airtable" : "No company logo uploaded yet",
      previewImageUrl: logo ?? void 0
    },
    {
      id: "tagline",
      title: "Tagline",
      complete: Boolean(tagline),
      message: tagline ? "Card and sidebar tagline" : "Missing company one-liner",
      previewText: tagline ?? void 0
    },
    {
      id: "bio",
      title: "Company overview",
      complete: Boolean(bio),
      message: bio ? "About section body copy" : "Missing company bio",
      previewText: bio ?? void 0
    },
    {
      id: "founder",
      title: "Founder",
      complete: Boolean(founderName),
      message: founderName ? "Founder name and role" : "Missing founder name",
      previewText: [founderName, stringField(fields, "Job Title")].filter(Boolean).join(" \xB7 ") || void 0,
      previewImageUrl: headshot ?? void 0
    },
    {
      id: "founder-description",
      title: "Founder description",
      complete: Boolean(founderBio),
      message: founderBio ? "Optional founder bio paragraph" : "No founder description (hidden on site)",
      previewText: founderBio ?? void 0
    },
    {
      id: "cta",
      title: "Website CTA",
      complete: Boolean(cta && stringField(fields, "CTA Link")),
      message: cta ? "Call-to-action panel on profile" : "Missing CTA copy or link",
      previewText: cta ?? void 0
    },
    {
      id: "tags",
      title: "Directory tags",
      complete: stringListField(fields, "Clinical Specialty").length > 0 || stringListField(fields, "Business Model").length > 0 || stringListField(fields, "Country").length > 0,
      message: "Specialty, business model, and country filters",
      tags: [
        ...stringListField(fields, "Clinical Specialty"),
        ...stringListField(fields, "Business Model"),
        ...stringListField(fields, "Country")
      ]
    }
  ];
};
var buildAdvisorPreviewSections = (fields) => {
  const headshot = firstAttachmentUrl(fields.Headshot);
  const snapshot = stringField(fields, "Short Bio");
  const longBio = stringField(fields, "Long Bio");
  return [
    {
      id: "headshot",
      title: "Headshot",
      complete: Boolean(headshot),
      message: headshot ? "Profile photo available" : "Missing headshot",
      previewImageUrl: headshot ?? void 0
    },
    {
      id: "identity",
      title: "Name & role",
      complete: Boolean(stringField(fields, "Name")),
      message: "Advisor identity block",
      previewText: [stringField(fields, "Name"), stringField(fields, "Job Title"), stringField(fields, "Company")].filter(Boolean).join(" \xB7 ") || void 0
    },
    {
      id: "snapshot",
      title: "Snapshot",
      complete: Boolean(snapshot),
      message: snapshot ? "Directory card summary" : "Missing short bio",
      previewText: snapshot ?? void 0
    },
    {
      id: "bio",
      title: "About the advisor",
      complete: Boolean(longBio),
      message: longBio ? "Full profile bio" : "Missing long bio",
      previewText: longBio ?? void 0
    },
    {
      id: "tags",
      title: "Tags & filters",
      complete: stringListField(fields, "Expertise Tags").length > 0 || stringListField(fields, "Industry Tags").length > 0 || stringListField(fields, "Country").length > 0,
      message: "Expertise, industry, and country",
      tags: [
        ...stringListField(fields, "Expertise Tags"),
        ...stringListField(fields, "Industry Tags"),
        ...stringListField(fields, "Country")
      ]
    }
  ];
};
var fetchAirtableDirectoryDetail = async (options) => {
  const tableId = resolveAirtableTableId(options.kind === "founder" ? "founders" : "advisors");
  const baseId = resolveAirtableBaseId();
  const url = `https://api.airtable.com/v0/${baseId}/${tableId}/${options.recordId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${options.airtableApiKey}` }
  });
  if (!response.ok) return null;
  const record = await response.json();
  const queue = await fetchAirtableDirectoryQueue({
    airtableApiKey: options.airtableApiKey,
    sanityProjectId: options.sanityProjectId,
    sanityDataset: options.sanityDataset,
    sanityReadToken: options.sanityReadToken,
    studioBaseUrl: options.studioBaseUrl,
    publicSiteOrigin: options.publicSiteOrigin
  });
  const row = options.kind === "founder" ? queue.founders.find((item) => item.airtableRecordId === options.recordId) : queue.advisors.find((item) => item.airtableRecordId === options.recordId);
  if (!row) return null;
  const fields = record.fields;
  const websiteStatusRaw = fields[WEBSITE_STATUS_FIELD];
  const websiteStatus = typeof websiteStatusRaw === "string" ? websiteStatusRaw : null;
  return {
    ...row,
    websiteStatus,
    previewSections: options.kind === "founder" ? buildFounderPreviewSections(fields) : buildAdvisorPreviewSections(fields)
  };
};

// server/airtableProfileSync.ts
import { createClient as createClient4 } from "@sanity/client";

// shared/cms/airtableFilterOptions.ts
var AIRTABLE_ADVISOR_EXPERTISE_OPTIONS = [
  "Regulatory & Quality",
  "Marketing",
  "Healthcare Systems"
];

// server/airtableProfileSync.ts
var FILTER_GROUP_COUNTRY = "directoryFilterGroup-country";
var FILTER_GROUP_EXPERTISE = "directoryFilterGroup-expertise";
var FILTER_GROUP_SPECIALTY = "directoryFilterGroup-specialty";
var FILTER_GROUP_BUSINESS_MODEL = "directoryFilterGroup-business-model";
var ptBlock = (key, text) => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }]
});
var normalizeUrl = (raw) => {
  if (!raw?.trim()) return void 0;
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/\//, "")}`;
};
var stringField2 = (fields, key) => {
  const value = fields[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
};
var stringListField2 = (fields, key) => {
  const value = fields[key];
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && Boolean(item.trim()));
};
var mapCountries = (fields) => stringListField2(fields, "Country").map(normalizeCountry).filter(Boolean);
var mapExpertise = (fields) => {
  const tags = stringListField2(fields, "Expertise Tags");
  if (tags.length > 0) {
    return tags.filter(
      (tag) => AIRTABLE_ADVISOR_EXPERTISE_OPTIONS.includes(tag)
    );
  }
  return ["Healthcare Systems"];
};
var fetchAirtableRecord = async (apiKey, kind, recordId) => {
  const tableId = resolveAirtableTableId(kind === "founder" ? "founders" : "advisors");
  const baseId = resolveAirtableBaseId();
  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}/${recordId}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Airtable record fetch failed (${response.status}): ${body.slice(0, 200)}`);
  }
  return await response.json();
};
var patchAirtableRecord = async (options) => {
  if (process.env.AIRTABLE_ALLOW_WRITES?.trim() !== "true") return;
  const tableId = resolveAirtableTableId(options.kind === "founder" ? "founders" : "advisors");
  const baseId = resolveAirtableBaseId();
  await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}/${options.recordId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields: options.fields })
  });
};
var buildAdvisorDoc = (recordId, fields) => {
  const name = stringField2(fields, "Name") ?? "Untitled advisor";
  const slug = slugifyDirectoryName(name);
  const snapshot = stringField2(fields, "Short Bio") || stringField2(fields, "Long Bio")?.slice(0, 200) || `${name} advises health tech founders through Rellia.`;
  const longBio = stringField2(fields, "Long Bio") || snapshot;
  const countries = mapCountries(fields);
  const expertise = mapExpertise(fields);
  const industries = stringListField2(fields, "Industry Tags");
  const socialLinks = [];
  const linkedin = stringField2(fields, "LinkedIn");
  const website = stringField2(fields, "Company URL");
  const calendly = stringField2(fields, "Calendly Link");
  if (linkedin) socialLinks.push({ platform: "linkedin", label: "LinkedIn", url: linkedin });
  if (website) socialLinks.push({ platform: "website", label: "Website", url: website });
  if (calendly) socialLinks.push({ platform: "website", label: "Calendly", url: calendly });
  return {
    _id: `drafts.advisor-${slug}`,
    _type: "advisor",
    name,
    slug: { _type: "slug", current: slug },
    organization: stringField2(fields, "Company") ?? void 0,
    role: stringField2(fields, "Job Title") ?? void 0,
    snapshot,
    yearJoined: (/* @__PURE__ */ new Date()).getFullYear().toString(),
    industries,
    photoSrc: "/images/nopicture-male.jpg",
    email: stringField2(fields, "Email") ?? void 0,
    socialLinks,
    directoryFilters: [
      ...countries.length ? [
        {
          _type: "directoryFilterAssignment",
          group: { _type: "reference", _ref: FILTER_GROUP_COUNTRY },
          values: countries
        }
      ] : [],
      {
        _type: "directoryFilterAssignment",
        group: { _type: "reference", _ref: FILTER_GROUP_EXPERTISE },
        values: expertise
      }
    ],
    bio: [ptBlock(`bio-${slug}`, longBio)],
    airtableRecordId: recordId
  };
};
var buildFounderDoc = (recordId, fields) => {
  const companyName = stringField2(fields, "Company Name") ?? "Untitled company";
  const slug = slugifyDirectoryName(companyName);
  const tagline = stringField2(fields, "Company 1-Liner");
  const bio = stringField2(fields, "Company Bio");
  const founderName = stringField2(fields, "Founder(s)");
  const founderBio = stringField2(fields, "Founder description");
  const ctaTitle = stringField2(fields, "CTA");
  const ctaHref = normalizeUrl(stringField2(fields, "CTA Link") ?? stringField2(fields, "Website"));
  const profileBody = [];
  if (bio) profileBody.push(ptBlock(`bio-${slug}`, bio));
  if (ctaTitle && ctaHref) {
    profileBody.push({
      _type: "bodyCtaBox",
      _key: `cta-${slug}`,
      title: ctaTitle,
      buttonLabel: "Visit website",
      buttonHref: ctaHref,
      iconKey: "Globe"
    });
  }
  const socialLinks = [];
  const linkedin = stringField2(fields, "Company LinkedIn");
  const website = normalizeUrl(stringField2(fields, "Website"));
  if (linkedin) socialLinks.push({ platform: "linkedin", label: "LinkedIn", url: linkedin });
  if (website) socialLinks.push({ platform: "website", label: "Website", url: website });
  const countries = mapCountries(fields);
  const specialties = stringListField2(fields, "Clinical Specialty");
  const businessModels = stringListField2(fields, "Business Model");
  const directoryFilters = [
    ...countries.length ? [{ _type: "directoryFilterAssignment", group: { _type: "reference", _ref: FILTER_GROUP_COUNTRY }, values: countries }] : [],
    ...specialties.length ? [{ _type: "directoryFilterAssignment", group: { _type: "reference", _ref: FILTER_GROUP_SPECIALTY }, values: specialties }] : [],
    ...businessModels.length ? [{ _type: "directoryFilterAssignment", group: { _type: "reference", _ref: FILTER_GROUP_BUSINESS_MODEL }, values: businessModels }] : []
  ];
  const yearJoinedRaw = fields["Date Joined"];
  const yearJoined = typeof yearJoinedRaw === "string" && yearJoinedRaw.length >= 4 ? Number(yearJoinedRaw.slice(0, 4)) : (/* @__PURE__ */ new Date()).getFullYear();
  return {
    _id: `drafts.alumni-${slug}`,
    _type: "alumniCompany",
    name: companyName,
    slug: { _type: "slug", current: slug },
    tagline: tagline ?? void 0,
    shortDescription: tagline ?? void 0,
    yearJoined,
    profileBody: profileBody.length ? profileBody : void 0,
    email: stringField2(fields, "Company Email") ?? void 0,
    socialLinks,
    directoryFilters,
    founders: founderName ? [
      {
        name: founderName,
        role: stringField2(fields, "Job Title") ?? void 0,
        bio: founderBio ?? void 0,
        email: stringField2(fields, "E-mail") ?? void 0
      }
    ] : [],
    airtableRecordId: recordId
  };
};
var syncAirtableProfileToSanityDraft = async (options) => {
  const record = await fetchAirtableRecord(options.airtableApiKey, options.kind, options.recordId);
  const fields = record.fields;
  const client = createClient4({
    projectId: options.sanityProjectId,
    dataset: options.sanityDataset,
    token: options.sanityWriteToken,
    apiVersion: "2024-01-01",
    useCdn: false
  });
  const doc = options.kind === "founder" ? buildFounderDoc(options.recordId, fields) : buildAdvisorDoc(options.recordId, fields);
  await client.createOrReplace(doc);
  await patchAirtableRecord({
    apiKey: options.airtableApiKey,
    kind: options.kind,
    recordId: options.recordId,
    fields: {
      [WEBSITE_STATUS_FIELD]: WEBSITE_STATUS_VALUES.readyForReview,
      "Sanity document ID": doc._id
    }
  });
  const studioType = options.kind === "founder" ? "alumniCompany" : "advisor";
  return {
    documentId: doc._id,
    studioPath: `/structure/${studioType};${encodeURIComponent(doc._id)}`
  };
};

// server/index.ts
var headerOne = (req, name) => {
  const v = req.headers?.[name];
  if (Array.isArray(v)) return v[0];
  return typeof v === "string" ? v : void 0;
};
var getClientIp = (req) => {
  if (process.env.VERCEL) {
    const realIp = headerOne(req, "x-real-ip")?.trim();
    if (realIp) return realIp;
  }
  const forwarded = headerOne(req, "x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  if (typeof req.ip === "string" && req.ip) return req.ip;
  return "unknown";
};
var fixVercelRewrittenApiPath = (req, _res, next) => {
  if (!process.env.VERCEL) {
    next();
    return;
  }
  try {
    const u = new URL(req.url, "http://v.internal");
    const p = u.pathname;
    if (p !== "/api" && p !== "/api/") {
      next();
      return;
    }
    const pathParam = u.searchParams.get("__path")?.trim();
    if (pathParam) {
      const subPath = pathParam.replace(/^\/+/, "");
      req.url = `/api/${subPath}${stripInternalQuery(u.search)}`;
      next();
      return;
    }
    const candidate = headerOne(req, "x-vercel-original-path") || headerOne(req, "x-invoke-path") || headerOne(req, "x-matched-path") || headerOne(req, "x-forwarded-uri");
    if (candidate?.startsWith("/api/")) {
      const pathOnly = candidate.split("?")[0] ?? "";
      if (pathOnly && pathOnly !== "/api" && pathOnly !== "/api/") {
        req.url = pathOnly + (candidate.includes("?") ? candidate.slice(candidate.indexOf("?")) : "");
        next();
        return;
      }
    }
  } catch {
  }
  next();
};
var stripInternalQuery = (search) => {
  if (!search || search === "?") return "";
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.delete("__path");
  const rest = params.toString();
  return rest ? `?${rest}` : "";
};
function createServer() {
  const app2 = express();
  app2.set("trust proxy", 1);
  app2.use(fixVercelRewrittenApiPath);
  const isDev = process.env.NODE_ENV !== "production";
  app2.use((_req, res, next) => {
    res.setHeader("Content-Security-Policy", MARKETING_FRAME_ANCESTORS_CSP);
    next();
  });
  app2.use(
    helmet({
      contentSecurityPolicy: false,
      strictTransportSecurity: isDev ? false : void 0,
      frameguard: false
    })
  );
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);
  const safeOriginFromUrl2 = (input) => {
    const v = (input ?? "").trim();
    if (!v) return null;
    try {
      return new URL(v).origin;
    } catch {
      return null;
    }
  };
  const studioOrigin = safeOriginFromUrl2(process.env.SANITY_STUDIO_URL);
  const siteOrigins = buildSiteOrigins();
  const siteOrigin = process.env.VITE_SITE_URL?.trim() || process.env.SITE_URL?.trim() || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}` : "https://www.relliahealth.com");
  const allowBrowserOrigin = (req, extraAllowedOrigins) => {
    const merged = new Set(siteOrigins);
    if (extraAllowedOrigins) {
      for (const origin of extraAllowedOrigins) merged.add(origin);
    }
    for (const origin of allowedOrigins) {
      if (origin) merged.add(origin);
    }
    return isAllowedBrowserOrigin(req, merged, isDev);
  };
  if (!isDev && allowedOrigins.length === 0) {
    console.warn(
      "ALLOWED_ORIGINS is not set. CORS will allow all browser origins. Set ALLOWED_ORIGINS to restrict cross-origin requests."
    );
  }
  app2.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) {
          cb(null, true);
          return;
        }
        if (isDev) {
          cb(null, true);
          return;
        }
        if (allowedOrigins.length === 0) {
          cb(null, true);
          return;
        }
        cb(null, allowedOrigins.includes(origin));
      }
    })
  );
  app2.use(express.json({ limit: "32kb" }));
  app2.use(express.urlencoded({ extended: true, limit: "32kb" }));
  const RATE_WINDOW_MS = 6e4;
  const RATE_MAP_MAX = 5e3;
  const applyRateLimit = (map, ip, max) => {
    const now = Date.now();
    if (map.size > RATE_MAP_MAX) map.clear();
    const current = map.get(ip);
    if (!current || now - current.windowStartMs > RATE_WINDOW_MS) {
      map.set(ip, { windowStartMs: now, count: 1 });
      return true;
    }
    current.count += 1;
    return current.count <= max;
  };
  const csrfIssueRate = /* @__PURE__ */ new Map();
  const healthRate = /* @__PURE__ */ new Map();
  const studioRedirectRate = /* @__PURE__ */ new Map();
  const draftModeRate = /* @__PURE__ */ new Map();
  const contactRate = /* @__PURE__ */ new Map();
  const stripeCheckoutRate = /* @__PURE__ */ new Map();
  const diagnosticRate = /* @__PURE__ */ new Map();
  const sanityPreviewRate = /* @__PURE__ */ new Map();
  const sanityPublishedRate = /* @__PURE__ */ new Map();
  const HEALTH_MAX_PER_MIN = 240;
  const STUDIO_REDIRECT_MAX_PER_MIN = 60;
  const DRAFT_MODE_MAX_PER_MIN = 30;
  const CONTACT_MAX_PER_MIN = 12;
  const STRIPE_CHECKOUT_MAX_PER_MIN = 20;
  const DIAGNOSTIC_MAX_PER_MIN = 10;
  const SANITY_PREVIEW_MAX_PER_MIN = 120;
  const SANITY_PUBLISHED_MAX_PER_MIN = 180;
  const CSRF_TOKEN_MAX_PER_MIN = 90;
  const requireCsrf = requireApiCsrf(isDev);
  const rateLimitJson = (map, maxPerWindow) => {
    return (req, res, next) => {
      const ip = getClientIp(req);
      if (!applyRateLimit(map, ip, maxPerWindow)) {
        res.status(429).json({ error: "Too many requests. Please try again shortly." });
        return;
      }
      next();
    };
  };
  const rateLimitText = (map, maxPerWindow) => {
    return (req, res, next) => {
      const ip = getClientIp(req);
      if (!applyRateLimit(map, ip, maxPerWindow)) {
        res.status(429).type("text/plain").send("Too many requests. Please try again shortly.");
        return;
      }
      next();
    };
  };
  const healthHandler = (_req, res) => {
    res.status(200).json({ ok: true });
  };
  app2.get("/health", rateLimitJson(healthRate, HEALTH_MAX_PER_MIN), healthHandler);
  app2.get("/api/health", rateLimitJson(healthRate, HEALTH_MAX_PER_MIN), healthHandler);
  app2.get(
    "/api/health/cms",
    rateLimitJson(healthRate, HEALTH_MAX_PER_MIN),
    cmsHealthHandler
  );
  const sanitySlackWebhookRate = /* @__PURE__ */ new Map();
  const SANITY_SLACK_WEBHOOK_MAX_PER_MIN = 60;
  app2.post(
    "/api/webhooks/sanity-slack",
    rateLimitJson(sanitySlackWebhookRate, SANITY_SLACK_WEBHOOK_MAX_PER_MIN),
    async (req, res) => {
      const expectedSecret = process.env.SANITY_SLACK_WEBHOOK_SECRET?.trim();
      if (!expectedSecret) {
        res.status(501).json({ error: "SANITY_SLACK_WEBHOOK_SECRET is not configured" });
        return;
      }
      const providedSecret = (typeof req.query.secret === "string" ? req.query.secret : "") || headerOne(req, "x-webhook-secret")?.trim() || "";
      if (!providedSecret || providedSecret !== expectedSecret) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const drafts = extractSanityDraftDocs(req.body);
      if (drafts.length === 0) {
        res.status(200).json({ ok: true, notified: 0 });
        return;
      }
      let notified = 0;
      for (const doc of drafts) {
        const sent = await notifySanityDraftToSlack(doc);
        if (sent) notified += 1;
      }
      res.status(200).json({ ok: true, notified });
    }
  );
  const sanityPublishWebhookRate = /* @__PURE__ */ new Map();
  const SANITY_PUBLISH_WEBHOOK_MAX_PER_MIN = 120;
  app2.post(
    "/api/webhooks/sanity-publish",
    rateLimitJson(sanityPublishWebhookRate, SANITY_PUBLISH_WEBHOOK_MAX_PER_MIN),
    async (req, res) => {
      const expectedSecret = process.env.SANITY_PUBLISH_WEBHOOK_SECRET?.trim();
      if (!expectedSecret) {
        res.status(501).json({ error: "SANITY_PUBLISH_WEBHOOK_SECRET is not configured" });
        return;
      }
      const providedSecret = (typeof req.query.secret === "string" ? req.query.secret : "") || headerOne(req, "x-webhook-secret")?.trim() || "";
      if (!providedSecret || providedSecret !== expectedSecret) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();
      const projectId = process.env.SANITY_API_PROJECT_ID?.trim() || process.env.VITE_SANITY_PROJECT_ID?.trim() || "ggbt0o98";
      if (!writeToken) {
        res.status(501).json({ error: "Missing SANITY_API_WRITE_TOKEN" });
        return;
      }
      const { upsertIds, deleteIds } = extractPublishedMutationIds(req.body);
      if (upsertIds.length === 0 && deleteIds.length === 0) {
        res.status(200).json({ ok: true, synced: 0, deleted: 0, skipped: 0 });
        return;
      }
      try {
        const result = await syncPublishedDocsToProduction({
          projectId,
          writeToken,
          upsertIds,
          deleteIds
        });
        res.status(200).json({ ok: true, ...result });
      } catch (err) {
        console.error("Sanity publish sync error:", err);
        res.status(500).json({ error: "Could not sync published content to production." });
      }
    }
  );
  app2.get(
    "/api/csrf-token",
    rateLimitJson(csrfIssueRate, CSRF_TOKEN_MAX_PER_MIN),
    (_req, res) => {
      const token = issueCsrfToken();
      res.setHeader("Set-Cookie", buildCsrfSetCookie(token, isDev));
      res.status(200).json({ csrfToken: token });
    }
  );
  app2.get(
    "/api/cms/events",
    rateLimitJson(sanityPublishedRate, SANITY_PUBLISHED_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req, previewAndSiteOrigins)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const apiResolved = resolveSanityApiConfig();
      if (apiResolved.status === "dataset_not_allowed") {
        res.status(503).json({
          error: `Sanity dataset "${apiResolved.attemptedDataset}" is not allowed for this deployment.`
        });
        return;
      }
      if (apiResolved.status === "missing_project") {
        res.status(503).json({ error: "Sanity API is not configured." });
        return;
      }
      const { projectId, dataset } = apiResolved;
      const token = process.env.SANITY_API_READ_TOKEN?.trim();
      const entry = SANITY_QUERY_WHITELIST.events;
      try {
        const useDrafts = isVercelPreviewDeployment();
        if (useDrafts && !token) {
          res.status(501).json({ error: "Missing SANITY_API_READ_TOKEN" });
          return;
        }
        const publicClient = createClient6({
          projectId,
          dataset,
          ...token ? { token } : {},
          useCdn: false,
          apiVersion: "2024-01-01",
          ...useDrafts ? { perspective: "drafts" } : { perspective: "published" }
        });
        const data = await publicClient.fetch(entry.query, {});
        res.setHeader(
          "Cache-Control",
          useDrafts ? "private, no-store" : "public, s-maxage=60, stale-while-revalidate=120"
        );
        res.status(200).json({
          data: stripSanityMetadata(data, "events")
        });
      } catch (err) {
        res.status(502).json({
          error: "Sanity fetch failed",
          message: err instanceof Error ? err.message : String(err)
        });
      }
    }
  );
  app2.get(
    "/api/cms/events/:slug",
    rateLimitJson(sanityPublishedRate, SANITY_PUBLISHED_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req, previewAndSiteOrigins)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const slug = typeof req.params.slug === "string" ? req.params.slug.trim() : "";
      if (!slug || slug.length > 200) {
        res.status(400).json({ error: "Invalid slug" });
        return;
      }
      const apiResolved = resolveSanityApiConfig();
      if (apiResolved.status === "dataset_not_allowed") {
        res.status(503).json({
          error: `Sanity dataset "${apiResolved.attemptedDataset}" is not allowed for this deployment.`
        });
        return;
      }
      if (apiResolved.status === "missing_project") {
        res.status(503).json({ error: "Sanity API is not configured." });
        return;
      }
      const { projectId, dataset } = apiResolved;
      const token = process.env.SANITY_API_READ_TOKEN?.trim();
      const entry = SANITY_QUERY_WHITELIST.eventBySlug;
      try {
        const useDrafts = isVercelPreviewDeployment();
        if (useDrafts && !token) {
          res.status(501).json({ error: "Missing SANITY_API_READ_TOKEN" });
          return;
        }
        const publicClient = createClient6({
          projectId,
          dataset,
          ...token ? { token } : {},
          useCdn: false,
          apiVersion: "2024-01-01",
          ...useDrafts ? { perspective: "drafts" } : { perspective: "published" }
        });
        const data = await publicClient.fetch(entry.query, { slug });
        if (!data) {
          res.status(404).json({ error: "Event not found" });
          return;
        }
        res.setHeader(
          "Cache-Control",
          useDrafts ? "private, no-store" : "public, s-maxage=60, stale-while-revalidate=120"
        );
        res.status(200).json({
          data: stripSanityMetadata(data, "eventBySlug")
        });
      } catch (err) {
        res.status(502).json({
          error: "Sanity fetch failed",
          message: err instanceof Error ? err.message : String(err)
        });
      }
    }
  );
  app2.get(
    "/api/cms/events/:slug/ics",
    rateLimitText(sanityPublishedRate, SANITY_PUBLISHED_MAX_PER_MIN),
    async (req, res) => {
      const slug = typeof req.params.slug === "string" ? req.params.slug.trim() : "";
      if (!slug || slug.length > 200) {
        res.status(400).send("Invalid slug");
        return;
      }
      const apiResolved = resolveSanityApiConfig();
      if (apiResolved.status === "dataset_not_allowed") {
        res.status(503).send("Sanity dataset not allowed");
        return;
      }
      if (apiResolved.status === "missing_project") {
        res.status(503).send("Sanity project config missing");
        return;
      }
      const { projectId, dataset } = apiResolved;
      const token = process.env.SANITY_API_READ_TOKEN?.trim();
      const entry = SANITY_QUERY_WHITELIST.eventBySlug;
      try {
        const publicClient = createClient6({
          projectId,
          dataset,
          ...token ? { token } : {},
          useCdn: false,
          apiVersion: "2024-01-01",
          perspective: "published"
        });
        const event = await publicClient.fetch(entry.query, { slug });
        if (!event) {
          res.status(404).send("Event not found");
          return;
        }
        const startRaw = event.startsAt?.trim();
        const endRaw = event.endsAt?.trim();
        if (!startRaw) {
          res.status(400).send("Event start date is missing");
          return;
        }
        const start = new Date(startRaw);
        const end = endRaw ? new Date(endRaw) : new Date(start.getTime() + 90 * 60 * 1e3);
        const title = event.title?.trim() || "Rellia Health Event";
        const location = event.location?.trim() || "";
        const canonicalUrl = `${siteOrigin}/events/${slug}`;
        const description = `${title}. ${event.dateTime?.trim() ?? event.startsAt ?? ""}`.trim();
        const toIcsUtc = (d) => {
          const iso = d.toISOString();
          const base = iso.includes(".") ? `${iso.slice(0, iso.indexOf("."))}Z` : iso;
          return base.replace(/[-:]/g, "");
        };
        const escapeIcsText = (raw) => raw.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
        const uid = `${slug}-${start.getTime()}@relliahealth.com`;
        const lines = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Rellia Health//EN",
          "CALSCALE:GREGORIAN",
          "METHOD:PUBLISH",
          "BEGIN:VEVENT",
          `UID:${escapeIcsText(uid)}`,
          `DTSTAMP:${toIcsUtc(/* @__PURE__ */ new Date())}`,
          `DTSTART:${toIcsUtc(start)}`,
          `DTEND:${toIcsUtc(end)}`,
          `SUMMARY:${escapeIcsText(title)}`,
          `DESCRIPTION:${escapeIcsText(description)}`,
          `LOCATION:${escapeIcsText(location)}`,
          `URL:${escapeIcsText(canonicalUrl)}`,
          "END:VEVENT",
          "END:VCALENDAR"
        ];
        const icsContent = `${lines.join("\r\n")}\r
`;
        res.setHeader("Content-Type", "text/calendar; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${slug}.ics"`);
        res.status(200).send(icsContent);
      } catch (err) {
        console.error("ICS generation error:", err);
        res.status(500).send("Internal server error generating calendar event");
      }
    }
  );
  app2.get(
    "/api/studio",
    rateLimitText(studioRedirectRate, STUDIO_REDIRECT_MAX_PER_MIN),
    (_req, res) => {
      const studioUrl = process.env.SANITY_STUDIO_URL?.trim();
      if (!studioUrl) {
        res.status(501).send("Missing SANITY_STUDIO_URL");
        return;
      }
      try {
        const parsed = new URL(studioUrl);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
          res.status(400).send("Invalid SANITY_STUDIO_URL protocol");
          return;
        }
        res.redirect(307, parsed.toString());
      } catch {
        res.status(400).send("Invalid SANITY_STUDIO_URL");
      }
    }
  );
  const hasSanityPreviewSecret = (req) => {
    try {
      const host = headerOne(req, "x-forwarded-host")?.trim() || req.get("host") || process.env.VERCEL_URL || "localhost";
      const protocol = headerOne(req, "x-forwarded-proto")?.trim() || req.protocol || "https";
      const origin = `${protocol}://${host.replace(/^https?:\/\//, "")}`;
      const requestUrl = new URL(req.originalUrl || req.url, origin);
      return requestUrl.searchParams.has("sanity-preview-secret") || requestUrl.searchParams.has("sanity-preview-perspective-secret");
    } catch {
      return false;
    }
  };
  app2.get(
    "/api/draft-mode/enable",
    rateLimitText(draftModeRate, DRAFT_MODE_MAX_PER_MIN),
    async (req, res) => {
      const studioOnlyOrigins = new Set([studioOrigin].filter(Boolean));
      const previewSiteOrigins = new Set(siteOrigins);
      if (studioOrigin) previewSiteOrigins.add(studioOrigin);
      if (!allowBrowserOrigin(req, studioOnlyOrigins) && !allowBrowserOrigin(req, previewSiteOrigins) && !hasSanityPreviewSecret(req) && !isSanityStudioReferer(req)) {
        res.status(403).send("Forbidden");
        return;
      }
      const token = process.env.SANITY_API_READ_TOKEN?.trim();
      if (!token) {
        res.status(501).send("Missing SANITY_API_READ_TOKEN");
        return;
      }
      try {
        const forwardedProto = headerOne(req, "x-forwarded-proto")?.trim();
        const forwardedHost = headerOne(req, "x-forwarded-host")?.trim();
        const host = forwardedHost || req.get("host") || process.env.VERCEL_URL || "localhost";
        const protocol = forwardedProto || (typeof req.protocol === "string" ? req.protocol : "");
        const origin = `${protocol || "https"}://${host.replace(/^https?:\/\//, "")}`;
        const requestUrl = new URL(req.originalUrl || req.url, origin).toString();
        const apiResolved = resolveSanityApiConfig();
        if (apiResolved.status === "dataset_not_allowed") {
          res.status(503).send(
            `Sanity dataset "${apiResolved.attemptedDataset}" is not allowed. Check SANITY_ALLOWED_DATASETS and SANITY_ENFORCE_VERCEL_DATASET.`
          );
          return;
        }
        if (apiResolved.status === "missing_project") {
          res.status(503).send("Sanity is not configured (set SANITY_API_PROJECT_ID)");
          return;
        }
        const previewClient = createClient6({
          projectId: apiResolved.projectId,
          dataset: apiResolved.dataset,
          token,
          useCdn: false,
          apiVersion: "2024-01-01"
        });
        const { isValid, redirectTo, studioPreviewPerspective } = await validatePreviewUrl(previewClient, requestUrl);
        if (!isValid) {
          res.status(401).send("Invalid preview secret");
          return;
        }
        const cleanRedirect = (() => {
          if (!redirectTo) return "/";
          const cleaned = withoutSecretSearchParams(new URL(redirectTo, requestUrl));
          return `${cleaned.pathname}${cleaned.search}${cleaned.hash}`;
        })();
        const perspective = studioPreviewPerspective || "drafts";
        const isLocalPreview = host.includes("localhost");
        const cookieFlags = isLocalPreview ? "Path=/; SameSite=Lax; Max-Age=3600" : "Path=/; HttpOnly; Secure; SameSite=None; Max-Age=3600";
        res.setHeader("Set-Cookie", `${perspectiveCookieName2}=${perspective}; ${cookieFlags}`);
        res.redirect(307, cleanRedirect);
      } catch (err) {
        res.status(500).send(err instanceof Error ? err.message : "Unexpected error");
      }
    }
  );
  app2.get("/api/draft-mode/status", (_req, res) => {
    const cookie = _req.headers.cookie || "";
    res.setHeader("content-type", "application/json");
    res.json({ active: hasSanityPreviewPerspectiveCookie(cookie) });
  });
  app2.get(
    "/api/draft-mode/disable",
    rateLimitText(draftModeRate, DRAFT_MODE_MAX_PER_MIN),
    (_req, res) => {
      const reqAny = _req;
      if (!allowBrowserOrigin(reqAny, new Set([studioOrigin].filter(Boolean))) && !isSanityStudioReferer(reqAny)) {
        res.status(403).send("Forbidden");
        return;
      }
      res.setHeader(
        "Set-Cookie",
        `${perspectiveCookieName2}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`
      );
      res.redirect(307, "/");
    }
  );
  const diagnosticReportPayloadSchema = z2.object({
    name: z2.string().trim().min(1).max(200),
    email: z2.string().trim().email(),
    company: z2.string().trim().min(1).max(200),
    stage: z2.string().trim().min(1).max(120),
    desc: z2.string().trim().min(1).max(1200),
    sectionScoresMarkdown: z2.string().trim().min(1).max(8e3),
    rawAnswers: z2.any().optional()
  });
  const diagnosticReportResponseSchema = z2.object({
    summary: z2.string(),
    top3_strengths: z2.array(
      z2.object({
        category: z2.string(),
        score: z2.number(),
        note: z2.string()
      })
    ),
    top3_weaknesses: z2.array(
      z2.object({
        category: z2.string(),
        score: z2.number(),
        note: z2.string(),
        priority: z2.string()
      })
    ),
    recommendations: z2.array(z2.string()),
    mentor_areas_needed: z2.array(z2.string())
  });
  const sanityResolved = resolveSanityApiConfig();
  const sanityApiCfg = sanityResolved.status === "ok" ? sanityResolved : null;
  const previewAndSiteOrigins = new Set(siteOrigins);
  if (studioOrigin) previewAndSiteOrigins.add(studioOrigin);
  const requireCsrfUnlessPresentation = (req, res, next) => {
    const cookie = req.headers.cookie || "";
    if (isPresentationPreviewRequest(
      req,
      cookie,
      allowBrowserOrigin(req, previewAndSiteOrigins)
    )) {
      next();
      return;
    }
    requireCsrf(req, res, next);
  };
  app2.post("/api/sanity/query", requireCsrfUnlessPresentation, async (req, res) => {
    if (!allowBrowserOrigin(req, previewAndSiteOrigins)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const cookie = req.headers.cookie || "";
    const isPreviewSession = isPresentationPreviewRequest(
      req,
      cookie,
      allowBrowserOrigin(req, previewAndSiteOrigins)
    );
    const useDraftsPerspective = shouldUseSanityDraftsPerspective(req, isPreviewSession);
    const token = process.env.SANITY_API_READ_TOKEN?.trim();
    if (!isDev && !isPreviewSession && !isVercelPreviewDeployment()) {
      const hasProvenance = Boolean((req.get("origin") || "").trim()) || Boolean((req.get("referer") || "").trim());
      if (!hasProvenance) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
    }
    const ip = getClientIp(req);
    const rateMap = useDraftsPerspective ? sanityPreviewRate : sanityPublishedRate;
    const rateMax = useDraftsPerspective ? SANITY_PREVIEW_MAX_PER_MIN : SANITY_PUBLISHED_MAX_PER_MIN;
    if (!applyRateLimit(rateMap, ip, rateMax)) {
      res.status(429).json({ error: "Too many requests. Please try again shortly." });
      return;
    }
    const bodySchema = z2.object({
      queryId: z2.string().trim(),
      params: z2.record(z2.unknown()).optional()
    });
    const parsedBody = bodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        error: "Invalid request",
        details: parsedBody.error.flatten()
      });
      return;
    }
    if (!isSanityQueryId(parsedBody.data.queryId)) {
      res.status(400).json({ error: "Unknown queryId" });
      return;
    }
    const entry = SANITY_QUERY_WHITELIST[parsedBody.data.queryId];
    const paramsParsed = entry.params.safeParse(parsedBody.data.params ?? {});
    if (!paramsParsed.success) {
      res.status(400).json({
        error: "Invalid params",
        details: paramsParsed.error.flatten()
      });
      return;
    }
    const apiResolved = resolveSanityApiConfig();
    if (apiResolved.status === "dataset_not_allowed") {
      res.status(503).json({
        error: `Sanity dataset "${apiResolved.attemptedDataset}" is not allowed for this deployment. Set SANITY_ALLOWED_DATASETS or adjust SANITY_API_DATASET / SANITY_ENFORCE_VERCEL_DATASET.`
      });
      return;
    }
    if (apiResolved.status === "missing_project") {
      res.status(503).json({
        error: "Sanity API is not configured. Set SANITY_API_PROJECT_ID (and dataset) in the server environment."
      });
      return;
    }
    const { projectId, dataset } = apiResolved;
    const fetchParams = paramsParsed.data;
    try {
      if (useDraftsPerspective) {
        if (!token) {
          res.status(501).json({ error: "Missing SANITY_API_READ_TOKEN" });
          return;
        }
        const previewClient = createClient6({
          projectId,
          dataset,
          token,
          useCdn: false,
          apiVersion: "2024-01-01",
          perspective: "drafts",
          ...isPreviewSession ? { stega: { enabled: true, studioUrl: resolveSanityStudioUrl() } } : {}
        });
        const data2 = await previewClient.fetch(entry.query, fetchParams);
        res.status(200).json({
          data: stripSanityMetadata(data2, parsedBody.data.queryId)
        });
        return;
      }
      const publicClient = createClient6({
        projectId,
        dataset,
        ...token ? { token } : {},
        useCdn: false,
        apiVersion: "2024-01-01",
        perspective: "published"
      });
      const data = await publicClient.fetch(entry.query, fetchParams);
      res.status(200).json({
        data: stripSanityMetadata(data, parsedBody.data.queryId)
      });
    } catch (err) {
      res.status(502).json({
        error: "Sanity fetch failed",
        message: err instanceof Error ? err.message : String(err)
      });
    }
  });
  const contactPayloadSchema = z2.object({
    firstName: z2.string().trim().min(1).max(120),
    lastName: z2.string().trim().min(1).max(120),
    email: z2.string().trim().email().max(254),
    company: z2.string().trim().max(200).optional(),
    jobTitle: z2.string().trim().max(200).optional(),
    message: z2.string().trim().min(1).max(8e3)
  });
  const modalSubmitSchema = z2.object({
    name: z2.string().trim().min(1).max(200),
    email: z2.string().trim().email().max(254),
    source: z2.string().trim().max(200).optional()
  });
  app2.post(
    "/api/modal-submit",
    rateLimitJson(contactRate, CONTACT_MAX_PER_MIN),
    requireCsrfUnlessPresentation,
    async (req, res) => {
      if (!allowBrowserOrigin(req, previewAndSiteOrigins)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const parsed = modalSubmitSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid request",
          details: parsed.error.flatten()
        });
        return;
      }
      const { name, email, source } = parsed.data;
      const spaceIndex = name.indexOf(" ");
      const firstName = spaceIndex > 0 ? name.slice(0, spaceIndex) : name;
      const lastName = spaceIndex > 0 ? name.slice(spaceIndex + 1).trim() : ".";
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      const supabaseKey = serviceRoleKey || anonKey;
      if (!supabaseUrl || !supabaseKey) {
        res.status(501).json({
          error: "Supabase integration is not configured on the server."
        });
        return;
      }
      const row = {
        first_name: firstName,
        last_name: lastName,
        email,
        company: null,
        job_title: null,
        message: `Priority modal form submission. Source: ${source || "priority modal"}`,
        submission_type: "modal"
      };
      try {
        const insertRes = await fetch(
          `${supabaseUrl}/rest/v1/contact_responses`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=minimal"
            },
            body: JSON.stringify(row)
          }
        );
        if (insertRes.ok) {
          res.status(200).json({ ok: true });
          return;
        }
        const errText = await insertRes.text();
        console.error("Supabase modal insert failed", insertRes.status, errText);
        res.status(502).json({ error: "Could not save your submission." });
      } catch (err) {
        console.error("Modal insert error", err);
        res.status(502).json({ error: "Could not save your submission." });
      }
    }
  );
  app2.post(
    "/api/contact",
    rateLimitJson(contactRate, CONTACT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      if (!isDev) {
        const hasProvenance = Boolean((req.get("origin") || "").trim()) || Boolean((req.get("referer") || "").trim());
        if (!hasProvenance) {
          res.status(403).json({ error: "Forbidden" });
          return;
        }
      }
      const parsed = contactPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid request",
          details: parsed.error.flatten()
        });
        return;
      }
      const { firstName, lastName, email, message } = parsed.data;
      const company = parsed.data.company?.trim() ?? "";
      const jobTitle = parsed.data.jobTitle?.trim() ?? "";
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      const supabaseKey = serviceRoleKey || anonKey;
      if (!supabaseUrl || !supabaseKey) {
        res.status(501).json({
          error: "Contact form is not configured on the server.",
          hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel (server-only). Run scripts/supabase_setup.sql once in Supabase."
        });
        return;
      }
      const row = {
        first_name: firstName,
        last_name: lastName,
        email,
        company: company || null,
        job_title: jobTitle || null,
        message,
        submission_type: "contact"
      };
      try {
        const insertRes = await fetch(
          `${supabaseUrl}/rest/v1/contact_responses`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=minimal"
            },
            body: JSON.stringify(row)
          }
        );
        if (insertRes.ok) {
          res.status(200).json({ ok: true });
          return;
        }
        const errText = await insertRes.text();
        console.error(
          "Supabase contact insert failed",
          insertRes.status,
          errText.slice(0, 800)
        );
        const rateLimited = insertRes.status === 429 || errText.toLowerCase().includes("too many submissions");
        res.status(502).json({
          error: rateLimited ? "Too many messages from this email. Please try again in an hour." : "Could not send your message right now. Please try again or email us directly.",
          ...isDev ? { detail: errText.slice(0, 300), status: insertRes.status } : {}
        });
      } catch (err) {
        console.error("Contact submit error", err);
        res.status(502).json({
          error: "Could not send your message right now. Please try again or email us directly."
        });
      }
    }
  );
  const investorNotifyPayloadSchema = z2.object({
    name: z2.string().trim().min(1).max(160),
    email: z2.string().trim().email().max(254),
    investmentCriteria: z2.string().trim().min(1).max(8e3)
  });
  app2.post(
    "/api/investor-notify",
    rateLimitJson(contactRate, CONTACT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      if (!isDev) {
        const hasProvenance = Boolean((req.get("origin") || "").trim()) || Boolean((req.get("referer") || "").trim());
        if (!hasProvenance) {
          res.status(403).json({ error: "Forbidden" });
          return;
        }
      }
      const parsed = investorNotifyPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid request",
          details: parsed.error.flatten()
        });
        return;
      }
      const trimmedName = parsed.data.name;
      const spaceIndex = trimmedName.indexOf(" ");
      const firstName = spaceIndex > 0 ? trimmedName.slice(0, spaceIndex) : trimmedName;
      const lastName = spaceIndex > 0 ? trimmedName.slice(spaceIndex + 1).trim() : ".";
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      const supabaseKey = serviceRoleKey || anonKey;
      if (!supabaseUrl || !supabaseKey) {
        res.status(501).json({
          error: "Investor form is not configured on the server."
        });
        return;
      }
      const row = {
        first_name: firstName,
        last_name: lastName,
        email: parsed.data.email,
        company: null,
        job_title: null,
        message: parsed.data.investmentCriteria,
        submission_type: "investor"
      };
      try {
        const insertRes = await fetch(
          `${supabaseUrl}/rest/v1/contact_responses`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=minimal"
            },
            body: JSON.stringify(row)
          }
        );
        if (insertRes.ok) {
          res.status(200).json({ ok: true });
          return;
        }
        const errText = await insertRes.text();
        console.error(
          "Supabase investor notify insert failed",
          insertRes.status,
          errText.slice(0, 800)
        );
        const rateLimited = insertRes.status === 429 || errText.toLowerCase().includes("too many submissions");
        res.status(502).json({
          error: rateLimited ? "Too many submissions from this email. Please try again in an hour." : "Could not submit your request right now. Please try again."
        });
      } catch (err) {
        console.error("Investor notify submit error", err);
        res.status(502).json({
          error: "Could not submit your request right now. Please try again."
        });
      }
    }
  );
  const stripeCheckoutPayloadSchema = z2.object({
    plan: z2.enum(["monthly", "annual"])
  });
  app2.post(
    "/api/stripe/checkout-session",
    rateLimitJson(stripeCheckoutRate, STRIPE_CHECKOUT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const parsed = stripeCheckoutPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid request",
          details: parsed.error.flatten()
        });
        return;
      }
      const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
      const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID?.trim();
      const annualPriceId = process.env.STRIPE_ANNUAL_PRICE_ID?.trim();
      const monthlyLink = (process.env.STRIPE_MONTHLY_PLAN_LINK || process.env.VITE_STRIPE_MONTHLY_PLAN_LINK || "").trim();
      const annualLink = (process.env.STRIPE_ANNUAL_PLAN_LINK || process.env.VITE_STRIPE_ANNUAL_PLAN_LINK || "").trim();
      const priceId = parsed.data.plan === "annual" ? annualPriceId : monthlyPriceId;
      const fallbackUrl = parsed.data.plan === "annual" ? annualLink : monthlyLink;
      if (!secretKey || !priceId) {
        res.status(501).json({
          error: "Embedded checkout is not configured.",
          hint: "Set STRIPE_SECRET_KEY, STRIPE_MONTHLY_PRICE_ID, and STRIPE_ANNUAL_PRICE_ID (price_\u2026 from Stripe \u2192 Products). Payment links cannot embed in-page.",
          ...fallbackUrl ? { paymentLinkUrl: fallbackUrl } : {}
        });
        return;
      }
      try {
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(secretKey);
        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${siteOrigin.replace(/\/$/, "")}/membership?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${siteOrigin.replace(/\/$/, "")}/membership?cancel=true`
        });
        if (!session.url) {
          res.status(502).json({ error: "Could not create checkout session." });
          return;
        }
        res.status(200).json({ url: session.url });
      } catch (err) {
        const stripeMessage = err instanceof Error ? err.message : String(err);
        console.error("Stripe checkout session error", err);
        res.status(502).json({
          error: "Could not start checkout.",
          stripeMessage,
          ...fallbackUrl ? { paymentLinkUrl: fallbackUrl } : {}
        });
      }
    }
  );
  app2.post(
    "/api/stripe/create-checkout-session",
    rateLimitJson(stripeCheckoutRate, STRIPE_CHECKOUT_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
      if (!secretKey) {
        res.status(501).json({ error: "Stripe is not configured on the server." });
        return;
      }
      const parsed = z2.object({ priceId: z2.string().min(1) }).safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid request" });
        return;
      }
      try {
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(secretKey);
        const origin = headerOne(req, "origin") ?? siteOrigin;
        const session = await stripe.checkout.sessions.create({
          ui_mode: "embedded",
          mode: "subscription",
          line_items: [{ price: parsed.data.priceId, quantity: 1 }],
          allow_promotion_codes: true,
          billing_address_collection: "auto",
          automatic_tax: { enabled: true },
          return_url: `${origin}/membership?session_id={CHECKOUT_SESSION_ID}`
        });
        if (!session.client_secret) {
          res.status(500).json({ error: "Stripe did not return a client_secret." });
          return;
        }
        res.json({ clientSecret: session.client_secret });
      } catch (err) {
        res.status(500).json({
          error: "Failed to create checkout session",
          message: err instanceof Error ? err.message : String(err)
        });
      }
    }
  );
  app2.post("/api/diagnostic-report", requireCsrf, async (req, res) => {
    if (!allowBrowserOrigin(req)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
    const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "").trim();
    if (!supabaseUrl || !supabaseKey) {
      res.status(501).json({
        error: "Diagnostic survey is not configured on the server.",
        hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run scripts/supabase_diagnostic_setup.sql in Supabase."
      });
      return;
    }
    const ip = getClientIp(req);
    if (!applyRateLimit(diagnosticRate, ip, DIAGNOSTIC_MAX_PER_MIN)) {
      res.status(429).json({ error: "Too many requests. Please try again shortly." });
      return;
    }
    const parsed = diagnosticReportPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }
    const {
      name,
      email,
      company,
      stage,
      desc,
      sectionScoresMarkdown,
      rawAnswers
    } = parsed.data;
    const parseSectionScores = (markdown) => {
      return markdown.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
        const match = line.match(/^(.+?)\s*:\s*(\d{1,3})%?$/);
        if (!match) return null;
        const category = match[1]?.trim() || "";
        const score = Number(match[2]);
        if (!category) return null;
        if (!Number.isFinite(score)) return null;
        return { category, score: Math.max(0, Math.min(100, score)) };
      }).filter((x) => Boolean(x));
    };
    const buildNonAiReport = () => {
      const scores = parseSectionScores(sectionScoresMarkdown);
      const sorted = [...scores].sort((a, b) => b.score - a.score);
      const topStrengths = sorted.slice(0, 3);
      const topWeaknesses = [...scores].sort((a, b) => a.score - b.score).slice(0, 3);
      const toPriority = (score) => {
        if (score < 40) return "Critical";
        if (score < 70) return "High";
        return "Medium";
      };
      return {
        summary: `Thanks \u2014 we\u2019ve saved your diagnostic submission for ${company}. Your next step is to focus on the lowest-scoring domains first, then reinforce what\u2019s already working so you can move faster with less risk.`,
        top3_strengths: topStrengths.map((s) => ({
          category: s.category,
          score: s.score,
          note: "Above-average readiness compared to your other domains."
        })),
        top3_weaknesses: topWeaknesses.map((s) => ({
          category: s.category,
          score: s.score,
          priority: toPriority(s.score),
          note: "This is a likely bottleneck\u2014tighten it before scaling execution or diligence."
        })),
        recommendations: [
          "Pick one domain to fix this week and define a concrete deliverable (document, process, or experiment).",
          "Validate your assumptions with 2\u20133 targeted conversations (users, buyers, clinicians, or operators).",
          "Turn the lowest-scoring domain into a short 30\u201360 day plan with owners and milestones."
        ],
        mentor_areas_needed: topWeaknesses.map((w) => w.category)
      };
    };
    const saveToSupabase = async (report) => {
      try {
        const profileRes = await fetch(
          `${supabaseUrl}/rest/v1/company_profiles`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=representation"
            },
            body: JSON.stringify({
              name,
              work_email: email,
              company_name: company,
              stage: stage || null,
              description: desc || null
            })
          }
        );
        if (!profileRes.ok) {
          const errText = await profileRes.text();
          console.error("Supabase company_profiles insert failed", profileRes.status, errText.slice(0, 800));
          return false;
        }
        const [profileRow] = await profileRes.json();
        const companyProfileId = profileRow?.id;
        if (!companyProfileId) {
          console.error("Supabase company_profiles insert returned no id");
          return false;
        }
        const responseRes = await fetch(
          `${supabaseUrl}/rest/v1/diagnostic_responses`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "content-type": "application/json",
              Prefer: "return=minimal"
            },
            body: JSON.stringify({
              company_profile_id: companyProfileId,
              section_scores: parseSectionScores(sectionScoresMarkdown),
              raw_answers: rawAnswers ?? null,
              summary: report.summary,
              top3_strengths: report.top3_strengths,
              top3_weaknesses: report.top3_weaknesses,
              recommendations: report.recommendations,
              mentor_areas_needed: report.mentor_areas_needed
            })
          }
        );
        if (!responseRes.ok) {
          const errText = await responseRes.text();
          console.error("Supabase diagnostic_responses insert failed", responseRes.status, errText.slice(0, 800));
          return false;
        }
        return true;
      } catch (saveErr) {
        console.error("Failed to save diagnostic to Supabase:", saveErr);
        return false;
      }
    };
    try {
      const report = buildNonAiReport();
      const savedToSupabase = await saveToSupabase(report);
      res.status(200).json({ ...report, savedToSupabase });
    } catch (err) {
      const fallback = buildNonAiReport();
      const savedToSupabase = await saveToSupabase(fallback);
      res.status(200).json({ ...fallback, savedToSupabase });
    }
  });
  const adminSignupStatusRate = /* @__PURE__ */ new Map();
  const ADMIN_SIGNUP_STATUS_MAX_PER_MIN = 30;
  const adminSignupRate = /* @__PURE__ */ new Map();
  const ADMIN_SIGNUP_MAX_PER_MIN = 5;
  app2.get(
    "/api/admin/signup-status",
    rateLimitJson(adminSignupStatusRate, ADMIN_SIGNUP_STATUS_MAX_PER_MIN),
    (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      res.setHeader("content-type", "application/json");
      res.json({ enabled: isAdminSignupEnabled() });
    }
  );
  const adminTeamRate = /* @__PURE__ */ new Map();
  const ADMIN_TEAM_MAX_PER_MIN = 30;
  app2.get(
    "/api/admin/team",
    rateLimitJson(adminTeamRate, ADMIN_TEAM_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      try {
        const { createClient: createClient7 } = await import("@supabase/supabase-js");
        const sessionClient = createClient7(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const adminClient = createClient7(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: listData, error: listError } = await adminClient.auth.admin.listUsers({
          page: 1,
          perPage: 200
        });
        if (listError) {
          console.error("Supabase listUsers error:", listError.message);
          res.status(500).json({ error: "Could not load team members." });
          return;
        }
        const users = (listData.users ?? []).map((u) => {
          const meta = u.user_metadata ?? {};
          const fullNameRaw = typeof meta.full_name === "string" ? meta.full_name : typeof meta.name === "string" ? meta.name : "";
          return {
            id: u.id,
            email: u.email ?? "",
            fullName: fullNameRaw.trim() || null,
            avatarUrl: typeof meta.avatar_url === "string" ? meta.avatar_url.trim() || null : typeof meta.picture === "string" ? meta.picture.trim() || null : null,
            createdAt: u.created_at,
            lastSignInAt: u.last_sign_in_at ?? null,
            confirmedAt: u.email_confirmed_at ?? null
          };
        }).filter((u) => u.email).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const presenceByUserId = /* @__PURE__ */ new Map();
        if (users.length > 0) {
          const { data: presenceRows, error: presenceError } = await adminClient.from("admin_presence").select("user_id, last_active_at").in(
            "user_id",
            users.map((u) => u.id)
          );
          if (presenceError) {
            if (presenceError.code !== "42P01") {
              console.error("Admin presence fetch error:", presenceError.message);
            }
          } else {
            for (const row of presenceRows ?? []) {
              if (row.user_id && row.last_active_at) {
                presenceByUserId.set(row.user_id, row.last_active_at);
              }
            }
          }
        }
        res.setHeader("content-type", "application/json");
        res.json({
          users: users.map((user) => ({
            ...user,
            lastActiveAt: presenceByUserId.get(user.id) ?? null
          }))
        });
      } catch (err) {
        console.error("Admin team error:", err);
        res.status(500).json({ error: "Unexpected server error." });
      }
    }
  );
  const adminPresenceRate = /* @__PURE__ */ new Map();
  const ADMIN_PRESENCE_MAX_PER_MIN = 60;
  app2.post(
    "/api/admin/presence/heartbeat",
    rateLimitJson(adminPresenceRate, ADMIN_PRESENCE_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      try {
        const { createClient: createClient7 } = await import("@supabase/supabase-js");
        const sessionClient = createClient7(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const adminClient = createClient7(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const { error: upsertError } = await adminClient.from("admin_presence").upsert(
          {
            user_id: userData.user.id,
            last_active_at: now,
            updated_at: now
          },
          { onConflict: "user_id" }
        );
        if (upsertError) {
          if (upsertError.code === "42P01") {
            res.status(501).json({
              error: "Admin presence is not configured. Run scripts/supabase_admin_presence.sql in Supabase."
            });
            return;
          }
          console.error("Admin presence heartbeat error:", upsertError.message);
          res.status(500).json({ error: "Could not update presence." });
          return;
        }
        res.setHeader("content-type", "application/json");
        res.json({ ok: true });
      } catch (err) {
        console.error("Admin presence heartbeat error:", err);
        res.status(500).json({ error: "Unexpected server error." });
      }
    }
  );
  const adminTeamNoteRate = /* @__PURE__ */ new Map();
  const ADMIN_TEAM_NOTE_MAX_PER_MIN = 40;
  const adminTeamNoteReactionRate = /* @__PURE__ */ new Map();
  const ADMIN_TEAM_NOTE_REACTION_MAX_PER_MIN = 120;
  const sanitizeTeamNoteBlocks = (raw) => {
    if (!Array.isArray(raw)) return [];
    const blocks = [];
    for (const item of raw.slice(0, 24)) {
      if (!item || typeof item !== "object") continue;
      const row = item;
      if (row.type === "text" && typeof row.text === "string") {
        const text = row.text.trim().slice(0, 600);
        if (text) blocks.push({ type: "text", text });
        continue;
      }
      if (row.type === "sticker" && typeof row.emoji === "string") {
        const emoji = row.emoji.trim().slice(0, 8);
        if (emoji) blocks.push({ type: "sticker", emoji });
        continue;
      }
      if (row.type === "image" && typeof row.url === "string") {
        const url = row.url.trim().slice(0, 500);
        if (url.startsWith("https://") || url.startsWith("/")) {
          blocks.push({
            type: "image",
            url,
            alt: typeof row.alt === "string" ? row.alt.trim().slice(0, 120) : void 0
          });
        }
      }
    }
    return blocks;
  };
  const resolveAdminBearer = (req) => {
    const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
    return authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  };
  app2.get(
    "/api/admin/team-note",
    rateLimitJson(adminTeamNoteRate, ADMIN_TEAM_NOTE_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const token = resolveAdminBearer(req);
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      try {
        const { createClient: createClient7 } = await import("@supabase/supabase-js");
        const sessionClient = createClient7(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const adminClient = createClient7(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: board, error: boardError } = await adminClient.from("admin_team_board").select("blocks, published_by_id, published_by_name, published_at, updated_at").eq("id", "default").maybeSingle();
        if (boardError) {
          if (boardError.code === "42P01") {
            res.setHeader("content-type", "application/json");
            res.json({ note: null, reactions: [], configured: false });
            return;
          }
          console.error("Admin team note fetch error:", boardError.message);
          res.status(500).json({ error: "Could not load team note." });
          return;
        }
        const { data: reactions, error: reactionsError } = await adminClient.from("admin_team_note_reactions").select("emoji, user_id, user_name, created_at").eq("board_id", "default");
        if (reactionsError && reactionsError.code !== "42P01") {
          console.error("Admin team reactions fetch error:", reactionsError.message);
          res.status(500).json({ error: "Could not load team note reactions." });
          return;
        }
        res.setHeader("content-type", "application/json");
        res.json({
          configured: true,
          note: board ? {
            blocks: sanitizeTeamNoteBlocks(board.blocks),
            publishedById: board.published_by_id,
            publishedByName: board.published_by_name,
            publishedAt: board.published_at,
            updatedAt: board.updated_at
          } : null,
          reactions: (reactions ?? []).map((row) => ({
            emoji: row.emoji,
            userId: row.user_id,
            userName: row.user_name,
            createdAt: row.created_at
          }))
        });
      } catch (err) {
        console.error("Admin team note error:", err);
        res.status(500).json({ error: "Unexpected server error." });
      }
    }
  );
  app2.put(
    "/api/admin/team-note",
    rateLimitJson(adminTeamNoteRate, ADMIN_TEAM_NOTE_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const token = resolveAdminBearer(req);
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      const blocks = sanitizeTeamNoteBlocks(req.body?.blocks);
      if (blocks.length === 0) {
        res.status(400).json({ error: "Add at least one sticker, message, or image." });
        return;
      }
      try {
        const { createClient: createClient7 } = await import("@supabase/supabase-js");
        const sessionClient = createClient7(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const meta = userData.user.user_metadata ?? {};
        const fullNameRaw = typeof meta.full_name === "string" ? meta.full_name : typeof meta.name === "string" ? meta.name : "";
        const publisherName = fullNameRaw.trim() || userData.user.email || "Team member";
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const adminClient = createClient7(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: board, error: upsertError } = await adminClient.from("admin_team_board").upsert(
          {
            id: "default",
            blocks,
            published_by_id: userData.user.id,
            published_by_name: publisherName,
            published_at: nowIso,
            updated_at: nowIso
          },
          { onConflict: "id" }
        ).select("blocks, published_by_id, published_by_name, published_at, updated_at").single();
        if (upsertError) {
          console.error("Admin team note publish error:", upsertError.message);
          res.status(500).json({ error: "Could not publish team note." });
          return;
        }
        res.setHeader("content-type", "application/json");
        res.json({
          note: {
            blocks: sanitizeTeamNoteBlocks(board.blocks),
            publishedById: board.published_by_id,
            publishedByName: board.published_by_name,
            publishedAt: board.published_at,
            updatedAt: board.updated_at
          }
        });
      } catch (err) {
        console.error("Admin team note publish error:", err);
        res.status(500).json({ error: "Unexpected server error." });
      }
    }
  );
  app2.delete(
    "/api/admin/team-note",
    rateLimitJson(adminTeamNoteRate, ADMIN_TEAM_NOTE_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const token = resolveAdminBearer(req);
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      try {
        const { createClient: createClient7 } = await import("@supabase/supabase-js");
        const sessionClient = createClient7(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const adminClient = createClient7(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { error: boardError } = await adminClient.from("admin_team_board").upsert(
          {
            id: "default",
            blocks: [],
            published_by_id: null,
            published_by_name: null,
            published_at: null,
            updated_at: nowIso
          },
          { onConflict: "id" }
        );
        if (boardError) {
          console.error("Admin team note remove error:", boardError.message);
          res.status(500).json({ error: "Could not remove team bulletin." });
          return;
        }
        const { error: reactionsError } = await adminClient.from("admin_team_note_reactions").delete().eq("board_id", "default");
        if (reactionsError && reactionsError.code !== "42P01") {
          console.error("Admin team note reactions remove error:", reactionsError.message);
          res.status(500).json({ error: "Could not remove team bulletin reactions." });
          return;
        }
        res.setHeader("content-type", "application/json");
        res.json({ ok: true });
      } catch (err) {
        console.error("Admin team note remove error:", err);
        res.status(500).json({ error: "Unexpected server error." });
      }
    }
  );
  app2.post(
    "/api/admin/team-note/reactions",
    rateLimitJson(adminTeamNoteReactionRate, ADMIN_TEAM_NOTE_REACTION_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const token = resolveAdminBearer(req);
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const emoji = typeof req.body?.emoji === "string" ? req.body.emoji.trim().slice(0, 8) : "";
      if (!emoji) {
        res.status(400).json({ error: "Reaction emoji is required." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      try {
        const { createClient: createClient7 } = await import("@supabase/supabase-js");
        const sessionClient = createClient7(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const meta = userData.user.user_metadata ?? {};
        const fullNameRaw = typeof meta.full_name === "string" ? meta.full_name : typeof meta.name === "string" ? meta.name : "";
        const userName = fullNameRaw.trim() || userData.user.email || "Team member";
        const adminClient = createClient7(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: existing } = await adminClient.from("admin_team_note_reactions").select("id").eq("board_id", "default").eq("user_id", userData.user.id).eq("emoji", emoji).maybeSingle();
        if (existing?.id) {
          const { error: deleteError } = await adminClient.from("admin_team_note_reactions").delete().eq("id", existing.id);
          if (deleteError) {
            res.status(500).json({ error: "Could not update reaction." });
            return;
          }
          res.setHeader("content-type", "application/json");
          res.json({ active: false });
          return;
        }
        const { error: insertError } = await adminClient.from("admin_team_note_reactions").insert({
          board_id: "default",
          user_id: userData.user.id,
          user_name: userName,
          emoji
        });
        if (insertError) {
          console.error("Admin team reaction error:", insertError.message);
          res.status(500).json({ error: "Could not add reaction." });
          return;
        }
        res.setHeader("content-type", "application/json");
        res.json({ active: true });
      } catch (err) {
        console.error("Admin team reaction error:", err);
        res.status(500).json({ error: "Unexpected server error." });
      }
    }
  );
  const adminStripeMetricsRate = /* @__PURE__ */ new Map();
  const ADMIN_STRIPE_METRICS_MAX_PER_MIN = 20;
  app2.get(
    "/api/admin/stripe-metrics",
    rateLimitJson(adminStripeMetricsRate, ADMIN_STRIPE_METRICS_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      try {
        const { createClient: createClient7 } = await import("@supabase/supabase-js");
        const sessionClient = createClient7(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
        if (!secretKey) {
          res.setHeader("content-type", "application/json");
          res.json({ configured: false });
          return;
        }
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(secretKey);
        const now = Math.floor(Date.now() / 1e3);
        const thirtyDays = 30 * 24 * 60 * 60;
        const sumSucceededCharges = async (gte, lt) => {
          let total = 0;
          let startingAfter;
          let hasMore = true;
          while (hasMore) {
            const page = await stripe.charges.list({
              created: lt ? { gte, lt } : { gte },
              limit: 100,
              ...startingAfter ? { starting_after: startingAfter } : {}
            });
            for (const charge of page.data) {
              if (charge.status === "succeeded" && charge.paid) {
                total += charge.amount - (charge.amount_refunded ?? 0);
              }
            }
            hasMore = page.has_more;
            startingAfter = page.data.length > 0 ? page.data[page.data.length - 1]?.id : void 0;
            if (!startingAfter) hasMore = false;
          }
          return total;
        };
        const currentStart = now - thirtyDays;
        const previousStart = now - thirtyDays * 2;
        const sevenDaysStart = now - 7 * 24 * 60 * 60;
        const [revenueLast30Days, revenuePrevious30Days, recentCharges] = await Promise.all([
          sumSucceededCharges(currentStart),
          sumSucceededCharges(previousStart, currentStart),
          (async () => {
            const rows = [];
            let startingAfter;
            let hasMore = true;
            while (hasMore) {
              const page = await stripe.charges.list({
                created: { gte: sevenDaysStart },
                limit: 100,
                ...startingAfter ? { starting_after: startingAfter } : {}
              });
              for (const charge of page.data) {
                if (charge.status === "succeeded" && charge.paid) {
                  rows.push({
                    created: charge.created,
                    amount: charge.amount - (charge.amount_refunded ?? 0)
                  });
                }
              }
              hasMore = page.has_more;
              startingAfter = page.data.length > 0 ? page.data[page.data.length - 1]?.id : void 0;
              if (!startingAfter) hasMore = false;
            }
            return rows;
          })()
        ]);
        const dayMs = 24 * 60 * 60;
        const revenueDaily = [];
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 6; i >= 0; i -= 1) {
          const dayStart = new Date(today.getTime() - i * dayMs * 1e3);
          const dayEnd = dayStart.getTime() + dayMs * 1e3;
          const startSec = Math.floor(dayStart.getTime() / 1e3);
          const endSec = Math.floor(dayEnd / 1e3);
          const amount = recentCharges.filter((row) => row.created >= startSec && row.created < endSec).reduce((sum, row) => sum + row.amount, 0);
          revenueDaily.push({
            label: dayStart.toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
            dateKey: dayStart.toISOString().slice(0, 10),
            amount
          });
        }
        const revenueChangePct = revenuePrevious30Days === 0 ? revenueLast30Days > 0 ? 100 : null : Math.round((revenueLast30Days - revenuePrevious30Days) / revenuePrevious30Days * 100);
        res.setHeader("content-type", "application/json");
        res.json({
          configured: true,
          currency: "cad",
          revenueLast30Days,
          revenuePrevious30Days,
          revenueChangePct,
          revenueDaily
        });
      } catch (err) {
        console.error("Admin stripe metrics error:", err);
        res.status(500).json({ error: "Could not load Stripe metrics." });
      }
    }
  );
  const adminSanityDraftsRate = /* @__PURE__ */ new Map();
  const ADMIN_SANITY_DRAFTS_MAX_PER_MIN = 40;
  app2.get(
    "/api/admin/sanity-drafts",
    rateLimitJson(adminSanityDraftsRate, ADMIN_SANITY_DRAFTS_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const datasetParam = typeof req.query.dataset === "string" ? req.query.dataset : void 0;
      const dataset = resolveAdminSanityDataset(datasetParam);
      if (!dataset) {
        res.status(400).json({ error: "Invalid or disallowed Sanity dataset." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      const apiResolved = resolveSanityApiConfig();
      if (apiResolved.status === "missing_project") {
        res.status(503).json({ error: "Sanity API is not configured on the server." });
        return;
      }
      if (apiResolved.status === "dataset_not_allowed") {
        res.status(503).json({
          error: `Sanity dataset "${apiResolved.attemptedDataset}" is not allowed for this deployment.`
        });
        return;
      }
      const sanityToken = process.env.SANITY_API_READ_TOKEN?.trim() || "";
      const projectId = apiResolved.projectId;
      try {
        const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
        const sessionClient = createSupabaseClient(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const entry = SANITY_QUERY_WHITELIST.sanityDrafts;
        const publicClient = createClient6({
          projectId,
          dataset,
          ...sanityToken ? { token: sanityToken } : {},
          useCdn: false,
          apiVersion: "2024-01-01"
        });
        const data = await publicClient.fetch(entry.query, {});
        res.setHeader("content-type", "application/json");
        res.json({
          dataset,
          drafts: stripSanityMetadata(data, "sanityDrafts")
        });
      } catch (err) {
        console.error("Admin sanity drafts error:", err);
        res.status(502).json({ error: "Could not load content drafts." });
      }
    }
  );
  app2.get(
    "/api/admin/sanity-recent-edits",
    rateLimitJson(adminSanityDraftsRate, ADMIN_SANITY_DRAFTS_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const datasetParam = typeof req.query.dataset === "string" ? req.query.dataset : void 0;
      const dataset = resolveAdminSanityDataset(datasetParam);
      if (!dataset) {
        res.status(400).json({ error: "Invalid or disallowed Sanity dataset." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      const apiResolved = resolveSanityApiConfig();
      if (apiResolved.status === "missing_project") {
        res.status(503).json({ error: "Sanity API is not configured on the server." });
        return;
      }
      if (apiResolved.status === "dataset_not_allowed") {
        res.status(503).json({
          error: `Sanity dataset "${apiResolved.attemptedDataset}" is not allowed for this deployment.`
        });
        return;
      }
      const sanityToken = process.env.SANITY_API_READ_TOKEN?.trim() || "";
      const projectId = apiResolved.projectId;
      try {
        const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
        const sessionClient = createSupabaseClient(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const entry = SANITY_QUERY_WHITELIST.sanityRecentEdits;
        const publicClient = createClient6({
          projectId,
          dataset,
          ...sanityToken ? { token: sanityToken } : {},
          useCdn: false,
          apiVersion: "2024-01-01"
        });
        const data = await publicClient.fetch(entry.query, {});
        res.setHeader("content-type", "application/json");
        res.json({
          dataset,
          recentEdits: stripSanityMetadata(data, "sanityRecentEdits")
        });
      } catch (err) {
        console.error("Admin sanity recent edits error:", err);
        res.status(502).json({ error: "Could not load recent publishes." });
      }
    }
  );
  const adminAirtableQueueRate = /* @__PURE__ */ new Map();
  const ADMIN_AIRTABLE_QUEUE_MAX_PER_MIN = 30;
  app2.get(
    "/api/admin/airtable-directory-queue",
    rateLimitJson(adminAirtableQueueRate, ADMIN_AIRTABLE_QUEUE_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const airtableApiKey = process.env.AIRTABLE_API_KEY?.trim() || "";
      if (!airtableApiKey) {
        res.status(503).json({ error: "AIRTABLE_API_KEY is not configured on the server." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      const apiResolved = resolveSanityApiConfig();
      if (apiResolved.status !== "ok") {
        res.status(503).json({ error: "Sanity API is not configured on the server." });
        return;
      }
      const sanityReadToken = process.env.SANITY_API_READ_TOKEN?.trim() || "";
      try {
        const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
        const sessionClient = createSupabaseClient(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const queue = await fetchAirtableDirectoryQueue({
          airtableApiKey,
          sanityProjectId: apiResolved.projectId,
          sanityDataset: "production",
          sanityReadToken: sanityReadToken || void 0,
          studioBaseUrl: resolveSanityStudioUrl(),
          publicSiteOrigin: buildSiteOrigins()[0]
        });
        res.setHeader("content-type", "application/json");
        res.json(queue);
      } catch (err) {
        console.error("Admin Airtable directory queue error:", err);
        res.status(502).json({ error: "Could not load Airtable directory queue." });
      }
    }
  );
  app2.get(
    "/api/admin/airtable-directory/:kind/:recordId",
    rateLimitJson(adminAirtableQueueRate, ADMIN_AIRTABLE_QUEUE_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const kindParam = typeof req.params.kind === "string" ? req.params.kind : "";
      const recordId = typeof req.params.recordId === "string" ? req.params.recordId.trim() : "";
      const kind = kindParam === "founder" || kindParam === "advisor" ? kindParam : null;
      if (!kind || !recordId) {
        res.status(400).json({ error: "Invalid profile kind or record id." });
        return;
      }
      const airtableApiKey = process.env.AIRTABLE_API_KEY?.trim() || "";
      if (!airtableApiKey) {
        res.status(503).json({ error: "AIRTABLE_API_KEY is not configured on the server." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      const apiResolved = resolveSanityApiConfig();
      if (apiResolved.status !== "ok") {
        res.status(503).json({ error: "Sanity API is not configured on the server." });
        return;
      }
      try {
        const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
        const sessionClient = createSupabaseClient(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const detail = await fetchAirtableDirectoryDetail({
          airtableApiKey,
          kind,
          recordId,
          sanityProjectId: apiResolved.projectId,
          sanityDataset: "production",
          sanityReadToken: process.env.SANITY_API_READ_TOKEN?.trim() || void 0,
          studioBaseUrl: resolveSanityStudioUrl(),
          publicSiteOrigin: buildSiteOrigins()[0]
        });
        if (!detail) {
          res.status(404).json({ error: "Profile not found in Airtable." });
          return;
        }
        res.setHeader("content-type", "application/json");
        res.json(detail);
      } catch (err) {
        console.error("Admin Airtable directory detail error:", err);
        res.status(502).json({ error: "Could not load network profile." });
      }
    }
  );
  app2.post(
    "/api/admin/airtable-sync/:kind/:recordId",
    rateLimitJson(adminAirtableQueueRate, ADMIN_AIRTABLE_QUEUE_MAX_PER_MIN),
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const authHeader = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      if (!token) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      const kindParam = typeof req.params.kind === "string" ? req.params.kind : "";
      const recordId = typeof req.params.recordId === "string" ? req.params.recordId.trim() : "";
      const kind = kindParam === "founder" || kindParam === "advisor" ? kindParam : null;
      if (!kind || !recordId) {
        res.status(400).json({ error: "Invalid profile kind or record id." });
        return;
      }
      const airtableApiKey = process.env.AIRTABLE_API_KEY?.trim() || "";
      const sanityWriteToken = process.env.SANITY_API_WRITE_TOKEN?.trim() || "";
      if (!airtableApiKey) {
        res.status(503).json({ error: "AIRTABLE_API_KEY is not configured on the server." });
        return;
      }
      if (!sanityWriteToken) {
        res.status(503).json({ error: "SANITY_API_WRITE_TOKEN is not configured on the server." });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
      if (!supabaseUrl || !anonKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      const apiResolved = resolveSanityApiConfig();
      if (apiResolved.status !== "ok") {
        res.status(503).json({ error: "Sanity API is not configured on the server." });
        return;
      }
      try {
        const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
        const sessionClient = createSupabaseClient(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const result = await syncAirtableProfileToSanityDraft({
          airtableApiKey,
          sanityProjectId: apiResolved.projectId,
          sanityDataset: "production",
          sanityWriteToken,
          kind,
          recordId
        });
        const studioOrigin2 = resolveSanityStudioUrl().replace(/\/$/, "");
        const studioUrl = `${studioOrigin2}${result.studioPath}`;
        const detail = await fetchAirtableDirectoryDetail({
          airtableApiKey,
          kind,
          recordId,
          sanityProjectId: apiResolved.projectId,
          sanityDataset: "production",
          sanityReadToken: process.env.SANITY_API_READ_TOKEN?.trim() || void 0,
          studioBaseUrl: resolveSanityStudioUrl(),
          publicSiteOrigin: buildSiteOrigins()[0]
        });
        await notifySanityDraftToSlack({
          _id: result.documentId,
          _type: kind === "founder" ? "alumniCompany" : "advisor",
          title: detail?.displayName
        });
        res.setHeader("content-type", "application/json");
        res.json({ ok: true, ...result, studioUrl });
      } catch (err) {
        console.error("Admin Airtable sync error:", err);
        res.status(502).json({ error: "Could not sync profile to Sanity." });
      }
    }
  );
  app2.post(
    "/api/admin/signup",
    rateLimitJson(adminSignupRate, ADMIN_SIGNUP_MAX_PER_MIN),
    requireCsrf,
    async (req, res) => {
      if (!allowBrowserOrigin(req)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      if (!isAdminSignupEnabled()) {
        res.status(403).json({ error: "Signup is currently disabled." });
        return;
      }
      const parsed = z2.object({
        email: z2.string().trim().email().max(254),
        password: z2.string().min(8).max(72),
        fullName: z2.string().trim().min(1).max(120)
      }).safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
        return;
      }
      const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
      const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();
      if (!supabaseUrl || !serviceRoleKey) {
        res.status(501).json({ error: "Supabase admin credentials are not configured on the server." });
        return;
      }
      try {
        const { createClient: createClient7 } = await import("@supabase/supabase-js");
        const adminClient = createClient7(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { error } = await adminClient.auth.admin.createUser({
          email: parsed.data.email,
          password: parsed.data.password,
          email_confirm: true,
          user_metadata: { full_name: parsed.data.fullName }
        });
        if (error) {
          if (error.message.toLowerCase().includes("already")) {
            res.status(409).json({ error: "An account with this email already exists." });
          } else {
            console.error("Supabase admin createUser error:", error.message);
            res.status(500).json({ error: "Failed to create account. Please try again." });
          }
          return;
        }
        res.status(200).json({ ok: true });
      } catch (err) {
        console.error("Admin signup error:", err);
        res.status(500).json({ error: "Unexpected server error." });
      }
    }
  );
  app2.get("/api/social-html", async (req, res) => {
    try {
      const pathParam = (typeof req.query.path === "string" ? req.query.path.trim() : "") || (typeof req.query.pathname === "string" ? req.query.pathname.trim() : "");
      if (!pathParam) {
        res.status(400).json({ error: "Missing path query parameter" });
        return;
      }
      const { renderSocialHtmlForPath: renderSocialHtmlForPath2 } = await Promise.resolve().then(() => (init_socialHtmlHandler(), socialHtmlHandler_exports));
      const rendered = await renderSocialHtmlForPath2(pathParam);
      if (!rendered) {
        res.status(404).json({ error: "No social metadata for this path" });
        return;
      }
      res.setHeader("content-type", "text/html; charset=utf-8");
      res.setHeader("cache-control", "public, s-maxage=300, stale-while-revalidate=600");
      res.status(200).send(rendered.html);
    } catch (err) {
      console.error("social-html error:", err);
      res.status(500).json({ error: "Could not render social HTML" });
    }
  });
  app2.use((err, _req, res, _next) => {
    console.error("Express error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  return app2;
}

// scripts/vercel-api-entry.ts
var app;
var getApp = () => {
  if (!app) app = createServer();
  return app;
};
var handler = (req, res) => {
  try {
    getApp()(req, res);
  } catch (err) {
    console.error("Vercel API handler error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
};
var vercel_api_entry_default = handler;
export {
  vercel_api_entry_default as default
};
