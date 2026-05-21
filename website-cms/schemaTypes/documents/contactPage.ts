import {defineField, defineType} from 'sanity'
import {documentGroups, FIELDSET_SEO} from '../shared/fieldGroups'
import {singletonLayoutFields} from '../shared/singletonLayoutFields'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  groups: documentGroups,
  fieldsets: [FIELDSET_SEO],
  fields: [
    defineField({name: 'heroBadge', type: 'string', title: 'Hero badge', group: 'content'}),
    defineField({name: 'pageTitle', type: 'string', group: 'content'}),
    defineField({name: 'intro', type: 'text', rows: 3, group: 'content'}),
    defineField({
      name: 'sideImage',
      title: 'Side image',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),
    defineField({
      name: 'sideImageSrc',
      title: 'Side image URL (fallback if no image upload)',
      type: 'string',
      group: 'content',
    }),
    defineField({name: 'sideImageAlt', type: 'string', title: 'Side image alt text', group: 'content'}),
    defineField({name: 'quoteText', type: 'text', rows: 3, title: 'Quote on image', group: 'content'}),
    defineField({name: 'quoteAttributionName', type: 'string', title: 'Quote — name', group: 'content'}),
    defineField({name: 'quoteAttributionRole', type: 'string', title: 'Quote — role', group: 'content'}),
    defineField({name: 'successTitle', type: 'string', group: 'content'}),
    defineField({name: 'successBody', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'labels',
      type: 'object',
      group: 'content',
      fields: [
        {name: 'firstName', type: 'string'},
        {name: 'lastName', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'companyName', type: 'string', title: 'Company name'},
        {name: 'jobTitle', type: 'string', title: 'Job title'},
        {name: 'companySize', type: 'string', title: 'Company size'},
        {name: 'subject', type: 'string'},
        {name: 'message', type: 'string'},
      ],
    }),
    defineField({
      name: 'placeholders',
      type: 'object',
      group: 'content',
      fields: [
        {name: 'firstName', type: 'string'},
        {name: 'lastName', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'companyName', type: 'string'},
        {name: 'jobTitle', type: 'string'},
        {name: 'message', type: 'string'},
      ],
    }),
    defineField({name: 'subjectPlaceholder', type: 'string', group: 'content'}),
    defineField({name: 'companySizePlaceholder', type: 'string', group: 'content'}),
    defineField({
      name: 'subjectOptions',
      type: 'array',
      group: 'content',
      of: [
        defineField({
          name: 'option',
          type: 'object',
          fields: [
            {name: 'value', type: 'string'},
            {name: 'label', type: 'string'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'companySizeOptions',
      title: 'Company size options',
      type: 'array',
      group: 'content',
      of: [
        defineField({
          name: 'option',
          type: 'object',
          fields: [
            {name: 'value', type: 'string'},
            {name: 'label', type: 'string'},
          ],
        }),
      ],
    }),
    defineField({name: 'submitLabel', type: 'string', group: 'content'}),
    defineField({name: 'sendingLabel', type: 'string', group: 'content'}),
    ...singletonLayoutFields,
    defineField({name: 'seo', type: 'seo', group: 'seo', fieldset: 'seo'}),
  ],
})
