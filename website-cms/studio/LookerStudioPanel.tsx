const embedUrl = (process.env.SANITY_STUDIO_LOOKER_EMBED_URL || '').trim()

const panelStyle: Record<string, string | number> = {
  padding: '1.5rem',
  maxWidth: 560,
}

const iframeWrapStyle: Record<string, string | number> = {
  height: 'calc(100vh - 120px)',
  minHeight: 480,
}

export const LookerStudioPanel = () => {
  if (!embedUrl) {
    return (
      <div style={panelStyle}>
        <p style={{fontWeight: 600, marginBottom: '0.75rem'}}>
          Looker Studio embed URL is not set
        </p>
        <p style={{margin: 0, opacity: 0.75, lineHeight: 1.5}}>
          Add SANITY_STUDIO_LOOKER_EMBED_URL in your Studio environment (sanity.io project
          settings or local .env). Use a share or embed URL from Google Looker Studio. No backend
          proxy is required.
        </p>
      </div>
    )
  }

  return (
    <div style={iframeWrapStyle}>
      <iframe
        title="Looker Studio performance dashboard"
        src={embedUrl}
        style={{width: '100%', height: '100%', border: 0}}
        allow="fullscreen"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
