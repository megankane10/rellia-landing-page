import {useEffect, useState} from 'react'
import {useClient} from 'sanity'

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

const LOOKER_QUERY = `*[_id == "siteSettings"][0].lookerStudioEmbedUrl`

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
      <div style={fullPageRoot}>
        <div style={emptyState}>
          <p style={{margin: 0, opacity: 0.7}}>Loading analytics…</p>
        </div>
      </div>
    )
  }

  if (!embedUrl) {
    return (
      <div style={fullPageRoot}>
        <div style={emptyState}>
          <p style={{fontWeight: 600, fontSize: '1.125rem', margin: '0 0 0.75rem'}}>
            Looker Studio embed URL is not set
          </p>
          <p style={{margin: '0 0 1rem', opacity: 0.85}}>
            Open <strong>Site → Site settings → Analytics (Studio)</strong> and paste the embed URL
            from Looker Studio (Share → Embed report → copy iframe <code>src</code>).
          </p>
          <p style={{margin: 0, opacity: 0.75, fontSize: '0.9rem'}}>
            For local Studio only, you can also set{' '}
            <code style={{fontSize: '0.9em'}}>SANITY_STUDIO_LOOKER_EMBED_URL</code> in{' '}
            <code>website-cms/.env</code>.
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
