import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable"

export type AdminRecordField<T> = {
  label: string
  className?: string
  value: (row: T) => ReactNode
}

type AdminRecordListProps<T> = {
  rows: T[]
  getRowKey: (row: T) => string
  columns: AdminTableColumn<T>[]
  mobileFields: AdminRecordField<T>[]
  mobileActions?: (row: T) => ReactNode
  emptyMessage?: string
  className?: string
  tableClassName?: string
}

const AdminRecordList = <T,>({
  rows,
  getRowKey,
  columns,
  mobileFields,
  mobileActions,
  emptyMessage = "No items to show.",
  className,
  tableClassName,
}: AdminRecordListProps<T>) => {
  if (rows.length === 0) {
    return (
      <p className={cn("py-8 text-center font-urbanist text-sm text-muted-foreground", className)}>{emptyMessage}</p>
    )
  }

  return (
    <div className={className}>
      <ul className="space-y-3 md:hidden" aria-label="Records">
        {rows.map((row) => (
          <li
            key={getRowKey(row)}
            className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
          >
            <dl className="space-y-2.5">
              {mobileFields.map((field) => (
                <div key={field.label} className={field.className}>
                  <dt className="font-urbanist text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {field.label}
                  </dt>
                  <dd className="mt-0.5 font-urbanist text-sm text-foreground">{field.value(row)}</dd>
                </div>
              ))}
            </dl>
            {mobileActions ? <div className="mt-3 flex items-center justify-end gap-2">{mobileActions(row)}</div> : null}
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <AdminDataTable
          columns={columns}
          rows={rows}
          getRowKey={getRowKey}
          emptyMessage={emptyMessage}
          tableClassName={tableClassName}
        />
      </div>
    </div>
  )
}

export default AdminRecordList
