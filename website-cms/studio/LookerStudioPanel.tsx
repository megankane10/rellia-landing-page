import {LinkIcon} from '@sanity/icons'

const panelRootStyle: Record<string, string | number> = {
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  minHeight: 'calc(100dvh - 3rem)',
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--card-bg-color, #f8fafb)',
}

const toolbarStyle: Record<string, string | number> = {
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid var(--card-border-color, rgba(0,0,0,0.08))',
}

const openLinkStyle: Record<string, string | number> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.875rem',
  color: 'var(--brand-primary, #0D3540)',
  textDecoration: 'none',
}

const iframeWrapStyle: Record<string, string | number> = {
  flex: 1,
  minHeight: 0,
  position: 'relative',
}

const emptyStateStyle: Record<string, string | number> = {
  padding: '2rem 2.5rem',
  maxWidth: 560,
  lineHeight: 1.55,
}

export const LookerStudioPanel = () => {
  const envUrl = (process.env.SANITY_STUDIO_LOOKER_EMBED_URL || '').trim()

  if (!envUrl) {
    return (
      <div style={panelRootStyle}>
        <div style={emptyStateStyle}>
          <p style={{fontWeight: 600, fontSize: '1.125rem', margin: '0 0 0.75rem'}}>
            Looker Studio embed URL is not set
          </p>
          <p style={{margin: '0 0 1rem', opacity: 0.85}}>
            Please set the <code>SANITY_STUDIO_LOOKER_EMBED_URL</code> environment variable.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={panelRootStyle}>
      <div style={toolbarStyle}>
        <a href={envUrl} target="_blank" rel="noopener noreferrer" style={openLinkStyle}>
          <LinkIcon />
          Open in Looker Studio
        </a>
      </div>
      <div style={iframeWrapStyle}>
        <iframe
          title="Looker Studio performance dashboard"
          src={envUrl}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 0,
            display: 'block',
          }}
          allow="fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
