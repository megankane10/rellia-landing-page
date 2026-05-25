import {
  adminContentUrl,
  studioDeskUrl,
} from "../shared/admin/notifyLinks"

export type SlackBlockPayload = {
  blocks: Array<Record<string, unknown>>
}

const slackWebhookUrl = () => process.env.SLACK_WEBHOOK_URL?.trim() || ""

export const buildSlackBlocks = (
  heading: string,
  bodyLines: string[],
  buttons: Array<{ text: string; url: string; actionId: string }>,
): SlackBlockPayload => {
  const blocks: Array<Record<string, unknown>> = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: [heading, ...bodyLines].filter(Boolean).join("\n"),
      },
    },
  ]

  if (buttons.length > 0) {
    blocks.push({
      type: "actions",
      elements: buttons.map((button) => ({
        type: "button",
        text: { type: "plain_text", text: button.text, emoji: true },
        url: button.url,
        action_id: button.actionId,
      })),
    })
  }

  return { blocks }
}

export const postSlackBlocks = async (payload: SlackBlockPayload): Promise<boolean> => {
  const url = slackWebhookUrl()
  if (!url) {
    console.warn("postSlackBlocks: SLACK_WEBHOOK_URL is not set")
    return false
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => "")
    console.error("Slack webhook failed", response.status, errText.slice(0, 400))
    return false
  }

  return true
}

export type SanityDraftSlackDoc = {
  _id: string
  _type: string
  title?: string
}

const isDraftId = (id: string) => id.startsWith("drafts.")

const isSkippableSanityType = (type: string) =>
  type.startsWith("sanity.") || type === "system.schema"

export const notifySanityDraftToSlack = async (doc: SanityDraftSlackDoc): Promise<boolean> => {
  if (!isDraftId(doc._id) || isSkippableSanityType(doc._type)) return false

  const title = doc.title?.trim() || doc._type
  const studioUrl = studioDeskUrl(doc._type, doc._id)
  const dashboardUrl = adminContentUrl()

  const payload = buildSlackBlocks(
    ":pencil2: *New Sanity draft*",
    [
      `• Type: ${doc._type}`,
      `• Title: ${title}`,
      `• Document: \`${doc._id}\``,
    ],
    [
      { text: "View in Studio", url: studioUrl, actionId: "open_studio" },
      { text: "View in dashboard", url: dashboardUrl, actionId: "open_content_queue" },
    ],
  )

  return postSlackBlocks(payload)
}

export const extractSanityDraftDocs = (body: unknown): SanityDraftSlackDoc[] => {
  if (!body || typeof body !== "object") return []

  const record = body as Record<string, unknown>
  const results: SanityDraftSlackDoc[] = []

  const pushIfDraft = (candidate: unknown) => {
    if (!candidate || typeof candidate !== "object") return
    const row = candidate as Record<string, unknown>
    const id = typeof row._id === "string" ? row._id : ""
    const type = typeof row._type === "string" ? row._type : ""
    if (!id || !type || !isDraftId(id) || isSkippableSanityType(type)) return
    const title =
      typeof row.title === "string"
        ? row.title
        : typeof row.name === "string"
          ? row.name
          : typeof row.headline === "string"
            ? row.headline
            : undefined
    results.push({ _id: id, _type: type, title })
  }

  pushIfDraft(body)

  if (Array.isArray(record.documents)) {
    for (const doc of record.documents) pushIfDraft(doc)
  }

  if (Array.isArray(record.results)) {
    for (const doc of record.results) pushIfDraft(doc)
  }

  const seen = new Set<string>()
  return results.filter((row) => {
    if (seen.has(row._id)) return false
    seen.add(row._id)
    return true
  })
}
