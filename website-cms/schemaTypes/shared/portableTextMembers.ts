import {defineArrayMember, defineField} from 'sanity'
import {richTextImageCropOptions, richTextImageDisplayModeField} from './richTextImageFields'

export const portableTextBlockMember = defineArrayMember({
  type: 'block',
  title: 'Paragraph',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'Heading 2', value: 'h2'},
    {title: 'Heading 3', value: 'h3'},
    {title: 'Heading 4', value: 'h4'},
    {title: 'Quote', value: 'blockquote'},
  ],
  lists: [
    {title: 'Bullet', value: 'bullet'},
    {title: 'Numbered', value: 'number'},
  ],
  marks: {
    decorators: [
      {title: 'Bold', value: 'strong'},
      {title: 'Italic', value: 'em'},
      {title: 'Underline', value: 'underline'},
      {title: 'Mint highlight', value: 'mint'},
    ],
    annotations: [{type: 'link'}],
  },
})

export const portableTextInlineImageMember = defineArrayMember({
  type: 'image',
  title: 'Image (upload)',
  options: richTextImageCropOptions,
  fields: [
    {
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((alt, context) => {
          const parent = context?.parent as {asset?: {_ref?: string}} | undefined
          if (!parent?.asset?._ref) return true
          const text = typeof alt === 'string' ? alt.trim() : ''
          return text ? true : 'Alt text is required for content images'
        }),
    },
    {name: 'caption', title: 'Caption', type: 'string'},
    richTextImageDisplayModeField,
  ],
})

export const portableTextInlineUrlImageMember = defineArrayMember({
  type: 'object',
  name: 'eventDetailInlineImage',
  title: 'Image (URL fallback)',
  fields: [
    defineField({
      name: 'imageSrc',
      title: 'Image URL',
      type: 'string',
      description: 'Relative site path (e.g. /images/…) or absolute URL. Prefer Image (upload) when possible.',
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'caption', type: 'string', title: 'Caption'}),
    richTextImageDisplayModeField,
  ],
  preview: {
    select: {title: 'alt', subtitle: 'imageSrc'},
    prepare({title, subtitle}) {
      return {
        title: title?.trim() || 'Image (URL)',
        subtitle: subtitle?.trim() || undefined,
      }
    },
  },
})

export const portableTextVideoMember = defineArrayMember({
  type: 'object',
  name: 'portableVideo',
  title: 'Video embed',
  fields: [
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'string',
      description: 'YouTube, Vimeo, or direct .mp4 / .webm file URL.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'posterUrl',
      title: 'Poster image URL',
      type: 'string',
      description: 'Optional thumbnail for file-based videos.',
    }),
    defineField({name: 'caption', type: 'string', title: 'Caption'}),
  ],
  preview: {
    select: {title: 'videoUrl', subtitle: 'caption'},
    prepare({title, subtitle}) {
      return {
        title: 'Video embed',
        subtitle: subtitle?.trim() || title?.trim() || undefined,
      }
    },
  },
})

export const portableTextArrayMembers = [
  portableTextBlockMember,
  portableTextInlineImageMember,
  portableTextInlineUrlImageMember,
  portableTextVideoMember,
  defineArrayMember({type: 'bodyCtaBox'}),
  defineArrayMember({type: 'portableImageCarousel'}),
]
