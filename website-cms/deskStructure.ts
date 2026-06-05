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
  HelpCircleIcon,
  CaseIcon,
} from '@sanity/icons'
import {StudioGuideReadPanel} from './studio/StudioGuideReadPanel'

const API_VERSION = '2024-01-01'

const singleton = (
  S: StructureBuilder,
  title: string,
  schemaType: string,
  icon?: ComponentType,
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(schemaType).documentId(schemaType))

const filteredList = (
  S: StructureBuilder,
  id: string,
  title: string,
  filter: string,
  ordering?: {field: string; direction: 'asc' | 'desc'}[],
) => {
  let list = S.documentList().apiVersion(API_VERSION).id(id).title(title).filter(filter)
  if (ordering) list = list.defaultOrdering(ordering)
  return list
}

const siteGroup = (S: StructureBuilder) =>
  S.listItem()
    .title('Site')
    .icon(CogIcon)
    .child(
      S.list()
        .title('Site')
        .items([
          singleton(S, 'Site settings', 'siteSettings', CogIcon),
          singleton(S, 'Global settings', 'globalSettings', ControlsIcon),
          singleton(S, 'Navigation', 'navigation', ControlsIcon),
        ]),
    )

/** All marketing routes editable in CMS (excludes /admin dashboard). */
const pagesGroup = (S: StructureBuilder) =>
  S.listItem()
    .title('Pages')
    .icon(DocumentTextIcon)
    .child(
      S.list()
        .title('Pages')
        .items([
          singleton(S, 'Home', 'homePage', HomeIcon),
          singleton(S, 'Programs landing', 'programsLandingPage', DocumentTextIcon),
          singleton(S, 'Apply', 'applyPage', DocumentTextIcon),
          singleton(S, 'Founders page', 'networkFoundersPage', DocumentTextIcon),
          singleton(S, 'Advisors page', 'networkAdvisorsPage', DocumentTextIcon),
          singleton(S, 'Investors page', 'networkInvestorsPage', DocumentTextIcon),
          singleton(S, 'Industry partners page', 'networkPartnersPage', DocumentTextIcon),
          singleton(S, 'Contact', 'contactPage', DocumentTextIcon),
          S.divider(),
          singleton(S, 'About', 'aboutPage', DocumentTextIcon),
          singleton(S, 'Careers', 'careersPage', DocumentTextIcon),
          singleton(S, 'FAQ', 'faqPage', DocumentTextIcon),
          singleton(S, 'Membership', 'paymentPage', DocumentTextIcon),
          singleton(S, 'Consulting', 'consultingPage', DocumentTextIcon),
          singleton(S, 'Diagnostic survey copy', 'diagnosticSurveyContent', DocumentTextIcon),
          singleton(S, 'Startup diagnostic', 'diagnosticLandingPage', DocumentTextIcon),
          singleton(S, 'Not found', 'notFoundPage', DocumentTextIcon),
          S.divider(),
          singleton(S, 'Terms of use', 'termsPage', DocumentTextIcon),
          singleton(S, 'Privacy policy', 'privacyPage', DocumentTextIcon),
          S.divider(),
          singleton(S, 'Events landing', 'eventsLandingPage', DocumentTextIcon),
          singleton(S, 'Stories landing', 'storiesPage', DocumentTextIcon),
          S.divider(),
          S.listItem()
            .title('Modular Pages')
            .icon(ComposeIcon)
            .child(
              S.documentTypeList('page')
                .apiVersion(API_VERSION)
                .title('Modular Pages')
            ),
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
                .apiVersion(API_VERSION)
                .title('Programs')
                .defaultOrdering([{field: 'sortOrder', direction: 'asc'}]),
            ),
          S.listItem()
            .title('Events')
            .icon(CalendarIcon)
            .child(
              S.documentTypeList('event')
                .apiVersion(API_VERSION)
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
                  S.documentTypeListItem('story')
                    .title('All stories')
                    .icon(ComposeIcon),
                ]),
            ),
          S.divider(),
          S.listItem()
            .title('Careers open roles')
            .icon(CaseIcon)
            .child(
              S.document()
                .schemaType('careersPage')
                .documentId('careersPage')
                .title('Open roles')
                .views([S.view.form().title('Open roles').id('open-roles')]),
            ),
        ]),
    )

const advisorsPeopleGroup = (S: StructureBuilder) =>
  S.listItem()
    .title('Advisors')
    .icon(UsersIcon)
    .child(
      S.list()
        .title('Advisors')
        .items([
          S.documentTypeListItem('advisor').title('All advisors').icon(UsersIcon),
          S.divider(),
          S.documentTypeListItem('advisorFilter').title('Filter tags').icon(TagIcon),
          S.listItem()
            .title('Filter groups')
            .icon(TagIcon)
            .child(
              filteredList(
                S,
                'directoryFilterGroupsAdvisors',
                'Filter groups',
                '_type == "directoryFilterGroup" && appliesTo in ["advisors", "both"]',
                [{field: 'sortOrder', direction: 'asc'}],
              ),
            ),
        ]),
    )

const foundersPeopleGroup = (S: StructureBuilder) =>
  S.listItem()
    .title('Founders')
    .icon(UsersIcon)
    .child(
      S.list()
        .title('Founders')
        .items([
          S.documentTypeListItem('alumniCompany')
            .title('Companies')
            .icon(UsersIcon),
          S.divider(),
          S.documentTypeListItem('founderSpecialty').title('Specialties').icon(TagIcon),
          S.listItem()
            .title('Filter groups')
            .icon(TagIcon)
            .child(
              filteredList(
                S,
                'directoryFilterGroupsFounders',
                'Filter groups',
                '_type == "directoryFilterGroup" && appliesTo in ["founders", "both"]',
                [{field: 'sortOrder', direction: 'asc'}],
              ),
            ),
        ]),
    )

const peopleGroup = (S: StructureBuilder) =>
  S.listItem()
    .title('People')
    .icon(UsersIcon)
    .child(
      S.list()
        .title('People')
        .items([advisorsPeopleGroup(S), foundersPeopleGroup(S)]),
    )

/** Full-page CMS guide (edit copy in document fields). */
const supportPanel = (S: StructureBuilder) =>
  S.listItem()
    .title('Support')
    .icon(HelpCircleIcon)
    .child(
      S.list()
        .title('Support')
        .items([
          S.listItem()
            .title('How to use this CMS')
            .icon(HelpCircleIcon)
            .child(S.component().component(StudioGuideReadPanel).title('How to use this CMS')),
          S.listItem()
            .title('Edit guide content')
            .icon(ComposeIcon)
            .child(
              S.document()
                .schemaType('studioGuide')
                .documentId('studioGuide')
                .title('Edit CMS guide'),
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
  'applyPage',
  'diagnosticSurveyContent',
  'consultingPage',
  'diagnosticLandingPage',
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
  'founderLevel',
  'programPage',
  'marketingPage',
  'founder',
  'investor',
  'industryPartner',
  'studioGuide',
  'termsPage',
  'privacyPage',
])

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Website Editor')
    .items([
      siteGroup(S),
      pagesGroup(S),
      collectionsGroup(S),
      peopleGroup(S),
      S.divider(),
      supportPanel(S),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !HIDDEN_FROM_CATCH_ALL.has(item.getId() || '')),
    ])
