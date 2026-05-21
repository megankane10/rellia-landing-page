import {defineArrayMember, defineField} from 'sanity'

export const portableTextBlockMember = defineArrayMember({
  type: 'block',
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
  options: {hotspot: true},
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
  ],
})

export const portableTextInlineUrlImageMember = defineArrayMember({
  type: 'object',
  name: 'eventDetailInlineImage',
  title: 'Image (URL)',
  fields: [
    defineField({
      name: 'imageSrc',
      title: 'Image URL',
      type: 'string',
      description: 'Relative site path (e.g. /images/…) or absolute URL.',
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'caption', type: 'string', title: 'Caption'}),
  ],
})

export const portableTextArrayMembers = [
  portableTextBlockMember,
  portableTextInlineImageMember,
  portableTextInlineUrlImageMember,
  defineArrayMember({type: 'bodyCtaBox'}),
  defineArrayMember({type: 'portableImageCarousel'}),
]
