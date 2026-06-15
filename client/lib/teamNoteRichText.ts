import type { ReactNode } from "react"
import { createElement, Fragment } from "react"

export type TeamNoteEditResult = {
  value: string
  selectionStart: number
  selectionEnd: number
}

const BULLET_PREFIX = /^[-*]\s+/

const parseInlineBold = (line: string, keyPrefix: string): ReactNode[] => {
  const parts = line.split(/(\*\*[^*]+\*\*)/g)
  return parts
    .filter((part) => part.length > 0)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return createElement("strong", { key: `${keyPrefix}-b-${index}` }, part.slice(2, -2))
      }
      return createElement(Fragment, { key: `${keyPrefix}-t-${index}` }, part)
    })
}

export const renderTeamNoteRichText = (text: string): ReactNode => {
  const lines = text.split("\n")
  const nodes: ReactNode[] = []
  let listItems: string[] = []

  const flushList = (listKey: string) => {
    if (listItems.length === 0) return
    nodes.push(
      createElement(
        "ul",
        { key: listKey, className: "list-disc space-y-1 pl-5" },
        listItems.map((item, itemIndex) =>
          createElement(
            "li",
            { key: `${listKey}-li-${itemIndex}`, className: "leading-relaxed" },
            parseInlineBold(item, `${listKey}-li-${itemIndex}`),
          ),
        ),
      ),
    )
    listItems = []
  }

  lines.forEach((line, lineIndex) => {
    const bulletMatch = line.match(/^[-*]\s+(.*)$/)
    if (bulletMatch) {
      listItems.push(bulletMatch[1] ?? "")
      return
    }

    flushList(`list-${lineIndex}`)

    if (!line.trim()) {
      nodes.push(createElement("br", { key: `br-${lineIndex}` }))
      return
    }

    nodes.push(
      createElement(
        "p",
        { key: `p-${lineIndex}`, className: "leading-relaxed" },
        parseInlineBold(line, `p-${lineIndex}`),
      ),
    )
  })

  flushList("list-end")
  return createElement(Fragment, null, ...nodes)
}

export const getLineRange = (value: string, position: number) => {
  const lineStart = value.lastIndexOf("\n", Math.max(0, position - 1)) + 1
  const nextNewline = value.indexOf("\n", position)
  const lineEnd = nextNewline === -1 ? value.length : nextNewline
  return { lineStart, lineEnd, line: value.slice(lineStart, lineEnd) }
}

export const getAffectedLineRanges = (value: string, start: number, end: number) => {
  const anchor = end > start ? end - 1 : start
  const first = getLineRange(value, start)
  const last = getLineRange(value, anchor)
  const ranges = []
  let cursor = first.lineStart

  while (cursor <= last.lineStart && cursor < value.length) {
    const range = getLineRange(value, cursor)
    ranges.push(range)
    if (range.lineEnd >= value.length) break
    cursor = range.lineEnd + 1
  }

  return ranges
}

export const isPositionInsideBold = (value: string, position: number) => {
  const markerCount = (value.slice(0, position).match(/\*\*/g) ?? []).length
  return markerCount % 2 === 1
}

export const isRangeInsideBold = (value: string, start: number, end: number) => {
  if (start === end) return isPositionInsideBold(value, start)

  for (let index = start; index < end; index += 1) {
    if (!isPositionInsideBold(value, index)) return false
  }

  return true
}

export const isTeamNoteBoldActive = (value: string, start: number, end: number) =>
  isRangeInsideBold(value, start, end)

export const isTeamNoteBulletActive = (value: string, start: number, end: number) => {
  const ranges = getAffectedLineRanges(value, start, end)
  const nonEmpty = ranges.filter((range) => range.line.trim().length > 0)
  if (nonEmpty.length === 0) return false
  return nonEmpty.every((range) => BULLET_PREFIX.test(range.line))
}

const getWordExtents = (value: string, position: number) => {
  let start = position
  let end = position

  while (start > 0 && /[^\s\n]/.test(value[start - 1] ?? "")) start -= 1
  while (end < value.length && /[^\s\n]/.test(value[end] ?? "")) end += 1

  return { start, end, empty: start === end }
}

const findBoldSpanAt = (value: string, position: number) => {
  if (!isPositionInsideBold(value, position)) return null

  let open = position
  while (open > 0) {
    if (value.slice(open - 2, open) === "**") {
      open -= 2
      break
    }
    open -= 1
  }

  let close = position
  while (close < value.length) {
    if (value.slice(close, close + 2) === "**") {
      close += 2
      break
    }
    close += 1
  }

  if (value.slice(open, open + 2) !== "**" || value.slice(close - 2, close) !== "**") {
    return null
  }

  return { open, close, inner: value.slice(open + 2, close - 2) }
}

