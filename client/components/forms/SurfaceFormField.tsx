import type { ReactNode } from "react"

export type SurfaceFormFieldProps = {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  children: ReactNode
}

export const SurfaceFormField = ({
  label,
  htmlFor,
  required,
  error,
  children,
}: SurfaceFormFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={htmlFor} className="font-urbanist text-sm font-semibold text-black/80">
        {label}
        {required ? <span className="text-rellia-teal"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="font-urbanist text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
