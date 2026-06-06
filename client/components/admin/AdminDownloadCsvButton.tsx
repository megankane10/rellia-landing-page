import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadCsv, type CsvColumn } from "@/lib/downloadCsv"
import { cn } from "@/lib/utils"

type AdminDownloadCsvButtonProps<T> = {
  filename: string
  rows: T[]
  columns: CsvColumn<T>[]
  label?: string
  disabled?: boolean
  className?: string
}

const AdminDownloadCsvButton = <T,>({
  filename,
  rows,
  columns,
  label = "Download CSV",
  disabled,
  className,
}: AdminDownloadCsvButtonProps<T>) => {
  const handleDownload = () => {
    downloadCsv(filename, rows, columns)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("rounded-full font-urbanist", className)}
      disabled={disabled || rows.length === 0}
      aria-label={label}
      onClick={handleDownload}
    >
      <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
      {label}
    </Button>
  )
}

export default AdminDownloadCsvButton
