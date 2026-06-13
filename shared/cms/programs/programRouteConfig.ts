import { ADVANCE_DATAROOM_STATIC_BLOCKS } from "./advance-dataroom.static"
import { ADVISORY_BOARD_STATIC_BLOCKS } from "./advisory-board.static"
import { BRAND_STRATEGY_STATIC_BLOCKS } from "./brand-strategy.static"
import { ELEVATE_CAPITAL_STATIC_BLOCKS } from "./elevate-capital.static"
import { FIRST50_USERS_STATIC_BLOCKS } from "./first50-users.static"
import { IGNITE_PITCH_STATIC_BLOCKS } from "./ignite-pitch.static"
import { PROTOTYPE_LAB_STATIC_BLOCKS } from "./prototype-lab.static"
import { QMS_PROGRAM_STATIC_BLOCKS } from "./qms.static"
import { REGULATORY_ROADMAP_STATIC_BLOCKS } from "./regulatory-roadmap.static"
import type { ProgramPageStaticBlocks } from "./types"

export type ProgramRouteConfig = {
  outcomesSectionId: string
  staticBlocks: ProgramPageStaticBlocks
}

export const PROGRAM_ROUTE_CONFIG: Record<string, ProgramRouteConfig> = {
  "build-your-quality-management-system": {
    outcomesSectionId: "qms-program-outcomes",
    staticBlocks: QMS_PROGRAM_STATIC_BLOCKS,
  },
  "ignite-pitch-foundations": {
    outcomesSectionId: "ignite-outcomes",
    staticBlocks: IGNITE_PITCH_STATIC_BLOCKS,
  },
  "advance-data-room-deep-dive": {
    outcomesSectionId: "advance-outcomes",
    staticBlocks: ADVANCE_DATAROOM_STATIC_BLOCKS,
  },
  "elevate-healthcare-capital": {
    outcomesSectionId: "elevate-outcomes",
    staticBlocks: ELEVATE_CAPITAL_STATIC_BLOCKS,
  },
  "first-50-users-clinical-feedback-intensive": {
    outcomesSectionId: "first50-outcomes",
    staticBlocks: FIRST50_USERS_STATIC_BLOCKS,
  },
  "low-fidelity-prototype-lab": {
    outcomesSectionId: "prototype-outcomes",
    staticBlocks: PROTOTYPE_LAB_STATIC_BLOCKS,
  },
  "advisory-board-match": {
    outcomesSectionId: "advisory-outcomes",
    staticBlocks: ADVISORY_BOARD_STATIC_BLOCKS,
  },
  "design-your-brand-strategy": {
    outcomesSectionId: "brand-outcomes",
    staticBlocks: BRAND_STRATEGY_STATIC_BLOCKS,
  },
  "regulatory-strategy-sprint": {
    outcomesSectionId: "regulatory-outcomes",
    staticBlocks: REGULATORY_ROADMAP_STATIC_BLOCKS,
  },
}

export const getProgramRouteConfig = (slug: string): ProgramRouteConfig | undefined =>
  PROGRAM_ROUTE_CONFIG[slug.trim()]
