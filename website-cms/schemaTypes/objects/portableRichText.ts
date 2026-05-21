import {defineType} from 'sanity'
import {portableTextArrayMembers} from '../shared/portableTextMembers'

/** Legacy name kept for GROQ / frontend compatibility — same engine as `portableText` */
export const portableRichText = defineType({
  name: 'portableRichText',
  title: 'Rich text',
  type: 'array',
  of: portableTextArrayMembers,
})
