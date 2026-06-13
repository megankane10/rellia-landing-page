import {
  DIAGNOSTIC_SURVEY_SECTIONS,
  type DiagnosticSurveyOption,
  type DiagnosticSurveyQuestion,
  type DiagnosticSurveySection,
} from "@/data/diagnosticSurveySections"
import type { DiagnosticSurveyContent } from "@shared/cms/types"
import { cmsCleanText } from "@/lib/cmsStega"

const clean = (value: string | undefined, fallback: string) => {
  const next = cmsCleanText(value)
  return next || fallback
}

/** Overlay CMS copy onto code defaults; scoring structure stays aligned by section id + question index. */
export const mergeDiagnosticSurveySections = (
  cms: DiagnosticSurveyContent | null | undefined,
): DiagnosticSurveySection[] => {
  const cmsSections = cms?.sections
  if (!cmsSections?.length) return DIAGNOSTIC_SURVEY_SECTIONS

  return DIAGNOSTIC_SURVEY_SECTIONS.map((defaults) => {
    const fromCms = cmsSections.find((section) => section.id === defaults.id)
    if (!fromCms) return defaults

    const questions: DiagnosticSurveyQuestion[] = defaults.questions.map((dq, qi) => {
      const cq = fromCms.questions?.[qi]
      if (!cq) return dq

      const options: DiagnosticSurveyOption[] = dq.options.map((dopt, oi) => {
        const copt = cq.options?.[oi]
        if (!copt) return dopt
        return {
          label: clean(copt.label, dopt.label),
          desc: clean(copt.desc, dopt.desc),
          score: typeof copt.score === "number" ? copt.score : dopt.score,
        }
      })

      return {
        text: clean(cq.text, dq.text),
        type: (cq.type as DiagnosticSurveyQuestion["type"]) || dq.type,
        options,
      }
    })

    return {
      id: defaults.id,
      icon: clean(fromCms.icon, defaults.icon),
      title: clean(fromCms.title, defaults.title),
      desc: clean(fromCms.desc, defaults.desc),
      questions,
    }
  })
}

export const formatPromoMessage = (template: string, code: string) =>
  template.replace(/\{code\}/g, code)
