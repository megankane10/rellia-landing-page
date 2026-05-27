import {
  DIAGNOSTIC_SURVEY_SECTIONS,
  type DiagnosticSurveyOption,
  type DiagnosticSurveyQuestion,
  type DiagnosticSurveySection,
} from "@/data/diagnosticSurveySections"
import type { DiagnosticSurveyContent } from "@shared/cms/types"

/** Overlay CMS copy onto code defaults; scoring structure stays aligned by section id + question index. */
export const mergeDiagnosticSurveySections = (
  cms: DiagnosticSurveyContent | null | undefined,
): DiagnosticSurveySection[] => {
  const cmsSections = cms?.sections
  if (!cmsSections?.length) return DIAGNOSTIC_SURVEY_SECTIONS

  return DIAGNOSTIC_SURVEY_SECTIONS.map((defaults) => {
    const fromCms = cmsSections.find((s) => s.id === defaults.id)
    if (!fromCms) return defaults

    const questions: DiagnosticSurveyQuestion[] = defaults.questions.map((dq, qi) => {
      const cq = fromCms.questions?.[qi]
      if (!cq) return dq

      const options: DiagnosticSurveyOption[] = dq.options.map((dopt, oi) => {
        const copt = cq.options?.[oi]
        if (!copt) return dopt
        return {
          label: copt.label?.trim() ? copt.label : dopt.label,
          desc: copt.desc?.trim() ? copt.desc : dopt.desc,
          score: typeof copt.score === "number" ? copt.score : dopt.score,
        }
      })

      return {
        text: cq.text?.trim() ? cq.text : dq.text,
        type: (cq.type as DiagnosticSurveyQuestion["type"]) || dq.type,
        options,
      }
    })

    return {
      id: defaults.id,
      icon: fromCms.icon?.trim() ? fromCms.icon : defaults.icon,
      title: fromCms.title?.trim() ? fromCms.title : defaults.title,
      desc: fromCms.desc?.trim() ? fromCms.desc : defaults.desc,
      questions,
    }
  })
}

export const formatPromoMessage = (template: string, code: string) =>
  template.replace(/\{code\}/g, code)
