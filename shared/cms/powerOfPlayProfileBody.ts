import type { SanityPortableText } from "./types"

/** Dev/preview fallback when Sanity alumni documents are unavailable. */
export const POWER_OF_PLAY_PROFILE_BODY: SanityPortableText = [
  {
    _type: "block",
    _key: "pop-intro",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "pop-intro-span",
        text: "Power of Play transforms pediatric rehabilitation by replacing rigid, adult-calibrated medical diagnostics with child-centric tools. Standard clinical tools are often too intimidating or insensitive to capture accurate metrics for low muscle tone. Our evidence-based solution integrates diagnostic sensitivity directly into an interactive, dinosaur-shaped hand-strength measurement platform that captures objective maximum effort through play.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "pop-t1",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "pop-t1-span",
        text: "Clinical Validation: Formally backed by 4-week usability pilots and over 200 user interviews with healthcare professionals.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "pop-t2",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "pop-t2-span",
        text: "Validation & Reliability: Proven 95% test-retest reliability for grip measurements and 92% reliability for pinch strength, significantly outperforming market alternatives.",
        marks: [],
      },
    ],
  },
]
