import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutTeamMember = defineType({
  name: 'aboutTeamMember',
  title: 'Team member',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / title',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'Shown when visitors open the card overlay.',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true, cropAspect: 1, cropAspectPreset: 'square'},
      description: 'Square headshot. Upload here to add or update a team member.',
    }),
    defineField({
      name: 'imageSrc',
      title: 'Photo URL (fallback)',
      type: 'string',
      description: 'Optional legacy URL. Ignored when a photo is uploaded above.',
      hidden: ({parent}) => Boolean(parent?.image?.asset),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social & professional links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'image'},
  },
})
