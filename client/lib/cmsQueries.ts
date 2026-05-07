const seoFragment = `seo{
  metaTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  "ogImageUrl": ogImage.asset->url,
  noIndex,
  noFollow
}`

export const globalSettingsQuery = `*[_type == "globalSettings"][0]{
  footerTagline,
  supportEmail,
  linkedinUrl,
  instagramUrl,
  copyrightLine
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
  siteName,
  "logoUrl": logo.asset->url,
  defaultSeo{
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    "ogImageUrl": ogImage.asset->url,
    noIndex,
    noFollow
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
  ${seoFragment},
  ${pageSectionsFragment}
}`

export const networkAdvisorsPageQuery = `*[_type == "networkAdvisorsPage"][0]{
  title,
  ${seoFragment},
  ${pageSectionsFragment}
}`

export const networkInvestorsPageQuery = `*[_type == "networkInvestorsPage"][0]{
  title,
  ${seoFragment},
  ${pageSectionsFragment}
}`

export const networkPartnersPageQuery = `*[_type == "networkPartnersPage"][0]{
  title,
  ${seoFragment},
  ${pageSectionsFragment}
}`

export const homePageQuery = `*[_type == "homePage"][0]{
  headlinePrefix,
  headlineAccent,
  subheadline,
  primaryCtaLabel,
  primaryCtaPath,
  secondaryCtaLabel,
  secondaryCtaPath,
  metricsHeading,
  metricsSubheading,
  metrics[]{ label, value, suffix },
  howItWorksSectionTitle,
  testimonialsTitleLead,
  testimonialsTitleAccent,
  whyFeatures[]{ iconKey, title, description },
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

export const aboutPageQuery = `*[_type == "aboutPage"][0]{
  heroLine1,
  heroLine2Mint,
  heroLine3,
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
    "imageSrc": coalesce(image.asset->url, imageSrc)
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
  heroTitleLine1,
  heroTitleMint,
  heroSubtitle,
  heroPrimaryCtaLabel,
  heroSecondaryCtaLabel,
  programsSectionTitle,
  programsSectionSubtitle,
  programs[]{
    title,
    description,
    "imageSrc": coalesce(image.asset->url, imageSrc),
    href,
    buttonText
  },
  upcomingEvents[]{
    title,
    dateTime,
    person,
    "imageSrc": coalesce(image.asset->url, imageSrc),
    href,
    comingSoon,
    buttonText,
    slug,
    location,
    lumaEventId,
    detailBody,
    detailBodyHeading,
    embedLumaOnDetailPage,
    addToCalendarEnabled,
    calendarStartsAt,
    calendarEndsAt
  },
  pastEvents[]{
    title,
    dateTime,
    person,
    "imageSrc": coalesce(image.asset->url, imageSrc),
    href,
    comingSoon,
    buttonText,
    slug,
    location,
    lumaEventId,
    detailBody,
    detailBodyHeading,
    embedLumaOnDetailPage,
    addToCalendarEnabled,
    calendarStartsAt,
    calendarEndsAt
  },
  ctaTitle,
  ctaBody,
  ctaButtonLabel,
  ctaButtonHref,
  ${seoFragment}
}`;

export const programsQuery = `*[_type == "program" && status != "hidden"] | order(sortOrder asc, title asc){
  title,
  "slug": slug.current,
  description,
  "imageSrc": coalesce(image.asset->url, imageSrc),
  href,
  buttonText,
  waitlistHref,
  status,
  sortOrder,
  ${seoFragment}
}`

export const eventsQuery = `*[_type == "event" && status != "hidden"] | order(sortOrder asc, title asc){
  title,
  "slug": slug.current,
  "startsAt": coalesce(startsAt, calendarStartsAt),
  "endsAt": coalesce(endsAt, calendarEndsAt),
  dateTime,
  person,
  "imageSrc": coalesce(image.asset->url, imageSrc),
  href,
  comingSoon,
  buttonText,
  location,
  lumaEventId,
  detailBody,
  detailBodyHeading,
  embedLumaOnDetailPage,
  addToCalendarEnabled,
  calendarStartsAt,
  calendarEndsAt,
  status,
  sortOrder
}`

export const eventBySlugQuery = `*[_type == "event" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  "startsAt": coalesce(startsAt, calendarStartsAt),
  "endsAt": coalesce(endsAt, calendarEndsAt),
  dateTime,
  person,
  "imageSrc": coalesce(image.asset->url, imageSrc),
  href,
  comingSoon,
  buttonText,
  location,
  lumaEventId,
  detailBody,
  detailBodyHeading,
  embedLumaOnDetailPage,
  addToCalendarEnabled,
  calendarStartsAt,
  calendarEndsAt,
  status,
  sortOrder,
  ${seoFragment}
}`

export const programPageBySlugQuery = `*[_type == "programPage" && slug.current == $slug][0]{
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
  pricingSubAmount,
  pricingDescription,
  pricingBullets,
  bottomCtaTitle,
  bottomCtaBody,
  bottomCtaButtonLabel,
  bottomContactHref,
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
  heroHeadlinePrefix,
  heroHeadlineAccent,
  heroHeadlineSuffix,
  heroSubheadline,
  imageCardBadge,
  imageCardHeadlinePrefix,
  imageCardHeadlineAccent,
  "imageCardSrc": coalesce(imageCardImage.asset->url, imageCardSrc),
  imageCardAlt,
  highlightBenefits,
  pricingMonthlyBadge,
  pricingAnnualBadge,
  pricingMonthlyAmount,
  pricingAnnualAmount,
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
  ${seoFragment}
}`

export const marketingPageBySlugQuery = `*[_type == "marketingPage" && slug.current == $slug][0]{
  title,
  subtitle,
  body,
  ${seoFragment}
}`;

export const advisorsQuery = `*[_type == "advisor"]{
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
  "photoSrc": coalesce(photo.asset->url, photoSrc),
  linkedInUrl,
  websiteUrl,
  bio,
  mentoringStyle,
  highlights
}`;

export const alumniCompaniesQuery = `*[_type == "alumniCompany"]{
  "id": slug.current,
  name,
  slug,
  "level": level->label,
  tagline,
  "specialties": specialties[]->label,
  shortDescription,
  longDescription,
  websiteUrl,
  linkedinUrl,
  traction,
  relliaCollaboration,
  country,
  yearJoined,
  programs,
  "logoSrc": coalesce(logo.asset->url, logoSrc),
  founders[]{
    name,
    role,
    bio,
    linkedinUrl,
    "imageSrc": coalesce(image.asset->url, imageSrc)
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
