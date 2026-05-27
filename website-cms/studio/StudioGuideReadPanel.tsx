import {useEffect, useState} from 'react'
import {useClient} from 'sanity'

type GuideSection = {heading?: string; body?: string}

type StudioGuideDoc = {
  title?: string
  intro?: string
  sections?: GuideSection[]
}

const panelStyle: Record<string, string | number> = {
  boxSizing: 'border-box',
  width: '100%',
  minHeight: 'calc(100vh - 3.5rem)',
  padding: '2rem 2.5rem',
  maxWidth: 720,
  lineHeight: 1.6,
}

const cardStyle: Record<string, string | number> = {
  marginBottom: '1.25rem',
  padding: '1.25rem 1.5rem',
  borderRadius: 8,
  border: '1px solid rgba(0,0,0,0.08)',
  background: '#fff',
}

export const StudioGuideReadPanel = () => {
  const client = useClient({apiVersion: '2024-01-01'})
  const [doc, setDoc] = useState<StudioGuideDoc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    client
      .fetch<StudioGuideDoc>(
        `*[_id == "studioGuide"][0]{title, intro, sections[]{heading, body}}`,
      )
      .then((result) => {
        if (!cancelled) setDoc(result)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [client])

  if (loading) {
    return (
      <div style={panelStyle}>
        <p style={{opacity: 0.7}}>Loading guide…</p>
      </div>
    )
  }

  const title = doc?.title?.trim() || 'How to use this CMS'
  const sections = Array.isArray(doc?.sections) ? doc.sections : []

  return (
    <div style={panelStyle}>
      <h1 style={{fontSize: '1.5rem', fontWeight: 600, margin: '0 0 1rem'}}>{title}</h1>
      <p style={{margin: '0 0 1.5rem', opacity: 0.75, fontSize: '0.95rem'}}>
        Read-only view. To change this text, open <strong>Support → Edit guide content</strong> in the
        sidebar.
      </p>

      {doc?.intro?.trim() ? (
        <div style={{...cardStyle, background: '#f8fafb'}}>
          <p style={{margin: 0}}>{doc.intro}</p>
        </div>
      ) : null}

      {sections.length === 0 ? (
        <p style={{opacity: 0.7}}>No sections yet. Add content under Edit guide content.</p>
      ) : (
        sections.map((section, index) => (
          <div key={`${section.heading ?? 'section'}-${index}`} style={cardStyle}>
            <h2 style={{fontSize: '1.125rem', fontWeight: 600, margin: '0 0 0.75rem'}}>
              {section.heading || 'Section'}
            </h2>
            <p style={{margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.95rem'}}>{section.body || ''}</p>
          </div>
        ))
      )}
    </div>
  )
}
