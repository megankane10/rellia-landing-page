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
    <p style={headingStyle}>Publishing content</p>
    <p style={bodyStyle}>
      Edit in the preview dataset first. Open Presentation to preview changes on the staging site.
      When content is approved, publish documents in Studio, then promote to production using your
      team release process (pnpm sanity:promote).
    </p>
    <p style={headingStyle}>Preview vs live site</p>
    <p style={bodyStyle}>
      The preview dataset powers Vercel preview deployments and local dev. The production dataset
      powers www.relliahealth.com. Match the dataset to the environment you are testing.
    </p>
    <p style={headingStyle}>Visual editing (Presentation)</p>
    <p style={{margin: 0}}>
      Use Presentation after frontend section schemas are stable (Phase 5). It requires
      SANITY_STUDIO_PREVIEW_URL, SANITY_API_READ_TOKEN on the preview site, and matching dataset
      settings. See the repo README for the full checklist.
    </p>
  </div>
)
