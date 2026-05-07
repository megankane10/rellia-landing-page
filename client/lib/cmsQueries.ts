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

export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  seo,
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
  ctaImageUrl,
  ctaImageAlt,
  testimonials[]{
    name,
    role,
    company,
    quote,
    companyInfo,
    "imageSrc": coalesce(image.asset->url, imageSrc)
  }
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
    "imageSrc": coalesce(image.asset->url, imageSrc)
  },
  ctaTitle,
  ctaBody,
  ctaFounderLabel,
  ctaTeamLabel
}`;

export const faqPageQuery = `*[_type == "faqPage"][0]{
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
  bottomCtaPath
}`;

export const programsLandingQuery = `*[_type == "programsLandingPage"][0]{
  heroTitleLine1,
  heroTitleMint,
  heroSubtitle,
  heroPrimaryCtaLabel,
  heroSecondaryCtaLabel,
  programsSectionTitle,
  programsSectionSubtitle,
  programs[]{ title, description, imageSrc, href, buttonText },
  upcomingEvents[]{
    title, slug, dateTime, person, imageSrc, href, comingSoon, location, lumaEventId,
    detailBody, detailBodyHeading, embedLumaOnDetailPage,
    addToCalendarEnabled, calendarStartsAt, calendarEndsAt
  },
  pastEvents[]{
    title, slug, dateTime, person, imageSrc, href, buttonText, location, lumaEventId,
    detailBody, detailBodyHeading, embedLumaOnDetailPage,
    addToCalendarEnabled, calendarStartsAt, calendarEndsAt
  },
  ctaTitle,
  ctaBody,
  ctaButtonLabel,
  ctaButtonHref
}`;

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
  sendingLabel
}`;

export const notFoundQuery = `*[_type == "notFoundPage"][0]{
  title,
  message,
  ctaLabel
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
  imageCardSrc,
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
  questionsContactPath
}`;

export const marketingPageBySlugQuery = `*[_type == "marketingPage" && slug.current == $slug][0]{
  title,
  subtitle,
  body
}`;

export const advisorsQuery = `*[_type == "advisor"]{
  "id": slug.current,
  name,
  organization,
  role,
  industries,
  focus,
  filter,
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
  level,
  tagline,
  specialties,
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
