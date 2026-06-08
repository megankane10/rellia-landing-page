import {defineField, type FieldDefinition} from 'sanity'

type ImageFieldOptions = {
  description?: string
  group?: string
}

/** Upload field — pair with `imageUrlFallbackField` on the same object. */
export const imageUploadField = (
  name = 'image',
  title = 'Image',
  options?: ImageFieldOptions,
): FieldDefinition =>
  defineField({
    name,
    title,
    type: 'image',
    options: {hotspot: true},
    description: options?.description,
    group: options?.group,
  })

/** Relative site paths and https URLs — used when no image is uploaded above. */
export const imageUrlFallbackField = (
  name = 'imageSrc',
  title = 'Image URL (fallback)',
  group?: string,
): FieldDefinition =>
  defineField({
    name,
    title,
    type: 'string',
    description: 'Site path (e.g. /images/…) or full https URL. Used when no image is uploaded above.',
    group,
  })
