import {defineField} from 'sanity'
import type {CropAspectPreset} from '../../../shared/image/cropImage'

export const richTextImageCropOptions = {
  hotspot: true,
  cropAllowFullImage: true,
  cropAspect: 16 / 9,
  cropAspectPreset: 'wide' as CropAspectPreset,
}

/** Persisted by the crop upload modal — not shown in the document form. */
export const richTextImageDisplayModeHiddenField = defineField({
  name: 'displayMode',
  title: 'On-site display',
  type: 'string',
  hidden: true,
  initialValue: 'cropped',
})

/** URL-only inline images have no upload modal — editors set display here. */
export const richTextImageDisplayModeField = defineField({
  name: 'displayMode',
  title: 'On-site display',
  type: 'string',
  options: {
    list: [
      {title: 'Cropped (wide banner)', value: 'cropped'},
      {title: 'Full image', value: 'full'},
    ],
    layout: 'radio',
  },
  initialValue: 'cropped',
  description: 'Cropped fills a wide banner frame; Full shows the entire image.',
})
