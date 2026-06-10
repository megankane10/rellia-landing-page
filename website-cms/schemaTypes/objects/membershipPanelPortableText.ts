import {defineType} from 'sanity'
import {portableTextBlockMember} from '../shared/portableTextMembers'

/** Left membership panel copy — paragraphs and bullet lists only. */
export const membershipPanelPortableText = defineType({
  name: 'membershipPanelPortableText',
  title: 'Rich text',
  type: 'array',
  of: [portableTextBlockMember],
})
