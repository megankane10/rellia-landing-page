import {useEffect, useState} from 'react'
import {LinkIcon} from '@sanity/icons'
import {useClient} from 'sanity'

const LOOKER_QUERY = `*[_id == "siteSettings"][0].lookerStudioEmbedUrl`

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
  const client = useClient({apiVersion: '2024-01-01'})
  const [cmsUrl, setCmsUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    client
      .fetch<string | null>(LOOKER_QUERY)
      .then((url) => {
        if (!cancelled) setCmsUrl(typeof url === 'string' ? url : null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [client])

  const envUrl = (process.env.SANITY_STUDIO_LOOKER_EMBED_URL || '').trim()
  const embedUrl = (cmsUrl || envUrl).trim()

  if (loading) {
    return (
      <div style={{...panelRootStyle, alignItems: 'center', justifyContent: 'center'}}>
        <p style={{margin: 0, opacity: 0.7}}>Loading analytics…</p>
      </div>
    )
  }

  if (!embedUrl) {
    return (
      <div style={panelRootStyle}>
        <div style={emptyStateStyle}>
          <p style={{fontWeight: 600, fontSize: '1.125rem', margin: '0 0 0.75rem'}}>
            Looker Studio embed URL is not set
          </p>
          <p style={{margin: '0 0 1rem', opacity: 0.85}}>
            Open <strong>Site → Site settings → Analytics (Studio)</strong> and paste the embed URL
            from Looker Studio (Share → Embed report → copy iframe <code>src</code>).
          </p>
          <p style={{margin: 0, opacity: 0.75, fontSize: '0.9rem'}}>
            For local Studio only, set{' '}
            <code style={{fontSize: '0.9em'}}>SANITY_STUDIO_LOOKER_EMBED_URL</code> in{' '}
            <code>website-cms/.env</code>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={panelRootStyle}>
      <div style={toolbarStyle}>
        <a href={embedUrl} target="_blank" rel="noopener noreferrer" style={openLinkStyle}>
          <LinkIcon />
          Open in Looker Studio
        </a>
      </div>
      <div style={iframeWrapStyle}>
        <iframe
          title="Looker Studio performance dashboard"
          src={embedUrl}
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