const unwrapBoldSpan = (
  value: string,
  open: number,
  close: number,
  selectionStart: number,
  selectionEnd: number,
): TeamNoteEditResult => {
  const inner = value.slice(open + 2, close - 2)
  const nextValue = `${value.slice(0, open)}${inner}${value.slice(close)}`
  const offset = open
  const nextStart = Math.max(offset, selectionStart - 2)
  const nextEnd = Math.max(nextStart, selectionEnd - 2)
  return {
    value: nextValue,
    selectionStart: Math.min(nextStart, offset + inner.length),
    selectionEnd: Math.min(nextEnd, offset + inner.length),
  }
}

export const applyTeamNoteBold = (
  value: string,
  selectionStart: number,
  selectionEnd: number,
): TeamNoteEditResult => {
  const isActive = isTeamNoteBoldActive(value, selectionStart, selectionEnd)

  if (selectionStart === selectionEnd) {
    if (isActive) {
      const span = findBoldSpanAt(value, selectionStart)
      if (span) {
        return unwrapBoldSpan(value, span.open, span.close, selectionStart, selectionEnd)
      }
    }

    const word = getWordExtents(value, selectionStart)
    const targetStart = word.empty ? selectionStart : word.start
    const targetEnd = word.empty ? selectionStart : word.end
    const selected = word.empty ? "bold text" : value.slice(targetStart, targetEnd).replace(/\*\*/g, "")
    const nextValue = `${value.slice(0, targetStart)}**${selected}**${value.slice(targetEnd)}`
    const nextStart = targetStart + 2
    const nextEnd = nextStart + selected.length
    return { value: nextValue, selectionStart: nextStart, selectionEnd: nextEnd }
  }

  if (isActive) {
    const span = findBoldSpanAt(value, selectionStart)
    if (span) {
      return unwrapBoldSpan(value, span.open, span.close, selectionStart, selectionEnd)
    }

    let open = selectionStart
    let close = selectionEnd

    if (value.slice(open - 2, open) === "**") open -= 2
    if (value.slice(close, close + 2) === "**") close += 2

    const selected = value.slice(selectionStart, selectionEnd)
    if (selected.startsWith("**") && selected.endsWith("**") && selected.length > 4) {
      const inner = selected.slice(2, -2)
      const nextValue = `${value.slice(0, selectionStart)}${inner}${value.slice(selectionEnd)}`
      return {
        value: nextValue,
        selectionStart,
        selectionEnd: selectionStart + inner.length,
      }
    }

    if (value.slice(open, open + 2) === "**" && value.slice(close - 2, close) === "**") {
      return unwrapBoldSpan(value, open, close, selectionStart, selectionEnd)
    }
  }

  const selected = value.slice(selectionStart, selectionEnd).replace(/\*\*/g, "")
  const nextValue = `${value.slice(0, selectionStart)}**${selected}**${value.slice(selectionEnd)}`
  const nextStart = selectionStart + 2
  const nextEnd = nextStart + selected.length
  return { value: nextValue, selectionStart: nextStart, selectionEnd: nextEnd }
}

export const applyTeamNoteBullet = (
  value: string,
  selectionStart: number,
  selectionEnd: number,
): TeamNoteEditResult => {
  const isActive = isTeamNoteBulletActive(value, selectionStart, selectionEnd)

  if (selectionStart === selectionEnd) {
    const { lineStart, lineEnd, line } = getLineRange(value, selectionStart)

    if (isActive || BULLET_PREFIX.test(line)) {
      const stripped = line.replace(BULLET_PREFIX, "")
      const removed = line.length - stripped.length
      const nextValue = `${value.slice(0, lineStart)}${stripped}${value.slice(lineEnd)}`
      const nextPos = Math.max(lineStart, selectionStart - removed)
      return { value: nextValue, selectionStart: nextPos, selectionEnd: nextPos }
    }

    const nextValue = `${value.slice(0, lineStart)}- ${value.slice(lineStart)}`
    const nextPos = selectionStart + 2
    return { value: nextValue, selectionStart: nextPos, selectionEnd: nextPos }
  }

  const ranges = getAffectedLineRanges(value, selectionStart, selectionEnd)
  const blockStart = ranges[0]?.lineStart ?? selectionStart
  const blockEnd = ranges[ranges.length - 1]?.lineEnd ?? selectionEnd
  const block = value.slice(blockStart, blockEnd)

  const nextBlock = block
    .split("\n")
    .map((line) => {
      if (!line.trim()) return line
      if (isActive) return line.replace(BULLET_PREFIX, "")
      return BULLET_PREFIX.test(line) ? line : `- ${line}`
    })
    .join("\n")

  const nextValue = `${value.slice(0, blockStart)}${nextBlock}${value.slice(blockEnd)}`
  return {
    value: nextValue,
    selectionStart: blockStart,
    selectionEnd: blockStart + nextBlock.length,
  }
}
