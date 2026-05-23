import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type AdminTableColumn<T> = {
  key: string
  header: string
  className?: string
  cell: (row: T) => ReactNode
}

type AdminDataTableProps<T> = {
  columns: AdminTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  emptyMessage?: string
  className?: string
}

const AdminDataTable = <T,>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "No items to show.",
  className,
}: AdminDataTableProps<T>) => {
  if (rows.length === 0) {
    return (
      <p className={cn("py-6 text-center font-urbanist text-sm text-black/50", className)}>{emptyMessage}</p>
    )
  }

  return (
    <div className={cn("-mx-5 overflow-x-auto md:-mx-6", className)}>
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="border-b border-black/[0.06] bg-black/[0.02]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-5 py-2.5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.12em] text-black/45 first:pl-5 last:pr-5 md:px-6",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className="border-b border-black/[0.04] transition-colors last:border-0 hover:bg-rellia-mint/[0.06]"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-5 py-3 align-middle font-urbanist text-sm text-black/80 first:pl-5 last:pr-5 md:px-6",
                    col.className,
                  )}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDataTable
