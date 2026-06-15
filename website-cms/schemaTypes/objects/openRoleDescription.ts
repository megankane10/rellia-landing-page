import {defineType} from 'sanity'
import {
  portableTextBlockMember,
  portableTextInlineImageMember,
  portableTextInlineUrlImageMember,
} from '../shared/portableTextMembers'

/** Job posting copy — paragraphs, bold, lists, and inline images. */
export const openRoleDescription = defineType({
  name: 'openRoleDescription',
  title: 'Role description',
  type: 'array',
  of: [portableTextBlockMember, portableTextInlineImageMember, portableTextInlineUrlImageMember],
})
