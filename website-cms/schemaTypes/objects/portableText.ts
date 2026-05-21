import {defineType} from 'sanity'
import {portableTextArrayMembers} from '../shared/portableTextMembers'

/** Canonical rich text engine — use across body copy, event descriptions, bios */
export const portableText = defineType({
  name: 'portableText',
  title: 'Rich text',
  type: 'array',
  of: portableTextArrayMembers,
})
