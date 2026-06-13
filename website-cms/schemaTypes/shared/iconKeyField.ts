import {defineField} from 'sanity'

const DEFAULT_ICON_DESCRIPTION =
  'Lucide icon name in PascalCase. Browse at lucide.dev/icons — e.g. ShieldCheck, Users, BriefcaseBusiness.'

type IconKeyFieldOptions = {
  required?: boolean
  description?: string
  name?: string
  title?: string
}

/** Free-text Lucide icon field stored as PascalCase `iconKey` (or custom `name`). */
export const iconKeyField = (options?: IconKeyFieldOptions) =>
  defineField({
    name: options?.name ?? 'iconKey',
    title: options?.title ?? 'Icon',
    type: 'string',
    description: options?.description ?? DEFAULT_ICON_DESCRIPTION,
    validation: options?.required ? (Rule) => Rule.required() : undefined,
  })

/** Same as iconKeyField but uses field name `icon` for legacy section schemas. */
export const lucideIconField = (description?: string) =>
  iconKeyField({
    name: 'icon',
    description: description ?? DEFAULT_ICON_DESCRIPTION,
  })
