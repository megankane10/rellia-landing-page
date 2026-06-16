import {defineArrayMember, defineType} from 'sanity'
import {portableTextBlockMember} from '../shared/portableTextMembers'

/** Job posting copy — paragraphs, lists, block quotes, and quote boxes (no inline images on the live site). */
export const openRoleDescription = defineType({
  name: 'openRoleDescription',
  title: 'Role description',
  type: 'array',
  of: [portableTextBlockMember, defineArrayMember({type: 'portableQuoteBox'})],
})
