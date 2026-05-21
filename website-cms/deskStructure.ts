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
  CalendarIcon,
  BookIcon,
} from '@sanity/icons'

const singleton = (S: StructureBuilder, title: string, schemaType: string, icon?: ComponentType) =>
  S.listItem().title(title).icon(icon).child(S.document().schemaType(schemaType).documentId(schemaType))

const founderDirectoryFilterGroups = (S: StructureBuilder) =>
  S.listItem()
    .title('Filter groups')
    .icon(TagIcon)
    .child(
      S.documentList()
        .id('directoryFilterGroupsFounders')
        .title('Filter groups — founders')
        .filter('_type == "directoryFilterGroup" && appliesTo in ["founders", "both"]')
        .defaultOrdering([{field: 'sortOrder', direction: 'asc'}]),
    )

const advisorDirectoryFilterGroups = (S: StructureBuilder) =>
  S.listItem()
    .title('Filter groups')
    .icon(TagIcon)
    .child(
      S.documentList()
        .id('directoryFilterGroupsAdvisors')
        .title('Filter groups — advisors')
        .filter('_type == "directoryFilterGroup" && appliesTo in ["advisors", "both"]')
        .defaultOrdering([{field: 'sortOrder', direction: 'asc'}]),
    )

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

const collectionsGroup = (S: StructureBuilder) =>
  S.listItem()
    .title('Collections')
    .icon(ComposeIcon)
    .child(
      S.list()
        .title('Collections')
        .items([
          S.listItem()
            .title('Programs')
            .icon(DocumentTextIcon)
            .child(
              S.documentTypeList('program')
                .title('Programs')
                .defaultOrdering([{field: 'sortOrder', direction: 'asc'}]),
            ),
          S.listItem()
            .title('Events')
            .icon(CalendarIcon)
            .child(
              S.documentTypeList('event')
                .title('Events')
                .defaultOrdering([{field: 'sortOrder', direction: 'asc'}]),
            ),
          S.listItem()
            .title('Stories')
            .icon(BookIcon)
            .child(
              S.list()
                .title('Stories')
                .items([
                  S.documentTypeListItem('storyFilter')
                    .title('Categories')
                    .icon(TagIcon),
                  S.documentTypeListItem('story').title('All stories').icon(ComposeIcon),
                ]),
            ),
          S.listItem()
            .title('Founders directory')
            .icon(UsersIcon)
            .child(
              S.list()
                .title('Founders directory')
                .items([
                  S.documentTypeListItem('alumniCompany')
                    .title('Companies')
                    .icon(UsersIcon),
                  S.divider(),
                  founderDirectoryFilterGroups(S),
                  S.documentTypeListItem('founderSpecialty')
                    .title('Specialties')
                    .icon(TagIcon),
                ]),
            ),
          S.listItem()
            .title('Advisors directory')
            .icon(UsersIcon)
            .child(
              S.list()
                .title('Advisors directory')
                .items([
                  S.documentTypeListItem('advisor').title('Advisors').icon(UsersIcon),
                  S.divider(),
                  advisorDirectoryFilterGroups(S),
                  S.documentTypeListItem('advisorFilter').title('Filter tags').icon(TagIcon),
                ]),
            ),
          S.listItem()
            .title('Modular pages')
            .icon(DocumentTextIcon)
            .child(
              S.documentTypeList('page')
                .title('Modular pages (/terms, /privacy, …)')
                .defaultOrdering([{field: 'title', direction: 'asc'}]),
            ),
        ]),
    )

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
  'page',
  'advisor',
  'alumniCompany',
  'advisorFilter',
  'founderSpecialty',
  'directoryFilterGroup',
  'programPage',
  'marketingPage',
  'founder',
  'investor',
  'industryPartner',
  'founderLevel',
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
      collectionsGroup(S),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !HIDDEN_FROM_CATCH_ALL.has(item.getId() || '')),
    ])
