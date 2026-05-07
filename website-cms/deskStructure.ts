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
} from '@sanity/icons'

const singleton = (S: StructureBuilder, title: string, schemaType: string, icon?: ComponentType) =>
  S.listItem().title(title).icon(icon).child(S.document().schemaType(schemaType).documentId(schemaType))

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Rellia CMS')
    .items([
      S.listItem()
        .title('Start Here')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Start Here')
            .items([
              singleton(S, 'Global Settings', 'globalSettings', ControlsIcon),
              singleton(S, 'Navigation', 'navigation', ControlsIcon),
              singleton(S, 'Site Settings', 'siteSettings', CogIcon),
            ]),
        ),

      S.listItem()
        .title('Core Pages')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Core Pages')
            .items([
              singleton(S, 'Home Page', 'homePage', HomeIcon),
              singleton(S, 'About Page', 'aboutPage', DocumentTextIcon),
              singleton(S, 'Programs Landing', 'programsLandingPage', DocumentTextIcon),
              singleton(S, 'FAQ Page', 'faqPage', DocumentTextIcon),
              singleton(S, 'Contact Page', 'contactPage', DocumentTextIcon),
              singleton(S, 'Payment Page', 'paymentPage', DocumentTextIcon),
              singleton(S, 'Not Found Page', 'notFoundPage', DocumentTextIcon),
            ]),
        ),

      S.listItem()
        .title('Programs')
        .icon(ComposeIcon)
        .child(S.documentTypeList('programPage').title('Program Pages')),

      S.listItem()
        .title('Modular Pages')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('page').title('Modular Pages')),

      S.listItem()
        .title('Marketing Pages')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('marketingPage').title('Marketing Pages')),

      S.listItem()
        .title('Network Directory')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Network Directory')
            .items([
              S.documentTypeListItem('advisor').title('Advisors').icon(UsersIcon),
              S.documentTypeListItem('alumniCompany').title('Alumni Companies').icon(UsersIcon),
            ]),
        ),

      S.listItem()
        .title('Submissions')
        .icon(SearchIcon)
        .child(S.documentTypeList('diagnosticSubmission').title('Diagnostic Submissions')),

      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            'globalSettings',
            'navigation',
            'siteSettings',
            'homePage',
            'aboutPage',
            'programsLandingPage',
            'faqPage',
            'contactPage',
            'paymentPage',
            'notFoundPage',
            'programPage',
            'page',
            'marketingPage',
            'advisor',
            'alumniCompany',
            'diagnosticSubmission',
          ].includes(item.getId() || ''),
      ),
    ])

