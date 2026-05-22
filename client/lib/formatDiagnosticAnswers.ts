import { DIAGNOSTIC_SURVEY_SECTIONS } from "@/data/diagnosticSurveySections"

export type DiagnosticRawAnswers = Record<string, Record<string, number>>

export type FormattedDiagnosticAnswer = {
  sectionId: string
  sectionTitle: string
  questionIndex: number
  questionText: string
  score: number
  selectedLabel: string
  selectedDescription: string | null
}

const findOptionForScore = (
  options: { label: string; desc: string; score: number }[],
  score: number,
) => {
  const exact = options.find((opt) => opt.score === score)
  if (exact) return exact
  const closest = [...options].sort(
    (a, b) => Math.abs(a.score - score) - Math.abs(b.score - score),
  )[0]
  return closest ?? null
}

export const formatDiagnosticRawAnswers = (
  rawAnswers: DiagnosticRawAnswers | null | undefined,
): FormattedDiagnosticAnswer[] => {
  if (!rawAnswers) return []

  const formatted: FormattedDiagnosticAnswer[] = []

  for (const section of DIAGNOSTIC_SURVEY_SECTIONS) {
    const sectionAnswers = rawAnswers[section.id]
    if (!sectionAnswers) continue

    Object.entries(sectionAnswers).forEach(([questionIndex, score]) => {
      const qIdx = Number(questionIndex)
      const question = section.questions[qIdx]
      if (!question) return

      const option = findOptionForScore(question.options, score)

      formatted.push({
        sectionId: section.id,
        sectionTitle: section.title,
        questionIndex: qIdx,
        questionText: question.text,
        score,
        selectedLabel: option?.label ?? `Score ${score}`,
        selectedDescription: option?.desc ?? null,
      })
    })
  }

  return formatted
}

export const groupFormattedDiagnosticAnswers = (
  answers: FormattedDiagnosticAnswer[],
): { sectionId: string; sectionTitle: string; items: FormattedDiagnosticAnswer[] }[] => {
  const bySection = new Map<string, { sectionTitle: string; items: FormattedDiagnosticAnswer[] }>()

  for (const answer of answers) {
    const existing = bySection.get(answer.sectionId)
    if (existing) {
      existing.items.push(answer)
      continue
    }
    bySection.set(answer.sectionId, {
      sectionTitle: answer.sectionTitle,
      items: [answer],
    })
  }

  return DIAGNOSTIC_SURVEY_SECTIONS.filter((section) => bySection.has(section.id)).map((section) => ({
    sectionId: section.id,
    sectionTitle: section.title,
    items: bySection.get(section.id)!.items.sort((a, b) => a.questionIndex - b.questionIndex),
  }))
}
