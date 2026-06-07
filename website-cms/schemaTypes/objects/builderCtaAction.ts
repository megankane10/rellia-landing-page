import {defineField, defineType} from 'sanity'

/** Page-builder button — internal/external link or inline Fillout embed reveal. */
export const builderCtaAction = defineType({
  name: 'builderCtaAction',
  title: 'Button action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'actionType',
      title: 'Action type',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Link (redirect)', value: 'link'},
          {title: 'Embed form', value: 'embed'},
        ],
      },
      initialValue: 'link',
    }),
    defineField({
      name: 'href',
      title: 'Link URL',
      type: 'string',
      description: 'Internal path (e.g. /apply) or full https URL.',
      hidden: ({parent}) => parent?.actionType === 'embed',
    }),
    defineField({
      name: 'filloutFormUrl',
      title: 'Fillout form URL',
      type: 'url',
      description: 'Full https://forms.fillout.com/t/… URL — form reveals inline when clicked.',
      hidden: ({parent}) => parent?.actionType !== 'embed',
    }),
  ],
  preview: {
    select: {title: 'label', actionType: 'actionType'},
    prepare({title, actionType}) {
      return {
        title: title || 'Button',
        subtitle: actionType === 'embed' ? 'Embed form' : 'Link',
      }
    },
  },
})
