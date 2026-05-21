import type {StructureBuilder} from 'sanity/structure'
import type {ComponentType} from 'react'
import {
  HomeIcon,
  DocumentTextIcon,
  ControlsIcon,
  UsersIcon,
  ComposeIcon,
  CogIcon,
  TagIcon,
} from '@sanity/icons'

const singleton = (S: StructureBuilder, title: string, schemaType: string, icon?: ComponentType) =>
  S.listItem().title(title).icon(icon).child(S.document().schemaType(schemaType).documentId(schemaType))

/** All marketing page singletons — primary site routes */
const pagesGroup = (S: StructureBuilder) =>
  S.listItem()
    .title('Pages')
    .icon(DocumentTextIcon)
    .child(
      S.list()
        .title('Pages')
        .items([
          singleton(S, 'Home', 'homePage', HomeIcon),
          singleton(S, 'About', 'aboutPage', DocumentTextIcon),
          singleton(S, 'Careers', 'careersPage', DocumentTextIcon),
          singleton(S, 'FAQ', 'faqPage', DocumentTextIcon),
          singleton(S, 'Contact', 'contactPage', DocumentTextIcon),
          singleton(S, 'Payment (/membership)', 'paymentPage', DocumentTextIcon),
          singleton(S, 'Consulting (/consulting)', 'consultingPage', DocumentTextIcon),
          singleton(S, '404', 'notFoundPage', DocumentTextIcon),
          S.divider(),
          singleton(S, 'Programs landing (/programs)', 'programsLandingPage', DocumentTextIcon),
          singleton(S, 'Events landing (/events)', 'eventsLandingPage', DocumentTextIcon),
          singleton(S, 'Stories landing (/stories)', 'storiesPage', DocumentTextIcon),
          S.divider(),
          singleton(S, 'Founders landing (/founders)', 'networkFoundersPage', DocumentTextIcon),
          singleton(S, 'Advisors landing (/advisors)', 'networkAdvisorsPage', DocumentTextIcon),
          singleton(S, 'Investors landing (/investors)', 'networkInvestorsPage', DocumentTextIcon),
          singleton(S, 'Industry partners landing', 'networkPartnersPage', DocumentTextIcon),
        ]),
    )

/** Filter groups that power the founders / alumni directory dropdowns */
const founderDirectoryFilterGroups = (S: StructureBuilder) =>
  S.listItem()
    .title('Filter groups (founders directory)')
    .icon(TagIcon)
    .child(
      S.documentList()
        .id('directoryFilterGroupsFounders')
        .title('Filter groups — founders')
        .filter('_type == "directoryFilterGroup" && appliesTo in ["founders", "both"]')
        .defaultOrdering([{field: 'sortOrder', direction: 'asc'}]),
    )

/** Filter groups that power the advisors directory dropdowns */
const advisorDirectoryFilterGroups = (S: StructureBuilder) =>
  S.listItem()
    .title('Filter groups (advisors directory)')
    .icon(TagIcon)
    .child(
      S.documentList()
        .id('directoryFilterGroupsAdvisors')
        .title('Filter groups — advisors')
        .filter('_type == "directoryFilterGroup" && appliesTo in ["advisors", "both"]')
        .defaultOrdering([{field: 'sortOrder', direction: 'asc'}]),
    )

/** Every document type we surface elsewhere — hide from the catch-all list to avoid duplicates */
const HIDDEN_FROM_CATCH_ALL = new Set([
  'globalSettings',
  'navigation',
  'siteSettings',
  'homePage',
  'aboutPage',
  'careersPage',
  'programsLandingPage',
  'eventsLandingPage',
  'storiesPage',
  'faqPage',
  'contactPage',
  'paymentPage',
  'consultingPage',
  'notFoundPage',
  'networkFoundersPage',
  'networkAdvisorsPage',
  'networkInvestorsPage',
  'networkPartnersPage',
  'program',
  'event',
  'story',
  'storyFilter',
  'programPage',
  'page',
  'marketingPage',
  'advisor',
  'founder',
  'investor',
  'industryPartner',
  'alumniCompany',
  'advisorFilter',
  'founderLevel',
  'founderSpecialty',
  'directoryFilterGroup',
])

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Rellia CMS')
    .items([
      singleton(S, 'Site Settings', 'siteSettings', CogIcon),
      singleton(S, 'Global Settings', 'globalSettings', ControlsIcon),
      singleton(S, 'Navigation (header + footer)', 'navigation', ControlsIcon),
      S.divider(),
      pagesGroup(S),
      S.divider(),
      S.listItem()
        .title('Programs (/programs)')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Programs')
            .items([
              S.documentTypeListItem('program').title('Program cards').icon(ComposeIcon),
              S.documentTypeListItem('programPage').title('Program detail pages').icon(DocumentTextIcon),
            ]),
        ),
      S.listItem()
        .title('Events (/events)')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Events')
            .items([S.documentTypeListItem('event').title('All events').icon(ComposeIcon)]),
        ),
      S.listItem()
        .title('Stories (/stories)')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Stories')
            .items([
              S.documentTypeListItem('storyFilter').title('Story categories (filters)').icon(TagIcon),
              S.documentTypeListItem('story').title('All stories').icon(ComposeIcon),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Founders (/founders)')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Founders')
            .items([
              S.documentTypeListItem('alumniCompany').title('Founder companies (directory)').icon(UsersIcon),
              S.documentTypeListItem('founder').title('Founder profiles').icon(UsersIcon),
              S.divider(),
              founderDirectoryFilterGroups(S),
              S.documentTypeListItem('founderSpecialty').title('Specialties (taxonomy)').icon(TagIcon),
            ]),
        ),
      S.listItem()
        .title('Advisors (/advisors)')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Advisors')
            .items([
              S.documentTypeListItem('advisor').title('Advisors (directory)').icon(UsersIcon),
              S.divider(),
              advisorDirectoryFilterGroups(S),
              S.documentTypeListItem('advisorFilter').title('Advisor filter tags').icon(TagIcon),
            ]),
        ),
      S.listItem()
        .title('Investors (/investors)')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Investors')
            .items([S.documentTypeListItem('investor').title('Investor profiles').icon(UsersIcon)]),
        ),
      S.listItem()
        .title('Industry partners (/industry-partners)')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Industry partners')
            .items([
              S.documentTypeListItem('industryPartner').title('Partner organizations').icon(UsersIcon),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Collections')
        .icon(ComposeIcon)
        .child(
          S.list()
            .title('Collections')
            .items([
              S.documentTypeListItem('page').title('Modular pages (/terms, /privacy, …)').icon(DocumentTextIcon),
              S.documentTypeListItem('marketingPage').title('Marketing pages').icon(DocumentTextIcon),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !HIDDEN_FROM_CATCH_ALL.has(item.getId() || '')),
    ])
