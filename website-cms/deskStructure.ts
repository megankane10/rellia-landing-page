import type {StructureBuilder} from 'sanity/structure'
import type {ComponentType} from 'react'
import {
  HomeIcon,
  DocumentTextIcon,
  ControlsIcon,
  UsersIcon,
  SearchIcon,
  ComposeIcon,
  CogIcon,
  TagIcon,
} from '@sanity/icons'

const singleton = (S: StructureBuilder, title: string, schemaType: string, icon?: ComponentType) =>
  S.listItem().title(title).icon(icon).child(S.document().schemaType(schemaType).documentId(schemaType))

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
  'alumniCompany',
  'advisorFilter',
  'founderLevel',
  'founderSpecialty',
  'directoryFilterGroup',
  'diagnosticSubmission',
])

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Rellia CMS')
    .items([
      singleton(S, 'Site Settings', 'siteSettings', CogIcon),
      singleton(S, 'Global Settings', 'globalSettings', ControlsIcon),
      singleton(S, 'Navigation (header + footer)', 'navigation', ControlsIcon),
      S.divider(),
      singleton(S, 'Home page', 'homePage', HomeIcon),
      singleton(S, 'About page', 'aboutPage', DocumentTextIcon),
      singleton(S, 'Careers page', 'careersPage', DocumentTextIcon),
      singleton(S, 'FAQ page', 'faqPage', DocumentTextIcon),
      singleton(S, 'Contact page', 'contactPage', DocumentTextIcon),
      singleton(S, 'Payment page (/membership)', 'paymentPage', DocumentTextIcon),
      singleton(S, 'Consulting page (/consulting)', 'consultingPage', DocumentTextIcon),
      singleton(S, 'Not found page (404)', 'notFoundPage', DocumentTextIcon),
      S.divider(),
      S.listItem()
        .title('Programs (/programs)')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Programs')
            .items([
              singleton(S, 'Landing page', 'programsLandingPage', DocumentTextIcon),
              S.divider(),
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
            .items([
              singleton(S, 'Landing page', 'eventsLandingPage', DocumentTextIcon),
              S.divider(),
              S.documentTypeListItem('event').title('All events').icon(ComposeIcon),
            ]),
        ),
      S.listItem()
        .title('Stories (/stories)')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Stories')
            .items([
              singleton(S, 'Landing page', 'storiesPage', DocumentTextIcon),
              S.divider(),
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
              singleton(S, 'Landing page', 'networkFoundersPage', DocumentTextIcon),
              S.divider(),
              S.documentTypeListItem('alumniCompany').title('Alumni companies (directory)').icon(UsersIcon),
              S.divider(),
              founderDirectoryFilterGroups(S),
              S.documentTypeListItem('founderLevel').title('Levels (taxonomy)').icon(TagIcon),
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
              singleton(S, 'Landing page', 'networkAdvisorsPage', DocumentTextIcon),
              S.divider(),
              S.documentTypeListItem('advisor').title('Advisors (directory)').icon(UsersIcon),
              S.divider(),
              advisorDirectoryFilterGroups(S),
              S.documentTypeListItem('advisorFilter').title('Advisor filter tags').icon(TagIcon),
            ]),
        ),
      singleton(S, 'Investors (/investors)', 'networkInvestorsPage', DocumentTextIcon),
      singleton(S, 'Industry partners (/industry-partners)', 'networkPartnersPage', DocumentTextIcon),
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
              S.divider(),
              S.documentTypeListItem('diagnosticSubmission').title('Diagnostic survey submissions').icon(SearchIcon),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !HIDDEN_FROM_CATCH_ALL.has(item.getId() || '')),
    ])
