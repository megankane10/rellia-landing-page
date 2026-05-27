/** Brand mark for Sanity Studio — bundled import so it works in sidebar, workspace list, and browser tab. */
import logoUrl from './favicon.png'

export const RelliaStudioIcon = () => (
  <img
    src={logoUrl}
    alt=""
    width={25}
    height={25}
    style={{display: 'block', borderRadius: 4, objectFit: 'contain'}}
  />
)
