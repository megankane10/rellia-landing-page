import type { ReactNode } from "react"
import { cmsDisplayText } from "@/lib/cmsStega"

type PtMarkDef = { _key?: string; _type?: string; href?: string }
type PtSpan = { _key?: string; text?: string; marks?: string[] }

export type PtBlock = {
  _key?: string
  _type?: string
  style?: string
  children?: PtSpan[]
  markDefs?: PtMarkDef[]
}

const applyPtMark = (
  node: ReactNode,
  mark: string,
  markDefs: PtMarkDef[] | undefined,
): ReactNode => {
  if (mark === "strong") {
    return <strong className="font-semibold text-inherit">{node}</strong>
  }
  if (mark === "em") {
    return <em className="italic">{node}</em>
  }
  if (mark === "mint") {
    return <span className="text-rellia-mint">{node}</span>
  }
  if (mark === "teal") {
    return <span className="text-rellia-teal">{node}</span>
  }

  const def = markDefs?.find((entry) => entry._key === mark)
  if (def?._type === "link" && def.href) {
    const href = def.href
    const isExternal = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        className="text-inherit font-semibold underline-offset-2 hover:underline"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {node}
      </a>
    )
  }

  return node
}

export const renderPtSpans = (
  children: PtSpan[] | undefined,
  markDefs: PtMarkDef[] | undefined,
): ReactNode => {
  return (children ?? []).map((child) => {
    const raw = child.text ?? ""
    if (!raw) return null

    let node: ReactNode = cmsDisplayText(raw)
    for (const mark of child.marks ?? []) {
      node = applyPtMark(node, mark, markDefs)
    }

    return (
      <span key={child._key ?? raw} className="inline">
        {node}
      </span>
    )
  })
}
