/** Reusable document groups for Content vs SEO panels */
export const GROUP_CONTENT = {name: 'content' as const, title: 'Content', default: true}
export const GROUP_SEO = {name: 'seo' as const, title: 'SEO & metadata'}
export const GROUP_LAYOUT = {name: 'layout' as const, title: 'Layout builder'}
export const GROUP_SETTINGS = {name: 'settings' as const, title: 'Settings', default: true}
export const GROUP_PUBLISHING = {name: 'publishing' as const, title: 'Publishing'}

export const FIELDSET_SEO = {name: 'seo' as const, title: 'SEO & metadata', options: {collapsible: true, collapsed: true}}

export const documentGroups = [GROUP_CONTENT, GROUP_LAYOUT, GROUP_PUBLISHING, GROUP_SEO]
