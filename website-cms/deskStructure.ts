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

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Rellia CMS')
    .items([
      S.listItem()
        .title('Site settings & navigation')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Site settings & navigation')
            .items([
              singleton(S, 'Global Settings', 'globalSettings', ControlsIcon),
              singleton(S, 'Navigation (header + footer)', 'navigation', ControlsIcon),
              singleton(S, 'Site Settings', 'siteSettings', CogIcon),
            ]),
        ),

      S.listItem()
        .title('Solutions')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Solutions')
            .items([
              singleton(S, 'Consulting Page', 'consultingPage', DocumentTextIcon),
              singleton(S, 'Programs landing page (/programs)', 'programsLandingPage', DocumentTextIcon),
              S.documentTypeListItem('event').title('Events').icon(ComposeIcon),
              singleton(S, 'Payment page (/membership)', 'paymentPage', DocumentTextIcon),
            ]),
        ),

      S.listItem()
        .title('Network')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Network')
            .items([
              S.documentTypeListItem('advisor').title('Advisors').icon(UsersIcon),
              S.documentTypeListItem('alumniCompany').title('Alumni Companies').icon(UsersIcon),
              S.divider(),
              singleton(S, 'Founders page (/founders)', 'networkFoundersPage', DocumentTextIcon),
              singleton(S, 'Advisors page (/advisors)', 'networkAdvisorsPage', DocumentTextIcon),
              singleton(S, 'Investors page (/investors)', 'networkInvestorsPage', DocumentTextIcon),
              singleton(S, 'Industry partners page (/industry-partners)', 'networkPartnersPage', DocumentTextIcon),
            ]),
        ),

      S.listItem()
        .title('Resources')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Resources')
            .items([
              singleton(S, 'Stories page (/stories)', 'storiesPage', DocumentTextIcon),
              S.divider(),
              S.documentTypeListItem('story').title('Stories').icon(ComposeIcon),
              S.documentTypeListItem('storyFilter').title('Story filters').icon(TagIcon),
            ]),
        ),

      S.listItem()
        .title('Company')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Company')
            .items([
              singleton(S, 'Home page', 'homePage', HomeIcon),
              singleton(S, 'About page', 'aboutPage', DocumentTextIcon),
              singleton(S, 'Careers page', 'careersPage', DocumentTextIcon),
              S.divider(),
              singleton(S, 'FAQ page', 'faqPage', DocumentTextIcon),
              singleton(S, 'Contact page', 'contactPage', DocumentTextIcon),
              singleton(S, 'Not found page (404)', 'notFoundPage', DocumentTextIcon),
            ]),
        ),

      S.listItem()
        .title('Collections')
        .icon(ComposeIcon)
        .child(
          S.list()
            .title('Collections')
            .items([
              S.documentTypeListItem('event').title('Events').icon(ComposeIcon),
              S.documentTypeListItem('program').title('Programs').icon(ComposeIcon),
              S.documentTypeListItem('programPage')
                .title('Program detail pages (/programs/<slug>)')
                .icon(DocumentTextIcon),
              S.documentTypeListItem('page')
                .title('Modular pages — composed sections (e.g. /terms, /privacy)')
                .icon(DocumentTextIcon),
              S.documentTypeListItem('marketingPage')
                .title('Marketing pages — long-form copy (no route wired yet)')
                .icon(DocumentTextIcon),
              S.divider(),
              S.listItem()
                .title('Directory taxonomy')
                .icon(TagIcon)
                .child(
                  S.list()
                    .title('Directory taxonomy — editable filter tags')
                    .items([
                      S.documentTypeListItem('advisorFilter').title('Advisor filters').icon(TagIcon),
                      S.documentTypeListItem('founderLevel').title('Founder levels').icon(TagIcon),
                      S.documentTypeListItem('founderSpecialty').title('Founder specialties').icon(TagIcon),
                    ]),
                ),
              S.listItem()
                .title('Diagnostic survey submissions')
                .icon(SearchIcon)
                .child(S.documentTypeList('diagnosticSubmission').title('Diagnostic survey submissions')),
            ]),
        ),

      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            'globalSettings',
            'navigation',
            'siteSettings',
            'homePage',
            'aboutPage',
            'careersPage',
            'programsLandingPage',
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
            'diagnosticSubmission',
          ].includes(item.getId() || ''),
      ),
    ])
