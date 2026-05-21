import {defineArrayMember, defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {seoField} from '../shared/seoField'

/** Standalone founder profile (directory companies remain `alumniCompany`) */
export const founder = defineType({
  name: 'founder',
  title: 'Founder profile',
  type: 'document',
  groups: documentGroups,
  fieldsets: [FIELDSET_SEO],
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
    seoField,
  ],
  preview: {
    select: {title: 'name', subtitle: 'roleTitle', media: 'avatar'},
    prepare({title, subtitle, media}) {
      return {title: title || 'Founder', subtitle, media}
    },
  },
})
