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
      <p className="font-urbanist text-sm text-black/60">No per-question responses were saved for this submission.</p>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.sectionId} className="space-y-3">
          <h3 className="font-host-grotesk text-base font-semibold text-black">{group.sectionTitle}</h3>
          <ol className="space-y-3">
            {group.items.map((item) => (
              <li
                key={`${group.sectionId}-${item.questionIndex}`}
                className="rounded-xl border border-black/[0.06] bg-rellia-cream/35 px-4 py-3"
              >
                <p className="font-urbanist text-sm font-medium text-black/80">
                  <span className="text-black/45">Q{item.questionIndex + 1}. </span>
                  {item.questionText}
                </p>
                <p className="mt-2 font-host-grotesk text-sm font-semibold text-rellia-teal">
                  {item.selectedLabel}
                  <span className="ml-2 font-urbanist text-xs font-normal text-black/45">
                    ({item.score}%)
                  </span>
                </p>
                {item.selectedDescription ? (
                  <p className="mt-1 font-urbanist text-sm text-black/60">{item.selectedDescription}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

export default AdminDiagnosticAnswers
