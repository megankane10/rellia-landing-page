import { cn } from "@/lib/utils"
import { cmsDisplayText, cmsHasDisplayText } from "@/lib/cmsStega"

export type RichTextTableRow = {
  cells?: string[] | null
}

export type RichTextTableProps = {
  caption?: string | null
  hasHeaderRow?: boolean
  /** 1-based column index to emphasize (leftmost = 1). */
  highlightedColumn?: number | null
  /** 1-based row index to emphasize (top row = 1). */
  highlightedRow?: number | null
  rows?: RichTextTableRow[] | null
  className?: string
}

const FIRST_COL_BG_CLASS = "bg-rellia-cream/35"

const FIRST_COL_STICKY_CLASS =
  "max-md:sticky max-md:left-0 max-md:z-[2] max-md:shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)]"

const FIRST_COL_TEXT_CLASS = "font-host-grotesk font-semibold text-black"

const headerCellClass = (
  colIndex: number,
  highlightedColumn?: number | null,
  isHighlightedRow?: boolean,
) =>
  cn(
    "px-4 py-3 font-host-grotesk text-sm font-semibold text-black",
    colIndex === 0 && cn(FIRST_COL_BG_CLASS, FIRST_COL_STICKY_CLASS, FIRST_COL_TEXT_CLASS),
    highlightedColumn === colIndex + 1 &&
      "bg-rellia-mint/45 text-rellia-teal max-md:bg-rellia-mint/50",
    isHighlightedRow && highlightedColumn !== colIndex + 1 && "bg-rellia-mint/20",
  )

const bodyCellClass = (
  colIndex: number,
  highlightedColumn?: number | null,
  isHighlightedRow?: boolean,
) =>
  cn(
    "px-4 py-3 align-top font-urbanist text-sm leading-relaxed text-black/75",
    highlightedColumn === colIndex + 1 &&
      "bg-rellia-mint/25 font-medium text-black/90 max-md:bg-rellia-mint/30",
    isHighlightedRow && highlightedColumn !== colIndex + 1 && "bg-rellia-mint/12",
    colIndex === 0 &&
      highlightedColumn !== colIndex + 1 &&
      cn(FIRST_COL_BG_CLASS, FIRST_COL_STICKY_CLASS, FIRST_COL_TEXT_CLASS),
  )

export const RichTextTable = ({
  caption,
  hasHeaderRow = true,
  highlightedColumn,
  highlightedRow,
  rows,
  className,
}: RichTextTableProps) => {
  const normalizedRows = (rows ?? [])
    .map((row) =>
      (Array.isArray(row?.cells) ? row.cells : [])
        .map((cell) => (typeof cell === "string" ? cell.trim() : ""))
        .filter(Boolean),
    )
    .filter((cells) => cells.length > 0)

  if (normalizedRows.length === 0) return null

  const headerCells = hasHeaderRow ? normalizedRows[0] : null
  const bodyRows = hasHeaderRow ? normalizedRows.slice(1) : normalizedRows
  const columnCount = Math.max(
    headerCells?.length ?? 0,
    ...bodyRows.map((row) => row.length),
  )

  if (columnCount === 0) return null

  const padRow = (cells: string[]) => {
    const next = [...cells]
    while (next.length < columnCount) next.push("")
    return next
  }

  const isRowHighlighted = (tableRowIndex: number) =>
    typeof highlightedRow === "number" &&
    highlightedRow > 0 &&
    highlightedRow === tableRowIndex + 1

  return (
    <figure className={cn("my-10 md:my-12 [&:first-child]:mt-0", className)}>
      <div
        className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-sm [-webkit-overflow-scrolling:touch]"
        tabIndex={0}
        role="region"
        aria-label={cmsHasDisplayText(caption) ? cmsDisplayText(caption) : "Data table"}
      >
        <table className="w-full min-w-[32rem] border-collapse text-left">
          {headerCells ? (
            <thead>
              <tr className="border-b border-black/10 bg-rellia-cream/35">
                {padRow(headerCells).map((cell, index) => (
                  <th
                    key={`header-${index}`}
                    scope="col"
                    className={headerCellClass(
                      index,
                      highlightedColumn,
                      isRowHighlighted(0),
                    )}
                  >
                    {cmsDisplayText(cell)}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {bodyRows.map((cells, rowIndex) => {
              const tableRowIndex = hasHeaderRow ? rowIndex + 1 : rowIndex
              const rowHighlighted = isRowHighlighted(tableRowIndex)

              return (
                <tr
                  key={`row-${rowIndex}`}
                  className={cn(
                    "border-b border-black/5 last:border-0",
                    rowHighlighted && "bg-rellia-mint/10",
                  )}
                >
                  {padRow(cells).map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className={bodyCellClass(cellIndex, highlightedColumn, rowHighlighted)}
                    >
                      {cell ? cmsDisplayText(cell) : "\u00A0"}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {cmsHasDisplayText(caption) ? (
        <figcaption className="mt-3 font-urbanist text-sm text-black/55">
          {cmsDisplayText(caption)}
        </figcaption>
      ) : null}
    </figure>
  )
}
