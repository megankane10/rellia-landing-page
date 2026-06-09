import {defineField} from 'sanity'

export const networkDirectoryChromeFields = [
  defineField({
    name: 'directoryTitle',
    title: 'Directory page heading',
    type: 'string',
    description: 'H1 on the /founders/alumni or /advisors/directory page.',
    group: 'content',
  }),
  defineField({
    name: 'directorySubtitle',
    title: 'Directory page intro',
    type: 'text',
    rows: 2,
    group: 'content',
  }),
  defineField({name: 'directoryCtaTitle', title: 'Directory bottom CTA headline', type: 'string', group: 'content'}),
  defineField({name: 'directoryCtaBody', title: 'Directory bottom CTA body', type: 'text', rows: 2, group: 'content'}),
  defineField({
    name: 'directoryCtaPrimaryLabel',
    title: 'Directory bottom CTA button label',
    type: 'string',
    group: 'content',
  }),
  defineField({
    name: 'directoryCtaPrimaryHref',
    title: 'Directory bottom CTA button link',
    type: 'string',
    group: 'content',
  }),
]
