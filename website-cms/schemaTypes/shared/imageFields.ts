import {defineField, type FieldDefinition} from 'sanity'
import type {CropAspectPreset} from '../../../shared/image/cropImage'

type ImageFieldOptions = {
  description?: string
  group?: string
  /** Fixed crop aspect ratio (width / height). */
  cropAspect?: number
  cropAspectPreset?: CropAspectPreset
  cropMaxSize?: number
  cropAllowAspectChange?: boolean
}

const imageCropOptions = (options?: ImageFieldOptions) => {
  const crop: Record<string, number | boolean | string> = {
    hotspot: true,
  }

  if (typeof options?.cropAspect === 'number') {
    crop.cropAspect = options.cropAspect
  }
  if (options?.cropAspectPreset) {
    crop.cropAspectPreset = options.cropAspectPreset
  }
  if (typeof options?.cropMaxSize === 'number') {
    crop.cropMaxSize = options.cropMaxSize
  }
  if (typeof options?.cropAllowAspectChange === 'boolean') {
    crop.cropAllowAspectChange = options.cropAllowAspectChange
  }

  return crop
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
    options: imageCropOptions(options),
    description: options?.description,
    group: options?.group,
  })

/** Square portrait uploads (team cards, avatars, event tiles). */
export const squareImageUploadField = (
  name = 'image',
  title = 'Image',
  options?: Omit<ImageFieldOptions, 'cropAspect' | 'cropAspectPreset'>,
): FieldDefinition =>
  imageUploadField(name, title, {
    ...options,
    cropAspect: 1,
    cropAspectPreset: 'square',
  })

/** Portrait uploads used on advisor directory cards. */
export const portraitImageUploadField = (
  name = 'image',
  title = 'Image',
  options?: Omit<ImageFieldOptions, 'cropAspect' | 'cropAspectPreset'>,
): FieldDefinition =>
  imageUploadField(name, title, {
    ...options,
    cropAspect: 3 / 4,
    cropAspectPreset: 'portrait',
  })

/** Hero and banner imagery. */
export const wideImageUploadField = (
  name = 'image',
  title = 'Image',
  options?: Omit<ImageFieldOptions, 'cropAspect' | 'cropAspectPreset'>,
): FieldDefinition =>
  imageUploadField(name, title, {
    ...options,
    cropAspect: 16 / 9,
    cropAspectPreset: 'wide',
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
