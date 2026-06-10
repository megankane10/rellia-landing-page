import {defineField, type FieldDefinition} from 'sanity'

/** Shown on every dual-tone heading field in Studio. */
export const DUAL_TONE_HEADLINE_DESCRIPTION =
  'Type the full headline, select the accent words, then pick Mint or Teal from the toolbar.'

type PortableHeadlineFieldOptions = {
  name?: string
  title?: string
  group?: string
  fieldset?: string
  required?: boolean
  initialValue?: unknown
  hidden?: FieldDefinition['hidden']
}

/** Reusable inlineHeroHeadline field — one picker for dual-tone headings (no split accent fields). */
export const portableHeadlineField = ({
  name = 'heroTitlePortable',
  title = 'Hero headline',
  group,
  fieldset,
  required = false,
  initialValue,
  hidden,
}: PortableHeadlineFieldOptions = {}): FieldDefinition =>
  defineField({
    name,
    title,
    type: 'inlineHeroHeadline',
    description: DUAL_TONE_HEADLINE_DESCRIPTION,
    group,
    fieldset,
    initialValue,
    hidden,
    validation: required ? (Rule) => Rule.required().min(1) : undefined,
  })
