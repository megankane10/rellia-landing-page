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
import { z as z2 } from "zod";
import { createClient as createClient3 } from "@sanity/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { withoutSecretSearchParams } from "@sanity/preview-url-secret/without-secret-search-params";
import { perspectiveCookieName as perspectiveCookieName2 } from "@sanity/preview-url-secret/constants";

// shared/cms/sanityQueryRegistry.ts
import { z } from "zod";

// shared/cms/groqQueries.ts
var seoFragment = `seo{
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
var pageVisibilityFragment = `pageVisibility,
  placeholderTitle,
  placeholderMessage,
  placeholderCtaLabel,
  placeholderCtaHref`;
var logoMarqueeFragment = `logoMarquee[]{
  name,
  "src": logo.asset->url,
  href
}`;
var networkHeroFragment = `heroEyebrow,
  "heroTitlePortable": coalesce(heroTitlePortable, heroHeadlinePortable),
  heroSubtitle,
  "heroImageSrc": coalesce(heroImage.asset->url, heroImageUrl),
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  heroSecondaryCtaLabel,
  heroSecondaryCtaHref`;
var networkEngageFragment = `engageTitle,
  engageSubtitle,
  engageItems[]{ title, body, href, linkLabel, iconKey }`;
var networkWhyFragment = `whyTitle,
  whyDescription,
  whyFeatures[]{ title, body, iconKey, buttonLabel, buttonPath, "imageSrc": coalesce(image.asset->url, imageSrc) }`;
var networkCtaFragment = `ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref`;
var globalSettingsQuery = `*[_id == "globalSettings"][0]{
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
var navigationQuery = `*[_id == "navigation"][0]{
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
}`;
var siteSettingsQuery = `*[_id == "siteSettings"][0]{
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
var featuredStoriesQuery = `*[_type == "story" && featured == true && !(_id in path("drafts.**"))]
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
var storiesQuery = `*[_type == "story" && !(_id in path("drafts.**"))]
| order(publishedAt desc, _updatedAt desc){
  title,
  "slug": slug.current,
  excerpt,
  "coverImageSrc": headerImage.asset->url,
  "coverImageAlt": headerImageAlt,
  "tag": filters[0]->title,
  publishedAt,
  featured
}`;
var storiesPageQuery = `*[_id == "storiesPage"][0]{
  headlinePortable,
  subheadline,
  ${seoFragment}
}`;
var portableRichTextBlocksFragment = `[]{
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
}`;
var portableRichTextBodyFragment = `body${portableRichTextBlocksFragment}`;
var storiesPrerenderSnapshotQuery = `*[_type == "story" && !(_id in path("drafts.**"))]{
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
var storyBySlugQuery = `*[_type == "story" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
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
}`;
var pageSectionFieldsFragment = `...,
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
  }`;
var pageBySlugQuery = `*[_type == "page" && slug.current == $slug && slug.current != "terms" && slug.current != "privacy" && !(_id in path("drafts.**"))][0]{
  title,
  "slug": slug.current,
  ${seoFragment},
  sections[]{ ${pageSectionFieldsFragment} },
  pageBuilder[]{ ${pageSectionFieldsFragment} }
}`;
var pageSectionsFragment = `sections[]{ ${pageSectionFieldsFragment} }`;
var networkFoundersPageQuery = `*[_id == "networkFoundersPage"][0]{
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
}`;
var networkAlumniDirectoryPageQuery = `*[_id == "networkAlumniDirectoryPage"][0]{
  directoryTitle,
  directorySubtitle,
  directoryCtaTitle,
  directoryCtaBody,
  directoryCtaPrimaryLabel,
  directoryCtaPrimaryHref,
  ${seoFragment}
}`;
var networkAdvisorsDirectoryPageQuery = `*[_id == "networkAdvisorsDirectoryPage"][0]{
  directoryTitle,
  directorySubtitle,
  directoryCtaTitle,
  directoryCtaBody,
  directoryCtaPrimaryLabel,
  directoryCtaPrimaryHref,
  ${seoFragment}
}`;
var networkInvestorsPageQuery = `*[_id == "networkInvestorsPage"][0]{
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
}`;
var networkAdvisorsPageQuery = `*[_id == "networkAdvisorsPage"][0]{
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
}`;
var networkPartnersPageQuery = `*[_id == "networkPartnersPage"][0]{
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
}`;
var landingTestimonialsFragment = `testimonials[]{
  quote,
  name,
  role,
  company,
  "image": coalesce(image.asset->url, imageSrc)
}`;
var diagnosticLandingPageQuery = `*[_id == "diagnosticLandingPage"][0]{
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
}`;
var consultingPageQuery = `*[_id == "consultingPage"][0]{
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
}`;
var termsPageQuery = `*[_id == "termsPage"][0]{
  title,
  intro,
  effectiveDate,
  body,
  ${seoFragment}
}`;
var privacyPageQuery = `*[_id == "privacyPage"][0]{
  title,
  intro,
  effectiveDate,
  legalNotice,
  body,
  ${seoFragment}
}`;
var homePageQuery = `*[_id == "homePage"][0]{
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
var aboutPageQuery = `*[_id == "aboutPage"][0]{
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
var faqPageQuery = `*[_id == "faqPage"][0]{
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
var programsLandingQuery = `*[_id == "programsLandingPage"][0]{
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
var programsLayoutPageQuery = `*[_id == "programsLayoutPage"][0]{
  title,
  ${seoFragment},
  ${pageSectionsFragment}
}`;
var eventsLandingQuery = `*[_id == "eventsLandingPage"][0]{
  heroTitlePortable,
  heroSubtitle,
  ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  ${seoFragment}
}`;
var programDetailFields = `
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
`;
var programsQuery = `*[_type == "program" && status != "hidden" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
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
}`;
var programBySlugQuery = `*[_type == "program" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
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
}`;
var eventsQuery = `*[_type == "event" && status != "hidden" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
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
  sortOrder
}`;
var eventBySlugQuery = `*[_type == "event" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
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
var contactPageQuery = `*[_id == "contactPage"][0]{
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
var notFoundQuery = `*[_id == "notFoundPage"][0]{
  title,
  message,
  ctaLabel,
  ${seoFragment}
}`;
var applyPageQuery = `*[_id == "applyPage"][0]{
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
}`;
var diagnosticSurveyContentQuery = `*[_id == "diagnosticSurveyContent"][0]{
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
}`;
var paymentPageQuery = `*[_id == "paymentPage"][0]{
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
var openRolesQuery = `*[_type == "openRole" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  "id": roleId.current,
  title,
  location,
  employmentType,
  description,
  responsibilities,
  linkedInApplyUrl
}`;
var careersPageQuery = `*[_id == "careersPage"][0]{
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
}`;
var advisorsQuery = `*[_type == "advisor" && !(_id in path("drafts.**"))]{
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
var alumniCompaniesQuery = `*[_type == "alumniCompany" && !(_id in path("drafts.**"))]{
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
var directoryFilterGroupsQuery = `*[_type == "directoryFilterGroup" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc){
  "id": slug.current,
  title,
  appliesTo,
  sortOrder,
  options[]{ label }
}`;
var sanityDraftsQuery = `*[
  _id in path("drafts.**")
  && !(_type match "sanity.*")
  && _type != "system.schema"
] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, name, headline, slug.current, _type),
  _updatedAt
}[0...24]`;
var sanityRecentEditsQuery = `*[
  !(_id in path("drafts.**"))
  && !(_type match "sanity.*")
  && _type != "system.schema"
] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, name, headline, slug.current, _type),
  _updatedAt
}[0...16]`;

// shared/cms/sanityQueryRegistry.ts
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
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";

// shared/cms/sanityEnv.ts
var parseList = (raw) => (raw ?? "").split(",").map((s) => s.trim()).filter(Boolean);
var resolveSanityApiConfig = () => {
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
var isVercelPreviewDeployment = () => Boolean(process.env.VERCEL) && process.env.VERCEL_ENV?.trim() === "preview";
var resolveAdminSanityDataset = (requested) => {
  const normalized = (requested?.trim() || "production").toLowerCase();
  if (normalized !== "production" && normalized !== "preview") return null;
  const allowed = parseList(process.env.SANITY_ALLOWED_DATASETS);
  if (allowed.length > 0 && !allowed.includes(normalized)) return null;
  return normalized;
};

// server/sanityPreview.ts
var SANITY_STUDIO_FALLBACK_URL = "https://relliahealth.sanity.studio";
var resolveSanityStudioUrl = () => process.env.SANITY_STUDIO_URL?.trim() || SANITY_STUDIO_FALLBACK_URL;
var isSanityStudioReferer = (req) => {
  const referer = (req.get("referer") || "").toLowerCase();
  return referer.includes(".sanity.studio") || referer.includes(".sanity.io");
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
  if (originHeader && (originHeader.endsWith(".sanity.studio") || originHeader.endsWith(".sanity.io"))) {
    return true;
  }
  const refererHeader = (req.get("referer") || "").trim();
  const refererOrigin = safeOriginFromUrl(refererHeader);
  if (refererOrigin && allowed.has(refererOrigin)) return true;
  if (refererOrigin && (refererOrigin.endsWith(".sanity.studio") || refererOrigin.endsWith(".sanity.io"))) {
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
var adminContentUrl = () => `${resolveSiteOrigin()}/admin/drafts`;
var resolveSanityStudioOrigin = () => {
  const fromNode = typeof process !== "undefined" ? process.env.SANITY_STUDIO_URL?.trim() || "" : "";
  return trimTrailingSlash(fromNode || "https://relliahealth.sanity.studio");
};
var studioDeskUrl = (documentType, documentId) => {
  const studioBase = resolveSanityStudioOrigin();
  const rawId = typeof documentId === "string" ? documentId : "";
  const docId = rawId.replace(/^drafts\./, "");
  if (!docId || !documentType) return studioBase;
  return `${studioBase}/desk/${documentType};${docId}`;
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
  app2.use(
    isDev ? helmet({
      contentSecurityPolicy: false,
      strictTransportSecurity: false
    }) : helmet({
      // Visual editing uses Studio -> iframe preview; framing is controlled by CSP headers in `vercel.json`.
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
        const publicClient = createClient3({
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
        const publicClient = createClient3({
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
        const publicClient = createClient3({
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
        const previewClient = createClient3({
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
        const previewClient = createClient3({
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
      const publicClient = createClient3({
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
        const { createClient: createClient4 } = await import("@supabase/supabase-js");
        const sessionClient = createClient4(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data: userData, error: userError } = await sessionClient.auth.getUser(token);
        if (userError || !userData.user) {
          res.status(401).json({ error: "Invalid or expired session." });
          return;
        }
        const adminClient = createClient4(supabaseUrl, serviceRoleKey, {
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
        res.setHeader("content-type", "application/json");
        res.json({ users });
      } catch (err) {
        console.error("Admin team error:", err);
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
        const { createClient: createClient4 } = await import("@supabase/supabase-js");
        const sessionClient = createClient4(supabaseUrl, anonKey, {
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
        const publicClient = createClient3({
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
        res.status(502).json({ error: "Could not load Sanity drafts." });
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
        const { createClient: createClient4 } = await import("@supabase/supabase-js");
        const adminClient = createClient4(supabaseUrl, serviceRoleKey, {
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
