import type { ReactNode } from "react"
import {
  adminMutedTextClass,
  adminTableBodyCellClass,
  adminTableHeaderCellClass,
} from "@/components/admin/adminThemeClasses"
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
  tableClassName?: string
}

const AdminDataTable = <T,>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "No items to show.",
  className,
  tableClassName,
}: AdminDataTableProps<T>) => {
  if (rows.length === 0) {
    return (
      <p className={cn("py-6 text-center font-urbanist text-sm", adminMutedTextClass, className)}>
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className={cn("w-full min-w-[32rem] border-collapse text-left", tableClassName)}>
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(adminTableHeaderCellClass, col.className)}
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
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(adminTableBodyCellClass, col.className)}
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
