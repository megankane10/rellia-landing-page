export type CsvColumn<T> = {
  header: string
  value: (row: T) => string | number | null | undefined
}

const escapeCsvCell = (raw: string): string => {
  const val = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  if (/[",\n]/.test(val)) return `"${val.replace(/"/g, '""')}"`
  return val
}

export const downloadCsv = <T,>(filename: string, rows: T[], columns: CsvColumn<T>[]): void => {
  if (rows.length === 0) return

  const headerLine = columns.map((column) => escapeCsvCell(column.header)).join(",")
  const bodyLines = rows.map((row) =>
    columns.map((column) => escapeCsvCell(String(column.value(row) ?? ""))).join(","),
  )
  const csv = [headerLine, ...bodyLines].join("\n")
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  anchor.rel = "noopener"
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
