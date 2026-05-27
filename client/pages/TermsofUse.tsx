import { useTermsPage } from "@/hooks/useCmsDocuments"
import { LegalDocumentPage } from "@/pages/LegalDocumentPage"
import {
  TERMS_EFFECTIVE_DATE,
  TERMS_PAGE_INTRO,
  TERMS_SECTIONS,
} from "@shared/cms/legal/termsSections"
import { legalSectionsToPortableText } from "@shared/cms/legal/sectionsToPortableText"

const DEFAULT_TERMS_BODY = legalSectionsToPortableText(TERMS_SECTIONS)

export default function Terms() {
  const termsQuery = useTermsPage()

  return (
    <LegalDocumentPage
      headerTitle="Terms of Use"
      defaultIntro={TERMS_PAGE_INTRO}
      defaultEffectiveDate={TERMS_EFFECTIVE_DATE}
      defaultBody={DEFAULT_TERMS_BODY}
      query={termsQuery}
    />
  )
}
