import {defineField} from 'sanity'
import type {CropAspectPreset} from '../../../shared/image/cropImage'

export const richTextImageCropOptions = {
  hotspot: true,
  cropAllowFullImage: true,
  cropAspect: 16 / 9,
  cropAspectPreset: 'wide' as CropAspectPreset,
}

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
  description:
    'Choose when uploading in the crop dialog, or change here later. Cropped fills a wide banner frame; Full shows the entire image.',
})
