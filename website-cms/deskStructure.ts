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
        .title('Start Here')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Start Here')
            .items([
              singleton(S, 'Global Settings', 'globalSettings', ControlsIcon),
              singleton(S, 'Navigation (header + footer)', 'navigation', ControlsIcon),
              singleton(S, 'Site Settings', 'siteSettings', CogIcon),
            ]),
        ),

      S.listItem()
        .title('Core Pages')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Core Pages — singletons for top-level routes')
            .items([
              singleton(S, 'Home Page', 'homePage', HomeIcon),
              singleton(S, 'About Page', 'aboutPage', DocumentTextIcon),
              singleton(S, 'Careers Page', 'careersPage', DocumentTextIcon),
              singleton(S, 'Programs Landing (/programs index copy)', 'programsLandingPage', DocumentTextIcon),
              singleton(S, 'FAQ Page', 'faqPage', DocumentTextIcon),
              singleton(S, 'Contact Page', 'contactPage', DocumentTextIcon),
              singleton(S, 'Payment Page', 'paymentPage', DocumentTextIcon),
              singleton(S, 'Consulting Page', 'consultingPage', DocumentTextIcon),
              singleton(S, 'Not Found Page', 'notFoundPage', DocumentTextIcon),
            ]),
        ),

      S.listItem()
        .title('Programs')
        .icon(ComposeIcon)
        .child(
          S.list()
            .title('Programs — cards on /programs and per-program detail pages')
            .items([
              S.documentTypeListItem('program').title('Programs (cards on /programs)').icon(ComposeIcon),
              S.documentTypeListItem('programPage').title('Program Detail Pages (/programs/<slug>)').icon(DocumentTextIcon),
            ]),
        ),

      S.listItem()
        .title('Events')
        .icon(ComposeIcon)
        .child(S.documentTypeList('event').title('Events')),

      S.listItem()
        .title('Modular Pages')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('page').title('Modular Pages — composed sections (used by /terms, /privacy)'),
        ),

      S.listItem()
        .title('Marketing Pages')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Marketing Pages')
            .items([
              singleton(S, 'Stories Page (/stories)', 'storiesPage', DocumentTextIcon),
              S.documentTypeListItem('story').title('Stories').icon(ComposeIcon),
              S.documentTypeListItem('storyFilter').title('Story filters').icon(TagIcon),
              S.divider(),
              S.documentTypeListItem('marketingPage')
                .title('Marketing Pages — long-form copy (no route wired yet)')
                .icon(DocumentTextIcon),
            ]),
        ),

      S.listItem()
        .title('Network Directory')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Network Directory')
            .items([
              S.documentTypeListItem('advisor').title('Advisors').icon(UsersIcon),
              S.documentTypeListItem('alumniCompany').title('Alumni Companies').icon(UsersIcon),
              S.divider(),
              singleton(S, 'Founders Page (/founders) — SEO', 'networkFoundersPage', DocumentTextIcon),
              singleton(S, 'Advisors Page (/advisors) — SEO', 'networkAdvisorsPage', DocumentTextIcon),
              singleton(S, 'Investors Page (/investors) — SEO', 'networkInvestorsPage', DocumentTextIcon),
              singleton(S, 'Industry Partners Page (/industry-partners) — SEO', 'networkPartnersPage', DocumentTextIcon),
            ]),
        ),

      S.listItem()
        .title('Directory Taxonomy')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Directory Taxonomy — editable filter tags')
            .items([
              S.documentTypeListItem('advisorFilter').title('Advisor filters').icon(TagIcon),
              S.documentTypeListItem('founderLevel').title('Founder levels').icon(TagIcon),
              S.documentTypeListItem('founderSpecialty').title('Founder specialties').icon(TagIcon),
            ]),
        ),

      S.listItem()
        .title('Diagnostic Survey Submissions')
        .icon(SearchIcon)
        .child(S.documentTypeList('diagnosticSubmission').title('Diagnostic Survey Submissions')),

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
