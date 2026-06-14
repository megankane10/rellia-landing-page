import {defineField, defineType} from 'sanity'
import {portableHeadlineField} from '../shared/inlineHeroHeadlineField'
import {sectionTagField, showSectionTagField} from '../shared/sectionAppearanceFields'
import {internalLabelField, sectionListPreview} from '../shared/sectionPreview'

export const sectionRichText = defineType({
  name: 'sectionRichText',
  title: 'Rich text block',
  type: 'object',
  fields: [
    defineField(internalLabelField),
    showSectionTagField,
    sectionTagField,
    portableHeadlineField({name: 'headlinePortable', title: 'Section heading'}),
    defineField({name: 'body', type: 'portableRichText'}),
  ],
  preview: sectionListPreview({typeLabel: 'Rich text', fallback: 'Rich text'}),
})
