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

type AdminDiagnosticAnswersProps = {
  rawAnswers: DiagnosticRawAnswers | null
}

const AdminDiagnosticAnswers = ({ rawAnswers }: AdminDiagnosticAnswersProps) => {
  const formatted = formatDiagnosticRawAnswers(rawAnswers)
  const groups = groupFormattedDiagnosticAnswers(formatted)

  if (groups.length === 0) {
    return (
      <p className="font-urbanist text-sm text-black/60">
        No per-question responses were saved for this submission.
      </p>
    )
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {groups.map((group) => (
        <AccordionItem
          key={group.sectionId}
          value={group.sectionId}
          className="overflow-hidden rounded-xl border border-black/[0.06] bg-rellia-cream/25 px-4"
        >
          <AccordionTrigger className="py-3 font-host-grotesk text-sm font-semibold text-black hover:no-underline">
            {group.sectionTitle}
            <span className="ml-2 font-urbanist text-xs font-normal text-black/45">
              ({group.items.length} questions)
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <Accordion type="multiple" className="space-y-2">
              {group.items.map((item) => (
                <AccordionItem
                  key={`${group.sectionId}-${item.questionIndex}`}
                  value={`${group.sectionId}-${item.questionIndex}`}
                  className="rounded-lg border border-black/[0.05] bg-white px-3"
                >
                  <AccordionTrigger className="py-2.5 text-left font-urbanist text-sm font-medium text-black/80 hover:no-underline">
                    <span>
                      <span className="text-black/45">Q{item.questionIndex + 1}. </span>
                      {item.questionText}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <p className="font-host-grotesk text-sm font-semibold text-rellia-teal">
                      {item.selectedLabel}
                      <span className="ml-2 font-urbanist text-xs font-normal text-black/45">
                        ({item.score}%)
                      </span>
                    </p>
                    {item.selectedDescription ? (
                      <p className="mt-1 font-urbanist text-sm text-black/60">{item.selectedDescription}</p>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default AdminDiagnosticAnswers
