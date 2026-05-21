import {defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {seoField} from '../shared/seoField'

export const industryPartner = defineType({
  name: 'industryPartner',
  title: 'Industry partner',
  type: 'document',
  groups: documentGroups,
  fieldsets: [FIELDSET_SEO],
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'URL key',
      type: 'slug',
      options: {source: 'companyName', maxLength: 96},
      group: 'content',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'partnershipTier',
      title: 'Partnership tier',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Premier', value: 'premier'},
          {title: 'Strategic', value: 'strategic'},
          {title: 'Supporting', value: 'supporting'},
          {title: 'Community', value: 'community'},
        ],
      },
      initialValue: 'strategic',
      group: 'content',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 0, group: 'content'}),
    seoField,
  ],
  preview: {
    select: {title: 'companyName', tier: 'partnershipTier', media: 'logo'},
    prepare({title, tier, media}) {
      return {title: title || 'Partner', subtitle: tier, media}
    },
  },
})
