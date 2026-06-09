import type {PreviewConfig} from 'sanity'
import {studioListMedia} from './studioListMedia'

type SectionPreviewArgs = {
  typeLabel: string
  internalLabel?: string
  fallback?: string
}

/** Readable list labels for section objects, e.g. "Hero: Summer Launch". */
export const sectionListPreview = ({
  typeLabel,
  internalLabel,
  fallback,
}: SectionPreviewArgs): PreviewConfig => ({
  select: {
    internalLabel: 'internalLabel',
    title: 'title',
    badge: 'badge',
    tag: 'tag',
    heading: 'heading',
    headlinePortable: 'headlinePortable',
  },
  prepare(selection) {
    const label =
      (typeof selection.internalLabel === 'string' && selection.internalLabel.trim()) ||
      (typeof selection.title === 'string' && selection.title.trim()) ||
      (typeof selection.heading === 'string' && selection.heading.trim()) ||
      (Array.isArray(selection.headlinePortable) &&
        selection.headlinePortable[0]?.children?.[0]?.text?.trim()) ||
      (typeof selection.badge === 'string' && selection.badge.trim()) ||
      (typeof selection.tag === 'string' && selection.tag.trim()) ||
      fallback ||
      typeLabel
    return {
      title: `${typeLabel}: ${label}`,
      media: studioListMedia.section,
    }
  },
})

export const internalLabelField = {
  name: 'internalLabel',
  title: 'Label (editors only)',
  type: 'string',
  description: 'Helps identify this block in the section list. Not shown on the website.',
} as const
