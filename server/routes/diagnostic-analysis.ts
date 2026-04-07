import type { RequestHandler } from "express"
import { Resend } from "resend"
import { z } from "zod"

const sectionSchema = z.object({
  title: z.string().max(120),
  score: z.number().int().min(0).max(100),
})

const bodySchema = z.object({
  company: z.string().trim().min(1).max(200),
  stage: z.string().trim().min(1).max(80),
  desc: z.string().trim().min(1).max(2000),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320).optional(),
  sections: z.array(sectionSchema).min(1).max(30),
})

type DiagnosticBody = z.infer<typeof bodySchema>

const aiStrengthSchema = z.object({
  category: z.string().trim().min(1).max(120),
  score: z.number().int().min(0).max(100),
  note: z.string().trim().min(1).max(1000),
})

const aiWeaknessSchema = aiStrengthSchema.extend({
  priority: z.string().trim().min(1).max(40),
})

const aiResultSchema = z.object({
  summary: z.string().trim().min(1).max(2000),
  top3_strengths: z.array(aiStrengthSchema).length(3),
  top3_weaknesses: z.array(aiWeaknessSchema).length(3),
  recommendations: z.array(z.string().trim().min(1).max(500)).min(1).max(10),
  mentor_areas_needed: z.array(z.string().trim().min(1).max(200)).min(1).max(10),
})

type AIResult = z.infer<typeof aiResultSchema>

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const buildPrompt = (body: DiagnosticBody): string => {
  const summaryLines = body.sections.map((s) => `- ${s.title}: ${s.score}%`).join("\n")
  return (
    `You are a health tech startup advisor at Rellia Health. Analyze this startup diagnostic and return ONLY valid JSON (no markdown, no backticks).\n` +
    `Company: ${body.company}\n` +
    `Stage: ${body.stage}\n` +
    `Product: ${body.desc}\n` +
    `Section scores:\n${summaryLines}\n` +
    `Return: {"summary":"2-3 sentences to founder in second person","top3_strengths":[{"category":"","score":0,"note":""}],"top3_weaknesses":[{"category":"","score":0,"note":"","priority":"Critical"}],"recommendations":[""],"mentor_areas_needed":[""]}`
  )
}

const buildEmailHTML = (analysis: AIResult, body: DiagnosticBody): string => {
  const scoreRows = body.sections
    .map(
      (s) =>
        `<tr><td style="padding:4px 8px;font-size:13px;color:#5a6a6e;">${escapeHtml(s.title)}</td>` +
        `<td style="padding:4px 8px;font-size:13px;font-weight:500;color:#0c3d49;">${s.score}%</td></tr>`
    )
    .join("")

  return `<div style="font-family:sans-serif;max-width:680px;margin:0 auto;">
    <div style="background:#0c3d49;padding:2rem;border-radius:16px 16px 0 0;">
      <p style="color:#a7dbd6;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 4px;">Rellia Health — Startup Diagnostic</p>
      <h1 style="color:white;font-size:1.6rem;margin:0 0 4px;">${escapeHtml(body.company)}</h1>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">${escapeHtml(body.stage)} · ${new Date().toLocaleDateString("en-CA")}</p>
    </div>
    <div style="background:white;padding:2rem;">
      <h2 style="color:#0c3d49;font-size:1rem;margin:0 0 8px;">Summary</h2>
      <p style="font-size:14px;color:#3a4a4e;line-height:1.65;">${escapeHtml(analysis.summary)}</p>
      <h2 style="color:#0c3d49;font-size:1rem;margin:1.5rem 0 8px;">Section Scores</h2>
      <table style="width:100%;border-collapse:collapse;">${scoreRows}</table>
      <h2 style="color:#0c3d49;font-size:1rem;margin:1.5rem 0 8px;">Priority Gaps</h2>
      ${analysis.top3_weaknesses.map((w) => `<p style="font-size:14px;margin:5px 0;"><strong style="color:#a32d2d;">${escapeHtml(w.priority)}</strong> — <strong>${escapeHtml(w.category)}</strong> (${w.score}%): ${escapeHtml(w.note)}</p>`).join("")}
      <h2 style="color:#0c3d49;font-size:1rem;margin:1.5rem 0 8px;">Recommendations</h2>
      ${analysis.recommendations.map((r, i) => `<p style="font-size:14px;margin:4px 0;"><strong>${i + 1}.</strong> ${escapeHtml(r)}</p>`).join("")}
    </div>
    <div style="background:#f8f1e8;padding:1rem 2rem;border-radius:0 0 16px 16px;">
      <p style="font-size:12px;color:#8a9ea2;margin:0;">Rellia Health Startup Diagnostic · hello@relliahealth.com</p>
    </div>
  </div>`
}

const sendDiagnosticEmails = async (analysis: AIResult, body: DiagnosticBody): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const to = process.env.CONTACT_TO_EMAIL?.trim()
  if (!apiKey || !to) return

  const from = process.env.RESEND_FROM_EMAIL?.trim() ?? "Rellia Health <onboarding@resend.dev>"
  const resend = new Resend(apiKey)
  const html = buildEmailHTML(analysis, body)
  const dateStr = new Date().toLocaleDateString("en-CA")

  await resend.emails.send({
    from,
    to: [to],
    subject: `[Diagnostic] ${body.company} — ${dateStr}`,
    html,
  })

  if (body.email) {
    await resend.emails.send({
      from,
      to: [body.email],
      subject: `Your Rellia Startup Diagnostic — ${body.company}`,
      html,
    })
  }
}

export const handleDiagnosticAnalysis: RequestHandler = async (req, res) => {
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: "Invalid request data" })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
  if (!apiKey) {
    res.status(503).json({ ok: false, error: "AI analysis not configured" })
    return
  }

  const body = parsed.data

  let aiResult: AIResult
  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages: [{ role: "user", content: buildPrompt(body) }],
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      console.error("[api/diagnostic-analysis] Anthropic error:", anthropicRes.status, errText.slice(0, 200))
      res.status(502).json({ ok: false, error: "AI analysis failed" })
      return
    }

    const data = (await anthropicRes.json()) as { content: { text?: string }[] }
    const text = data.content.map((b) => b.text ?? "").join("")
    const rawResult = JSON.parse(text.replace(/```json|```/g, "").trim())
    const parsedAiResult = aiResultSchema.safeParse(rawResult)

    if (!parsedAiResult.success) {
      console.error(
        "[api/diagnostic-analysis] Invalid AI response shape:",
        parsedAiResult.error.flatten()
      )
      res.status(502).json({ ok: false, error: "AI analysis returned an invalid response" })
      return
    }

    aiResult = parsedAiResult.data
  } catch (err) {
    console.error("[api/diagnostic-analysis] Failed:", err instanceof Error ? err.message : String(err))
    res.status(500).json({ ok: false, error: "AI analysis failed" })
    return
  }

  // Send emails — non-fatal if it fails
  try {
    await sendDiagnosticEmails(aiResult, body)
  } catch (err) {
    console.error("[api/diagnostic-analysis] Email send failed:", err instanceof Error ? err.message : String(err))
  }

  res.status(200).json({ ok: true, result: aiResult })
}
