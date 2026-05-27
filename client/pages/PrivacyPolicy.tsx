import { usePrivacyPage } from "@/hooks/useCmsDocuments"
import { LegalDocumentPage } from "@/pages/LegalDocumentPage"
import { legalSectionsToPortableText } from "@shared/cms/legal/sectionsToPortableText"
import {
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_LEGAL_NOTICE,
  PRIVACY_PAGE_INTRO,
  PRIVACY_SECTIONS,
} from "@shared/cms/legal/privacySections"

const DEFAULT_PRIVACY_BODY = legalSectionsToPortableText(PRIVACY_SECTIONS)

export default function PrivacyPolicy() {
  const privacyQuery = usePrivacyPage()

  return (
    <LegalDocumentPage
      headerTitle="Privacy Policy"
      defaultIntro={PRIVACY_PAGE_INTRO}
      defaultEffectiveDate={PRIVACY_EFFECTIVE_DATE}
      defaultLegalNotice={PRIVACY_LEGAL_NOTICE}
      defaultBody={DEFAULT_PRIVACY_BODY}
      query={privacyQuery}
    />
  )
}
