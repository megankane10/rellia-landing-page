import {
  BlockElementIcon,
  CogIcon,
  LinkIcon,
  MenuIcon,
  ShareIcon,
  TagIcon,
  UsersIcon,
  ComposeIcon,
  DocumentIcon,
  CalendarIcon,
  HelpCircleIcon,
} from '@sanity/icons'

/** Default sidebar thumbnail when a schema has no image field. */
export const studioListMedia = {
  link: LinkIcon,
  navigation: MenuIcon,
  settings: CogIcon,
  section: BlockElementIcon,
  social: ShareIcon,
  tag: TagIcon,
  people: UsersIcon,
  story: ComposeIcon,
  document: DocumentIcon,
  event: CalendarIcon,
  guide: HelpCircleIcon,
} as const
