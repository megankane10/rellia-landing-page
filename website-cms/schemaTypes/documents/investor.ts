import {defineArrayMember, defineField, defineType} from 'sanity'


export const investor = defineType({
  name: 'investor',
  title: 'Investor',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'URL key',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      group: 'content',
    }),
    defineField({
      name: 'roleTitle',
      title: 'Role / title',
      type: 'string',
      description: 'e.g. Partner, Managing Director',
      group: 'content',
    }),
    defineField({
      name: 'organization',
      title: 'Firm / organization',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social & professional links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
      group: 'content',
    }),
    defineField({name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 0, group: 'content'}),

  ],
  preview: {
    select: {title: 'name', subtitle: 'organization', media: 'avatar'},
    prepare({title, subtitle, media}) {
      return {title: title || 'Investor', subtitle, media}
    },
  },
})
