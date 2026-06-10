import {defineType} from 'sanity'
import {portableTextBlockMember} from '../shared/portableTextMembers'

/** Job posting copy — paragraphs, bold, and lists (no images or embeds). */
export const openRoleDescription = defineType({
  name: 'openRoleDescription',
  title: 'Role description',
  type: 'array',
  of: [portableTextBlockMember],
})
