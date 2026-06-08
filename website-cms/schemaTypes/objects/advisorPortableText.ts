import {defineType} from 'sanity'
import {portableTextBlockMember} from '../shared/portableTextMembers'

/** Advisor bio — paragraphs and bullet lists only */
export const advisorPortableText = defineType({
  name: 'advisorPortableText',
  title: 'Advisor bio',
  type: 'array',
  of: [portableTextBlockMember],
})
