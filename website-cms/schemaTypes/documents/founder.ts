import {defineArrayMember, defineField, defineType} from 'sanity'


/** Standalone founder profile (directory companies remain `alumniCompany`) */
export const founder = defineType({
  name: 'founder',
  title: 'Founder profile',
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
      description: 'e.g. CEO & Co-founder',
      group: 'content',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'reference',
      to: [{type: 'alumniCompany'}],
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
      options: {hotspot: true, cropAspect: 1, cropAspectPreset: 'square'},
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
    select: {title: 'name', subtitle: 'roleTitle', media: 'avatar'},
    prepare({title, subtitle, media}) {
      return {title: title || 'Founder', subtitle, media}
    },
  },
})
