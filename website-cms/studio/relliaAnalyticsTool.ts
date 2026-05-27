import {ChartUpwardIcon} from '@sanity/icons'
import type {Tool} from 'sanity'
import {LookerStudioPanel} from './LookerStudioPanel'

/** Top-level Studio tool — uses the full work area (better than a nested structure pane). */
export const relliaAnalyticsTool = (): Tool => ({
  name: 'analytics',
  title: 'Analytics',
  icon: ChartUpwardIcon,
  component: LookerStudioPanel,
})
