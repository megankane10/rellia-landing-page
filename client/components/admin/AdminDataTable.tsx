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
      <p className={cn("py-6 text-center font-urbanist text-sm text-slate-500", className)}>{emptyMessage}</p>
    )
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-5 py-3 font-urbanist text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 first:pl-5 last:pr-5",
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
              className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-5 py-3.5 align-middle font-urbanist text-sm text-slate-800 first:pl-5 last:pr-5",
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
