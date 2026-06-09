import type {CropAspectPreset} from '../shared/image/cropImage'

declare module 'sanity' {
  interface ImageOptions {
    cropAspect?: number
    cropAspectPreset?: CropAspectPreset
    cropMaxSize?: number
    cropAllowAspectChange?: boolean
    cropAllowFullImage?: boolean
  }
}
