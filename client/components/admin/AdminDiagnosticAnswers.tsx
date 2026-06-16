import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  formatDiagnosticRawAnswers,
  groupFormattedDiagnosticAnswers,
  type DiagnosticRawAnswers,
} from "@/lib/formatDiagnosticAnswers"
import { cn } from "@/lib/utils"

type AdminDiagnosticAnswersProps = {
  rawAnswers: DiagnosticRawAnswers | null
}

const scoreColor = (score: number) => {
  if (score >= 70) return "text-rellia-teal"
  if (score >= 40) return "text-amber-600"
  return "text-red-600"
}

const sectionAverageScore = (scores: number[]) => {
  if (scores.length === 0) return 0
  const sum = scores.reduce((acc, s) => acc + s, 0)
  return Math.round(sum / scores.length)
}

const AdminDiagnosticAnswers = ({ rawAnswers }: AdminDiagnosticAnswersProps) => {
  const formatted = formatDiagnosticRawAnswers(rawAnswers)
  const groups = groupFormattedDiagnosticAnswers(formatted)

  if (groups.length === 0) {
    return (
      <p className="font-urbanist text-sm text-muted-foreground">
        No per-question responses were saved for this submission.
      </p>
    )
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {groups.map((group) => {
        const avgScore = sectionAverageScore(group.items.map((item) => item.score))
        const questionLabel = `${group.items.length} question${group.items.length === 1 ? "" : "s"}`

        return (
          <AccordionItem
            key={group.sectionId}
            value={group.sectionId}
            className="overflow-hidden rounded-xl border border-border bg-rellia-cream/25 px-4 dark:border-rellia-mint/15 dark:bg-rellia-mint/5"
          >
            <AccordionTrigger className="gap-3 py-3 hover:no-underline [&>svg]:shrink-0">
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-left">
                <span className="font-host-grotesk text-sm font-semibold text-foreground">
                  {group.sectionTitle}
                </span>
                <span className="font-urbanist text-xs font-normal text-muted-foreground">
                  ({questionLabel})
                </span>
                <span className="font-urbanist text-xs text-muted-foreground/70" aria-hidden>
                  ·
                </span>
                <span
                  className={cn(
                    "font-host-grotesk text-sm font-bold tabular-nums",
                    scoreColor(avgScore),
                  )}
                >
                  {avgScore}%
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li
                    key={`${group.sectionId}-${item.questionIndex}`}
                    className="rounded-lg border border-border/60 bg-card px-3 py-3"
                  >
                    <p className="font-urbanist text-sm font-medium text-foreground">
                      <span className="text-muted-foreground">Q{item.questionIndex + 1}. </span>
                      {item.questionText}
                    </p>
                    <p className="mt-2 font-host-grotesk text-sm font-semibold text-rellia-teal dark:text-rellia-mint">
                      {item.selectedLabel}
                      <span className="ml-2 font-urbanist text-xs font-normal text-muted-foreground">
                        ({item.score}%)
                      </span>
                    </p>
                    {item.selectedDescription ? (
                      <p className="mt-1 font-urbanist text-sm text-muted-foreground">
                        {item.selectedDescription}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default AdminDiagnosticAnswers
