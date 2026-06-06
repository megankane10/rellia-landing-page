import { Lock, ShieldCheck, Sparkles, Users } from "lucide-react"

export type DiagnosticReportPreviewProps = {
  topWeaknessLabel?: string
  topWeaknessScore?: number
  topWeaknessGapLabel?: string
  advisorMatchLabel?: string
  advisorRole?: string
  advisorSubtitle?: string
  blobRoadmap?: string
  blobAdvisors?: string
  blobBlindSpot?: string
}

const DEFAULTS = {
  topWeaknessLabel: "Regulatory Strategy",
  topWeaknessScore: 32,
  topWeaknessGapLabel: "Critical Gap",
  advisorMatchLabel: "Vetted Advisor Match",
  advisorRole: "Regulatory Director",
  advisorSubtitle: "Ex-FDA Reviewer",
  blobRoadmap: "Personalized Roadmap",
  blobAdvisors: "Matched Advisors",
  blobBlindSpot: "Blind Spot Discovery",
} as const

export default function DiagnosticReportPreview({
  topWeaknessLabel = DEFAULTS.topWeaknessLabel,
  topWeaknessScore = DEFAULTS.topWeaknessScore,
  topWeaknessGapLabel = DEFAULTS.topWeaknessGapLabel,
  advisorMatchLabel = DEFAULTS.advisorMatchLabel,
  advisorRole = DEFAULTS.advisorRole,
  advisorSubtitle = DEFAULTS.advisorSubtitle,
  blobRoadmap = DEFAULTS.blobRoadmap,
  blobAdvisors = DEFAULTS.blobAdvisors,
  blobBlindSpot = DEFAULTS.blobBlindSpot,
}: DiagnosticReportPreviewProps) {
  const scoreWidth = `${Math.min(100, Math.max(0, topWeaknessScore))}%`

  return (
    <div className="relative p-4">
      <div className="absolute -top-4 -left-3 z-20 flex items-center gap-2 rounded-full border border-rellia-teal/15 bg-white/95 px-4 py-2 text-[11px] font-bold text-rellia-teal shadow-[0_12px_36px_-6px_rgba(13,53,64,0.18)] backdrop-blur-md sm:-left-6">
        <Sparkles className="h-3.5 w-3.5 text-rellia-mint" aria-hidden />
        {blobRoadmap}
      </div>

      <div className="absolute top-[35%] -right-4 z-20 flex items-center gap-2 rounded-full border border-rellia-teal/15 bg-rellia-teal px-4 py-2 text-[11px] font-bold text-white shadow-[0_12px_36px_-6px_rgba(13,53,64,0.25)] sm:-right-8">
        <Users className="h-3.5 w-3.5 text-rellia-mint" aria-hidden />
        {blobAdvisors}
      </div>

      <div className="absolute -bottom-4 left-8 z-20 flex items-center gap-2 rounded-full border border-black/5 bg-[#fbfcf8]/95 px-4 py-2 text-[11px] font-bold text-black/75 shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <ShieldCheck className="h-3.5 w-3.5 text-green-600" aria-hidden />
        {blobBlindSpot}
      </div>

      <div className="pointer-events-none absolute -inset-4 rounded-[40px] bg-rellia-teal/5 blur-2xl" />
      <div className="relative z-10 rounded-[40px] border border-black/10 bg-white p-8 shadow-lg md:p-10">
        <div className="space-y-5">
          <div className="flex flex-col justify-center rounded-2xl border border-black/5 bg-[#fafafa] p-5">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-black/75">{topWeaknessLabel}</span>
              <span className="text-xs font-black uppercase tracking-wider text-red-600">
                {topWeaknessScore}% ({topWeaknessGapLabel})
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
              <div className="h-full bg-red-600" style={{ width: scoreWidth }} />
            </div>
          </div>

          <div className="border-t border-black/5 pt-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-black/45">
              {advisorMatchLabel}
            </span>
            <div className="mt-3 flex items-center justify-between gap-4 rounded-2xl border border-rellia-teal/5 bg-rellia-teal/[0.02] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 overflow-hidden rounded-full border border-black/10 bg-black/5">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt=""
                    className="h-full w-full scale-110 object-cover blur-sm"
                  />
                </div>
                <div className="min-w-0">
                  <div className="select-none text-xs font-bold text-black/75 blur-[2.5px]">{advisorRole}</div>
                  <div className="text-[10px] text-black/45">{advisorSubtitle}</div>
                </div>
              </div>
              <Lock className="h-4 w-4 text-rellia-teal/40" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
