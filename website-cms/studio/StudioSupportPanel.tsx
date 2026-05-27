const panelStyle: Record<string, string | number> = {
  padding: '1.5rem',
  maxWidth: 640,
  lineHeight: 1.55,
}

const headingStyle: Record<string, string | number> = {
  fontWeight: 600,
  margin: '0 0 0.5rem',
}

const bodyStyle: Record<string, string | number> = {
  margin: '0 0 1.25rem',
}

export const StudioSupportPanel = () => (
  <div style={panelStyle}>
    <p style={headingStyle}>SEO in Studio</p>
    <p style={bodyStyle}>
      Each page has an SEO tab with live Google preview (free). Ignore SEO Health Dashboard — it
      requires a paid license and is turned off. Use the per-document SEO fields instead.
    </p>
    <p style={headingStyle}>Looker Studio analytics</p>
    <p style={bodyStyle}>
      Open Analytics → Performance dashboard. Set{' '}
      <code style={{fontSize: '0.9em'}}>SANITY_STUDIO_LOOKER_EMBED_URL</code> in your Studio env
      (sanity.io → Project → API → Environment variables, or <code>website-cms/.env</code> locally)
      to the embed URL from Looker Studio: Share → Embed report → copy the iframe{' '}
      <code>src</code>. No backend proxy needed.
    </p>
    <p style={headingStyle}>Publishing content</p>
    <p style={bodyStyle}>
      Edit in the preview dataset first. When content is approved, publish in Studio, then promote
      to production (<code>pnpm sanity:promote</code>).
    </p>
    <p style={headingStyle}>Visual editing (Presentation)</p>
    <p style={{margin: 0}}>
      Presentation needs the preview site running with draft mode and a read token. On Vercel
      Preview, set <code>SANITY_API_READ_TOKEN</code> and <code>SANITY_STUDIO_URL</code>. In Studio
      env set <code>SANITY_STUDIO_PREVIEW_URL</code> to your preview origin (e.g.{' '}
      <code>https://relliahealth.vercel.app</code> or <code>http://localhost:5173</code> for local).
      WebSocket warnings in the console are often harmless; if the iframe says “Unable to connect
      to visual editing”, open the preview URL in a new tab once to set the draft cookie, then
      reload Presentation.
    </p>
  </div>
)
