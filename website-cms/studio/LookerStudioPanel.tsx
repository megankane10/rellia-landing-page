const embedUrl = (process.env.SANITY_STUDIO_LOOKER_EMBED_URL || '').trim()

const fullPageRoot: Record<string, string | number> = {
  boxSizing: 'border-box',
  width: '100%',
  minHeight: 'calc(100vh - 3.5rem)',
  display: 'flex',
  flexDirection: 'column',
  background: '#f8fafb',
}

const emptyState: Record<string, string | number> = {
  padding: '2rem 2.5rem',
  maxWidth: 560,
  lineHeight: 1.55,
}

const iframeWrapStyle: Record<string, string | number> = {
  flex: 1,
  width: '100%',
  minHeight: 'calc(100vh - 3.5rem)',
}

export const LookerStudioPanel = () => {
  if (!embedUrl) {
    return (
      <div style={fullPageRoot}>
        <div style={emptyState}>
          <p style={{fontWeight: 600, fontSize: '1.125rem', margin: '0 0 0.75rem'}}>
            Looker Studio embed URL is not set
          </p>
          <p style={{margin: 0, opacity: 0.8}}>
            Add <code style={{fontSize: '0.9em'}}>SANITY_STUDIO_LOOKER_EMBED_URL</code> in your
            Studio environment (sanity.io → Project → Settings → Environment variables, or{' '}
            <code>website-cms/.env</code> locally). In Looker Studio: Share → Embed report → copy
            the iframe <code>src</code> URL.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={fullPageRoot}>
      <div style={iframeWrapStyle}>
        <iframe
          title="Looker Studio performance dashboard"
          src={embedUrl}
          style={{width: '100%', height: '100%', border: 0, display: 'block'}}
          allow="fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
