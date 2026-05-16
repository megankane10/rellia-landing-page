/**
 * Brand SVG logos from Simple Icons (pinned npm package on unpkg — stable paths; `cdn.simpleicons.org`
 * was returning 404 for several slugs).
 * Illustrative placeholders only; not an endorsement or affiliation claim.
 */
const SI_V = "9.0.0"
const si = (slug: string) => `https://unpkg.com/simple-icons@${SI_V}/icons/${slug}.svg`

export const INVESTOR_BRAND_SVG_MARKS = [
  { name: "Google", src: si("google") },
  { name: "Microsoft", src: si("microsoft") },
  { name: "Amazon", src: si("amazon") },
  { name: "Apple", src: si("apple") },
  { name: "Meta", src: si("meta") },
  { name: "IBM", src: si("ibm") },
  { name: "Oracle", src: si("oracle") },
  { name: "Salesforce", src: si("salesforce") },
  { name: "Siemens", src: si("siemens") },
  { name: "Intel", src: si("intel") },
] as const

/** Exported for founder directory cards and other reuse */
export const PORTFOLIO_LOGO_MARKS = [
  { name: "Akesyn", src: "/images/portfolio-akesyn.png" },
  { name: "CarePathStudio", src: "/images/portfolio-carepathstudio.png" },
  { name: "Dott", src: "/images/portfolio-dott.png" },
  { name: "GeoClaim", src: "/images/portfolio-geoclaim.png" },
  { name: "Glowlytics", src: "/images/portfolio-glowtylics.png" },
  { name: "HealCycle", src: "/images/portfolio-healcycle.png" },
  { name: "MEA", src: "/images/portfolio-mea.png" },
  { name: "Miraei", src: "/images/portfolio-miraei.png" },
  { name: "MyLigo", src: "/images/portfolio-myligo.png" },
  { name: "Neuromod", src: "/images/portfolio-neuromod.png" },
  { name: "Newgen", src: "/images/portfolio-newgen.png" },
  { name: "Patient Companion", src: "/images/portfolio-patientcompanion.png" },
  { name: "POP", src: "/images/portfolio-pop.png" },
  { name: "Restore", src: "/images/portfolio-restore.png" },
  { name: "Salve Therapeutics", src: "/images/portfolio-salvetherapeutics.png" },
  { name: "SeeMira", src: "/images/portfolio-seemira.png" },
] as const
