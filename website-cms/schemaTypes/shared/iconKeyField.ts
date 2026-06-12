import {defineField} from 'sanity'

/** Lucide icon picker stored as `iconKey` (PascalCase names). */
export const iconKeyField = (options?: {required?: boolean; description?: string}) =>
  defineField({
    name: 'iconKey',
    title: 'Icon',
    type: 'string',
    description:
      options?.description ??
      'Lucide icon name (e.g. BriefcaseBusiness, Megaphone, ShieldCheck).',
    options: {
      layout: 'dropdown',
      list: [
        {title: 'BriefcaseBusiness', value: 'BriefcaseBusiness'},
        {title: 'ClipboardList', value: 'ClipboardList'},
        {title: 'BadgeCheck', value: 'BadgeCheck'},
        {title: 'DollarSign', value: 'DollarSign'},
        {title: 'Megaphone', value: 'Megaphone'},
        {title: 'Building2', value: 'Building2'},
        {title: 'Activity', value: 'Activity'},
        {title: 'ShieldCheck', value: 'ShieldCheck'},
        {title: 'Users', value: 'Users'},
        {title: 'Rocket', value: 'Rocket'},
        {title: 'Target', value: 'Target'},
        {title: 'Layers', value: 'Layers'},
        {title: 'Heart', value: 'Heart'},
        {title: 'Stethoscope', value: 'Stethoscope'},
        {title: 'Globe', value: 'Globe'},
        {title: 'Zap', value: 'Zap'},
        {title: 'Sparkles', value: 'Sparkles'},
        {title: 'Compass', value: 'Compass'},
        {title: 'ClipboardCheck', value: 'ClipboardCheck'},
        {title: 'GraduationCap', value: 'GraduationCap'},
        {title: 'Timer', value: 'Timer'},
        {title: 'Wrench', value: 'Wrench'},
        {title: 'FileText', value: 'FileText'},
        {title: 'UserCheck', value: 'UserCheck'},
        {title: 'Clock', value: 'Clock'},
        {title: 'HeartHandshake', value: 'HeartHandshake'},
        {title: 'Network', value: 'Network'},
        {title: 'BookOpen', value: 'BookOpen'},
        {title: 'ArrowRight', value: 'ArrowRight'},
      ],
    },
    validation: options?.required ? (Rule) => Rule.required() : undefined,
  })
