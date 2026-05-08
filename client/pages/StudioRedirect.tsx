import { useEffect } from "react"

const StudioRedirect = () => {
  useEffect(() => {
    window.location.assign("/api/studio")
  }, [])

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-6">
      <div className="w-full">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-zinc-900">
          Redirecting to Studio…
        </h1>
        <p className="mt-2 text-pretty text-sm leading-6 text-zinc-600">
          If nothing happens,{" "}
          <a
            href="/api/studio"
            className="font-medium text-zinc-900 underline underline-offset-4"
          >
            open Studio
          </a>
          .
        </p>
      </div>
    </main>
  )
}

export default StudioRedirect

