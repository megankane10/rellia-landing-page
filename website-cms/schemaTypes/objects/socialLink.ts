import {defineField, defineType} from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        layout: 'dropdown',
        list: [
          {title: 'LinkedIn', value: 'linkedin'},
          {title: 'Instagram', value: 'instagram'},
          {title: 'X (Twitter)', value: 'x'},
          {title: 'YouTube', value: 'youtube'},
          {title: 'Email', value: 'email'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Accessible label (e.g. “Rellia on LinkedIn”).',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https', 'mailto']}),
    }),
  ],
  preview: {
    select: {platform: 'platform', url: 'url'},
    prepare({platform, url}) {
      return {title: platform || 'Social link', subtitle: url}
    },
  },
})
